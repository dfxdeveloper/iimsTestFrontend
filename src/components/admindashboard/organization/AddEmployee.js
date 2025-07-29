import React, { useState, useEffect } from "react";
import { User, Shield } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { departmentOptions } from "../../../utils/departments";
import { showToast, toastCustomConfig } from "../../../services/config/toast";
import { api } from "../../../services/config/axiosInstance";
import MultiselectPlant from "./MultiselectPlant";
import Loader from "../../../common/Loader";

const AddEmployee = ({
  onBack,
  editMode = false,
  employeeData = null,
  onUpdate,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    phoneNumber: "",
    city: "",
    motherName: "",
    personalEmail: "",
    authorizedEmail: "",
    department: "",
    password: "",
    confirmPassword: "",
    plantAccess: [],
  });

  useEffect(() => {
    if (editMode && employeeData) {
      setFormData({
        ...employeeData,
        password: "",
        confirmPassword: "",
      });
    }
  }, [editMode, employeeData]);

  const [errors, setErrors] = useState({});

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.fatherName.trim()) newErrors.fatherName = "Father name is required";
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.motherName.trim()) newErrors.motherName = "Mother name is required";
    if (!formData.personalEmail.trim()) {
      newErrors.personalEmail = "Personal email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.personalEmail)) {
      newErrors.personalEmail = "Please enter a valid email";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.authorizedEmail.trim()) {
      newErrors.authorizedEmail = "Authorized email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.authorizedEmail)) {
      newErrors.authorizedEmail = "Please enter a valid email";
    }
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.plantAccess || formData.plantAccess.length === 0) {
      newErrors.plantAccess = "Select at least one plant";
    }
    if (!editMode) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = async () => {
    if (onBack) {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        onBack();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleNext = async () => {
    if (validateStep1()) {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async operation
        setCurrentStep(2);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrevious = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate async operation
      setCurrentStep(1);
      setErrors({});
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      await handleNext();
      return;
    }
    if (!validateStep2()) {
      return;
    }
    setIsLoading(true);
    const { confirmPassword, ...submitData } = formData;
    try {
      if (editMode) {
        await showToast.promise(
          api.put(`/employees/${employeeData.id}`, submitData),
          {
            loading: "Updating employee details...",
            success: "Employee updated successfully! 🎉",
            error: (error) =>
              `Failed to update employee: ${error.response?.data?.message || "Unknown error"}`,
          }
        );
      } else {
        await showToast.promise(api.post("/employees", submitData), {
          loading: "Adding new employee...",
          success: "Employee added successfully! 🎉",
          error: (error) =>
            `Failed to add employee: ${error.response?.data?.message || "Unknown error"}`,
        });
      }
      if (onUpdate) {
        onUpdate();
      }
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (name, label, type = "text", placeholder = `Type ${label.toLowerCase()}`) => (
    <div className="space-y-2">
      <label className="text-sm text-[#424955] font-bold" style={{ fontFamily: "Inter, sans-serif" }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={formData[name]}
        onChange={(e) => handleChange(name, e.target.value)}
        className={`w-full p-2 border rounded-md bg-[#F1FBFF] ${errors[name] ? "border-red-500" : "border-[#ABE7FF]"}`}
        disabled={isLoading}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full mx-auto p-6 overflow-hidden">
        <Toaster {...toastCustomConfig} />
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full ${
                currentStep === 1
                  ? "bg-white text-[#2B86AA] border-2 border-[#2B86AA]"
                  : "bg-white border-2 border-[#000000] text-[#000000]"
              } flex items-center justify-center`}
            >
              1
            </div>
            <span className={currentStep === 1 ? "text-[#2B86AA]" : "text-[#000000]"}>
              Personal Details
            </span>
          </div>
          <div className="w-32 h-0.5 bg-[#000000]" />
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full ${
                currentStep === 2
                  ? "bg-white text-[#2B86AA] border-2 border-[#2B86AA]"
                  : "bg-white border-2 border-[#000000] text-[#000000]"
              } flex items-center justify-center`}
            >
              2
            </div>
            <span className={currentStep === 2 ? "text-[#2B86AA]" : "text-gray-500"}>
              Authorization
            </span>
          </div>
        </div>

        <div className="p-8">
          {currentStep === 1 ? (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#2B86AA] flex items-center justify-center">
                  <User className="text-white h-5 w-5" />
                </div>
                <h2 className="text-lg text-[#323842] font-bold" style={{ fontFamily: "Archivo, sans-serif" }}>
                  {editMode ? "Edit Employee Information" : "Employee Information"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput("name", "Name")}
                  {renderInput("city", "City")}
                  {renderInput("fatherName", "Father Name")}
                  {renderInput("motherName", "Mother Name")}
                  {renderInput("phoneNumber", "Phone Number", "tel")}
                  {renderInput("personalEmail", "Personal Email", "email")}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2B86AA] hover:bg-[#43a6ce] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-[#2B86AA] rounded-lg bg-white text-[#2B86AA] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#2B86AA] flex items-center justify-center">
                  <Shield className="text-white h-5 w-5" />
                </div>
                <h2 className="text-lg text-[#323842] font-bold" style={{ fontFamily: "Archivo, sans-serif" }}>
                  {editMode ? "Edit Authorization Details" : "Authorization Details"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput("authorizedEmail", "Authorized Mail Id", "email")}
                  <div className="space-y-2">
                    <label className="text-sm text-[#424955] font-bold">
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => handleChange("department", e.target.value)}
                      className={`w-full p-2 border rounded-lg bg-[#F1FBFF] ${errors.department ? "border-red-500" : "border-[#ABE7FF]"}`}
                      disabled={isLoading}
                    >
                      <option value="">Select department</option>
                      {departmentOptions.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </select>
                    {errors.department && (
                      <p className="text-red-500 text-xs mt-1">{errors.department}</p>
                    )}
                  </div>
                  {!editMode && (
                    <>
                      {renderInput("password", "Create Password", "password")}
                      {renderInput("confirmPassword", "Confirm Password", "password")}
                    </>
                  )}
                  <MultiselectPlant
                    value={formData.plantAccess}
                    onChange={(selected) => handleChange("plantAccess", selected)}
                    error={errors.plantAccess}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#2B86AA] hover:bg-[#43a6ce] text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {editMode ? "Update" : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-4 py-2 border border-[#2B86AA] rounded-lg bg-white text-[#2B86AA] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    Previous
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddEmployee;