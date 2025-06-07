import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Truck,
  Calendar,
  Phone,
  Package,
  X,
  Users,
  MapPin,
} from "lucide-react";

function TransportersManagement({
  transporters,
  onRefresh,
  token,
}: {
  transporters: any;
  onRefresh: any;
  token: string;
}) {
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

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "truck":
      case "trailer":
      case "container":
        return <Truck className="h-4 w-4" />;
      case "van":
      case "pickup":
        return <Package className="h-4 w-4" />;
      default:
        return <Truck className="h-4 w-4" />;
    }
  };

  const getVehicleColor = (type: string) => {
    const colors = {
      truck: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      van: "bg-green-500/20 text-green-300 border-green-500/30",
      trailer: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      pickup: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      container: "bg-red-500/20 text-red-300 border-red-500/30",
    };
    return colors[type as keyof typeof colors] || colors.truck;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Truck className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              Transporters
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">
              Manage your transport fleet and drivers
            </p>
          </div>

          {/* Stats Cards - Mobile Responsive */}
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-4 py-3 shadow-lg">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-xs text-slate-400">Total</p>
                  <p className="text-lg font-bold text-white">
                    {transporters.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-4 py-3 shadow-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-xs text-slate-400">Active</p>
                  <p className="text-lg font-bold text-white">
                    {
                      transporters.filter((t: any) => t.status === "active")
                        .length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mb-6 lg:mb-8">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Truck className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Fleet Management
                </h2>
                <p className="text-sm text-slate-400">
                  Add, edit, and manage transporters
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              <div className="flex items-center justify-center space-x-2">
                <Plus className="h-5 w-5 transition-transform group-hover:rotate-90 duration-300" />
                <span>Add Transporter</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {transporters.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="p-6 bg-gradient-to-br from-slate-700/50 to-slate-600/50 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Truck className="h-12 w-12 text-slate-300" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              No transporters found
            </h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Start building your transport network by adding your first
              transporter
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <div className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add First Transporter</span>
              </div>
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 border-b border-white/10">
                    <th className="w-1/6 px-4 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="w-1/7 px-3 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="w-1/7 px-3 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="w-1/8 px-3 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="w-1/8 px-3 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="w-1/7 px-3 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="w-1/8 px-3 py-4 text-left text-sm font-semibold text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transporters.map((transporter: any, index: number) => (
                    <tr
                      key={index}
                      className="hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                            <Truck className="h-4 w-4 text-blue-400" />
                          </div>
                          <span className="text-white font-medium truncate">
                            {transporter.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center space-x-1 text-slate-300">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate text-sm font-mono">
                            {transporter.contact}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getVehicleColor(
                            transporter.vehicleType
                          )}`}
                        >
                          {getVehicleIcon(transporter.vehicleType)}
                          <span className="capitalize truncate">
                            {transporter.vehicleType}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center space-x-1 text-slate-300">
                          <Package className="h-3 w-3 flex-shrink-0" />
                          <span className="text-sm">
                            {transporter.capacity} kg
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            transporter.status === "active"
                              ? "bg-green-500/20 text-green-300 border border-green-500/30"
                              : "bg-red-500/20 text-red-300 border border-red-500/30"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full mr-1 flex-shrink-0 ${
                              transporter.status === "active"
                                ? "bg-green-400"
                                : "bg-red-400"
                            }`}
                          ></div>
                          <span className="truncate">{transporter.status}</span>
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center space-x-1 text-slate-300">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          <span className="text-xs truncate">
                            {transporter.createdAt
                              ? new Date(
                                  transporter.createdAt
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "2-digit",
                                })
                              : "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <button
                          onClick={() =>
                            handleDeleteTransporter(transporter.id)
                          }
                          disabled={deleteLoading === transporter.id}
                          className="group inline-flex items-center justify-center p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 disabled:opacity-50"
                        >
                          {deleteLoading === transporter.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                          ) : (
                            <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-4 space-y-4">
              {transporters.map((transporter: any, index: number) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Truck className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          {transporter.name}
                        </h3>
                        <p className="text-slate-400 text-sm flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span className="truncate">
                            {transporter.contact}
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTransporter(transporter.id)}
                      disabled={deleteLoading === transporter.id}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {deleteLoading === transporter.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getVehicleColor(
                          transporter.vehicleType
                        )}`}
                      >
                        {getVehicleIcon(transporter.vehicleType)}
                        <span className="capitalize">
                          {transporter.vehicleType}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-300">
                      <Package className="h-4 w-4" />
                      <span>{transporter.capacity} kg</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          transporter.status === "active"
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            transporter.status === "active"
                              ? "bg-green-400"
                              : "bg-red-400"
                          }`}
                        ></div>
                        {transporter.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-300">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs">
                        {transporter.createdAt
                          ? new Date(transporter.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Dialog */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-2xl shadow-2xl">
              {/* Dialog Header */}
              <div className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Add New Transporter
                      </h2>
                      <p className="text-slate-300 text-sm">
                        Fill in the details to create a new transporter
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Dialog Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
                      <Truck className="h-4 w-4" />
                      <span>Transporter Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter transporter name"
                      value={newTransporter.name}
                      onChange={(e) =>
                        setNewTransporter({
                          ...newTransporter,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>Contact Information</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Phone or Email"
                      value={newTransporter.contact}
                      onChange={(e) =>
                        setNewTransporter({
                          ...newTransporter,
                          contact: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Vehicle Type</span>
                    </label>
                    <select
                      value={newTransporter.vehicleType}
                      onChange={(e) =>
                        setNewTransporter({
                          ...newTransporter,
                          vehicleType: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 appearance-none"
                      required
                    >
                      <option value="" className="bg-slate-800">
                        Select Vehicle Type
                      </option>
                      <option value="truck" className="bg-slate-800">
                        🚛 Truck
                      </option>
                      <option value="van" className="bg-slate-800">
                        🚐 Van
                      </option>
                      <option value="trailer" className="bg-slate-800">
                        🚚 Trailer
                      </option>
                      <option value="pickup" className="bg-slate-800">
                        🛻 Pickup
                      </option>
                      <option value="container" className="bg-slate-800">
                        📦 Container
                      </option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center space-x-2">
                      <Package className="h-4 w-4" />
                      <span>Capacity (kg)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Enter capacity"
                      value={newTransporter.capacity}
                      onChange={(e) =>
                        setNewTransporter({
                          ...newTransporter,
                          capacity: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Dialog Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-white/10">
                  <button
                    onClick={handleCreateTransporter}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Plus className="h-5 w-5" />
                        <span>Create Transporter</span>
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-xl font-medium transition-all duration-300 border border-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransportersManagement;
