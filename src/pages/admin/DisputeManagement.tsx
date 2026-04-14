import { useState } from "react";
import { useAdminDisputes, useAdminUpdateDisputeStatus } from "@/hooks/admin/useAdminData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Clock, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { fmt } from "@/lib/formatters";
import { adminDisputeStatusColors } from "@/lib/constants";

export default function DisputeManagement() {
  const { data: disputes = [], isLoading } = useAdminDisputes();
  const updateStatus = useAdminUpdateDisputeStatus();
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<any | null>(null);
  const [rulingFor, setRulingFor] = useState<"buyer" | "seller" | null>(null);
  const [rulingNote, setRulingNote] = useState("");

  const filtered = disputes.filter((d: any) => filter === "all" || d.status === filter);

  const handleRuling = () => {
    if (!selected || !rulingFor || !rulingNote.trim()) return;
    updateStatus.mutate(
      { disputeId: selected.id, status: "resolved", resolution: `Ruled in favour of ${rulingFor}: ${rulingNote}` },
      {
        onSuccess: () => {
          toast.success("Dispute Resolved", { description: `Ruled in favour of ${rulingFor}` });
          setSelected(null);
          setRulingFor(null);
          setRulingNote("");
        },
      }
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dispute Management</h1>

      <div className="flex gap-2 mb-5">
        {["all", "open", "escalated", "resolved"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors"
            style={filter === f ? { background: "#00b89430", color: "#00b894" } : { background: "#1a234060", color: "#9ca3af" }}>
            {f}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-500" /></div>
      )}

      {!isLoading && filtered.length === 0 && (
        <p className="text-gray-500 text-center py-12">No disputes found</p>
      )}

      <div className="space-y-4">
        {filtered.map((d: any) => {
          const statusColor = adminDisputeStatusColors[d.status] || "#636e72";
          return (
            <div key={d.id} className="rounded-xl border p-5 cursor-pointer hover:bg-white/5 transition" style={{ background: "#111a35", borderColor: "#1a2340" }}
              onClick={() => setSelected(d)}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-white font-mono text-sm font-bold">{d.dispute_number || d.id?.slice(0, 8)}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: statusColor + "20", color: statusColor }}>
                    {d.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  {d.created_at ? new Date(d.created_at).toLocaleDateString("en-PK") : "—"}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Buyer: <span className="text-gray-300">{d.buyer?.full_name || "—"}</span></p>
                  <p className="text-gray-300">{d.reason || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Seller: <span className="text-gray-300">{d.seller?.full_name || "—"}</span></p>
                  <p className="text-gray-300">{d.description || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-gray-400">Order: {d.order?.order_number || "—"}</span>
              </div>
              {d.resolution && (
                <div className="mt-3 p-3 rounded-lg border" style={{ borderColor: "#1a2340", background: "#0a0f1e" }}>
                  <p className="text-xs font-semibold" style={{ color: "#00b894" }}>
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    Resolution
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{d.resolution}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ruling Dialog */}
      <Dialog open={!!selected && selected.status !== "resolved"} onOpenChange={() => { setSelected(null); setRulingFor(null); setRulingNote(""); }}>
        <DialogContent className="max-w-md border text-white" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          {selected && (
            <>
              <DialogHeader><DialogTitle className="text-white">Resolve {selected.dispute_number || selected.id?.slice(0, 8)}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="text-sm">
                  <p className="text-gray-400 mb-1">Order: <span className="text-white">{selected.order?.order_number || "—"}</span></p>
                  <p className="text-gray-400">Buyer: <span className="text-white">{selected.buyer?.full_name || "—"}</span></p>
                  <p className="text-gray-400">Seller: <span className="text-white">{selected.seller?.full_name || "—"}</span></p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-2">Rule in favour of:</label>
                  <div className="flex gap-2">
                    <button onClick={() => setRulingFor("buyer")}
                      className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={rulingFor === "buyer" ? { background: "#00b894", color: "#0a0f1e" } : { background: "#1a234060", color: "#9ca3af" }}>
                      Buyer
                    </button>
                    <button onClick={() => setRulingFor("seller")}
                      className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={rulingFor === "seller" ? { background: "#00b894", color: "#0a0f1e" } : { background: "#1a234060", color: "#9ca3af" }}>
                      Seller
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Ruling Note (required)</label>
                  <Textarea value={rulingNote} onChange={e => setRulingNote(e.target.value)} placeholder="Explain your ruling..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => { setSelected(null); setRulingFor(null); setRulingNote(""); }}
                    className="border-white/10 text-gray-300">Cancel</Button>
                  <Button size="sm" disabled={!rulingFor || !rulingNote.trim()} onClick={handleRuling}
                    style={{ background: "#00b894", color: "#0a0f1e" }}>Confirm Ruling</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
