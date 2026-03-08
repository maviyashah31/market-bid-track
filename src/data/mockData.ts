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
