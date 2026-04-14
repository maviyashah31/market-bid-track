import { useState, useMemo } from "react";
import { useAdminProducts, useAdminUpdateProductStatus } from "@/hooks/admin/useAdminData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search, Eye, Trash2, Ban, CheckCircle, Flag, Package,
  AlertTriangle, Sparkles, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { fmt } from "@/lib/formatters";

const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: "#00b894", label: "Active" },
  draft: { color: "#636e72", label: "Draft" },
  out_of_stock: { color: "#d63031", label: "Out of Stock" },
  pending: { color: "#74b9ff", label: "Pending" },
  pending_review: { color: "#74b9ff", label: "Pending Review" },
  rejected: { color: "#d63031", label: "Rejected" },
};

export default function ProductManagement() {
  const { data: products = [], isLoading } = useAdminProducts();
  const updateStatus = useAdminUpdateProductStatus();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState<any | null>(null);
  const [actionDialog, setActionDialog] = useState<{ type: string; productIds: string[] } | null>(null);
  const [reason, setReason] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const categories = useMemo(() => [...new Set(products.map((p: any) => p.categories?.name).filter(Boolean))], [products]);

  const filtered = useMemo(() => {
    return products.filter((p: any) => {
      const matchSearch = (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.profiles?.full_name || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      const matchCat = categoryFilter === "all" || p.categories?.name === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [products, search, statusFilter, categoryFilter]);

  const metrics = useMemo(() => ({
    total: products.length,
    active: products.filter((p: any) => p.status === "active").length,
    draft: products.filter((p: any) => p.status === "draft").length,
    outOfStock: products.filter((p: any) => (p.stock_quantity || 0) === 0).length,
  }), [products]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((p: any) => p.id)));
  };

  const handleBulkAction = (type: string) => {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    setActionDialog({ type, productIds: ids });
  };

  const confirmAction = () => {
    if (!actionDialog) return;
    const statusMap: Record<string, string> = { activate: "active", delist: "draft" };
    const newStatus = statusMap[actionDialog.type];
    if (newStatus) {
      actionDialog.productIds.forEach(id => updateStatus.mutate({ productId: id, status: newStatus }));
    }
    toast.success(`${actionDialog.type} applied`, { description: `Action applied to ${actionDialog.productIds.length} product(s)` });
    setActionDialog(null);
    setReason("");
    setSelectedIds(new Set());
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Product Management</h1>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Products", value: metrics.total, icon: Package, color: "#00b894" },
          { label: "Active", value: metrics.active, icon: CheckCircle, color: "#00b894" },
          { label: "Draft", value: metrics.draft, icon: Flag, color: "#fdcb6e" },
          { label: "Out of Stock", value: metrics.outOfStock, icon: AlertTriangle, color: "#d63031" },
        ].map(m => (
          <div key={m.label} className="rounded-xl border p-4" style={{ background: "#111a35", borderColor: "#1a2340" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-400 font-medium uppercase">{m.label}</span>
              <m.icon className="h-4 w-4" style={{ color: m.color }} />
            </div>
            <p className="text-xl font-bold text-white">{isLoading ? "..." : m.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input placeholder="Search products, sellers..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "active", "draft", "out_of_stock", "pending", "pending_review", "rejected"].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors"
              style={statusFilter === f ? { background: "#00b89430", color: "#00b894" } : { background: "#1a234060", color: "#9ca3af" }}>
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
            <Button size="sm" onClick={() => handleBulkAction("activate")} className="h-7 text-xs" style={{ background: "#00b894", color: "#0a0f1e" }}>
              <CheckCircle className="h-3 w-3 mr-1" /> Activate
            </Button>
            <Button size="sm" onClick={() => handleBulkAction("delist")} className="h-7 text-xs bg-orange-600 hover:bg-orange-700 text-white">
              <Ban className="h-3 w-3 mr-1" /> Delist
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
                {["Product", "Seller", "Price", "Stock", "Category", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-3 py-3 text-xs font-medium text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={8} className="p-6 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-500" /></td></tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={8} className="p-6 text-center text-gray-500">No products found</td></tr>
              )}
              {filtered.map((p: any) => {
                const sc = statusConfig[p.status] || { color: "#636e72", label: p.status };
                return (
                  <tr key={p.id} className="border-b hover:bg-white/5 transition" style={{ borderColor: "#1a234040" }}>
                    <td className="px-3 py-3">
                      <Checkbox checked={selectedIds.has(p.id)} onCheckedChange={() => toggleSelect(p.id)}
                        className="border-gray-500 data-[state=checked]:bg-[#00b894] data-[state=checked]:border-[#00b894]" />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        {p.image_urls?.[0] && <img src={p.image_urls[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                        <div className="min-w-0">
                          <p className="text-white font-medium text-xs truncate max-w-[180px]">{p.name}</p>
                          <p className="text-[10px] text-gray-500">{p.categories?.name || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-300 text-xs">{p.profiles?.full_name || "—"}</td>
                    <td className="px-3 py-3 text-white font-medium text-xs">
                      {p.min_price ? fmt(p.min_price) : "—"}
                      {p.max_price && p.max_price !== p.min_price ? ` - ${fmt(p.max_price)}` : ""}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-xs font-medium ${(p.stock_quantity || 0) === 0 ? "text-red-400" : (p.stock_quantity || 0) < 50 ? "text-yellow-400" : "text-gray-300"}`}>
                        {(p.stock_quantity || 0).toLocaleString()} {p.unit || "pcs"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-gray-300 text-xs">{p.categories?.name || "—"}</td>
                    <td className="px-3 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: sc.color + "20", color: sc.color }}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button onClick={() => setSelected(p)} className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t text-xs text-gray-500 flex items-center justify-between" style={{ borderColor: "#1a2340" }}>
          <span>Showing {filtered.length} of {products.length} products</span>
        </div>
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg border text-white" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          {selected && (
            <>
              <DialogHeader><DialogTitle className="text-white">{selected.name}</DialogTitle></DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="flex gap-4">
                  {selected.image_urls?.[0] && <img src={selected.image_urls[0]} alt={selected.name} className="w-24 h-24 rounded-lg object-cover" />}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1">
                    <div><span className="text-xs text-gray-500">Category</span><p className="text-gray-200">{selected.categories?.name || "—"}</p></div>
                    <div><span className="text-xs text-gray-500">Seller</span><p className="text-gray-200">{selected.profiles?.full_name || "—"}</p></div>
                    <div><span className="text-xs text-gray-500">Price</span><p className="text-gray-200">{selected.min_price ? fmt(selected.min_price) : "—"}</p></div>
                    <div><span className="text-xs text-gray-500">MOQ</span><p className="text-gray-200">{selected.moq || "—"} {selected.unit || "pcs"}</p></div>
                    <div><span className="text-xs text-gray-500">Stock</span><p className={(selected.stock_quantity || 0) === 0 ? "text-red-400" : "text-gray-200"}>{selected.stock_quantity || 0} {selected.unit || "pcs"}</p></div>
                    <div><span className="text-xs text-gray-500">Status</span><p className="text-gray-200">{selected.status}</p></div>
                    <div><span className="text-xs text-gray-500">Created</span><p className="text-gray-200">{selected.created_at ? new Date(selected.created_at).toLocaleDateString("en-PK") : "—"}</p></div>
                  </div>
                </div>
                {selected.description && (
                  <div className="pt-3 border-t" style={{ borderColor: "#1a2340" }}>
                    <span className="text-xs text-gray-500">Description</span>
                    <p className="text-gray-300 text-xs mt-1">{selected.description}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-3 border-t" style={{ borderColor: "#1a2340" }}>
                  {selected.status === "pending_review" && (
                    <>
                      <Button size="sm" onClick={() => { updateStatus.mutate({ productId: selected.id, status: "active" }); setSelected(null); toast.success("Product approved and published"); }}
                        style={{ background: "#00b894", color: "#0a0f1e" }}>
                        <CheckCircle className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" onClick={() => { updateStatus.mutate({ productId: selected.id, status: "rejected" }); setSelected(null); toast.success("Product rejected"); }}
                        className="bg-red-600 hover:bg-red-700 text-white">
                        <Ban className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {selected.status !== "active" && selected.status !== "pending_review" && (
                    <Button size="sm" onClick={() => { updateStatus.mutate({ productId: selected.id, status: "active" }); setSelected(null); toast.success("Product activated"); }}
                      style={{ background: "#00b894", color: "#0a0f1e" }}>
                      <CheckCircle className="h-3 w-3 mr-1" /> Activate
                    </Button>
                  )}
                  {selected.status === "active" && (
                    <Button size="sm" onClick={() => { updateStatus.mutate({ productId: selected.id, status: "draft" }); setSelected(null); toast.success("Product delisted"); }}
                      className="bg-orange-600 hover:bg-orange-700 text-white">
                      <Ban className="h-3 w-3 mr-1" /> Delist
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Action confirmation */}
      <Dialog open={!!actionDialog} onOpenChange={() => { setActionDialog(null); setReason(""); }}>
        <DialogContent className="max-w-sm border text-white" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          <DialogHeader>
            <DialogTitle className="text-white capitalize">{actionDialog?.type} — {actionDialog?.productIds.length} product(s)</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
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
