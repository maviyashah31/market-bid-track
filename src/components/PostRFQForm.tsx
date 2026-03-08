import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/data/mockData";
import { toast } from "sonner";

interface PostRFQFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PostRFQForm = ({ open, onOpenChange }: PostRFQFormProps) => {
  const [form, setForm] = useState({
    title: "", category: "", quantity: "", unit: "pcs",
    budgetMin: "", budgetMax: "", deadline: "", description: "",
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = () => {
    if (!form.title || !form.category || !form.quantity) {
      toast.error("Please fill in required fields");
      return;
    }
    toast.success("RFQ posted successfully! Sellers will start bidding soon.");
    onOpenChange(false);
    setForm({ title: "", category: "", quantity: "", unit: "pcs", budgetMin: "", budgetMax: "", deadline: "", description: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl">Post New RFQ</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="font-body text-sm">Title *</Label>
            <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Need 10,000 Cotton Polo Shirts" className="mt-1" />
          </div>
          <div>
            <Label className="font-body text-sm">Category *</Label>
            <Select value={form.category} onValueChange={(v) => update("category", v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-sm">Quantity *</Label>
              <Input type="number" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} placeholder="10000" className="mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm">Unit</Label>
              <Select value={form.unit} onValueChange={(v) => update("unit", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["pcs", "kg", "tons", "meters", "bags", "sets"].map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-sm">Budget Min (PKR)</Label>
              <Input type="number" value={form.budgetMin} onChange={(e) => update("budgetMin", e.target.value)} placeholder="2500000" className="mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm">Budget Max (PKR)</Label>
              <Input type="number" value={form.budgetMax} onChange={(e) => update("budgetMax", e.target.value)} placeholder="3500000" className="mt-1" />
            </div>
          </div>
          <div>
            <Label className="font-body text-sm">Deadline (days)</Label>
            <Input type="number" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} placeholder="15" className="mt-1" />
          </div>
          <div>
            <Label className="font-body text-sm">Description & Requirements</Label>
            <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Detailed specifications, quality requirements, certifications needed..." className="mt-1" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="font-body">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-display font-semibold">Post RFQ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostRFQForm;
