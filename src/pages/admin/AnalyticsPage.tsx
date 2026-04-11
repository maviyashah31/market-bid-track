import {
  gmvChartData, categoryTransactions, topSuppliersByVolume, topBuyersBySpend,
  disputeRateData, avgOrderValueData, repeatBuyerTrend
} from "@/data/adminMockData";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fmt = (n: number) => "Rs. " + (n >= 1000000 ? (n / 1000000).toFixed(1) + "M" : (n / 1000).toFixed(0) + "K");
import { fmt as fmtFull } from "@/lib/formatters";

const chartStyle = { background: "#111a35", borderColor: "#1a2340" };

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>

      {/* GMV & Commission */}
      <div className="rounded-xl border p-5 mb-6" style={chartStyle}>
        <h3 className="text-sm font-semibold text-white mb-4">GMV & Commission — Last 30 Days</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={gmvChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a234060" />
            <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={v => fmt(v)} />
            <Tooltip contentStyle={{ background: "#0d1225", border: "1px solid #1a2340", borderRadius: 8, color: "#fff" }}
              formatter={(v: number) => fmtFull(v)} />
            <Line type="monotone" dataKey="gmv" stroke="#00b894" strokeWidth={2} dot={false} name="GMV" />
            <Line type="monotone" dataKey="commission" stroke="#fdcb6e" strokeWidth={2} dot={false} name="Commission" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category Transactions */}
        <div className="rounded-xl border p-5" style={chartStyle}>
          <h3 className="text-sm font-semibold text-white mb-4">Transactions by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryTransactions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a234060" />
              <XAxis dataKey="category" tick={{ fill: "#6b7280", fontSize: 9 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#0d1225", border: "1px solid #1a2340", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="transactions" fill="#00b894" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dispute Rate */}
        <div className="rounded-xl border p-5" style={chartStyle}>
          <h3 className="text-sm font-semibold text-white mb-4">Dispute Rate (%) — Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={disputeRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a234060" />
              <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#0d1225", border: "1px solid #1a2340", borderRadius: 8, color: "#fff" }} />
              <Line type="monotone" dataKey="rate" stroke="#d63031" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Avg Order Value */}
        <div className="rounded-xl border p-5" style={chartStyle}>
          <h3 className="text-sm font-semibold text-white mb-4">Avg Order Value — Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={avgOrderValueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a234060" />
              <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 10 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} tickFormatter={v => fmt(v)} />
              <Tooltip contentStyle={{ background: "#0d1225", border: "1px solid #1a2340", borderRadius: 8, color: "#fff" }}
                formatter={(v: number) => fmtFull(v)} />
              <Line type="monotone" dataKey="value" stroke="#74b9ff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Repeat Buyer Trend */}
        <div className="rounded-xl border p-5" style={chartStyle}>
          <h3 className="text-sm font-semibold text-white mb-4">Repeat Buyer Rate (%) — 12 Months</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={repeatBuyerTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a234060" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 10 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} />
              <Tooltip contentStyle={{ background: "#0d1225", border: "1px solid #1a2340", borderRadius: 8, color: "#fff" }} />
              <Bar dataKey="rate" fill="#00b894" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border p-5" style={chartStyle}>
          <h3 className="text-sm font-semibold text-white mb-4">Top 10 Suppliers by Volume</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "#1a2340" }}>
                <th className="text-left pb-2 text-xs text-gray-400">#</th>
                <th className="text-left pb-2 text-xs text-gray-400">Supplier</th>
                <th className="text-right pb-2 text-xs text-gray-400">Volume</th>
              </tr>
            </thead>
            <tbody>
              {topSuppliersByVolume.map((s, i) => (
                <tr key={s.id} className="border-b" style={{ borderColor: "#1a234030" }}>
                  <td className="py-2 text-gray-500">{i + 1}</td>
                  <td className="py-2 text-gray-200">{s.businessName}</td>
                  <td className="py-2 text-right text-white font-medium">{fmtFull(s.totalVolume)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border p-5" style={chartStyle}>
          <h3 className="text-sm font-semibold text-white mb-4">Top 10 Buyers by Spend</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "#1a2340" }}>
                <th className="text-left pb-2 text-xs text-gray-400">#</th>
                <th className="text-left pb-2 text-xs text-gray-400">Buyer</th>
                <th className="text-right pb-2 text-xs text-gray-400">Spend</th>
              </tr>
            </thead>
            <tbody>
              {topBuyersBySpend.map((b, i) => (
                <tr key={b.id} className="border-b" style={{ borderColor: "#1a234030" }}>
                  <td className="py-2 text-gray-500">{i + 1}</td>
                  <td className="py-2 text-gray-200">{b.name}</td>
                  <td className="py-2 text-right text-white font-medium">{fmtFull(b.totalSpend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
