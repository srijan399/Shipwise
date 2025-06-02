// import ShipwiseLanding from "@/components/shipwise-landing";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Truck,
  BarChart3,
  Users,
  ClipboardList,
  FileText,
  History,
  Brain,
  Map,
  Shield,
  Play,
  ChevronRight,
  Menu,
  X,
  Github,
  Mail,
  FileCode2,
  Database,
  Flame,
  Server,
} from "lucide-react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 left-1/3 w-40 h-40 bg-blue-300/10 rounded-full blur-3xl"></div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(90deg, #60a5fa 1px, transparent 1px),
              linear-gradient(180deg, #60a5fa 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-[#0f172a]/80 border-b border-blue-500/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <Truck className="h-8 w-8 text-blue-400" />
                  <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                    Shipwise
                  </span>
                </div>
              </div>
              <nav className="hidden md:ml-10 md:flex md:items-center md:space-x-6">
                <a
                  href="#features"
                  className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#tech-stack"
                  className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Tech Stack
                </a>
                <a
                  href="#demo"
                  className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Demo
                </a>
                <a
                  href="#login"
                  className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
                >
                  Login
                </a>
              </nav>
            </div>
            <div className="hidden md:flex">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all">
                Get Started
              </Button>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-blue-800/20 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0f172a]/95 backdrop-blur-lg border-b border-blue-500/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-800/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-800/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#tech-stack"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-800/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tech Stack
              </a>
              <a
                href="#demo"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-800/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                Demo
              </a>
              <a
                href="#login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-800/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </a>
              <div className="pt-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-100 bg-clip-text text-transparent">
                  Smarter Freight. Simplified.
                </h1>
                <p className="text-xl sm:text-2xl text-blue-100/80 max-w-xl">
                  Bids. Transporters. Deals. All in one internal platform.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all"
                >
                  Get Started <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-400/30 text-blue-200 hover:bg-blue-900/20 hover:border-blue-400/50"
                >
                  <Play className="mr-2 h-4 w-4" /> Watch Demo
                </Button>
              </div>
            </div>

            {/* Dashboard Illustration */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
              <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-1">
                  <div className="bg-[#0f172a]/80 p-4 rounded-xl">
                    <div className="flex items-center mb-4">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="ml-4 text-xs text-blue-200/70">
                        Shipwise Dashboard
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {/* New Bid Form */}
                      <div className="col-span-2 bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
                        <h3 className="text-sm font-medium text-blue-200 mb-3 flex items-center">
                          <FileText className="h-4 w-4 mr-2" /> New Bid
                        </h3>
                        <div className="space-y-2">
                          <div className="h-2 bg-blue-800/50 rounded w-3/4"></div>
                          <div className="h-2 bg-blue-800/50 rounded w-1/2"></div>
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            <div className="h-6 bg-blue-800/30 rounded"></div>
                            <div className="h-6 bg-blue-800/30 rounded"></div>
                          </div>
                          <div className="h-6 bg-blue-600/40 rounded mt-2"></div>
                        </div>
                      </div>

                      {/* Transporter Card */}
                      <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
                        <h3 className="text-sm font-medium text-blue-200 mb-3 flex items-center">
                          <Truck className="h-4 w-4 mr-2" /> Transporter
                        </h3>
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 rounded-full bg-blue-700/50"></div>
                          <div className="ml-2 h-2 bg-blue-800/50 rounded w-3/4"></div>
                        </div>
                        <div className="h-2 bg-blue-800/50 rounded w-1/2 mb-2"></div>
                        <div className="h-2 bg-blue-800/50 rounded w-5/6"></div>
                      </div>

                      {/* Map with pins */}
                      <div className="col-span-3 bg-blue-900/20 p-4 rounded-lg border border-blue-500/20 h-32 relative">
                        <h3 className="text-sm font-medium text-blue-200 mb-3 flex items-center">
                          <Map className="h-4 w-4 mr-2" /> Route Map
                        </h3>
                        <div className="absolute inset-0 m-4 mt-8 rounded overflow-hidden">
                          <div className="h-full w-full bg-blue-950/50 rounded">
                            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-red-500 rounded-full"></div>
                            <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div
                              className="absolute h-px bg-blue-400/30 w-1/3"
                              style={{
                                top: "25%",
                                left: "25%",
                                transform: "rotate(45deg)",
                                transformOrigin: "top left",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
              Powerful Features for Logistics Management
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto">
              Everything you need to streamline your freight bidding and
              transporter management in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <Card className="bg-white/5 border-blue-500/20 backdrop-blur-sm hover:bg-white/10 transition-all hover:shadow-lg hover:shadow-blue-500/10 group">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                  <Brain className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-blue-100">
                  Smart Price Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100/70">
                  Auto-calculated base rates using historical data and market
                  trends for accurate bidding.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-white/5 border-blue-500/20 backdrop-blur-sm hover:bg-white/10 transition-all hover:shadow-lg hover:shadow-blue-500/10 group">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                  <ClipboardList className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-blue-100">Bid Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100/70">
                  Create, accept, or close freight bids easily with a
                  streamlined workflow and notifications.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-white/5 border-blue-500/20 backdrop-blur-sm hover:bg-white/10 transition-all hover:shadow-lg hover:shadow-blue-500/10 group">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-blue-100">
                  Manual Deal Logging
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100/70">
                  Upload offline deals in seconds with our intuitive form and
                  automatic data validation.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-white/5 border-blue-500/20 backdrop-blur-sm hover:bg-white/10 transition-all hover:shadow-lg hover:shadow-blue-500/10 group">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                  <Truck className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-blue-100">
                  Transporter Directory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-100/70">
                  Track capacity, vehicle types, and deal history for all your
                  transporters in one place.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section
        id="how-it-works"
        className="py-16 sm:py-24 bg-gradient-to-b from-[#1e3a8a]/50 to-[#0f172a]/50 relative"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
              Role-Based Access
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto">
              Tailored experiences for different team members with appropriate
              permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Admin Role */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:shadow-lg hover:shadow-blue-500/10">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <Shield className="h-7 w-7 text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-blue-100">Admins</h3>
                  <p className="text-blue-200/70">Complete platform control</p>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center text-blue-100/80">
                  <Users className="h-5 w-5 mr-3 text-blue-400" />
                  <span>Manage users and permissions</span>
                </li>
                <li className="flex items-center text-blue-100/80">
                  <BarChart3 className="h-5 w-5 mr-3 text-blue-400" />
                  <span>Access comprehensive analytics</span>
                </li>
                <li className="flex items-center text-blue-100/80">
                  <Database className="h-5 w-5 mr-3 text-blue-400" />
                  <span>Configure system settings</span>
                </li>
                <li className="flex items-center text-blue-100/80">
                  <History className="h-5 w-5 mr-3 text-blue-400" />
                  <span>View complete audit logs</span>
                </li>
              </ul>
            </div>

            {/* Staff Role */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:shadow-lg hover:shadow-blue-500/10">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <Users className="h-7 w-7 text-blue-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-blue-100">
                    Management Staff
                  </h3>
                  <p className="text-blue-200/70">Day-to-day operations</p>
                </div>
              </div>

              <ul className="space-y-3">
                <li className="flex items-center text-blue-100/80">
                  <ClipboardList className="h-5 w-5 mr-3 text-blue-400" />
                  <span>Post and accept bids</span>
                </li>
                <li className="flex items-center text-blue-100/80">
                  <FileText className="h-5 w-5 mr-3 text-blue-400" />
                  <span>Log deals and transactions</span>
                </li>
                <li className="flex items-center text-blue-100/80">
                  <Truck className="h-5 w-5 mr-3 text-blue-400" />
                  <span>View transporter history</span>
                </li>
                <li className="flex items-center text-blue-100/80">
                  <Map className="h-5 w-5 mr-3 text-blue-400" />
                  <span>Track active shipments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
              Built with Modern Tech
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto">
              Enterprise-grade technology stack for reliability, security, and
              performance.
            </p>
          </div>

          <div className="max-w-4xl mx-auto backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
            {/* Code-like background */}
            <div className="absolute inset-0 opacity-5">
              <pre className="text-xs text-blue-400 p-8">
                {`import { createBid } from '@/lib/api';
import { useState } from 'react';

export default function BidForm() {
  const [loading, setLoading] = useState(false);
  
  async function handleSubmit(data) {
    setLoading(true);
    try {
      await createBid(data);
      toast.success('Bid created successfully');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}`}
              </pre>
            </div>

            <div className="relative z-10">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
                {/* React */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-3">
                    <div className="text-blue-400 text-2xl">⚛️</div>
                  </div>
                  <span className="text-blue-100 text-sm font-medium">
                    React
                  </span>
                </div>

                {/* Node.js */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-3">
                    <Server className="h-8 w-8 text-blue-400" />
                  </div>
                  <span className="text-blue-100 text-sm font-medium">
                    Node.js
                  </span>
                </div>

                {/* Express */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-3">
                    <FileCode2 className="h-8 w-8 text-blue-400" />
                  </div>
                  <span className="text-blue-100 text-sm font-medium">
                    Express
                  </span>
                </div>

                {/* PostgreSQL */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-3">
                    <Database className="h-8 w-8 text-blue-400" />
                  </div>
                  <span className="text-blue-100 text-sm font-medium">
                    PostgreSQL
                  </span>
                </div>

                {/* Firebase */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-3">
                    <Flame className="h-8 w-8 text-blue-400" />
                  </div>
                  <span className="text-blue-100 text-sm font-medium">
                    Firebase
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo CTA Section */}
      <section
        id="demo"
        className="py-16 sm:py-24 bg-gradient-to-b from-[#1e3a8a]/50 to-[#0f172a]/50 relative"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
              See Shipwise in Action
            </h2>
            <p className="text-blue-100/70 max-w-2xl mx-auto mb-8">
              Watch our 3-minute demo to see how Shipwise can transform your
              logistics operations.
            </p>

            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-2 mb-8 aspect-video max-w-3xl mx-auto relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-900/50 flex items-center justify-center group-hover:bg-blue-900/30 transition-colors">
                <div className="w-20 h-20 rounded-full bg-blue-600/80 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Play className="h-10 w-10 text-white ml-1" />
                </div>
              </div>
              <div className="w-full h-full bg-gradient-to-br from-blue-900/50 to-blue-800/50"></div>
            </div>

            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all"
            >
              <Play className="mr-2 h-5 w-5" /> Watch 3-min Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Contact/Early Access CTA */}
      <section id="login" className="py-16 sm:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
                Ready to streamline your logistics?
              </h2>
              <p className="text-blue-100/70 mb-8">
                Get started with Shipwise today. No public signups – access by
                request.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-blue-50 placeholder:text-blue-200/40"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
                  Request Access
                </Button>
              </div>

              <p className="text-blue-200/60 text-sm">
                We'll get back to you within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-blue-500/20 bg-[#0f172a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Truck className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-lg font-bold text-blue-100">
                Shipwise
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-blue-300/70">
              <a href="#" className="hover:text-blue-300 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-blue-300 transition-colors">
                Terms
              </a>
              <a
                href="#"
                className="hover:text-blue-300 transition-colors flex items-center"
              >
                <Github className="h-4 w-4 mr-1" /> GitHub Repo
              </a>
              <a
                href="#"
                className="hover:text-blue-300 transition-colors flex items-center"
              >
                <Mail className="h-4 w-4 mr-1" /> Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
