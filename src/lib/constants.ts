// Shared order status colors (Tailwind classes for buyer/seller pages)
export const orderStatusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  placed: "bg-muted text-muted-foreground",
  confirmed: "bg-verified/10 text-verified",
  processing: "bg-verified/10 text-verified",
  packed: "bg-accent text-accent-foreground",
  shipped: "bg-primary/10 text-primary",
  in_transit: "bg-primary/10 text-primary",
  delivered: "bg-success/10 text-success",
  completed: "bg-success/10 text-success",
};

// Dispute status colors
export const disputeStatusColors: Record<string, string> = {
  open: "bg-warning/10 text-warning",
  negotiating: "bg-primary/10 text-primary",
  escalated: "bg-destructive/10 text-destructive",
  resolved: "bg-success/10 text-success",
  closed: "bg-muted text-muted-foreground",
};

// RFQ status colors
export const rfqStatusColors: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  closed: "bg-muted text-muted-foreground border-border",
  awarded: "bg-primary/10 text-primary border-primary/20",
  expired: "bg-destructive/10 text-destructive border-destructive/20",
};

// Admin status colors (hex values for admin pages)
export const adminOrderStatusColors: Record<string, string> = {
  placed: "#74b9ff",
  confirmed: "#00b894",
  in_transit: "#fdcb6e",
  delivered: "#00b894",
  disputed: "#d63031",
  completed: "#00b894",
  cancelled: "#636e72",
};

export const adminUserStatusColors: Record<string, string> = {
  active: "#00b894",
  suspended: "#fdcb6e",
  banned: "#d63031",
  pending: "#74b9ff",
};

export const adminDisputeStatusColors: Record<string, string> = {
  open: "#fdcb6e",
  escalated: "#d63031",
  resolved: "#00b894",
};
