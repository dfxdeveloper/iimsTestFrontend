import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Search,
  Edit,
  Trash,
  Plus,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowLeft,
} from "lucide-react";
import PerformaInvoice from "./PerformaInvoice";
import { api } from "../../../services/config/axiosInstance";
import { showToast, toastCustomConfig } from "../../../services/config/toast";
import { Toaster } from "react-hot-toast";
import Pagination from "../../../services/config/Pagination";

const MODULE_DISPLAY_NAMES = {
  "Performa Invoice": "PIModule",
  "Purchase Order": "PurchaseOrder",
  "Work Order": "WorkOrderModule",
  "Goods Receive Note": "GrnModule",
  Indent: "IndentModule",
  "Fabric Indent": "CommericalInvoiceModule",
};

const MODULE_VALUES_TO_NAMES = Object.entries(MODULE_DISPLAY_NAMES).reduce(
  (acc, [key, value]) => {
    acc[value] = key;
    return acc;
  },
  {}
);

const IndustryManagement = () => {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const moduleOptions = Object.keys(MODULE_DISPLAY_NAMES);

  const [newIndustry, setNewIndustry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModules, setSelectedModules] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [industryToDelete, setIndustryToDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [currentEditingIndustry, setCurrentEditingIndustry] = useState(null); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showTable, setShowTable] = useState(true);
  const [viewPerformaInvoice, setViewPerformaInvoice] = useState(false);
  const [selectedModule, setSelectedModule] = useState("");
  const [templateData, setTemplateData] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchIndustries();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const fetchIndustries = async () => {
    try {
      setLoading(true);
      const response = await api.get("/industry-modules");
      const formatted = Array.isArray(response?.data)
        ? response.data.map((item, index) => {
            const modules = Array.isArray(item.moduleData)
              ? item.moduleData.map((mod) => mod.moduleType).filter(Boolean)
              : [];

            return {
              id: item._id || (index + 1).toString().padStart(2, "0"),
              name: item.name,
              modules: modules
                .map((m) => MODULE_VALUES_TO_NAMES[m] || m)
                .join(", "),
              rawModules: modules,
              moduleData: item.moduleData || [],
            };
          })
        : [];

      setIndustries(formatted);
    } catch (error) {
      console.error("Error fetching industries:", error);
      showToast.error("Failed to fetch industries");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    const sortedIndustries = [...industries].sort((a, b) => {
      const valueA = a[property]?.toString().toLowerCase() || "";
      const valueB = b[property]?.toString().toLowerCase() || "";

      if (isAsc) {
        return valueB.localeCompare(valueA);
      }
      return valueA.localeCompare(valueB);
    });

    setIndustries(sortedIndustries);
  };

  const handleAddIndustry = async () => {
    if (newIndustry.trim() === "" || selectedModules.length === 0) {
      showToast.error(
        "Please enter industry name and select at least one module"
      );
      return;
    }
    const moduleValues = selectedModules.map(
      (module) => MODULE_DISPLAY_NAMES[module]
    );

    if (moduleValues.some((value) => !value)) {
      showToast.error(
        "One or more selected modules are not properly configured"
      );
      return;
    }

    const payload = {
      name: newIndustry,
      modules: moduleValues,
    };

    try {
      if (editMode && editId) {
        const response = await api.put(`/industry-modules/${editId}`, payload);
        fetchIndustries();
        setEditMode(false);
        setEditId(null);
        setCurrentEditingIndustry(null);
        setShowTable(true);
        showToast.success("Industry updated successfully!");
      } else {
        const response = await api.post("/industry-modules", payload);
        fetchIndustries();
        showToast.success("Industry added successfully!");
      }
    } catch (error) {
      console.error("API error:", error);
      if (error.response && error.response.data) {
        showToast.error(
          `Error: ${error.response.data.message || "Unknown error occurred"}`
        );
      } else {
        showToast.error("Failed to save industry data");
      }
    }

    setNewIndustry("");
    setSelectedModules([]);
  };

  const handleEdit = (industry) => {
    setEditMode(true);
    setEditId(industry.id);
    setCurrentEditingIndustry(industry);
    setNewIndustry(industry.name);
    const moduleDisplayNames = industry.modules
      .split(", ")
      .map((m) => m.trim());
    setSelectedModules(moduleDisplayNames);

    setShowTable(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (industry) => {
    setIndustryToDelete(industry);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/industry-modules/${industryToDelete.id}`);
      fetchIndustries();
      setDeleteModalOpen(false);
      setIndustryToDelete(null);
      showToast.success(
        `Industry "${industryToDelete?.name}" deleted successfully`
      );
    } catch (error) {
      console.error("Delete failed:", error);
      showToast.error("Failed to delete the industry. Please try again.");
    }
  };

  const toggleModule = (module) => {
    if (selectedModules.includes(module)) {
      setSelectedModules(selectedModules.filter((m) => m !== module));
    } else {
      setSelectedModules([...selectedModules, module]);
    }
  };

  const filteredIndustries = industries.filter(
    (industry) =>
      industry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      industry.modules.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setCurrentEditingIndustry(null);
    setNewIndustry("");
    setSelectedModules([]);
    setShowTable(true);
    setViewPerformaInvoice(false);
    setTemplateData(null);
  };

  const handleViewTemplate = (module) => {
    setSelectedModule(module);
    const templateDataToPass = {
      industryId: editId,
      industryName: newIndustry,
      selectedModule: module,
      moduleType: MODULE_DISPLAY_NAMES[module],
      allSelectedModules: selectedModules,
      originalIndustryData: currentEditingIndustry,
      moduleData:
        currentEditingIndustry?.moduleData?.find(
          (mod) => MODULE_VALUES_TO_NAMES[mod.moduleType] === module
        ) || null,
    };

    setTemplateData(templateDataToPass);
    setViewPerformaInvoice(true);
  };

  const moduleTemplateImages = {
    "Performa Invoice": "/assets/pi-temp.png",
    "Purchase Order": "/assets/purchase-order.png",
    "Work Order": "/assets/work-order.png",
    "Goods Receive Note": "/assets/goods-receive-note.png",
    Indent: "/assets/indent.png",
    "Fabric Indent": "/assets/fabric-indent.png",
  };

  if (viewPerformaInvoice) {
    return (
      <div className="bg-gray-50">
        <div className="bg-white p-3 shadow-sm flex items-center mb-4">
          <button
            onClick={handleCancelEdit}
            className="flex items-center font-medium text-sm text-white bg-[#2B86AA] hover:bg-[#227499] rounded-full px-2 py-1 mr-4"
          >
            <ArrowLeft size={16} />
            <span className="ml-1">Back</span>
          </button>
          <h2 className="text-xl font-semibold">{selectedModule}</h2>
          <span className="ml-4 text-sm text-gray-500">
            ({templateData?.industryName})
          </span>
        </div>
        <PerformaInvoice templateData={templateData} onBack={handleCancelEdit}/>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-3">
      <Toaster {...toastCustomConfig} />
      
      {showTable ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search industries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-64"
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry:
                </label>
                <input
                  type="text"
                  placeholder="Enter industry name"
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Modules:
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex justify-between items-center"
                  >
                    <div className="truncate">
                      {selectedModules.length > 0
                        ? selectedModules.join(", ")
                        : "Select modules"}
                    </div>
                    <div>
                      {dropdownOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                  </div>

                  {dropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {moduleOptions.map((module, index) => (
                        <div
                          key={index}
                          className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer"
                          onClick={() => toggleModule(module)}
                        >
                          <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center mr-2">
                            {selectedModules.includes(module) && (
                              <Check size={12} />
                            )}
                          </div>
                          {module}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleAddIndustry}
                className="flex items-center gap-2 bg-[#2B86AA] hover:bg-[#227499] text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Plus size={18} />
                Add New Industry
              </button>
            </div>
          </div>
          <TableContainer
            component={Paper}
            className="shadow-lg border border-gray-200"
          >
            <Table
              sx={{
                minWidth: 650,
                "& .MuiTableCell-root": {
                  borderRight: "1px solid rgba(224, 224, 224, 1)",
                  borderBottom: "1px solid rgba(224, 224, 224, 1)",
                  fontFamily: "Inter, sans-serif",
                  padding: "8px 16px",
                  fontSize: "0.875rem",
                },
                "& .MuiTableCell-head": {
                  fontFamily: "Archivo, sans-serif",
                  fontWeight: 700,
                  color: "white !important",
                  backgroundColor: "#0E3D50",
                  padding: "10px 16px",
                  fontSize: "0.875rem",
                },
                "& .MuiTableHead .MuiTableRow-root .MuiTableCell-root:first-of-type": {
                  borderTopLeftRadius: "400px",
                },
                "& .MuiTableHead .MuiTableRow-root .MuiTableCell-root:last-of-type": {
                  borderTopRightRadius: "400px",
                },
                "& .MuiTableCell-body": {
                  color: "#171A1F",
                  backgroundColor: "white",
                  padding: "6px 16px",
                  fontSize: "0.875rem",
                  lineHeight: "1.2",
                },
                "& .MuiTableCell-root:last-child": {
                  borderRight: "none",
                },
                "& .MuiTableBody .MuiTableRow-root": {
                  backgroundColor: "white",
                  height: "40px",
                },
                "& .MuiTableBody .MuiTableRow-root:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
                "& .MuiTableHead .MuiTableCell-head .MuiTableSortLabel-root": {
                  color: "white !important",
                  fontFamily: "Archivo, sans-serif !important",
                  fontWeight: "700 !important",
                  fontSize: "0.875rem !important",
                  "&:hover": {
                    color: "rgba(255, 255, 255, 0.8) !important",
                  },
                  "&.Mui-active": {
                    color: "white !important",
                  },
                  "& .MuiTableSortLabel-icon": {
                    color: "white !important",
                    opacity: "1 !important",
                  },
                },
                "& .MuiTableHead .MuiTableCell-head *": {
                  color: "white !important",
                  fontFamily: "Archivo, sans-serif !important",
                },
                "& .MuiTableHead .MuiTableSortLabel-icon": {
                  color: "white !important",
                  opacity: "1 !important",
                },
                "& .MuiTableHead .MuiTableSortLabel-root:hover .MuiTableSortLabel-icon": {
                  color: "rgba(255, 255, 255, 0.8) !important",
                },
                "& .MuiTableHead .MuiTableCell-head": {
                  "& span": {
                    color: "white !important",
                  },
                  "& div": {
                    color: "white !important",
                  },
                },
              }}
              aria-label="industries table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "id"}
                      direction={orderBy === "id" ? order : "asc"}
                      onClick={() => handleSort("id")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                        "&:hover": {
                          color: "rgba(255, 255, 255, 0.8) !important",
                        },
                        "&.Mui-active": {
                          color: "white !important",
                        },
                      }}
                    >
                      Sr. No.
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "name"}
                      direction={orderBy === "name" ? order : "asc"}
                      onClick={() => handleSort("name")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      Industries
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "modules"}
                      direction={orderBy === "modules" ? order : "asc"}
                      onClick={() => handleSort("modules")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      Modules
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="center" sx={{ color: "white !important" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ fontFamily: "Inter, sans-serif", color: "#171A1F" }}>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Loading industries...
                    </TableCell>
                  </TableRow>
                ) : filteredIndustries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No industries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIndustries
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((industry, index) => (
                      <TableRow key={industry.id} hover>
                        <TableCell>
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell>
                          {industry.name}
                        </TableCell>
                        <TableCell>
                          {industry.modules}
                        </TableCell>
                        <TableCell align="center">
                          <div className="flex gap-2 justify-center">
                            <Tooltip title="Edit Industry">
                              <IconButton
                                size="small"
                                onClick={() => handleEdit(industry)}
                                sx={{
                                  color: "#5B5B5B",
                                  padding: "4px", // Reduced icon button padding
                                }}
                              >
                                <Edit size={18} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Industry">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(industry)}
                                sx={{
                                  color: "#CA0000",
                                  padding: "4px", // Reduced icon button padding
                                }}
                              >
                                <Trash size={18} />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>

            <Pagination
              count={filteredIndustries.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 15]}
            />
          </TableContainer>
        </>
      ) : (
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="flex items-center mb-4">
            <button
              onClick={handleCancelEdit}
              className="flex items-center bg-[#2B86AA] hover:bg-[#227499] rounded-full px-3 py-1 font-medium text-sm text-white mr-4"
            >
              <ArrowLeft size={16} />
              <span className="ml-1">Back</span>
            </button>
            <h2 className="text-xl font-semibold">Edit Industry</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry:
              </label>
              <input
                type="text"
                placeholder="Enter industry name"
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Modules:
              </label>
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex justify-between items-center"
                >
                  <div className="truncate">
                    {selectedModules.length > 0
                      ? selectedModules.join(", ")
                      : "Select modules"}
                  </div>
                  <div>
                    {dropdownOpen ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </div>
                </div>

                {dropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {moduleOptions.map((module, index) => (
                      <div
                        key={index}
                        className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => toggleModule(module)}
                      >
                        <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center mr-2">
                          {selectedModules.includes(module) && (
                            <Check size={12} />
                          )}
                        </div>
                        {module}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={handleAddIndustry}
              className="flex items-center gap-2 bg-[#2B86AA] text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              <Plus size={18} />
              Update Industry
            </button>
          </div>

          <div className="mt-6 mb-4">
            <h3 className="text-lg font-medium mb-3">Templates</h3>
            <div className="flex flex-wrap gap-4 justify-center bg-blue-50 p-4 rounded-md">
              {selectedModules.map((module, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-white rounded-md shadow-sm overflow-hidden w-40"
                >
                  <div className="relative">
                    <img
                      src={moduleTemplateImages[module]}
                      alt={`${module} template`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50">
                      <button
                        className="bg-[#2B86AA] text-white py-1 px-4 rounded-md text-sm"
                        onClick={() => handleViewTemplate(module)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <div className="p-2 text-center">
                    <span className="text-sm font-medium text-gray-700">
                      {module}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Industry
            </h3>
            <p className="text-gray-500 mb-4">
              Are you sure you want to delete "{industryToDelete?.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryManagement;