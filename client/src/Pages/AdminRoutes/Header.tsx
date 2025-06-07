import React, { useState } from "react";
import {
  Truck,
  User,
  Menu,
  UserCircle,
  LogOut,
  Zap,
  Activity,
  Bell,
  Settings,
  Shield,
  TrendingUp,
} from "lucide-react";

// Dropdown Portal Component
function DropdownPortal({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="pointer-events-auto">{children}</div>
    </div>
  );
}

function ShipWiseHeader({
  currentUser,
  userRole = "Admin",
}: {
  currentUser?: any;
  userRole?: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl shadow-2xl border-b border-slate-700/30 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-500/2 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Title Section */}
          <div className="flex items-center space-x-6 group">
            {/* Enhanced Logo */}
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

              {/* Main logo container */}
              <div className="relative p-3 bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-blue-900/90 rounded-xl border border-slate-700/50 shadow-2xl backdrop-blur-sm group-hover:border-blue-500/30 transition-all duration-500 transform group-hover:scale-105">
                {/* Inner gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-cyan-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Animated particles */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping delay-300 opacity-60"></div>

                {/* Logo icon */}
                <Truck className="relative h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-all duration-500 drop-shadow-lg" />
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent tracking-tight">
                  Ship<span className="text-blue-400">Wise</span>
                </h1>
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-yellow-400 animate-pulse" />
                  <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">
                    Live
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <p className="text-slate-300 font-medium tracking-wide text-sm">
                  Smart Logistics & Bidding Platform
                </p>
                <div className="h-1 w-1 bg-slate-500 rounded-full"></div>
                <span className="text-xs text-slate-400 font-medium">
                  Admin Portal
                </span>
              </div>

              {/* Feature tags */}
              <div className="flex items-center space-x-2 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/20">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
                  Real-time
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/20">
                  <Activity className="w-3 h-3 mr-1" />
                  Analytics
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Status & User Actions */}
          <div className="flex items-center space-x-4">
            {/* System Status Indicators */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Performance Metric */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur-sm">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <div>
                  <p className="text-xs font-medium text-blue-300">Uptime</p>
                  <p className="text-xs text-slate-400">99.9%</p>
                </div>
              </div>

              {/* Active Connections */}
              <div className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 backdrop-blur-sm">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping opacity-40"></div>
                </div>
                <div>
                  <p className="text-xs font-medium text-green-300">Online</p>
                  <p className="text-xs text-slate-400">247 users</p>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="relative p-2 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                <Bell className="h-5 w-5 text-slate-400 hover:text-slate-300" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">3</span>
                </div>
              </button>
            </div>

            {/* User Profile Section */}
            <div className="flex items-center space-x-3 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm hover:border-slate-600/50 transition-all duration-300">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
                <User className="h-5 w-5 text-blue-400" />
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-white">
                  {currentUser?.email || "admin@shipwise.com"}
                </div>
                <div className="text-xs text-gray-400 flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  {userRole}
                </div>
              </div>
            </div>

            {/* Enhanced Hamburger Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="group relative inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-slate-700/50 to-slate-800/50 hover:from-blue-600/20 hover:to-purple-600/20 border border-slate-600/50 hover:border-blue-500/30 rounded-xl text-gray-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
              >
                <Menu className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {isMenuOpen && (
                <DropdownPortal>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                  ></div>

                  {/* Menu Content */}
                  <div className="fixed right-6 top-20 z-50 w-64 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 py-2 animate-in slide-in-from-top-2 duration-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-slate-900/20 rounded-xl"></div>

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-slate-700/50">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              Account Menu
                            </p>
                            <p className="text-xs text-slate-400">
                              ShipWise Admin
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button className="w-full flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group">
                          <UserCircle className="h-4 w-4 mr-3 group-hover:text-blue-400 transition-colors" />
                          Profile Settings
                        </button>
                        <button className="w-full flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-slate-700/50 transition-all duration-200 group">
                          <Settings className="h-4 w-4 mr-3 group-hover:text-blue-400 transition-colors" />
                          System Settings
                        </button>
                        <hr className="my-2 border-slate-700/50" />
                        <button className="w-full flex items-center px-4 py-3 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all duration-200 group">
                          <LogOut className="h-4 w-4 mr-3 group-hover:text-red-400 transition-colors" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </DropdownPortal>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom accent line with animation */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent">
        <div className="absolute inset-0 h-px bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-cyan-500/50 opacity-50 animate-pulse"></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute top-4 left-20 w-1 h-1 bg-blue-400/60 rounded-full animate-ping delay-700"></div>
      <div className="absolute bottom-6 right-32 w-1 h-1 bg-purple-400/60 rounded-full animate-ping delay-1000"></div>
      <div className="absolute top-8 right-64 w-0.5 h-0.5 bg-cyan-400/60 rounded-full animate-ping delay-300"></div>
    </header>
  );
}

export default ShipWiseHeader;
