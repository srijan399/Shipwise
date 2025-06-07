import React, { useState, useEffect } from "react";
import { Plus, Trash2, Mail, Shield, Calendar, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function UserManagement({
  users,
  onRefresh,
  token,
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
    <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 rounded-xl shadow-2xl border border-slate-700/50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                User Management
              </h3>
              <p className="text-sm text-slate-400">
                {users.length} users total
              </p>
            </div>
          </div>

          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25">
                <Plus className="h-4 w-4" />
                Add User
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Create New User
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  Add a new user to the system with appropriate permissions.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="user@example.com"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Role
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="management_staff">Management Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreateUser}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Create User"}
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden">
        <div className="px-6 py-3 bg-slate-800/50 border-b border-slate-700/30">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-slate-400 uppercase tracking-wider">
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Created</div>
            <div className="col-span-2">Actions</div>
          </div>
        </div>

        <div className="divide-y divide-slate-700/30">
          {users.map((user: any, index: number) => (
            <div
              key={index}
              className="px-6 py-4 hover:bg-slate-800/30 transition-colors"
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Email */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white truncate">
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* Role */}
                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === "admin"
                        ? "bg-red-500/20 text-red-300 border border-red-500/20"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/20"
                    }`}
                  >
                    <Shield className="h-3 w-3" />
                    {user.role}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      user.disabled
                        ? "bg-red-500/20 text-red-300 border border-red-500/20"
                        : "bg-green-500/20 text-green-300 border border-green-500/20"
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        user.disabled ? "bg-red-400" : "bg-green-400"
                      }`}
                    />
                    {user.disabled ? "Disabled" : "Active"}
                  </span>
                </div>

                {/* Created */}
                <div className="col-span-3 flex items-center gap-2 text-sm text-slate-400">
                  <Calendar className="h-4 w-4" />
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </div>

                {/* Actions */}
                <div className="col-span-2">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={deleteLoading === user.uid}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleteLoading === user.uid ? (
                      <div className="animate-spin rounded-full h-3 w-3 border border-red-400 border-t-transparent"></div>
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="p-3 bg-slate-700/50 rounded-full w-fit mx-auto mb-4">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-400 font-medium">No users found</p>
            <p className="text-slate-500 text-sm mt-1">
              Create your first user to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;
