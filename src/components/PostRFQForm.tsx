import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/mockData";
import { toast } from "sonner";
import { ImagePlus, X, Plus } from "lucide-react";

interface PostRFQFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PostRFQForm = ({ open, onOpenChange }: PostRFQFormProps) => {
  const [form, setForm] = useState({
    title: "", category: "", quantity: "", unit: "pcs",
    budgetMin: "", budgetMax: "", deadline: "", description: "",
    shippingTerms: "", paymentTerms: "", certifications: "",
  });
  const [images, setImages] = useState<{ url: string; caption: string }[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [specs, setSpecs] = useState<string[]>([""]);
  const [step, setStep] = useState(1);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const addImage = () => {
    if (!imageUrl.trim()) return;
    setImages((prev) => [...prev, { url: imageUrl, caption: imageCaption }]);
    setImageUrl("");
    setImageCaption("");
  };

  const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const updateSpec = (idx: number, val: string) => {
    setSpecs((prev) => prev.map((s, i) => (i === idx ? val : s)));
  };
  const addSpec = () => setSpecs((prev) => [...prev, ""]);
  const removeSpec = (idx: number) => setSpecs((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!form.title || !form.category || !form.quantity) {
      toast.error("Please fill in required fields (Title, Category, Quantity)");
      return;
    }
    if (!form.description) {
      toast.error("Please provide a description of your requirements");
      return;
    }
    toast.success("RFQ posted successfully! Sellers will start bidding soon.");
    onOpenChange(false);
    setForm({ title: "", category: "", quantity: "", unit: "pcs", budgetMin: "", budgetMax: "", deadline: "", description: "", shippingTerms: "", paymentTerms: "", certifications: "" });
    setImages([]);
    setSpecs([""]);
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl">Post New RFQ</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-bold ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{s}</div>
                <span className={`text-xs font-body ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                  {s === 1 ? "Basic Info" : s === 2 ? "Details & Specs" : "Images & Terms"}
                </span>
                {s < 3 && <div className={`w-8 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
        </DialogHeader>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="font-body text-sm font-medium">Title *</Label>
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Need 10,000 Cotton Polo Shirts" className="mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm font-medium">Category *</Label>
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.icon} {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-sm font-medium">Quantity *</Label>
                <Input type="number" value={form.quantity} onChange={(e) => update("quantity", e.target.value)} placeholder="10000" className="mt-1" />
              </div>
              <div>
                <Label className="font-body text-sm font-medium">Unit</Label>
                <Select value={form.unit} onValueChange={(v) => update("unit", v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["pcs", "kg", "tons", "meters", "bags", "sets", "liters", "cartons"].map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-sm font-medium">Budget Min (PKR)</Label>
                <Input type="number" value={form.budgetMin} onChange={(e) => update("budgetMin", e.target.value)} placeholder="2500000" className="mt-1" />
              </div>
              <div>
                <Label className="font-body text-sm font-medium">Budget Max (PKR)</Label>
                <Input type="number" value={form.budgetMax} onChange={(e) => update("budgetMax", e.target.value)} placeholder="3500000" className="mt-1" />
              </div>
            </div>
            <div>
              <Label className="font-body text-sm font-medium">Deadline (days)</Label>
              <Input type="number" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} placeholder="15" className="mt-1" />
            </div>
          </div>
        )}

        {/* Step 2: Description & Specifications */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label className="font-body text-sm font-medium">Detailed Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe exactly what you need: material quality, colors, sizes, finish, packaging requirements, quality standards..."
                className="mt-1 min-h-[120px]"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="font-body text-sm font-medium">Specifications</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSpec} className="gap-1 font-body text-xs">
                  <Plus className="h-3 w-3" /> Add Spec
                </Button>
              </div>
              <div className="space-y-2">
                {specs.map((spec, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={spec}
                      onChange={(e) => updateSpec(idx, e.target.value)}
                      placeholder={`e.g. 100% combed cotton, 220 GSM`}
                    />
                    {specs.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeSpec(idx)} className="text-destructive px-2">
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="font-body text-sm font-medium">Required Certifications</Label>
              <Input
                value={form.certifications}
                onChange={(e) => update("certifications", e.target.value)}
                placeholder="e.g. OEKO-TEX, ISO 9001, HACCP (comma separated)"
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Step 3: Images & Terms */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label className="font-body text-sm font-medium">Reference Images</Label>
              <p className="text-xs text-muted-foreground font-body mb-2">Add image URLs to show sellers exactly what you're looking for</p>
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Image URL (https://...)"
                  className="flex-1"
                />
                <Input
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Caption (optional)"
                  className="w-40"
                />
                <Button type="button" variant="outline" size="sm" onClick={addImage} className="gap-1 shrink-0">
                  <ImagePlus className="h-4 w-4" />
                </Button>
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-border">
                      <img src={img.url} alt={img.caption || "RFQ image"} className="w-full h-24 object-cover" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {img.caption && (
                        <p className="text-[10px] text-muted-foreground font-body p-1 truncate">{img.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label className="font-body text-sm font-medium">Shipping Terms</Label>
              <Select value={form.shippingTerms} onValueChange={(v) => update("shippingTerms", v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select shipping terms" /></SelectTrigger>
                <SelectContent>
                  {["FOB (Free on Board)", "CIF (Cost, Insurance, Freight)", "DDP (Delivered Duty Paid)", "EXW (Ex Works)", "CFR (Cost and Freight)"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body text-sm font-medium">Payment Terms</Label>
              <Select value={form.paymentTerms} onValueChange={(v) => update("paymentTerms", v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select payment terms" /></SelectTrigger>
                <SelectContent>
                  {[
                    "50% Advance + 50% Before Dispatch",
                    "Letter of Credit (L/C) at Sight",
                    "100% Advance",
                    "30/70 Split (30% Advance, 70% on Delivery)",
                    "Net 30 Days",
                    "Escrow Payment",
                  ].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="font-body">Back</Button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <Button onClick={() => {
              if (step === 1 && (!form.title || !form.category || !form.quantity)) {
                toast.error("Please fill required fields before proceeding");
                return;
              }
              setStep(step + 1);
            }} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-display font-semibold">
              Next Step
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="font-body">Cancel</Button>
              <Button onClick={handleSubmit} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-display font-semibold">Post RFQ</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostRFQForm;
