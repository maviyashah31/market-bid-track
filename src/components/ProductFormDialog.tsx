import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import type { ProductCardData as Product } from "@/types/database";
import { toast } from "sonner";

interface ProductSaveData extends Partial<Product> {
  category_id?: string | null;
}

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSave: (product: ProductSaveData) => void;
}

const ProductFormDialog = ({ open, onOpenChange, product, onSave }: ProductFormDialogProps) => {
  const { data: categories = [] } = useCategories();
  const [form, setForm] = useState({
    name: "", categoryId: "", minPrice: "", maxPrice: "",
    moq: "", unit: "pieces", image: "", description: "",
  });

  useEffect(() => {
    if (product) {
      const selectedCategory = categories.find((c) => c.name === product.category)?.id || "";
      setForm({
        name: product.name,
        categoryId: selectedCategory,
        minPrice: String(product.minPrice), maxPrice: String(product.maxPrice),
        moq: String(product.moq), unit: product.unit, image: product.image, description: "",
      });
    } else {
      setForm({ name: "", categoryId: "", minPrice: "", maxPrice: "", moq: "", unit: "pieces", image: "", description: "" });
    }
  }, [product, open, categories]);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = () => {
    if (!form.name || !form.categoryId || !form.minPrice) {
      toast.error("Please fill in required fields");
      return;
    }
    const selectedCategory = categories.find((c) => c.id === form.categoryId)?.name || "";
    onSave({
      name: form.name,
      category_id: form.categoryId,
      category: selectedCategory,
      minPrice: Number(form.minPrice), maxPrice: Number(form.maxPrice),
      moq: Number(form.moq), unit: form.unit, image: form.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    });
    toast.success(product ? "Product updated!" : "Product added!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl">{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div>
            <Label className="font-body text-sm">Product Name *</Label>
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Premium Cotton T-Shirts" className="mt-1" />
          </div>
          <div>
            <Label className="font-body text-sm">Category *</Label>
            <Select value={form.categoryId} onValueChange={(v) => update("categoryId", v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-sm">Min Price (PKR) *</Label>
              <Input type="number" value={form.minPrice} onChange={(e) => update("minPrice", e.target.value)} placeholder="180" className="mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm">Max Price (PKR)</Label>
              <Input type="number" value={form.maxPrice} onChange={(e) => update("maxPrice", e.target.value)} placeholder="350" className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-sm">MOQ</Label>
              <Input type="number" value={form.moq} onChange={(e) => update("moq", e.target.value)} placeholder="500" className="mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm">Unit</Label>
              <Select value={form.unit} onValueChange={(v) => update("unit", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["pieces", "kg", "tons", "meters", "bags", "suits"].map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="font-body text-sm">Image URL</Label>
            <Input value={form.image} onChange={(e) => update("image", e.target.value)} placeholder="https://..." className="mt-1" />
          </div>
          <div>
            <Label className="font-body text-sm">Description</Label>
            <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Product details, material, specifications..." className="mt-1" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="font-body">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-display font-semibold">
            {product ? "Save Changes" : "Add Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
