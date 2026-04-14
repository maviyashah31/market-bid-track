import { useState } from "react";
import { useBuyerOrders } from "@/hooks/useOrders";
import { useCreateDispute } from "@/hooks/useDisputes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const disputeReasons = [
  { value: "wrong_item", label: "Wrong Item Received" },
  { value: "damaged", label: "Item Damaged" },
  { value: "not_delivered", label: "Item Not Delivered" },
  { value: "quality", label: "Quality Not as Described" },
  { value: "quantity", label: "Wrong Quantity" },
  { value: "late_delivery", label: "Late Delivery" },
  { value: "other", label: "Other" },
];

interface DisputeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (dispute: { orderId: string; reason: string; description: string }) => void;
}

const DisputeForm = ({ open, onOpenChange, onSubmit }: DisputeFormProps) => {
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const { data: buyerOrders = [] } = useBuyerOrders();
  const createDispute = useCreateDispute();

  const eligibleOrders = buyerOrders.filter(o => o.status !== "completed" && o.status !== "cancelled");

  const handleSubmit = async () => {
    if (!selectedOrder || !selectedReason || !description.trim()) {
      toast.error("Missing Information", { description: "Please fill in all required fields." });
      return;
    }

    const order = buyerOrders.find(o => o.id === selectedOrder);
    if (!order) return;

    createDispute.mutate({
      order_id: selectedOrder,
      seller_id: order.seller_id,
      reason: selectedReason,
      description: description.trim(),
    }, {
      onSuccess: () => {
        toast.success("Dispute Raised Successfully", { description: "The seller has been notified." });
        onSubmit?.({ orderId: selectedOrder, reason: selectedReason, description: description.trim() });
        setSelectedOrder("");
        setSelectedReason("");
        setDescription("");
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <AlertTriangle className="h-5 w-5 text-warning" /> Raise a Dispute
          </DialogTitle>
          <DialogDescription className="font-body">
            Select an order and describe your issue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="font-display">Select Order *</Label>
            <Select value={selectedOrder} onValueChange={setSelectedOrder}>
              <SelectTrigger><SelectValue placeholder="Choose an order" /></SelectTrigger>
              <SelectContent>
                {eligibleOrders.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    <span className="font-semibold">{order.order_number}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {order.order_items?.map(i => i.product_name_snapshot).join(", ")}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-display">Dispute Reason *</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
              <SelectContent>
                {disputeReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>{reason.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-display">Describe the Issue *</Label>
            <Textarea
              placeholder="Provide details about the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="font-body"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="font-body">Cancel</Button>
          <Button onClick={handleSubmit} disabled={createDispute.isPending} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body gap-2">
            {createDispute.isPending ? "Submitting..." : <><CheckCircle className="h-4 w-4" /> Submit Dispute</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeForm;
