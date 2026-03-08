import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { type RFQ } from "@/data/mockData";
import { toast } from "sonner";

interface SubmitBidFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfq: RFQ | null;
}

const SubmitBidForm = ({ open, onOpenChange, rfq }: SubmitBidFormProps) => {
  const [form, setForm] = useState({
    pricePerUnit: "", totalPrice: "", deliveryDays: "", notes: "",
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = () => {
    if (!form.pricePerUnit || !form.deliveryDays) {
      toast.error("Please fill price and delivery time");
      return;
    }
    toast.success(`Bid submitted for "${rfq?.title}"!`);
    onOpenChange(false);
    setForm({ pricePerUnit: "", totalPrice: "", deliveryDays: "", notes: "" });
  };

  if (!rfq) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl">Submit Bid</DialogTitle>
        </DialogHeader>
        <div className="bg-accent/50 rounded-lg p-4 mb-2">
          <h3 className="font-display font-semibold text-foreground text-sm">{rfq.title}</h3>
          <p className="text-xs text-muted-foreground font-body mt-1">
            Qty: {rfq.quantity.toLocaleString()} {rfq.unit} • Budget: {rfq.budget} • {rfq.deadline} left
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-sm">Price per {rfq.unit} (PKR) *</Label>
              <Input type="number" value={form.pricePerUnit} onChange={(e) => update("pricePerUnit", e.target.value)} placeholder="250" className="mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm">Total Price (PKR)</Label>
              <Input
                type="number"
                value={form.totalPrice || (form.pricePerUnit ? String(Number(form.pricePerUnit) * rfq.quantity) : "")}
                onChange={(e) => update("totalPrice", e.target.value)}
                placeholder="Auto-calculated"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label className="font-body text-sm">Delivery Time (days) *</Label>
            <Input type="number" value={form.deliveryDays} onChange={(e) => update("deliveryDays", e.target.value)} placeholder="14" className="mt-1" />
          </div>
          <div>
            <Label className="font-body text-sm">Notes & Offer Details</Label>
            <Textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Quality details, certifications, special offers..." className="mt-1" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="font-body">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-display font-semibold">Submit Bid</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitBidForm;
