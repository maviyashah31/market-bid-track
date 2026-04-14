import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubmitBid, type RFQ } from "@/hooks/useRFQs";
import { toast } from "sonner";
import { MapPin } from "lucide-react";

interface SubmitBidFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfq: RFQ | null;
}

const SubmitBidForm = ({ open, onOpenChange, rfq }: SubmitBidFormProps) => {
  const submitBid = useSubmitBid();
  const [form, setForm] = useState({
    pricePerUnit: "", totalPrice: "", deliveryDays: "", notes: "",
    moq: "", sampleAvailable: "yes", sampleCost: "", warranty: "",
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const calculatedTotal = form.pricePerUnit && rfq ? String(Number(form.pricePerUnit) * rfq.quantity) : "";

  const handleSubmit = () => {
    if (!form.pricePerUnit || !form.deliveryDays) {
      toast.error("Please fill price per unit and delivery time");
      return;
    }
    if (!rfq) return;
    const total = form.totalPrice ? Number(form.totalPrice) : Number(form.pricePerUnit) * rfq.quantity;
    submitBid.mutate({
      rfq_id: rfq.id,
      price_per_unit: Number(form.pricePerUnit),
      total_price: total,
      delivery_days: Number(form.deliveryDays),
      notes: form.notes || undefined,
    }, {
      onSuccess: () => {
        toast.success(`Bid submitted for "${rfq.title}"! The buyer will review your offer.`);
        onOpenChange(false);
        setForm({ pricePerUnit: "", totalPrice: "", deliveryDays: "", notes: "", moq: "", sampleAvailable: "yes", sampleCost: "", warranty: "" });
      },
    });
  };

  if (!rfq) return null;

  const budgetMin = rfq.budget_min || 0;
  const budgetMax = rfq.budget_max || 0;
  const budgetStr = budgetMin || budgetMax
    ? `PKR ${(budgetMin / 1000000).toFixed(1)}M - ${(budgetMax / 1000000).toFixed(1)}M`
    : "Not specified";
  const priceInBudget = form.pricePerUnit && budgetMin && budgetMax
    ? Number(form.pricePerUnit) * rfq.quantity >= budgetMin && Number(form.pricePerUnit) * rfq.quantity <= budgetMax
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl">Submit Your Bid</DialogTitle>
        </DialogHeader>

        {/* RFQ Summary */}
        <div className="bg-accent/50 rounded-lg p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="secondary" className="font-body mb-1">{rfq.category?.name || "General"}</Badge>
              <h3 className="font-display font-semibold text-foreground">{rfq.title}</h3>
              <p className="text-xs text-muted-foreground font-body flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" /> {rfq.buyer?.full_name || "Buyer"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-body">Quantity</p>
              <p className="font-display font-bold text-sm">{rfq.quantity.toLocaleString()} {rfq.unit}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-body">Budget</p>
              <p className="font-display font-bold text-sm">{budgetStr}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-body">Deadline</p>
              <p className="font-display font-bold text-sm">{rfq.deadline ? new Date(rfq.deadline).toLocaleDateString("en-PK") : "Open"}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Bid Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-sm font-medium">Price per {rfq.unit} (PKR) *</Label>
              <Input type="number" value={form.pricePerUnit} onChange={(e) => update("pricePerUnit", e.target.value)} placeholder="250" className="mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm font-medium">Total Price (PKR)</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={form.totalPrice || calculatedTotal}
                  onChange={(e) => update("totalPrice", e.target.value)}
                  placeholder="Auto-calculated"
                  className="mt-1"
                  readOnly={!form.totalPrice}
                />
                {priceInBudget !== null && (
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-xs font-body ${priceInBudget ? "text-success" : "text-warning"}`}>
                    {priceInBudget ? "In budget" : "Out of budget"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-sm font-medium">Delivery Time (days) *</Label>
              <Input type="number" value={form.deliveryDays} onChange={(e) => update("deliveryDays", e.target.value)} placeholder="14" className="mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm font-medium">Minimum Order Quantity</Label>
              <Input type="number" value={form.moq} onChange={(e) => update("moq", e.target.value)} placeholder={String(rfq.quantity)} className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-sm font-medium">Sample Available?</Label>
              <Select value={form.sampleAvailable} onValueChange={(v) => update("sampleAvailable", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes - Free Sample</SelectItem>
                  <SelectItem value="paid">Yes - Paid Sample</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.sampleAvailable === "paid" && (
              <div>
                <Label className="font-body text-sm font-medium">Sample Cost (PKR)</Label>
                <Input type="number" value={form.sampleCost} onChange={(e) => update("sampleCost", e.target.value)} placeholder="500" className="mt-1" />
              </div>
            )}
          </div>

          <div>
            <Label className="font-body text-sm font-medium">Warranty / Guarantee</Label>
            <Input value={form.warranty} onChange={(e) => update("warranty", e.target.value)} placeholder="e.g. 6 months quality guarantee, full replacement for defects" className="mt-1" />
          </div>

          <div>
            <Label className="font-body text-sm font-medium">Detailed Offer & Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Highlight your strengths: quality certifications, past experience with similar orders, special offers, production capacity..."
              className="mt-1 min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="font-body">Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitBid.isPending} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-display font-semibold">
            {submitBid.isPending ? "Submitting..." : "Submit Bid"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitBidForm;
