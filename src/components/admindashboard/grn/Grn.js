import React, { useRef, useState, useEffect } from "react";
import AddGRN from "./AddGrn.js";
import Pagination from "../../../services/config/Pagination.js";
import Loader from "../../../common/Loader.js"

const InvoiceView = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full mx-4 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Invoice</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="border-t border-b py-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Invoice Details</h3>
              <p className="text-sm">PI Number: {data.piNumber}</p>
              <p className="text-sm">Date: {data.date}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Vendor Details</h3>
              <p className="text-sm">Name: {data.vendorName}</p>
              <p className="text-sm">Code: {data.vendorCode}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Department Information</h3>
          <p className="text-sm">Department Number: {data.departmentNumber}</p>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Invoice
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Grn = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const totalItems = 200;

  const [grns, setGrns] = useState([
    {
      _id: "1",
      piNumber: "#576252852855",
      vendorName: "XYZ.com & Co.",
      vendorCode: "228-3844-931-7089",
      departmentNumber: "02/08/2023",
      date: "2024-02-19"
    },
  ]);

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Here you would typically fetch your actual data
        // const response = await fetch('/api/grns');
        // const data = await response.json();
        // setGrns(data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading GRN data:', error);
        setLoading(false);
      }
    };

    loadData();
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

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handlePdfDropdownToggle = (id, event, rowIndex) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
      setDropdownPosition({});
    } else {
      const buttonElement = event.currentTarget;
      const totalRows = paginatedData.length;
      const position = calculateDropdownPosition(buttonElement, rowIndex, totalRows);
      setDropdownPosition({ [id]: position });
      setOpenDropdown(id);
    }
  };

  const handlePdfSelect = async (id, pdfType) => {
    setLoading(true);
    try {
      console.log(`Selected ${pdfType} for ID: ${id}`);
      // Simulate PDF generation/download process
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Add your PDF generation/download logic here
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
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

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const getFilteredData = () => {
    return grns.filter(grn => {
      const matchesSearch = Object.values(grn)
        .some(value => value.toString().toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDate = !dateFilter || grn.date === dateFilter;
      return matchesSearch && matchesDate;
    });
  };

  const paginatedData = getFilteredData().slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  const handleCreateNewGRN = () => {
    setLoading(true);
    // Simulate loading for form
    setTimeout(() => {
      setLoading(false);
      setShowForm(true);
    }, 1000);
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Export completed');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showForm) {
    return (
      <AddGRN
        onSave={(newGrn) => {
          setGrns([...grns, newGrn]);
          setShowForm(false);
        }}
        onClose={() => setShowForm(false)}
      />
    );
  }

  return (
  <>
  {loading && <Loader/>}
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

      <div className="mb-6">
        <div className="flex items-center justify-between">
          {/* Search on the left */}
          <div className="relative w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#ABE7FF] rounded-md focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
          </div>

          {/* Date filter, Export button and New GRN button on the right */}
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-[#ABE7FF] rounded-md focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <button 
              onClick={handleExport}
              disabled={loading}
              className="px-4 py-2 bg-white text-[#2B86AA] rounded-lg border border-[#2B86AA] focus:outline-none focus:ring-2  focus:ring-offset-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              <span>Export</span>
            </button>
            <button
              onClick={handleCreateNewGRN}
              disabled={loading}
              className="px-4 py-2 bg-[#2B86AA] text-white rounded-md hover:bg-[#43a6ce] flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New GRN</span>
            </button>
          </div>
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
            {paginatedData.map((grn, index) => (
              <tr key={grn._id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {grn.piNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {grn.vendorName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {grn.vendorCode}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {grn.departmentNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {grn.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button 
                      className={`text-gray-600 hover:text-gray-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={loading}
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
                        onClick={(e) => !loading && handlePdfDropdownToggle(grn._id, e, index)}
                        className={`text-gray-600 hover:text-gray-800 flex items-center gap-1 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
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
                      {openDropdown === grn._id && !loading && (
                        <div
                          className={`dropdown-menu custom-scrollbar ${
                            dropdownPosition[grn._id]?.openUp
                              ? "bottom-full mb-2"
                              : "top-full mt-2"
                          }`}
                          style={{
                            maxHeight: dropdownPosition[grn._id]?.maxHeight || "240px",
                            overflowY: "auto",
                          }}
                        >
                          {pdfOptions.map((option) => (
                            <button
                              key={option.id}
                              onClick={() =>
                                handlePdfSelect(grn._id, option.id)
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

      <Pagination
        count={totalItems}
        page={currentPage}
        rowsPerPage={rowsPerPage}
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

export default Grn;