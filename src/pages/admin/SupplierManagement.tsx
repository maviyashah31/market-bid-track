import { useState, useMemo } from "react";
import { useAdminUsers, useAdminUpdateSupplierOnboardingStatus, useAdminVerifySeller } from "@/hooks/admin/useAdminData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, Loader2, Users, Mail, Calendar, BadgeCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function SupplierManagement() {
  const { data: suppliers = [], isLoading } = useAdminUsers("seller");
  const updateSupplierStatus = useAdminUpdateSupplierOnboardingStatus();
  const verifySeller = useAdminVerifySeller();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => suppliers.filter((s: any) => {
    const name = (s.full_name || "").toLowerCase();
    const email = (s.email || "").toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    if (statusFilter === "all") return matchSearch;
    const status = s.supplier_onboarding?.[0]?.profile_status || "pending";
    return matchSearch && status === statusFilter;
  }), [suppliers, search, statusFilter]);

  const metrics = useMemo(() => ({
    total: suppliers.length,
    pending: suppliers.filter((s: any) => s.supplier_onboarding?.[0]?.profile_status === "pending").length,
    approved: suppliers.filter((s: any) => s.supplier_onboarding?.[0]?.profile_status === "approved").length,
    verified: suppliers.filter((s: any) => s.is_verified).length,
  }), [suppliers]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Supplier Management</h1>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Suppliers", value: metrics.total, color: "#00b894" },
          { label: "Pending Approval", value: metrics.pending, color: "#fdcb6e" },
          { label: "Approved", value: metrics.approved, color: "#74b9ff" },
          { label: "Verified", value: metrics.verified, color: "#00b894" },
        ].map(m => (
          <div key={m.label} className="rounded-xl border p-4" style={{ background: "#111a35", borderColor: "#1a2340" }}>
            <span className="text-[10px] text-gray-400 font-medium uppercase">{m.label}</span>
            <p className="text-xl font-bold mt-1" style={{ color: m.color }}>{isLoading ? "..." : m.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "approved", "rejected"].map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors"
              style={statusFilter === f ? { background: "#00b89430", color: "#00b894" } : { background: "#1a234060", color: "#9ca3af" }}>
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
                {["Name", "Email", "Profile Status", "Verified", "Joined", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={6} className="p-6 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-500" /></td></tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-gray-500">No suppliers found</td></tr>
              )}
              {filtered.map((s: any) => {
                const profileStatus = s.supplier_onboarding?.[0]?.profile_status || "pending";
                const statusColor = profileStatus === "approved" ? "#00b894" : profileStatus === "rejected" ? "#d63031" : "#fdcb6e";
                return (
                  <tr key={s.id} className="border-b hover:bg-white/5 transition cursor-pointer" style={{ borderColor: "#1a234040" }}
                    onClick={() => setSelected(s)}>
                    <td className="px-4 py-3 text-white font-medium">{s.full_name || "—"}</td>
                    <td className="px-4 py-3 text-gray-300">{s.email || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-xs font-bold uppercase" style={{ background: statusColor + "20", color: statusColor }}>
                        {profileStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.is_verified ? (
                        <BadgeCheck className="h-5 w-5 text-[#00b894]" />
                      ) : (
                        <span className="text-xs text-gray-500">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{s.created_at ? new Date(s.created_at).toLocaleDateString("en-PK") : "—"}</td>
                    <td className="px-4 py-3"><Eye className="h-4 w-4 text-gray-500" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t text-xs text-gray-500" style={{ borderColor: "#1a2340" }}>
          Showing {filtered.length} of {suppliers.length} suppliers
        </div>
      </div>

      {/* Profile Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md border text-white" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "#00b89430", color: "#00b894" }}>
                    {(selected.full_name || "?").charAt(0)}
                  </div>
                  <div className="flex items-center gap-2">
                    {selected.full_name || "Unnamed"}
                    {selected.is_verified && <BadgeCheck className="h-5 w-5 text-[#00b894]" />}
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-lg border p-4" style={{ background: "#0d1225", borderColor: "#1a2340" }}>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-gray-500" />
                      <div><span className="text-xs text-gray-500">Email</span><p className="text-gray-200">{selected.email || "—"}</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <div><span className="text-xs text-gray-500">Joined</span><p className="text-gray-200">{selected.created_at ? new Date(selected.created_at).toLocaleDateString("en-PK") : "—"}</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-gray-500" />
                      <div><span className="text-xs text-gray-500">Roles</span><p className="text-gray-200">{selected.user_roles?.map((r: any) => r.role).join(", ") || "seller"}</p></div>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-xs text-gray-500">Profile Status</span>
                      <p className="text-gray-200 capitalize">{selected.supplier_onboarding?.[0]?.profile_status || "pending"}</p>
                    </div>
                  </div>
                </div>

                {selected.supplier_onboarding?.[0] && (
                  <div className="rounded-lg border p-4" style={{ background: "#0d1225", borderColor: "#1a2340" }}>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">Onboarding Info</h3>
                    <div className="space-y-3 text-sm text-gray-200">
                      <div><span className="text-xs text-gray-500">Business Name</span><p>{selected.supplier_onboarding[0].business_name || "—"}</p></div>
                      <div><span className="text-xs text-gray-500">City</span><p>{selected.supplier_onboarding[0].business_city || "—"}</p></div>
                      <div><span className="text-xs text-gray-500">Phone</span><p>{selected.supplier_onboarding[0].business_phone || "—"}</p></div>
                      <div><span className="text-xs text-gray-500">WhatsApp</span><p>{selected.supplier_onboarding[0].whatsapp_number || "—"}</p></div>
                      <div><span className="text-xs text-gray-500">Document Status</span><p>{selected.supplier_onboarding[0].documents_uploaded ? "✅ Uploaded" : "❌ Missing"}</p></div>
                      <div><span className="text-xs text-gray-500">Profile Completed</span><p>{selected.supplier_onboarding[0].profile_completed ? "✅ Yes" : "❌ No"}</p></div>
                      <div><span className="text-xs text-gray-500">Payment Terms</span><p>{selected.supplier_onboarding[0].payment_terms_accepted ? "✅ Accepted" : "❌ Not accepted"}</p></div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {/* Profile approval buttons */}
                  {selected.supplier_onboarding?.[0]?.profile_status === "pending" && (
                    <>
                      <Button size="sm" onClick={async () => {
                        const onboardingId = selected.supplier_onboarding[0].id;
                        await updateSupplierStatus.mutateAsync({ onboardingId, profile_status: "approved" });
                        toast.success("Seller profile approved.");
                        setSelected(null);
                      }} className="bg-green-500 text-white">
                        Approve Profile
                      </Button>
                      <Button size="sm" onClick={async () => {
                        const onboardingId = selected.supplier_onboarding[0].id;
                        await updateSupplierStatus.mutateAsync({ onboardingId, profile_status: "rejected" });
                        toast.success("Seller profile rejected.");
                        setSelected(null);
                      }} className="bg-red-600 text-white">
                        Reject Profile
                      </Button>
                    </>
                  )}
                  {selected.supplier_onboarding?.[0]?.profile_status === "approved" && (
                    <div className="rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-800">Profile Approved ✓</div>
                  )}
                  {selected.supplier_onboarding?.[0]?.profile_status === "rejected" && (
                    <>
                      <div className="rounded-full px-3 py-1 text-xs font-semibold bg-red-100 text-red-800">Profile Rejected</div>
                      <Button size="sm" onClick={async () => {
                        const onboardingId = selected.supplier_onboarding[0].id;
                        await updateSupplierStatus.mutateAsync({ onboardingId, profile_status: "approved" });
                        toast.success("Seller profile approved.");
                        setSelected(null);
                      }} className="bg-green-500 text-white">
                        Approve Profile
                      </Button>
                    </>
                  )}

                  {/* Verification badge (separate from approval) */}
                  {selected.supplier_onboarding?.[0]?.profile_status === "approved" && (
                    <>
                      {selected.is_verified ? (
                        <Button size="sm" variant="outline" onClick={async () => {
                          await verifySeller.mutateAsync({ userId: selected.id, isVerified: false });
                          toast.success("Verified badge removed.");
                          setSelected(null);
                        }} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                          <BadgeCheck className="h-3 w-3 mr-1" /> Remove Verified Badge
                        </Button>
                      ) : (
                        <Button size="sm" onClick={async () => {
                          await verifySeller.mutateAsync({ userId: selected.id, isVerified: true });
                          toast.success("Seller is now verified! ✅");
                          setSelected(null);
                        }} style={{ background: "#00b894", color: "#0a0f1e" }}>
                          <ShieldCheck className="h-3 w-3 mr-1" /> Grant Verified Badge
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
