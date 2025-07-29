import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { showToast, toastCustomConfig } from "../../../services/config/toast";
import { useLocation } from "../../../services/context/location";
import { api } from "../../../services/config/axiosInstance";

const SearchableSelect = ({
  options,
  value,
  onChange,
  name,
  placeholder,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter((option) =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  useEffect(() => {
    if (value) {
      setSearchTerm("");
    }
  }, [value]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setIsOpen(true);
  };

  const handleOptionClick = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value || searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-md text-gray-700"
      />
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleOptionClick(option.name)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CreatePartner = ({
  onClose,
  onSuccess,
  editMode = false,
  partnerData = null,
}) => {
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const departmentName = userData.department;
  const { countries, states, cities, loading, fetchStates, fetchCities } =
    useLocation();
  const [errors, setErrors] = useState({});
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
    customerCode: ""
  });

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
        customerCode: partnerData.customerCode || ""
      }));
    }
  }, [editMode, partnerData, departmentName]);

  useEffect(() => {
    const initializeLocationData = async () => {
      if (editMode && partnerData && partnerData.country) {
        const country = countries.find((c) => c.name === partnerData.country);
        if (country) {
          await fetchStates(country.iso2);
          if (partnerData.state) {
            const state = states.find((s) => s.name === partnerData.state);
            if (state) {
              await fetchCities(country.iso2, state.iso2);
            }
          }
        }
      }
    };

    initializeLocationData();
  }, [editMode, partnerData, countries, fetchStates, fetchCities]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numericFields = ["mobile", "landline", "pinCode"];
    let processedValue = value;

    if (numericFields.includes(name)) {
      processedValue = value.replace(/\D/g, "");
    } else if (name === "email") {
      processedValue = value.toLowerCase();
    } else if (name !== "type" && name !== "gstNumber") {
      processedValue = capitalizeFirstLetter(value);
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: processedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "country") {
      const country = countries.find((c) => c.name === value);
      if (country) {
        fetchStates(country.iso2);
        setFormData((prev) => ({ ...prev, state: "", city: "" }));
      }
    } else if (name === "state") {
      const country = countries.find((c) => c.name === formData.country);
      const state = states.find((s) => s.name === value);
      if (country && state) {
        fetchCities(country.iso2, state.iso2);
        setFormData((prev) => ({ ...prev, city: "" }));
      }
    }
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

  if (!validateForm()) {
    return;
  }

  // Add customer code if not already present
  const dataToSubmit = {
    ...formData,
    customerCode: formData.customerCode || generateTempCustomerCode()
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
};

  return (
    <div className="w-full mx-auto">
      <Toaster {...toastCustomConfig} />

      <div>
        <h1 className="text-2xl font-medium text-gray-800 mb-6">
          {editMode ? "Edit Partner" : "Create Partner"}
        </h1>

        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Type of Partners */}
            <div>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#F3F4F6] border appearance-none rounded-md text-gray-700 ${
                    errors.type ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <option value="">Type of Partners</option>
                  <option value="vendor">Vendor</option>
                  <option value="customer">Customer</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                )}
              </div>
            </div>

            {/* Client Name */}
            <div>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Client name"
                className={`w-full px-4 py-3 bg-[#F3F4F6] border rounded-md text-gray-700 ${
                  errors.clientName ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.clientName && (
                <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>
              )}
            </div>

            {/* Address 1 */}
            <div>
              <input
                type="text"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                placeholder="Address 1"
                className={`w-full px-4 py-3 bg-[#F3F4F6] border rounded-md text-gray-700 ${
                  errors.address1 ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.address1 && (
                <p className="text-red-500 text-xs mt-1">{errors.address1}</p>
              )}
            </div>

            {/* Address 2 */}
            <div>
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                placeholder="Address 2"
                className="w-full px-4 py-3 bg-[#F3F4F6] border border-gray-200 rounded-md text-gray-700"
              />
            </div>

            {/* Address 3 */}
            <div>
              <input
                type="text"
                name="address3"
                value={formData.address3}
                onChange={handleChange}
                placeholder="Address 3"
                className="w-full px-4 py-3 bg-[#F3F4F6] border border-gray-200 rounded-md text-gray-700"
              />
            </div>

            {/* Country - Moved to be first among location fields */}
            <div>
              <SearchableSelect
                options={countries}
                value={formData.country}
                onChange={handleChange}
                name="country"
                placeholder="Country"
                disabled={loading}
              />
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
            </div>

            {/* State - Moved to be second among location fields */}
            <div>
              <SearchableSelect
                options={states}
                value={formData.state}
                onChange={handleChange}
                name="state"
                placeholder="State"
                disabled={!formData.country || loading}
              />
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
            </div>

            {/* City - Moved to be third among location fields */}
            <div>
              <SearchableSelect
                options={cities}
                value={formData.city}
                onChange={handleChange}
                name="city"
                placeholder="City"
                disabled={!formData.state || loading}
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>

            {/* PIN Code */}
            <div>
              <input
                type="text"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                placeholder="PIN code"
                className={`w-full px-4 py-3 bg-[#F3F4F6] border rounded-md text-gray-700 ${
                  errors.pinCode ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.pinCode && (
                <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Mail Id"
                className={`w-full px-4 py-3 bg-[#F3F4F6] border rounded-md text-gray-700 ${
                  errors.email ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Contact Person */}
            <div>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Contact person name"
                className={`w-full px-4 py-3 bg-[#F3F4F6] border rounded-md text-gray-700 ${
                  errors.contactPerson ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.contactPerson && (
                <p className="text-red-500 text-xs mt-1">{errors.contactPerson}</p>
              )}
            </div>

            {/* Landline */}
            <div>
              <input
                type="tel"
                name="landline"
                value={formData.landline}
                onChange={handleChange}
                placeholder="Land line number"
                className="w-full px-4 py-3 bg-[#F3F4F6] border border-gray-200 rounded-md text-gray-700"
              />
            </div>

            {/* Mobile */}
            <div>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Mobile number"
                className={`w-full px-4 py-3 bg-[#F3F4F6] border rounded-md text-gray-700 ${
                  errors.mobile ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
              )}
            </div>
          </div>

          {/* Tax Details Section */}
          <div className="mb-6 border-t border-gray-200 pt-4">
            <h2 className="text-lg font-medium text-gray-700 mb-3">Tax Details</h2>
            <div>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="GST number"
                className="w-full px-4 py-3 bg-[#F3F4F6] border border-gray-200 rounded-md text-gray-700"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button 
              type="submit" 
              className="px-6 py-2 bg-[#636AE8] text-white rounded-lg hover:bg-indigo-700"
            >
              Save
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2 bg-white border border-[#636AE8] text-[#636AE8] rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePartner;