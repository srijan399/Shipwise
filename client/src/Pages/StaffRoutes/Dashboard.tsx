"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Download,
  Eye,
  FileText,
  Filter,
  Home,
  Package,
  Search,
  TrendingUp,
  Truck,
  Upload,
  X,
  Loader2,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import BidCreationDialog from "./BidCreationDialog";

interface Bid {
  id: string;
  materialType: string;
  quantity: number;
  pickupLocation: string;
  deliveryLocation: string;
  deadline: string;
  status: string;
  offers: number;
  suggestedPrice?: string;
  distance?: number;
}

const mockOffers = [
  {
    id: 1,
    transporter: "Express Logistics",
    price: "₹17,500",
    rating: 4.5,
    eta: "2 days",
  },
  {
    id: 2,
    transporter: "Swift Transport",
    price: "₹18,200",
    rating: 4.2,
    eta: "3 days",
  },
  {
    id: 3,
    transporter: "Reliable Movers",
    price: "₹19,000",
    rating: 4.8,
    eta: "1 day",
  },
];

const sidebarItems = [
  { title: "Dashboard", icon: Home, url: "#" },
  { title: "Active Bids", icon: Package, url: "#" },
  { title: "Transporters", icon: Truck, url: "#" },
];

function AppSidebar() {
  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 p-4">
        <a href="/" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Shipwise</h2>
              <p className="text-xs text-slate-500">Shipping Platform</p>
            </div>
          </div>
        </a>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function BidDetailsPanel({
  bid,
  offers,
  onClose,
  token,
  onBidStatusChange,
}: {
  bid: any;
  offers: typeof mockOffers;
  onClose: () => void;
  token: string;
  onBidStatusChange: () => void;
}) {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!bid) return null;

  const handleAcceptOffer = async (
    offerId: number,
    transporterName: string
  ) => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/bids/${bid.id}/accept`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            offerId: offerId,
            transporterName: transporterName,
            status: "accepted",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error accepting offer, status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Offer accepted successfully:", data);

      // Refresh the bids list
      onBidStatusChange();

      // Show success message
      alert("Offer accepted successfully!");
    } catch (error) {
      console.error("Error accepting offer:", error);
      alert("Failed to accept offer. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseBid = async () => {
    const confirmed = confirm(
      "Are you sure you want to close this bid? This action cannot be undone."
    );
    if (!confirmed) return;

    setIsUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/bids/${bid.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "closed",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error closing bid, status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Bid closed successfully:", data);

      // Refresh the bids list
      onBidStatusChange();

      // Close the panel
      onClose();

      // Show success message
      alert("Bid closed successfully!");
    } catch (error) {
      console.error("Error closing bid:", error);
      alert("Failed to close bid. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNegotiate = async (offerId: number, transporterName: string) => {
    // For now, just show an alert - you can implement a negotiation modal later
    alert(`Negotiation feature coming soon for ${transporterName}`);
  };

  const canAcceptOffers = bid.status?.toLowerCase() === "open" || !bid.status;
  const canCloseBid = bid.status?.toLowerCase() !== "closed";

  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Bid Details</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isUpdating}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>{bid.id || bid._id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-slate-600">Material</p>
            <p className="text-slate-900">{bid.materialType || bid.material}</p>
          </div>
          <div>
            <p className="font-medium text-slate-600">Quantity</p>
            <p className="text-slate-900">{bid.quantity} tons</p>
          </div>
          <div>
            <p className="font-medium text-slate-600">Route</p>
            <p className="text-slate-900">
              {bid.pickupLocation || bid.pickup} →{" "}
              {bid.deliveryLocation || bid.delivery}
            </p>
          </div>
          <div>
            <p className="font-medium text-slate-600">Deadline</p>
            <p className="text-slate-900">
              {bid.deadline
                ? new Date(bid.deadline).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-600">Status</p>
            <Badge
              variant={
                bid.status?.toLowerCase() === "closed" ? "outline" : "default"
              }
            >
              {bid.status || "Open"}
            </Badge>
          </div>
          {canCloseBid && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCloseBid}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Closing...
                </>
              ) : (
                "Close Bid"
              )}
            </Button>
          )}
        </div>

        <Separator />

        <div>
          <h4 className="font-medium text-slate-900 mb-3">
            Transporter Offers ({offers.length})
          </h4>

          {!canAcceptOffers && (
            <div className="mb-3 p-2 bg-slate-100 rounded-lg">
              <p className="text-sm text-slate-600">
                This bid is {bid.status?.toLowerCase() || "closed"} and cannot
                accept new offers.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {offers.map((offer) => (
              <div key={offer.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-900">
                    {offer.transporter}
                  </p>
                  <Badge variant="outline">★ {offer.rating}</Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-green-600">
                    {offer.price}
                  </span>
                  <span className="text-sm text-slate-500">
                    ETA: {offer.eta}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() =>
                      handleAcceptOffer(offer.id, offer.transporter)
                    }
                    disabled={!canAcceptOffers || isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Accepting...
                      </>
                    ) : (
                      "Accept"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleNegotiate(offer.id, offer.transporter)}
                    disabled={!canAcceptOffers || isUpdating}
                  >
                    Negotiate
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {offers.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">No offers yet</p>
              <p className="text-xs mt-1">
                Transporters will submit offers soon
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function StaffDashboard() {
  const {
    token,
    loading: authLoading,
    userRole,
    logout,
    currentUser,
  } = useAuth();
  const [bids, setBids] = useState([]);
  const [selectedBid, setSelectedBid] = useState<Bid | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bool = userRole === "admin" || userRole === "management_staff";
    if (!authLoading && !bool) {
      console.warn("Unauthorized access attempt detected");
      window.location.href = "/";
    }
  }, [userRole, authLoading]);

  useEffect(() => {
    console.log(selectedBid);
  }, [selectedBid]);

  useEffect(() => {
    if (
      (userRole === "admin" || userRole === "staff") &&
      token &&
      !authLoading
    ) {
      fetchBids();
    }
  }, [userRole, token, authLoading]);

  const fetchBids = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/bids", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error getting bids, status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched bids:", data);

      const transformedBids = data.bids.map((bid: any, index: number) => ({
        ...bid,
        id: bid._id || bid.id || `BID-${String(index + 1).padStart(3, "0")}`,
        material: bid.materialType || bid.material,
        pickup: bid.pickupLocation || bid.pickup,
        delivery: bid.deliveryLocation || bid.delivery,
        // Mock values for missing properties
        status: bid.status || "Open",
        offers: bid.offers || Math.floor(Math.random() * 5) + 1,
        suggestedPrice:
          bid.suggestedPrice || `₹${(bid.quantity * 750).toLocaleString()}`,
        distance: bid.distance || Math.floor(Math.random() * 2000) + 100,
      }));

      setBids(transformedBids);
    } catch (error) {
      console.error("Error fetching bids:", error);
      setBids([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [token]);

  const filteredBids = bids.filter((bid: Bid) => {
    const material = bid.materialType || "";
    const pickup = bid.pickupLocation || "";
    const delivery = bid.deliveryLocation || "";

    const matchesSearch =
      material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (bid.status || "Open").toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "outline" | "destructive"
    > = {
      Open: "default",
      "In Progress": "secondary",
      Closed: "outline",
      Expired: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const handleDeleteBid = async (bidId: string) => {
    const confirmed = confirm("Are you sure you want to delete this bid?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:3000/api/bids/${bidId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error deleting bid, status: ${response.status}`);
      }

      console.log("Bid deleted successfully:", bidId);
      // Remove the deleted bid from the state
      setBids((prevBids) => prevBids.filter((bid: Bid) => bid.id !== bidId));
    } catch (error) {
      console.error("Error deleting bid:", error);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  Bidding Dashboard
                </h1>
                <p className="text-sm text-slate-500">
                  Manage your transportation bids
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userRole}
                      </p>
                      <Button
                        className="text-xs text-white hover:underline mt-2"
                        onClick={logout}
                      >
                        Logout
                      </Button>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="flex-1 space-y-6 p-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Active Bids
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{bids.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Real-time count
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Offers
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">
                    +5 from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Deals
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Avg Price/Ton
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹18.5K</div>
                  <p className="text-xs text-muted-foreground">
                    -2% from last week
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-6">
              {/* Main Content */}
              <div className="flex-1 space-y-6">
                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search bids..."
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-40">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                    <BidCreationDialog onBidCreated={fetchBids} />
                  </div>
                </div>

                {/* Active Bids Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Active Bids</CardTitle>
                    <CardDescription>
                      Manage your current transportation bids
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="ml-2">Loading bids...</span>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Material</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Route</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Offers</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBids.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={8}
                                className="text-center py-8"
                              >
                                No bids found. Create your first bid to get
                                started!
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredBids.map((bid: Bid, index: number) => (
                              <TableRow key={index}>
                                <TableCell>{bid.materialType}</TableCell>
                                <TableCell>{bid.quantity} tons</TableCell>
                                <TableCell>
                                  {bid.pickupLocation} → {bid.deliveryLocation}
                                </TableCell>
                                <TableCell>
                                  {bid.deadline
                                    ? new Date(
                                        bid.deadline
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(bid.status || "Open")}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">
                                    {bid.offers}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setSelectedBid(bid)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteBid(bid.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                {/* Manual Deal Entry */}
                <Card>
                  <CardHeader>
                    <CardTitle>Manual Deal Entry</CardTitle>
                    <CardDescription>
                      Add offline deals or upload CSV data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="form" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="form">Quick Entry</TabsTrigger>
                        <TabsTrigger value="upload">CSV Upload</TabsTrigger>
                      </TabsList>
                      <TabsContent value="form" className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <Input placeholder="Material" />
                          <Input placeholder="Quantity (tons)" type="number" />
                          <Input placeholder="Price (₹)" type="number" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input placeholder="Pickup Location" />
                          <Input placeholder="Delivery Location" />
                        </div>
                        <Button className="w-full">Add Manual Deal</Button>
                      </TabsContent>
                      <TabsContent value="upload" className="space-y-4">
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                          <Upload className="mx-auto h-12 w-12 text-slate-400" />
                          <p className="mt-2 text-sm text-slate-600">
                            Drag and drop your CSV file here, or click to browse
                          </p>
                          <Button variant="outline" className="mt-4">
                            Choose File
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
              {selectedBid && (
                <BidDetailsPanel
                  bid={selectedBid}
                  offers={mockOffers}
                  onClose={() => setSelectedBid(undefined)}
                  token={token}
                  onBidStatusChange={fetchBids}
                />
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
