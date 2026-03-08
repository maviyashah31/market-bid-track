import { useState } from "react";
import { suppliers, type Supplier, type SupplierStatus } from "@/data/adminMockData";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, X, Eye, Ban, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const statusColor: Record<string, string> = {
  active: "#00b894", suspended: "#fdcb6e", banned: "#d63031", pending: "#74b9ff",
};

const fmt = (n: number) => "Rs. " + n.toLocaleString("en-PK");

export default function SupplierManagement() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [actionDialog, setActionDialog] = useState<{ type: string; supplier: Supplier } | null>(null);
  const [reason, setReason] = useState("");
  const [data, setData] = useState(suppliers);

  const filters = ["all", "active", "pending", "suspended", "banned", "registered", "unregistered"];

  const filtered = data.filter(s => {
    const matchSearch = s.businessName.toLowerCase().includes(search.toLowerCase()) || s.ntn.includes(search);
    if (filter === "all") return matchSearch;
    if (filter === "registered") return matchSearch && s.strnStatus === "registered";
    if (filter === "unregistered") return matchSearch && s.strnStatus === "unregistered";
    return matchSearch && s.status === filter;
  });

  const handleAction = () => {
    if (!actionDialog || !reason.trim()) return;
    const { type, supplier } = actionDialog;
    setData(prev => prev.map(s => {
      if (s.id !== supplier.id) return s;
      if (type === "approve") return { ...s, status: "active" as SupplierStatus };
      if (type === "suspend") return { ...s, status: "suspended" as SupplierStatus };
      if (type === "ban") return { ...s, status: "banned" as SupplierStatus };
      if (type === "strike") return { ...s, strikeCount: s.strikeCount + 1 };
      if (type === "reject") return { ...s, status: "banned" as SupplierStatus };
      return s;
    }));
    toast({ title: `Action: ${type}`, description: `${type} applied to ${supplier.businessName}` });
    setActionDialog(null);
    setReason("");
    setSelected(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Supplier Management</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input placeholder="Search by name or NTN..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? "text-white" : "text-gray-400 hover:text-gray-200"}`}
              style={filter === f ? { background: "#00b89430", color: "#00b894" } : { background: "#1a234060" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "#111a35", borderColor: "#1a2340" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "#1a2340" }}>
                {["Business Name", "NTN", "STRN", "ATL", "Transactions", "Strikes", "Status", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b hover:bg-white/5 transition cursor-pointer" style={{ borderColor: "#1a234040" }}
                  onClick={() => setSelected(s)}>
                  <td className="px-4 py-3 text-white font-medium">{s.businessName}</td>
                  <td className="px-4 py-3 text-gray-300">{s.ntn}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${s.strnStatus === "registered" ? "text-green-400" : "text-yellow-400"}`}>{s.strnStatus}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${s.atlStatus === "filer" ? "text-green-400" : "text-orange-400"}`}>{s.atlStatus}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{s.totalTransactions}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold ${s.strikeCount >= 2 ? "text-red-400" : "text-gray-300"}`}>{s.strikeCount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase" style={{ background: statusColor[s.status] + "20", color: statusColor[s.status] }}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Eye className="h-4 w-4 text-gray-500" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="p-8 text-center text-gray-500">No suppliers found</p>}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg border text-white" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">{selected.businessName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <Detail label="NTN" value={selected.ntn} />
                  <Detail label="Category" value={selected.category} />
                  <Detail label="STRN Status" value={selected.strnStatus} />
                  <Detail label="ATL Status" value={selected.atlStatus} />
                  <Detail label="Contact" value={selected.contactPerson} />
                  <Detail label="Phone" value={selected.phone} />
                  <Detail label="Email" value={selected.email} />
                  <Detail label="City" value={selected.city} />
                  <Detail label="Total Transactions" value={String(selected.totalTransactions)} />
                  <Detail label="Total Volume" value={fmt(selected.totalVolume)} />
                  <Detail label="Strikes" value={String(selected.strikeCount)} />
                  <Detail label="Joined" value={selected.joinedDate} />
                </div>
                <div className="flex flex-wrap gap-2 pt-3 border-t" style={{ borderColor: "#1a2340" }}>
                  {selected.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => setActionDialog({ type: "approve", supplier: selected })} style={{ background: "#00b894", color: "#0a0f1e" }}>
                        <CheckCircle className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setActionDialog({ type: "reject", supplier: selected })}>
                        <XCircle className="h-3 w-3 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {selected.status === "active" && (
                    <>
                      <Button size="sm" onClick={() => setActionDialog({ type: "strike", supplier: selected })} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                        <AlertTriangle className="h-3 w-3 mr-1" /> Issue Strike
                      </Button>
                      <Button size="sm" onClick={() => setActionDialog({ type: "suspend", supplier: selected })} className="bg-orange-600 hover:bg-orange-700 text-white">
                        Suspend
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setActionDialog({ type: "ban", supplier: selected })}>
                        <Ban className="h-3 w-3 mr-1" /> Ban
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Confirmation */}
      <Dialog open={!!actionDialog} onOpenChange={() => { setActionDialog(null); setReason(""); }}>
        <DialogContent className="max-w-sm border text-white" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          <DialogHeader>
            <DialogTitle className="text-white capitalize">{actionDialog?.type} — {actionDialog?.supplier.businessName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <label className="text-xs text-gray-400">Reason (required)</label>
            <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Enter reason for this action..."
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => { setActionDialog(null); setReason(""); }}
                className="border-white/10 text-gray-300">Cancel</Button>
              <Button size="sm" disabled={!reason.trim()} onClick={handleAction} style={{ background: "#00b894", color: "#0a0f1e" }}>
                Confirm
              </Button>
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
