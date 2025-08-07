import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import Home from "./components/user/Home";
import Loader from "./common/Loader";

// Lazy-loaded components
const Login = React.lazy(() => import("./components/user/Login"));
const ForgetPassword = React.lazy(() => import("./components/user/ForgetPassword"));
const VerifyOtp = React.lazy(() => import("./components/user/Verify"));
const ResetPassword = React.lazy(() => import("./components/user/ResetPassword"));
const AdminDashboard = React.lazy(() => import("./components/admindashboard/AdminDashboard"));
const MasterAdminDashboard = React.lazy(() => import("./components/masteradmindashboard/MasterAdminDashboard"));
// const PerformaInvoice = React.lazy(() => import("./components/admindashboard/proformainvoice/AddproformaInvoice"));
const MarketingTeamDashboard = React.lazy(() => import("./components/marketingteamdashboard/MarketingTeamDashboard"));
const MerchandiseTeamDashboard = React.lazy(() => import("./components/merchandisemarketingdashboard/MerchandiseTeamDashboard"));
const FabricTeamDashboard = React.lazy(() => import("./components/fabricdashboard/FabricTeamDashboard"));
const TrimsTeamDashboard = React.lazy(() => import("./components/trimsdashboard/TrimsTeamDashboard"));
const LogisticsTeamDashboard = React.lazy(() => import("./components/logisticsdashboard/LogisticsTeamDashboard"));
const ProductionTeamDashboard = React.lazy(() => import("./components/productiondashboard/ProductionTeamDashboard"));

// Loading fallback component
const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="spinner">Loading...</div>
  </div>
);

function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Login route */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/load" element={<Loader />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminDashboard />} />
          {/* <Route path="/edit-performa-invoice/*" element={<PerformaInvoice />} /> */}

          <Route path="/masteradmin/*" element={<MasterAdminDashboard />} />
          <Route path="/marketing/*" element={<MarketingTeamDashboard />} />
          <Route path="/merchandise/*" element={<MerchandiseTeamDashboard />} />
          <Route path="/fabric/*" element={<FabricTeamDashboard />} />
          <Route path="/trims/*" element={<TrimsTeamDashboard />} />
          <Route path="/logistics/*" element={<LogisticsTeamDashboard />} />
          <Route path="/production/*" element={<ProductionTeamDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default Router;