import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Plus, Edit, Trash, ChevronUp, ChevronDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  showToast,
  toastCustomConfig,
} from "../../../../services/config/toast";
import { api } from "../../../../services/config/axiosInstance";
import Loader from "../../../../common/Loader";


export default function PIModule({
  onDataUpdate,
  moduleType,
  id,
  subModuleId,
  onBack,
}) {
  const [companyDetails, setCompanyDetails] = useState({
    date: "",
    companyName: "",
    name: "",
    city: "",
    reference: "",
    customerCode: "",
    piNo: "",
    contactPerson: "",
  });

  const [data, setData] = useState({
    headers: [],
    tableHeader: [],
    productCategory: {},
    materialDetails: [],
  });
  const initialDefaultData = useRef({
    headers: [],
    tableHeader: [],
    productCategory: {},
  });

  const [defaultFields, setDefaultFields] = useState([]);
  const [defaultColumns, setDefaultColumns] = useState([]);
  const [defaultCategoryFields, setDefaultCategoryFields] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [columns, setColumns] = useState([]);
  const [tableData, setTableData] = useState([{ id: 1 }]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryFields, setCategoryFields] = useState([]);
  const [editingLabelId, setEditingLabelId] = useState(null);
  const [editedLabelText, setEditedLabelText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const categoryInputRef = useRef(null);
  const labelInputRef = useRef(null);
  const [editingCategoryIndex, setEditingCategoryIndex] = useState(-1);
  const [editorValue, setEditorValue] = useState("");

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };
  const Module = "PIModule";

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const resetState = () => {
    setCustomFields([]);
    setColumns([]);
    setCategoryFields([]);
    setDefaultFields([]);
    setDefaultColumns([]);
    setDefaultCategoryFields([]);
    setCategories([]);
    setSelectedCategories([]);
    setEditorValue("");
    setCompanyDetails({
      date: "",
      companyName: "",
      name: "",
      city: "",
      reference: "",
      customerCode: "",
      piNo: "",
      contactPerson: "",
    });
    setData({
      headers: [],
      tableHeader: [],
      productCategory: {},
      materialDetails: [],
    });
  };

  useEffect(() => {
    const hasLoaded = { current: false };

    const loadData = async () => {
      if (!id || !moduleType || !subModuleId || hasLoaded.current) return;

      resetState();
      initialDefaultData.current = {
        headers: [],
        tableHeader: [],
        productCategory: {},
      };

      try {
        setIsFetching(true);
        setApiError(null);
        const defaultResponse = await api.get(`/companies/${id}/${moduleType}`);
        if (defaultResponse.data && defaultResponse.data.data) {
          initialDefaultData.current = {
            headers: defaultResponse.data.data.headers || [],
            tableHeader: defaultResponse.data.data.tableHeader || [],
            productCategory: defaultResponse.data.data.productCategory || {},
          };
          setData(defaultResponse.data.data);
          loadTemplateData(defaultResponse.data.data, true);
        }
        const companyResponse = await api.get(
          `/companies/submodule/${subModuleId}/${Module}`
        );
        if (companyResponse.data && companyResponse.data.data) {
          setData(companyResponse.data.data);
          loadTemplateData(companyResponse.data.data, false);
          if (onDataUpdate && typeof onDataUpdate === "function") {
            onDataUpdate(companyResponse.data.data);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to load data";
        setApiError(errorMessage);
        showToast.error(`Failed to load data: ${errorMessage}`, {
          duration: 3000,
        });
      } finally {
        setIsFetching(false);
        hasLoaded.current = true;
      }
    };

    loadData();

    return () => {
      hasLoaded.current = false;
    };
  }, [id, moduleType, subModuleId]);

  const loadTemplateData = (data, isDefault = false) => {
    if (data.headers) {
      const cleanHeaders = data.headers
        .filter((header) => header && header.displayName)
        .map((header) => ({
          label: header.displayName.trim(),
          key: header.key,
          isCompanyDefault: header.isCompanyDefault ?? false,
          isIndustryDefault: header.isIndustryDefault ?? false,
          _id: header._id,
        }));

      if (isDefault) {
        setDefaultFields(
          cleanHeaders.filter((header) => header.isCompanyDefault)
        );
        setCustomFields(
          cleanHeaders
            .filter((header) => !header.isCompanyDefault)
            .map((header, index) => ({
              id: Date.now() + index,
              label: header.label,
              value: "",
              isDefault: false,
              key: header.key,
              isCompanyDefault: header.isCompanyDefault,
              isIndustryDefault: header.isIndustryDefault,
              _id: header._id,
            }))
        );
      } else {
        const defaultHeaders = cleanHeaders.filter(
          (header) => header.isCompanyDefault
        );
        const customHeaders = cleanHeaders
          .filter((header) => !header.isCompanyDefault)
          .map((header, index) => ({
            id: Date.now() + index,
            label: header.label,
            value: "",
            isDefault: false,
            key: header.key,
            isCompanyDefault: header.isCompanyDefault,
            isIndustryDefault: header.isIndustryDefault,
            _id: header._id,
          }));
        setDefaultFields(defaultHeaders);
        setCustomFields(customHeaders);
      }
    }

    if (data.tableHeader) {
      const cleanTableHeader = data.tableHeader
        .filter((col) => col && col.displayName)
        .map((col) => ({
          label: col.displayName.trim(),
          key: col.key,
          isCompanyDefault: col.isCompanyDefault ?? false,
          isIndustryDefault: col.isIndustryDefault ?? false,
          _id: col._id,
        }));

      const defaultCols = cleanTableHeader
        .filter((col) => col.isCompanyDefault)
        .map((col) => ({
          label: col.label,
          isDefault: true,
          isCompanyDefault: col.isCompanyDefault,
          isIndustryDefault: col.isIndustryDefault,
        }));
      const customCols = cleanTableHeader
        .filter((col) => !col.isCompanyDefault)
        .map((col) => ({
          label: col.label,
          isDefault: false,
          isCompanyDefault: col.isCompanyDefault,
          isIndustryDefault: col.isIndustryDefault,
        }));
      setColumns([...defaultCols, ...customCols]);
      setDefaultColumns(defaultCols);
    }

    if (data.productCategory) {
      const loadedCategories = Object.keys(data.productCategory || {});
      setCategories(loadedCategories);
      setSelectedCategories(loadedCategories);

      const categoryData = loadedCategories.map((categoryName, index) => {
        const fields = (data.productCategory[categoryName] || [])
          .filter((field) => field && field.displayName)
          .map((field, fieldIndex) => ({
            id: `f${Date.now()}_${fieldIndex}_${index}`,
            label: field.displayName.trim(),
            value: "",
            isDefault: field.isCompanyDefault,
            key: field.key,
            isCompanyDefault: field.isCompanyDefault,
            isIndustryDefault: field.isIndustryDefault,
            _id: field._id,
          }));
        return {
          id: Date.now() + Math.random() + index,
          categoryName,
          isDefault: fields.some((f) => f.isCompanyDefault),
          expanded: index === 0,
          fields,
        };
      });
      setCategoryFields(categoryData);
      if (isDefault) {
        setDefaultCategoryFields(categoryData.filter((cat) => cat.isDefault));
      }
    }

    if (data.materialDetails) {
      setData((prev) => ({ ...prev, materialDetails: data.materialDetails }));
    }

    if (data.termsAndConditions) {
      setEditorValue(data.termsAndConditions);
    }
  };

  const fetchUpdatedData = async () => {
    if (!subModuleId || !Module) {
      console.error("subModuleId and Module are required for API calls");
      return null;
    }
    setIsFetching(true);
    setApiError(null);

    try {
      const response = await api.get(
        `/companies/submodule/${subModuleId}/${Module}`
      );
      if (response.data && response.data.data) {
        setData(response.data.data);
        loadTemplateData(response.data.data, false);
        if (onDataUpdate && typeof onDataUpdate === "function") {
          onDataUpdate(response.data.data);
        }
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching updated data:", error);
      const errorMessage = error.message || "Failed to fetch updated data";
      setApiError(errorMessage);
      showToast.error(`Failed to fetch updated data: ${errorMessage}`, {
        duration: 3000,
      });
      return null;
    } finally {
      setIsFetching(false);
    }
  };

  const resetToDefault = async () => {
    try {
      setIsLoading(true);
      setApiError(null);

      const defaultData = {
        headers: initialDefaultData.current.headers.filter(
          (h) => h.isCompanyDefault
        ),
        tableHeader: initialDefaultData.current.tableHeader.filter(
          (t) => t.isCompanyDefault
        ),
        productCategory: Object.fromEntries(
          Object.entries(initialDefaultData.current.productCategory || {}).map(
            ([categoryName, fields]) => [
              categoryName,
              fields.filter((f) => f.isCompanyDefault),
            ]
          )
        ),
        materialDetails: initialDefaultData.current.materialDetails || [],
      };

      setCompanyDetails({
        date: "",
        companyName: "",
        name: "",
        city: "",
        reference: "",
        customerCode: "",
        piNo: "",
        contactPerson: "",
      });
      setData(defaultData);
      loadTemplateData(defaultData, true);
      setTableData([{ id: 1 }]);
      setNewCategoryName("");
      setEditingLabelId(null);
      setEditedLabelText("");
      setEditingCategoryId(null);
      setEditedCategoryName("");
      setEditingCategoryIndex(-1);
      setIsDropdownOpen(false);
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
      setApiError(null);
      setEditorValue("");

      showToast.success("Form has been reset successfully!", {
        duration: 2000,
      });
    } catch (error) {
      console.error("Error resetting form:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to reset form";
      setApiError(errorMessage);
      showToast.error(`Failed to reset form: ${errorMessage}`, {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveToAPI = async () => {
    const validationErrors = validateFieldLabels();
    if (validationErrors.length > 0) {
      validationErrors.forEach((error, index) => {
        setTimeout(() => {
          showToast.error(error, { duration: 3000 });
        }, index * 500);
      });
      return;
    }

    if (validateCategoryFields()) {
      showToast.error("Please add a field to category", { duration: 3000 });
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      if (!subModuleId || !moduleType) {
        console.error("subModuleId and moduleType are required for API calls");
        showToast.error("Missing required parameters for saving");
        return;
      }

      if (selectedCategories.length === 0 || categoryFields.length === 0) {
        showToast.error("Please create at least one category");
        return;
      }
      const hasValidCategories = categoryFields.some(
        (category) => category.categoryName && category.fields.length > 0
      );

      if (!hasValidCategories) {
        showToast.error(
          "Please ensure selected categories have proper configuration"
        );
        return;
      }

      const headers = [
        ...defaultFields.map((field) => ({
          displayName: field.label,
          key: field.key,
          isCompanyDefault: field.isCompanyDefault,
          isIndustryDefault: field.isIndustryDefault,
          _id: field._id,
        })),
        ...customFields.map((field) => ({
          displayName: field.label,
          key: field.key || field.label.toLowerCase().replace(/\s+/g, ""),
          isCompanyDefault: field.isCompanyDefault,
          isIndustryDefault: field.isIndustryDefault,
        })),
      ].filter((header) => header.displayName && header.displayName.trim());

      const tableHeader = columns
        .map((col) => ({
          displayName: col.label,
          key: col.label.toLowerCase().replace(/\s+/g, ""),
          isCompanyDefault: col.isCompanyDefault,
          isIndustryDefault: col.isIndustryDefault,
          _id: col._id,
        }))
        .filter((col) => col.displayName && col.displayName.trim());

      const productCategory = {};
      categoryFields.forEach((category) => {
        if (category.categoryName && category.fields.length > 0) {
          productCategory[category.categoryName] = category.fields
            .map((field) => ({
              displayName: field.label,
              key: field.key || field.label.toLowerCase().replace(/\s+/g, ""),
              isCompanyDefault: field.isCompanyDefault,
              isIndustryDefault: field.isIndustryDefault,
              _id: field._id,
            }))
            .filter((field) => field.displayName && field.displayName.trim());
        }
      });

      const requestBody = {
        headers,
        tableHeader,
        productCategory,
        materialDetails: data.materialDetails || [],
        termsAndConditions: editorValue,
      };

      const savePromise = api.put(
        `/companies/submodule/${subModuleId}/${moduleType}`,
        requestBody
      );

      await showToast.promise(savePromise, {
        loading: "Saving template...",
        success: "Template saved successfully! 🎉",
      });

      await fetchUpdatedData();
    } catch (error) {
      console.error("Error saving data:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Failed to save data";
      setApiError(errorMessage);
      showToast.error(`Failed to save template: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddColumn = (index) => {
    const updated = [...columns];
    updated.splice(index + 1, 0, {
      label: "",
      isDefault: false,
      isCompanyDefault: false,
      isIndustryDefault: false,
    });
    setColumns(updated);
  };

  const handleRemoveColumn = (index) => {
    if (columns.length > 1 && !columns[index].isCompanyDefault) {
      const updated = columns.filter((_, i) => i !== index);
      setColumns(updated);
      const updatedData = tableData.map((row) => {
        const newRow = { ...row };
        delete newRow[`col_${index}`];
        return newRow;
      });
      setTableData(updatedData);
    } else {
      showToast.error("Cannot remove default columns", {
        duration: 3000,
      });
    }
  };

  const handleCompanyDetailChange = (field, value) => {
    setCompanyDetails((prev) => ({ ...prev, [field]: value }));
  };

  const addCustomField = () => {
    setCustomFields((prev) => [
      ...prev,
      {
        id: Date.now(),
        label: "",
        value: "",
        isDefault: false,
        key: "",
        isIndustryDefault: false,
        isCompanyDefault: false,
      },
    ]);
  };

  const updateCustomField = (id, key, val) => {
    setCustomFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, [key]: val } : field))
    );
  };

  const removeCustomField = (id) => {
    setCustomFields((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategories((prev) => [newCategoryName.trim(), ...prev]);
      setSelectedCategories((prev) => [...prev, newCategoryName.trim()]);

      const newCategoryId = Date.now();
      setCategoryFields((prev) => [
        ...prev.map((category) => ({ ...category, expanded: false })),
        {
          id: newCategoryId,
          categoryName: newCategoryName.trim(),
          isDefault: false,
          expanded: true,
          fields: [
            {
              id: Date.now() + 1,
              label: "",
              value: "",
              isDefault: false,
              key: "",
              isIndustryDefault: false,
              isCompanyDefault: false,
            },
          ],
        },
      ]);

      setNewCategoryName("");
      setIsDropdownOpen(false);
      showToast.success(
        `Category "${newCategoryName.trim()}" added successfully!`,
        { duration: 3000 }
      );
    } else {
      showToast.error("Please enter a category name", { duration: 3000 });
    }
  };

  const handleCategoryDelete = (categoryName) => {
    setCategories((prev) => prev.filter((cat) => cat !== categoryName));
    setSelectedCategories((prev) => prev.filter((cat) => cat !== categoryName));
    setCategoryFields((prev) =>
      prev.filter((cat) => cat.categoryName !== categoryName)
    );

    showToast.success(`Category "${categoryName}" deleted permanently!`, {
      duration: 2000,
    });
  };

  const toggleCategory = (categoryId) => {
    setCategoryFields((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? { ...category, expanded: !category.expanded }
          : category
      )
    );
  };

  const handleFieldValueChange = (categoryId, fieldId, value) => {
    setCategoryFields((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          const updatedFields = category.fields.map((field) =>
            field.id === fieldId ? { ...field, value } : field
          );
          return { ...category, fields: updatedFields };
        }
        return category;
      })
    );
  };

  const addNewFieldToCategory = (categoryId) => {
    setCategoryFields((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          const newField = {
            id: `f${Date.now()}_${category.fields.length + 1}_${category.id}`,
            label: "",
            value: "",
            isDefault: false,
            key: "",
            isIndustryDefault: false,
            isCompanyDefault: false,
          };
          return {
            ...category,
            fields: [...category.fields, newField],
          };
        }
        return category;
      })
    );
  };

  const removeFieldFromCategory = (categoryId, fieldId) => {
    setCategoryFields((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          const updatedFields = category.fields.filter(
            (field) => field.id !== fieldId
          );
          return { ...category, fields: updatedFields };
        }
        return category;
      })
    );
  };

  const startEditingLabel = (categoryId, fieldId, currentLabel) => {
    setEditingLabelId(fieldId);
    setEditedLabelText(currentLabel);
    setTimeout(() => {
      if (labelInputRef.current) {
        labelInputRef.current.focus();
      }
    }, 0);
  };

  const saveEditedLabel = (categoryId, fieldId) => {
    if (editingLabelId && editedLabelText.trim()) {
      setCategoryFields((prev) =>
        prev.map((category) => {
          if (category.id === categoryId) {
            const updatedFields = category.fields.map((field) =>
              field.id === fieldId
                ? {
                    ...field,
                    label: editedLabelText,
                    key:
                      field.key ||
                      editedLabelText.toLowerCase().replace(/\s+/g, ""),
                  }
                : field
            );
            return { ...category, fields: updatedFields };
          }
          return category;
        })
      );
      setEditingLabelId(null);
      setEditedLabelText("");
    }
  };

  const startEditingCategory = (categoryId, currentName) => {
    setEditingCategoryId(categoryId);
    setEditedCategoryName(currentName);
    setTimeout(() => {
      if (categoryInputRef.current) {
        categoryInputRef.current.focus();
        categoryInputRef.current.select();
      }
    }, 0);
  };

  const saveEditedCategory = (categoryId) => {
    if (editingCategoryId && editedCategoryName.trim()) {
      const oldCategoryName = categoryFields.find(
        (cat) => cat.id === categoryId
      )?.categoryName;

      setCategoryFields((prev) =>
        prev.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                categoryName: editedCategoryName.trim(),
                isDefault: (
                  data.productCategory[editedCategoryName.trim()] || []
                ).some((f) => f.isCompanyDefault),
              }
            : category
        )
      );

      setCategories((prev) =>
        prev.map((cat) =>
          cat === oldCategoryName ? editedCategoryName.trim() : cat
        )
      );

      setSelectedCategories((prev) =>
        prev.map((cat) =>
          cat === oldCategoryName ? editedCategoryName.trim() : cat
        )
      );

      setEditingCategoryId(null);
      setEditedCategoryName("");

      showToast.success(`Category updated to "${editedCategoryName.trim()}"!`, {
        duration: 2000,
      });
    } else {
      showToast.error("Please enter a valid category name", { duration: 3000 });
    }
  };

  const cancelEditingCategory = () => {
    setEditingCategoryId(null);
    setEditedCategoryName("");
  };

  const handleDeleteClick = (categoryName) => {
    setCategoryToDelete(categoryName);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      handleCategoryDelete(categoryToDelete);
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  const validateFieldLabels = () => {
    const errors = [];
    columns.forEach((column) => {
      if (!column?.label || !column.label.trim()) {
        errors.push(`Each column must have a header name.`);
      }
    });
    customFields.forEach((field) => {
      if (!field.label || !field.label.trim()) {
        errors.push(`Each field must have a label name`);
      }
    });

    categoryFields.forEach((category) => {
      category.fields.forEach((field) => {
        if (
          !field.label ||
          !field.label.trim() ||
          field.label === "Enter Label"
        ) {
          errors.push(`Each field must have a label name`);
        }
      });
    });

    return errors;
  };

  const validateCategoryFields = () => {
    const newCategories = categoryFields.filter(
      (category) => !category.isDefault
    );
    const invalidCategories = newCategories.filter(
      (category) =>
        category.fields.length === 0 ||
        category.fields.every((field) => !field.label || !field.label.trim())
    );
    return invalidCategories.length > 0;
  };

  return (
    <div className="bg-gray-50 p-4 relative">
      <Toaster {...toastCustomConfig} />
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2b86aa;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1b6a8c;
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #f1f5f9;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #2b86aa #f1f5f9;
        }
        .dropdown-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .dropdown-scrollbar::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 2px;
        }
        .dropdown-scrollbar::-webkit-scrollbar-thumb {
          background: #2b86aa;
          border-radius: 2px;
        }
        .dropdown-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1b6a8c;
        }
        .dropdown-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #2b86aa #e5e7eb;
        }
      `}</style>

      {(isLoading || isFetching) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100] flex items-center justify-center">
          <Loader />
        </div>
      )}
      <div className={`max-w-7xl mx-auto ${isLoading || isFetching ? 'filter blur-sm' : ''}`}>
        <div className="bg-[linear-gradient(346.16deg,#2B86AA_42.92%,#69B9D9_139.13%)] border border-[#ABE7FF] text-white px-6 py-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/30">
            <h1 className="text-md font-regular">PI Creation</h1>
            <div className="text-sm font-regular">Date: xxxxxxxxx</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="bg-white text-[#171A1F] px-6 py-3 rounded-lg shadow-sm">
              <div className="text-sm font-bold">LOGO Image</div>
            </div>
            <div className="flex-1 text-center mx-8">
              <div className="text-base font-regular">
                Company Name : xxxxxxxxx
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-regular">
                Company Address :xxxxxxxxxxx
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto font-sans py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 py-2 gap-4">
            {defaultFields.map((field, index) => (
              <div
                key={`default-${index}`}
                className={`relative flex flex-col ${
                  field.label === "Customer Address"
                    ? "lg:col-span-8"
                    : field.label === "Contact Person"
                    ? "lg:col-span-4"
                    : "lg:col-span-4"
                }`}
              >
                <label className="text-xs mb-1 h-6 flex items-center">
                  <span className="font-regular text-[#171A1F] text-sm py-1.5 rounded">
                    {field.label}
                  </span>
                </label>
                <input
                  type="text"
                  value={companyDetails[field.key] || ""}
                  onChange={(e) =>
                    handleCompanyDetailChange(field.key, e.target.value)
                  }
                  className="border border-[#ABE7FF] rounded px-2 py-1.5 text-xs shadow-inner focus:outline-none bg-gray-50"
                  readOnly={field.isCompanyDefault}
                />
              </div>
            ))}
            {customFields.map((field) => (
              <div
                key={field.id}
                className={`relative flex flex-col ${
                  field.label === "Customer Address"
                    ? "lg:col-span-8"
                    : field.label === "Contact Person"
                    ? "lg:col-span-4"
                    : "lg:col-span-4"
                }`}
              >
                <label className="text-sm mb-1 h-6 flex items-center">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) =>
                      updateCustomField(field.id, "label", e.target.value)
                    }
                    placeholder="Label Name"
                    className="font-regular text-[#171A1F] text-sm border-white py-1 px-2 focus:border rounded cursor-pointer hover:text-[#2B86AA] transition-all duration-200 focus:outline-none bg-transparent w-full"
                    readOnly={field.isCompanyDefault}
                  />
                </label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) =>
                    updateCustomField(field.id, "value", e.target.value)
                  }
                  className="border border-[#ABE7FF] rounded px-2 py-1.5 text-xs shadow-inner focus:outline-none"
                  readOnly
                />
                {!field.isCompanyDefault && (
                  <button
                    type="button"
                    onClick={() => removeCustomField(field.id)}
                    className="absolute -right-1 text-red-600 text-sm px-1 rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-50 z-10"
                    title="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <div className="lg:col-span-2 flex flex-col">
              <div className="h-6 mb-1"></div>
              <button
                onClick={addCustomField}
                className="bg-[#2B86AA] hover:bg-[#227499] text-white text-sm px-3 rounded flex items-center text-center gap-1 h-[28px]"
              >
                <Plus size={16} /> Add New Field
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white mt-4 rounded-lg shadow-sm border border-gray-200 relative">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse table-auto">
              <thead>
                <tr className="bg-white border-b-2 border-blue-200">
                  <th className="w-6 px-0 py-1 border-r text-xs font-medium text-gray-700 text-center border-blue-200 bg-white">
                    S.No
                  </th>
                  {columns.map((col, index) => (
                    <th
                      key={index}
                      className="relative px-0 py-2 border-r border-blue-200 bg-white whitespace-nowrap"
                      style={{
                        width:
                          col.label.length < 4
                            ? "40px"
                            : col.label.length < 8
                            ? "60px"
                            : col.label.length < 15
                            ? "80px"
                            : "100px",
                        minWidth:
                          col.label.length < 4
                            ? "40px"
                            : col.label.length < 8
                            ? "60px"
                            : col.label.length < 15
                            ? "80px"
                            : "100px",
                      }}
                    >
                      <div className="relative">
                        <input
                          type="text"
                          value={col.label || ""}
                          onChange={(e) => {
                            if (!col.isCompanyDefault) {
                              const updated = [...columns];
                              updated[index] = {
                                ...col,
                                label: e.target.value,
                              };
                              setColumns(updated);
                            }
                          }}
                          placeholder="Type here..."
                          className={`w-full bg-transparent outline-none text-[#667085] text-xs font-medium bg-gray-50 text-center border-none focus:ring-0 placeholder-blue-400 px-0 ${
                            col.isCompanyDefault
                              ? "cursor-not-allowed opacity-75 text-[#667085]"
                              : ""
                          }`}
                          readOnly={col.isCompanyDefault}
                        />
                        <button
                          onClick={() => handleAddColumn(index)}
                          className="absolute -bottom-5 -right-3 w-5 h-5 bg-[#CCF1FF] text-[#2B86AA] rounded-full text-sm flex items-center justify-center z-10"
                          title="Add column"
                        >
                          +
                        </button>
                        {!col.isCompanyDefault && (
                          <button
                            onClick={() => handleRemoveColumn(index)}
                            className="absolute -right-3 -top-2 w-5 h-5 bg-[#FFB9BB] text-[#F9272B] rounded-full text-xs hover:bg-[#F9272B] hover:text-[#FFB9BB] transition-colors flex items-center justify-center shadow-md z-20"
                            title="Remove column"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b border-blue-200 hover:bg-blue-25"
                  >
                    <td className="py-1 border-r border-blue-200 text-center font-medium text-gray-700 bg-blue-25 text-xs">
                      {row.id}.
                    </td>
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className="py-1 border-r border-blue-200"
                        style={{
                          width:
                            col.label.length < 4
                              ? "40px"
                              : col.label.length < 8
                              ? "60px"
                              : col.label.length < 15
                              ? "80px"
                              : "100px",
                        }}
                      >
                        <input
                          type="text"
                          value={row[`col_${colIndex}`] || ""}
                          onChange={(e) => {
                            if (!col.isCompanyDefault) {
                              const updated = [...tableData];
                              updated[rowIndex][`col_${colIndex}`] =
                                e.target.value;
                              setTableData(updated);
                            }
                          }}
                          className={`w-full bg-transparent outline-none text-xs focus:bg-blue-50 rounded px-0 ${
                            col.isCompanyDefault
                              ? "opacity-75 bg-gray-50 focus:bg-gray-50"
                              : ""
                          }`}
                          readOnly
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={() => {
            setNewCategoryName("");
            setEditingCategoryIndex(-1);
            setIsDropdownOpen(true);
          }}
          className="mt-4 bg-gradient-to-r from-[#2B86AA] to-[#3A9BC1] text-white px-3 py-1 rounded-md text-sm font-medium hover:from-[#236B89] hover:to-[#2B86AA] transition-all duration-200 flex items-center gap-2 shadow-md"
        >
          <Plus size={16} />
          Add Category
        </button>
        {categoryFields.map((category) => (
          <div
            key={category.id}
            className="border border-gray-200 rounded-md mt-3 overflow-hidden"
          >
            <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div
                className="flex items-center flex-1 cursor-pointer"
                onClick={() => toggleCategory(category.id)}
              >
                <span className="text-gray-800 font-medium mr-1 text-sm">
                  Category Name:
                </span>
                {editingCategoryId === category.id ? (
                  <input
                    ref={categoryInputRef}
                    type="text"
                    value={editedCategoryName}
                    onChange={(e) => setEditedCategoryName(e.target.value)}
                    onBlur={() => saveEditedCategory(category.id)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        saveEditedCategory(category.id);
                      } else if (e.key === "Escape") {
                        cancelEditingCategory();
                      }
                    }}
                    className="text-gray-800 font-semibold text-[#2B86AA] text-sm bg-white border border-[#2B86AA] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#2B86AA] min-w-[120px]"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="text-gray-800 mr-2 font-semibold text-[#2B86AA] text-sm">
                    {category.categoryName}
                  </span>
                )}
                <span className="text-[#565E6C] font-medium text-sm mx-2">
                  |
                </span>
                <span className="text-gray-800 font-medium text-sm">
                  Article Name:
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!category.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (editingCategoryId === category.id) {
                        saveEditedCategory(category.id);
                      } else {
                        startEditingCategory(
                          category.id,
                          category.categoryName
                        );
                      }
                    }}
                    className="text-[#CCF1FF] bg-[#2B86AA] hover:text-[#2B86AA] transition-colors py-1.5 px-1.5 rounded-full hover:bg-white/50"
                    title={
                      editingCategoryId === category.id
                        ? "Save category name"
                        : "Edit category name"
                    }
                  >
                    <Edit size={10} />
                  </button>
                )}

                {!category.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(category.categoryName);
                    }}
                    className="text-red-600 hover:text-red-600 px-1.5 py-0 transition-colors rounded-full bg-red-200 hover:bg-red-50"
                    title="Delete category"
                  >
                    ×
                  </button>
                )}

                <div
                  className="cursor-pointer p-1"
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.expanded ? (
                    <ChevronUp size={16} className="text-gray-600" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-600" />
                  )}
                </div>
              </div>
            </div>

            {category.expanded && (
              <div className="p-6 bg-gray-50 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.fields.map((field) => (
                    <div key={field.id} className="relative">
                      <div className="bg-white p-4 transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-1">
                          {editingLabelId === field.id ? (
                            <input
                              ref={labelInputRef}
                              type="text"
                              value={editedLabelText}
                              onChange={(e) =>
                                setEditedLabelText(e.target.value)
                              }
                              onBlur={() =>
                                saveEditedLabel(category.id, field.id)
                              }
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  saveEditedLabel(category.id, field.id);
                                }
                              }}
                              className="text-sm font-regular text-gray-800 bg-transparent border-none p-0 focus:outline-none focus:ring-0 w-full"
                            />
                          ) : (
                            <label
                              className={`text-sm font-regular text-gray-800 flex-1 rounded px-2 py-0.5 ${
                                field.isCompanyDefault
                                  ? "cursor-default"
                                  : "cursor-pointer hover:text-[#2B86AA] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#ABE7FF] focus:border-[#ABE7FF]"
                              }`}
                              onClick={() => {
                                if (!field.isCompanyDefault) {
                                  startEditingLabel(
                                    category.id,
                                    field.id,
                                    field.label
                                  );
                                }
                              }}
                              tabIndex={field.isCompanyDefault ? -1 : 0}
                            >
                              {field.label || "Enter Label"}
                            </label>
                          )}
                          <div className="flex items-center gap-1">
                            {!field.isCompanyDefault && (
                              <button
                                onClick={() =>
                                  removeFieldFromCategory(category.id, field.id)
                                }
                                className="text-red-600 text-sm rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-50 z-10"
                                title="Remove field"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) =>
                            handleFieldValueChange(
                              category.id,
                              field.id,
                              e.target.value
                            )
                          }
                          className="w-full border border-[#ABE7FF] rounded-md px-2 py-1 text-sm focus:outline-none"
                          readOnly
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-start p-4">
                  <button
                    onClick={() => addNewFieldToCategory(category.id)}
                    className="bg-[#2B86AA] border border-[#2B86AA] text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-[#2B86AA] hover:text-white transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md"
                  >
                    <Plus size={14} />
                    Add New Field
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
                <div className="flex items-center">
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <Trash size={20} className="text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-800">
                    Delete Category
                  </h3>
                </div>
              </div>

              <div className="px-6 py-6">
                <p className="text-gray-700 mb-2">
                  Are you sure you want to delete the category
                </p>
                <p className="text-[#2B86AA] font-semibold text-lg mb-4">
                  "{categoryToDelete}"?
                </p>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border-l-4 border-red-400">
                  <strong>Warning:</strong> This action cannot be undone. All
                  fields within this category will be permanently deleted.
                </p>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  <Trash size={16} />
                  Delete Category
                </button>
              </div>
            </div>
          </div>
        )}

        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[90] transition-opacity duration-300"
              onClick={() => {
                setIsDropdownOpen(false);
              }}
            ></div>
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-[100] w-96 max-h-[500px] overflow-hidden border border-gray-200 animate-in fade-in-0 zoom-in-95 duration-300">
              <div className="bg-gradient-to-r from-[#2B86AA] to-[#3A9BC1] px-6 py-4 text-white relative">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a2 2 0 012-2z"
                    />
                  </svg>
                  {editingCategoryIndex >= 0
                    ? "Update Category"
                    : "Add Category"}
                </h3>
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setNewCategoryName("");
                    setEditingCategoryIndex(-1);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center group"
                >
                  <svg
                    className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B86AA] focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    autoFocus
                  />
                </div>
                {categories.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Existing Categories
                    </label>
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                      {categories.map((category, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                        >
                          <span className="text-gray-800 font-medium text-sm">
                            {category}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setNewCategoryName(category);
                                setEditingCategoryIndex(index);
                              }}
                              className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 transition-colors"
                              title="Edit category"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to delete "${category}" category? This action cannot be undone.`
                                  )
                                ) {
                                  handleCategoryDelete(category);
                                }
                              }}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Delete category"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-6">
                  <button
                    onClick={() => {
                      if (newCategoryName.trim()) {
                        if (editingCategoryIndex >= 0) {
                          const updatedCategories = [...categories];
                          const oldCategoryName =
                            updatedCategories[editingCategoryIndex];
                          updatedCategories[editingCategoryIndex] =
                            newCategoryName.trim();
                          setCategories(updatedCategories);
                          const updatedCategoryFields = categoryFields.map(
                            (field) =>
                              field.categoryName === oldCategoryName
                                ? {
                                    ...field,
                                    categoryName: newCategoryName.trim(),
                                    isDefault: (
                                      data.productCategory[
                                        newCategoryName.trim()
                                      ] || []
                                    ).some((f) => f.isCompanyDefault),
                                  }
                                : field
                          );
                          setCategoryFields(updatedCategoryFields);
                        } else {
                          handleAddCategory();
                        }
                        setIsDropdownOpen(false);
                        setNewCategoryName("");
                        setEditingCategoryIndex(-1);
                      }
                    }}
                    disabled={!newCategoryName.trim()}
                    className="flex-1 bg-gradient-to-r from-[#2B86AA] to-[#3A9BC1] text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-[#236B89] hover:to-[#2B86AA] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {editingCategoryIndex >= 0 ? "Update" : "Add Category"}
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setNewCategoryName("");
                      setEditingCategoryIndex(-1);
                    }}
                    className="flex-1 px-3 py-2 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium text-black mb-2">
            Add Note Here :
          </label>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <ReactQuill
              value={editorValue}
              onChange={setEditorValue}
              modules={modules}
              formats={formats}
              className="h-64 pb-16"
            />
          </div>
        </div>
        <div className="flex justify-center space-x-4 my-6">
          <button
            onClick={saveToAPI}
            disabled={isLoading}
            className={`px-8 py-2 rounded-md shadow-sm text-white ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2B86AA] hover:bg-[#227499]"
            }`}
          >
            {isLoading ? "Saving..." : "Publish"}
          </button>
          <button
            onClick={resetToDefault}
            className="bg-white border border-gray-300 text-gray-700 px-8 py-2 rounded-md shadow-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}