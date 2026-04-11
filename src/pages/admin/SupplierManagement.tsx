import { useState, useMemo } from "react";
import { suppliers, adminProducts, type Supplier, type SupplierStatus } from "@/data/adminMockData";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Eye, Ban, AlertTriangle, CheckCircle, XCircle, Edit, Package,
  DollarSign, Star, Sparkles, Flag, Phone, Mail, MapPin, Calendar, Shield, TrendingUp
} from "lucide-react";
import { toast } from "sonner";

import { fmt } from "@/lib/formatters";
import { adminUserStatusColors } from "@/lib/constants";

export default function SupplierManagement() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [actionDialog, setActionDialog] = useState<{ type: string; supplier: Supplier } | null>(null);
  const [reason, setReason] = useState("");
  const [data, setData] = useState(suppliers);
  const [editDialog, setEditDialog] = useState<Supplier | null>(null);
  const [editForm, setEditForm] = useState({ contactPerson: "", phone: "", email: "", commissionOverride: "" });
  const [profileTab, setProfileTab] = useState("details");

  const filters = ["all", "active", "pending", "suspended", "banned", "registered", "unregistered"];

  const filtered = useMemo(() => data.filter(s => {
    const matchSearch = s.businessName.toLowerCase().includes(search.toLowerCase()) || s.ntn.includes(search);
    if (filter === "all") return matchSearch;
    if (filter === "registered") return matchSearch && s.strnStatus === "registered";
    if (filter === "unregistered") return matchSearch && s.strnStatus === "unregistered";
    return matchSearch && s.status === filter;
  }), [data, search, filter]);

  const metrics = useMemo(() => ({
    total: data.length,
    active: data.filter(s => s.status === "active").length,
    pending: data.filter(s => s.status === "pending").length,
    suspended: data.filter(s => s.status === "suspended").length,
    atRisk: data.filter(s => s.strikeCount >= 2).length,
  }), [data]);

  const getSupplierProducts = (supplierId: string) =>
    adminProducts.filter(p => p.supplierId === supplierId);

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
      if (type === "reinstate") return { ...s, status: "active" as SupplierStatus };
      if (type === "clear_strikes") return { ...s, strikeCount: 0 };
      if (type === "warning") return s;
      return s;
    }));
    toast.success(`Action: ${type}`, { description: `${type} applied to ${supplier.businessName}` });
    setActionDialog(null);
    setReason("");
    if (selected?.id === supplier.id) {
      setSelected(prev => prev ? { ...prev, status: type === "approve" || type === "reinstate" ? "active" : type === "suspend" ? "suspended" : type === "ban" || type === "reject" ? "banned" : prev.status, strikeCount: type === "strike" ? prev.strikeCount + 1 : type === "clear_strikes" ? 0 : prev.strikeCount } as Supplier : null);
    }
  };

  const handleEditSave = () => {
    if (!editDialog) return;
    setData(prev => prev.map(s => {
      if (s.id !== editDialog.id) return s;
      return {
        ...s,
        contactPerson: editForm.contactPerson || s.contactPerson,
        phone: editForm.phone || s.phone,
        email: editForm.email || s.email,
      };
    }));
    toast.success("Supplier updated", { description: `${editDialog.businessName} details updated` });
    setEditDialog(null);
  };

  const supplierProducts = selected ? getSupplierProducts(selected.id) : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Supplier Management</h1>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Total", value: metrics.total, color: "#00b894" },
          { label: "Active", value: metrics.active, color: "#00b894" },
          { label: "Pending", value: metrics.pending, color: "#74b9ff" },
          { label: "Suspended", value: metrics.suspended, color: "#fdcb6e" },
          { label: "At Risk (2+ Strikes)", value: metrics.atRisk, color: "#d63031" },
        ].map(m => (
          <div key={m.label} className="rounded-xl border p-4" style={{ background: "#111a35", borderColor: "#1a2340" }}>
            <span className="text-[10px] text-gray-400 font-medium uppercase">{m.label}</span>
            <p className="text-xl font-bold mt-1" style={{ color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>

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
                {["Business Name", "NTN", "STRN", "ATL", "Products", "Transactions", "Volume", "Strikes", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const prodCount = getSupplierProducts(s.id).length;
                return (
                  <tr key={s.id} className="border-b hover:bg-white/5 transition cursor-pointer" style={{ borderColor: "#1a234040" }}
                    onClick={() => { setSelected(s); setProfileTab("details"); }}>
                    <td className="px-4 py-3 text-white font-medium">{s.businessName}</td>
                    <td className="px-4 py-3 text-gray-300">{s.ntn}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${s.strnStatus === "registered" ? "text-green-400" : "text-yellow-400"}`}>{s.strnStatus}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${s.atlStatus === "filer" ? "text-green-400" : "text-orange-400"}`}>{s.atlStatus}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{prodCount}</td>
                    <td className="px-4 py-3 text-gray-300">{s.totalTransactions}</td>
                    <td className="px-4 py-3 text-gray-300 text-xs">{fmt(s.totalVolume)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${s.strikeCount >= 2 ? "text-red-400" : "text-gray-300"}`}>
                        {s.strikeCount}
                        {s.strikeCount >= 2 && <AlertTriangle className="h-3 w-3 inline ml-1" />}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded text-[10px] font-bold uppercase" style={{ background: adminUserStatusColors[s.status] + "20", color: adminUserStatusColors[s.status] }}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <button onClick={() => { setSelected(s); setProfileTab("details"); }} className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => { setEditDialog(s); setEditForm({ contactPerson: s.contactPerson, phone: s.phone, email: s.email, commissionOverride: "" }); }}
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
        {filtered.length === 0 && <p className="p-8 text-center text-gray-500">No suppliers found</p>}
        <div className="px-4 py-3 border-t text-xs text-gray-500" style={{ borderColor: "#1a2340" }}>
          Showing {filtered.length} of {data.length} suppliers
        </div>
      </div>

      {/* Full Profile Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl border text-white max-h-[85vh] overflow-y-auto" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: adminUserStatusColors[selected.status] + "30", color: adminUserStatusColors[selected.status] }}>
                    {selected.businessName.charAt(0)}
                  </div>
                  <div>
                    {selected.businessName}
                    <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: adminUserStatusColors[selected.status] + "20", color: adminUserStatusColors[selected.status] }}>
                      {selected.status}
                    </span>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <Tabs value={profileTab} onValueChange={setProfileTab}>
                <TabsList className="bg-white/5 border border-white/10">
                  <TabsTrigger value="details" className="text-xs data-[state=active]:bg-[#00b894] data-[state=active]:text-[#0a0f1e]">Details</TabsTrigger>
                  <TabsTrigger value="products" className="text-xs data-[state=active]:bg-[#00b894] data-[state=active]:text-[#0a0f1e]">Products ({supplierProducts.length})</TabsTrigger>
                  <TabsTrigger value="actions" className="text-xs data-[state=active]:bg-[#00b894] data-[state=active]:text-[#0a0f1e]">Admin Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  {/* Business Info */}
                  <div className="rounded-lg border p-4" style={{ background: "#0d1225", borderColor: "#1a2340" }}>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Business Information</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-xs text-gray-500">NTN</span><p className="text-gray-200 font-mono">{selected.ntn}</p></div>
                      <div><span className="text-xs text-gray-500">Category</span><p className="text-gray-200">{selected.category}</p></div>
                      <div><span className="text-xs text-gray-500">STRN Status</span><p className={selected.strnStatus === "registered" ? "text-green-400" : "text-yellow-400"}>{selected.strnStatus}</p></div>
                      <div><span className="text-xs text-gray-500">ATL Status</span><p className={selected.atlStatus === "filer" ? "text-green-400" : "text-orange-400"}>{selected.atlStatus}</p></div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="rounded-lg border p-4" style={{ background: "#0d1225", borderColor: "#1a2340" }}>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2"><Shield className="h-3 w-3 text-gray-500" /><div><span className="text-xs text-gray-500">Contact Person</span><p className="text-gray-200">{selected.contactPerson}</p></div></div>
                      <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-gray-500" /><div><span className="text-xs text-gray-500">Phone</span><p className="text-gray-200">{selected.phone}</p></div></div>
                      <div className="flex items-center gap-2"><Mail className="h-3 w-3 text-gray-500" /><div><span className="text-xs text-gray-500">Email</span><p className="text-gray-200">{selected.email}</p></div></div>
                      <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-gray-500" /><div><span className="text-xs text-gray-500">City</span><p className="text-gray-200">{selected.city}</p></div></div>
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="rounded-lg border p-4" style={{ background: "#0d1225", borderColor: "#1a2340" }}>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Performance Metrics</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 rounded-lg" style={{ background: "#111a35" }}>
                        <TrendingUp className="h-4 w-4 mx-auto mb-1" style={{ color: "#00b894" }} />
                        <p className="text-lg font-bold text-white">{selected.totalTransactions}</p>
                        <p className="text-[10px] text-gray-500">Transactions</p>
                      </div>
                      <div className="text-center p-3 rounded-lg" style={{ background: "#111a35" }}>
                        <DollarSign className="h-4 w-4 mx-auto mb-1" style={{ color: "#00b894" }} />
                        <p className="text-lg font-bold text-white">{fmt(selected.totalVolume)}</p>
                        <p className="text-[10px] text-gray-500">Total Volume</p>
                      </div>
                      <div className="text-center p-3 rounded-lg" style={{ background: "#111a35" }}>
                        <AlertTriangle className="h-4 w-4 mx-auto mb-1" style={{ color: selected.strikeCount >= 2 ? "#d63031" : "#fdcb6e" }} />
                        <p className="text-lg font-bold" style={{ color: selected.strikeCount >= 2 ? "#d63031" : "white" }}>{selected.strikeCount}</p>
                        <p className="text-[10px] text-gray-500">Strikes</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                      <div><span className="text-xs text-gray-500">Joined</span><p className="text-gray-200">{selected.joinedDate}</p></div>
                      <div><span className="text-xs text-gray-500">Last Active</span><p className="text-gray-200">{selected.lastActive}</p></div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="products" className="mt-4">
                  {supplierProducts.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-10 w-10 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No products listed</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {supplierProducts.map(p => (
                        <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-white/5 transition" style={{ borderColor: "#1a2340" }}>
                          <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{p.name}</p>
                            <p className="text-[10px] text-gray-500">{p.id} • {p.category}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-white text-xs font-medium">{fmt(p.price)}</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" style={{ color: "#fdcb6e" }} />
                              <span className="text-[10px] text-gray-400">{p.rating}</span>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                              style={{ background: (p.status === "active" ? "#00b894" : p.status === "flagged" ? "#fdcb6e" : "#636e72") + "20", color: p.status === "active" ? "#00b894" : p.status === "flagged" ? "#fdcb6e" : "#636e72" }}>
                              {p.status}
                            </span>
                          </div>
                          {p.featured && <Sparkles className="h-4 w-4 shrink-0" style={{ color: "#74b9ff" }} />}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="actions" className="mt-4 space-y-3">
                  <p className="text-xs text-gray-400 mb-3">Admin enforcement actions — all actions require a reason and are logged for audit.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {selected.status === "pending" && (
                      <>
                        <ActionButton label="Approve" icon={CheckCircle} color="#00b894" onClick={() => setActionDialog({ type: "approve", supplier: selected })} />
                        <ActionButton label="Reject" icon={XCircle} color="#d63031" onClick={() => setActionDialog({ type: "reject", supplier: selected })} />
                      </>
                    )}
                    {selected.status === "active" && (
                      <>
                        <ActionButton label="Issue Warning" icon={AlertTriangle} color="#fdcb6e" onClick={() => setActionDialog({ type: "warning", supplier: selected })} />
                        <ActionButton label="Issue Strike" icon={AlertTriangle} color="#e17055" onClick={() => setActionDialog({ type: "strike", supplier: selected })} />
                        <ActionButton label="Suspend Account" icon={Ban} color="#fdcb6e" onClick={() => setActionDialog({ type: "suspend", supplier: selected })} />
                        <ActionButton label="Permanent Ban" icon={Ban} color="#d63031" onClick={() => setActionDialog({ type: "ban", supplier: selected })} />
                      </>
                    )}
                    {selected.status === "suspended" && (
                      <>
                        <ActionButton label="Reinstate" icon={CheckCircle} color="#00b894" onClick={() => setActionDialog({ type: "reinstate", supplier: selected })} />
                        <ActionButton label="Permanent Ban" icon={Ban} color="#d63031" onClick={() => setActionDialog({ type: "ban", supplier: selected })} />
                      </>
                    )}
                    {selected.strikeCount > 0 && (
                      <ActionButton label="Clear All Strikes" icon={CheckCircle} color="#00b894" onClick={() => setActionDialog({ type: "clear_strikes", supplier: selected })} />
                    )}
                    <ActionButton label="Edit Details" icon={Edit} color="#74b9ff"
                      onClick={() => { setEditDialog(selected); setEditForm({ contactPerson: selected.contactPerson, phone: selected.phone, email: selected.email, commissionOverride: "" }); }} />
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent className="max-w-sm border text-white" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          <DialogHeader>
            <DialogTitle className="text-white">Edit — {editDialog?.businessName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Contact Person</label>
              <Input value={editForm.contactPerson} onChange={e => setEditForm(f => ({ ...f, contactPerson: e.target.value }))}
                className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Phone</label>
              <Input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Email</label>
              <Input value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                className="bg-white/5 border-white/10 text-white" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditDialog(null)} className="border-white/10 text-gray-300">Cancel</Button>
            <Button size="sm" onClick={handleEditSave} style={{ background: "#00b894", color: "#0a0f1e" }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation */}
      <Dialog open={!!actionDialog} onOpenChange={() => { setActionDialog(null); setReason(""); }}>
        <DialogContent className="max-w-sm border text-white" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          <DialogHeader>
            <DialogTitle className="text-white capitalize">{actionDialog?.type.replace("_", " ")} — {actionDialog?.supplier.businessName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {(actionDialog?.type === "ban" || actionDialog?.type === "reject") && (
              <p className="text-xs text-red-400">⚠ This action will permanently remove the supplier from the platform.</p>
            )}
            {actionDialog?.type === "strike" && actionDialog.supplier.strikeCount >= 1 && (
              <p className="text-xs text-yellow-400">⚠ Supplier has {actionDialog.supplier.strikeCount} strike(s). One more will trigger automatic review for ban.</p>
            )}
            <label className="text-xs text-gray-400">Reason (required for audit trail)</label>
            <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Enter detailed reason for this action..."
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500" rows={3} />
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

function ActionButton({ label, icon: Icon, color, onClick }: { label: string; icon: any; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition hover:opacity-80"
      style={{ borderColor: color + "40", background: color + "10", color }}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
