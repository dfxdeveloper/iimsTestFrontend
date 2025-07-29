import React, { useState, useEffect } from "react";
import { Search, Download, Upload } from "lucide-react";
import { api } from "../../../services/config/axiosInstance";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import Pagination from "../../../services/config/Pagination";
import { showToast } from "../../../services/config/toast";
import { Toaster } from "react-hot-toast";
import Loader from "../../../common/Loader"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper
} from "@mui/material";

const Stock = () => {
  const [selectedPlant, setSelectedPlant] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const result = await api.get("/stock");
        if (result.success && result.data) {
          const transformedData = result.data.map(item => ({
            plantCode: item.plantCode,
            materialCode: item.masterData.materialCode,
            itemDescription: item.masterData.itemDescription,
            quantity: item.quantity,
            createdAt: item.createdAt || null,
            updatedAt: item.updatedAt || null
          }));

          setInventory(transformedData);
        } else {
          throw new Error("Failed to fetch inventory data");
        }
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError(err.message || "An error occurred while fetching inventory data");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const getFilteredData = () => {
    return inventory.filter(item => {
      const matchesSearch = searchQuery === "" ||
        Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesPlant = selectedPlant === "" || item.plantCode === selectedPlant;

      return matchesSearch && matchesPlant;
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortedData = () => {
    const filteredData = getFilteredData();
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      if (sortField === "quantity") {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      }
      if (sortField === "createdAt" || sortField === "updatedAt") {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    if (page !== newPage) {
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (rowsPerPage !== newRowsPerPage) {
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const plantCode = selectedPlant || "";
      const result = await api.get(`/stock?plantCode=${plantCode}`);

      if (result.success && result.data) {
        const data = result.data.map(item => ({
          plantCode: item.plantCode,
          materialCode: item.masterData.materialCode,
          itemDescription: item.masterData.itemDescription,
          quantity: item.quantity,
          createdAt: item.createdAt || "",
          updatedAt: item.updatedAt || ""
        }));

        const headers = "Plant Code,Material Code,Description,Quantity,Created At,Updated At\n";
        const csvContent = headers + data.map(item =>
          `${item.plantCode},${item.materialCode},${item.itemDescription},${item.quantity},${item.createdAt},${item.updatedAt}`
        ).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'inventory-stock.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Error exporting inventory:", err);
      showToast.error("Error exporting inventory data");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        let parsedData = [];
        let invalidEntries = [];

        if (file.name.endsWith('.csv')) {
          Papa.parse(content, {
            header: true,
            skipEmptyLines: true,
            trimHeaders: true,
            complete: async (results) => {
              const processedData = processImportData(results.data);
              parsedData = processedData.validData;
              invalidEntries = processedData.invalidEntries;

              handleProcessedData(parsedData, invalidEntries);
            },
            error: (err) => {
              console.error("Error parsing CSV:", err);
              showToast.error("Error parsing CSV file");
            }
          });
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          const workbook = XLSX.read(content, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: ['Plant Code', 'Material Code', 'Description', 'Quantity', 'Created At', 'Updated At'],
            range: 1,
            blankrows: false
          });

          const processedData = processImportData(jsonData);
          parsedData = processedData.validData;
          invalidEntries = processedData.invalidEntries;

          handleProcessedData(parsedData, invalidEntries);
        } else {
          showToast.error("Unsupported file format");
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const processImportData = (data) => {
    const validData = [];
    const invalidEntries = [];
    const existingItemsMap = new Map();
    const materialDescriptionMap = new Map();

    inventory.forEach(item => {
      const compoundKey = `${item.plantCode}-${item.materialCode}`;
      existingItemsMap.set(compoundKey, item);
      materialDescriptionMap.set(item.materialCode, item.itemDescription);
    });

    data.forEach((item, index) => {
      const plantCode = (item['Plant Code'] || '').trim();
      const materialCode = (item['Material Code'] || '').trim();
      const itemDescription = (item['Description'] || '').trim();
      const rawQuantity = (item['Quantity'] || '').toString().trim();
      const quantity = parseInt(rawQuantity, 10)
      if (!plantCode || !materialCode || !itemDescription) {
        invalidEntries.push({
          rowIndex: index + 2,
          plantCode,
          materialCode,
          itemDescription,
          quantity: rawQuantity,
          reason: "Missing required field(s)"
        });
        return;
      }
      if (isNaN(quantity) || quantity <= 0) {
        invalidEntries.push({
          rowIndex: index + 2,
          plantCode,
          materialCode,
          itemDescription,
          quantity: rawQuantity,
          reason: !isNaN(quantity) && quantity <= 0 ?
            "Quantity must be greater than 0" :
            "Invalid quantity format"
        });
        return;
      }
      const compoundKey = `${plantCode}-${materialCode}`;
      if (!existingItemsMap.has(compoundKey)) {
        invalidEntries.push({
          rowIndex: index + 2,
          plantCode,
          materialCode,
          itemDescription,
          quantity: rawQuantity,
          reason: "Invalid material code or plant code combination"
        });
        return;
      }
      const existingDescription = existingItemsMap.get(compoundKey).itemDescription;
      if (existingDescription !== itemDescription) {
        invalidEntries.push({
          rowIndex: index + 2,
          plantCode,
          materialCode,
          itemDescription,
          quantity: rawQuantity,
          reason: "Item description does not match existing record"
        });
        return;
      }
      validData.push({
        plantCode,
        materialCode,
        itemDescription,
        quantity
      });
    });

    return { validData, invalidEntries };
  };

  const handleProcessedData = async (parsedData, invalidEntries) => {
    try {
      if (invalidEntries.length > 0) {
        showToast.error("Invalid Entries !!");
        return;
      }

      if (parsedData.length > 0) {
        setLoading(true);
        await updateInventory(parsedData);
      } else {
        showToast.error("No valid data found to import. Please check your file format.");
      }
    } catch (err) {
      console.error("Error handling import data:", err);
      showToast.error("Error processing import data");
    } finally {
      setLoading(false);
    }
  };

  const updateInventory = async (data) => {
    try {
      const itemsToUpdate = data.map(item => {
        return {
          plantCode: item.plantCode,
          materialCode: item.materialCode,
          quantity: item.quantity
        };
      });

      if (itemsToUpdate.length > 0) {
        await api.post("/stock", itemsToUpdate);

        const result = await api.get("/stock");
        if (result.success && result.data) {
          const transformedData = result.data.map(item => ({
            plantCode: item.plantCode,
            materialCode: item.masterData.materialCode,
            itemDescription: item.masterData.itemDescription,
            quantity: item.quantity,
            createdAt: item.createdAt || null,
            updatedAt: item.updatedAt || null
          }));
          setInventory(transformedData);
          setPage(0);
          showToast.success("Inventory data updated successfully");
        }
      } else {
        showToast.error("No valid items found to update");
      }
    } catch (err) {
      console.error("Error updating inventory:", err);
      showToast.error("Error updating inventory data");
    }
  };

  const filteredSortedData = React.useMemo(() => {
    return getSortedData();
  }, [inventory, searchQuery, selectedPlant, sortField, sortOrder]);

  const paginatedData = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredSortedData.slice(startIndex, endIndex);
  }, [filteredSortedData, page, rowsPerPage]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            className="w-full pl-9 pr-4 py-2 border border-[#ABE7FF] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedPlant}
            onChange={(e) => {
              setSelectedPlant(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 border border-[#ABE7FF] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All Plants</option>
            {[...new Set(inventory.map(item => item.plantCode))].map(plant => (
              <option key={plant} value={plant}>
                {plant}
              </option>
            ))}
          </select>

          <button
            onClick={handleExport}
            className="px-4 py-2 bg-white text-[#2B86AA] rounded-lg border border-[#2B86AA] flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <label className="px-4 py-2 bg-white text-[#2B86AA] rounded-lg border border-[#2B86AA] flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            Import
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {loading && (
        <Loader/>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <TableContainer
          component={Paper}
          className="shadow-lg border border-[#2B86AA]"
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
            aria-label="inventory table"
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'plantCode'}
                    direction={sortField === 'plantCode' ? sortOrder : 'asc'}
                    onClick={() => handleSort('plantCode')}
                  >
                    Plant Code
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'materialCode'}
                    direction={sortField === 'materialCode' ? sortOrder : 'asc'}
                    onClick={() => handleSort('materialCode')}
                  >
                    Material Code
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'itemDescription'}
                    direction={sortField === 'itemDescription' ? sortOrder : 'asc'}
                    onClick={() => handleSort('itemDescription')}
                  >
                    Description
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'quantity'}
                    direction={sortField === 'quantity' ? sortOrder : 'asc'}
                    onClick={() => handleSort('quantity')}
                  >
                    Quantity
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'createdAt'}
                    direction={sortField === 'createdAt' ? sortOrder : 'asc'}
                    onClick={() => handleSort('createdAt')}
                  >
                    Created At
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'updatedAt'}
                    direction={sortField === 'updatedAt' ? sortOrder : 'asc'}
                    onClick={() => handleSort('updatedAt')}
                  >
                    Updated At
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ fontFamily: "Inter, sans-serif", color: "#171A1F" }}>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No inventory items found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow key={`${item.materialCode}-${index}`} hover>
                    <TableCell component="th" scope="row">
                      {item.plantCode}
                    </TableCell>
                    <TableCell>{item.materialCode}</TableCell>
                    <TableCell>{item.itemDescription}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                    <TableCell>{formatDate(item.updatedAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Pagination
            count={filteredSortedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[8, 16, 24, 32]}
          />
        </TableContainer>
      )}

      <Toaster />
    </div>
  );
};

export default Stock;