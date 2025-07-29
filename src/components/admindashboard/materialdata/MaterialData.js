import React, { useState, useEffect } from "react";
import { Search, Download, Upload, Edit, Trash2 } from "lucide-react";
import { CATEGORY_ENUM, UOM_ENUM } from "../../../utils/departments";
import { api } from "../../../services/config/axiosInstance";
import { showToast, toastCustomConfig } from "../../../services/config/toast";
import { Toaster } from "react-hot-toast";
import DeleteConfirmationModal from "../../../common/modals/DeleteConfirmationModal";
import * as XLSX from "xlsx";
import Pagination from "../../../services/config/Pagination";
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
import Loader from "../../../common/Loader";

const MaterialData = () => {
  const [formData, setFormData] = useState({
    category: "",
    hsnCode: "",
    uom: "",
    taxPercentage: "",
    materialCode: "",
    itemDescription: "",
  });

  const [masterData, setMasterData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [importing, setImporting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [orderBy, setOrderBy] = useState("materialCode");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (fileInput) {
      handleBulkImport();
    }
  }, [fileInput]);

  const fetchMasterData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/master-data");
      setMasterData(response?.data || []);
    } catch (err) {
      showToast.error(err?.message || "Failed to fetch master data");
      console.error("Error fetching master data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (
      !formData.category &&
      !formData.hsnCode &&
      !formData.uom &&
      !formData.taxPercentage &&
      !formData.materialCode &&
      !formData.itemDescription
    ) {
      showToast.error("Please enter all the fields.");
      return false;
    }

    if (!formData.category) {
      showToast.error("Please select a category.");
      return false;
    }

    if (!/^[A-Za-z0-9]{6,8}$/.test(formData.hsnCode)) {
      showToast.error("HSN code must be 6-8 alphanumeric characters.");
      return false;
    }

    if (!formData.uom) {
      showToast.error("Please select a UOM.");
      return false;
    }

    if (!/^\d+(\.\d+)?$/.test(formData.taxPercentage)) {
      showToast.error("Please enter tax percentage in numbers.");
      return false;
    }

    if (!/^[A-Za-z0-9]{6,8}$/.test(formData.materialCode)) {
      showToast.error("Material code must be 6-8 alphanumeric characters.");
      return false;
    }

    if (!formData.itemDescription) {
      showToast.error("Description is required.");
      return false;
    }

    return true;
  };

  const handleAddData = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await api.post("/master-data", formData);
      await fetchMasterData();
      setFormData({
        category: "",
        hsnCode: "",
        uom: "",
        taxPercentage: "",
        materialCode: "",
        itemDescription: "",
      });

      showToast.success("Data added successfully!");
    } catch (err) {
      showToast.error(err?.message || "Failed to add master data");
      console.error("Error adding master data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditData = async (id) => {
    const itemToEdit = masterData.find(
      (item) => item._id === id || item.id === id
    );
    if (itemToEdit) {
      setFormData({
        id: id,
        category: itemToEdit.category || "",
        hsnCode: itemToEdit.hsnCode || "",
        uom: itemToEdit.uom || "",
        taxPercentage: itemToEdit.taxPercentage || "",
        materialCode: itemToEdit.materialCode || "",
        itemDescription: itemToEdit.itemDescription || "",
      });
    }
  };

  const handleUpdateData = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await api.put(`/master-data/${formData.id}`, formData);
      await fetchMasterData();
      setFormData({
        category: "",
        hsnCode: "",
        uom: "",
        taxPercentage: "",
        materialCode: "",
        itemDescription: "",
      });

      showToast.success("Data updated successfully!");
    } catch (err) {
      showToast.error(err?.message || "Failed to update master data");
      console.error("Error updating master data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!dataToDelete?._id) {
      showToast.error("Invalid Material data");
      return;
    }

    try {
      await showToast.promise(api.delete(`/master-data/${dataToDelete._id}`), {
        loading: "Deleting Material Data...",
        success: "Material Data deleted successfully! 🎉",
        error: (error) =>
          `Failed to delete Material Data: ${
            error.response?.data?.message || "Unknown error"
          }`,
      });

      fetchMasterData();
    } catch (error) {
      console.error("Error deleting master data:", error);
    } finally {
      setTimeout(() => {
        setDeleteModalOpen(false);
        setDataToDelete(null);
      }, 1000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileInput(file);
      setImporting(true);
    }
  };

  const handleBulkImport = async () => {
    if (!fileInput) {
      return;
    }

    try {
      setImporting(true);

      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          if (rawData.length === 0) {
            showToast.error("No data found in the file or incorrect format");
            setImporting(false);
            return;
          }
          const sampleRow = rawData[0];
          const columnNames = Object.keys(sampleRow);
          const columnMap = {
            category: columnNames.find(
              (col) =>
                col.toLowerCase().includes("category") ||
                col.toLowerCase().includes("cat")
            ),
            materialCode: columnNames.find(
              (col) =>
                col.toLowerCase().includes("material code") ||
                col.toLowerCase().includes("code") ||
                col.toLowerCase().includes("material")
            ),
            itemDescription: columnNames.find(
              (col) =>
                col.toLowerCase().includes("description") ||
                col.toLowerCase().includes("desc") ||
                col.toLowerCase().includes("item")
            ),
            hsnCode: columnNames.find((col) =>
              col.toLowerCase().includes("hsn")
            ),
            uom: columnNames.find(
              (col) =>
                col.toLowerCase().includes("uom") ||
                col.toLowerCase().includes("unit") ||
                col.toLowerCase().includes("measure")
            ),
            taxPercentage: columnNames.find(
              (col) =>
                col.toLowerCase().includes("tax") ||
                col.toLowerCase().includes("percentage")
            ),
          };
          const formattedData = rawData.map((item, index) => {
            let categoryValue = item[columnMap.category] || "";
            let uomValue = item[columnMap.uom] || "";
            const categoryObj = CATEGORY_ENUM.find(
              (cat) =>
                cat.label.toLowerCase() ===
                  String(categoryValue).toLowerCase() ||
                cat.value.toLowerCase() === String(categoryValue).toLowerCase()
            );
            const uomObj = UOM_ENUM.find(
              (u) =>
                u.label.toLowerCase() === String(uomValue).toLowerCase() ||
                u.value.toLowerCase() === String(uomValue).toLowerCase()
            );

            const result = {
              category: categoryObj ? categoryObj.value : categoryValue,
              materialCode: item[columnMap.materialCode] || "",
              itemDescription: item[columnMap.itemDescription] || "",
              hsnCode: item[columnMap.hsnCode] || "",
              uom: uomObj ? uomObj.value : uomValue,
              taxPercentage: item[columnMap.taxPercentage] || "",
            };
            return result;
          });

          const validData = formattedData.filter(
            (item) => item.category && item.materialCode && item.itemDescription
          );

          if (validData.length === 0) {
            const missingFields = [];
            if (formattedData.every((item) => !item.category))
              missingFields.push("Category");
            if (formattedData.every((item) => !item.materialCode))
              missingFields.push("Material Code");
            if (formattedData.every((item) => !item.itemDescription))
              missingFields.push("Item Description");

            let errorMsg = "No valid data found in the file";
            if (missingFields.length > 0) {
              errorMsg += `. Missing required fields: ${missingFields.join(
                ", "
              )}`;
            }

            showToast.error(errorMsg);
            setImporting(false);
            return;
          }

          await showToast.promise(
            api.post("/master-data/bulk-insert", validData, {
              headers: {
                "Content-Type": "application/json",
              },
            }),
            {
              loading: "Importing data...",
              success: `Data imported successfully! ${validData.length} records processed.`,
              error: (error) =>
                `Import failed: ${
                  error.response?.data?.message || "Unknown error"
                }`,
            }
          );

          await fetchMasterData();
        } catch (err) {
          showToast.error(err?.message || "Failed to process import file");
          console.error("Error processing import file:", err);
        } finally {
          setImporting(false);
          const fileElement = document.getElementById("fileUpload");
          if (fileElement) fileElement.value = "";
          setFileInput(null);
        }
      };

      reader.onerror = () => {
        showToast.error("Failed to read file");
        setImporting(false);
      };

      reader.readAsArrayBuffer(fileInput);
    } catch (err) {
      showToast.error(err?.message || "Failed to import data");
      console.error("Error importing data:", err);
      setImporting(false);
    }
  };
  const getCategoryLabel = (value) => {
    const category = CATEGORY_ENUM.find((cat) => cat.value === value);
    return category ? category.label : value;
  };

  const getUOMLabel = (value) => {
    const uom = UOM_ENUM.find((u) => u.value === value);
    return uom ? uom.label : value;
  };

  const handleExport = async () => {
    try {
      const exportData = masterData.map((item, index) => ({
        "Sr. No.": index + 1,
        Category: getCategoryLabel(item.category),
        "Material Code": item.materialCode,
        "Item Description": item.itemDescription,
        "HSN Code": item.hsnCode,
        UoM: getUOMLabel(item.uom),
        "Tax Percentage": item.taxPercentage,
      }));

      const exportPromise = new Promise((resolve, reject) => {
        try {
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const columnWidths = [
            { wch: 5 },
            { wch: 15 },
            { wch: 15 },
            { wch: 40 },
            { wch: 15 },
            { wch: 10 },
            { wch: 15 },
          ];

          worksheet["!cols"] = columnWidths;
          XLSX.utils.book_append_sheet(workbook, worksheet, "Material Data");
          const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
          });
          const blob = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `material-data.xlsx`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          resolve(`Exported ${exportData.length} records`);
        } catch (error) {
          reject(error);
        }
      });
      await showToast.promise(exportPromise, {
        loading: "Preparing export...",
        success: (result) => `Export completed! ${result}`,
        error: (error) => `Export failed: ${error.message || "Unknown error"}`,
      });
    } catch (err) {
      showToast.error(err?.message || "Failed to export data");
      console.error("Error exporting data:", err);
    }
  };

  const filteredData = masterData.filter((item) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      (item.category && item.category.toLowerCase().includes(query)) ||
      (item.materialCode && item.materialCode.toLowerCase().includes(query)) ||
      (item.itemDescription &&
        item.itemDescription.toLowerCase().includes(query)) ||
      (item.hsnCode && item.hsnCode.toLowerCase().includes(query))
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleDeleteClick = (data) => {
    setDataToDelete(data);
    setDeleteModalOpen(true);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    const sortedData = [...filteredData].sort((a, b) => {
      const valueA = a[property].toString().toLowerCase();
      const valueB = b[property].toString().toLowerCase();

      if (isAsc) {
        return valueB.localeCompare(valueA);
      }
      return valueA.localeCompare(valueB);
    });

    setMasterData(sortedData);
  };

  return (
    <>
    {isLoading && <Loader/>}
     <div className="p-6">
      <Toaster {...toastCustomConfig} />
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDataToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Material Data"
        description={`Are you sure you want to delete ${dataToDelete?.materialCode}? This action cannot be undone.`}
      />

      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#ABE7FF] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleExport}
            disabled={isLoading || masterData.length === 0}
            className="px-4 py-2 bg-white text-[#2B86AA] rounded-lg border border-[#2B86AA]  flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <label
            className={`px-4 py-2 ${
              importing ? "bg-white" : "bg-white"
            } text-[#2B86AA] rounded-lg border border-[#2B86AA] flex items-center gap-2 cursor-pointer ${
              importing ? "opacity-70 cursor-wait" : ""
            }`}
          >
            <Upload className="w-4 h-4" />
            {importing ? "Importing..." : "Import"}
            <input
              type="file"
              id="fileUpload"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
              disabled={importing}
            />
          </label>
        </div>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg mb-6 border-2 border-[#2B86AA]">
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="category"
              className="block mb-1 text-sm font-medium text-black"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[#ABE7FF] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Category</option>
              {CATEGORY_ENUM.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="hsnCode"
              className="block mb-1 text-sm font-medium text-black"
            >
              HSN Code
            </label>
            <input
              type="text"
              id="hsnCode"
              name="hsnCode"
              placeholder="HSN Code"
              value={formData.hsnCode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[#ABE7FF] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="uom"
              className="block mb-1 text-sm font-medium text-black"
            >
              UOM
            </label>
            <select
              id="uom"
              name="uom"
              value={formData.uom}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[#ABE7FF] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select UOM</option>
              {UOM_ENUM.map((uom) => (
                <option key={uom.value} value={uom.value}>
                  {uom.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="taxPercentage"
              className="block mb-1 text-sm font-medium text-black"
            >
              Tax
            </label>
            <input
              type="text"
              id="taxPercentage"
              name="taxPercentage"
              placeholder="Tax Percentage"
              value={formData.taxPercentage}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[#ABE7FF] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="materialCode"
              className="block mb-1 text-sm font-medium text-black"
            >
              Material Code
            </label>
            <input
              type="text"
              id="materialCode"
              name="materialCode"
              placeholder="Material Code"
              value={formData.materialCode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[#ABE7FF] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex-[2] min-w-[300px]">
            <label
              htmlFor="itemDescription"
              className="block mb-1 text-sm font-medium text-black"
            >
              Description
            </label>
            <input
              type="text"
              id="itemDescription"
              name="itemDescription"
              placeholder="Description"
              value={formData.itemDescription}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-[#ABE7FF] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 mt-6">
            <button
              onClick={formData.id ? handleUpdateData : handleAddData}
              disabled={isLoading}
              className="px-4 py-2 bg-[#2B86AA] text-white rounded-lg hover:bg-[#43a6ce] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 disabled:opacity-50"
            >
              <span className="text-lg font-bold">
                {formData.id ? "✓" : "+"}
              </span>
              {formData.id ? "Update" : "Add Data"}
            </button>
            {formData.id && (
              <button
                onClick={() => {
                  setFormData({
                    category: "",
                    hsnCode: "",
                    uom: "",
                    taxPercentage: "",
                    materialCode: "",
                    itemDescription: "",
                  });
                }}
                className="px-4 py-2 bg-white text-[#2B86AA] rounded-lg border border-[#2B86AA]"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <TableContainer
        component={Paper}
        className="shadow-lg overflow-hidden border-2 border-[#2B86AA]"
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
          aria-label="material data table"
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "materialCode"}
                  direction={orderBy === "materialCode" ? order : "asc"}
                  onClick={() => handleSort("materialCode")}
                >
                  Material Code
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "category"}
                  direction={orderBy === "category" ? order : "asc"}
                  onClick={() => handleSort("category")}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "itemDescription"}
                  direction={orderBy === "itemDescription" ? order : "asc"}
                  onClick={() => handleSort("itemDescription")}
                >
                  Item Description
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "hsnCode"}
                  direction={orderBy === "hsnCode" ? order : "asc"}
                  onClick={() => handleSort("hsnCode")}
                >
                  HSN Code
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "uom"}
                  direction={orderBy === "uom" ? order : "asc"}
                  onClick={() => handleSort("uom")}
                >
                  UoM
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "taxPercentage"}
                  direction={orderBy === "taxPercentage" ? order : "asc"}
                  onClick={() => handleSort("taxPercentage")}
                >
                  Tax Percentage
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ fontFamily: "Inter, sans-serif", color: "#171A1F" }}>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <TableRow key={item._id || item.id || index} hover>
                  <TableCell component="th" scope="row">
                    {item.materialCode}
                  </TableCell>
                  <TableCell>{getCategoryLabel(item.category)}</TableCell>
                  <TableCell>{item.itemDescription}</TableCell>
                  <TableCell>{item.hsnCode}</TableCell>
                  <TableCell>{getUOMLabel(item.uom)}</TableCell>
                  <TableCell>{item.taxPercentage}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        sx={{
                          color: "#5B5B5B",
                        }}
                        onClick={() => handleEditData(item._id || item.id)}
                        disabled={isLoading}
                      >
                        <Edit size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        sx={{
                          color: "#5B5B5B",
                        }}
                        onClick={() => handleDeleteClick(item)}
                        disabled={isLoading}
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
            ) : (
              <TableRow>
                <TableCell
                  colSpan="7"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  {isLoading ? "Loading..." : "No data found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Pagination
          count={filteredData.length}
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

export default MaterialData;
