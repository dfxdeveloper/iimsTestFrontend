import React, { useState, Suspense, useRef, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import {
  FileText,
  Bell,
  LayoutGrid,
  LogOut,
  ChevronDown,
  ChevronUp,
  X,
  UserCircle,
} from "lucide-react";
import { useAuth } from "../../services/context/auth";
import ProfileModal from "../admindashboard/ProfileModal";

const MasterDashboard = React.lazy(() => import("./MasterDashboard"));
const CompanyTabs = React.lazy(() => import("./companycreation/CompanyCreation"));
const AddIndustry = React.lazy(() => import("./industry/AddIndustry"));
const ProformaInvoices = React.lazy(() => import("./templates/Proformainvoice"));

const MasterAdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMasterDataOpen, setIsMasterDataOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout, user } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  // Function to format department name
  const formatDepartmentName = (department) => {
    if (!department) return "Master Admin";
    return department
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Navigation items array for header title
  const navItems = [
    { path: "/masteradmin/dashboard", label: "Dashboard" },
    { path: "/masteradmin/dashboard/company-creation", label: "Company Creation" },
    { path: "/masteradmin/dashboard/industry", label: "Industry" },
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
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <LogOut className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    Confirm Logout
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to logout? You'll need to sign in again to access your account.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleLogoutConfirm}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Logout
              </button>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/masteradmin/dashboard",
      icon:  <img
      src="/assets/dashboard.svg"
      alt="user"
      className="h-5 w-5 mr-3"
    />
    },
    {
      id: "companyCreation",
      label: "Company Creation",
      path: "/masteradmin/dashboard/company-creation",
      icon: (
        <img
          src="/assets/companycreation.svg"
          alt="user"
          className="h-5 w-5 mr-3"
        />
      ),
    },
    {
      id: "AddIndustry",
      label: "Industry",
      path: "/masteradmin/dashboard/industry",
      icon: (
        <img
          src="/assets/industry.svg"
          alt="industry"
          className="h-5 w-5 mr-3"
        />
      ),
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "New Purchase Order",
      message: "A new purchase order #123 has been created",
      time: "5 minutes ago"
    },
    {
      id: 2,
      title: "Partner Update",
      message: "Partner profile updated for ABC Corp",
      time: "1 hour ago"
    },
    {
      id: 3,
      title: "Invoice Generated",
      message: "New invoice #456 has been generated",
      time: "2 hours ago"
    }
  ];

  const NavigationItem = ({ item }) => {
    const isActive = location.pathname === item.path;

    const renderIcon = (icon) => {
      if (React.isValidElement(icon)) {
        return icon;
      } else if (typeof icon === 'function') {
        return React.createElement(icon, { className: "h-5 w-5 mr-3" });
      }
      return null;
    };

    if (item.isDropdown) {
      return (
        <div className="mb-1">
          <button
            onClick={() => setIsMasterDataOpen(!isMasterDataOpen)}
            className="w-full flex items-center justify-between px-4 py-2 text-[#FFFFFF] rounded-lg transition-colors"
          >
            <div className="flex items-center">
              {renderIcon(item.icon)}
              <span className="text-sm font-medium">{item.label}</span>
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
                        ? "text-[#F2F2FD1A] bg-[#F2F2FD1A]-50"
                        : "text-[#FFFFFF] hover:bg-[#F2F2FD1A]-100"
                    }
                  `}
                >
                  {renderIcon(child.icon)}
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
              ? "text-white bg-[#F2F2FD1A]"
              : "text-white hover:[#F2F2FD1A]"
          }
        `}
      >
        {renderIcon(item.icon)}
        {item.label}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
      `}</style>

      <aside
        className={`
          fixed lg:static w-64 h-full bg-[#0E3D50] border-r flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 z-50
        `}
      >
        <div className="px-4 py-5 border-b">
          <Link to="/masteradmin/dashboard" className="flex items-center space-x-3">
            <img
              src="/assets/logo.png"
              alt="Logo"
              className="h-8 sm:h-10 md:h-12"
            />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {sidebarItems.map((item) => (
            <NavigationItem key={item.id} item={item} />
          ))}
        </nav>

        {/* User Info Block - Fixed at bottom */}
        <div className="bg-[#083445] border-t border-[#1a5c73] p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">
                  {user?.authorizedEmail?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm">
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-pulse opacity-75"></div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">
                {formatDepartmentName(user?.department)}
              </h3>
              <p className="text-xs text-gray-300 truncate">
                {user?.authorizedEmail || "masteradmin@company.com"}
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
          fixed right-0 top-0 w-80 h-full bg-white shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isNotificationOpen ? "translate-x-0" : "translate-x-full"}
          z-50
        `}
      >
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <button
              onClick={toggleNotifications}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto h-full pb-20 custom-scrollbar">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 border-b hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900">{notification.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              <span className="text-xs text-gray-500 mt-2 block">
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
        <header className="text-[#FFFFFF] border-b">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden text-Inter text-[#FFFFFF]"
              >
                <LayoutGrid className="h-6 w-6" />
              </button>
              <h1 className="text-3xl font-semibold text-[#171A1F]">
                {navItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="relative flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-violet-500/10 hover:to-blue-500/10 rounded-full transition-all duration-300 group"
                  aria-label="Profile"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-30 blur-sm animate-pulse transition-all duration-300"></div>
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-75 blur-sm animate-spin-slow transition-all duration-300"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-30 animate-ping transition-all duration-300"></div>
                    <div className="relative w-8 h-8 bg-gradient-to-br from-violet-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-violet-500/25">
                      <span className="text-white text-sm font-bold drop-shadow-lg relative z-10">
                        {user?.authorizedEmail?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse">
                      <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                  </div>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="px-4 py-3 border-b border-gray-100">
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
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {formatDepartmentName(user?.department)}
                          </h3>
                          <p className="text-xs text-gray-600 truncate">
                            {user?.authorizedEmail || "masteradmin@company.com"}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded">
                            Master Admin
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 group"
                        onClick={handleProfileClick}
                      >
                        <UserCircle className="h-4 w-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                          Your Profile
                        </span>
                      </button>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors duration-150 flex items-center gap-3 text-red-600 group"
                      >
                        <LogOut className="h-4 w-4 group-hover:text-red-700 transition-colors" />
                        <span className="text-sm group-hover:text-red-700">
                          Sign out
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={toggleNotifications}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors relative"
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
                element={<Navigate to="/masteradmin/dashboard" replace />}
              />
              <Route path="dashboard" element={<MasterDashboard />} />
              <Route path="dashboard/company-creation" element={<CompanyTabs />} />
              <Route path="dashboard/industry" element={<AddIndustry />} />
              <Route path="dashboard/edit-pi" element={<ProformaInvoices />} />
              <Route
                path="*"
                element={<Navigate to="/masteradmin/dashboard" replace />}
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

export default MasterAdminDashboard;