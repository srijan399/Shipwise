import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, X } from "lucide-react";
import { useState } from "react";

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

export default BidDetailsPanel;
