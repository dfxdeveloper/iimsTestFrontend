import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Edit, Trash, ChevronUp, ChevronDown } from "lucide-react";
import { api } from "../../../services/config/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { showToast, toastCustomConfig } from "../../../services/config/toast";
import debounce from "lodash/debounce";
import Loader from "../../../common/Loader";

const defaultColumns = [
  {
    displayName: "Product Category",
    key: "productCategory",
    isIndustryDefault: true,
  },
  { displayName: "Article Name", key: "articleName", isIndustryDefault: true },
  { displayName: "HSN Code", key: "hsnCode", isIndustryDefault: true },
  { displayName: "UoM", key: "uom", isIndustryDefault: true },
  { displayName: "Quantity", key: "quantity", isIndustryDefault: true },
  {
    displayName: "Rate per unit",
    key: "ratePerUnit",
    isIndustryDefault: true,
  },
  { displayName: "GST%", key: "gst", isIndustryDefault: true },
  { displayName: "Total Amount", key: "totalAmount", isIndustryDefault: true },
];

const defaultHeaders = [
  {
    displayName: "PI No",
    key: "piNumber",
    isIndustryDefault: true,
  },
  {
    displayName: "Customer Code",
    key: "customerCode",
    isIndustryDefault: true,
  },
  {
    displayName: "Customer Name",
    key: "clientName",
    isIndustryDefault: true,
  },
  {
    displayName: "Contact Person",
    key: "contactPerson",
    isIndustryDefault: true,
  },
  {
    displayName: "Customer Address",
    key: "customerAddress",
    isIndustryDefault: true,
  },
  {
    displayName: "Reference",
    key: "reference",
    isIndustryDefault: true,
  },
];

const tableHeader = [
  {
    displayName: "Product Category",
    key: "productCategory",
    isIndustryDefault: true,
  },
  {
    displayName: "Article Name",
    key: "articleName",
    isIndustryDefault: true,
  },
  {
    displayName: "HSN Code",
    key: "hsnCode",
    isIndustryDefault: true,
  },
  {
    displayName: "UoM",
    key: "uom",
    isIndustryDefault: true,
  },
  {
    displayName: "Quantity",
    key: "quantity",
    isIndustryDefault: true,
  },
  {
    displayName: "Rate per unit",
    key: "ratePerUnit",
    isIndustryDefault: true,
  },
  {
    displayName: "GST%",
    key: "gst",
    isIndustryDefault: true,
  },
  {
    displayName: "Total Amount",
    key: "totalAmount",
    isIndustryDefault: true,
  },
];


export default function PICreationForm({ templateData, onDataUpdate, onBack }) {
  const [companyDetails, setCompanyDetails] = useState({
    piNumber: "",
    customerCode: "",
    clientName: "",
    contactPerson: "",
    customerAddress: "",
    reference: "",
  });
  const [customFields, setCustomFields] = useState([]);
  const [columns, setColumns] = useState([...defaultColumns]);
  const [tableData, setTableData] = useState([{ id: 1 }]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
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
  const [isResetLoading, setIsResetLoading] = useState(false); 
  const categoryInputRef = useRef(null);
  const labelInputRef = useRef(null);
  const inputRefs = useRef([]);
  const [editingCategoryIndex, setEditingCategoryIndex] = useState(-1);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (templateData && initialLoad) {
      loadTemplateData(templateData);
      setInitialLoad(false);
    }
  }, [templateData, initialLoad]);

  useEffect(() => {
    if (!initialLoad && templateData?.moduleData?.id) {
      fetchUpdatedData();
    }
  }, [initialLoad, templateData?.moduleData?.id]);

  useEffect(() => {
    inputRefs.current = Array(columns.length)
      .fill()
      .map((_, i) => inputRefs.current[i] || null);
  }, [columns.length]);

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

  const validateFieldLabels = () => {
    const errors = [];
    columns.forEach((column) => {
      if (!column.displayName || column.displayName.trim() === "") {
        errors.push(`Each column must have a header name.`);
      }
    });

    customFields.forEach((field) => {
      if (!field.displayName || field.displayName.trim() === "") {
        errors.push(`Each field must have a label name`);
      }
    });

    categoryFields.forEach((category) => {
      category.fields.forEach((field) => {
        if (!field.displayName || field.displayName.trim() === "") {
          errors.push(`Each field must have a label name`);
        }
      });
    });
    return errors;
  };

  const resetToDefault = async () => {
    setIsResetLoading(true); 
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setCompanyDetails({
        piNumber: "",
        customerCode: "",
        clientName: "",
        contactPerson: "",
        customerAddress: "",
        reference: "",
      });
      setCustomFields([]);
      setColumns([...defaultColumns]);
      setTableData([{ id: 1 }]);
      setCategories([]);
      setSelectedCategories([]);
      setCategoryFields([]);
      setNewCategoryName("");
      setEditingLabelId(null);
      setEditedLabelText("");
      setEditingCategoryId(null);
      setEditedCategoryName("");
      setEditingCategoryIndex(-1);
      setIsDropdownOpen(false);
      setShowAddCategory(false);
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
      setApiError(null);
      showToast.success("Form has been reset Successfully!", {
        duration: 2000,
      });
    } finally {
      setIsResetLoading(false); 
    }
  };

  const saveEditedCategory = (categoryId) => {
    if (editingCategoryId && editedCategoryName.trim()) {
      const oldCategoryName = categoryFields.find(
        (cat) => cat.id === categoryId
      )?.categoryName;

      const updatedCategories = categoryFields.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            categoryName: editedCategoryName.trim(),
            expanded: true,
          };
        }
        return { ...category, expanded: false };
      });
      setCategoryFields(updatedCategories);

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

  const loadTemplateData = (data) => {
    const predefinedFields = defaultHeaders.map((header) => header.key.toLowerCase());

    if (data.headers) {
      const existingKeys = new Set(Object.keys(companyDetails).map((k) => k.toLowerCase()));
      const uniqueHeaders = {};
      data.headers.forEach((header) => {
        const normalizedKey = header.key.toLowerCase();
        const normalizedDisplayName = (header.displayName || header.key).toLowerCase();
        if (!existingKeys.has(normalizedKey) && !uniqueHeaders[normalizedKey] && !uniqueHeaders[normalizedDisplayName]) {
          uniqueHeaders[normalizedKey] = header.value || "";
        }
      });

      const headerValues = {};
      predefinedFields.forEach((field) => {
        if (uniqueHeaders[field] !== undefined) {
          headerValues[field] = uniqueHeaders[field];
        }
      });
      setCompanyDetails((prev) => ({
        ...prev,
        ...headerValues,
      }));

      const customFieldsFromHeaders = data.headers
        .filter((header) => {
          const normalizedKey = header.key.toLowerCase();
          return !predefinedFields.includes(normalizedKey) && !existingKeys.has(normalizedKey);
        })
        .map((header) => ({
          id: Date.now() + Math.random(),
          displayName: header.displayName || header.key,
          key: header.key.toLowerCase().replace(/\s+/g, "_"),
          isIndustryDefault: header.isIndustryDefault,
        }))
        .filter((field, index, self) =>
          index === self.findIndex((t) => t.key.toLowerCase() === field.key.toLowerCase())
        );
      setCustomFields((prev) => [...prev, ...customFieldsFromHeaders]);
    }

    if (data.tableHeader) {
      const uniqueColumns = data.tableHeader.reduce((acc, header) => {
        const key = header.displayName
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/([A-Z])/g, (match) => match.toLowerCase());
        if (!acc.find((col) => col.key === key)) {
          acc.push({
            displayName: header.displayName,
            key,
            isIndustryDefault: header.isIndustryDefault,
          });
        }
        return acc;
      }, []);
      setColumns(uniqueColumns.length > 0 ? uniqueColumns : [...tableHeader]);
    } else {
      setColumns([...tableHeader]);
    }

    if (data.productCategory) {
      const loadedCategories = Object.keys(data.productCategory);
      const newCategories = loadedCategories.filter((cat) => !categories.includes(cat));
      if (newCategories.length > 0) {
        setCategories((prev) => [...new Set([...prev, ...newCategories])]);
        const loadedCategoryFields = newCategories.map((categoryName, index) => {
          const existingCategory = categoryFields.find((cat) => cat.categoryName === categoryName);
          if (existingCategory) {
            return existingCategory;
          }
          return {
            id: Date.now() + Math.random() + index,
            categoryName,
            expanded: index === 0,
            fields: data.productCategory[categoryName]
              .map((field, fieldIndex) => ({
                id: `f${Date.now()}_${fieldIndex}_${index}`,
                displayName: field.displayName,
                key: field.displayName.toLowerCase().replace(/\s+/g, "_"),
                value: field.value || "",
                isIndustryDefault: field.isIndustryDefault || false,
              }))
              .filter((field, idx, self) =>
                idx === self.findIndex((f) => f.key === field.key && f.id === field.id)
              ),
          };
        });
        setCategoryFields((prev) => [
          ...prev.filter((cat) => !newCategories.includes(cat.categoryName)),
          ...loadedCategoryFields,
        ]);
        setSelectedCategories((prev) => [...new Set([...prev, ...newCategories])]);
      }
    }
  };

  const id = templateData?.moduleData?.id;
  const moduleType = templateData?.moduleData?.moduleType;

  const fetchUpdatedData = async () => {
    if (!id || !moduleType) {
      console.error("ID and moduleType are required for API calls");
      return null;
    }
    if (isFetching) {
      return;
    }
    setIsFetching(true);
    setApiError(null);
    try {
      const response = await api.get(
        `/industry-modules/submodule/${id}/${moduleType}`
      );
      if (response.data) {
        loadTemplateData(response.data);
        if (onDataUpdate && typeof onDataUpdate === "function") {
          onDataUpdate(response.data);
        }
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching updated data:", error);
      const errorMessage = error.message || "Failed to fetch updated data";
      setApiError(errorMessage);
      return null;
    } finally {
      setIsFetching(false);
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
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    setApiError(null);
    try {
      if (!id || !moduleType) {
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
        ...Object.keys(companyDetails).map((key) => ({
          displayName:
            defaultHeaders.find((h) => h.key === key)?.displayName ||
            key.replace(/([A-Z])/g, " $1").trim(),
          key: key,
          value: companyDetails[key],
          isIndustryDefault: defaultHeaders.some((h) => h.key === key),
        })),
        ...customFields.map((field) => ({
          displayName: field.displayName,
          key: field.displayName.toLowerCase().replace(/\s+/g, "_"),
          value: field.value || "",
          isIndustryDefault: field.isIndustryDefault,
        })),
      ].filter((header) => header.displayName && header.displayName.trim());

      const tableHeader = columns.filter(
        (col) => col.displayName && col.displayName.trim()
      );

      const productCategory = {};
      categoryFields.forEach((category) => {
        if (category.categoryName && category.fields.length > 0) {
          productCategory[category.categoryName] = category.fields
            .map((field) => ({
              displayName: field.displayName,
              key: field.displayName.toLowerCase().replace(/\s+/g, "_"),
              value: field.value || "",
              isIndustryDefault: field.isIndustryDefault,
            }))
            .filter((field) => field.displayName && field.displayName.trim());
        }
      });

      const requestBody = {
        headers,
        tableHeader,
        productCategory,
      };

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const savePromise = api.put(
        `/industry-modules/submodule/${id}/${moduleType}`,
        requestBody
      );
      await showToast.promise(savePromise, {
        loading: "Saving template...",
        success: "Template saved successfully! 🎉",
      });
      await fetchUpdatedData();

     onBack()
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
    const newColumn = {
      displayName: "",
      key: `col_${index + 1}_${Date.now()}`,
      isIndustryDefault: false,
    };
    const updated = [...columns];
    updated.splice(index + 1, 0, newColumn);
    setColumns(updated);

    const updatedTableData = tableData.map((row) => ({
      ...row,
      [newColumn.key]: "",
    }));
    setTableData(updatedTableData);
setTimeout(() => {
  if (inputRefs.current[index + 1]) {
    inputRefs.current[index + 1].focus();
    inputRefs.current[index + 1].select();
  }
}, 0);
  };

  const handleRemoveColumn = (index) => {
    if (columns.length > 1 && !columns[index].isIndustryDefault) {
      const updated = columns.filter((_, i) => i !== index);
      setColumns(updated);
      const updatedData = tableData.map((row) => {
        const newRow = { ...row };
        delete newRow[columns[index].key];
        return newRow;
      });
      setTableData(updatedData);
    } else {
      showToast.error(
        columns[index].isIndustryDefault
          ? "Cannot remove default column"
          : "Cannot remove the last column",
        { duration: 3000 }
      );
    }
  };

  const handleCompanyDetailChange = (field, value) => {
    setCompanyDetails((prev) => ({ ...prev, [field]: value }));
  };

  const addCustomField = () => {
    setCustomFields((prev) => [
      ...prev,
      { id: Date.now(), displayName: "", key: "", isIndustryDefault: false },
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

  const handleSaveCategory = () => {
    if (newCategoryName.trim()) {
      setCategories((prev) => [newCategoryName.trim(), ...prev]);
      setSelectedCategories((prev) => [...prev, newCategoryName.trim()]);
      const newCategoryId = Date.now();
      const isFirstCategory = categoryFields.length === 0;
      setCategoryFields((prev) => [
        ...prev.map((category) => ({ ...category, expanded: false })),
        {
          id: newCategoryId,
          categoryName: newCategoryName.trim(),
          expanded: true,
          fields: [
            {
              id: Date.now() + 1,
              displayName: "",
              key: "",
              value: "",
              isIndustryDefault: false,
            },
          ],
        },
      ]);

      setNewCategoryName("");
      setShowAddCategory(false);
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
    const updatedCategories = categoryFields.map((category) => {
      if (category.id === categoryId) {
        return { ...category, expanded: !category.expanded };
      }
      return category;
    });
    setCategoryFields(updatedCategories);
  };

  const handleFieldValueChange = (categoryId, fieldId, value) => {
    const updatedCategories = categoryFields.map((category) => {
      if (category.id === categoryId) {
        const updatedFields = category.fields.map((field) => {
          if (field.id === fieldId) {
            return { ...field, value };
          }
          return field;
        });
        return { ...category, fields: updatedFields };
      }
      return category;
    });
    setCategoryFields(updatedCategories);
  };

  const addNewFieldToCategory = useCallback(
    debounce((categoryId) => {
      setCategoryFields((prev) =>
        prev.map((category) => {
          if (category.id === categoryId) {
            const newFieldId = `f${Date.now()}_${category.fields.length + 1}`;
            if (category.fields.some((field) => field.id === newFieldId)) {
              return category;
            }
            const newField = {
              id: newFieldId,
              displayName: "",
              key: "",
              value: "",
              isIndustryDefault: false,
            };
            return { ...category, fields: [...category.fields, newField] };
          }
          return category;
        })
      );
    }, 300),
    []
  );

  const removeFieldFromCategory = (categoryId, fieldId) => {
    const updatedCategories = categoryFields.map((category) => {
      if (category.id === categoryId) {
        const updatedFields = category.fields.filter(
          (field) => field.id !== fieldId && !field.isIndustryDefault
        );
        return { ...category, fields: updatedFields };
      }
      return category;
    });
    setCategoryFields(updatedCategories);
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
    if (editingLabelId) {
      const updatedCategories = categoryFields.map((category) => {
        if (category.id === categoryId) {
          const updatedFields = category.fields.map((field) => {
            if (field.id === fieldId && !field.isIndustryDefault) {
              return {
                ...field,
                displayName: editedLabelText || "",
                key: editedLabelText.toLowerCase().replace(/\s+/g, "_") || "",
              };
            }
            return field;
          });
          return { ...category, fields: updatedFields };
        }
        return category;
      });
      setCategoryFields(updatedCategories);
      setEditingLabelId(null);
    }
  };

  const handleColumnChange = (index, e) => {
    const value = e.target.value;
    if (!columns[index].isIndustryDefault) {
      const updated = [...columns];
      updated[index] = {
        ...updated[index],
        displayName: value,
        key: updated[index].key || `col_${index}_${Date.now()}`,
      };
      setColumns(updated);
    }
  };

  return (
    <div className="bg-gray-50 p-4 relative">
      <Toaster {...toastCustomConfig} />
      {(isLoading || isResetLoading) && <Loader />}
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
        .blur-background {
          filter: blur(4px);
        }
      `}</style>

      <div className={`max-w-7xl mx-auto ${isLoading || isResetLoading ? "blur-background" : ""}`}>
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

        <div className="w-full max-w-7xl mx-auto font-sans py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-3">
            <div className="flex flex-col">
              <label className="text-sm mb-2 font-regular text-[#171A1F]">
                PI No.
              </label>
              <input
                type="text"
                value={companyDetails.piNumber || ""}
                onChange={(e) =>
                  handleCompanyDetailChange("piNumber", e.target.value)
                }
                readOnly
                className="w-full border border-[#ABE7FF] rounded-md px-2 py-1 text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-2 font-regular text-[#171A1F]">
                Customer Code
              </label>
              <input
                type="text"
                value={companyDetails.customerCode || ""}
                onChange={(e) =>
                  handleCompanyDetailChange("customerCode", e.target.value)
                }
                readOnly
                className="w-full border border-[#ABE7FF] rounded-md px-2 py-1 text-sm focus:outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm mb-2 font-regular text-[#171A1F]">
                Customer Name
              </label>
              <input
                type="text"
                value={companyDetails.clientName || ""}
                onChange={(e) =>
                  handleCompanyDetailChange("clientName", e.target.value)
                }
                readOnly
                className="w-full border border-[#ABE7FF] rounded-md px-2 py-1 text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-6 py-2">
            <div className="col-span-3 flex flex-col">
              <label className="text-sm mb-2 font-regular text-[#171A1F]">
                Contact Person
              </label>
              <input
                type="text"
                value={companyDetails.contactPerson || ""}
                onChange={(e) =>
                  handleCompanyDetailChange("contactPerson", e.target.value)
                }
                readOnly
                className="w-full border border-[#ABE7FF] rounded-md px-2 py-1 text-sm focus:outline-none"
              />
            </div>

            <div className="col-span-9 flex flex-col">
              <label className="text-sm mb-2 font-regular text-[#171A1F]">
                Customer Address
              </label>
              <input
                type="text"
                value={companyDetails.customerAddress || ""}
                onChange={(e) =>
                  handleCompanyDetailChange("customerAddress", e.target.value)
                }
                readOnly
                className="w-full border border-[#ABE7FF] rounded-md px-2 py-1 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
            <div className="flex flex-col">
              <label className="text-sm mb-2 font-regular text-[#171A1F]">
                Reference
              </label>
              <input
                type="text"
                value={companyDetails.reference || ""}
                onChange={(e) =>
                  handleCompanyDetailChange("reference", e.target.value)
                }
                readOnly
                className="w-full border border-[#ABE7FF] rounded-md px-2 py-1 text-sm focus:outline-none"
              />
            </div>
            {customFields.map((field) => (
              <div key={field.id} className="relative flex flex-col">
                <label className="text-sm mb-2 font-regular text-[#171A1F]">
                  <input
                    type="text"
                    value={field.displayName}
                    onChange={(e) =>
                      field.isIndustryDefault
                        ? null
                        : updateCustomField(
                            field.id,
                            "displayName",
                            e.target.value
                          )
                    }
                    placeholder="Label Name"
                    className={`font-regular bg-transparent border-none p-0 focus:outline-none w-full text-sm ${
                      field.isIndustryDefault
                        ? "cursor-not-allowed opacity-75"
                        : "cursor-pointer hover:text-black transition-colors"
                    }`}
                    readOnly={field.isIndustryDefault}
                    autoFocus={
                      !field.displayName || field.displayName.trim() === ""
                    }
                  />
                </label>
                <input
                  type="text"
                  value={field.value || ""}
                  readOnly
                  className="w-full border border-[#ABE7FF] rounded-md px-2 py-1 text-sm focus:outline-none"
                />
                {!field.isIndustryDefault && (
                  <button
                    type="button"
                    onClick={() => removeCustomField(field.id)}
                    className="absolute -top-2 -right-2 text-red-500 hover:text-red-700 text-lg w-6 h-6 flex items-center justify-center hover:bg-red-50 rounded-full z-10"
                    title="Remove"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}

            <div className="flex items-end">
              <button
                onClick={addCustomField}
                className="bg-[#2B86AA] text-white text-sm px-3 py-1 rounded-md flex items-center gap-2 transition-colors"
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
                  <th className="w-6 px-0 py-1 border-r text-xs font-medium text-[#667085] text-center border-blue-200 bg-white">
                    S.No
                  </th>
                  {columns.map((col, index) => (
                    <th
                      key={col.key || `col_${index}`}
                      className="relative px-0 py-2 border-r border-blue-200 bg-white whitespace-nowrap"
                      style={{
                        width:
                          (col.displayName?.length || 0) < 4
                            ? "40px"
                            : (col.displayName?.length || 0) < 8
                            ? "60px"
                            : (col.displayName?.length || 0) < 15
                            ? "80px"
                            : "100px",
                        minWidth:
                          (col.displayName?.length || 0) < 4
                            ? "40px"
                            : (col.displayName?.length || 0) < 8
                            ? "60px"
                            : (col.displayName?.length || 0) < 15
                            ? "80px"
                            : "100px",
                      }}
                    >
                      <div className="relative">
                        <input
                          ref={
                            !col.isIndustryDefault
                              ? (el) => (inputRefs.current[index] = el)
                              : null
                          }
                          type="text"
                          value={col.displayName || ""}
                          onChange={(e) => handleColumnChange(index, e)}
                          onFocus={(e) => e.target.select()}
                          placeholder="Type here..."
                          className={`w-full bg-transparent outline-none text-xs font-medium text-[#667085] text-center border-none focus:ring-0 placeholder-blue-400 px-0 ${
                            col.isIndustryDefault
                              ? "cursor-not-allowed opacity-75 bg-gray-50"
                              : ""
                          }`}
                          readOnly={col.isIndustryDefault}
                        />
                        <button
                          onClick={() => handleAddColumn(index)}
                          className="absolute -bottom-5 -right-3 w-5 h-5 bg-[#CCF1FF] text-[#2B86AA] rounded-full text-sm flex items-center justify-center z-10"
                          title="Add column"
                        >
                          +
                        </button>
                        {!col.isIndustryDefault && (
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
                    <td className="py-1 border-r border-blue-200 text-center font-medium text-[#667085] bg-blue-25 text-xs">
                      {row.id}.
                    </td>
                    {columns.map((col, colIndex) => (
                      <td
                        key={col.key}
                        className="py-1 border-r border-blue-200"
                        style={{
                          width:
                            col.displayName.length < 4
                              ? "40px"
                              : col.displayName.length < 8
                              ? "60px"
                              : col.displayName.length < 15
                              ? "80px"
                              : "100px",
                        }}
                      >
                        <input
                          type="text"
                          value={row[col.key] || ""}
                          onChange={(e) => {
                            if (!col.isIndustryDefault) {
                              const updated = [...tableData];
                              updated[rowIndex][col.key] = e.target.value;
                              setTableData(updated);
                            }
                          }}
                          className={`w-full bg-transparent outline-none text-xs focus:bg-blue-50 rounded px-0 ${
                            col.isIndustryDefault
                              ? "cursor-not-allowed opacity-75 bg-gray-50 focus:bg-gray-50"
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
                  Category name:
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
                  <span className="text-gray-800 font-semibold text-[#2B86AA] text-sm">
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (editingCategoryId === category.id) {
                      saveEditedCategory(category.id);
                    } else {
                      startEditingCategory(category.id, category.categoryName);
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {category.fields.map((field) => (
                    <div key={field.id} className="relative">
                      <div className="bg-white p-4 transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-1">
                          {editingLabelId === field.id &&
                          !field.isIndustryDefault ? (
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
                              className="text-sm font-regular text-[#171A1F] bg-transparent border-none p-0 focus:outline-none focus:ring-0 w-full"
                            />
                          ) : (
                            <label
                              className={`text-sm font-regular text-[#171A1F] flex-1 rounded px-2 py-0.5 ${
                                field.isIndustryDefault
                                  ? "cursor-default"
                                  : "cursor-pointer hover:text-[#2B86AA] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#ABE7FF] focus:border-[#ABE7FF]"
                              }`}
                              onClick={() => {
                                if (!field.isIndustryDefault) {
                                  startEditingLabel(
                                    category.id,
                                    field.id,
                                    field.displayName
                                  );
                                }
                              }}
                              tabIndex={field.isIndustryDefault ? -1 : 0}
                            >
                              {field.displayName || "Enter Label"}
                            </label>
                          )}
                          <div className="flex items-center gap-1">
                            {!field.isIndustryDefault && (
                              <button
                                onClick={() =>
                                  removeFieldFromCategory(category.id, field.id)
                                }
                                className="-right-1 text-red-600 text-sm rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-50 z-10"
                                title="Remove field"
                              >
                                x
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
                              onClick={() => handleDeleteClick(category)}
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
                                  }
                                : field
                          );
                          setCategoryFields(updatedCategoryFields);
                        } else {
                          handleSaveCategory();
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
        <div className="flex justify-center space-x-4 my-6">
          <button
            onClick={saveToAPI}
            disabled={isLoading || isResetLoading}
            className={`px-8 py-2 rounded-md shadow-sm text-white ${
              isLoading || isResetLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2B86AA] hover:bg-[#227499]"
            }`}
          >
            {isLoading ? "Saving..." : "Publish"}
          </button>
          <button
            onClick={resetToDefault}
            disabled={isLoading || isResetLoading}
            className={`px-8 py-2 rounded-md shadow-sm ${
              isLoading || isResetLoading
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            {isResetLoading ? "Resetting..." : "Reset"}
          </button>
        </div>
      </div>
    </div>
  );
}