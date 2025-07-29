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
import { Plus, Edit, Trash, Search } from "lucide-react";
import { api } from "../../../services/config/axiosInstance";
import { showToast, toastCustomConfig } from "../../../services/config/toast";
import DeleteConfirmationModal from "../../../common/modals/DeleteConfirmationModal";
import { Toaster } from "react-hot-toast";
import Pagination from "../../../services/config/Pagination";
import Loader from "../../../common/Loader";
const AddPartner = React.lazy(() => import("./AddPartner"));

const Partners = () => {
  const [showAddNew, setShowAddNew] = useState(false);
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPartner, setEditingPartner] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState(null);
  const [orderBy, setOrderBy] = useState("srNo");
  const [order, setOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const fetchPartners = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/partners");
      const formattedPartners = response.data.map((partner, index) => ({
        srNo: (index + 1).toString().padStart(2, "0"),
        type: partner.type,
        clientName: partner.clientName,
        email: partner.email,
        mobile: partner.mobile,
        city: partner.city,
        pinCode: partner.pinCode,
        ...partner,
      }));
      setPartners(formattedPartners);
    } catch (error) {
      showToast.error("Failed to fetch partners");
      console.error("Error fetching partners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleCloseAddPartner = () => {
    setShowAddNew(false);
    setEditingPartner(null);
  };

  const handleSuccess = () => {
    fetchPartners();
    handleCloseAddPartner();
  };

  const handleEdit = (partner) => {
    setEditingPartner(partner);
    setShowAddNew(true);
  };

  const handleDeleteClick = (partner) => {
    setPartnerToDelete(partner);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!partnerToDelete?._id) {
      showToast.error("Invalid partner data");
      return;
    }

    try {
      await showToast.promise(api.delete(`/partners/${partnerToDelete._id}`), {
        loading: "Deleting partner...",
        success: "Partner deleted successfully! 🎉",
        error: (error) =>
          `Failed to delete partner: ${
            error.response?.data?.message || "Unknown error"
          }`,
      });

      fetchPartners();
    } catch (error) {
      console.error("Error deleting partner:", error);
    } finally {
      setTimeout(() => {
        setDeleteModalOpen(false);
        setPartnerToDelete(null);
      }, 1000);
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    const sortedPartners = [...partners].sort((a, b) => {
      const valueA = a[property]?.toString().toLowerCase();
      const valueB = b[property]?.toString().toLowerCase();

      if (isAsc) {
        return valueB.localeCompare(valueA);
      }
      return valueA.localeCompare(valueB);
    });

    setPartners(sortedPartners);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const headCells = [
    { id: "srNo", label: "SR. No." },
    { id: "customerCode", label: "Customer Code" },
    { id: "type", label: "Type" },
    { id: "clientName", label: "Name" },
    { id: "email", label: "Email" },
    { id: "mobile", label: "Phone" },
    { id: "city", label: "City" },
    { id: "pinCode", label: "Pincode" },
    { id: "actions", label: "Action", sortable: false },
  ];

  const filteredPartners = partners.filter((partner) => {
    const matchesSearch = Object.values(partner)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "vendors"
        ? partner.type === "vendor"
        : activeTab === "customers"
        ? partner.type === "customer"
        : true;

    return matchesSearch && matchesTab;
  });

  if (showAddNew) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <AddPartner
          onClose={handleCloseAddPartner}
          onSuccess={handleSuccess}
          editMode={!!editingPartner}
          partnerData={editingPartner}
        />
      </Suspense>
    );
  }

  return (
    <>
    {isLoading && <Loader/>}
     <div className="space-y-6 p-4">
      <Toaster {...toastCustomConfig} />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setPartnerToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Partner"
        description={`Are you sure you want to delete ${partnerToDelete?.clientName}? This action cannot be undone.`}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex gap-2">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search partners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-48 md:w-64 pl-10 pr-4 py-2 rounded-lg border border-[#ABE7FF] focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowAddNew(true)}
            className="flex items-center gap-2 bg-[#2B86AA] hover:bg-[#43a6ce] text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus size={20} />
            Add New Partner
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-[#2B86AA]">
          <nav className="-mb-px flex space-x-8">
            {["all", "vendors", "customers"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-[#2B86AA] text-[#2B86AA]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab !== "all" && (
                  <span className="ml-2 text-xs text-gray-400">
                    (
                    {
                      partners.filter((p) =>
                        tab === "vendors"
                          ? p.type === "vendor"
                          : p.type === "customer"
                      ).length
                    }
                    )
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Material UI Table with Borders - Styled like Dashboard */}
      <TableContainer
        component={Paper}
        className="shadow-lg rounded-lg overflow-hidden border-2 border-[#2B86AA]"
      >
        <Table
          sx={{
            minWidth: 650,
            "& .MuiTableCell-root": {
              borderRight: "1px solid #8BCBE4",
              borderBottom: "1px solid #8BCBE4",
              fontFamily: "Inter, sans-serif",
            },
            "& .MuiTableCell-head": {
              fontFamily: "Archivo, sans-serif",
              fontWeight: 700,
              color: "#171A1F",
              backgroundColor: "#F1FBFF",
            },
            "& .MuiTableCell-root:last-child": {
              borderRight: "none",
            },
          }}
          aria-label="partners table"
        >
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id}>
                  {headCell.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => handleSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ fontFamily: "Inter, sans-serif", color: "#171A1F" }}>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredPartners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No partners found
                </TableCell>
              </TableRow>
            ) : (
              filteredPartners
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row._id} hover>
                    <TableCell>{row.srNo}</TableCell>
                    <TableCell>{row.customerCode}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          row.type === "Vendor"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {row.type}
                      </span>
                    </TableCell>
                    <TableCell>{row.clientName}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.mobile}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell>{row.pinCode}</TableCell>
                    <TableCell align="center">
                      <div className="flex gap-3 justify-center">
                        <Tooltip title="Edit Partner">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(row)}
                            sx={{
                              color: "#5B5B5B",
                            }}
                          >
                            <Edit size={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Partner">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(row)}
                            sx={{
                              color: "#CA0000", 
                            }}
                          >
                            <img
                              src="/assets/delete.svg"
                              alt="Delete"
                              className="h-5 sm:h-5 md:h-5"
                              style={{ color: "red" }} 
                            />
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
          count={filteredPartners.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[8, 16, 24, 32]}
        />
      </TableContainer>
    </div>
    </>
  );
};

export default Partners;
