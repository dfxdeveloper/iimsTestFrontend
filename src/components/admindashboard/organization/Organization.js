import React, { useState, useEffect } from "react";
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
import { departmentOptions } from "../../../utils/departments";
import Pagination from "../../../services/config/Pagination";
import Loader from "../../../common/Loader";
const AddNewEmployee = React.lazy(() => import("./AddEmployee"));

const Organization = () => {
  const [showAddNew, setShowAddNew] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [orderBy, setOrderBy] = useState("srNo");
  const [order, setOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const getDepartmentLabel = (value) => {
    if (!value) return 'N/A';

    // Find the department option where the value matches
    const department = departmentOptions.find(
      dept => dept.value === value
    );

    return department ? department.label : value;
  };

  // Fetch employees data
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/employees');
      const formattedEmployees = response.data.map((emp, index) => ({
        srNo: (index + 1).toString().padStart(2, '0'),
        fullName: emp.name,
        department: emp.department,
        city: emp.city,
        phoneNo: emp.phoneNumber,
        ...emp,
        originalDepartment: emp.department
      }));
      setEmployees(formattedEmployees);
    } catch (error) {
      showToast.error('Failed to fetch employees');
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    setEditingEmployee({
      ...employee,
      department: employee.originalDepartment
    });
    setShowAddNew(false);
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete?._id) {
      showToast.error('Invalid employee data');
      return;
    }

    try {
      await showToast.promise(
        api.delete(`/employees/${employeeToDelete._id}`),
        {
          loading: 'Deleting employee...',
          success: 'Employee deleted successfully! 🎉',
          error: (error) => `Failed to delete employee: ${error.response?.data?.message || 'Unknown error'}`
        }
      );

      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    } finally {
      setTimeout(() => {
        setDeleteModalOpen(false);
        setEmployeeToDelete(null);
      }, 1000);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    const sortedEmployees = [...employees].sort((a, b) => {
      const valueA = a[property].toString().toLowerCase();
      const valueB = b[property].toString().toLowerCase();

      if (isAsc) {
        return valueB.localeCompare(valueA);
      }
      return valueA.localeCompare(valueB);
    });

    setEmployees(sortedEmployees);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee =>
    Object.values(employee)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (showAddNew) {
    return <AddNewEmployee onBack={() => setShowAddNew(false)} onUpdate={fetchEmployees} />;
  }

  if (editingEmployee) {
    return (
      <AddNewEmployee
        onBack={() => setEditingEmployee(null)}
        onUpdate={fetchEmployees}
        editMode={true}
        employeeData={{
          name: editingEmployee.fullName,
          department: editingEmployee.originalDepartment,
          city: editingEmployee.city,
          phoneNumber: editingEmployee.phoneNo,
          fatherName: editingEmployee.fatherName,
          motherName: editingEmployee.motherName,
          personalEmail: editingEmployee.personalEmail,
          authorizedEmail: editingEmployee.authorizedEmail,
          id: editingEmployee._id
        }}
      />
    );
  }

  return (
    <>
    {isLoading && <Loader/>}
    <div className="p-4 md:p-6 w-full">
      <Toaster {...toastCustomConfig} />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        description={`Are you sure you want to delete ${employeeToDelete?.fullName}? This action cannot be undone.`}
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
              placeholder="Search"
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
            Add New
          </button>
        </div>
      </div>

      {/* MUI Table */}
      <TableContainer
        component={Paper}
        className="shadow-lg rounded-lg overflow-hidden border-2 border-[#2B86AA]"
      >
        <Table
          sx={{
            minWidth: 650,
            "& .MuiTableCell-root": {
              borderRight: "1px solid #ABE7FF",
              borderBottom: "1px solid #ABE7FF",
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
          aria-label="employees table"
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "srNo"}
                  direction={orderBy === "srNo" ? order : "asc"}
                  onClick={() => handleRequestSort("srNo")}
                >
                  SR. No.
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "fullName"}
                  direction={orderBy === "fullName" ? order : "asc"}
                  onClick={() => handleRequestSort("fullName")}
                >
                  FullName
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "department"}
                  direction={orderBy === "department" ? order : "asc"}
                  onClick={() => handleRequestSort("department")}
                >
                  Department
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "city"}
                  direction={orderBy === "city" ? order : "asc"}
                  onClick={() => handleRequestSort("city")}
                >
                  City
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "phoneNo"}
                  direction={orderBy === "phoneNo" ? order : "asc"}
                  onClick={() => handleRequestSort("phoneNo")}
                >
                  Phone No.
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ fontFamily: "Inter, sans-serif", color: "#171A1F" }}>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.srNo} hover>
                    <TableCell component="th" scope="row">
                      {row.srNo}
                    </TableCell>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell>{getDepartmentLabel(row.department)}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell>{row.phoneNo}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit">
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
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(row)}
                          sx={{
                            color: "#5B5B5B",
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
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        <Pagination
          count={filteredEmployees.length}
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

export default Organization;
