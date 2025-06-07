import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, MapPin } from "lucide-react";

function BidCreationDialog({ onBidCreated }: { onBidCreated: () => void }) {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    materialType: "",
    quantity: "",
    pickupLocation: "",
    deliveryLocation: "",
    deadline: "",
    transporterRequirements: "",
  });

  const calculateSuggestedPrice = () => {
    if (
      formData.quantity &&
      formData.pickupLocation &&
      formData.deliveryLocation
    ) {
      // Mock calculation: ₹20 per km-ton
      const mockDistance = 500; // Mock distance
      const price = Number.parseInt(formData.quantity) * mockDistance * 20;
      return `₹${price.toLocaleString()}`;
    }
    return "₹0";
  };

  const handleSubmit = async () => {
    if (!token) {
      alert("Authentication token is missing");
      return;
    }

    if (
      !formData.materialType ||
      !formData.quantity ||
      !formData.pickupLocation ||
      !formData.deliveryLocation ||
      !formData.deadline
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:3000/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          materialType: formData.materialType,
          quantity: parseInt(formData.quantity),
          pickupLocation: formData.pickupLocation,
          deliveryLocation: formData.deliveryLocation,
          deadline: new Date(formData.deadline).toISOString(),
          transporterRequirements: formData.transporterRequirements || "",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Bid created successfully:", result);

      // Reset form
      setFormData({
        materialType: "",
        quantity: "",
        pickupLocation: "",
        deliveryLocation: "",
        deadline: "",
        transporterRequirements: "",
      });

      setIsOpen(false);
      onBidCreated(); // Refresh the bids list
    } catch (error) {
      console.error("Error creating bid:", error);
      alert("Failed to create bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create New Bid
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Bid</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new transportation bid.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="material">Material Type *</Label>
            <Select
              value={formData.materialType}
              onValueChange={(value) =>
                setFormData({ ...formData, materialType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="steel">Steel</SelectItem>
                <SelectItem value="cement">Cement</SelectItem>
                <SelectItem value="coal">Coal</SelectItem>
                <SelectItem value="sand">Sand</SelectItem>
                <SelectItem value="gravel">Gravel</SelectItem>
                <SelectItem value="wood">Wood</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity (tons) *</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup">Pickup Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="pickup"
                placeholder="123 Pickup St, City, Country"
                className="pl-10"
                value={formData.pickupLocation}
                onChange={(e) =>
                  setFormData({ ...formData, pickupLocation: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery">Delivery Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="delivery"
                placeholder="456 Delivery Ave, City, Country"
                className="pl-10"
                value={formData.deliveryLocation}
                onChange={(e) =>
                  setFormData({ ...formData, deliveryLocation: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline *</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Transporter Requirements</Label>
            <Textarea
              id="requirements"
              placeholder="Must have a valid license and insurance..."
              value={formData.transporterRequirements}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  transporterRequirements: e.target.value,
                })
              }
            />
          </div>

          <div className="rounded-lg bg-blue-50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                Suggested Price:
              </span>
              <span className="text-lg font-bold text-blue-600">
                {calculateSuggestedPrice()}
              </span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Based on distance and quantity
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Bid"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BidCreationDialog;
