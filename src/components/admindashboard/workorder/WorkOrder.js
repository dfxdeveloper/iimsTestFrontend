import React, { useState, useEffect, useRef } from "react";
import AddProformaInvoice from "./AddWorkOrder";
import TablePagination from "@mui/material/TablePagination";
import Loader from "../../../common/Loader";

const InvoiceView = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      {/* ... rest of the InvoiceView component code ... */}
    </div>
  );
};

const WorkOrder = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({}); 
  const dropdownRef = useRef(null);

  const [workOrders, setWorkOrder] = useState([
    {
      _id: "1",
      piNumber: "#576252852855",
      vendorName: "XYZ.com & Co.",
      vendorCode: "228-3844-931-7089",
      departmentNumber: "02/08/2023",
      date: "2024-02-19",
    },
  ]);

  // Simulate data loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate 1 second loading time
    return () => clearTimeout(timer);
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setDropdownPosition({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleExport = async () => {
    setIsLoading(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      const data = getFilteredData();
      const csv = [
        Object.keys(data[0]).join(","),
        ...data.map((item) => Object.values(item).join(",")),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", "work_orders.csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getFilteredData = () => {
    return workOrders.filter((workOrder) => {
      const matchesSearch = Object.values(workOrder).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesDate = !dateFilter || workOrder.date === dateFilter;
      return matchesSearch && matchesDate;
    });
  };

  const calculateDropdownPosition = (buttonElement, rowIndex, totalRows) => {
    const rect = buttonElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const dropdownHeight = 240; // 6 items * 40px per item approximately
    const spaceBelow = windowHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // More lenient positioning logic - prefer showing below unless clearly not enough space
    const shouldOpenUp = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight && spaceAbove > 150;

    return {
      openUp: shouldOpenUp,
      maxHeight: 240,
    };
  };

  const handlePdfDropdownToggle = (id, event, rowIndex) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
      setDropdownPosition({});
    } else {
      const buttonElement = event.currentTarget;
      const totalRows = getPaginatedData().length;
      const position = calculateDropdownPosition(buttonElement, rowIndex, totalRows);
      setDropdownPosition({ [id]: position });
      setOpenDropdown(id);
    }
  };

  const handlePdfSelect = async (id, pdfType) => {
    setIsLoading(true);
    try {
      console.log(`Selected ${pdfType} for ID: ${id}`);
      // Simulate PDF generation/download process
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Add your PDF generation/download logic here
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsLoading(false);
      setOpenDropdown(null);
      setDropdownPosition({});
    }
  };

  const pdfOptions = [
    { id: "R0", label: "" },
    { id: "R1", label: "R1" },
    { id: "R2", label: "R2" },
    { id: "R3", label: "R3" },
    { id: "R4", label: "R4" },
    { id: "R5", label: "R5" },
  ];
  
  const getPaginatedData = () => {
    const filteredData = getFilteredData();
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  };

  const handleCreateNewWorkOrder = () => {
    setIsLoading(true);
    // Simulate loading for form
    setTimeout(() => {
      setIsLoading(false);
      setShowForm(true);
    }, 1000);
  };

  if (showForm) {
    return (
      <AddProformaInvoice
        onSave={(newWorkOrder) => {
          setWorkOrder([...workOrders, newWorkOrder]);
          setShowForm(false);
        }}
        onClose={() => setShowForm(false)}
      />
    );
  }

  return (
    <>
      {isLoading && <Loader/>}
      <div className="p-4">
        <style jsx>{`
          /* Enhanced scrollbar styling for dropdown */
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f0f9ff;
            border-radius: 8px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #93c5fd;
            border-radius: 8px;
            border: 1px solid #e1f6ff;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #60a5fa;
          }

          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #93c5fd #f0f9ff;
          }

          /* Improved dropdown container and menu positioning */
          .dropdown-container {
            position: relative;
            z-index: 50;
          }

          .dropdown-menu {
            position: absolute;
            right: 0;
            min-width: 140px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #e1f6ff;
            overflow: hidden;
            z-index: 9999;
            transform: translateZ(0); /* Force hardware acceleration */
          }

          .dropdown-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            padding: 10px 12px;
            text-align: left;
            font-size: 14px;
            color: #374151;
            background: white;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            border-bottom: 1px solid #f3f4f6;
          }

          .dropdown-item:last-child {
            border-bottom: none;
          }

          .dropdown-item:hover {
            background-color: #eff6ff;
            color: #2563eb;
          }

          .pdf-badge {
            font-size: 11px;
            color: #374151;
            background-color: #d2f2ff;
            padding: 2px 8px;
            border-radius: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
          }

          .dropdown-item:hover .pdf-badge {
            background-color: #bfdbfe;
            color: #1d4ed8;
          }

          /* Ensure table doesn't interfere with dropdown */
          .table-container {
            position: relative;
            z-index: 1;
          }

          /* Fix for table overflow issues */
          .table-wrapper {
            overflow: visible;
          }
        `}</style>

        <div className="flex justify-between items-center mb-6">
          <div className="relative w-[300px]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#ABE7FF] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center gap-4">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-[#ABE7FF] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />

            <button
              onClick={handleExport}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              )}
              Export
            </button>

            <button
              onClick={handleCreateNewWorkOrder}
              disabled={isLoading}
              className="px-4 py-2 bg-[#2B86AA] text-white rounded-lg hover:bg-[#43a6ce] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Work Order
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden border-2 border-[#2B86AA]">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-[#ABE7FF] bg-[#F1FBFF]">
                <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                  PI Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Vendor Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Vendor Code
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Department Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getPaginatedData().map((workorder, index) => (
                <tr key={workorder._id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {workorder.piNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {workorder.vendorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {workorder.vendorCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {workorder.departmentNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {workorder.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        className={`text-gray-600 hover:text-gray-800 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={(e) => !isLoading && handlePdfDropdownToggle(workorder._id, e, index)}
                        className={`text-gray-600 hover:text-gray-800 flex items-center gap-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </button>

                      <div className="dropdown-container" ref={dropdownRef}>
                        {openDropdown === workorder._id && !isLoading && (
                          <div
                            className={`dropdown-menu custom-scrollbar ${
                              dropdownPosition[workorder._id]?.openUp
                                ? "bottom-full mb-2"
                                : "top-full mt-2"
                            }`}
                            style={{
                              maxHeight: dropdownPosition[workorder._id]?.maxHeight || "240px",
                              overflowY: "auto",
                            }}
                          >
                            {pdfOptions.map((option) => (
                              <button
                                key={option.id}
                                onClick={() =>
                                  handlePdfSelect(workorder._id, option.id)
                                }
                                className="dropdown-item"
                              >
                                <span>{option.label}</span>
                                <span className="pdf-badge">pdf.</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          rowsPerPageOptions={[8, 16, 24]}
          component="div"
          count={getFilteredData().length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        {selectedInvoice && (
          <InvoiceView
            data={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
          />
        )}
      </div>
    </>
  );
};

export default WorkOrder;