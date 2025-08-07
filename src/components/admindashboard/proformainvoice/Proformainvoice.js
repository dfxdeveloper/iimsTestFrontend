import React, { useState, useEffect, useCallback, useRef } from "react";
import { Toaster } from "react-hot-toast";
import AddProformaInvoice from "./AddproformaInvoice";
import Pagination from "../../../services/config/Pagination";
import { api } from "../../../services/config/axiosInstance";
import { showToast } from "../../../services/config/toast";
import Loader from "../../../common/Loader";

const ProformaInvoice = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [proformaInvoices, setProformaInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const dropdownRef = useRef(null);

  // Get user data from localStorage or context (adjust according to your auth system)
  const getUserDepartment = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user')) || {};
      return userData.department;
    } catch (error) {
      console.error('Error getting user department:', error);
      return null;
    }
  };

  const userDepartment = getUserDepartment();
  const ispermission = userDepartment === 'merchandise_marketing' || userDepartment === 'fabric' || userDepartment === 'trims' || userDepartment === 'production' || userDepartment === 'logistic';

  const fetchProformaInvoices = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await api.get("/pi");
      let data = response.data;
      if (response.data.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (!Array.isArray(response.data)) {
        throw new Error("Unexpected API response structure");
      }

      const mappedData = data
        .filter((item) => item !== null)
        .map((item) => ({
          name:
            item.partner?.clientName || item.customerCode || "Unknown Customer",
          piNumber: item.piNumber || "N/A",
          phone: item.customerCode || "N/A",
          contactPerson:
            item.partner?.contactPerson || item.contactPerson || "N/A",
          createDate: item.piDate ? item.piDate.split("T")[0] : "",
          _id: item._id || Date.now().toString(),
        }));
      setProformaInvoices(mappedData);
    } catch (error) {
      console.error("Error fetching proforma invoices:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch proforma invoices";
      setApiError(errorMessage);
      showToast.error(`Failed to fetch proforma invoices: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProformaInvoices();
  }, [fetchProformaInvoices]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getFilteredAndSortedData = () => {
    let filtered = [...proformaInvoices];

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (dateFilter) {
      filtered = filtered.filter((item) => item.createDate === dateFilter);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  };

  const getPaginatedData = () => {
    const filteredAndSortedData = getFilteredAndSortedData();
    const paginatedData = filteredAndSortedData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    return paginatedData;
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => {
    // Prevent edit if user is from merchandise_marketing department
    if (ispermission) {
      showToast.error("You don't have permission to edit proforma invoices");
      return;
    }
    setEditId(id);
    setShowForm(true);
  };

  const calculateDropdownPosition = (buttonElement, rowIndex, totalRows) => {
    const rect = buttonElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const tableContainer = buttonElement.closest(".bg-white");
    const tableRect = tableContainer
      ? tableContainer.getBoundingClientRect()
      : null;

    // Fixed dropdown height based on 6 options
    const dropdownHeight = 240; // 6 items * 40px per item approximately
    const spaceBelow = windowHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Check if we're in the last few rows or don't have enough space below
    const isLastFewRows = rowIndex >= totalRows - 2;
    const shouldOpenUp =
      (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) ||
      isLastFewRows;

    return {
      openUp: shouldOpenUp,
      maxHeight: 240, // Fixed height for consistency
    };
  };

  const handlePdfDropdownToggle = (id, event, rowIndex) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
      setDropdownPosition({});
    } else {
      const buttonElement = event.currentTarget;
      const totalRows = getPaginatedData().length;
      const position = calculateDropdownPosition(
        buttonElement,
        rowIndex,
        totalRows
      );
      setDropdownPosition({ [id]: position });
      setOpenDropdown(id);
    }
  };

  const handlePdfSelect = (id, pdfType) => {
    console.log(`Selected ${pdfType} for ID: ${id}`);
    // Add your PDF generation/download logic here
    setOpenDropdown(null); // Close dropdown after selection
    setDropdownPosition({});
  };

  const handleSavePartner = async (newPartner, isEditMode) => {
    if (isEditMode) {
      setProformaInvoices((prev) =>
        prev.map((partner) =>
          partner._id === newPartner._id
            ? {
                name: newPartner.customerCode || "Unknown Customer",
                piNumber: newPartner.piNumber || "N/A",
                phone: newPartner.customerCode || "N/A",
                contactPerson: newPartner.contactPerson || "N/A",
                createDate: newPartner.piDate
                  ? newPartner.piDate.split("T")[0]
                  : "",
                _id: newPartner._id,
              }
            : partner
        )
      );
    } else {
      const mappedPartner = {
        name: newPartner.customerCode || "Unknown Customer",
        piNumber: newPartner.piNumber || "N/A",
        phone: newPartner.customerCode || "N/A",
        contactPerson: newPartner.contactPerson || "N/A",
        createDate: newPartner.piDate ? newPartner.piDate.split("T")[0] : "",
        _id: newPartner._id || Date.now().toString(),
      };
      setProformaInvoices((prev) => [...prev, mappedPartner]);
    }
    setTimeout(() => {
      setShowForm(false);
      setEditId(null);
    }, 2000);
    await fetchProformaInvoices();
  };

  const handleExport = () => {
    const data = getFilteredAndSortedData();
    const csv = [
      Object.keys(
        data[0] || {
          name: "",
          piNumber: "",
          phone: "",
          contactPerson: "",
          createDate: "",
        }
      ).join(","),
      ...data.map((item) => Object.values(item).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "proforma_invoice.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCreateProformaInvoice = () => {
    // Prevent creation if user is from merchandise_marketing department
    if (ispermission) {
      showToast.error("You don't have permission to create proforma invoices");
      return;
    }
    setShowForm(true);
  };

  const pdfOptions = [
    { id: "default", label: "" },
    { id: "R1", label: "R1" },
    { id: "R2", label: "R2" },
    { id: "R3", label: "R3" },
    { id: "R4", label: "R4" },
    { id: "R5", label: "R5" },
  ];

  return (
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

        /* Ensure dropdown stays within viewport */
        .dropdown-container {
          position: relative;
          z-index: 1000;
        }

        .dropdown-menu {
          position: absolute;
          right: 0;
          min-width: 140px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid #e1f6ff;
          overflow: hidden;
          z-index: 1001;
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

        /* Disabled button styles */
        .btn-disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }
      `}</style>
      <Toaster />
      {showForm ? (
        <AddProformaInvoice
          onSave={handleSavePartner}
          onClose={() => {
            setShowForm(false);
            setEditId(null);
          }}
          moduleType="PIModule"
          editMode={!!editId}
          id={editId}
          reset={showForm}
        />
      ) : (
        <>
          {isLoading && <Loader />}
          {apiError && (
            <div className="text-red-500 text-center mb-4">
              Error: {apiError}
            </div>
          )}
          {!isLoading &&
            !apiError &&
            getFilteredAndSortedData().length === 0 && (
              <div className="text-center text-gray-600 mb-4">
                No proforma invoices found.
              </div>
            )}
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
              />
            </div>

            <div className="flex items-center gap-4">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-[#ABE7FF] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-white text-[#2B86AA] rounded-lg border border-[#2B86AA] focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2"
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export
              </button>
              {/* Conditionally render Create Proforma Invoice button */}
              {!ispermission && (
                <button
                  onClick={handleCreateProformaInvoice}
                  className="px-4 py-2 bg-[#2B86AA] text-white rounded-lg hover:bg-[#43a6ce] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2"
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
                  Create Proforma Invoice
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden border-2 border-[#2B86AA]">
            <table className="min-w-full divide-y divide-[#ABE7FF]">
              <thead className="bg-[#F1FBFF]">
                <tr>
                  {[
                    "name",
                    "piNumber",
                    "customer Code",
                    "contact Person",
                    "create Date",
                  ].map((header) => (
                    <th
                      key={header}
                      onClick={() => handleSort(header)}
                      className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider cursor-pointer hover:bg-gray-100 "
                    >
                      {header === "piNumber"
                        ? "PI Number"
                        : header.charAt(0).toUpperCase() + header.slice(1)}
                      {sortConfig.key === header && (
                        <span className="ml-2">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#ABE7FF]">
                {getPaginatedData().map((partner, index) => (
                  <tr key={partner._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {partner.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {partner.piNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {partner.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {partner.contactPerson}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {partner.createDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {/* Conditionally render Edit button */}
                        {!ispermission && (
                          <button
                            onClick={() => handleEdit(partner._id)}
                            className="text-gray-600 hover:text-gray-800"
                            title="Edit"
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
                        )}
                        <button
                          onClick={(e) =>
                            handlePdfDropdownToggle(partner._id, e, index)
                          }
                          className="text-gray-600 hover:text-gray-800 flex items-center gap-1 z-4"
                          title="Generate PDF"
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
                          {openDropdown === partner._id && (
                            <div
                              className={`dropdown-menu custom-scrollbar z-20 ${
                                dropdownPosition[partner._id]?.openUp
                                  ? "bottom-full mb-2"
                                  : "top-full mt-2 "
                              }`}
                              style={{
                                maxHeight:
                                  dropdownPosition[partner._id]?.maxHeight ||
                                  "240px",
                                overflowY: "auto",
                              }}
                            >
                              {pdfOptions.map((option) => (
                                <button
                                  key={option.id}
                                  onClick={() =>
                                    handlePdfSelect(partner._id, option.id)
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
            rowsPerPageOptions={[8, 16, 24]}
            component="div"
            count={getFilteredAndSortedData().length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </>
      )}
    </div>
  );
};

export default ProformaInvoice;