import { useState } from "react";
import { adminNotifications, type AdminNotification } from "@/data/adminMockData";
import { Link } from "react-router-dom";
import { Bell, AlertTriangle, ShoppingBag, Users, Wallet, CreditCard } from "lucide-react";

const typeIcon: Record<string, any> = {
  supplier_application: Users,
  dispute_raised: AlertTriangle,
  strike_warning: AlertTriangle,
  large_transaction: ShoppingBag,
  missed_payment: CreditCard,
  low_balance: Wallet,
};

const typeColor: Record<string, string> = {
  supplier_application: "#74b9ff",
  dispute_raised: "#d63031",
  strike_warning: "#fdcb6e",
  large_transaction: "#00b894",
  missed_payment: "#d63031",
  low_balance: "#fdcb6e",
};

export default function NotificationsPage() {
  const [data, setData] = useState(adminNotifications);
  const unread = data.filter(n => !n.read).length;

  const markAllRead = () => setData(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setData(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-xs font-semibold" style={{ color: "#00b894" }}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {data.map(n => {
          const Icon = typeIcon[n.type] || Bell;
          const color = typeColor[n.type] || "#00b894";
          return (
            <Link
              key={n.id}
              to={n.link}
              onClick={() => markRead(n.id)}
              className={`block rounded-xl border p-4 transition hover:bg-white/5 ${!n.read ? "border-l-2" : ""}`}
              style={{
                background: !n.read ? "#111a35" : "#0d1225",
                borderColor: !n.read ? color : "#1a2340",
                borderLeftColor: !n.read ? color : undefined,
              }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + "20" }}>
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: "#00b894" }} />}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{n.description}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{n.time}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
