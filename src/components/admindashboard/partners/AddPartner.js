import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { showToast, toastCustomConfig } from "../../../services/config/toast";
import { useLocation } from "../../../services/context/location";
import { api } from "../../../services/config/axiosInstance";
import Loader from "../../../common/Loader";

const CreatePartner = ({
  onClose,
  onSuccess,
  editMode = false,
  partnerData = null,
}) => {
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const departmentName = userData.department;
  const { countries, states, cities, fetchStates, fetchCities } = useLocation();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    clientName: "",
    address1: "",
    address2: "",
    address3: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    email: "",
    contactPerson: "",
    landline: "",
    mobile: "",
    gstNumber: "",
    department: departmentName,
    customerCode: "",
  });

  const handleCancel = async () => {
    if (onClose) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
      onClose();
    }
  };

  useEffect(() => {
    if (editMode && partnerData) {
      setFormData((prevData) => ({
        ...prevData,
        type: partnerData.type || "",
        clientName: partnerData.clientName || "",
        address1: partnerData.address1 || "",
        address2: partnerData.address2 || "",
        address3: partnerData.address3 || "",
        city: partnerData.city || "",
        state: partnerData.state || "",
        country: partnerData.country || "",
        pinCode: partnerData.pinCode || "",
        email: partnerData.email || "",
        contactPerson: partnerData.contactPerson || "",
        landline: partnerData.landline || "",
        mobile: partnerData.mobile || "",
        gstNumber: partnerData.gstNumber || "",
        department: departmentName,
        customerCode: partnerData.customerCode || "",
      }));

      // Set selected country when in edit mode
      if (partnerData.country) {
        const countryObj = countries.find(
          (country) => country.name === partnerData.country
        );
        setSelectedCountry(countryObj || null);
      }
    }
  }, [editMode, partnerData, departmentName, countries]);

  // Effect for fetching states when country changes or in edit mode
  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry.iso2);

      // Only reset state and city if we're not in edit mode or setting initial data
      if (!editMode || !partnerData?.state) {
        setFormData((prev) => ({
          ...prev,
          state: "",
          city: "",
        }));
        setSelectedState(null);
      }
    }
  }, [selectedCountry, fetchStates, editMode, partnerData]);

  // Effect to set state after states are fetched in edit mode
  useEffect(() => {
    if (
      editMode &&
      partnerData?.state &&
      selectedCountry &&
      states.length > 0
    ) {
      const stateObj = states.find((state) => state.name === partnerData.state);
      if (stateObj) {
        setSelectedState(stateObj);
      }
    }
  }, [editMode, partnerData, selectedCountry, states]);

  // Effect for fetching cities when state changes or in edit mode
  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetchCities(selectedCountry.iso2, selectedState.iso2);

      // Only reset city if we're not in edit mode or setting initial data
      if (!editMode || !partnerData?.city) {
        setFormData((prev) => ({
          ...prev,
          city: "",
        }));
      }
    }
  }, [selectedCountry, selectedState, fetchCities, editMode, partnerData]);

  const capitalizeFirstLetter = (str) => {
    if (!str) return str;
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "type",
      "clientName",
      "email",
      "address1",
      "country",
      "state",
      "city",
      "pinCode",
      "contactPerson",
      "mobile",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() +
          field.slice(1).replace(/([A-Z])/g, " $1")
        } is required`;
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (formData.pinCode && !/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "Please enter a valid 6-digit PIN code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTypeChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error for this field if it exists
    if (errors.type) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.type;
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

    setFormData((prevState) => ({
      ...prevState,
      country: selectedCountryName,
      state: "",
      city: "",
    }));

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

    setFormData((prevState) => ({
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

    setFormData((prevState) => ({
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

  const SearchableSelect = (
    name,
    label,
    options,
    handler,
    disabled = false
  ) => {
    return (
      <div className="relative">
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <select
          id={name}
          name={name}
          value={formData[name]}
          onChange={handler}
          disabled={disabled}
          className={`w-full px-4 py-3 bg-[#F1FBFF] border ${
            errors[name] ? "border-red-500" : "border-[#ABE7FF]"
          } rounded-md text-gray-700 appearance-none`}
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
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none mt-6">
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
    );
  };

  const generateTempCustomerCode = () => {
    // Simple function to generate a temporary customer code
    // Format: TYPE-TIMESTAMP (e.g., VEN-12345 or CUS-67890)
    const prefix = formData.type.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-5);
    return `${prefix}-${timestamp}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateForm()) {
      return;
    }
    const dataToSubmit = {
      ...formData,
      customerCode: formData.customerCode || generateTempCustomerCode(),
    };

    try {
      if (editMode) {
        await showToast.promise(
          api.put(`/partners/${partnerData._id}`, dataToSubmit),
          {
            loading: "Updating partner details...",
            success: "Partner updated successfully! 🎉",
            error: (error) =>
              `Failed to update partner: ${
                error.response?.data?.message || "Unknown error"
              }`,
          }
        );
      } else {
        await showToast.promise(api.post("/partners", dataToSubmit), {
          loading: "Adding new partner...",
          success: "Partner added successfully! 🎉",
          error: (error) =>
            `Failed to add partner: ${
              error.response?.data?.message || "Unknown error"
            }`,
        });
      }

      if (onSuccess) {
        onSuccess();
      }
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Form submission error:", error);
    }
    finally{
      setIsLoading(false)
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full mx-auto p-4">
        <Toaster {...toastCustomConfig} />

        <div>
          <h1 className="text-2xl font-medium text-gray-800 mb-6">
            {editMode ? "Edit Partner" : "Create Partner"}
          </h1>
          <form
            onSubmit={handleSubmit}
            className="border border-[#2B86AA] rounded-md p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Type of Partners */}
              <div>
                <label
                  htmlFor="type"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Type of Partners
                </label>
                <div className="relative">
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleTypeChange}
                    className={`w-full px-4 py-3 bg-[#F1FBFF] border appearance-none rounded-md text-gray-700 ${
                      errors.type ? "border-red-500" : "border-[#ABE7FF]"
                    }`}
                  >
                    <option value="">Select Type</option>
                    <option value="vendor">Vendor</option>
                    <option value="customer">Customer</option>
                  </select>
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
                  {errors.type && (
                    <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                  )}
                </div>
              </div>

              {/* Client Name */}
              <div>
                <label
                  htmlFor="clientName"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Client Name
                </label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="Enter client name"
                  className={`w-full px-4 py-3 bg-[#F1FBFF] border rounded-md text-gray-700 ${
                    errors.clientName ? "border-red-500" : "border-[#ABE7FF]"
                  }`}
                />
                {errors.clientName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.clientName}
                  </p>
                )}
              </div>

              {/* Address 1 */}
              <div>
                <label
                  htmlFor="address1"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Address 1
                </label>
                <input
                  type="text"
                  id="address1"
                  name="address1"
                  value={formData.address1}
                  onChange={handleInputChange}
                  placeholder="Enter address line 1"
                  className={`w-full px-4 py-3 bg-[#F1FBFF] border rounded-md text-gray-700 ${
                    errors.address1 ? "border-red-500" : "border-[#ABE7FF]"
                  }`}
                />
                {errors.address1 && (
                  <p className="text-red-500 text-xs mt-1">{errors.address1}</p>
                )}
              </div>

              {/* Address 2 */}
              <div>
                <label
                  htmlFor="address2"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Address 2
                </label>
                <input
                  type="text"
                  id="address2"
                  name="address2"
                  value={formData.address2}
                  onChange={handleInputChange}
                  placeholder="Enter address line 2"
                  className="w-full px-4 py-3 bg-[#F1FBFF] border border-[#ABE7FF] rounded-md text-gray-700"
                />
              </div>

              {/* Address 3 */}
              <div>
                <label
                  htmlFor="address3"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Address 3
                </label>
                <input
                  type="text"
                  id="address3"
                  name="address3"
                  value={formData.address3}
                  onChange={handleInputChange}
                  placeholder="Enter address line 3"
                  className="w-full px-4 py-3 bg-[#F1FBFF] border border-[#ABE7FF] rounded-md text-gray-700"
                />
              </div>

              {/* Country */}
              <div>
                {SearchableSelect(
                  "country",
                  "Country",
                  countries,
                  handleCountryChange
                )}
              </div>

              {/* State */}
              <div>
                {SearchableSelect(
                  "state",
                  "State",
                  states,
                  handleStateChange,
                  !selectedCountry
                )}
              </div>

              {/* City */}
              <div>
                {SearchableSelect(
                  "city",
                  "City",
                  cities,
                  handleCityChange,
                  !selectedState
                )}
              </div>

              {/* PIN Code */}
              <div>
                <label
                  htmlFor="pinCode"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  PIN Code
                </label>
                <input
                  type="text"
                  id="pinCode"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  placeholder="Enter PIN code"
                  className={`w-full px-4 py-3 bg-[#F1FBFF] border rounded-md text-gray-700 ${
                    errors.pinCode ? "border-red-500" : "border-[#ABE7FF]"
                  }`}
                />
                {errors.pinCode && (
                  <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className={`w-full px-4 py-3 bg-[#F1FBFF] border rounded-md text-gray-700 ${
                    errors.email ? "border-red-500" : "border-[#ABE7FF]"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Contact Person */}
              <div>
                <label
                  htmlFor="contactPerson"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Contact Person
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Enter contact person name"
                  className={`w-full px-4 py-3 bg-[#F1FBFF] border rounded-md text-gray-700 ${
                    errors.contactPerson ? "border-red-500" : "border-[#ABE7FF]"
                  }`}
                />
                {errors.contactPerson && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.contactPerson}
                  </p>
                )}
              </div>

              {/* Landline */}
              <div>
                <label
                  htmlFor="landline"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Landline
                </label>
                <input
                  type="tel"
                  id="landline"
                  name="landline"
                  value={formData.landline}
                  onChange={handleInputChange}
                  placeholder="Enter landline number"
                  className="w-full px-4 py-3 bg-[#F1FBFF] border border-[#ABE7FF] rounded-md text-gray-700"
                />
              </div>

              {/* Mobile */}
              <div>
                <label
                  htmlFor="mobile"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Mobile
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                  className={`w-full px-4 py-3 bg-[#F1FBFF] border rounded-md text-gray-700 ${
                    errors.mobile ? "border-red-500" : "border-[#ABE7FF]"
                  }`}
                />
                {errors.mobile && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                )}
              </div>
            </div>

            {/* Tax Details Section */}
            <div className="mb-6 border-t border-[#ABE7FF] pt-4">
              <h2 className="text-lg font-medium text-gray-700 mb-3">
                Tax Details
              </h2>
              <div className="grid grid-cols-3">
                <div>
                  <label
                    htmlFor="gstNumber"
                    className="block mb-1 text-sm font-medium text-gray-700"
                  >
                    GST Number
                  </label>
                  <input
                    type="text"
                    id="gstNumber"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    placeholder="Enter GST number"
                    className="w-full px-4 py-3 bg-[#F1FBFF] border border-[#ABE7FF] rounded-md text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-6 py-2 bg-[#2B86AA] text-white rounded-lg hover:bg-[#43a6ce]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-white border border-[#2B86AA] text-[#2B86AA] rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePartner;
