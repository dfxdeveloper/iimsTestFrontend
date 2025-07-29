import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "../../../services/context/location";
import { showToast } from "../../../services/config/toast";
import { Toaster } from "react-hot-toast";
import { api } from "../../../services/config/axiosInstance";
import { generateCompanyCode } from "../../../utils/companyCodeGenerator";

const AddCompany = ({
  onClose,
  onSuccess,
  editMode = false,
  companyData: initialCompanyData,
  onIndustrySelect,
  selectedIndustryId, 
}) => {
  const [numberOfPlants, setNumberOfPlants] = useState(
    initialCompanyData?.plants?.length || 0
  );
  const [plantFields, setPlantFields] = useState(
    initialCompanyData?.plants?.map((plant, index) => ({
      id: plant.id || index + 1,
      name: plant.plantName || "",
      code: plant.plantCode || "",
    })) || []
  );
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(initialCompanyData?.logoImageUrl || null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [industries, setIndustries] = useState([]);
  const [count, setCount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(
    initialCompanyData?.subscriptionEndDate || ""
  );
  const { countries, states, cities, fetchStates, fetchCities } = useLocation();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [companyData, setCompanyData] = useState(() => ({
    companyName: initialCompanyData?.companyName || "",
    companyCode: initialCompanyData?.companyCode || "",
    industry: initialCompanyData?.industry || "",
    industryName: initialCompanyData?.industryName || "",
    companyMailId: initialCompanyData?.companyMailId || "",
    address1: initialCompanyData?.address1 || "",
    address2: initialCompanyData?.address2 || "",
    country: initialCompanyData?.country || "",
    state: initialCompanyData?.state || "",
    city: initialCompanyData?.city || "",
    pinCode: initialCompanyData?.pinCode || "",
    noOfEmployees: initialCompanyData?.noOfEmployees || "",
    gst: initialCompanyData?.gst || "",
  }));

  const fileInputRef = useRef(null);
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);

  useEffect(() => {
    if (selectedIndustryId && selectedIndustryId !== companyData.industry) {
      const selectedIndustry = industries.find(
        (industry) => industry._id === selectedIndustryId
      );
      const newIndustryName = selectedIndustry ? selectedIndustry.name : "";
      setCompanyData((prev) => ({
        ...prev,
        industry: selectedIndustryId,
        industryName: newIndustryName,
      }));
    }
  }, [selectedIndustryId, industries, companyData.industry])

  useEffect(() => {
    if (initialCompanyData?.country && countries.length > 0) {
      const countryObject = countries.find(
        (country) => country.name === initialCompanyData.country
      );
      if (countryObject) {
        setSelectedCountry(countryObject);
        setCompanyData((prev) => ({
          ...prev,
          country: initialCompanyData.country,
        }));
        fetchStates(countryObject.iso2);
      }
    }
  }, [initialCompanyData?.country, countries, fetchStates]);

  useEffect(() => {
    if (
      initialCompanyData?.state &&
      states.length > 0 &&
      selectedCountry &&
      !selectedState
    ) {
      const stateObject = states.find(
        (state) => state.name === initialCompanyData.state
      );
      if (stateObject) {
        setSelectedState(stateObject);
        setCompanyData((prev) => ({
          ...prev,
          state: initialCompanyData.state,
        }));
        fetchCities(selectedCountry.iso2, stateObject.iso2);
      }
    }
  }, [initialCompanyData?.state, states, selectedCountry, fetchCities]);

  useEffect(() => {
    if (initialCompanyData?.city && cities.length > 0) {
      setCompanyData((prev) => ({
        ...prev,
        city: initialCompanyData.city,
      }));
    }
  }, [initialCompanyData?.city, cities]);

  useEffect(() => {
    if (initialCompanyData?.subscriptionEndDate) {
      const end = new Date(initialCompanyData.subscriptionEndDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (end > today) {
        const start = new Date(initialCompanyData.subscriptionStartDate || today);
        setStartDate(start.toISOString().split("T")[0]);
        const timeDifference = end.getTime() - start.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
        const calculatedMonths = Math.ceil(daysDifference / 30);
        setCount(calculatedMonths);
        setEndDate(end.toISOString().split("T")[0]);
      } else {
        setStartDate(today.toISOString().split("T")[0]);
        setEndDate("");
        setCount(0);
      }
    } else if (!editMode) {
      const today = new Date();
      setStartDate(today.toISOString().split("T")[0]);
    }
  }, [initialCompanyData?.subscriptionEndDate, initialCompanyData?.subscriptionStartDate, editMode]);

  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry.iso2);
      setCompanyData((prev) => ({
        ...prev,
        state: "",
        city: "",
      }));
      setSelectedState(null);
    }
  }, [selectedCountry, fetchStates]);


  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetchCities(selectedCountry.iso2, selectedState.iso2);
      setCompanyData((prev) => ({
        ...prev,
        city: "",
      }));
    }
  }, [selectedCountry, selectedState, fetchCities]);

  useEffect(() => {
    if (count > 0 && startDate) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + count * 30);
      setEndDate(end.toISOString().split("T")[0]);
    } else if (count === 0 && !initialCompanyData?.subscriptionEndDate) {
      setEndDate("");
    }
  }, [count, startDate, initialCompanyData?.subscriptionEndDate]);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setLoading(true);
        const response = await api.get("/industry-modules");
        setIndustries(response.data);
      } catch (error) {
        console.error("Error fetching industries:", error);
        showToast.error("Failed to fetch industries");
      } finally {
        setLoading(false);
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    if (editMode && initialCompanyData?.industry && industries.length > 0) {
      const selectedIndustry = industries.find(
        (industry) => industry._id === initialCompanyData.industry
      );
      setCompanyData((prev) => ({
        ...prev,
        industry: initialCompanyData.industry,
        industryName: selectedIndustry ? selectedIndustry.name : "",
      }));
      if (onIndustrySelect) {
        onIndustrySelect(initialCompanyData.industry);
      }
    }
  }, [editMode, initialCompanyData?.industry, industries, onIndustrySelect]);

  const validateStartDate = (newDate) => {
    if (count === 0) {
      const selectedDate = new Date(newDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return false;
      }
      return true;
    }
    return true;
  };

  const validateEndDate = (newDate) => {
    if (count === 0 && startDate) {
      const start = new Date(startDate);
      const end = new Date(newDate);

      if (end <= start) {
        showToast.error("End date must be after start date");
        return false;
      }
      return true;
    }
    return true;
  };

  const handleCountChange = (newCount) => {
    if (newCount < 0) return;

    setCount(newCount);

    if (newCount === 0) {
      setEndDate("");
    } else if (startDate) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + newCount * 30);
      setEndDate(end.toISOString().split("T")[0]);
    }
  };

  const handleIndustryChange = (industryId) => {
    const selectedIndustry = industries.find(
      (industry) => industry._id === industryId
    );
    const newIndustryName = selectedIndustry ? selectedIndustry.name : "";
    setCompanyData((prev) => {
      const newState = {
        ...prev,
        industry: industryId,
        industryName: newIndustryName,
      };
      return newState;
    });
    setIsIndustryOpen(false);
    if (errors.industry) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.industry;
        return newErrors;
      });
    }
    if (onIndustrySelect && industryId) {
      onIndustrySelect(industryId);
    }
  };

  const handleStartDateChange = (e) => {
    const newDate = e.target.value;

    if (validateStartDate(newDate)) {
      setStartDate(newDate);

      if (count > 0) {
        const start = new Date(newDate);
        const end = new Date(start);
        end.setDate(start.getDate() + count * 30);
        setEndDate(end.toISOString().split("T")[0]);
      } else {
        if (endDate) {
          const end = new Date(endDate);
          const start = new Date(newDate);
          if (end <= start) {
            setEndDate("");
          }
        }
      }
    }
  };

  const handleEndDateChange = (e) => {
    const newDate = e.target.value;

    if (validateEndDate(newDate)) {
      setEndDate(newDate);
      if (startDate) {
        const start = new Date(startDate);
        const end = new Date(newDate);
        const timeDifference = end.getTime() - start.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
        const calculatedMonths = Math.ceil(daysDifference / 30);
        setCount(calculatedMonths);
      }
    }
  };

  const handleAddPlants = () => {
    const currentCount = plantFields.length;

    if (numberOfPlants > currentCount) {
      const plantsToAdd = numberOfPlants - currentCount;
      const highestId =
        plantFields.length > 0
          ? Math.max(...plantFields.map((plant) => plant.id))
          : 0;

      const newPlantFields = Array.from(
        { length: plantsToAdd },
        (_, index) => ({
          id: highestId + index + 1,
          name: "",
          code: "",
        })
      );

      setPlantFields([...plantFields, ...newPlantFields]);
    } else if (numberOfPlants < currentCount) {
      const updatedPlants = plantFields.slice(0, numberOfPlants);
      setPlantFields(updatedPlants);
    }
  };

  const handleRemovePlant = (id) => {
    const updatedPlants = plantFields.filter((plant) => plant.id !== id);
    setPlantFields(updatedPlants);
    setNumberOfPlants(updatedPlants.length);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "image/svg+xml",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    if (!validTypes.includes(file.type)) {
      showToast.error("Please upload only SVG, PNG, or JPG files.");
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast.error("File size should not exceed 2MB.");
      return;
    }

    setLogo(file);

    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];

      const validTypes = [
        "image/svg+xml",
        "image/png",
        "image/jpeg",
        "image/jpg",
      ];
      if (!validTypes.includes(file.type)) {
        showToast.error("Please upload only SVG, PNG, or JPG files.");
        return;
      }

      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        showToast.error("File size should not exceed 2MB.");
        return;
      }

      setLogo(file);

      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogoToS3 = async (uploadUrl, file) => {
    try {
      setUploading(true);
      await api.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
    } catch (err) {
      console.error("Upload error:", err);
      showToast.error("Logo upload failed. See console for more details.");
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    const validateForm = () => {
      const newErrors = {};
      const requiredFields = [
        "companyName",
        "industry",
        "companyMailId",
        "address1",
        "country",
        "pinCode",
        "noOfEmployees",
        "gst",
      ];

      requiredFields.forEach((field) => {
        const value = companyData[field];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          newErrors[field] = `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required`;
        }
      });

      if (numberOfPlants <= 0) {
        newErrors.numberOfPlants = "Number of plants is required";
      } else {
        const missingPlantInfo = plantFields.some(
          (plant) => !plant.name.trim() || !plant.code.trim()
        );
        if (missingPlantInfo) {
          newErrors.plantFields = "All plant names and codes are required";
        }
      }

      if (count === 0) {
        if (!startDate) {
          newErrors.startDate = "Start date is required";
        }
        if (!endDate) {
          newErrors.endDate = "End date is required";
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    if (!validateForm()) {
      showToast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);

      const generatedCode = generateCompanyCode(companyData.companyName);

      const plants = plantFields.map((plant) => ({
        plantCode: plant.code.trim(),
        plantName: plant.name.trim(),
      }));

      const payload = {
        companyName: companyData.companyName.trim(),
        companyCode: generatedCode,
        industry: companyData.industry,
        companyMailId: companyData.companyMailId.trim(),
        address1: companyData.address1.trim(),
        address2: companyData.address2 ? companyData.address2.trim() : "",
        country: companyData.country,
        state: companyData.state,
        city: companyData.city,
        pinCode: companyData.pinCode.trim(),
        noOfEmployees: parseInt(companyData.noOfEmployees, 10),
        gst: companyData.gst.trim().toUpperCase(),
        numberOfPlants: numberOfPlants,
        plants: plants,
        subscriptionCount: count,
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,
      };

      if (logo && logoPreview !== initialCompanyData?.logoImageUrl) {
        payload.logoImage = {
          fileName: logo.name,
          fileType: logo.type,
        };
      }

      let response;
      if (editMode) {
        response = await api.put(
          `/companies/${initialCompanyData._id}`,
          payload
        );
        showToast.success("Company updated successfully!");
      } else {
        response = await api.post("/companies", payload);
        showToast.success("Company added successfully!");
      }

      if (logo && logoPreview !== initialCompanyData?.logoImageUrl && response.data?.uploadUrl) {
        await uploadLogoToS3(response.data.uploadUrl, logo);
      }

      if (!editMode) {
        setCompanyData({
          companyName: "",
          industry: "",
          companyMailId: "",
          address1: "",
          address2: "",
          country: "",
          state: "",
          city: "",
          pinCode: "",
          noOfEmployees: "",
          gst: "",
        });
        setPlantFields([]);
        setNumberOfPlants(0);
        setStartDate("");
        setEndDate("");
        setCount(0);
        setLogo(null);
        setLogoPreview(null);
      }

      setErrors({});

      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(response);
      }

      if (onClose && typeof onClose === "function") {
        onClose();
      }
    } catch (error) {
      console.error("Form error:", error);
      showToast.error(
        error.response?.data?.message ||
          "Failed to submit form. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyDataChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCountryChange = (e) => {
    const selectedCountryName = e.target.value;
    const countryObject = countries.find(
      (country) => country.name === selectedCountryName
    );

    setSelectedCountry(countryObject || null);

    setCompanyData((prevState) => ({
      ...prevState,
      country: selectedCountryName,
      state: "",
      city: "",
    }));

    setSelectedState(null);

    if (errors.country) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.country;
        return newErrors;
      });
    }
  };

  const handleStateChange = (e) => {
    const selectedStateName = e.target.value;
    const stateObject = states.find(
      (state) => state.name === selectedStateName
    );

    setSelectedState(stateObject || null);

    setCompanyData((prevState) => ({
      ...prevState,
      state: selectedStateName,
      city: "",
    }));

    if (errors.state) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.state;
        return newErrors;
      });
    }
  };

  const handleCityChange = (e) => {
    const selectedCityName = e.target.value;

    setCompanyData((prevState) => ({
      ...prevState,
      city: selectedCityName,
    }));

    if (errors.city) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.city;
        return newErrors;
      });
    }
  };

  const renderPlantFields = () => {
    return (
      <div className="col-span-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-[#424955] font-inter">
            Plant Information
          </h2>
        </div>

        <div
          className="overflow-y-auto border border-gray-200 rounded"
          style={{ height: "285px", maxHeight: "285px" }}
        >
          {plantFields.map((plant, index) => {
            const serialNumber = `SN-${String(index + 1).padStart(2, "0")}`;
            return (
              <div
                key={plant.id}
                className="p-3 border-b border-gray-200 last:border-b-0"
              >
                <div className="flex justify-between items-center mb-2">
                  <label
                    className="block text-sm font-medium text-white bg-gray-800 px-2 py-1 rounded"
                  >
                    {serialNumber}
                  </label>
                  <button
                    onClick={() => handleRemovePlant(plant.id)}
                    className="text-red-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Plant name here"
                    className="w-full px-3 py-2 bg-[#F3F4F6] rounded border border-gray-200 text-sm"
                    value={plant.name}
                    onChange={(e) => {
                      const updatedPlants = plantFields.map((p) =>
                        p.id === plant.id ? { ...p, name: e.target.value } : p
                      );
                      setPlantFields(updatedPlants);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Plant code here"
                    className="w-full px-3 py-2 bg-[#F3F4F6] rounded border border-gray-200 text-sm"
                    value={plant.code}
                    onChange={(e) => {
                      const updatedPlants = plantFields.map((p) =>
                        p.id === plant.id ? { ...p, code: e.target.value } : p
                      );
                      setPlantFields(updatedPlants);
                    }}
                  />
                </div>
              </div>
            );
          })}

          {plantFields.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No plants added yet
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderInput = (name, label, type = "text", placeholder = "") => {
    return (
      <div>
        <label className="block text-sm font-semibold font-inter text-[#424955] mb-2">
          {label}
        </label>
        <input
          type={type}
          name={name}
          placeholder={placeholder || label}
          value={companyData[name]}
          onChange={handleCompanyDataChange}
          className={`w-full px-3 py-2 bg-[#F3F4F6] rounded border ${
            errors[name] ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors[name] && (
          <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
        )}
      </div>
    );
  };

  const renderLocationSelect = (
    name,
    label,
    options,
    handler,
    disabled = false
  ) => {
    return (
      <div>
        <label className="block text-sm font-inter font-semibold text-[#424955] mb-2">
          {label}
        </label>
        <div className="relative">
          <select
            name={name}
            value={companyData[name] || ""}
            onChange={handler}
            disabled={disabled}
            className={`w-full px-3 py-2 bg-[#F3F4F6] rounded border ${
              errors[name] ? "border-red-500" : "border-gray-200"
            } appearance-none`}
          >
            <option value="">Select {label}</option>
            {options &&
              options.map((option) => (
                <option key={option.id} value={option.name}>
                  {option.name}
                </option>
              ))}
          </select>
          {errors[name] && (
            <p className="text-red-500 text-xs mt-1">{errors[name]}</p>
          )}
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Toaster />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {renderInput("companyName", "Company name")}
          {renderInput("companyMailId", "Mail Id", "email", "Mail Id here")}
          {renderInput("address2", "Address 2", "text", "Address here")}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderLocationSelect(
              "city",
              "City",
              cities,
              handleCityChange,
              !selectedState
            )}
            {renderInput("pinCode", "PIN Code", "text", "PIN here")}
          </div>
          {renderInput("gst", "GST", "text", "GST here")}

          <div>
            <label className="block text-sm text-[#424955] font-semibold font-inter mb-2">
              Subscription
            </label>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <span className="text-sm text-[#8B8B8B] font-medium mr-2">
                  Select Month:
                </span>
                <div className="flex items-center">
                  <button
                    className="px-3 py-1 bg-[#A8A8A8] rounded-lg text-lg text-[#DCDCDC]"
                    onClick={() => handleCountChange(Math.max(0, count - 1))}
                  >
                    -
                  </button>
                  <div className="w-8 h-8 flex items-center justify-center bg-[#F3F4F6] text-[#000000]">
                    {count}
                  </div>
                  <button
                    className="px-3 py-1 bg-[#A8A8A8] rounded-lg text-lg text-[#DCDCDC]"
                    onClick={() => handleCountChange(count + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex items-center">
                  <input
                    type="date"
                    className={`w-full px-3 py-2 bg-[#F3F4F6] rounded border ${
                      errors.startDate ? "border-red-500" : "border-gray-300"
                    } rounded ${count > 0 ? "bg-gray-100" : ""}`}
                    value={startDate}
                    onChange={handleStartDateChange}
                    readOnly={count > 0}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs absolute mt-8">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div className="mx-2 text-[#8B8B8B]">to</div>
                <div className="flex items-center">
                  <input
                    type="date"
                    className={`w-full px-3 py-2 bg-[#F3F4F6] rounded border ${
                      errors.endDate ? "border-red-500" : "border-gray-300"
                    } rounded ${count > 0 ? "bg-gray-100" : ""}`}
                    value={endDate}
                    onChange={handleEndDateChange}
                    readOnly={count > 0}
                    min={startDate}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs absolute mt-8">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
              {count > 0 && (
                <p className="text-md font-medium font-inter text-green-600">
                  Subscription set for {count} month{count > 1 ? "s" : ""} (
                  {count * 30} days)
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#424955] font-semibold font-inter mb-2">
              Logo image
            </label>
            <div
              className="border border-[#2B86AA] bg-[#F3F4F6] border-dashed rounded p-6"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {initialCompanyData?.logoImageUrl && !logo ? (
                <div className="flex items-center">
                  <img
                    src={initialCompanyData.logoImageUrl}
                    alt="Existing Logo Preview"
                    className="h-24 w-auto mr-8 object-contain"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium font-inter text-gray-700">
                      Existing Logo
                    </p>
                    <button
                      className="mt-3 bg-[#2B86AA] text-white rounded px-4 py-1.5 text-sm"
                      onClick={handleBrowseClick}
                    >
                      Change File
                    </button>
                  </div>
                </div>
              ) : logoPreview ? (
                <div className="flex items-center">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="h-24 w-auto mr-8 object-contain"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-medium font-inter text-gray-700">
                      {logo?.name}
                    </p>
                    <button
                      className="mt-3 bg-[#2B86AA] text-white rounded px-4 py-1.5 text-sm"
                      onClick={handleBrowseClick}
                    >
                      Change File
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex">
                  <div className="mr-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-[#2B86AA]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-medium mb-1">
                      Drop file or browse
                    </p>
                    <p className="text-sm text-[#6C606C] font-medium font-inter mb-3">
                      Format: .svg, .png, .jpg & Max file size: 2 MB
                    </p>
                    <button
                      className="bg-[#2B86AA] text-white rounded-lg px-5 py-2 text-md font-inter font-medium"
                      onClick={handleBrowseClick}
                    >
                      Browse Files
                    </button>
                  </div>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".svg,.png,.jpg,.jpeg"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-inter font-semibold text-[#424955] mb-2">
              Industry
            </label>
            <div className="relative">
              <div
                className={`w-full px-3 py-2 bg-[#F3F4F6] rounded border ${
                  errors.industry ? "border-red-500" : "border-gray-200"
                } flex items-center justify-between cursor-pointer`}
                onClick={() => {
                  setIsIndustryOpen(!isIndustryOpen);
                }}
              >
                <span className="text-sm">
                  {companyData.industryName || "Select here"}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transform ${
                    isIndustryOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
              {isIndustryOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {industries.length > 0 ? (
                    industries.map((industry) => (
                      <div
                        key={industry._id}
                        className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleIndustryChange(industry._id);
                        }}
                      >
                        {industry.name}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-400">
                      Loading industries...
                    </div>
                  )}
                </div>
              )}
              {errors.industry && (
                <p className="text-red-500 text-xs mt-1">{errors.industry}</p>
              )}
            </div>
          </div>

          {renderInput("address1", "Address 1", "text", "Address here")}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderLocationSelect(
              "country",
              "Country",
              countries,
              handleCountryChange
            )}
            {renderLocationSelect(
              "state",
              "State",
              states,
              handleStateChange,
              !selectedCountry
            )}
          </div>
          {renderInput(
            "noOfEmployees",
            "Total no. of users",
            "number",
            "number of users"
          )}

          <div>
            <label className="block text-sm font-semibold text-[#424955] font-inter mb-2">
              Number of plants
            </label>
            <div className="flex flex-col">
              <div className="flex">
                <input
                  type="number"
                  placeholder="Number of plants here"
                  className={`flex-1 px-3 py-2 bg-[#F3F4F6] rounded-l border ${
                    errors.numberOfPlants ? "border-red-500" : "border-gray-200"
                  }`}
                  value={numberOfPlants}
                  onChange={(e) =>
                    setNumberOfPlants(parseInt(e.target.value) || 0)
                  }
                />
                <button
                  className="bg-[#2B86AA] text-white px-4 py-2 rounded-r"
                  onClick={handleAddPlants}
                >
                  Add
                </button>
              </div>
              {errors.numberOfPlants && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.numberOfPlants}
                </p>
              )}
            </div>
          </div>

          {renderPlantFields()}
        </div>
      </div>

      <div className="flex justify-end mt-8 space-x-4">
        <button
          className="bg-[#F2F2FD] text-[#2B86AA] font-inter font-medium px-6 py-2 rounded-lg"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="bg-[#2B86AA] text-white border font-inter font-medium border-[#636AE8] px-6 py-2 rounded-lg"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default AddCompany;