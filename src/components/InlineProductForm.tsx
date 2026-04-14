import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import type { ProductCardData as Product } from "@/types/database";
import { toast } from "sonner";
import { ChevronLeft, ImagePlus, X, Upload } from "lucide-react";

interface InlineProductFormProps {
  product?: Product | null;
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

const InlineProductForm = ({ product, onSave, onCancel }: InlineProductFormProps) => {
  const { data: categories = [] } = useCategories();
  const [form, setForm] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    moq: "",
    unit: "pieces",
    image: "",
    description: "",
    // Bulk-specific fields
    bulkDiscount: "",
    maxOrderQty: "",
    leadTime: "",
    packagingType: "",
    weight: "",
    weightUnit: "kg",
    sku: "",
    material: "",
    origin: "Pakistan",
    certifications: "",
  });

  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        minPrice: String(product.minPrice),
        maxPrice: String(product.maxPrice),
        moq: String(product.moq),
        unit: product.unit,
        image: product.image,
        description: "",
        bulkDiscount: "",
        maxOrderQty: "",
        leadTime: "",
        packagingType: "",
        weight: "",
        weightUnit: "kg",
        sku: "",
        material: "",
        origin: "Pakistan",
        certifications: "",
      });
      if (product.image) setPhotos([product.image]);
    }
  }, [product]);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos: string[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newPhotos.push(url);
    });
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 8));
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const removed = prev[index];
      if (removed && removed.startsWith("blob:")) {
        URL.revokeObjectURL(removed);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      photos.forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, []);

  const handleSubmit = () => {
    if (!form.name || !form.category || !form.minPrice) {
      toast.error("Please fill in required fields (Name, Category, Min Price)");
      return;
    }
    onSave({
      name: form.name,
      category: form.category,
      minPrice: Number(form.minPrice),
      maxPrice: Number(form.maxPrice) || Number(form.minPrice),
      moq: Number(form.moq) || 1,
      unit: form.unit,
      image: photos[0] || form.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    });
    toast.success(product ? "Product updated!" : "Product added!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2 font-body" onClick={onCancel}>
          <ChevronLeft className="h-4 w-4" /> Back to Products
        </Button>
        <h2 className="font-display font-bold text-xl text-foreground">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-bold text-lg text-foreground mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <Label className="font-body text-sm font-semibold">Product Name *</Label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Premium Cotton T-Shirts - Bulk Order" className="mt-1" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="font-body text-sm font-semibold">Category *</Label>
                  <Select value={form.category} onValueChange={(v) => update("category", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-body text-sm font-semibold">SKU / Product Code</Label>
                  <Input value={form.sku} onChange={(e) => update("sku", e.target.value)} placeholder="e.g. CT-BLK-001" className="mt-1" />
                </div>
              </div>
              <div>
                <Label className="font-body text-sm font-semibold">Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Describe the product in detail — material, sizes available, colors, special features..."
                  className="mt-1 min-h-[120px]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="font-body text-sm font-semibold">Material / Composition</Label>
                  <Input value={form.material} onChange={(e) => update("material", e.target.value)} placeholder="e.g. 100% Cotton, 180 GSM" className="mt-1" />
                </div>
                <div>
                  <Label className="font-body text-sm font-semibold">Country of Origin</Label>
                  <Input value={form.origin} onChange={(e) => update("origin", e.target.value)} placeholder="Pakistan" className="mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Bulk */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-bold text-lg text-foreground mb-4">Pricing & Bulk Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <Label className="font-body text-sm font-semibold">Min Price (PKR) *</Label>
                  <Input type="number" value={form.minPrice} onChange={(e) => update("minPrice", e.target.value)} placeholder="180" className="mt-1" />
                </div>
                <div>
                  <Label className="font-body text-sm font-semibold">Max Price (PKR)</Label>
                  <Input type="number" value={form.maxPrice} onChange={(e) => update("maxPrice", e.target.value)} placeholder="350" className="mt-1" />
                </div>
                <div>
                  <Label className="font-body text-sm font-semibold">MOQ *</Label>
                  <Input type="number" value={form.moq} onChange={(e) => update("moq", e.target.value)} placeholder="500" className="mt-1" />
                </div>
                <div>
                  <Label className="font-body text-sm font-semibold">Unit</Label>
                  <Select value={form.unit} onValueChange={(v) => update("unit", v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["pieces", "kg", "tons", "meters", "bags", "suits", "dozen", "cartons", "liters"].map((u) => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="font-body text-sm font-semibold">Bulk Discount (%)</Label>
                  <Input type="number" value={form.bulkDiscount} onChange={(e) => update("bulkDiscount", e.target.value)} placeholder="e.g. 10% off 1000+" className="mt-1" />
                  <p className="text-[10px] text-muted-foreground mt-1">Discount for orders above MOQ</p>
                </div>
                <div>
                  <Label className="font-body text-sm font-semibold">Max Order Quantity</Label>
                  <Input type="number" value={form.maxOrderQty} onChange={(e) => update("maxOrderQty", e.target.value)} placeholder="e.g. 50000" className="mt-1" />
                </div>
                <div>
                  <Label className="font-body text-sm font-semibold">Lead Time (days)</Label>
                  <Input type="number" value={form.leadTime} onChange={(e) => update("leadTime", e.target.value)} placeholder="e.g. 7" className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="font-body text-sm font-semibold">Packaging Type</Label>
                  <Select value={form.packagingType} onValueChange={(v) => update("packagingType", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select packaging" /></SelectTrigger>
                    <SelectContent>
                      {["Polybag", "Carton Box", "Wooden Crate", "Pallet", "Bundle", "Sack", "Custom"].map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-body text-sm font-semibold">Weight per Unit</Label>
                  <Input type="number" value={form.weight} onChange={(e) => update("weight", e.target.value)} placeholder="e.g. 0.25" className="mt-1" />
                </div>
                <div>
                  <Label className="font-body text-sm font-semibold">Weight Unit</Label>
                  <Select value={form.weightUnit} onValueChange={(v) => update("weightUnit", v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["kg", "g", "lbs", "tons"].map((u) => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="font-body text-sm font-semibold">Certifications</Label>
                <Input value={form.certifications} onChange={(e) => update("certifications", e.target.value)} placeholder="e.g. ISO 9001, OEKO-TEX, FDA Approved" className="mt-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Photos & Actions */}
        <div className="space-y-6">
          {/* Photo Upload */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-bold text-lg text-foreground mb-4">Product Photos</h3>
            <p className="text-xs text-muted-foreground font-body mb-3">Upload up to 8 photos. First photo will be the main image.</p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {photos.map((photo, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                  <img src={photo} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Main
                    </span>
                  )}
                </div>
              ))}

              {photos.length < 8 && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors bg-accent/30">
                  <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-[10px] text-muted-foreground font-body">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>

            <div>
              <Label className="font-body text-sm font-semibold">Or paste image URL</Label>
              <Input
                value={form.image}
                onChange={(e) => update("image", e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
              {form.image && !photos.includes(form.image) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 font-body text-xs"
                  onClick={() => { if (form.image) setPhotos(prev => [...prev, form.image].slice(0, 8)); }}
                >
                  <ImagePlus className="h-3 w-3 mr-1" /> Add URL as photo
                </Button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-3">
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 font-display font-semibold gap-2"
            >
              {product ? "Save Changes" : "Add Product"}
            </Button>
            <Button variant="outline" className="w-full font-body" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineProductForm;
