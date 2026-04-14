import { useAdminNotifications, useAdminMarkNotificationRead } from "@/hooks/admin/useAdminData";
import { Bell, AlertTriangle, ShoppingBag, Users, Wallet, CreditCard, Loader2, MessageSquare } from "lucide-react";

const typeIcon: Record<string, any> = {
  order: ShoppingBag,
  dispute: AlertTriangle,
  system: Bell,
  message: MessageSquare,
  review: Users,
  payment: CreditCard,
};

const typeColor: Record<string, string> = {
  order: "#00b894",
  dispute: "#d63031",
  system: "#74b9ff",
  message: "#fdcb6e",
  review: "#00b894",
  payment: "#00b894",
};

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useAdminNotifications();
  const markRead = useAdminMarkNotificationRead();

  const unread = notifications.filter((n: any) => !n.is_read).length;

  const handleMarkAllRead = () => {
    notifications.filter((n: any) => !n.is_read).forEach((n: any) => markRead.mutate(n.id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        {unread > 0 && (
          <button onClick={handleMarkAllRead} className="text-xs font-semibold" style={{ color: "#00b894" }}>
            Mark all as read ({unread})
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gray-500" /></div>
      )}

      {!isLoading && notifications.length === 0 && (
        <p className="text-gray-500 text-center py-12">No notifications</p>
      )}

      <div className="space-y-3">
        {notifications.map((n: any) => {
          const Icon = typeIcon[n.type] || Bell;
          const color = typeColor[n.type] || "#00b894";
          return (
            <div
              key={n.id}
              onClick={() => !n.is_read && markRead.mutate(n.id)}
              className={`block rounded-xl border p-4 transition hover:bg-white/5 cursor-pointer ${!n.is_read ? "border-l-2" : ""}`}
              style={{
                background: !n.is_read ? "#111a35" : "#0d1225",
                borderColor: !n.is_read ? color : "#1a2340",
                borderLeftColor: !n.is_read ? color : undefined,
              }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + "20" }}>
                  <Icon className="h-4 w-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{n.title}</p>
                    {!n.is_read && <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: "#00b894" }} />}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{n.body || "—"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-gray-500">{n.created_at ? new Date(n.created_at).toLocaleString("en-PK") : "—"}</p>
                    {n.user?.full_name && <p className="text-[10px] text-gray-500">• {n.user.full_name}</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
