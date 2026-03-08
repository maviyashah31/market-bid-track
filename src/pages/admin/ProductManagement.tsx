import { useState, useMemo } from "react";
import { adminProducts, type AdminProduct, type ProductStatus, suppliers } from "@/data/adminMockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search, Eye, Trash2, Star, Ban, CheckCircle, Flag, Package,
  TrendingUp, DollarSign, AlertTriangle, Sparkles, Edit, RotateCcw
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const statusConfig: Record<ProductStatus, { color: string; label: string }> = {
  active: { color: "#00b894", label: "Active" },
  delisted: { color: "#636e72", label: "Delisted" },
  flagged: { color: "#fdcb6e", label: "Flagged" },
  pending_review: { color: "#74b9ff", label: "Pending Review" },
};

const fmt = (n: number) => "Rs. " + n.toLocaleString("en-PK");

export default function ProductManagement() {
  const [data, setData] = useState(adminProducts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState<AdminProduct | null>(null);
  const [actionDialog, setActionDialog] = useState<{ type: string; products: AdminProduct[] } | null>(null);
  const [reason, setReason] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editDialog, setEditDialog] = useState<AdminProduct | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editCommission, setEditCommission] = useState("");
  const [editMoq, setEditMoq] = useState("");

  const categories = [...new Set(adminProducts.map(p => p.category))];

  const filtered = useMemo(() => {
    return data.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.supplierName.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [data, search, statusFilter, categoryFilter]);

  const metrics = useMemo(() => ({
    total: data.length,
    active: data.filter(p => p.status === "active").length,
    flagged: data.filter(p => p.status === "flagged").length,
    featured: data.filter(p => p.featured).length,
    outOfStock: data.filter(p => p.stock === 0).length,
  }), [data]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(p => p.id)));
    }
  };

  const handleBulkAction = (type: string) => {
    const products = data.filter(p => selectedIds.has(p.id));
    if (products.length === 0) return;
    setActionDialog({ type, products });
  };

  const confirmAction = () => {
    if (!actionDialog) return;
    const { type, products } = actionDialog;
    const ids = new Set(products.map(p => p.id));

    setData(prev => prev.map(p => {
      if (!ids.has(p.id)) return p;
      if (type === "delist") return { ...p, status: "delisted" as ProductStatus };
      if (type === "activate") return { ...p, status: "active" as ProductStatus };
      if (type === "flag") return { ...p, status: "flagged" as ProductStatus };
      if (type === "feature") return { ...p, featured: true };
      if (type === "unfeature") return { ...p, featured: false };
      if (type === "delete") return null as any;
      if (type === "approve") return { ...p, status: "active" as ProductStatus };
      return p;
    }).filter(Boolean));

    toast({ title: `${type} applied`, description: `Action applied to ${products.length} product(s)` });
    setActionDialog(null);
    setReason("");
    setSelectedIds(new Set());
  };

  const handleEditSave = () => {
    if (!editDialog) return;
    setData(prev => prev.map(p => {
      if (p.id !== editDialog.id) return p;
      return {
        ...p,
        price: editPrice ? Number(editPrice) : p.price,
        commissionRate: editCommission ? Number(editCommission) : p.commissionRate,
        moq: editMoq ? Number(editMoq) : p.moq,
      };
    }));
    toast({ title: "Product updated", description: `${editDialog.name} has been updated` });
    setEditDialog(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Product Management</h1>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Total Products", value: metrics.total, icon: Package, color: "#00b894" },
          { label: "Active", value: metrics.active, icon: CheckCircle, color: "#00b894" },
          { label: "Flagged", value: metrics.flagged, icon: Flag, color: "#fdcb6e" },
          { label: "Featured", value: metrics.featured, icon: Sparkles, color: "#74b9ff" },
          { label: "Out of Stock", value: metrics.outOfStock, icon: AlertTriangle, color: "#d63031" },
        ].map(m => (
          <div key={m.label} className="rounded-xl border p-4" style={{ background: "#111a35", borderColor: "#1a2340" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-400 font-medium uppercase">{m.label}</span>
              <m.icon className="h-4 w-4" style={{ color: m.color }} />
            </div>
            <p className="text-xl font-bold text-white">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & bulk actions */}
      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input placeholder="Search products, suppliers..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "active", "flagged", "delisted", "pending_review"].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${statusFilter === f ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
              style={statusFilter === f ? { background: "#00b89430", color: "#00b894" } : { background: "#1a234060" }}>
              {f.replace("_", " ")}
            </button>
          ))}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white text-xs h-8">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg border" style={{ background: "#00b89410", borderColor: "#00b89440" }}>
          <span className="text-sm font-medium" style={{ color: "#00b894" }}>{selectedIds.size} selected</span>
          <div className="flex gap-2 ml-4">
            <Button size="sm" onClick={() => handleBulkAction("feature")} className="h-7 text-xs" style={{ background: "#74b9ff", color: "#0a0f1e" }}>
              <Sparkles className="h-3 w-3 mr-1" /> Feature
            </Button>
            <Button size="sm" onClick={() => handleBulkAction("unfeature")} className="h-7 text-xs bg-gray-600 hover:bg-gray-700 text-white">
              Unfeature
            </Button>
            <Button size="sm" onClick={() => handleBulkAction("flag")} className="h-7 text-xs bg-yellow-600 hover:bg-yellow-700 text-white">
              <Flag className="h-3 w-3 mr-1" /> Flag
            </Button>
            <Button size="sm" onClick={() => handleBulkAction("delist")} className="h-7 text-xs bg-orange-600 hover:bg-orange-700 text-white">
              <Ban className="h-3 w-3 mr-1" /> Delist
            </Button>
            <Button size="sm" onClick={() => handleBulkAction("activate")} className="h-7 text-xs" style={{ background: "#00b894", color: "#0a0f1e" }}>
              <CheckCircle className="h-3 w-3 mr-1" /> Activate
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")} className="h-7 text-xs">
              <Trash2 className="h-3 w-3 mr-1" /> Delete
            </Button>
          </div>
          <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-xs text-gray-400 hover:text-white">Clear</button>
        </div>
      )}

      {/* Product table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "#111a35", borderColor: "#1a2340" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "#1a2340" }}>
                <th className="px-3 py-3 text-left">
                  <Checkbox checked={selectedIds.size === filtered.length && filtered.length > 0} onCheckedChange={toggleSelectAll}
                    className="border-gray-500 data-[state=checked]:bg-[#00b894] data-[state=checked]:border-[#00b894]" />
                </th>
                {["Product", "Supplier", "Price", "Stock", "Orders", "Rating", "Commission", "Status", "Featured", "Actions"].map(h => (
                  <th key={h} className="text-left px-3 py-3 text-xs font-medium text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const sc = statusConfig[p.status];
                return (
                  <tr key={p.id} className="border-b hover:bg-white/5 transition" style={{ borderColor: "#1a234040" }}>
                    <td className="px-3 py-3">
                      <Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => toggleSelect(p.id)}
                        className="border-gray-500 data-[state=checked]:bg-[#00b894] data-[state=checked]:border-[#00b894]" />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="text-white font-medium text-xs truncate max-w-[180px]">{p.name}</p>
                          <p className="text-[10px] text-gray-500">{p.id} • {p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-300 text-xs">{p.supplierName}</td>
                    <td className="px-3 py-3 text-white font-medium text-xs">{fmt(p.price)}</td>
                    <td className="px-3 py-3">
                      <span className={`text-xs font-medium ${p.stock === 0 ? "text-red-400" : p.stock < 50 ? "text-yellow-400" : "text-gray-300"}`}>
                        {p.stock.toLocaleString()} {p.unit}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-gray-300 text-xs">{p.totalOrders}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" style={{ color: "#fdcb6e" }} />
                        <span className="text-xs text-white">{p.rating}</span>
                        <span className="text-[10px] text-gray-500">({p.reviewCount})</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs" style={{ color: "#00b894" }}>{p.commissionRate}%</td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: sc.color + "20", color: sc.color }}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {p.featured && <Sparkles className="h-4 w-4" style={{ color: "#74b9ff" }} />}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(p)} className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => { setEditDialog(p); setEditPrice(String(p.price)); setEditCommission(String(p.commissionRate)); setEditMoq(String(p.moq)); }}
                          className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="p-8 text-center text-gray-500">No products found</p>}
        <div className="px-4 py-3 border-t text-xs text-gray-500 flex items-center justify-between" style={{ borderColor: "#1a2340" }}>
          <span>Showing {filtered.length} of {data.length} products</span>
        </div>
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg border text-white" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-2">
                  {selected.name}
                  {selected.featured && <Sparkles className="h-4 w-4" style={{ color: "#74b9ff" }} />}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="flex gap-4">
                  <img src={selected.image} alt={selected.name} className="w-24 h-24 rounded-lg object-cover" />
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1">
                    <div><span className="text-xs text-gray-500">ID</span><p className="text-gray-200">{selected.id}</p></div>
                    <div><span className="text-xs text-gray-500">Category</span><p className="text-gray-200">{selected.category}</p></div>
                    <div><span className="text-xs text-gray-500">Supplier</span><p className="text-gray-200">{selected.supplierName}</p></div>
                    <div><span className="text-xs text-gray-500">Price</span><p className="text-gray-200">{fmt(selected.price)}</p></div>
                    <div><span className="text-xs text-gray-500">MOQ</span><p className="text-gray-200">{selected.moq} {selected.unit}</p></div>
                    <div><span className="text-xs text-gray-500">Stock</span><p className={selected.stock === 0 ? "text-red-400" : "text-gray-200"}>{selected.stock} {selected.unit}</p></div>
                    <div><span className="text-xs text-gray-500">Commission</span><p style={{ color: "#00b894" }}>{selected.commissionRate}%</p></div>
                    <div><span className="text-xs text-gray-500">Rating</span><p className="text-gray-200">{selected.rating} ({selected.reviewCount} reviews)</p></div>
                    <div><span className="text-xs text-gray-500">Total Orders</span><p className="text-gray-200">{selected.totalOrders}</p></div>
                    <div><span className="text-xs text-gray-500">Revenue</span><p className="text-gray-200">{fmt(selected.totalRevenue)}</p></div>
                    <div><span className="text-xs text-gray-500">Created</span><p className="text-gray-200">{selected.createdDate}</p></div>
                    <div><span className="text-xs text-gray-500">Last Updated</span><p className="text-gray-200">{selected.lastUpdated}</p></div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-3 border-t" style={{ borderColor: "#1a2340" }}>
                  {selected.status !== "active" && (
                    <Button size="sm" onClick={() => { setActionDialog({ type: "activate", products: [selected] }); setSelected(null); }}
                      style={{ background: "#00b894", color: "#0a0f1e" }}>
                      <CheckCircle className="h-3 w-3 mr-1" /> Activate
                    </Button>
                  )}
                  {selected.status === "pending_review" && (
                    <Button size="sm" onClick={() => { setActionDialog({ type: "approve", products: [selected] }); setSelected(null); }}
                      style={{ background: "#00b894", color: "#0a0f1e" }}>
                      <CheckCircle className="h-3 w-3 mr-1" /> Approve
                    </Button>
                  )}
                  {!selected.featured ? (
                    <Button size="sm" onClick={() => { setActionDialog({ type: "feature", products: [selected] }); setSelected(null); }}
                      style={{ background: "#74b9ff", color: "#0a0f1e" }}>
                      <Sparkles className="h-3 w-3 mr-1" /> Feature
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => { setActionDialog({ type: "unfeature", products: [selected] }); setSelected(null); }}
                      className="bg-gray-600 text-white hover:bg-gray-700">
                      Unfeature
                    </Button>
                  )}
                  <Button size="sm" onClick={() => { setActionDialog({ type: "flag", products: [selected] }); setSelected(null); }}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white">
                    <Flag className="h-3 w-3 mr-1" /> Flag
                  </Button>
                  <Button size="sm" onClick={() => { setActionDialog({ type: "delist", products: [selected] }); setSelected(null); }}
                    className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Ban className="h-3 w-3 mr-1" /> Delist
                  </Button>
                  <Button size="sm" onClick={() => { setEditDialog(selected); setEditPrice(String(selected.price)); setEditCommission(String(selected.commissionRate)); setEditMoq(String(selected.moq)); setSelected(null); }}
                    className="bg-white/10 hover:bg-white/20 text-white">
                    <Edit className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => { setActionDialog({ type: "delete", products: [selected] }); setSelected(null); }}>
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent className="max-w-sm border text-white" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          <DialogHeader>
            <DialogTitle className="text-white">Edit Product — {editDialog?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Price (Rs.)</label>
              <Input value={editPrice} onChange={e => setEditPrice(e.target.value)} type="number"
                className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Commission Rate (%)</label>
              <Input value={editCommission} onChange={e => setEditCommission(e.target.value)} type="number"
                className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Minimum Order Quantity</label>
              <Input value={editMoq} onChange={e => setEditMoq(e.target.value)} type="number"
                className="bg-white/5 border-white/10 text-white" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditDialog(null)} className="border-white/10 text-gray-300">Cancel</Button>
            <Button size="sm" onClick={handleEditSave} style={{ background: "#00b894", color: "#0a0f1e" }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action confirmation */}
      <Dialog open={!!actionDialog} onOpenChange={() => { setActionDialog(null); setReason(""); }}>
        <DialogContent className="max-w-sm border text-white" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          <DialogHeader>
            <DialogTitle className="text-white capitalize">{actionDialog?.type} — {actionDialog?.products.length} product(s)</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {actionDialog?.type === "delete" && (
              <p className="text-xs text-red-400">⚠ This action is irreversible and will permanently remove the product(s).</p>
            )}
            <label className="text-xs text-gray-400">Reason (required for audit)</label>
            <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Enter reason..."
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => { setActionDialog(null); setReason(""); }}
                className="border-white/10 text-gray-300">Cancel</Button>
              <Button size="sm" disabled={!reason.trim()} onClick={confirmAction} style={{ background: "#00b894", color: "#0a0f1e" }}>
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
