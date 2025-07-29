import React, { useState, useRef, useEffect } from "react";
import { Plus, Edit, Trash, ChevronUp, ChevronDown, X } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCompany } from "../../../services/context/company";
import Loader from "../../../common/Loader";
import { showToast } from "../../../services/config/toast";
import { Toaster } from "react-hot-toast";

const IndentModule = ({ onClose }) => {
  // Company details
  const [isLoading, setIsLoading] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({
    department: "",
    indentNo: "",
    indentDate: "",
    piNo: "",
    piDate: "",
    plantCode: "",
    customer: "",
    shipmentDate: "",
    materialDueDate: "",
    referenceNo: "",
    customerPONo: "",
  });

  const [expandableTableData, setExpandableTableData] = useState([
    {
      id: "A",
      title: "100 % Normal Cotton canvas - 10 Oz Natural washed fabric - 10×6",
      expanded: true,
      dynamicColumns: [],
      subRows: [
        {
          id: "01",
          materialName: "Large Tote Bag stripe handle bag - Toronto",
          uom: "0.38",
          quantity: "1200",
          totalMtrs: "456",
          dynamicValues: {},
          isNewlyAdded: false,
        },
        {
          id: "02",
          materialName: "Large Tote Bag stripe handle bag -Alberta",
          uom: "0.38",
          quantity: "200",
          totalMtrs: "76",
          dynamicValues: {},
          isNewlyAdded: false,
        },
        {
          id: "03",
          materialName: "Large Tote Bag stripe handle bag -Ottawa",
          uom: "0.38",
          quantity: "250",
          totalMtrs: "95",
          dynamicValues: {},
          isNewlyAdded: false,
        },
      ],
    },
    {
      id: "B",
      title: "100 % Normal cotton canvas 8 Oz Natural washed fabric. - 16 ×8",
      expanded: false,
      dynamicColumns: [],
      subRows: [
        {
          id: "01",
          materialName: "Sample Material B1",
          uom: "0.40",
          quantity: "800",
          totalMtrs: "320",
          dynamicValues: {},
          isNewlyAdded: false,
        },
        {
          id: "02",
          materialName: "Sample Material B2",
          uom: "0.45",
          quantity: "600",
          totalMtrs: "270",
          dynamicValues: {},
          isNewlyAdded: false,
        },
      ],
    },
    {
      id: "C",
      title: "100% Normal cotton canvas 12 Oz Natural (unwashed) fabric",
      expanded: false,
      dynamicColumns: [],
      subRows: [
        {
          id: "01",
          materialName: "Sample Material C1",
          uom: "0.50",
          quantity: "1000",
          totalMtrs: "500",
          dynamicValues: {},
          isNewlyAdded: false,
        },
      ],
    },
  ]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [editedColumnName, setEditedColumnName] = useState("");
  const [editorValue, setEditorValue] = useState("");
  const columnInputRef = useRef(null);
  const { company } = useCompany();
  const handleCompanyDetailChange = (field, value) => {
    setCompanyDetails((prev) => ({ ...prev, [field]: value }));
  };
  const companyAddressParts = [company?.address1, company?.address2].filter(
    Boolean
  );
  const combinedCompanyAddress =
    companyAddressParts.length > 0 ? companyAddressParts.join(", ") : "";

  const handleCancel = async () => {
    if (onClose) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
      onClose();
    }
  };
  const toggleExpandableRow = (rowId) => {
    setExpandableTableData((prev) =>
      prev.map((row) =>
        row.id === rowId ? { ...row, expanded: !row.expanded } : row
      )
    );
  };

  const handleSubRowChange = (parentId, subRowId, field, value) => {
    setExpandableTableData((prev) =>
      prev.map((row) =>
        row.id === parentId
          ? {
              ...row,
              subRows: row.subRows.map((subRow) =>
                subRow.id === subRowId ? { ...subRow, [field]: value } : subRow
              ),
            }
          : row
      )
    );
  };

  const handleDynamicColumnChange = (parentId, subRowId, columnId, value) => {
    setExpandableTableData((prev) =>
      prev.map((row) =>
        row.id === parentId
          ? {
              ...row,
              subRows: row.subRows.map((subRow) =>
                subRow.id === subRowId
                  ? {
                      ...subRow,
                      dynamicValues: {
                        ...subRow.dynamicValues,
                        [columnId]: value,
                      },
                    }
                  : subRow
              ),
            }
          : row
      )
    );
  };

  const addDynamicColumn = (parentId) => {
    const newColumnId = `col_${Date.now()}`;
    const newColumnName = "Type here";

    setExpandableTableData((prev) =>
      prev.map((row) =>
        row.id === parentId
          ? {
              ...row,
              dynamicColumns: [
                ...row.dynamicColumns,
                { id: newColumnId, name: newColumnName },
              ],
              subRows: row.subRows.map((subRow) => ({
                ...subRow,
                dynamicValues: {
                  ...subRow.dynamicValues,
                  [newColumnId]: "",
                },
              })),
            }
          : row
      )
    );
  };

  const updateDynamicColumnName = (parentId, columnId, newName) => {
    setExpandableTableData((prev) =>
      prev.map((row) =>
        row.id === parentId
          ? {
              ...row,
              dynamicColumns: row.dynamicColumns.map((col) =>
                col.id === columnId ? { ...col, name: newName } : col
              ),
            }
          : row
      )
    );
  };

  const startEditingColumnName = (columnId, currentName) => {
    setEditingColumnId(columnId);
    setEditedColumnName(currentName);
    setTimeout(() => {
      if (columnInputRef.current) {
        columnInputRef.current.focus();
        columnInputRef.current.select();
      }
    }, 0);
  };

  const saveEditedColumnName = (parentId, columnId) => {
    if (editedColumnName.trim()) {
      updateDynamicColumnName(parentId, columnId, editedColumnName.trim());
    }
    setEditingColumnId(null);
    setEditedColumnName("");
  };

  const cancelEditingColumnName = () => {
    setEditingColumnId(null);
    setEditedColumnName("");
  };

  const removeDynamicColumn = (parentId, columnId) => {
    setExpandableTableData((prev) =>
      prev.map((row) =>
        row.id === parentId
          ? {
              ...row,
              dynamicColumns: row.dynamicColumns.filter(
                (col) => col.id !== columnId
              ),
              subRows: row.subRows.map((subRow) => {
                const newDynamicValues = { ...subRow.dynamicValues };
                delete newDynamicValues[columnId];
                return {
                  ...subRow,
                  dynamicValues: newDynamicValues,
                };
              }),
            }
          : row
      )
    );
  };

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

  const addNewSubRow = (parentId) => {
    const parentRow = expandableTableData.find((row) => row.id === parentId);
    const newSubRowId = String(parentRow.subRows.length + 1).padStart(2, "0");

    const newSubRow = {
      id: newSubRowId,
      materialName: "",
      uom: "",
      quantity: "",
      totalMtrs: "",
      dynamicValues: {},
      isNewlyAdded: true,
    };
    parentRow.dynamicColumns.forEach((col) => {
      newSubRow.dynamicValues[col.id] = "";
    });

    setExpandableTableData((prev) =>
      prev.map((row) =>
        row.id === parentId
          ? {
              ...row,
              subRows: [...row.subRows, newSubRow],
            }
          : row
      )
    );
  };

  const removeSubRow = (parentId, subRowId) => {
    setExpandableTableData((prev) =>
      prev.map((row) =>
        row.id === parentId
          ? {
              ...row,
              subRows: row.subRows.filter((subRow) => subRow.id !== subRowId),
            }
          : row
      )
    );
  };

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setNewCategoryName("");
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      return () => document.removeEventListener("keydown", handleEscapeKey);
    }
  }, [isDropdownOpen]);

  const handlePublish = async () => {
    try {
      setIsLoading(true);

      // Wait for 2 seconds to show the loader
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Your form submission logic goes here
      // For example: await submitForm(formData);

      showToast.success("Indent Created successfully");
      handleCancel()
    } catch (error) {
      console.error(error);
      showToast.error("Failed to publish the indent", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="bg-gray-50 p-4">
      {isLoading && <Loader />}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2b86aa; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #1b6a8c; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #2b86aa #f1f5f9; }
      `}</style>
      <Toaster />
      <div className="max-w-7xl mx-auto">
        <div className="bg-[linear-gradient(346.16deg,#2B86AA_42.92%,#69B9D9_139.13%)] border border-[#ABE7FF] text-white px-6 py-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/30">
            <h1 className="text-md font-regular">Indent Creation</h1>
            <div className="text-sm font-regular">
              Date: {companyDetails.indentDate}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="bg-white text-[#171A1F] px-6 py-3 rounded-lg shadow-sm">
              <div className="text-sm font-bold">LOGO Image</div>
            </div>
            <div className="flex-1 text-center mx-8">
              <div className="text-base font-regular">
                {company?.companyName}
              </div>
            </div>
            <div className="text-right">
              <div className="text-base font-regular">
                {combinedCompanyAddress}
              </div>
            </div>
          </div>
        </div>
        {/* Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 py-2 gap-4">
          {[
            "department",
            "indentNo",
            "indentDate",
            "piNo",
            "piDate",
            "plantCode",
            "customer",
            "shipmentDate",
            "materialDueDate",
            "referenceNo",
            "customerPONo",
          ].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-xs mb-1 h-6 flex items-center capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                value={companyDetails[field]}
                onChange={(e) =>
                  handleCompanyDetailChange(field, e.target.value)
                }
                className="border border-[#B3E2FF] rounded px-2 py-1 text-xs shadow-inner focus:outline-none focus:ring-1 focus:ring-[#2B86AA]"
              />
            </div>
          ))}
        </div>

        {/* Simple Material Table */}
        <div className="bg-white mt-4 rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F1FBFF] border-b border-[#EAECF0]">
                  <th className="py-3 px-4 text-left text-sm font-bold text-[#002533] border-r border-[#EAECF0] w-12">
                    <svg width="28" height="20" viewBox="0 0 32 24" fill="none">
                      <rect
                        x="0"
                        y="2"
                        width="32"
                        height="3"
                        rx="1.5"
                        fill="#000000"
                      />
                      <rect
                        x="0"
                        y="8"
                        width="20"
                        height="3"
                        rx="1.5"
                        fill="#000000"
                      />
                      <rect
                        x="0"
                        y="14"
                        width="28"
                        height="3"
                        rx="1.5"
                        fill="#000000"
                      />
                      <rect
                        x="0"
                        y="20"
                        width="20"
                        height="3"
                        rx="1.5"
                        fill="#000000"
                      />
                    </svg>
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-[#002533] border-r border-[#EAECF0]">
                    Material Name
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-medium text-[#002533] border-r border-[#EAECF0]">
                    UOM
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-medium text-[#002533] border-r border-[#EAECF0]">
                    Quantity
                  </th>
                  <th className="py-3 px-4 text-center text-sm font-medium text-[#002533]">
                    Total Mtrs.
                  </th>
                </tr>
              </thead>
              <tbody>
                {expandableTableData.map((row, index) => (
                  <tr key={row.id} className="border-b border-[#EAECF0] ">
                    <td className="py-3 px-4 text-center font-medium text-[#171A1F] border-r border-[#EAECF0]">
                      {row.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-[#171A1F] border-r border-[#EAECF0]">
                      {row.title}
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-[#171A1F] border-r border-[#EAECF0]">
                      57"W
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-[#171A1F] border-r border-[#EAECF0]">
                      5000
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-[#171A1F]">
                      1774
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expandable Product Table */}
        <div className=" mt-4 rounded-lg shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            {expandableTableData.map((row, index) => (
              <div
                key={row.id}
                className="bg-[#F1FBFF] mt-4 py-2 rounded-lg shadow-sm border border-[#2B86AA]"
              >
                <div className="overflow-x-auto custom-scrollbar">
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer transition-colors"
                    onClick={() => toggleExpandableRow(row.id)}
                  >
                    <div className="flex items-center">
                      <span className="w-8 text-center font-bold text-[#171A1F] mr-4">
                        {row.id}
                      </span>
                      <span className="text-sm font-medium text-[#171A1F]">
                        {row.title}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpandableRow(row.id);
                      }}
                      className="text-[#171A1F] p-1 rounded"
                    >
                      {row.expanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>

                  {/* Sub Rows */}
                  {row.expanded && (
                    <div className="bg-white border-t border-[#2B86AA]">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F1FBFF] border-b border-[#2B86AA]">
                            <th className="py-1 px-4 text-sm font-medium text-[#171A1F] text-center border-r border-[#2B86AA] w-16">
                              S no.
                            </th>
                            <th className="py-1 px-4 text-sm font-medium text-[#171A1F] text-left border-r border-[#2B86AA]">
                              Material / Article Name
                            </th>
                            <th className="py-1 px-4 text-sm font-medium text-[#171A1F] text-center border-r border-[#2B86AA] w-24">
                              UOM
                            </th>
                            <th className="py-1 px-4 text-sm font-medium text-[#171A1F] text-center border-r border-[#2B86AA] w-24">
                              Quantity
                            </th>
                            <th className="py-1 px-4 text-sm font-medium text-[#171A1F] text-center border-r border-[#2B86AA] w-24">
                              Total Mtrs.
                            </th>
                            {/* Dynamic columns */}
                            {row.dynamicColumns.map((column) => (
                              <th
                                key={column.id}
                                className="py-2 px-4 text-sm font-medium text-[#171A1F] text-center border-r border-[#2B86AA] w-24 relative"
                              >
                                <div className="flex items-center justify-center gap-1">
                                  <div
                                    className="cursor-pointer px-2 py-1 rounded flex-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startEditingColumnName(
                                        column.id,
                                        column.name
                                      );
                                    }}
                                  >
                                    {editingColumnId === column.id ? (
                                      <input
                                        ref={columnInputRef}
                                        type="text"
                                        value={editedColumnName}
                                        onChange={(e) =>
                                          setEditedColumnName(e.target.value)
                                        }
                                        onBlur={() =>
                                          saveEditedColumnName(
                                            row.id,
                                            column.id
                                          )
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            saveEditedColumnName(
                                              row.id,
                                              column.id
                                            );
                                          } else if (e.key === "Escape") {
                                            cancelEditingColumnName();
                                          }
                                        }}
                                        className="w-full bg-white rounded px-1 py-0.5 text-xs"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    ) : (
                                      column.name
                                    )}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeDynamicColumn(row.id, column.id);
                                    }}
                                    className="w-4 h-4 rounded-full bg-red-400 hover:bg-red-500 flex items-center justify-center text-white"
                                  >
                                    <X size={10} />
                                  </button>
                                </div>
                              </th>
                            ))}
                            <th className="py-2 px-4 text-xs font-medium text-[#171A1F] text-center w-20">
                              <div className="flex justify-center gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addDynamicColumn(row.id);
                                  }}
                                  className="w-5 h-5 rounded-full bg-blue-400 hover:bg-blue-500 flex items-center justify-center"
                                >
                                  <span className="text-white text-xs">+</span>
                                </button>
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {row.subRows.map((subRow) => (
                            <tr
                              key={subRow.id}
                              className="border-b border-[#2B86AA]"
                            >
                              <td className="py-2 px-4 text-xs text-center font-medium text-[#171A1F] border-r border-[#2B86AA]">
                                {subRow.id}
                              </td>
                              <td className="py-2 px-4 border-r border-[#2B86AA]">
                                <input
                                  type="text"
                                  value={subRow.materialName}
                                  onChange={(e) =>
                                    handleSubRowChange(
                                      row.id,
                                      subRow.id,
                                      "materialName",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter material name"
                                  className="w-full bg-transparent text-xs focus:bg-blue-25 rounded px-2 py-1 border-none focus:outline-none placeholder-gray-400"
                                />
                              </td>
                              <td className="py-2 px-4 border-r border-[#2B86AA]">
                                <input
                                  type="text"
                                  value={subRow.uom}
                                  onChange={(e) =>
                                    handleSubRowChange(
                                      row.id,
                                      subRow.id,
                                      "uom",
                                      e.target.value
                                    )
                                  }
                                  placeholder="UOM"
                                  className="w-full bg-transparent text-xs text-center focus:bg-blue-25 rounded px-2 py-1 border-none focus:outline-none placeholder-gray-400"
                                />
                              </td>
                              <td className="py-2 px-4 border-r border-[#2B86AA]">
                                <input
                                  type="text"
                                  value={subRow.quantity}
                                  onChange={(e) =>
                                    handleSubRowChange(
                                      row.id,
                                      subRow.id,
                                      "quantity",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Quantity"
                                  className="w-full bg-transparent text-xs text-center focus:bg-blue-25 rounded px-2 py-1 border-none focus:outline-none placeholder-gray-400"
                                />
                              </td>
                              <td className="py-2 px-4 border-r border-[#2B86AA]">
                                <input
                                  type="text"
                                  value={subRow.totalMtrs}
                                  onChange={(e) =>
                                    handleSubRowChange(
                                      row.id,
                                      subRow.id,
                                      "totalMtrs",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Total Mtrs"
                                  className="w-full bg-transparent text-xs text-center focus:bg-blue-25 rounded px-2 py-1 border-none focus:outline-none placeholder-gray-400"
                                />
                              </td>
                              {row.dynamicColumns.map((column) => (
                                <td
                                  key={column.id}
                                  className="py-2 px-4 border-r border-[#2B86AA]"
                                >
                                  <input
                                    type="text"
                                    value={
                                      subRow.dynamicValues[column.id] || ""
                                    }
                                    onChange={(e) =>
                                      handleDynamicColumnChange(
                                        row.id,
                                        subRow.id,
                                        column.id,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Type here"
                                    className="w-full bg-transparent text-xs text-center focus:none rounded px-2 py-1 border-none focus:outline-none placeholder-gray-400"
                                  />
                                </td>
                              ))}
                              <td className="py-2 px-4 text-center">
                                <div className="flex justify-center gap-1">
                                  {subRow.isNewlyAdded && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeSubRow(row.id, subRow.id);
                                      }}
                                      className="w-5 h-5 rounded-full bg-red-400 hover:bg-red-500 flex items-center justify-center"
                                    >
                                      <span className="text-white text-xs">
                                        x
                                      </span>
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addNewSubRow(row.id);
                                    }}
                                    className="w-5 h-5 rounded-full bg-blue-400 hover:bg-blue-500 flex items-center justify-center"
                                  >
                                    <span className="text-white text-xs">
                                      +
                                    </span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 mb-3 ">
          <label className="block text-sm font-medium px-2 text-black mb-2">
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

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 my-6">
          <button
            className="bg-[#2B86AA] text-white px-8 py-2 rounded-md shadow-sm hover:bg-[#227499] transition-colors"
            onClick={handlePublish}
          >
            Publish
          </button>
          <button
            className="bg-white border border-gray-300 text-gray-700 px-8 py-2 rounded-md shadow-sm transition-colors"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndentModule;
