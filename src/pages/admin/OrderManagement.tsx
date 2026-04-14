import { useState } from "react";
import { useAdminOrders } from "@/hooks/admin/useAdminData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { fmt } from "@/lib/formatters";
import { adminOrderStatusColors } from "@/lib/constants";

const allStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "disputed", "cancelled"];

export default function OrderManagement() {
  const { data: orders = [], isLoading } = useAdminOrders();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<any | null>(null);
  const [actionDialog, setActionDialog] = useState<{ type: string; order: any } | null>(null);
  const [reason, setReason] = useState("");

  const filtered = orders.filter((o: any) => {
    const orderNum = o.order_number || o.id || "";
    const buyerName = o.buyer?.full_name || "";
    const sellerName = o.seller?.full_name || "";
    const matchSearch = orderNum.toLowerCase().includes(search.toLowerCase()) ||
      buyerName.toLowerCase().includes(search.toLowerCase()) ||
      sellerName.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchSearch;
    return matchSearch && o.status === filter;
  });

  const handleAction = () => {
    if (!actionDialog || !reason.trim()) return;
    toast.success(`${actionDialog.type} executed`, { description: `Action applied to ${actionDialog.order.order_number || actionDialog.order.id}` });
    setActionDialog(null);
    setReason("");
    setSelected(null);
  };

  const getProductName = (order: any) => {
    const items = order.order_items || [];
    if (items.length === 0) return "—";
    return items[0].product_name || items[0].product_id || "Product";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Order Management</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input placeholder="Search by order ID, buyer, or seller..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter("all")}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={filter === "all" ? { background: "#00b89430", color: "#00b894" } : { background: "#1a234060", color: "#9ca3af" }}>
            All
          </button>
          {allStatuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors"
              style={filter === s ? { background: "#00b89430", color: "#00b894" } : { background: "#1a234060", color: "#9ca3af" }}>
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "#111a35", borderColor: "#1a2340" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "#1a2340" }}>
                {["Order #", "Buyer", "Seller", "Product", "Amount", "Status", "Date", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={8} className="p-6 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-500" /></td></tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={8} className="p-6 text-center text-gray-500">No orders found</td></tr>
              )}
              {filtered.slice(0, 50).map((o: any) => (
                <tr key={o.id} className="border-b hover:bg-white/5 transition cursor-pointer" style={{ borderColor: "#1a234040" }}
                  onClick={() => setSelected(o)}>
                  <td className="px-4 py-3 text-white font-mono text-xs">{o.order_number || o.id?.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-gray-300">{o.buyer?.full_name || "—"}</td>
                  <td className="px-4 py-3 text-gray-300">{o.seller?.full_name || "—"}</td>
                  <td className="px-4 py-3 text-gray-300 max-w-[200px] truncate">{getProductName(o)}</td>
                  <td className="px-4 py-3 text-white font-medium">{fmt(o.total_amount || 0)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase" style={{ background: (adminOrderStatusColors[o.status] || "#636e72") + "20", color: adminOrderStatusColors[o.status] || "#636e72" }}>
                      {(o.status || "unknown").replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{o.created_at ? new Date(o.created_at).toLocaleDateString("en-PK") : "—"}</td>
                  <td className="px-4 py-3"><Eye className="h-4 w-4 text-gray-500" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg border text-white" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          {selected && (
            <>
              <DialogHeader><DialogTitle className="text-white">{selected.order_number || selected.id?.slice(0, 8)}</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Detail label="Buyer" value={selected.buyer?.full_name || "—"} />
                <Detail label="Seller" value={selected.seller?.full_name || "—"} />
                <Detail label="Product" value={getProductName(selected)} />
                <Detail label="Items" value={String(selected.order_items?.length || 0)} />
                <Detail label="Subtotal" value={fmt(selected.subtotal || 0)} />
                <Detail label="Shipping" value={fmt(selected.shipping_cost || 0)} />
                <Detail label="Tax" value={fmt(selected.tax_amount || 0)} />
                <Detail label="Total" value={fmt(selected.total_amount || 0)} />
                <Detail label="Payment" value={selected.payment_method || "—"} />
                <Detail label="Status" value={(selected.status || "—").replace("_", " ")} />
                <Detail label="Placed" value={selected.created_at ? new Date(selected.created_at).toLocaleDateString("en-PK") : "—"} />
                <Detail label="Buyer Email" value={selected.buyer?.email || "—"} />
              </div>
              <div className="flex flex-wrap gap-2 pt-3 border-t" style={{ borderColor: "#1a2340" }}>
                <Button size="sm" onClick={() => setActionDialog({ type: "Force Release Payment", order: selected })} style={{ background: "#00b894", color: "#0a0f1e" }}>
                  Force Release Payment
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setActionDialog({ type: "Force Cancel", order: selected })}>
                  Force Cancel
                </Button>
                <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={() => setActionDialog({ type: "Flag for Review", order: selected })}>
                  Flag for Review
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation */}
      <Dialog open={!!actionDialog} onOpenChange={() => { setActionDialog(null); setReason(""); }}>
        <DialogContent className="max-w-sm border text-white" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          <DialogHeader><DialogTitle className="text-white">{actionDialog?.type}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <label className="text-xs text-gray-400">Reason (required)</label>
            <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Enter reason..."
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => { setActionDialog(null); setReason(""); }} className="border-white/10 text-gray-300">Cancel</Button>
              <Button size="sm" disabled={!reason.trim()} onClick={handleAction} style={{ background: "#00b894", color: "#0a0f1e" }}>Confirm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-gray-500">{label}</span>
      <p className="text-gray-200 capitalize">{value}</p>
    </div>
  );
}
