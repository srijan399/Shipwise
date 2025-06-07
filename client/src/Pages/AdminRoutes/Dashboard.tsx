import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  FileText,
  Truck,
  BarChart3,
  LogOut,
  Plus,
  RefreshCw,
  AlertCircle,
  User,
  Menu,
  UserCircle,
} from "lucide-react";
import TransportersManagement from "./TransportersTab";
import UserManagement from "./UserManagement";
import { createPortal } from "react-dom";
import { Link } from "react-router";

function Dashboard() {
  const {
    logout,
    userRole,
    currentUser,
    loading: authLoading,
    token,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [bids, _setBids] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect non-admin users
  useEffect(() => {
    if (!authLoading && userRole !== "admin") {
      window.location.href = "/auth/login";
    }
  }, [userRole, authLoading]);

  // Load data when tab changes or when we have proper auth
  useEffect(() => {
    if (userRole === "admin" && token && !authLoading) {
      loadDashboardData();
    }
  }, [activeTab, userRole, token, authLoading]);

  const loadDashboardData = async () => {
    if (userRole !== "admin" || !token) {
      console.warn("Cannot load data - missing admin role or token");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      switch (activeTab) {
        case "users":
          await loadUsers();
          break;
        case "bids":
          await loadBids();
          break;
        case "transporters":
          await loadTransporters();
          break;
        case "analytics":
          await loadAnalytics();
          break;
        case "overview":
          await Promise.all([
            loadUsers(),
            loadBids(),
            loadTransporters(),
            loadAnalytics(),
          ]);
          break;
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      // setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      console.log("Loading users with token:", token.substring(0, 20) + "...");

      const response = await fetch("http://localhost:3000/api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Users API error:", response.status, errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Users loaded successfully:", data);
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error loading users:", error);
      throw error;
    }
  };

  const loadBids = async () => {
    try {
      // Placeholder implementation
      console.log("Loading bids...");
    } catch (error) {
      console.error("Error loading bids:", error);
      throw error;
    }
  };

  const loadTransporters = async () => {
    try {
      console.log("Loading users with token:", token.substring(0, 20) + "...");

      const response = await fetch("http://localhost:3000/api/transporters", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Transporters API error:", response.status, errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Transporters loaded successfully:", data.transporters);
      setTransporters(data.transporters);
    } catch (error) {
      console.error("Error loading transporters:", error);
      throw error;
    }
  };

  const loadAnalytics = async () => {
    try {
      setAnalytics({
        totalBids: 25,
        activeBids: 12,
        totalTransporters: 8,
        activeTransporters: 6,
        completedDeals: 45,
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
      throw error;
    }
  };

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      roles: ["admin"],
    },
    {
      id: "bids",
      label: "Bids Management",
      icon: FileText,
      roles: ["admin"],
    },
    {
      id: "transporters",
      label: "Transporters",
      icon: Truck,
      roles: ["admin"],
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      roles: ["admin"],
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      roles: ["admin"],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole ?? "")
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderContent = () => {
    if (authLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-300">Checking permissions...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={loadDashboardData}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading dashboard data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700/50 hover:shadow-xl hover:border-slate-600/50 transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <FileText className="h-8 w-8 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">
                      Total Bids
                    </p>
                    <p className="text-2xl font-semibold text-white">
                      {bids.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700/50 hover:shadow-xl hover:border-slate-600/50 transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Truck className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">
                      Transporters
                    </p>
                    <p className="text-2xl font-semibold text-white">
                      {transporters.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700/50 hover:shadow-xl hover:border-slate-600/50 transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Users className="h-8 w-8 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">
                      Total Users
                    </p>
                    <p className="text-2xl font-semibold text-white">
                      {users.length}
                    </p>
                    <p className="text-xs text-gray-500">System users</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700/50 hover:shadow-xl hover:border-slate-600/50 transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <BarChart3 className="h-8 w-8 text-orange-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">
                      Completed Deals
                    </p>
                    <p className="text-2xl font-semibold text-white">
                      {/* {analytics?.completedDeals || 0} */}
                    </p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-700/50">
              <h3 className="text-lg font-medium text-white mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab("users")}
                  className="p-4 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 hover:border-slate-500/50 text-center transition-all duration-300 group"
                >
                  <Users className="h-8 w-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-gray-300">
                    Manage Users
                  </p>
                </button>
                <button
                  onClick={() => setActiveTab("bids")}
                  className="p-4 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 hover:border-slate-500/50 text-center transition-all duration-300 group"
                >
                  <FileText className="h-8 w-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-gray-300">View Bids</p>
                </button>
                <button
                  onClick={() => setActiveTab("transporters")}
                  className="p-4 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 hover:border-slate-500/50 text-center transition-all duration-300 group"
                >
                  <Truck className="h-8 w-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-gray-300">
                    Transporters
                  </p>
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className="p-4 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 hover:border-slate-500/50 text-center transition-all duration-300 group"
                >
                  <BarChart3 className="h-8 w-8 text-orange-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-gray-300">Analytics</p>
                </button>
              </div>
            </div>
          </div>
        );

      case "bids":
        return <BidsManagement bids={bids} onRefresh={loadDashboardData} />;

      case "transporters":
        return (
          <TransportersManagement
            transporters={transporters}
            onRefresh={loadDashboardData}
            token={token}
          />
        );

      case "users":
        return (
          <UserManagement
            users={users}
            onRefresh={loadDashboardData}
            token={token} // Pass the context token directly
          />
        );

      case "analytics":
        return <AnalyticsView analytics={analytics} />;

      default:
        return (
          <div className="text-center text-gray-400">
            Select a section from the sidebar
          </div>
        );
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (userRole !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-400 mb-4">
            You need admin privileges to access this dashboard.
          </p>
          <button
            onClick={() => (window.location.href = "/auth/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl shadow-2xl border-b border-slate-700/30">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title Section */}
            <Link to="/" className="flex items-center">
              <div className="flex items-center group">
                <div className="relative p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mr-4 border border-blue-500/20 shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-xl blur-sm"></div>
                  <Truck className="relative h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                    Shipwise
                  </h1>
                  <p className="text-sm text-gray-400 font-medium">
                    Admin Dashboard
                  </p>
                </div>
              </div>
            </Link>

            {/* Refresh Button */}

            {/* User Info and Actions */}
            <div className="flex items-center space-x-6">
              {/* User Profile Section */}
              <div className="flex items-center space-x-3 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
                  <User className="h-5 w-5 text-blue-400" />
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">
                    {currentUser?.email || "Admin User"}
                  </div>
                  <div className="text-xs text-gray-400">{userRole}</div>
                </div>
              </div>

              {/* Hamburger Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="group relative inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-slate-700/50 to-slate-800/50 hover:from-slate-600/50 hover:to-slate-700/50 border border-slate-600/50 hover:border-slate-500/50 rounded-xl text-gray-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-slate-500/20"
                >
                  <Menu className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                </button>

                {isMenuOpen && (
                  <DropdownPortal>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsMenuOpen(false)}
                    ></div>

                    {/* Menu Content */}
                    <div className="fixed right-6 top-16 z-50 w-56 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 py-2">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-slate-900/20 rounded-xl"></div>

                      <div className="relative z-10">
                        <button className="w-full flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200">
                          <UserCircle className="h-4 w-4 mr-3" />
                          Profile Settings
                        </button>
                        <button
                          className="w-full flex items-center px-4 py-3 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all duration-200"
                          onClick={() => logout()}
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </DropdownPortal>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 mr-8 border border-slate-700/50">
            <nav className="space-y-2">
              {filteredNavItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-lg transition-all duration-300 ${
                    activeTab === item.id
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-lg"
                      : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}

// Updated UserManagement component
// function UserManagement({
//   users,
//   onRefresh,
//   token, // Use token directly from props
// }: {
//   users: any;
//   onRefresh: any;
//   token: string;
// }) {
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [newUser, setNewUser] = useState({
//     email: "",
//     password: "",
//     role: "management_staff",
//   });
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState<string>("");

//   // Debug token in UserManagement
//   useEffect(() => {
//     console.log("UserManagement token:", token?.substring(0, 20) + "...");
//   }, [token]);

//   const handleCreateUser = async (e: any) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       console.log("Creating user with token:", token?.substring(0, 20) + "...");

//       const response = await fetch("http://localhost:3000/api/users", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           email: newUser.email,
//           password: newUser.password,
//           role: newUser.role,
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Create user error:", response.status, errorText);
//         throw new Error(
//           `HTTP error! status: ${response.status} - ${errorText}`
//         );
//       }

//       console.log("User created successfully");
//       setNewUser({ email: "", password: "", role: "management_staff" });
//       setShowCreateForm(false);
//       onRefresh();
//     } catch (error) {
//       console.error("Failed to create user:", error);
//       alert("Failed to create user. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteUser = async (uid: string) => {
//     if (
//       !confirm(
//         "Are you sure you want to delete this user? This action cannot be undone."
//       )
//     ) {
//       return;
//     }

//     setDeleteLoading(uid);
//     try {
//       console.log("Deleting user with token:", token?.substring(0, 20) + "...");

//       const response = await fetch(`http://localhost:3000/api/users/${uid}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Delete user error:", response.status, errorText);
//         throw new Error(
//           `HTTP error! status: ${response.status} - ${errorText}`
//         );
//       }

//       console.log(`User with id: ${uid} deleted successfully`);
//       onRefresh();
//     } catch (error) {
//       console.error("Failed to delete user:", error);
//       alert("Failed to delete user. Please try again.");
//     } finally {
//       setDeleteLoading("");
//     }
//   };

//   return (
//     <div className="bg-white shadow rounded-lg">
//       <div className="px-4 py-5 sm:p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg leading-6 font-medium text-gray-900">
//             User Management
//           </h3>
//           <button
//             onClick={() => setShowCreateForm(!showCreateForm)}
//             className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add User
//           </button>
//         </div>

//         {showCreateForm && (
//           <div className="mb-6 p-4 border rounded-lg bg-gray-50">
//             <h4 className="text-md font-medium text-gray-900 mb-4">
//               Create New User
//             </h4>
//             <form
//               onSubmit={handleCreateUser}
//               className="grid grid-cols-1 md:grid-cols-3 gap-4"
//             >
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={newUser.email}
//                 onChange={(e) =>
//                   setNewUser({ ...newUser, email: e.target.value })
//                 }
//                 className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Password (min 6 characters)"
//                 value={newUser.password}
//                 onChange={(e) =>
//                   setNewUser({ ...newUser, password: e.target.value })
//                 }
//                 className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 minLength={6}
//                 required
//               />
//               <select
//                 value={newUser.role}
//                 onChange={(e) =>
//                   setNewUser({ ...newUser, role: e.target.value })
//                 }
//                 className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="management_staff">Management Staff</option>
//                 <option value="admin">Admin</option>
//               </select>
//               <div className="md:col-span-3 flex space-x-3">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {loading ? "Creating..." : "Create User"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowCreateForm(false)}
//                   className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         <div className="overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Email
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Role
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Created
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {users.map((user: any, index: number) => (
//                 <tr key={index}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {user.email}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         user.role === "admin"
//                           ? "bg-red-100 text-red-800"
//                           : "bg-blue-100 text-blue-800"
//                       }`}
//                     >
//                       {user.role}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         user.disabled
//                           ? "bg-red-100 text-red-800"
//                           : "bg-green-100 text-green-800"
//                       }`}
//                     >
//                       {user.disabled ? "Disabled" : "Active"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {user.creationTime
//                       ? new Date(user.creationTime).toLocaleDateString()
//                       : "N/A"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                     <button
//                       onClick={() => handleDeleteUser(user.id)}
//                       disabled={deleteLoading === user.uid}
//                       className="inline-flex items-center text-red-600 hover:text-red-900 disabled:opacity-50"
//                     >
//                       {deleteLoading === user.uid ? (
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
//                       ) : (
//                         <Trash2 className="h-4 w-4" />
//                       )}
//                       <span className="ml-1">Delete</span>
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {users.length === 0 && (
//             <div className="text-center py-8 text-gray-500">
//               No users found. Create your first user above.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// Placeholder components remain the same
function BidsManagement({ bids, onRefresh }: { bids: any; onRefresh: any }) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Bids Management
          </h3>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Bid
          </button>
        </div>
        <div className="text-center py-8 text-gray-500">
          Bids management functionality will be implemented here.
          <br />
          <span className="text-sm">({bids.length} sample bids loaded)</span>
        </div>
      </div>
    </div>
  );
}

function AnalyticsView({ analytics }: { analytics: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Platform Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {analytics.totalBids || 0}
            </p>
            <p className="text-sm text-gray-600">Total Bids</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {analytics.totalTransporters || 0}
            </p>
            <p className="text-sm text-gray-600">Total Transporters</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {analytics.completedDeals || 0}
            </p>
            <p className="text-sm text-gray-600">Completed Deals</p>
          </div>
        </div>
      </div>
      <div className="text-center py-8 text-gray-500 bg-white shadow rounded-lg">
        Advanced analytics and charts will be implemented here.
      </div>
    </div>
  );
}

function DropdownPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(children, document.body);
}

export default Dashboard;
