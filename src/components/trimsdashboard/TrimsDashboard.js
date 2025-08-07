import React, { useEffect, useState } from "react";
import { Box as LucideBox, ShoppingBag, Package, Truck } from "lucide-react";
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
import { Visibility } from "@mui/icons-material";
import Pagination from "../../services/config/Pagination";
import Loader from "../../common/Loader"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';

const TrimsDashboard = () => {
  const initialOrders = [
    {
      orderId: "#576252852485",
      vendor: "XYZ son & Co",
      poNumber: "228-3844-931-7689",
      orderDate: "02/08/2023",
      status: "On Delivery",
    },
    {
      orderId: "#576252852486",
      vendor: "ABC Trading",
      poNumber: "228-3844-931-7690",
      orderDate: "02/09/2023",
      status: "Pending",
    },
    {
      orderId: "#576252852487",
      vendor: "Global Imports",
      poNumber: "228-3844-931-7691",
      orderDate: "02/10/2023",
      status: "Delivered",
    },
  ];

  const statsCards = [
    {
      label: "Orders",
      value: "6,452",
      icon: <LucideBox className="w-6 h-6 text-pink-500" />,
      bgColor: "bg-pink-50",
    },
    {
      label: "Total sale",
      value: "42,502",
      icon: <ShoppingBag className="w-6 h-6 text-green-500" />,
      bgColor: "bg-green-50",
    },
    {
      label: "Products",
      value: "42,502",
      icon: <Package className="w-6 h-6 text-purple-500" />,
      bgColor: "bg-purple-50",
    },
    {
      label: "Total delivery",
      value: "56,201",
      icon: <Truck className="w-6 h-6 text-blue-500" />,
      bgColor: "bg-blue-50",
    },
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [orderBy, setOrderBy] = useState("orderId");
  const [order, setOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); 
      return () => clearTimeout(timer);
    }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    const sortedOrders = [...orders].sort((a, b) => {
      const valueA = a[property].toString().toLowerCase();
      const valueB = b[property].toString().toLowerCase();

      if (isAsc) {
        return valueB.localeCompare(valueA);
      }
      return valueA.localeCompare(valueB);
    });

    setOrders(sortedOrders);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const chartData = [
    { name: 'A', value: 400, value2: 240 },
    { name: 'B', value: 300, value2: 139 },
    { name: 'C', value: 300, value2: 980 },
    { name: 'D', value: 200, value2: 390 },
  ];
  const pieData = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <>
    {isLoading && <Loader/>}
      <div className="space-y-6 p-4">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-lg p-4 shadow-sm transform transition-transform duration-200 hover:scale-105`}
          >
            <div className="flex items-center">
              <div className="p-2 rounded-lg bg-white bg-opacity-50">
                {card.icon}
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">{card.label}</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-semibold">
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="w-full p-4">
        <div className="flex flex-wrap gap-6 justify-center mb-8">
          {/* Bar Chart */}
          <BarChart width={300} height={250} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ReTooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
            <Bar dataKey="value2" fill="#82ca9d" />
          </BarChart>
          {/* Pie Chart */}
          <PieChart width={300} height={250}>
            <Pie
              data={pieData}
              cx={150}
              cy={125}
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ReTooltip />
          </PieChart>
          {/* Line Chart */}
          <LineChart width={300} height={250} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ReTooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
            <Line type="monotone" dataKey="value2" stroke="#82ca9d" />
          </LineChart>
        </div>
      </div>

      {/* Material UI Table with Borders */}
      <TableContainer
        component={Paper}
        className="shadow-lg overflow-hidden border-2 border-[#2B86AA]"
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
          aria-label="orders table"
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "orderId"}
                  direction={orderBy === "orderId" ? order : "asc"}
                  onClick={() => handleSort("orderId")}
                >
                  Order ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "vendor"}
                  direction={orderBy === "vendor" ? order : "asc"}
                  onClick={() => handleSort("vendor")}
                >
                  Vendor
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "poNumber"}
                  direction={orderBy === "poNumber" ? order : "asc"}
                  onClick={() => handleSort("poNumber")}
                >
                  PO Number
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "orderDate"}
                  direction={orderBy === "orderDate" ? order : "asc"}
                  onClick={() => handleSort("orderDate")}
                >
                  Order Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ fontFamily: "Inter, sans-serif", color: "#171A1F" }}>
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order.orderId} hover>
                  <TableCell component="th" scope="row">
                    {order.orderId}
                  </TableCell>
                  <TableCell>{order.vendor}</TableCell>
                  <TableCell>{order.poNumber}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm
                      ${
                        order.status === "On Delivery"
                          ? "bg-blue-100 text-blue-600"
                          : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        sx={{
                          color: "#5B5B5B",
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <Pagination
          count={orders.length}
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

export default TrimsDashboard;