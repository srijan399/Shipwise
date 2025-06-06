// src/components/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  FileText,
  Truck,
  BarChart3,
  LogOut,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

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
  const [bids, setBids] = useState([]);
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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
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

  const renderContent = () => {
    if (authLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking permissions...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadDashboardData}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Bids
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {bids.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <Truck className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Transporters
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {transporters.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {users.length}
                    </p>
                    <p className="text-xs text-gray-500">System users</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Completed Deals
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {/* {analytics?.completedDeals || 0} */}
                    </p>
                    <p className="text-xs text-gray-500">This month</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab("users")}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                >
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Manage Users</p>
                </button>
                <button
                  onClick={() => setActiveTab("bids")}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                >
                  <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">View Bids</p>
                </button>
                <button
                  onClick={() => setActiveTab("transporters")}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                >
                  <Truck className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Transporters</p>
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                >
                  <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Analytics</p>
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
          <div className="text-center text-gray-500">
            Select a section from the sidebar
          </div>
        );
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (userRole !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You need admin privileges to access this dashboard.
          </p>
          <button
            onClick={() => (window.location.href = "/auth/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard - Bidding & Transporter Platform
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{currentUser?.email}</span>
                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  {userRole}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow p-6 mr-8">
            <nav className="space-y-2">
              {filteredNavItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-left text-sm font-medium rounded-md transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50"
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
function UserManagement({
  users,
  onRefresh,
  token, // Use token directly from props
}: {
  users: any;
  onRefresh: any;
  token: string;
}) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "management_staff",
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string>("");

  // Debug token in UserManagement
  useEffect(() => {
    console.log("UserManagement token:", token?.substring(0, 20) + "...");
  }, [token]);

  const handleCreateUser = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Creating user with token:", token?.substring(0, 20) + "...");

      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Create user error:", response.status, errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      console.log("User created successfully");
      setNewUser({ email: "", password: "", role: "management_staff" });
      setShowCreateForm(false);
      onRefresh();
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleteLoading(uid);
    try {
      console.log("Deleting user with token:", token?.substring(0, 20) + "...");

      const response = await fetch(`http://localhost:3000/api/users/${uid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete user error:", response.status, errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      console.log(`User with id: ${uid} deleted successfully`);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user. Please try again.");
    } finally {
      setDeleteLoading("");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            User Management
          </h3>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Create New User
            </h4>
            <form
              onSubmit={handleCreateUser}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="password"
                placeholder="Password (min 6 characters)"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                minLength={6}
                required
              />
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="management_staff">Management Staff</option>
                <option value="admin">Admin</option>
              </select>
              <div className="md:col-span-3 flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create User"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.disabled
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.disabled ? "Disabled" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.creationTime
                      ? new Date(user.creationTime).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deleteLoading === user.uid}
                      className="inline-flex items-center text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      {deleteLoading === user.uid ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="ml-1">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found. Create your first user above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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

function TransportersManagement({
  transporters,
  onRefresh,
  token,
}: {
  transporters: any;
  onRefresh: any;
  token: string; // Add token type
}) {
  // console.log(transporters);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTransporter, setNewTransporter] = useState({
    name: "",
    contact: "",
    vehicleType: "",
    capacity: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string>("");

  const handleCreateTransporter = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(
        "Creating transporter with token:",
        token?.substring(0, 20) + "..."
      );

      const response = await fetch("http://localhost:3000/api/transporters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newTransporter.name,
          contact: newTransporter.contact,
          vehicleType: newTransporter.vehicleType,
          capacity: newTransporter.capacity,
          status: newTransporter.status,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.ok}`);
      }

      console.log("Transporter created successfully");
      setNewTransporter({
        name: "",
        contact: "",
        vehicleType: "",
        capacity: "",
        status: "active",
      });
      setShowCreateForm(false);
      onRefresh();
    } catch (error) {
      console.error("Failed to create transporter:", error);
      alert("Failed to create transporter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransporter = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this transporter? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleteLoading(id);
    try {
      console.log(
        "Deleting transporter with token:",
        token?.substring(0, 20) + "..."
      );

      const response = await fetch(
        `http://localhost:3000/api/transporters/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete transporter error:", response.status, errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`
        );
      }

      console.log(`Transporter with id: ${id} deleted successfully`);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete transporter:", error);
      alert("Failed to delete transporter. Please try again.");
    } finally {
      setDeleteLoading("");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Transporters Management
          </h3>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transporter
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h4 className="text-md font-medium text-gray-900 mb-4">
              Create New Transporter
            </h4>
            <form
              onSubmit={handleCreateTransporter}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                placeholder="Transporter Name"
                value={newTransporter.name}
                onChange={(e) =>
                  setNewTransporter({ ...newTransporter, name: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Contact (Phone/Email)"
                value={newTransporter.contact}
                onChange={(e) =>
                  setNewTransporter({
                    ...newTransporter,
                    contact: e.target.value,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <select
                value={newTransporter.vehicleType}
                onChange={(e) =>
                  setNewTransporter({
                    ...newTransporter,
                    vehicleType: e.target.value,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select Vehicle Type</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="trailer">Trailer</option>
                <option value="pickup">Pickup</option>
                <option value="container">Container</option>
              </select>
              <input
                type="number"
                placeholder="Capacity (kg)"
                value={newTransporter.capacity}
                onChange={(e) =>
                  setNewTransporter({
                    ...newTransporter,
                    capacity: e.target.value,
                  })
                }
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="1"
                required
              />
              <div className="md:col-span-2 flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Transporter"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transporters.map((transporter: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transporter.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transporter.contact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                      {transporter.vehicleType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transporter.capacity} kg
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transporter.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transporter.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transporter.createdAt
                      ? new Date(transporter.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleDeleteTransporter(transporter.id)}
                      disabled={deleteLoading === transporter.id}
                      className="inline-flex items-center text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      {deleteLoading === transporter.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="ml-1">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transporters.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transporters found. Create your first transporter above.
            </div>
          )}
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

export default Dashboard;
