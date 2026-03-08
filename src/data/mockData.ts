export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  moq: number;
  unit: string;
  sellerName: string;
  sellerVerified: boolean;
  sellerRating: number;
  sellerLocation: string;
  responseTime: string;
  ordersCompleted: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
}

export const categories: Category[] = [
  { id: "1", name: "Textiles & Garments", icon: "👕", productCount: 15420 },
  { id: "2", name: "Electronics", icon: "📱", productCount: 8930 },
  { id: "3", name: "Agriculture", icon: "🌾", productCount: 6780 },
  { id: "4", name: "Machinery", icon: "⚙️", productCount: 4520 },
  { id: "5", name: "Chemicals", icon: "🧪", productCount: 3100 },
  { id: "6", name: "Sports Goods", icon: "⚽", productCount: 7650 },
  { id: "7", name: "Surgical Instruments", icon: "🏥", productCount: 5430 },
  { id: "8", name: "Leather Products", icon: "👜", productCount: 4890 },
  { id: "9", name: "Food & Beverages", icon: "🍚", productCount: 9120 },
  { id: "10", name: "Construction", icon: "🏗️", productCount: 3450 },
  { id: "11", name: "Auto Parts", icon: "🚗", productCount: 6230 },
  { id: "12", name: "Packaging", icon: "📦", productCount: 2890 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Cotton T-Shirts - Bulk Order",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    category: "Textiles & Garments",
    minPrice: 180,
    maxPrice: 350,
    moq: 500,
    unit: "pieces",
    sellerName: "Lahore Textile Mills",
    sellerVerified: true,
    sellerRating: 4.8,
    sellerLocation: "Lahore",
    responseTime: "< 2 hours",
    ordersCompleted: 1250,
  },
  {
    id: "2",
    name: "Basmati Rice - Super Kernel Grade A",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    category: "Agriculture",
    minPrice: 220,
    maxPrice: 320,
    moq: 1000,
    unit: "kg",
    sellerName: "Punjab Agro Exports",
    sellerVerified: true,
    sellerRating: 4.9,
    sellerLocation: "Gujranwala",
    responseTime: "< 1 hour",
    ordersCompleted: 3420,
  },
  {
    id: "3",
    name: "Leather Football - Match Quality",
    image: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400",
    category: "Sports Goods",
    minPrice: 450,
    maxPrice: 850,
    moq: 200,
    unit: "pieces",
    sellerName: "Sialkot Sports Co.",
    sellerVerified: true,
    sellerRating: 4.7,
    sellerLocation: "Sialkot",
    responseTime: "< 3 hours",
    ordersCompleted: 890,
  },
  {
    id: "4",
    name: "Surgical Forceps - Stainless Steel",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400",
    category: "Surgical Instruments",
    minPrice: 320,
    maxPrice: 580,
    moq: 100,
    unit: "pieces",
    sellerName: "MedTech Pakistan",
    sellerVerified: true,
    sellerRating: 4.6,
    sellerLocation: "Sialkot",
    responseTime: "< 4 hours",
    ordersCompleted: 670,
  },
  {
    id: "5",
    name: "LED Bulb 12W - Energy Saver Pack",
    image: "https://images.unsplash.com/photo-1532007095399-2d34aa78fd5d?w=400",
    category: "Electronics",
    minPrice: 45,
    maxPrice: 95,
    moq: 1000,
    unit: "pieces",
    sellerName: "Karachi Electronics Hub",
    sellerVerified: false,
    sellerRating: 4.3,
    sellerLocation: "Karachi",
    responseTime: "< 6 hours",
    ordersCompleted: 340,
  },
  {
    id: "6",
    name: "Genuine Leather Wallet - Premium",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400",
    category: "Leather Products",
    minPrice: 650,
    maxPrice: 1200,
    moq: 50,
    unit: "pieces",
    sellerName: "Multan Leather Works",
    sellerVerified: true,
    sellerRating: 4.5,
    sellerLocation: "Multan",
    responseTime: "< 2 hours",
    ordersCompleted: 520,
  },
  {
    id: "7",
    name: "Cement - OPC 53 Grade - Bulk",
    image: "https://images.unsplash.com/photo-1590937055906-edef523bc2d7?w=400",
    category: "Construction",
    minPrice: 750,
    maxPrice: 900,
    moq: 500,
    unit: "bags",
    sellerName: "DG Khan Cement",
    sellerVerified: true,
    sellerRating: 4.8,
    sellerLocation: "DG Khan",
    responseTime: "< 1 hour",
    ordersCompleted: 2100,
  },
  {
    id: "8",
    name: "Embroidered Lawn Fabric - Unstitched",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400",
    category: "Textiles & Garments",
    minPrice: 800,
    maxPrice: 2500,
    moq: 100,
    unit: "suits",
    sellerName: "Faisalabad Fabric House",
    sellerVerified: true,
    sellerRating: 4.9,
    sellerLocation: "Faisalabad",
    responseTime: "< 2 hours",
    ordersCompleted: 4560,
  },
];

export interface RFQ {
  id: string;
  title: string;
  buyer: string;
  quantity: number;
  unit: string;
  budget: string;
  deadline: string;
  bidsCount: number;
  category: string;
}

export const rfqs: RFQ[] = [
  { id: "1", title: "Need 10,000 Cotton Polo Shirts", buyer: "AcmeCo", quantity: 10000, unit: "pcs", budget: "PKR 2.5M - 3.5M", deadline: "15 days", bidsCount: 12, category: "Textiles" },
  { id: "2", title: "Basmati Rice Export Quality - 50 Tons", buyer: "Dubai Foods LLC", quantity: 50000, unit: "kg", budget: "PKR 15M+", deadline: "30 days", bidsCount: 8, category: "Agriculture" },
  { id: "3", title: "Custom Leather Bags for EU Market", buyer: "EuroStyle GmbH", quantity: 2000, unit: "pcs", budget: "PKR 4M - 6M", deadline: "45 days", bidsCount: 5, category: "Leather" },
];

export interface Order {
  id: string;
  productName: string;
  status: "placed" | "confirmed" | "processing" | "packed" | "shipped" | "in_transit" | "delivered" | "completed";
  total: number;
  date: string;
  sellerName: string;
  quantity: number;
}

export const buyerOrders: Order[] = [
  { id: "ORD-2024-001", productName: "Premium Cotton T-Shirts", status: "in_transit", total: 175000, date: "2026-03-01", sellerName: "Lahore Textile Mills", quantity: 500 },
  { id: "ORD-2024-002", productName: "Basmati Rice Super Kernel", status: "delivered", total: 320000, date: "2026-02-20", sellerName: "Punjab Agro Exports", quantity: 1000 },
  { id: "ORD-2024-003", productName: "Leather Footballs", status: "processing", total: 170000, date: "2026-03-05", sellerName: "Sialkot Sports Co.", quantity: 200 },
];

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

export interface ChatConversation {
  id: string;
  contactName: string;
  contactAvatar?: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
}

export const chatConversations: ChatConversation[] = [
  { id: "1", contactName: "Lahore Textile Mills", lastMessage: "We can offer 15% discount on bulk orders above 1000 pcs", lastTime: "2 min ago", unread: 2, online: true },
  { id: "2", contactName: "Punjab Agro Exports", lastMessage: "The shipment will be dispatched on Monday", lastTime: "1 hr ago", unread: 0, online: true },
  { id: "3", contactName: "Sialkot Sports Co.", lastMessage: "Please share the custom logo file", lastTime: "3 hrs ago", unread: 1, online: false },
  { id: "4", contactName: "MedTech Pakistan", lastMessage: "Certificate of quality has been attached", lastTime: "Yesterday", unread: 0, online: false },
  { id: "5", contactName: "Faisalabad Fabric House", lastMessage: "New collection samples are ready for review", lastTime: "2 days ago", unread: 0, online: true },
];

export const chatMessages: Record<string, ChatMessage[]> = {
  "1": [
    { id: "m1", senderId: "seller1", senderName: "Lahore Textile Mills", content: "Assalam o Alaikum! Thank you for your interest in our cotton T-shirts.", timestamp: "10:30 AM", isOwn: false },
    { id: "m2", senderId: "buyer1", senderName: "You", content: "Walaikum Assalam! I need 2000 pieces of premium cotton T-shirts. What's your best price?", timestamp: "10:32 AM", isOwn: true },
    { id: "m3", senderId: "seller1", senderName: "Lahore Textile Mills", content: "For 2000 pieces, we can offer PKR 200/piece. Quality is 100% combed cotton, 180 GSM.", timestamp: "10:35 AM", isOwn: false },
    { id: "m4", senderId: "buyer1", senderName: "You", content: "Can you do PKR 180/piece? I'm looking for a long-term supplier.", timestamp: "10:38 AM", isOwn: true },
    { id: "m5", senderId: "seller1", senderName: "Lahore Textile Mills", content: "We can offer 15% discount on bulk orders above 1000 pcs", timestamp: "10:40 AM", isOwn: false },
  ],
  "2": [
    { id: "m6", senderId: "seller2", senderName: "Punjab Agro Exports", content: "Your order ORD-2024-002 has been packed and is ready for dispatch.", timestamp: "9:00 AM", isOwn: false },
    { id: "m7", senderId: "buyer1", senderName: "You", content: "Great! When will it be shipped?", timestamp: "9:15 AM", isOwn: true },
    { id: "m8", senderId: "seller2", senderName: "Punjab Agro Exports", content: "The shipment will be dispatched on Monday", timestamp: "9:20 AM", isOwn: false },
  ],
  "3": [
    { id: "m9", senderId: "seller3", senderName: "Sialkot Sports Co.", content: "We've started production on your custom football order.", timestamp: "Yesterday 3:00 PM", isOwn: false },
    { id: "m10", senderId: "buyer1", senderName: "You", content: "Excellent! I'll send the logo files shortly.", timestamp: "Yesterday 3:30 PM", isOwn: true },
    { id: "m11", senderId: "seller3", senderName: "Sialkot Sports Co.", content: "Please share the custom logo file", timestamp: "Yesterday 4:00 PM", isOwn: false },
  ],
};

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller";
  status: "active" | "suspended" | "pending";
  joinDate: string;
  orders: number;
}

export const adminUsers: AdminUser[] = [
  { id: "1", name: "Muhammad Ahmed", email: "ahmed@company.com", role: "buyer", status: "active", joinDate: "2025-11-01", orders: 15 },
  { id: "2", name: "Lahore Textile Mills", email: "info@ltm.pk", role: "seller", status: "active", joinDate: "2025-08-15", orders: 156 },
  { id: "3", name: "Ali Hassan", email: "ali@gmail.com", role: "buyer", status: "pending", joinDate: "2026-03-01", orders: 0 },
  { id: "4", name: "Karachi Electronics Hub", email: "sales@keh.pk", role: "seller", status: "suspended", joinDate: "2025-10-20", orders: 34 },
  { id: "5", name: "Sara Khan", email: "sara@business.com", role: "buyer", status: "active", joinDate: "2025-12-10", orders: 8 },
  { id: "6", name: "Faisalabad Fabric House", email: "contact@ffh.pk", role: "seller", status: "active", joinDate: "2025-06-05", orders: 423 },
];

export const adminProducts: { id: string; name: string; seller: string; category: string; status: "active" | "pending" | "rejected"; price: string; date: string }[] = [
  { id: "P001", name: "Premium Cotton T-Shirts", seller: "Lahore Textile Mills", category: "Textiles", status: "active", price: "PKR 180-350", date: "2026-02-15" },
  { id: "P002", name: "Counterfeit Brand Shoes", seller: "Unknown Seller", category: "Footwear", status: "rejected", price: "PKR 500-800", date: "2026-03-05" },
  { id: "P003", name: "Organic Honey 500g", seller: "KPK Organics", category: "Food", status: "pending", price: "PKR 1200-1800", date: "2026-03-07" },
  { id: "P004", name: "Basmati Rice Grade A", seller: "Punjab Agro Exports", category: "Agriculture", status: "active", price: "PKR 220-320", date: "2026-01-20" },
  { id: "P005", name: "Surgical Mask N95", seller: "MedTech Pakistan", category: "Medical", status: "pending", price: "PKR 15-35", date: "2026-03-06" },
];