import { useState } from "react";
import { disputes, type Dispute } from "@/data/adminMockData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { fmt } from "@/lib/formatters";
import { adminDisputeStatusColors } from "@/lib/constants";

export default function DisputeManagement() {
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState(disputes);
  const [selected, setSelected] = useState<Dispute | null>(null);
  const [rulingFor, setRulingFor] = useState<"buyer" | "supplier" | null>(null);
  const [rulingNote, setRulingNote] = useState("");

  const filtered = data.filter(d => filter === "all" || d.status === filter);

  const handleRuling = () => {
    if (!selected || !rulingFor || !rulingNote.trim()) return;
    setData(prev => prev.map(d => d.id === selected.id ? {
      ...d, status: "resolved" as const, ruling: rulingFor, rulingNote, resolvedDate: "2026-03-08"
    } : d));
    toast.success("Dispute Resolved", { description: `Ruled in favour of ${rulingFor} for ${selected.orderId}` });
    setSelected(null);
    setRulingFor(null);
    setRulingNote("");
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

      <div className="space-y-4">
        {filtered.map(d => (
          <div key={d.id} className="rounded-xl border p-5 cursor-pointer hover:bg-white/5 transition" style={{ background: "#111a35", borderColor: "#1a2340" }}
            onClick={() => setSelected(d)}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-white font-mono text-sm font-bold">{d.id}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: adminDisputeStatusColors[d.status] + "20", color: adminDisputeStatusColors[d.status] }}>
                  {d.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="h-3 w-3" />
                Raised: {d.raisedDate}
                {d.resolvedDate && <span className="ml-2">Resolved: {d.resolvedDate}</span>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">Buyer: <span className="text-gray-300">{d.buyerName}</span></p>
                <p className="text-gray-300">{d.buyerClaim}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Supplier: <span className="text-gray-300">{d.supplierName}</span></p>
                <p className="text-gray-300">{d.supplierResponse}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <FileText className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-400">{d.evidenceFiles.length} evidence file(s)</span>
              <span className="ml-auto text-white font-semibold text-sm">{fmt(d.amount)}</span>
            </div>
            {d.ruling && (
              <div className="mt-3 p-3 rounded-lg border" style={{ borderColor: "#1a2340", background: "#0a0f1e" }}>
                <p className="text-xs font-semibold" style={{ color: "#00b894" }}>
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Ruled in favour of {d.ruling}
                </p>
                <p className="text-xs text-gray-400 mt-1">{d.rulingNote}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ruling Dialog */}
      <Dialog open={!!selected && selected.status !== "resolved"} onOpenChange={() => { setSelected(null); setRulingFor(null); setRulingNote(""); }}>
        <DialogContent className="max-w-md border text-white" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          {selected && (
            <>
              <DialogHeader><DialogTitle className="text-white">Resolve {selected.id}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="text-sm">
                  <p className="text-gray-400 mb-1">Order: <span className="text-white">{selected.orderId}</span></p>
                  <p className="text-gray-400">Amount: <span className="text-white font-bold">{fmt(selected.amount)}</span></p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-2">Rule in favour of:</label>
                  <div className="flex gap-2">
                    <button onClick={() => setRulingFor("buyer")}
                      className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={rulingFor === "buyer" ? { background: "#00b894", color: "#0a0f1e" } : { background: "#1a234060", color: "#9ca3af" }}>
                      Buyer
                    </button>
                    <button onClick={() => setRulingFor("supplier")}
                      className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                      style={rulingFor === "supplier" ? { background: "#00b894", color: "#0a0f1e" } : { background: "#1a234060", color: "#9ca3af" }}>
                      Supplier
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
