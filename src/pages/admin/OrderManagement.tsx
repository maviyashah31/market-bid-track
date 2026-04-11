import { useState } from "react";
import { orders, type Order, type OrderStatus } from "@/data/adminMockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Eye } from "lucide-react";
import { toast } from "sonner";

import { fmt } from "@/lib/formatters";
import { adminOrderStatusColors } from "@/lib/constants";

const allStatuses: OrderStatus[] = ["placed", "confirmed", "in_transit", "delivered", "disputed", "completed", "cancelled"];

export default function OrderManagement() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [actionDialog, setActionDialog] = useState<{ type: string; order: Order } | null>(null);
  const [reason, setReason] = useState("");

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      o.supplierName.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchSearch;
    return matchSearch && o.status === filter;
  });

  const handleAction = () => {
    if (!actionDialog || !reason.trim()) return;
    toast.success(`${actionDialog.type} executed`, { description: `Action applied to ${actionDialog.order.id}` });
    setActionDialog(null);
    setReason("");
    setSelected(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Order Management</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input placeholder="Search by order ID, buyer, or supplier..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors`}
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
                {["Order ID", "Buyer", "Supplier", "Product", "Amount", "Status", "Date", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map(o => (
                <tr key={o.id} className="border-b hover:bg-white/5 transition cursor-pointer" style={{ borderColor: "#1a234040" }}
                  onClick={() => setSelected(o)}>
                  <td className="px-4 py-3 text-white font-mono text-xs">{o.id}</td>
                  <td className="px-4 py-3 text-gray-300">{o.buyerName}</td>
                  <td className="px-4 py-3 text-gray-300">{o.supplierName}</td>
                  <td className="px-4 py-3 text-gray-300 max-w-[200px] truncate">{o.product}</td>
                  <td className="px-4 py-3 text-white font-medium">{fmt(o.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase" style={{ background: adminOrderStatusColors[o.status] + "20", color: adminOrderStatusColors[o.status] }}>
                      {o.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{o.placedDate}</td>
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
              <DialogHeader><DialogTitle className="text-white">{selected.id}</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Detail label="Buyer" value={selected.buyerName} />
                <Detail label="Supplier" value={selected.supplierName} />
                <Detail label="Product" value={selected.product} />
                <Detail label="Qty" value={`${selected.quantity} ${selected.unit}`} />
                <Detail label="Base Price" value={fmt(selected.basePrice)} />
                <Detail label="SST (13%)" value={fmt(selected.sst)} />
                <Detail label="WHT" value={fmt(selected.wht)} />
                <Detail label="Commission" value={fmt(selected.commission)} />
                <Detail label="Total" value={fmt(selected.totalAmount)} />
                <Detail label="Payment" value={selected.paymentStatus} />
                <Detail label="Status" value={selected.status.replace("_", " ")} />
                <Detail label="Placed" value={selected.placedDate} />
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
