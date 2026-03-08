// ===== TYPES =====
export type SupplierStatus = "active" | "suspended" | "banned" | "pending";
export type STRNStatus = "registered" | "unregistered";
export type ATLStatus = "filer" | "non-filer";
export type BuyerType = "corporate" | "informal";
export type BuyerStatus = "active" | "suspended" | "banned";
export type OrderStatus = "placed" | "confirmed" | "in_transit" | "delivered" | "disputed" | "completed" | "cancelled";
export type DisputeStatus = "open" | "escalated" | "resolved";
export type NotificationType = "supplier_application" | "dispute_raised" | "strike_warning" | "large_transaction" | "missed_payment" | "low_balance";

export interface Supplier {
  id: string;
  businessName: string;
  ntn: string;
  strnStatus: STRNStatus;
  atlStatus: ATLStatus;
  totalTransactions: number;
  totalVolume: number;
  strikeCount: number;
  status: SupplierStatus;
  category: string;
  city: string;
  contactPerson: string;
  phone: string;
  email: string;
  joinedDate: string;
  lastActive: string;
}

export interface Buyer {
  id: string;
  name: string;
  type: BuyerType;
  totalOrders: number;
  totalSpend: number;
  disputeCount: number;
  creditScore: number | null;
  status: BuyerStatus;
  city: string;
  phone: string;
  email: string;
  joinedDate: string;
  lastOrder: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  supplierId: string;
  supplierName: string;
  product: string;
  category: string;
  quantity: number;
  unit: string;
  basePrice: number;
  sst: number;
  wht: number;
  commission: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: "paid" | "pending" | "released" | "refunded";
  placedDate: string;
  lastUpdate: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  buyerId: string;
  buyerName: string;
  buyerClaim: string;
  supplierId: string;
  supplierName: string;
  supplierResponse: string;
  evidenceFiles: string[];
  status: DisputeStatus;
  raisedDate: string;
  resolvedDate?: string;
  ruling?: "buyer" | "supplier";
  rulingNote?: string;
  amount: number;
}

export interface Payment {
  id: string;
  orderId: string;
  buyerName: string;
  supplierName: string;
  amount: number;
  commission: number;
  sst: number;
  wht: number;
  date: string;
  method: "bank_transfer" | "easypaisa" | "jazzcash" | "cheque";
  type: "incoming" | "outgoing";
}

export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  link: string;
}

// ===== HELPERS =====
const karachiBusinessNames: Record<string, string[]> = {
  "Office Supplies": ["Karachi Stationery Co.", "Al-Noor Paper House", "Metro Office Solutions", "Sindh Stationery Works", "Gulshan Office Mart"],
  "Restaurant Supply": ["Foodtech Karachi", "Pak Kitchen Equip.", "Al-Habib Restaurant Supply", "Chef's Choice Trading", "Saddar Food Mart"],
  "Electrical": ["Electro Hub Pakistan", "Karachi Electric Supply Co.", "Bright Light Traders", "Power Zone Electricals", "Saddar Electric Mart"],
  "Hardware": ["Pak Hardware House", "Karachi Tools & Hardware", "Allied Hardware Traders", "Jinnah Hardware Co.", "Defence Hardware Store"],
  "Steel": ["Pakistan Steel Traders", "Karachi Iron & Steel", "Al-Fatah Steel Corp.", "Sindh Metal Works"],
  "Construction": ["Builders Mart Karachi", "Pak Construction Supply", "City Build Materials", "Foundation Traders"],
  "Raw Materials": ["Sindh Raw Materials Co.", "Pak Chemical Industries", "Korangi Raw Traders"],
};

const categories = Object.keys(karachiBusinessNames);

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: string, end: string) {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return new Date(s + Math.random() * (e - s)).toISOString().split("T")[0];
}

function randomPhone() {
  return `+92 3${randomBetween(0, 4)}${randomBetween(0, 9)} ${randomBetween(1000000, 9999999)}`;
}

function randomNTN() {
  return `${randomBetween(1000000, 9999999)}-${randomBetween(1, 9)}`;
}

// ===== GENERATE SUPPLIERS =====
let supplierId = 1;
export const suppliers: Supplier[] = [];
for (const [cat, names] of Object.entries(karachiBusinessNames)) {
  for (const name of names) {
    const status: SupplierStatus = supplierId <= 3 ? "pending" : ["active", "active", "active", "active", "suspended", "active"][randomBetween(0, 5)] as SupplierStatus;
    suppliers.push({
      id: `SUP-${String(supplierId).padStart(3, "0")}`,
      businessName: name,
      ntn: randomNTN(),
      strnStatus: Math.random() > 0.3 ? "registered" : "unregistered",
      atlStatus: Math.random() > 0.4 ? "filer" : "non-filer",
      totalTransactions: status === "pending" ? 0 : randomBetween(5, 120),
      totalVolume: status === "pending" ? 0 : randomBetween(500000, 15000000),
      strikeCount: randomBetween(0, 3),
      status,
      category: cat,
      city: "Karachi",
      contactPerson: ["Ahmed Khan", "Muhammad Ali", "Faisal Sheikh", "Imran Qureshi", "Bilal Ahmed", "Hassan Raza", "Usman Tariq", "Zubair Malik", "Asad Javed", "Kamran Shah"][randomBetween(0, 9)],
      phone: randomPhone(),
      email: name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 12) + "@gmail.com",
      joinedDate: randomDate("2023-01-01", "2025-12-01"),
      lastActive: randomDate("2025-11-01", "2026-03-08"),
    });
    supplierId++;
  }
}

// ===== GENERATE BUYERS =====
const buyerNames = [
  "ABC Corporation", "Metro Traders", "Pak Enterprise", "Al-Amin Trading", "Sindh Wholesale Co.",
  "Gulshan Retail Group", "Defence Business Hub", "Clifton Imports", "Korangi Industries", "SITE Area Traders",
  "Nazimabad Mart", "North Karachi Supply", "Liaquatabad Trading", "Malir Commerce", "Landhi Business Group",
  "Quaidabad Traders", "Surjani Enterprises", "Orangi Wholesale", "Baldia Traders", "Hub Industrial Co.",
  "Shaheen Corp.", "Eagle Trading Co.", "Falcon Enterprises", "Star Business Group", "Crescent Traders",
  "Moon Industries", "Sun Corp.", "Diamond Trading", "Pearl Enterprises", "Golden Gate Trading",
  "Silver Line Corp.", "Platinum Traders", "Emerald Business", "Ruby Enterprises", "Sapphire Trading Co.",
  "Topaz Industries", "Opal Commerce", "Jade Trading", "Coral Enterprises", "Amber Corp.",
  "Zain Traders", "Hamza Enterprise", "Ayesha Trading", "Fatima Corp.", "Khadija Wholesale",
  "Bilquis Industries", "Noor Commerce", "Huda Trading", "Saba Enterprises", "Maryam Corp."
];

export const buyers: Buyer[] = buyerNames.map((name, i) => ({
  id: `BUY-${String(i + 1).padStart(3, "0")}`,
  name,
  type: Math.random() > 0.4 ? "corporate" : "informal",
  totalOrders: randomBetween(1, 45),
  totalSpend: randomBetween(50000, 8000000),
  disputeCount: randomBetween(0, 4),
  creditScore: Math.random() > 0.5 ? randomBetween(550, 850) : null,
  status: ["active", "active", "active", "active", "suspended"][randomBetween(0, 4)] as BuyerStatus,
  city: "Karachi",
  phone: randomPhone(),
  email: name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 12) + "@business.pk",
  joinedDate: randomDate("2023-06-01", "2026-03-01"),
  lastOrder: randomDate("2025-10-01", "2026-03-08"),
}));

// ===== GENERATE PRODUCTS =====
const productsByCategory: Record<string, string[]> = {
  "Office Supplies": ["A4 Paper Ream 500 Sheets", "Ballpoint Pen Box (50)", "Whiteboard Marker Pack", "Office Chair Ergonomic", "Printer Toner Cartridge", "Desk Organizer Set", "Laminating Pouches 100pc"],
  "Restaurant Supply": ["Commercial Gas Burner", "Stainless Steel Cooking Pot 20L", "Disposable Food Containers (500)", "Chef Knife Set", "Deep Fryer Commercial", "Melamine Plate Set (100)", "Kitchen Exhaust Fan"],
  "Electrical": ["Copper Wire Roll 100m", "LED Panel Light 60W", "MCB Circuit Breaker Box", "PVC Conduit Pipe 25mm", "Industrial Extension Board", "Solar Panel 300W", "Voltage Stabilizer 5KVA"],
  "Hardware": ["Power Drill Machine", "Welding Machine Inverter", "Pipe Wrench Set", "Nuts & Bolts Assortment 1000pc", "Angle Grinder 9inch", "Paint Spray Gun", "Safety Helmet Box (20)"],
  "Steel": ["MS Steel Bar 12mm Bundle", "GI Sheet 24 Gauge", "Steel Pipe 2inch 20ft", "Rebar Tie Wire Roll", "Mild Steel Plate 6mm"],
  "Construction": ["Portland Cement 50kg Bag", "Sand Truck Load", "Crush Stone Truck", "Ceramic Tiles Box (25sqft)", "PVC Water Pipe 4inch"],
  "Raw Materials": ["Caustic Soda 50kg Drum", "Industrial Adhesive 20L", "Cotton Yarn 20s Count Bale", "Polyester Resin 200kg", "Rubber Sheets Roll"],
};

// ===== GENERATE ADMIN PRODUCTS =====
export type ProductStatus = "active" | "delisted" | "flagged" | "pending_review";

export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  supplierId: string;
  supplierName: string;
  price: number;
  moq: number;
  unit: string;
  stock: number;
  status: ProductStatus;
  featured: boolean;
  totalOrders: number;
  totalRevenue: number;
  rating: number;
  reviewCount: number;
  createdDate: string;
  lastUpdated: string;
  image: string;
  commissionRate: number;
}

const productImages = [
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&h=200&fit=crop",
];

export const adminProducts: AdminProduct[] = [];
let productId = 1;
for (const [cat, prods] of Object.entries(productsByCategory)) {
  for (const prodName of prods) {
    const supplier = suppliers.filter(s => s.category === cat && s.status === "active")[0] || suppliers[randomBetween(0, suppliers.length - 1)];
    const status: ProductStatus = randomBetween(1, 10) <= 7 ? "active" : randomBetween(1, 3) === 1 ? "flagged" : randomBetween(1, 2) === 1 ? "delisted" : "pending_review";
    adminProducts.push({
      id: `PROD-${String(productId).padStart(4, "0")}`,
      name: prodName,
      category: cat,
      supplierId: supplier.id,
      supplierName: supplier.businessName,
      price: randomBetween(500, 250000),
      moq: randomBetween(5, 200),
      unit: ["pcs", "kg", "bags", "rolls", "boxes", "meters"][randomBetween(0, 5)],
      stock: randomBetween(0, 5000),
      status,
      featured: Math.random() > 0.8,
      totalOrders: randomBetween(0, 80),
      totalRevenue: randomBetween(50000, 5000000),
      rating: +(Math.random() * 2 + 3).toFixed(1),
      reviewCount: randomBetween(0, 120),
      createdDate: randomDate("2024-01-01", "2026-02-01"),
      lastUpdated: randomDate("2026-01-01", "2026-03-08"),
      image: productImages[randomBetween(0, productImages.length - 1)],
      commissionRate: randomBetween(3, 8),
    });
    productId++;
  }
}

// ===== GENERATE ORDERS =====
const orderStatuses: OrderStatus[] = ["placed", "confirmed", "in_transit", "delivered", "disputed", "completed", "cancelled"];
export const orders: Order[] = [];
for (let i = 1; i <= 100; i++) {
  const cat = categories[randomBetween(0, categories.length - 1)];
  const prods = productsByCategory[cat];
  const product = prods[randomBetween(0, prods.length - 1)];
  const supplier = suppliers.filter(s => s.category === cat && s.status === "active")[0] || suppliers[randomBetween(0, suppliers.length - 1)];
  const buyer = buyers[randomBetween(0, buyers.length - 1)];
  const basePrice = randomBetween(20000, 500000);
  const sst = Math.round(basePrice * 0.13);
  const wht = Math.round(basePrice * (supplier.atlStatus === "filer" ? 0.04 : 0.065));
  const commission = Math.round(basePrice * 0.05);
  const status = i <= 10
    ? (["placed", "confirmed", "in_transit", "delivered", "disputed"] as OrderStatus[])[randomBetween(0, 4)]
    : orderStatuses[randomBetween(0, orderStatuses.length - 1)];

  orders.push({
    id: `ORD-2026-${String(i).padStart(4, "0")}`,
    buyerId: buyer.id,
    buyerName: buyer.name,
    supplierId: supplier.id,
    supplierName: supplier.businessName,
    product,
    category: cat,
    quantity: randomBetween(10, 500),
    unit: ["pcs", "kg", "bags", "rolls", "boxes", "meters"][randomBetween(0, 5)],
    basePrice,
    sst,
    wht,
    commission,
    totalAmount: basePrice + sst,
    status,
    paymentStatus: status === "completed" ? "released" : status === "cancelled" ? "refunded" : status === "disputed" ? "pending" : "paid",
    placedDate: randomDate("2025-11-01", "2026-03-08"),
    lastUpdate: randomDate("2026-02-01", "2026-03-08"),
  });
}

// ===== GENERATE DISPUTES =====
const disputedOrders = orders.filter(o => o.status === "disputed").slice(0, 5);
export const disputes: Dispute[] = [
  {
    id: "DSP-001",
    orderId: disputedOrders[0]?.id || "ORD-2026-0001",
    buyerId: disputedOrders[0]?.buyerId || "BUY-001",
    buyerName: disputedOrders[0]?.buyerName || "ABC Corporation",
    buyerClaim: "Received defective goods — 30% of steel bars were rusted and below specification grade. Requested full replacement but supplier refused.",
    supplierId: disputedOrders[0]?.supplierId || "SUP-001",
    supplierName: disputedOrders[0]?.supplierName || "Pakistan Steel Traders",
    supplierResponse: "Goods were inspected before dispatch. Buyer did not report issue within 24 hours as per policy. Minor surface oxidation is normal for MS bars.",
    evidenceFiles: ["rust_photo_1.jpg", "rust_photo_2.jpg", "delivery_receipt.pdf"],
    status: "open",
    raisedDate: "2026-03-05",
    amount: disputedOrders[0]?.totalAmount || 245000,
  },
  {
    id: "DSP-002",
    orderId: disputedOrders[1]?.id || "ORD-2026-0012",
    buyerId: disputedOrders[1]?.buyerId || "BUY-005",
    buyerName: disputedOrders[1]?.buyerName || "Sindh Wholesale Co.",
    buyerClaim: "Order was 15 days late. We lost a major client contract because of delayed delivery. Demanding full refund and compensation.",
    supplierId: disputedOrders[1]?.supplierId || "SUP-010",
    supplierName: disputedOrders[1]?.supplierName || "Electro Hub Pakistan",
    supplierResponse: "Delay was caused by transport strike in Sindh. Force majeure event. We communicated delay to buyer on day 3.",
    evidenceFiles: ["transport_strike_news.pdf", "whatsapp_screenshot.jpg"],
    status: "escalated",
    raisedDate: "2026-03-02",
    amount: disputedOrders[1]?.totalAmount || 380000,
  },
  {
    id: "DSP-003",
    orderId: disputedOrders[2]?.id || "ORD-2026-0025",
    buyerId: disputedOrders[2]?.buyerId || "BUY-012",
    buyerName: disputedOrders[2]?.buyerName || "Nazimabad Mart",
    buyerClaim: "Wrong product delivered. Ordered 60W LED panels but received 40W panels. Quantity was also 20% short.",
    supplierId: disputedOrders[2]?.supplierId || "SUP-013",
    supplierName: disputedOrders[2]?.supplierName || "Bright Light Traders",
    supplierResponse: "60W model was out of stock. We shipped 40W as temporary replacement and informed buyer. Extra units being arranged.",
    evidenceFiles: ["product_label_photo.jpg", "invoice_comparison.pdf", "delivery_challan.pdf"],
    status: "open",
    raisedDate: "2026-03-06",
    amount: disputedOrders[2]?.totalAmount || 156000,
  },
  {
    id: "DSP-004",
    orderId: disputedOrders[3]?.id || "ORD-2026-0040",
    buyerId: disputedOrders[3]?.buyerId || "BUY-020",
    buyerName: disputedOrders[3]?.buyerName || "Quaidabad Traders",
    buyerClaim: "Cement bags were damaged in transit. 10 out of 50 bags were torn and cement was hardened. Need replacement for damaged bags.",
    supplierId: disputedOrders[3]?.supplierId || "SUP-022",
    supplierName: disputedOrders[3]?.supplierName || "Builders Mart Karachi",
    supplierResponse: "We packed properly. Damage happened during transport by buyer's chosen carrier. Not our responsibility per terms.",
    evidenceFiles: ["damaged_bags.jpg", "packing_photo.jpg"],
    status: "open",
    raisedDate: "2026-03-07",
    amount: disputedOrders[3]?.totalAmount || 87500,
  },
  {
    id: "DSP-005",
    orderId: disputedOrders[4]?.id || "ORD-2026-0055",
    buyerId: disputedOrders[4]?.buyerId || "BUY-030",
    buyerName: disputedOrders[4]?.buyerName || "Golden Gate Trading",
    buyerClaim: "Supplier overcharged. Invoice shows Rs. 450/kg but agreed price was Rs. 380/kg for cotton yarn. Disputing Rs. 70,000 overcharge.",
    supplierId: disputedOrders[4]?.supplierId || "SUP-027",
    supplierName: disputedOrders[4]?.supplierName || "Sindh Raw Materials Co.",
    supplierResponse: "Price was revised on March 1st due to raw material cost increase. Buyer was notified via email. New rate is market standard.",
    evidenceFiles: ["price_agreement_email.pdf", "market_rate_sheet.pdf"],
    status: "resolved",
    raisedDate: "2026-02-25",
    resolvedDate: "2026-03-04",
    ruling: "buyer",
    rulingNote: "Supplier failed to get written acknowledgment of price change from buyer before shipping. Original agreed price applies.",
    amount: disputedOrders[4]?.totalAmount || 70000,
  },
];

// ===== GENERATE PAYMENTS =====
export const payments: Payment[] = [];
const methods: Payment["method"][] = ["bank_transfer", "easypaisa", "jazzcash", "cheque"];
for (let i = 0; i < 80; i++) {
  const order = orders[i];
  payments.push({
    id: `PAY-IN-${String(i + 1).padStart(3, "0")}`,
    orderId: order.id,
    buyerName: order.buyerName,
    supplierName: order.supplierName,
    amount: order.totalAmount,
    commission: order.commission,
    sst: order.sst,
    wht: order.wht,
    date: order.placedDate,
    method: methods[randomBetween(0, 3)],
    type: "incoming",
  });
  if (order.status === "completed") {
    payments.push({
      id: `PAY-OUT-${String(i + 1).padStart(3, "0")}`,
      orderId: order.id,
      buyerName: order.buyerName,
      supplierName: order.supplierName,
      amount: order.basePrice - order.commission,
      commission: order.commission,
      sst: order.sst,
      wht: order.wht,
      date: order.lastUpdate,
      method: "bank_transfer",
      type: "outgoing",
    });
  }
}

// ===== NOTIFICATIONS =====
export const adminNotifications: AdminNotification[] = [
  { id: "N1", type: "supplier_application", title: "New Supplier Application", description: "Karachi Stationery Co. has applied for supplier verification", time: "5 min ago", read: false, link: "/admin/suppliers" },
  { id: "N2", type: "dispute_raised", title: "Dispute Raised", description: "Dispute on ORD-2026-0001 — defective steel bars claim", time: "15 min ago", read: false, link: "/admin/disputes" },
  { id: "N3", type: "strike_warning", title: "Strike Warning", description: "Bright Light Traders has reached 2 strikes — at risk of ban", time: "1 hr ago", read: false, link: "/admin/suppliers" },
  { id: "N4", type: "large_transaction", title: "Large Transaction", description: "Transaction of Rs. 487,000 placed by Defence Business Hub", time: "2 hrs ago", read: false, link: "/admin/orders" },
  { id: "N5", type: "missed_payment", title: "Missed Credit Payment", description: "Gulshan Retail Group missed 30-day credit payment of Rs. 125,000", time: "3 hrs ago", read: true, link: "/admin/buyers" },
  { id: "N6", type: "low_balance", title: "Low Settlement Balance", description: "Settlement account balance dropped below Rs. 100,000", time: "5 hrs ago", read: true, link: "/admin/settlement" },
  { id: "N7", type: "supplier_application", title: "New Supplier Application", description: "Al-Noor Paper House awaiting approval", time: "6 hrs ago", read: true, link: "/admin/suppliers" },
  { id: "N8", type: "dispute_raised", title: "Dispute Raised", description: "Nazimabad Mart disputes wrong product delivery on ORD-2026-0025", time: "8 hrs ago", read: true, link: "/admin/disputes" },
  { id: "N9", type: "supplier_application", title: "New Supplier Application", description: "Metro Office Solutions submitted application with documents", time: "12 hrs ago", read: true, link: "/admin/suppliers" },
  { id: "N10", type: "large_transaction", title: "Large Transaction", description: "Transaction of Rs. 512,000 placed by Star Business Group", time: "1 day ago", read: true, link: "/admin/orders" },
];

// ===== COMPUTED METRICS =====
const today = "2026-03-08";
const todayOrders = orders.filter(o => o.placedDate === today || o.placedDate >= "2026-03-07");
const thisMonthOrders = orders.filter(o => o.placedDate >= "2026-03-01");
const activeOrders = orders.filter(o => ["placed", "confirmed", "in_transit"].includes(o.status));
const openDisputes = disputes.filter(d => d.status !== "resolved");
const pendingSuppliers = suppliers.filter(s => s.status === "pending");
const todayBuyers = buyers.filter(b => b.joinedDate >= "2026-03-07");

const totalGMVToday = todayOrders.reduce((s, o) => s + o.totalAmount, 0);
const totalGMVMonth = thisMonthOrders.reduce((s, o) => s + o.totalAmount, 0);
const commissionToday = todayOrders.reduce((s, o) => s + o.commission, 0);
const commissionMonth = thisMonthOrders.reduce((s, o) => s + o.commission, 0);
const settlementBalance = payments.filter(p => p.type === "incoming").reduce((s, p) => s + p.amount, 0) - payments.filter(p => p.type === "outgoing").reduce((s, p) => s + p.amount, 0);
const buyersWithMultipleOrders = buyers.filter(b => b.totalOrders > 1).length;
const repeatBuyerRate = Math.round((buyersWithMultipleOrders / buyers.length) * 100);

export const dashboardMetrics = {
  totalGMVToday,
  totalGMVMonth,
  commissionToday,
  commissionMonth,
  settlementBalance,
  activeOrders: activeOrders.length,
  openDisputes: openDisputes.length,
  pendingSupplierApps: pendingSuppliers.length,
  newBuyerSignups: todayBuyers.length > 0 ? todayBuyers.length : 7,
  repeatBuyerRate,
};

// ===== CHART DATA =====
export const gmvChartData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date("2026-02-07");
  date.setDate(date.getDate() + i);
  const label = `${date.getMonth() + 1}/${date.getDate()}`;
  return {
    date: label,
    gmv: randomBetween(800000, 3500000),
    commission: randomBetween(40000, 175000),
  };
});

export const categoryTransactions = categories.map(cat => ({
  category: cat.length > 12 ? cat.slice(0, 12) + "…" : cat,
  fullCategory: cat,
  transactions: orders.filter(o => o.category === cat).length || randomBetween(5, 25),
}));

export const topSuppliersByVolume = [...suppliers]
  .filter(s => s.status === "active")
  .sort((a, b) => b.totalVolume - a.totalVolume)
  .slice(0, 10);

export const topBuyersBySpend = [...buyers]
  .sort((a, b) => b.totalSpend - a.totalSpend)
  .slice(0, 10);

export const disputeRateData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date("2026-02-07");
  date.setDate(date.getDate() + i);
  return {
    date: `${date.getMonth() + 1}/${date.getDate()}`,
    rate: +(Math.random() * 5 + 1).toFixed(1),
  };
});

export const avgOrderValueData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date("2026-02-07");
  date.setDate(date.getDate() + i);
  return {
    date: `${date.getMonth() + 1}/${date.getDate()}`,
    value: randomBetween(80000, 250000),
  };
});

export const repeatBuyerTrend = Array.from({ length: 12 }, (_, i) => ({
  month: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"][i],
  rate: randomBetween(35, 72),
}));

// Tax summaries
export const taxSummary = {
  sstOwed: thisMonthOrders.reduce((s, o) => s + o.sst, 0),
  whtCollected: thisMonthOrders.reduce((s, o) => s + o.wht, 0),
};
