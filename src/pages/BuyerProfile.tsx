import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedPage from "@/components/AnimatedPage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BadgeCheck, Star, MapPin, Calendar, Clock, MessageSquare, ShoppingCart,
  Building2, Globe, TrendingUp, Package, CreditCard
} from "lucide-react";

const buyerProfiles: Record<string, {
  id: string; name: string; type: string; tagline: string; description: string;
  avatar: string; coverImage: string; location: string; memberSince: string;
  verified: boolean; totalOrders: number; totalSpend: string; avgOrderValue: string;
  repeatPurchaseRate: number; industries: string[]; paymentMethods: string[];
}> = {
  "acmeco": {
    id: "acmeco", name: "AcmeCo", type: "Corporate", tagline: "Leading Retail Chain in Pakistan",
    description: "AcmeCo is one of Pakistan's fastest growing retail chains with 45+ stores across major cities. We source bulk quantities of textiles, FMCG products, and consumer electronics for our retail operations. We prioritize quality, timely delivery, and long-term supplier relationships.",
    avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200",
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
    location: "Karachi, Pakistan", memberSince: "Nov 2025", verified: true,
    totalOrders: 156, totalSpend: "PKR 45.2M", avgOrderValue: "PKR 290K",
    repeatPurchaseRate: 85, industries: ["Retail", "Textiles", "FMCG"],
    paymentMethods: ["Bank Transfer", "L/C", "Escrow"],
  },
  "dubai-foods": {
    id: "dubai-foods", name: "Dubai Foods LLC", type: "Corporate", tagline: "Premium Food Importer for Gulf Markets",
    description: "Dubai Foods LLC is a major food importer and distributor serving the UAE and wider Gulf region. We specialize in importing premium Pakistani agricultural products including Basmati Rice, spices, and dried fruits. We maintain the highest food safety standards and have been operating since 2010.",
    avatar: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200",
    coverImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200",
    location: "Dubai, UAE", memberSince: "Jan 2026", verified: true,
    totalOrders: 42, totalSpend: "PKR 120M", avgOrderValue: "PKR 2.86M",
    repeatPurchaseRate: 92, industries: ["Food & Beverages", "Agriculture", "Import/Export"],
    paymentMethods: ["Letter of Credit", "Bank Transfer"],
  },
  "eurostyle": {
    id: "eurostyle", name: "EuroStyle GmbH", type: "Corporate", tagline: "Fashion Accessories Brand from Europe",
    description: "EuroStyle GmbH is a Berlin-based fashion accessories company specializing in premium leather goods for the European market. We partner with artisan manufacturers in Pakistan to create unique, high-quality leather products that meet EU standards.",
    avatar: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=200",
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200",
    location: "Berlin, Germany", memberSince: "Feb 2026", verified: true,
    totalOrders: 18, totalSpend: "PKR 28M", avgOrderValue: "PKR 1.56M",
    repeatPurchaseRate: 67, industries: ["Fashion", "Leather Products", "Accessories"],
    paymentMethods: ["Wire Transfer", "Escrow"],
  },
};

const recentPurchases = [
  { id: "ORD-001", product: "Premium Cotton T-Shirts x10,000", seller: "Lahore Textile Mills", amount: "PKR 2,800,000", date: "2026-03-01", status: "delivered" },
  { id: "ORD-002", product: "Polo Shirts x5,000", seller: "Faisalabad Fabric House", amount: "PKR 1,550,000", date: "2026-02-20", status: "delivered" },
  { id: "ORD-003", product: "Cotton Fabric 2000m", seller: "Lahore Textile Mills", amount: "PKR 900,000", date: "2026-02-10", status: "completed" },
];

const reviews = [
  { id: "1", seller: "Lahore Textile Mills", rating: 5, comment: "Great buyer - clear requirements, prompt payment, professional communication throughout.", date: "2026-03-05" },
  { id: "2", seller: "Punjab Agro Exports", rating: 5, comment: "Always pays on time and provides excellent specifications. A pleasure to work with.", date: "2026-02-22" },
  { id: "3", seller: "Faisalabad Fabric House", rating: 4, comment: "Good buyer. Sometimes requests last-minute changes but always accommodating on pricing.", date: "2026-02-10" },
];

const statusColors: Record<string, string> = {
  delivered: "bg-success/10 text-success",
  completed: "bg-primary/10 text-primary",
  in_transit: "bg-warning/10 text-warning",
};

const BuyerProfile = () => {
  const { buyerId } = useParams();
  const profile = buyerProfiles[buyerId || ""] || buyerProfiles["acmeco"];

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Cover Image */}
        <div className="relative h-48 sm:h-64 md:h-72 overflow-hidden">
          <img src={profile.coverImage} alt={profile.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
        </div>

        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="relative -mt-16 sm:-mt-20 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-background overflow-hidden shadow-lg bg-card">
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 pt-0 sm:pt-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground">{profile.name}</h1>
                  {profile.verified && <BadgeCheck className="h-6 w-6 text-primary" />}
                  <Badge variant="secondary" className="font-body">{profile.type}</Badge>
                </div>
                <p className="text-muted-foreground font-body mb-3">{profile.tagline}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-body">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {profile.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Member since {profile.memberSince}</span>
                  <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {profile.industries[0]}</span>
                </div>
              </div>
              <div className="flex gap-2 sm:pt-4">
                <Link to="/messages">
                  <Button className="gap-2 bg-gradient-hero text-primary-foreground hover:opacity-90 font-body">
                    <MessageSquare className="h-4 w-4" /> Contact
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[
              { icon: ShoppingCart, label: "Total Orders", value: profile.totalOrders.toString(), sub: "All time" },
              { icon: CreditCard, label: "Total Spend", value: profile.totalSpend, sub: "Lifetime" },
              { icon: Package, label: "Avg Order", value: profile.avgOrderValue, sub: "Per order" },
              { icon: TrendingUp, label: "Repeat Rate", value: `${profile.repeatPurchaseRate}%`, sub: "Re-order rate" },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="bg-card rounded-xl border border-border p-4 text-center">
                <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="font-display font-bold text-lg sm:text-xl text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground font-body">{sub}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="about" className="mb-12">
            <TabsList className="bg-card border border-border w-full sm:w-auto">
              <TabsTrigger value="about" className="font-display">About</TabsTrigger>
              <TabsTrigger value="purchases" className="font-display">Purchases</TabsTrigger>
              <TabsTrigger value="reviews" className="font-display">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6 space-y-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display font-bold text-lg text-foreground mb-3">About</h2>
                <p className="text-muted-foreground font-body leading-relaxed">{profile.description}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" /> Industries
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.industries.map((ind) => (
                      <Badge key={ind} variant="secondary" className="font-body">{ind}</Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" /> Payment Methods
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.paymentMethods.map((pm) => (
                      <Badge key={pm} variant="outline" className="font-body">{pm}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="purchases" className="mt-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="font-display font-bold text-lg text-foreground mb-4">Recent Purchases</h2>
                <div className="space-y-4">
                  {recentPurchases.map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/30 transition">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-display font-bold text-sm text-foreground">{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>
                            {order.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="font-body text-sm text-foreground">{order.product}</p>
                        <p className="text-xs text-muted-foreground font-body">{order.seller}</p>
                      </div>
                      <div className="mt-2 sm:mt-0 text-right">
                        <div className="font-display font-bold text-foreground">{order.amount}</div>
                        <div className="text-xs text-muted-foreground font-body">{order.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground font-body">Reviews from sellers who have worked with {profile.name}</p>
                {reviews.map((review) => (
                  <div key={review.id} className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-display font-bold text-primary text-sm">{review.seller.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-display font-semibold text-foreground text-sm">{review.seller}</p>
                          <p className="text-xs text-muted-foreground font-body">Seller</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-body">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? "fill-warning text-warning" : "text-border"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground font-body">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Footer />
      </div>
    </AnimatedPage>
  );
};

export default BuyerProfile;
