import React, { useState, useRef } from "react";
import { Plus, ChevronDown, ChevronUp, Edit, Trash } from "lucide-react";

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

const PerformaInvoice = () => {
  // Company details
  const [companyDetails, setCompanyDetails] = useState({
    companyName: "Company Name",
    date: "15/01/2023",
    customerCode: "",
    piNo: "",
    name: "",
    city: "",
    contactPerson: "",
    reference: "",
  });

  // Table data
  const [tableData, setTableData] = useState([
    {
      id: "1",
      product: "Bag",
      description: "Heavy-Duty Industrial Drill Machine",
      hsnCode: "84672300",
      uom: "Number (Pcs)",
      quantity: "10",
      rate: "₹12,500",
      gst: "18%",
      totalAmount: "₹1,47,500",
      totalDescription: "Product + Taxes (18%)",
    },
  ]);

  // Category fields - dynamic field groups
  const [categoryFields, setCategoryFields] = useState([
    {
      id: "cat1",
      categoryName: "Bag",
      expanded: true,
      fields: [
        [
          { id: "f1", label: "Bag Size", value: "" },
          { id: "f2", label: "Bag Weight", value: "" },
          { id: "f3", label: "Handle", value: "" },
        ],
        [
          { id: "f4", label: "Fabric", value: "" },
          { id: "f5", label: "Label Inside", value: "" },
          { id: "f6", label: "Label Outside", value: "" },
        ],
        [
          { id: "f7", label: "Made of the Bag", value: "" },
          { id: "f8", label: "Printing", value: "" },
          { id: "f9", label: "Printing Color", value: "" },
        ],
        [
          { id: "f10", label: "Printing Size", value: "" },
          { id: "f11", label: "Printing Position", value: "" },
          { id: "f12", label: "Remark (If any)", value: "" },
        ],
      ],
    },
    {
      id: "cat2",
      categoryName: "Bag",
      expanded: false,
      fields: [
        [
          { id: "f13", label: "Field 1", value: "" },
          { id: "f14", label: "Field 2", value: "" },
          { id: "f15", label: "Field 3", value: "" },
        ],
      ],
    },
  ]);

  // States for editing labels
  const [editingLabelId, setEditingLabelId] = useState(null);
  const [editedLabelText, setEditedLabelText] = useState("");
  const labelInputRef = useRef(null);

  // Handle company detail changes
  const handleCompanyDetailChange = (field, value) => {
    setCompanyDetails({
      ...companyDetails,
      [field]: value,
    });
  };

  // Handle table data changes
  const handleTableDataChange = (id, field, value) => {
    const updatedTableData = tableData.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setTableData(updatedTableData);
  };

  // Handle field value changes
  const handleFieldValueChange = (categoryId, fieldId, value) => {
    const updatedCategories = categoryFields.map((category) => {
      if (category.id === categoryId) {
        const updatedFields = category.fields.map((row) =>
          row.map((field) =>
            field.id === fieldId ? { ...field, value } : field
          )
        );
        return { ...category, fields: updatedFields };
      }
      return category;
    });
    setCategoryFields(updatedCategories);
  };

  // Start editing label
  const startEditingLabel = (categoryId, fieldId, currentLabel) => {
    setEditingLabelId(fieldId);
    setEditedLabelText(currentLabel);
    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      if (labelInputRef.current) {
        labelInputRef.current.focus();
      }
    }, 50);
  };

  // Save edited label
  const saveEditedLabel = (categoryId, fieldId) => {
    if (!editedLabelText.trim()) return;

    const updatedCategories = categoryFields.map((category) => {
      if (category.id === categoryId) {
        const updatedFields = category.fields.map((row) =>
          row.map((field) =>
            field.id === fieldId ? { ...field, label: editedLabelText } : field
          )
        );
        return { ...category, fields: updatedFields };
      }
      return category;
    });

    setCategoryFields(updatedCategories);
    setEditingLabelId(null);
    setEditedLabelText("");
  };

  // Add new field to a category
  const addNewField = (categoryId, rowIndex) => {
    const updatedCategories = categoryFields.map((category) => {
      if (category.id === categoryId) {
        const newFields = [...category.fields];

        // If rowIndex is provided, add to that specific row
        if (rowIndex !== undefined) {
          const newField = { id: generateId(), label: "New Field", value: "" };
          newFields[rowIndex] = [...newFields[rowIndex], newField];
        } else {
          // Otherwise, add a new row with one field
          newFields.push([{ id: generateId(), label: "New Field", value: "" }]);
        }

        return { ...category, fields: newFields };
      }
      return category;
    });

    setCategoryFields(updatedCategories);
  };

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    const updatedCategories = categoryFields.map((category) =>
      category.id === categoryId
        ? { ...category, expanded: !category.expanded }
        : category
    );
    setCategoryFields(updatedCategories);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-md shadow-sm mb-4">
          <div className="bg-[#2B86AA] text-white p-3 rounded-t-md flex justify-between items-center">
            <div>
              <p className="text-sm">PI Creation</p>
              <input
                type="text"
                value={companyDetails.companyName}
                onChange={(e) =>
                  handleCompanyDetailChange("companyName", e.target.value)
                }
                className="bg-transparent border-b border-white text-white outline-none text-lg font-medium"
              />
            </div>
            <div className="text-sm flex items-center">
              <span className="mr-2">Date:</span>
              <input
                type="text"
                value={companyDetails.date}
                onChange={(e) =>
                  handleCompanyDetailChange("date", e.target.value)
                }
                className="bg-transparent border-b border-white text-white outline-none"
              />
            </div>
          </div>

          {/* Company Details Form */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                value={companyDetails.name}
                onChange={(e) =>
                  handleCompanyDetailChange("name", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">City</label>
              <input
                type="text"
                value={companyDetails.city}
                onChange={(e) =>
                  handleCompanyDetailChange("city", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Customer Code</label>
              <input
                type="text"
                value={companyDetails.customerCode}
                onChange={(e) =>
                  handleCompanyDetailChange("customerCode", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Reference</label>
              <input
                type="text"
                value={companyDetails.reference}
                onChange={(e) =>
                  handleCompanyDetailChange("reference", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">PI No.</label>
              <input
                type="text"
                value={companyDetails.piNo}
                onChange={(e) =>
                  handleCompanyDetailChange("piNo", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Contact Person</label>
              <input
                type="text"
                value={companyDetails.contactPerson}
                onChange={(e) =>
                  handleCompanyDetailChange("contactPerson", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-end">
              <button className="flex items-center gap-1 bg-[#2B86AA] text-white px-3 py-2 rounded-md text-sm">
                <Plus size={16} />
                Add New Field
              </button>
            </div>
          </div>
        </div>

        {/* All Data Section */}
        <div className="bg-white rounded-md shadow-sm mb-4">
          <div className="p-4">
            <div className="flex items-center mb-2">
              <h2 className="font-medium text-gray-800">All Data</h2>
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                10 Product category
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Keep track of all product category and their security ratings.
            </p>
          </div>

          {/* Product Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm">
                  <th className="p-3 border-b border-r border-gray-200 w-12"></th>
                  <th className="p-3 border-b border-r border-gray-200 w-12">
                    <div className="flex items-center">
                      S.No
                      <Plus
                        size={16}
                        className="ml-2 cursor-pointer text-blue-500"
                      />
                    </div>
                  </th>
                  <th className="p-3 border-b border-r border-gray-200 font-medium text-gray-700">
                    <div className="flex items-center">
                      Article Name
                      <Plus
                        size={16}
                        className="ml-2 cursor-pointer text-blue-500"
                      />
                    </div>
                  </th>
                  <th className="p-3 border-b border-r border-gray-200 font-medium text-gray-700">
                    <div className="flex items-center">
                      HSN Code
                      <Plus
                        size={16}
                        className="ml-2 cursor-pointer text-blue-500"
                      />
                    </div>
                  </th>
                  <th className="p-3 border-b border-r border-gray-200 font-medium text-gray-700">
                    <div className="flex items-center">
                      UoM
                      <Plus
                        size={16}
                        className="ml-2 cursor-pointer text-blue-500"
                      />
                    </div>
                  </th>
                  <th className="p-3 border-b border-r border-gray-200 font-medium text-gray-700">
                    <div className="flex items-center">
                      Quantity
                      <Plus
                        size={16}
                        className="ml-2 cursor-pointer text-blue-500"
                      />
                    </div>
                  </th>
                  <th className="p-3 border-b border-r border-gray-200 font-medium text-gray-700">
                    <div className="flex items-center">
                      Rate per unit
                      <Plus
                        size={16}
                        className="ml-2 cursor-pointer text-blue-500"
                      />
                    </div>
                  </th>
                  <th className="p-3 border-b border-r border-gray-200 font-medium text-gray-700">
                    <div className="flex items-center">
                      GST%
                      <Plus
                        size={16}
                        className="ml-2 cursor-pointer text-blue-500"
                      />
                    </div>
                  </th>
                  <th className="p-3 border-b border-gray-200 font-medium text-gray-700">
                    <div className="flex items-center">
                      Total Amount
                      <Plus
                        size={16}
                        className="ml-2 cursor-pointer text-blue-500"
                      />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.id} className="hover:bg-blue-50">
                    <td className="p-3 border-b border-r border-gray-200 text-center">
                      {row.id}
                    </td>
                    <td className="p-3 border-b border-r border-gray-200">
                      <input
                        type="text"
                        value={row.product}
                        onChange={(e) =>
                          handleTableDataChange(
                            row.id,
                            "product",
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent outline-none"
                      />
                    </td>
                    <td className="p-3 border-b border-r border-gray-200">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) =>
                          handleTableDataChange(
                            row.id,
                            "description",
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent outline-none"
                      />
                    </td>
                    <td className="p-3 border-b border-r border-gray-200">
                      <input
                        type="text"
                        value={row.hsnCode}
                        onChange={(e) =>
                          handleTableDataChange(
                            row.id,
                            "hsnCode",
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent outline-none"
                      />
                    </td>
                    <td className="p-3 border-b border-r border-gray-200">
                      <input
                        type="text"
                        value={row.uom}
                        onChange={(e) =>
                          handleTableDataChange(row.id, "uom", e.target.value)
                        }
                        className="w-full bg-transparent outline-none"
                      />
                    </td>
                    <td className="p-3 border-b border-r border-gray-200">
                      <input
                        type="text"
                        value={row.quantity}
                        onChange={(e) =>
                          handleTableDataChange(
                            row.id,
                            "quantity",
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent outline-none"
                      />
                    </td>
                    <td className="p-3 border-b border-r border-gray-200">
                      <input
                        type="text"
                        value={row.rate}
                        onChange={(e) =>
                          handleTableDataChange(row.id, "rate", e.target.value)
                        }
                        className="w-full bg-transparent outline-none"
                      />
                    </td>
                    <td className="p-3 border-b border-r border-gray-200">
                      <input
                        type="text"
                        value={row.gst}
                        onChange={(e) =>
                          handleTableDataChange(row.id, "gst", e.target.value)
                        }
                        className="w-full bg-transparent outline-none"
                      />
                    </td>
                    <td className="p-3 border-b border-gray-200 relative">
                      <input
                        type="text"
                        value={row.totalAmount}
                        onChange={(e) =>
                          handleTableDataChange(
                            row.id,
                            "totalAmount",
                            e.target.value
                          )
                        }
                        className="w-full bg-transparent outline-none"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {row.totalDescription}
                      </div>
                      <div className="absolute right-2 top-2 flex space-x-2">
                        <Edit
                          size={16}
                          className="text-gray-500 cursor-pointer"
                        />
                        <Trash
                          size={16}
                          className="text-gray-500 cursor-pointer"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Fields */}
        {categoryFields.map((category, index) => (
          <div
            key={category.id}
            className="bg-white rounded-md shadow-sm mb-4 overflow-hidden"
          >
            <div
              className="flex items-center justify-between p-3 cursor-pointer border-b border-gray-200"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center">
                <span className="text-gray-800 font-medium mr-2">
                  Category name:
                </span>
                <input
                  type="text"
                  value={category.categoryName}
                  onChange={(e) => {
                    const updatedCategories = [...categoryFields];
                    updatedCategories[index].categoryName = e.target.value;
                    setCategoryFields(updatedCategories);
                  }}
                  className="bg-transparent outline-none border-b border-gray-300"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="mx-2 h-5 border-r border-gray-300"></div>
                <span className="text-gray-800 font-medium mr-2">
                  Article Name:
                </span>
              </div>
              <div className="flex items-center">
                <button className="flex items-center gap-1 bg-[#2B86AA] text-white px-3 py-1 rounded-md text-sm mx-2">
                  <Plus size={16} />
                  Add New Field
                </button>
                {category.expanded ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </div>
            </div>

            {category.expanded && (
              <div className="p-4">
                {category.fields.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"
                  >
                    {row.map((field) => (
                      <div key={field.id} className="relative">
                        <label
                          className="block text-sm mb-1 cursor-pointer hover:text-blue-600"
                          onClick={() =>
                            startEditingLabel(
                              category.id,
                              field.id,
                              field.label
                            )
                          }
                        >
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
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  saveEditedLabel(category.id, field.id);
                                }
                              }}
                              className="w-full bg-transparent outline-none border-b border-blue-500 text-blue-600"
                            />
                          ) : (
                            <span>{field.label}</span>
                          )}
                        </label>
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
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 my-6">
          <button className="bg-[#2B86AA] text-white px-8 py-2 rounded-md shadow-sm">
            Publish
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-8 py-2 rounded-md shadow-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformaInvoice;
