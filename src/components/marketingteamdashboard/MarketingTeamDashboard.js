import React, { useState, useEffect, useRef, Suspense } from "react";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import {
  User,
  Package,
  Users,
  FileText,
  ClipboardList,
  Settings,
  Bell,
  LayoutGrid,
  Database,
  Box,
  LogOut,
  ChevronDown,
  ChevronUp,
  X,
  UserCircle,
} from "lucide-react";
import { useAuth } from "../../services/context/auth";
import ProfileModal from "../admindashboard/ProfileModal";
const MarketingDashboard = React.lazy(() => import("./MarketingDashboard"));
const Partners = React.lazy(() =>
  import("../admindashboard/partners/Partners")
);
const ProformaInvoice = React.lazy(() =>
  import("../admindashboard/proformainvoice/Proformainvoice")
);
const MarketingTeamDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMasterDataOpen, setIsMasterDataOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

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

  const navItems = [
    { path: "/marketing/dashboard", label: "Marketing Dashboard" },
    { path: "/marketing/partner", label: "Partner" },
    { path: "/marketing/proforma-invoice", label: "Proforma Invoice" },
  ];

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Marketing Dashboard",
      path: "/marketing/dashboard",
      icon: LayoutGrid,
    },
    {
      id: "partner",
      label: "Partner",
      path: "/marketing/partner",
      icon: Users,
    },
    {
      id: "Proforma-invoice",
      label: "Proforma Invoice",
      path: "/marketing/proforma-invoice",
      icon: FileText,
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "New Order",
      message: "A new order #123 has been placed",
      time: "5 minutes ago",
    },
    {
      id: 2,
      title: "Vendor Update",
      message: "Vendor profile updated for XYZ Corp",
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "Delivery Status",
      message: "Order #456 has been delivered",
      time: "2 hours ago",
    },
  ];

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate("/");
    setShowLogoutModal(false);
  };

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setIsProfileDropdownOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleNotifications = () => setIsNotificationOpen(!isNotificationOpen);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);

  // Function to format department name
  const formatDepartmentName = (department) => {
    if (!department) return "Marketing";
    return department
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const LogoutModal = () => {
    if (!showLogoutModal) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={() => setShowLogoutModal(false)}
        />
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                  <LogOut className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                    Confirm Logout
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to logout? You'll need to sign in
                      again to access your account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleLogoutConfirm}
                className="inline-flex w-full justify-center rounded-md bg-red-600 dark:bg-red-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 dark:hover:bg-red-600 sm:ml-3 sm:w-auto"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NavigationItem = ({ item }) => {
    const isActive = location.pathname === item.path;

    if (item.isDropdown) {
      return (
        <div className="mb-1">
          <button
            onClick={() => setIsMasterDataOpen(!isMasterDataOpen)}
            className="w-full flex items-center justify-between px-4 py-2 text-white hover:bg-gray-100 hover:text-blue-500 rounded-lg transition-colors"
          >
            <div className="flex items-center">
              <item.icon className="h-5 w-5 mr-3" />
              <span className="text-sm font-regular">{item.label}</span>
            </div>
            {isMasterDataOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {isMasterDataOpen && (
            <div className="ml-7 mt-1 space-y-1">
              {item.children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => navigate(child.path)}
                  className={`
                    w-full flex items-center px-4 py-2 rounded-lg text-sm
                    ${
                      location.pathname === child.path
                        ? "text-blue-600 bg-blue-50"
                        : "text-white hover:bg-gray-100 hover:text-blue-500"
                    }
                  `}
                >
                  <child.icon className="h-5 w-5 mr-3" />
                  {child.label}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        onClick={() => navigate(item.path)}
        className={`
          w-full flex items-center px-4 py-2 rounded-lg mb-1 text-sm
          ${
            isActive
              ? "text-blue-600 bg-blue-50"
              : "text-white hover:bg-gray-100 hover:text-blue-600"
          }
        `}
      >
        {item.icon && <item.icon className="h-5 w-5 mr-3" />}
        {item.label}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #4ecff4 #005f85;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #4a90a4;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6bb6cd;
          border-radius: 10px;
          border: none;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #87ceeb;
        }

        .dark .custom-scrollbar {
          scrollbar-color: #64748b #374151;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #64748b;
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      <aside
        className={`
          fixed lg:static w-64 h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 z-50
        `}
      >
        <div className="px-4 py-5 border-b dark:border-gray-700 bg-[#2B86AA] dark:bg-gray-800">
          <Link
            to="/marketing/dashboard"
            className="flex items-center p-2 bg-white dark:bg-gray-700 space-x-3 rounded-full"
          >
            <img
              src="/assets/logo.svg"
              alt="Logo"
              className="h-6 sm:h-6 md:h-8"
            />
          </Link>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto bg-[#2B86AA] dark:bg-gray-800 p-4 custom-scrollbar">
          {sidebarItems.map((item) => (
            <NavigationItem key={item.id} item={item} />
          ))}
        </nav>

        {/* User Info Block - Fixed at bottom */}
        <div className="bg-[#1e5f7a] dark:bg-gray-900 border-t border-[#4a90a4] dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">
                  {user?.authorizedEmail?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm">
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-pulse opacity-75"></div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">
                {formatDepartmentName(user?.department)}
              </h3>
              <p className="text-xs text-gray-200 truncate">
                {user?.authorizedEmail || "marketing@company.com"}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full">
                Online
              </span>
            </div>
          </div>
        </div>
      </aside>

      <LogoutModal />

      <div
        className={`
          fixed right-0 top-0 w-80 h-full bg-white dark:bg-gray-800 shadow-lg border-l dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${isNotificationOpen ? "translate-x-0" : "translate-x-full"}
          z-50
        `}
      >
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
            <button
              onClick={toggleNotifications}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto h-full pb-20 custom-scrollbar">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <h3 className="font-medium text-gray-900 dark:text-white">
                {notification.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {notification.message}
              </p>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                {notification.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {(isSidebarOpen || isNotificationOpen || isProfileDropdownOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => {
            setIsSidebarOpen(false);
            setIsNotificationOpen(false);
            setIsProfileDropdownOpen(false);
          }}
        />
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <LayoutGrid className="h-6 w-6" />
              </button>
              <h1 className="text-3xl font-semibold text-[#171A1F] dark:text-white">
                {navItems.find((item) => item.path === location.pathname)
                  ?.label || "Marketing Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="relative flex items-center gap-2 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-blue-500/10 rounded-full transition-all duration-300 group"
                  aria-label="Profile"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-30 blur-sm animate-pulse transition-all duration-300"></div>
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-75 blur-sm animate-spin-slow transition-all duration-300"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-30 animate-ping transitionx-all duration-300"></div>
                    <div className="relative w-8 h-8 bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-violet-500/25">
                      <span className="text-white text-sm font-bold drop-shadow-lg relative z-10">
                        {user?.authorizedEmail?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse">
                      <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                  </div>
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {user?.authorizedEmail
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {formatDepartmentName(user?.department)}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {user?.authorizedEmail || "marketing@company.com"}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded">
                            Marketing
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 flex items-center gap-3 group"
                        onClick={handleProfileClick}
                      >
                        <UserCircle className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                          Your Profile
                        </span>
                      </button>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full px-4 py-2.5 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150 flex items-center gap-3 text-red-600 dark:text-red-400 group"
                      >
                        <LogOut className="h-4 w-4 group-hover:text-red-700 transition-colors" />
                        <span className="text-sm group-hover:text-red-700 dark:group-hover:text-red-300">
                          Sign out
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={toggleNotifications}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors relative"
                aria-label="Notifications"
              >
                <Bell size={24} />
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                index
                element={<Navigate to="/marketing/dashboard" replace />}
              />
              <Route path="dashboard" element={<MarketingDashboard />} />
              <Route path="partner" element={<Partners />} />
              <Route path="proforma-invoice" element={<ProformaInvoice />} />
              <Route
                path="*"
                element={<Navigate to="/marketing/dashboard" replace />}
              />
            </Routes>
          </Suspense>
        </div>
      </main>
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
      />
    </div>
  );
};

export default MarketingTeamDashboard;