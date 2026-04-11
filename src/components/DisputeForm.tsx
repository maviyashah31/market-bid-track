import { useState } from "react";
import { buyerOrders, disputeReasons, DisputeReason } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface DisputeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (dispute: {
    orderId: string;
    reason: DisputeReason;
    description: string;
  }) => void;
}

const DisputeForm = ({ open, onOpenChange, onSubmit }: DisputeFormProps) => {
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedReason, setSelectedReason] = useState<DisputeReason | "">("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Filter orders that can have disputes (not completed yet)
  const eligibleOrders = buyerOrders.filter(
    (order) => order.status !== "completed"
  );

  const handleSubmit = async () => {
    if (!selectedOrder || !selectedReason || !description.trim()) {
      toast.error("Missing Information", { description: "Please fill in all required fields." });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    onSubmit({
      orderId: selectedOrder,
      reason: selectedReason as DisputeReason,
      description: description.trim(),
    });

    toast.success("Dispute Raised Successfully", { description: "The seller has been notified and will respond within 24 hours." });

    // Reset form
    setSelectedOrder("");
    setSelectedReason("");
    setDescription("");
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const selectedReasonDetails = disputeReasons.find(
    (r) => r.value === selectedReason
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Raise a Dispute
          </DialogTitle>
          <DialogDescription className="font-body">
            Select an order and describe your issue. The seller will be notified
            to negotiate a resolution.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Order Selection */}
          <div className="space-y-2">
            <Label htmlFor="order" className="font-display">
              Select Order *
            </Label>
            <Select value={selectedOrder} onValueChange={setSelectedOrder}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an order" />
              </SelectTrigger>
              <SelectContent>
                {eligibleOrders.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    <div className="flex flex-col">
                      <span className="font-semibold">{order.id}</span>
                      <span className="text-xs text-muted-foreground">
                        {order.productName} • {order.sellerName}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reason Selection */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="font-display">
              Dispute Reason *
            </Label>
            <Select
              value={selectedReason}
              onValueChange={(val) => setSelectedReason(val as DisputeReason)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {disputeReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedReasonDetails && (
              <p className="text-xs text-muted-foreground font-body">
                {selectedReasonDetails.description}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-display">
              Describe the Issue *
            </Label>
            <Textarea
              id="description"
              placeholder="Provide details about the issue you're facing..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="font-body"
            />
            <p className="text-xs text-muted-foreground font-body">
              Be specific about the problem. Include quantities, dates, or other
              relevant details.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="font-body"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body gap-2"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Submit Dispute
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeForm;
