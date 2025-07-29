import React, { useState, useEffect, Suspense } from "react";
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
import { Plus, Search, Edit, Trash } from "lucide-react";
import Pagination from "../../../services/config/Pagination";
import DeleteConfirmationModal from "../../../common/modals/DeleteConfirmationModal";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { api } from "../../../services/config/axiosInstance";
import CompanyTabs from "./CompanyTabs";

const CompanyCreation = () => {
  const [companies, setCompanies] = useState([]);
  const [industries, setIndustries] = useState({});
  const [showAddNew, setShowAddNew] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [orderBy, setOrderBy] = useState("companyName");
  const [order, setOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchIndustries = async () => {
    try {
      const response = await api.get("/industry-modules");
      const industryMap = {};
      response.data.forEach((industry) => {
        industryMap[industry._id] = industry.name;
      });
      setIndustries(industryMap);
    } catch (error) {
      console.error("Error fetching industries:", error);
      toast.error("Failed to fetch industries");
    }
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await api.get("/companies");
      setCompanies(response.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch companies");
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchIndustries();
      await fetchCompanies(); 
    };
    fetchData();
  }, []);

  const getIndustryName = (industryId) => {
    return industries[industryId] || "Unknown Industry"; 
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    const sortedCompanies = [...companies].sort((a, b) => {
      let valueA, valueB;
      if (property === "industry") {
        valueA = getIndustryName(a[property])?.toLowerCase() || "";
        valueB = getIndustryName(b[property])?.toLowerCase() || "";
      } else {
        valueA = a[property]?.toString().toLowerCase() || "";
        valueB = b[property]?.toString().toLowerCase() || "";
      }

      return isAsc ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB);
    });

    setCompanies(sortedCompanies);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = () => {
    
  };

  const handleCloseAddCompany = () => {
    setShowAddNew(false);
    setEditingCompany(null);
  };

  const handleSuccess = () => {
    fetchCompanies();
    handleCloseAddCompany();
    toast.success(
      editingCompany
        ? "Company updated successfully"
        : "Company added successfully"
    );
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setShowAddNew(true);
  };

  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/companies/${companyToDelete._id}`);
      fetchCompanies();
      toast.success("Company deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete company");
      console.error("Error deleting company:", error);
    } finally {
      setDeleteModalOpen(false);
      setCompanyToDelete(null);
    }
  };

  const handleStatusChange = async (company) => {
    try {
      const updatedStatus = !company.isActive;
      await api.patch(`/companies/${company._id}`, { isActive: updatedStatus });

      setCompanies((prevCompanies) =>
        prevCompanies.map((comp) =>
          comp._id === company._id ? { ...comp, isActive: updatedStatus } : comp
        )
      );

      toast.success(
        `Company status ${
          updatedStatus ? "activated" : "deactivated"
        } successfully`
      );
    } catch (error) {
      toast.error(error.message || "Failed to update company status");
      console.error("Error updating company status:", error);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const searchableText = [
      company.companyName,
      company.address1,
      getIndustryName(company.industry),
      company.companyMailId,
      company.isActive ? "Active" : "Inactive",
      company.noOfEmployees,
      company.docGenerated,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchQuery.toLowerCase());
  });

  if (showAddNew) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <CompanyTabs
          onClose={handleCloseAddCompany}
          onSuccess={handleSuccess}
          editMode={!!editingCompany}
          companyData={editingCompany}
        />
      </Suspense>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <Toaster />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCompanyToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Company"
        description={`Are you sure you want to delete ${companyToDelete?.companyName}? This action cannot be undone.`}
      />

      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-64"
          />
        </div>
        <button
          onClick={() => setShowAddNew(true)}
          className="flex items-center gap-2 bg-[#2B86AA] hover:bg-[#2B86AA] text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <Plus size={20} />
          Add New
        </button>
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
            },
            "& .MuiTableCell-head": {
              fontFamily: "Archivo, sans-serif",
              fontWeight: 700,
              color: "white !important",
              backgroundColor: "#0E3D50",
            },
            "& .MuiTableHead .MuiTableRow-root .MuiTableCell-root:first-of-type":
              {
                borderTopLeftRadius: "400px",
              },
            "& .MuiTableHead .MuiTableRow-root .MuiTableCell-root:last-of-type":
              {
                borderTopRightRadius: "400px",
              },
            "& .MuiTableCell-body": {
              color: "#171A1F",
              backgroundColor: "white",
            },
            "& .MuiTableCell-root:last-child": {
              borderRight: "none",
            },
            "& .MuiTableBody .MuiTableRow-root": {
              backgroundColor: "white",
            },
            "& .MuiTableBody .MuiTableRow-root:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
            "& .MuiTableHead .MuiTableSortLabel-root": {
              color: "white !important",
              fontFamily: "Archivo, sans-serif !important",
              fontWeight: "700 !important",
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
            "& .MuiTableHead .MuiTableSortLabel-root:hover .MuiTableSortLabel-icon":
              {
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
          aria-label="companies table"
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "companyName"}
                  direction={orderBy === "companyName" ? order : "asc"}
                  onClick={() => handleSort("companyName")}
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
                  Company Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "address1"} 
                  direction={orderBy === "address1" ? order : "asc"}
                  onClick={() => handleSort("address1")}
                  sx={{
                    color: "white !important",
                    "& .MuiTableSortLabel-icon": {
                      color: "white !important",
                    },
                  }}
                >
                  Address
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "industry"}
                  direction={orderBy === "industry" ? order : "asc"}
                  onClick={() => handleSort("industry")}
                  sx={{
                    color: "white !important",
                    "& .MuiTableSortLabel-icon": {
                      color: "white !important",
                    },
                  }}
                >
                  Industry
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "companyMailId"} 
                  direction={orderBy === "companyMailId" ? order : "asc"}
                  onClick={() => handleSort("companyMailId")}
                  sx={{
                    color: "white !important",
                    "& .MuiTableSortLabel-icon": {
                      color: "white !important",
                    },
                  }}
                >
                  Admin
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "isActive"}
                  direction={orderBy === "isActive" ? order : "asc"}
                  onClick={() => handleSort("isActive")}
                  sx={{
                    color: "white !important",
                    "& .MuiTableSortLabel-icon": {
                      color: "white !important",
                    },
                  }}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "noOfEmployees"} 
                  direction={orderBy === "noOfEmployees" ? order : "asc"}
                  onClick={() => handleSort("noOfEmployees")}
                  sx={{
                    color: "white !important",
                    "& .MuiTableSortLabel-icon": {
                      color: "white !important",
                    },
                  }}
                >
                  Active User
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "docGenerated"}
                  direction={orderBy === "docGenerated" ? order : "asc"}
                  onClick={() => handleSort("docGenerated")}
                  sx={{
                    color: "white !important",
                    "& .MuiTableSortLabel-icon": {
                      color: "white !important",
                    },
                  }}
                >
                  Doc Generated
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
                <TableCell colSpan={8} align="center">
                  Loading companies...
                </TableCell>
              </TableRow>
            ) : filteredCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No companies found
                </TableCell>
              </TableRow>
            ) : (
              filteredCompanies
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((company) => (
                  <TableRow key={company._id} hover>
                    <TableCell>{company.companyName}</TableCell>
                    <TableCell>{company.address1}</TableCell>
                    <TableCell>{getIndustryName(company.industry)}</TableCell>
                    <TableCell>{company.companyMailId}</TableCell>
                    <TableCell>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleStatusChange(company)}
                      >
                        <div
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            company.isActive ? "bg-green-600" : "bg-red-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              company.isActive
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-800">
                          {company.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{company.noOfEmployees || 0}</TableCell>
                    <TableCell>{company.docGenerated || 0}</TableCell>
                    <TableCell align="center">
                      <div className="flex gap-3 justify-center">
                        <Tooltip title="Edit Company">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(company)}
                            sx={{
                              color: "#5B5B5B",
                            }}
                          >
                            <Edit size={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Company">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(company)}
                            sx={{
                              color: "#CA0000",
                            }}
                          >
                            <Trash size={20} />
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
          count={filteredCompanies.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5]}
        />
      </TableContainer>
    </div>
  );
};

export default CompanyCreation;