// import React, { useState } from "react";
// import { Box as LucideBox, ShoppingBag, Package, Truck } from "lucide-react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TableSortLabel,
//   Paper,
//   IconButton,
//   Tooltip,
// } from "@mui/material";
// import { Visibility } from "@mui/icons-material";
// import Pagination from "../../services/config/Pagination";

// const Dashboard = () => {
//   const initialOrders = [
//     {
//       orderId: "#576252852485",
//       vendor: "XYZ son & Co",
//       poNumber: "228-3844-931-7689",
//       orderDate: "02/08/2023",
//       status: "On Delivery",
//     },
//     {
//       orderId: "#576252852486",
//       vendor: "ABC Trading",
//       poNumber: "228-3844-931-7690",
//       orderDate: "02/09/2023",
//       status: "Pending",
//     },
//     {
//       orderId: "#576252852487",
//       vendor: "Global Imports",
//       poNumber: "228-3844-931-7691",
//       orderDate: "02/10/2023",
//       status: "Delivered",
//     },
//   ];

//   const statsCards = [
//     {
//       label: "Orders",
//       value: "6,452",
//       icon: <LucideBox className="w-6 h-6 text-pink-500" />,
//       bgColor: "bg-pink-50",
//     },
//     {
//       label: "Total sale",
//       value: "42,502",
//       icon: <ShoppingBag className="w-6 h-6 text-green-500" />,
//       bgColor: "bg-green-50",
//     },
//     {
//       label: "Products",
//       value: "42,502",
//       icon: <Package className="w-6 h-6 text-purple-500" />,
//       bgColor: "bg-purple-50",
//     },
//     {
//       label: "Total delivery",
//       value: "56,201",
//       icon: <Truck className="w-6 h-6 text-blue-500" />,
//       bgColor: "bg-blue-50",
//     },
//   ];

//   const [orders, setOrders] = useState(initialOrders);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(8);
//   const [orderBy, setOrderBy] = useState("orderId");
//   const [order, setOrder] = useState("asc");

//   const handleSort = (property) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);

//     const sortedOrders = [...orders].sort((a, b) => {
//       const valueA = a[property].toString().toLowerCase();
//       const valueB = b[property].toString().toLowerCase();

//       if (isAsc) {
//         return valueB.localeCompare(valueA);
//       }
//       return valueA.localeCompare(valueB);
//     });

//     setOrders(sortedOrders);
//   };

//   // Pagination handlers
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <div className="space-y-6 p-4">
//       {/* Stats Cards Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {statsCards.map((card, index) => (
//           <div
//             key={index}
//             className={`${card.bgColor} rounded-lg p-4 shadow-sm transform transition-transform duration-200 hover:scale-105`}
//           >
//             <div className="flex items-center">
//               <div className="p-2 rounded-lg bg-white bg-opacity-50">
//                 {card.icon}
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-gray-600">{card.label}</p>
//                 <p className="text-lg sm:text-xl lg:text-2xl font-semibold">
//                   {card.value}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Material UI Table with Borders */}
//       <TableContainer
//         component={Paper}
//         className="shadow-lg border border-gray-200"
//       >
//         <Table
//           sx={{
//             minWidth: 650,
//             "& .MuiTableCell-root": {
//               borderRight: "1px solid rgba(224, 224, 224, 1)",
//               borderBottom: "1px solid rgba(224, 224, 224, 1)",
//               fontFamily: "Inter, sans-serif",
//             },
//             "& .MuiTableCell-head": {
//               fontFamily: "Archivo, sans-serif",
//               fontWeight: 700,
//               color: "#171A1F",
//               backgroundColor: "#EEEEEE",
//             },
//             "& .MuiTableCell-root:last-child": {
//               borderRight: "none",
//             },
//           }}
//           aria-label="orders table"
//         >
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === "orderId"}
//                   direction={orderBy === "orderId" ? order : "asc"}
//                   onClick={() => handleSort("orderId")}
//                 >
//                   Order ID
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === "vendor"}
//                   direction={orderBy === "vendor" ? order : "asc"}
//                   onClick={() => handleSort("vendor")}
//                 >
//                   Vendor
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === "poNumber"}
//                   direction={orderBy === "poNumber" ? order : "asc"}
//                   onClick={() => handleSort("poNumber")}
//                 >
//                   PO Number
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === "orderDate"}
//                   direction={orderBy === "orderDate" ? order : "asc"}
//                   onClick={() => handleSort("orderDate")}
//                 >
//                   Order Date
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell>
//                 <TableSortLabel
//                   active={orderBy === "status"}
//                   direction={orderBy === "status" ? order : "asc"}
//                   onClick={() => handleSort("status")}
//                 >
//                   Status
//                 </TableSortLabel>
//               </TableCell>
//               <TableCell align="center">Action</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody sx={{ fontFamily: "Inter, sans-serif", color: "#171A1F" }}>
//             {orders
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((order) => (
//                 <TableRow key={order.orderId} hover>
//                   <TableCell component="th" scope="row">
//                     {order.orderId}
//                   </TableCell>
//                   <TableCell>{order.vendor}</TableCell>
//                   <TableCell>{order.poNumber}</TableCell>
//                   <TableCell>{order.orderDate}</TableCell>
//                   <TableCell>
//                     <span
//                       className={`px-2 py-1 rounded-full text-sm
//                       ${
//                         order.status === "On Delivery"
//                           ? "bg-blue-100 text-blue-600"
//                           : order.status === "Pending"
//                           ? "bg-yellow-100 text-yellow-600"
//                           : "bg-green-100 text-green-600"
//                       }`}
//                     >
//                       {order.status}
//                     </span>
//                   </TableCell>
//                   <TableCell align="center">
//                     <Tooltip title="View Details">
//                       <IconButton
//                         size="small"
//                         sx={{
//                           color: "#5B5B5B",
//                         }}
//                       >
//                         <Visibility />
//                       </IconButton>
//                     </Tooltip>
//                   </TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>

//         <Pagination
//           count={orders.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           rowsPerPageOptions={[8, 16, 24, 32]} 
//         />
//       </TableContainer>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { ChevronDown, Filter, Search, Download, RefreshCw, Eye, Edit, Trash2, PlusCircle } from "lucide-react";

const Dashboard = () => {
  // Sample data
  const salesData = [
    { name: "Jan", sales: 4000, orders: 240 },
    { name: "Feb", sales: 3000, orders: 198 },
    { name: "Mar", sales: 5000, orders: 306 },
    { name: "Apr", sales: 2780, orders: 189 },
    { name: "May", sales: 1890, orders: 130 },
    { name: "Jun", sales: 2390, orders: 150 },
    { name: "Jul", sales: 3490, orders: 210 },
  ];

  const inventoryStatusData = [
    { name: "In Stock", value: 65, color: "#4CAF50" },
    { name: "Low Stock", value: 25, color: "#FFC107" },
    { name: "Out of Stock", value: 10, color: "#F44336" },
  ];

  const orderStatusData = [
    { name: "Delivered", value: 60, color: "#4CAF50" },
    { name: "On Delivery", value: 25, color: "#2196F3" },
    { name: "Pending", value: 15, color: "#FFC107" },
  ];

  const recentInventoryItems = [
    { id: "PRD-7841", name: "Ergonomic Office Chair", category: "Furniture", stock: 24, price: "$129.99", status: "In Stock" },
    { id: "PRD-6523", name: "Wireless Keyboard", category: "Electronics", stock: 12, price: "$59.99", status: "In Stock" },
    { id: "PRD-5312", name: "Smart LED Bulb", category: "Electronics", stock: 5, price: "$21.99", status: "Low Stock" },
    { id: "PRD-3291", name: "Standing Desk", category: "Furniture", stock: 0, price: "$349.99", status: "Out of Stock" },
    { id: "PRD-2189", name: "Bluetooth Speaker", category: "Electronics", stock: 18, price: "$79.99", status: "In Stock" },
  ];

  const recentOrders = [
    { id: "#576252852490", vendor: "Office Solutions Ltd", poNumber: "228-3844-931-7695", date: "05/05/2023", total: "$2,349.99", status: "Delivered" },
    { id: "#576252852489", vendor: "Tech Innovations", poNumber: "228-3844-931-7694", date: "05/03/2023", total: "$1,499.00", status: "On Delivery" },
    { id: "#576252852488", vendor: "Global Imports", poNumber: "228-3844-931-7693", date: "05/01/2023", total: "$785.50", status: "Pending" },
    { id: "#576252852487", vendor: "Global Imports", poNumber: "228-3844-931-7691", date: "02/10/2023", total: "$427.99", status: "Delivered" },
    { id: "#576252852486", vendor: "ABC Trading", poNumber: "228-3844-931-7690", date: "02/09/2023", total: "$1,899.00", status: "Delivered" },
  ];

  const statsCards = [
    { label: "Total Inventory", value: "12,583", change: "+8.2%", trend: "up" },
    { label: "Total Orders", value: "6,452", change: "+12.5%", trend: "up" },
    { label: "Total Sales", value: "$42,502", change: "+5.7%", trend: "up" },
    { label: "Low Stock Items", value: "84", change: "-3.4%", trend: "down" },
  ];

  const COLORS = ["#4CAF50", "#FFC107", "#F44336", "#2196F3", "#9C27B0"];

  const [activeTab, setActiveTab] = useState("inventory");

  const renderStatsCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800">{card.value}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                card.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCharts = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales & Orders Chart */}
        <div className="bg-white rounded-lg shadow-md p-4 lg:col-span-2 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Sales & Orders</h2>
            <div className="flex gap-2">
              <button className="text-sm px-3 py-1 border border-gray-200 rounded-md flex items-center gap-1 hover:bg-gray-50">
                Monthly <ChevronDown size={16} />
              </button>
              <button className="text-sm px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50">
                <Download size={16} />
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="sales" name="Sales ($)" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#2196F3" strokeWidth={2} dot={{ r: 4 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Status Chart */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Inventory Status</h2>
            <button className="text-sm px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50">
              <RefreshCw size={16} />
            </button>
          </div>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {inventoryStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{ 
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {inventoryStatusData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: entry.color }}></div>
                <span className="text-xs text-gray-600">{entry.name}: {entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (activeTab === "inventory") {
      return (
        <div className="bg-white rounded-lg shadow-md border border-gray-100">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Recent Inventory</h2>
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  className="text-sm pl-8 pr-4 py-2 border border-gray-200 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                />
                <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
              </div>
              <button className="text-sm px-3 py-2 border border-gray-200 rounded-md flex items-center gap-1 hover:bg-gray-50">
                <Filter size={16} /> Filter
              </button>
              <button className="text-sm px-3 py-2 bg-blue-600 text-white rounded-md flex items-center gap-1 hover:bg-blue-700">
                <PlusCircle size={16} /> Add Item
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentInventoryItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.stock}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.price}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.status === "In Stock" ? "bg-green-100 text-green-800" :
                        item.status === "Low Stock" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800">
                          <Eye size={16} />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-gray-800">
                          <Edit size={16} />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-800">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">42</span> items
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    8
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white rounded-lg shadow-md border border-gray-100">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="text-sm pl-8 pr-4 py-2 border border-gray-200 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                />
                <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
              </div>
              <button className="text-sm px-3 py-2 border border-gray-200 rounded-md flex items-center gap-1 hover:bg-gray-50">
                <Filter size={16} /> Filter
              </button>
              <button className="text-sm px-3 py-2 bg-blue-600 text-white rounded-md flex items-center gap-1 hover:bg-blue-700">
                <PlusCircle size={16} /> New Order
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{order.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{order.vendor}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{order.poNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.total}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === "Delivered" ? "bg-green-100 text-green-800" :
                        order.status === "On Delivery" ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800">
                          <Eye size={16} />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-gray-800">
                          <Edit size={16} />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-800">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">28</span> orders
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-50 p-0 md:p-0">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your inventory today.</p>
      </div>

      {/* Stats Cards */}
      {renderStatsCards()}

      {/* Charts Section */}
      {renderCharts()}

      {/* Tabs */}
      <div className="flex mb-4 border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "inventory"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("inventory")}
        >
          Inventory
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "orders"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default Dashboard;