import { useState } from "react";
import { payments, taxSummary } from "@/data/adminMockData";
import { Button } from "@/components/ui/button";
import { Download, ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

const fmt = (n: number) => "Rs. " + n.toLocaleString("en-PK");

const incoming = payments.filter(p => p.type === "incoming");
const outgoing = payments.filter(p => p.type === "outgoing");
const totalIn = incoming.reduce((s, p) => s + p.amount, 0);
const totalOut = outgoing.reduce((s, p) => s + p.amount, 0);
const balance = totalIn - totalOut;
const totalCommission = payments.filter(p => p.type === "outgoing").reduce((s, p) => s + p.commission, 0);

const methodLabel: Record<string, string> = { bank_transfer: "Bank Transfer", easypaisa: "Easypaisa", jazzcash: "JazzCash", cheque: "Cheque" };

export default function SettlementFinance() {
  const [tab, setTab] = useState<"incoming" | "outgoing" | "commission" | "tax">("incoming");

  const exportCSV = () => {
    const rows = payments.map(p => `${p.id},${p.orderId},${p.type},${p.amount},${p.commission},${p.date},${p.method}`);
    const csv = "ID,Order,Type,Amount,Commission,Date,Method\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bulkur_ledger.csv"; a.click();
  };

  const tabs = [
    { key: "incoming" as const, label: "Incoming Payments" },
    { key: "outgoing" as const, label: "Outgoing Releases" },
    { key: "commission" as const, label: "Commission Ledger" },
    { key: "tax" as const, label: "Tax Summary" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Settlement & Finance</h1>

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card icon={Wallet} label="Settlement Balance" value={fmt(balance)} accent />
        <Card icon={ArrowDownLeft} label="Total Incoming" value={fmt(totalIn)} />
        <Card icon={ArrowUpRight} label="Total Released" value={fmt(totalOut)} />
        <Card icon={Wallet} label="Total Commission" value={fmt(totalCommission)} />
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

      {tab === "tax" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border p-6" style={{ background: "#111a35", borderColor: "#1a2340" }}>
            <p className="text-xs text-gray-400 mb-2">SST Owed to SRB (This Month)</p>
            <p className="text-3xl font-bold text-white">{fmt(taxSummary.sstOwed)}</p>
          </div>
          <div className="rounded-xl border p-6" style={{ background: "#111a35", borderColor: "#1a2340" }}>
            <p className="text-xs text-gray-400 mb-2">WHT Collected (This Month)</p>
            <p className="text-3xl font-bold text-white">{fmt(taxSummary.whtCollected)}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ background: "#111a35", borderColor: "#1a2340" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "#1a2340" }}>
                  {tab === "incoming" && ["ID", "Order", "Buyer", "Amount", "Method", "Date"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>)}
                  {tab === "outgoing" && ["ID", "Order", "Supplier", "Released", "Commission", "Date"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>)}
                  {tab === "commission" && ["Order", "Commission", "Running Total", "Date"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {tab === "incoming" && incoming.slice(0, 40).map(p => (
                  <tr key={p.id} className="border-b hover:bg-white/5" style={{ borderColor: "#1a234040" }}>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.id}</td>
                    <td className="px-4 py-3 text-gray-300 text-xs">{p.orderId}</td>
                    <td className="px-4 py-3 text-gray-300">{p.buyerName}</td>
                    <td className="px-4 py-3 text-white font-medium">{fmt(p.amount)}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{methodLabel[p.method]}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{p.date}</td>
                  </tr>
                ))}
                {tab === "outgoing" && outgoing.map(p => (
                  <tr key={p.id} className="border-b hover:bg-white/5" style={{ borderColor: "#1a234040" }}>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.id}</td>
                    <td className="px-4 py-3 text-gray-300 text-xs">{p.orderId}</td>
                    <td className="px-4 py-3 text-gray-300">{p.supplierName}</td>
                    <td className="px-4 py-3 text-white font-medium">{fmt(p.amount)}</td>
                    <td className="px-4 py-3 text-yellow-400 font-medium">{fmt(p.commission)}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{p.date}</td>
                  </tr>
                ))}
                {tab === "commission" && (() => {
                  let running = 0;
                  return outgoing.map(p => {
                    running += p.commission;
                    return (
                      <tr key={p.id} className="border-b hover:bg-white/5" style={{ borderColor: "#1a234040" }}>
                        <td className="px-4 py-3 text-gray-300 text-xs">{p.orderId}</td>
                        <td className="px-4 py-3 text-white font-medium">{fmt(p.commission)}</td>
                        <td className="px-4 py-3 font-medium" style={{ color: "#00b894" }}>{fmt(running)}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{p.date}</td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
