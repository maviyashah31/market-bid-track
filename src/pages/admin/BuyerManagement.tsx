import { useState, useMemo } from "react";
import { useAdminUsers } from "@/hooks/admin/useAdminData";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, Loader2, Mail, Calendar, Users } from "lucide-react";

export default function BuyerManagement() {
  const { data: buyers = [], isLoading } = useAdminUsers("buyer");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any | null>(null);

  const filtered = useMemo(() => buyers.filter((b: any) => {
    const name = (b.full_name || "").toLowerCase();
    const email = (b.email || "").toLowerCase();
    return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
  }), [buyers, search]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Buyer Management</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "#111a35", borderColor: "#1a2340" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "#1a2340" }}>
                {["Name", "Email", "Roles", "Joined", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={5} className="p-6 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-500" /></td></tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">No buyers found</td></tr>
              )}
              {filtered.map((b: any) => (
                <tr key={b.id} className="border-b hover:bg-white/5 transition cursor-pointer" style={{ borderColor: "#1a234040" }}
                  onClick={() => setSelected(b)}>
                  <td className="px-4 py-3 text-white font-medium">{b.full_name || "—"}</td>
                  <td className="px-4 py-3 text-gray-300">{b.email || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ background: "#00b89420", color: "#00b894" }}>
                      {b.user_roles?.map((r: any) => r.role).join(", ") || "buyer"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{b.created_at ? new Date(b.created_at).toLocaleDateString("en-PK") : "—"}</td>
                  <td className="px-4 py-3"><Eye className="h-4 w-4 text-gray-500" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t text-xs text-gray-500" style={{ borderColor: "#1a2340" }}>
          Showing {filtered.length} of {buyers.length} buyers
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md border text-white" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "#74b9ff30", color: "#74b9ff" }}>
                    {(selected.full_name || "?").charAt(0)}
                  </div>
                  {selected.full_name || "Unnamed"}
                </DialogTitle>
              </DialogHeader>
              <div className="rounded-lg border p-4" style={{ background: "#0d1225", borderColor: "#1a2340" }}>
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
                    <div><span className="text-xs text-gray-500">Roles</span><p className="text-gray-200">{selected.user_roles?.map((r: any) => r.role).join(", ") || "buyer"}</p></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
