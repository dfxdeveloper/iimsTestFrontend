import React, { useState, Suspense, useRef, useEffect } from "react";
import Pagination from "../../../services/config/Pagination";
import Loader from "../../../common/Loader";
const AddNewPurchaseOrder = React.lazy(() => import('./AddPurchaseOrder'));

const PurchaseOrderView = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full mx-4 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Purchase Order Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="border-t border-b py-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">PO Details</h3>
              <p className="text-sm">PO Number: {data.poNumber}</p>
              <p className="text-sm">Order Date: {data.orderDate}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Vendor Details</h3>
              <p className="text-sm">Vendor: {data.vendor}</p>
              <p className="text-sm">Status: {data.status}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print PO
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

const PurchaseOrders = () => {
  const [showAddNew, setShowAddNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const totalItems = 3;

  const [orders, setOrders] = useState([
    {
      srNo: '01',
      vendor: 'XYZ son & Co.',
      poNumber: '228-3844-931-7689',
      orderDate: '2023-08-02',
      status: 'On Delivery',
      _id: '1'
    },
    {
      srNo: '02',
      vendor: 'ABC Trading Ltd.',
      poNumber: '228-3844-931-7690',
      orderDate: '2023-08-03',
      status: 'Completed',
      _id: '2'
    },
    {
      srNo: '03',
      vendor: 'Global Supplies Inc.',
      poNumber: '228-3844-931-7691',
      orderDate: '2023-08-04',
      status: 'Pending',
      _id: '3'
    }
  ]);

  // Simulate initial loading
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

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
      const totalRows = paginatedData.length;
      const position = calculateDropdownPosition(buttonElement, rowIndex, totalRows);
      setDropdownPosition({ [id]: position });
      setOpenDropdown(id);
    }
  };

  const handlePdfSelect = async (id, pdfType) => {
    setLoading(true);
    console.log(`Selected ${pdfType} for ID: ${id}`);
    
    // Simulate PDF generation/download process
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Add your actual PDF generation/download logic here
      console.log(`PDF ${pdfType} generated successfully`);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setLoading(false);
      setOpenDropdown(null);
      setDropdownPosition({});
    }
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

  const handleCreatePurchaseOrder = () => {
    setLoading(true);
    // Simulate loading before showing the form
    setTimeout(() => {
      setLoading(false);
      setShowAddNew(true);
    }, 1000);
  };

  const pdfOptions = [
    { id: "R0", label: "" },
    { id: "R1", label: "R1" },
    { id: "R2", label: "R2" },
    { id: "R3", label: "R3" },
    { id: "R4", label: "R4" },
    { id: "R5", label: "R5" },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'on delivery':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const getFilteredData = () => {
    return orders.filter(order => {
      const matchesSearch = Object.values(order)
        .some(value => value.toString().toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDate = !dateFilter || order.orderDate === dateFilter;
      return matchesSearch && matchesDate;
    });
  };

  const paginatedData = getFilteredData().slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  if (showAddNew) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <AddNewPurchaseOrder
          onSave={async (newOrder) => {
            setLoading(true);
            try {
              // Simulate API call to save order
              await new Promise(resolve => setTimeout(resolve, 1500));
              setOrders([...orders, newOrder]);
              setShowAddNew(false);
            } catch (error) {
              console.error('Failed to save order:', error);
            } finally {
              setLoading(false);
            }
          }}
          onBack={() => setShowAddNew(false)}
        />
      </Suspense>
    );
  }

  return (
    <>
      {loading && <Loader />}
      
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
                className="px-4 py-2 bg-white text-[#2B86AA] rounded-lg border border-[#2B86AA] focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export</span>
              </button>
              <button
                onClick={handleCreatePurchaseOrder}
                disabled={loading}
                className="px-4 py-2 bg-[#2B86AA] text-white rounded-md hover:bg-[#43a6ce] flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Purchase Order</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg overflow-hidden border-2 border-[#2B86AA]">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#F1FBFF] border-b border-[#ABE7FF]">
                <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Sr.No.
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                  PO Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((order, index) => (
                <tr key={order.srNo} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.srNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.vendor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.poNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.orderDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button 
                        className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          onClick={(e) => !loading && handlePdfDropdownToggle(order._id, e, index)}
                          className="text-gray-600 hover:text-gray-800 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
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

                        {openDropdown === order._id && !loading && (
                          <div
                            className={`dropdown-menu custom-scrollbar ${
                              dropdownPosition[order._id]?.openUp
                                ? "bottom-full mb-2"
                                : "top-full mt-2"
                            }`}
                            style={{
                              maxHeight: dropdownPosition[order._id]?.maxHeight || "240px",
                              overflowY: "auto",
                            }}
                          >
                            {pdfOptions.map((option) => (
                              <button
                                key={option.id}
                                onClick={() =>
                                  handlePdfSelect(order._id, option.id)
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

        {selectedOrder && (
          <PurchaseOrderView
            data={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </>
  );
};

export default PurchaseOrders;