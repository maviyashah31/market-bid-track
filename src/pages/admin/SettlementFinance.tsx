import { useState, useMemo } from "react";
import { useAdminPayments } from "@/hooks/admin/useAdminData";
import { Button } from "@/components/ui/button";
import { Download, ArrowDownLeft, ArrowUpRight, Wallet, Loader2 } from "lucide-react";

import { fmt } from "@/lib/formatters";

export default function SettlementFinance() {
  const { data: payments = [], isLoading } = useAdminPayments();
  const [tab, setTab] = useState<"all" | "payment" | "payout" | "commission">("all");

  const stats = useMemo(() => {
    const totalIn = payments.filter((p: any) => p.type === "payment").reduce((s: number, p: any) => s + (p.amount || 0), 0);
    const totalOut = payments.filter((p: any) => p.type === "payout").reduce((s: number, p: any) => s + (p.amount || 0), 0);
    const totalCommission = payments.filter((p: any) => p.type === "commission").reduce((s: number, p: any) => s + (p.amount || 0), 0);
    return { totalIn, totalOut, totalCommission, balance: totalIn - totalOut };
  }, [payments]);

  const filtered = useMemo(() => {
    if (tab === "all") return payments;
    return payments.filter((p: any) => p.type === tab);
  }, [payments, tab]);

  const exportCSV = () => {
    const rows = payments.map((p: any) => `${p.id},${p.order_id || ""},${p.type},${p.amount},${p.method || ""},${p.created_at}`);
    const csv = "ID,Order,Type,Amount,Method,Date\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bulkur_ledger.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { key: "all" as const, label: "All Transactions" },
    { key: "payment" as const, label: "Incoming Payments" },
    { key: "payout" as const, label: "Payouts" },
    { key: "commission" as const, label: "Commission" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Settlement & Finance</h1>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card icon={Wallet} label="Balance" value={isLoading ? "..." : fmt(stats.balance)} accent />
        <Card icon={ArrowDownLeft} label="Total Incoming" value={isLoading ? "..." : fmt(stats.totalIn)} />
        <Card icon={ArrowUpRight} label="Total Released" value={isLoading ? "..." : fmt(stats.totalOut)} />
        <Card icon={Wallet} label="Total Commission" value={isLoading ? "..." : fmt(stats.totalCommission)} />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
            style={tab === t.key ? { background: "#00b89430", color: "#00b894" } : { background: "#1a234060", color: "#9ca3af" }}>
            {t.label}
          </button>
        ))}
        <Button size="sm" variant="outline" className="ml-auto border-white/10 text-gray-300 text-xs" onClick={exportCSV}>
          <Download className="h-3 w-3 mr-1" /> Export CSV
        </Button>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "#111a35", borderColor: "#1a2340" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "#1a2340" }}>
                {["Type", "Buyer", "Seller", "Amount", "Method", "Status", "Date"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={7} className="p-6 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-500" /></td></tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr><td colSpan={7} className="p-6 text-center text-gray-500">No transactions found</td></tr>
              )}
              {filtered.map((p: any) => (
                <tr key={p.id} className="border-b hover:bg-white/5" style={{ borderColor: "#1a234040" }}>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                      style={{ background: p.type === "payment" ? "#00b89420" : p.type === "payout" ? "#74b9ff20" : "#fdcb6e20", color: p.type === "payment" ? "#00b894" : p.type === "payout" ? "#74b9ff" : "#fdcb6e" }}>
                      {p.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{p.buyer?.full_name || "—"}</td>
                  <td className="px-4 py-3 text-gray-300">{p.seller?.full_name || "—"}</td>
                  <td className="px-4 py-3 text-white font-medium">{fmt(p.amount || 0)}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{p.method || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                      style={{ background: p.status === "completed" ? "#00b89420" : "#fdcb6e20", color: p.status === "completed" ? "#00b894" : "#fdcb6e" }}>
                      {p.status || "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{p.created_at ? new Date(p.created_at).toLocaleDateString("en-PK") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border p-5" style={{ background: accent ? "#00b89415" : "#111a35", borderColor: accent ? "#00b89440" : "#1a2340" }}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4" style={{ color: "#00b894" }} />
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}
