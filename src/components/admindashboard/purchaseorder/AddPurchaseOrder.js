import React, { useState, useRef, useEffect } from "react";
import { Plus, Edit, Trash, ChevronUp, ChevronDown, X } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCompany } from "../../../services/context/company";

const PurchaseOrders = ({ onBack }) => {
  // Mock data for dropdowns - replace with your actual data
  const vendorCodes = [
    { code: "VEN-001", name: "ABC Suppliers Ltd" },
    { code: "VEN-002", name: "XYZ Industries" },
    { code: "VEN-003", name: "Global Trading Co" },
    { code: "VEN-004", name: "Premium Materials Inc" },
    { code: "VEN-005", name: "Quick Supply Chain" }
  ];

  const plantCodes = [
    { code: "PL-01", name: "Plant Mumbai" },
    { code: "PL-02", name: "Plant Delhi" },
    { code: "PL-03", name: "Plant Bangalore" },
    { code: "PL-04", name: "Plant Chennai" },
    { code: "PL-05", name: "Plant Kolkata" }
  ];

  const { company } = useCompany();

  // Company details
  const [vernderDetails, setVernderDetails] = useState({
    venderCode: "",
    venderName: "",
    address: "",
    contactPerson: "",
    pINo: "",
    pIDate: "",
    reference: "",
  });

  const [poDetails, setPoDetails] = useState({
    pONo: "",
    plantCode: "",
    department: "",
    indentNo: "",
    deliveryDate: "",
  });

  // Fixed column structure with proper label and key properties
  const [columns, setColumns] = useState([
    { key: "plantCode", label: "Plant Code" },
    { key: "material", label: "Material" },
    { key: "hsnCode", label: "HSN Code" },
    { key: "quantity", label: "Quantity" },
    { key: "ratePerUnit", label: "Rate Per Unit" },
    { key: "cgst", label: "CGST %" },
    { key: "sgst", label: "SGST %" },
    { key: "igst", label: "IGST %" },
    { key: "ugst", label: "UGST %" },
    { key: "totalAmount", label: "Total Amount" },
  ]);

  const [tableData, setTableData] = useState([{ id: 1, isDefault: true }, { id: 2, isDefault: true }]);
  const [newRowId, setNewRowId] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editorValue, setEditorValue] = useState("");

  // Dropdown states
  const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
  const [plantDropdownOpen, setPlantDropdownOpen] = useState(false);
  const [rowPlantDropdowns, setRowPlantDropdowns] = useState({});

  const handleVernderDetailChange = (field, value) => {
    setVernderDetails((prev) => {
      const newDetails = { ...prev, [field]: value };
      
      // Auto-fill vendor name when vendor code is selected
      if (field === 'venderCode') {
        const selectedVendor = vendorCodes.find(vendor => vendor.code === value);
        if (selectedVendor) {
          newDetails.venderName = selectedVendor.name;
        }
      }
      
      return newDetails;
    });
  };

  const handlePoDetailChange = (field, value) => {
    setPoDetails((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate total amount for a row
  const calculateRowTotal = (row) => {
    const quantity = parseFloat(row.quantity) || 0;
    const ratePerUnit = parseFloat(row.ratePerUnit) || 0;
    const cgst = parseFloat(row.cgst) || 0;
    const sgst = parseFloat(row.sgst) || 0;
    const igst = parseFloat(row.igst) || 0;
    const ugst = parseFloat(row.ugst) || 0;

    const baseAmount = quantity * ratePerUnit;
    const totalTaxRate = cgst + sgst + igst + ugst;
    const taxAmount = (baseAmount * totalTaxRate) / 100;
    const totalAmount = baseAmount + taxAmount;

    return totalAmount.toFixed(2);
  };

  const handleTableDataChange = (rowIndex, colKey, value) => {
    setTableData((prev) => {
      const newData = [...prev];
      newData[rowIndex] = { ...newData[rowIndex], [colKey]: value };
      
      // Auto-calculate total amount when relevant fields change
      if (['quantity', 'ratePerUnit', 'cgst', 'sgst', 'igst', 'ugst'].includes(colKey)) {
        newData[rowIndex].totalAmount = calculateRowTotal(newData[rowIndex]);
      }
      
      return newData;
    });
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    return tableData.reduce((total, row) => {
      return total + (parseFloat(row.totalAmount) || 0);
    }, 0).toFixed(2);
  };

  const companyAddressParts = [company?.address1, company?.address2].filter(
    Boolean
  );
  const combinedCompanyAddress =
    companyAddressParts.length > 0 ? companyAddressParts.join(", ") : "";

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

  const formatFieldLabel = (field) => {
  const specialCases = {
    'pONo': 'PO No',
    'pINo': 'PI No',
    'pIDate': 'PI Date',
    'venderCode': 'Vendor Code',
    'venderName': 'Vendor Name',
    'contactPerson': 'Contact Person',
    'plantCode': 'Plant Code',
    'indentNo': 'Indent No',
    'deliveryDate': 'Delivery Date',
    'address': 'Address',
    'reference': 'Reference',
    'department': 'Department'
  };
  
  if (specialCases[field]) {
    return specialCases[field];
  }
  
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
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

  const addTableRow = () => {
    setTableData((prev) => {
      const newId =
        prev.length > 0 ? Math.max(...prev.map((row) => row.id)) + 1 : 1;
      setNewRowId(newId);
      return [...prev, { id: newId, isDefault: false }];
    });
  };

  const removeTableRow = (rowId) => {
    setTableData((prev) => prev.filter((row) => row.id !== rowId));
  };

  const toggleRowPlantDropdown = (rowId) => {
    setRowPlantDropdowns(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        setNewCategoryName("");
        setVendorDropdownOpen(false);
        setPlantDropdownOpen(false);
        setRowPlantDropdowns({});
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  return (
    <div className="bg-gray-50 p-4">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2b86aa; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #1b6a8c; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #2b86aa #f1f5f9; }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <div className="bg-[linear-gradient(346.16deg,#2B86AA_42.92%,#69B9D9_139.13%)] border border-[#ABE7FF] text-white px-6 py-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/30">
            <h1 className="text-md font-regular">Purchase Order Creation</h1>
            <div className="text-sm font-regular">
              Date: {vernderDetails.piDate}
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
        
        {/* Vendor Details Header */}
        <div className="border border-[#B3E2FF] mt-5 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 py-2 px-5 gap-4">
            {[
              "venderCode",
              "venderName",
              "address",
              "contactPerson",
              "pINo",
              "pIDate",
              "reference",
            ].map((field) => (
              <div
                key={field}
                className={`flex flex-col ${
                  field === "pINo" ? "lg:col-span-2" : ""
                }`}
              >
                <label className="text-xs mb-1 h-6 flex items-center capitalize">
                 {formatFieldLabel(field)}
                </label>
                
                {field === "venderCode" ? (
                  <div className="relative">
                    <button
                      onClick={() => setVendorDropdownOpen(!vendorDropdownOpen)}
                      className="w-full border border-[#B3E2FF] rounded px-2 py-1 text-xs shadow-inner focus:outline-none focus:ring-1 focus:ring-[#2B86AA] text-left flex justify-between items-center"
                    >
                      <span>{vernderDetails[field] || "Select Vendor Code"}</span>
                      <ChevronDown size={12} />
                    </button>
                    {vendorDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {vendorCodes.map((vendor) => (
                          <div
                            key={vendor.code}
                            onClick={() => {
                              handleVernderDetailChange(field, vendor.code);
                              setVendorDropdownOpen(false);
                            }}
                            className="px-3 py-2 text-xs hover:bg-blue-50 cursor-pointer"
                          >
                            <div className="font-medium">{vendor.code}</div>
                            <div className="text-gray-600">{vendor.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={vernderDetails[field]}
                    onChange={(e) =>
                      handleVernderDetailChange(field, e.target.value)
                    }
                    readOnly={field === "venderName"}
                    className={`border border-[#B3E2FF] rounded px-2 py-1 text-xs shadow-inner focus:outline-none focus:ring-1 focus:ring-[#2B86AA] ${
                      field === "pINo" ? "bg-[#FFEAB0] border border-[#E7BD00] " : ""
                    } ${field === "venderName" ? "bg-gray-100" : ""}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PO Details Header */}
        <div className="border border-[#B3E2FF] mt-5 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 py-2 px-5 gap-4">
            {[
              "pONo",
              "plantCode",
              "department",
              "indentNo",
              "deliveryDate",
            ].map((field) => (
              <div key={field} className={`flex flex-col`}>
                <label className="text-xs mb-1 h-6 flex items-center capitalize">
                 {formatFieldLabel(field)}
                </label>
                {field === "plantCode" ? (
                  <div className="relative">
                    <button
                      onClick={() => setPlantDropdownOpen(!plantDropdownOpen)}
                      className="w-full border border-[#B3E2FF] rounded px-2 py-1 text-xs shadow-inner focus:outline-none focus:ring-1 focus:ring-[#2B86AA] text-left flex justify-between items-center"
                    >
                      <span>{poDetails[field] || "Select Plant Code"}</span>
                      <ChevronDown size={12} />
                    </button>
                    {plantDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {plantCodes.map((plant) => (
                          <div
                            key={plant.code}
                            onClick={() => {
                              handlePoDetailChange(field, plant.code);
                              setPlantDropdownOpen(false);
                            }}
                            className="px-3 py-2 text-xs hover:bg-blue-50 cursor-pointer"
                          >
                            <div className="font-medium">{plant.code}</div>
                            <div className="text-gray-600">{plant.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={poDetails[field]}
                    onChange={(e) =>
                      handlePoDetailChange(field, e.target.value)
                    }
                    className="border border-[#B3E2FF] rounded px-2 py-1 text-xs shadow-inner focus:outline-none focus:ring-1 focus:ring-[#2B86AA]"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Table Section */}
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
                        <span className="text-xs font-medium text-gray-700 text-center">
                          {col.label}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className="w-8 px-0 py-1 text-xs font-medium text-gray-700 text-center border-blue-200 bg-white">
                    
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    className="border-b border-blue-200 hover:bg-blue-25"
                  >
                    <td className="py-1 border-r border-blue-200 text-center font-medium text-gray-700 bg-blue-25 text-xs">
                      {row.id}.
                    </td>
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className="py-1 border-r border-blue-200 relative"
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
                        {col.key === "plantCode" ? (
                          <div className="relative">
                            <button
                              onClick={() => toggleRowPlantDropdown(row.id)}
                              className="w-full bg-transparent outline-none text-center text-xs focus:bg-blue-50 rounded px-0 py-1 flex justify-between items-center"
                              disabled={!poDetails.plantCode}
                            >
                              <span className="flex-1">{row[col.key] || (poDetails.plantCode ? "" : "Select plant first")}</span>
                              {poDetails.plantCode && <ChevronDown size={10} />}
                            </button>
                            {rowPlantDropdowns[row.id] && poDetails.plantCode && (
                              <div className="absolute z-50 left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-32 overflow-y-auto min-w-32">
                                {plantCodes
                                  .filter(plant => plant.code === poDetails.plantCode)
                                  .map((plant) => (
                                    <div
                                      key={plant.code}
                                      onClick={() => {
                                        handleTableDataChange(rowIndex, col.key, plant.code);
                                        setRowPlantDropdowns(prev => ({
                                          ...prev,
                                          [row.id]: false
                                        }));
                                      }}
                                      className="px-2 py-1 text-xs hover:bg-blue-50 cursor-pointer"
                                    >
                                      {plant.code}
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        ) : col.key === "totalAmount" ? (
                          <input
                            type="text"
                            value={row[col.key] || "0.00"}
                            readOnly
                            className="w-full bg-gray-100 outline-none text-center text-xs rounded px-0"
                          />
                        ) : (
                          <input
                            type={['quantity', 'ratePerUnit', 'cgst', 'sgst', 'igst', 'ugst'].includes(col.key) ? "number" : "text"}
                            value={row[col.key] || ""}
                            onChange={(e) =>
                              handleTableDataChange(rowIndex, col.key, e.target.value)
                            }
                            className="w-full bg-transparent outline-none text-center text-xs focus:bg-blue-50 rounded px-0"
                            step={col.key === 'ratePerUnit' ? "0.01" : "1"}
                          />
                        )}
                      </td>
                    ))}
                    <td className="py-1 text-center bg-white w-10">
                      {!row.isDefault && (
                        <div className="flex justify-center items-center h-full">
                          <button
                            onClick={() => removeTableRow(row.id)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                            title="Remove row"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {/* Grand Total Row */}
                <tr className="border-t-2 border-blue-300 bg-blue-50">
                  <td className="py-2 border-r border-blue-200 text-center font-bold text-gray-700 text-xs">
                    Total
                  </td>
                  <td colSpan={columns.length - 1} className="py-2 border-r border-blue-200"></td>
                  <td className="py-2 border-r border-blue-200 text-center font-bold text-xs">
                    ₹{calculateGrandTotal()}
                  </td>
                  <td className="py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-end p-2">
            <button
              onClick={addTableRow}
              className="bg-[#2B86AA] hover:bg-[#227499] text-white px-4 py-1 rounded-md shadow-sm text-xs"
            >
              Add Row
            </button>
          </div>
        </div>

        {/* Notes Section */}
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
          <button className="bg-[#2B86AA] text-white px-8 py-2 rounded-md shadow-sm hover:bg-[#227499] transition-colors">
            Publish
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-8 py-2 rounded-md shadow-sm transition-colors" onClick={onBack}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrders;