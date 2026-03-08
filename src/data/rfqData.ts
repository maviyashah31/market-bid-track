export type RFQStatus = "active" | "closed" | "awarded" | "expired";

export interface RFQImage {
  url: string;
  caption?: string;
}

export interface RFQBid {
  id: string;
  rfqId: string;
  sellerName: string;
  sellerLocation: string;
  sellerVerified: boolean;
  sellerRating: number;
  pricePerUnit: number;
  totalPrice: number;
  deliveryDays: number;
  notes: string;
  submittedAt: string;
  status: "pending" | "accepted" | "rejected";
}

export interface RFQDetail {
  id: string;
  title: string;
  buyer: string;
  buyerLocation: string;
  quantity: number;
  unit: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  daysLeft: number;
  bidsCount: number;
  category: string;
  status: RFQStatus;
  description: string;
  specifications: string[];
  shippingTerms: string;
  paymentTerms: string;
  certifications: string[];
  images: RFQImage[];
  createdAt: string;
}

export const rfqDetails: RFQDetail[] = [
  {
    id: "1",
    title: "Need 10,000 Cotton Polo Shirts",
    buyer: "AcmeCo",
    buyerLocation: "Karachi, Pakistan",
    quantity: 10000,
    unit: "pcs",
    budgetMin: 2500000,
    budgetMax: 3500000,
    deadline: "15 days",
    daysLeft: 15,
    bidsCount: 12,
    category: "Textiles & Garments",
    status: "active",
    description: "We are looking for premium quality cotton polo shirts for our retail chain. The shirts should be made of 100% combed cotton with a minimum GSM of 220. We need assorted colors including white, navy blue, black, and grey. Custom branding with our logo embroidery on the left chest is required.",
    specifications: [
      "100% Combed Cotton, 220+ GSM",
      "Sizes: S, M, L, XL, XXL (equal distribution)",
      "Colors: White, Navy Blue, Black, Grey",
      "Custom logo embroidery on left chest",
      "Ribbed collar and sleeve cuffs",
      "Pre-shrunk and color-fast treated",
    ],
    shippingTerms: "FOB Karachi, buyer arranges freight",
    paymentTerms: "50% advance, 50% upon inspection before dispatch",
    certifications: ["OEKO-TEX Standard 100", "ISO 9001"],
    images: [
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600", caption: "Reference style - cotton polo" },
      { url: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600", caption: "Desired collar style" },
    ],
    createdAt: "2026-03-01",
  },
  {
    id: "2",
    title: "Basmati Rice Export Quality - 50 Tons",
    buyer: "Dubai Foods LLC",
    buyerLocation: "Dubai, UAE",
    quantity: 50000,
    unit: "kg",
    budgetMin: 15000000,
    budgetMax: 20000000,
    deadline: "30 days",
    daysLeft: 30,
    bidsCount: 8,
    category: "Agriculture",
    status: "active",
    description: "Looking for premium Super Kernel Basmati Rice for export to UAE market. Must meet UAE food safety standards. Rice should be well-aged (minimum 1 year), with grain length of 7mm+ after cooking. Packaging must be export-grade with proper labeling.",
    specifications: [
      "Super Kernel Basmati, Grade A",
      "Grain length: 7mm+ after cooking",
      "Moisture content: max 12%",
      "Broken grains: max 2%",
      "Minimum 1-year aged",
      "Export-grade packaging (25kg & 5kg bags)",
    ],
    shippingTerms: "CIF Dubai, seller arranges freight and insurance",
    paymentTerms: "Letter of Credit (L/C) at sight",
    certifications: ["HACCP", "ISO 22000", "Halal Certified"],
    images: [
      { url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600", caption: "Super Kernel Basmati Rice" },
    ],
    createdAt: "2026-02-25",
  },
  {
    id: "3",
    title: "Custom Leather Bags for EU Market",
    buyer: "EuroStyle GmbH",
    buyerLocation: "Berlin, Germany",
    quantity: 2000,
    unit: "pcs",
    budgetMin: 4000000,
    budgetMax: 6000000,
    deadline: "45 days",
    daysLeft: 45,
    bidsCount: 5,
    category: "Leather Products",
    status: "active",
    description: "Seeking high-quality genuine leather handbags and tote bags for the European market. Must comply with EU REACH regulations. We need custom designs based on our provided sketches. Samples must be approved before bulk production begins.",
    specifications: [
      "Full-grain genuine leather",
      "3 designs: Tote, Crossbody, Clutch",
      "Metal hardware: Gold-tone brass",
      "Cotton canvas lining",
      "YKK zippers",
      "Custom dust bags and branded packaging",
    ],
    shippingTerms: "DDP Berlin, seller handles all logistics",
    paymentTerms: "30% advance, 40% after sample approval, 30% before shipment",
    certifications: ["EU REACH Compliance", "ISO 14001"],
    images: [
      { url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600", caption: "Reference leather bag style" },
    ],
    createdAt: "2026-02-20",
  },
  {
    id: "4",
    title: "Surgical Instruments Set - 500 Kits",
    buyer: "MedSupply International",
    buyerLocation: "London, UK",
    quantity: 500,
    unit: "sets",
    budgetMin: 3000000,
    budgetMax: 5000000,
    deadline: "60 days",
    daysLeft: 60,
    bidsCount: 3,
    category: "Surgical Instruments",
    status: "active",
    description: "We need complete surgical instrument kits for distribution to hospitals in the UK. Each kit should contain standard surgical tools. All instruments must be made of German-grade stainless steel and comply with CE marking requirements.",
    specifications: [
      "German-grade stainless steel (AISI 420)",
      "Each kit: 12 instruments (forceps, scissors, retractors, needle holders, etc.)",
      "Mirror-finish polishing",
      "Individual sterilization pouches",
      "CE marked and FDA 510(k) cleared",
      "Instrument tracking laser etching",
    ],
    shippingTerms: "CIF London, temperature-controlled container",
    paymentTerms: "100% Letter of Credit at 30 days",
    certifications: ["CE Marking", "ISO 13485", "FDA 510(k)"],
    images: [
      { url: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600", caption: "Surgical instruments reference" },
    ],
    createdAt: "2026-03-03",
  },
  {
    id: "5",
    title: "Custom Footballs for Tournament - 5000 pcs",
    buyer: "SportZone Middle East",
    buyerLocation: "Riyadh, Saudi Arabia",
    quantity: 5000,
    unit: "pcs",
    budgetMin: 5000000,
    budgetMax: 7500000,
    deadline: "40 days",
    daysLeft: 40,
    bidsCount: 7,
    category: "Sports Goods",
    status: "active",
    description: "Need FIFA-quality match footballs for a regional tournament. Custom printing with tournament branding required. Must include training and match balls in specified ratios.",
    specifications: [
      "FIFA Quality Pro certified",
      "Hand-stitched, 32 panel design",
      "PU outer, latex bladder",
      "Size 5, weight 420-445g",
      "3500 match balls + 1500 training balls",
      "Custom 4-color printing on each ball",
    ],
    shippingTerms: "FOB Sialkot",
    paymentTerms: "40% advance, 60% against B/L",
    certifications: ["FIFA Quality Pro", "Fair Trade"],
    images: [
      { url: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600", caption: "Match quality football reference" },
    ],
    createdAt: "2026-02-28",
  },
];

export const rfqBids: Record<string, RFQBid[]> = {
  "1": [
    { id: "B1", rfqId: "1", sellerName: "Lahore Textile Mills", sellerLocation: "Lahore", sellerVerified: true, sellerRating: 4.8, pricePerUnit: 280, totalPrice: 2800000, deliveryDays: 12, notes: "We specialize in cotton polo shirts. Can provide 220 GSM combed cotton with pre-shrink treatment. OEKO-TEX certified facility.", submittedAt: "2026-03-02", status: "pending" },
    { id: "B2", rfqId: "1", sellerName: "Faisalabad Fabric House", sellerLocation: "Faisalabad", sellerVerified: true, sellerRating: 4.9, pricePerUnit: 310, totalPrice: 3100000, deliveryDays: 10, notes: "Premium quality with faster delivery. Can do custom embroidery in-house. 240 GSM cotton available.", submittedAt: "2026-03-03", status: "pending" },
    { id: "B3", rfqId: "1", sellerName: "Karachi Garments Co.", sellerLocation: "Karachi", sellerVerified: false, sellerRating: 4.2, pricePerUnit: 250, totalPrice: 2500000, deliveryDays: 18, notes: "Competitive pricing. Can meet all specifications. Sample ready in 3 days.", submittedAt: "2026-03-04", status: "pending" },
  ],
  "2": [
    { id: "B4", rfqId: "2", sellerName: "Punjab Agro Exports", sellerLocation: "Gujranwala", sellerVerified: true, sellerRating: 4.9, pricePerUnit: 320, totalPrice: 16000000, deliveryDays: 20, notes: "2-year aged Super Kernel. HACCP & ISO 22000 certified. Regular exporter to UAE. Can arrange CIF Dubai.", submittedAt: "2026-02-27", status: "pending" },
    { id: "B5", rfqId: "2", sellerName: "Sindh Rice Mills", sellerLocation: "Larkana", sellerVerified: true, sellerRating: 4.5, pricePerUnit: 290, totalPrice: 14500000, deliveryDays: 25, notes: "Premium grade with excellent grain length. Halal certified. Export packaging included.", submittedAt: "2026-02-28", status: "pending" },
  ],
  "3": [
    { id: "B6", rfqId: "3", sellerName: "Multan Leather Works", sellerLocation: "Multan", sellerVerified: true, sellerRating: 4.5, pricePerUnit: 2500, totalPrice: 5000000, deliveryDays: 35, notes: "Expert in EU-compliant leather goods. REACH certified facility. Can produce samples within 7 days.", submittedAt: "2026-02-22", status: "pending" },
  ],
  "4": [],
  "5": [
    { id: "B7", rfqId: "5", sellerName: "Sialkot Sports Co.", sellerLocation: "Sialkot", sellerVerified: true, sellerRating: 4.7, pricePerUnit: 1200, totalPrice: 6000000, deliveryDays: 30, notes: "FIFA Quality Pro certified manufacturer. 50+ years experience. Custom printing facility in-house.", submittedAt: "2026-03-01", status: "pending" },
  ],
};
