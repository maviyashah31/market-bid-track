import { useState } from "react";
import { buyers, type Buyer } from "@/data/adminMockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye } from "lucide-react";

import { fmt } from "@/lib/formatters";
import { adminUserStatusColors } from "@/lib/constants";

export default function BuyerManagement() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Buyer | null>(null);

  const filters = ["all", "corporate", "informal", "active", "suspended"];

  const filtered = buyers.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    if (filter === "all") return matchSearch;
    if (filter === "corporate" || filter === "informal") return matchSearch && b.type === filter;
    return matchSearch && b.status === filter;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Buyer Management</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)}
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

      <div className="rounded-xl border overflow-hidden" style={{ background: "#111a35", borderColor: "#1a2340" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "#1a2340" }}>
                {["Name", "Type", "Orders", "Total Spend", "Disputes", "Credit", "Status", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="border-b hover:bg-white/5 transition cursor-pointer" style={{ borderColor: "#1a234040" }}
                  onClick={() => setSelected(b)}>
                  <td className="px-4 py-3 text-white font-medium">{b.name}</td>
                  <td className="px-4 py-3 text-gray-300 capitalize">{b.type}</td>
                  <td className="px-4 py-3 text-gray-300">{b.totalOrders}</td>
                  <td className="px-4 py-3 text-gray-300">{fmt(b.totalSpend)}</td>
                  <td className="px-4 py-3 text-gray-300">{b.disputeCount}</td>
                  <td className="px-4 py-3 text-gray-300">{b.creditScore ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase" style={{ background: adminUserStatusColors[b.status] + "20", color: adminUserStatusColors[b.status] }}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3"><Eye className="h-4 w-4 text-gray-500" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg border text-white" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          {selected && (
            <>
              <DialogHeader><DialogTitle className="text-white">{selected.name}</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Detail label="Type" value={selected.type} />
                <Detail label="Status" value={selected.status} />
                <Detail label="Total Orders" value={String(selected.totalOrders)} />
                <Detail label="Total Spend" value={fmt(selected.totalSpend)} />
                <Detail label="Disputes" value={String(selected.disputeCount)} />
                <Detail label="Credit Score" value={selected.creditScore ? String(selected.creditScore) : "N/A"} />
                <Detail label="City" value={selected.city} />
                <Detail label="Phone" value={selected.phone} />
                <Detail label="Email" value={selected.email} />
                <Detail label="Joined" value={selected.joinedDate} />
                <Detail label="Last Order" value={selected.lastOrder} />
              </div>
            </>
          )}
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
