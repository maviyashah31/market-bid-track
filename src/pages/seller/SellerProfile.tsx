import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedPage from "@/components/AnimatedPage";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { toProductCardData } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BadgeCheck, Star, MapPin, Clock, MessageSquare, Shield, Package,
  Calendar, TrendingUp, ThumbsUp, Award, Globe, ArrowLeft
} from "lucide-react";

const sellerProfiles: Record<string, {
  id: string; name: string; tagline: string; description: string; avatar: string;
  coverImage: string; location: string; memberSince: string; verified: boolean;
  rating: number; reviewCount: number; responseTime: string; ordersCompleted: number;
  onTimeDelivery: number; repeatClients: number; languages: string[];
  certifications: string[]; categories: string[];
}> = {
  "lahore-textile-mills": {
    id: "lahore-textile-mills", name: "Lahore Textile Mills", tagline: "Premium Textile Manufacturer Since 1995",
    description: "We are one of Pakistan's leading textile manufacturers with over 28 years of experience in producing premium quality cotton garments, fabrics, and custom textile solutions. Our state-of-the-art facility in Lahore spans 50,000 sq ft with a capacity of 100,000 pieces per month. We serve clients across 15+ countries including USA, UK, UAE, and Germany.",
    avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200",
    coverImage: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200",
    location: "Lahore, Pakistan", memberSince: "Aug 2025", verified: true,
    rating: 4.8, reviewCount: 342, responseTime: "< 2 hours", ordersCompleted: 1250,
    onTimeDelivery: 96, repeatClients: 78, languages: ["English", "Urdu", "Punjabi"],
    certifications: ["OEKO-TEX Standard 100", "ISO 9001:2015", "GOTS Certified"],
    categories: ["Textiles & Garments", "Cotton Fabrics", "Custom Embroidery"],
  },
  "punjab-agro-exports": {
    id: "punjab-agro-exports", name: "Punjab Agro Exports", tagline: "Premium Agricultural Products Exporter",
    description: "Punjab Agro Exports is a certified exporter of premium Pakistani agricultural products, specializing in Basmati Rice, wheat, and seasonal produce. We work directly with farmers across Punjab to ensure the highest quality standards. Our products are exported to 20+ countries with complete HACCP compliance.",
    avatar: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200",
    coverImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200",
    location: "Gujranwala, Pakistan", memberSince: "Jun 2025", verified: true,
    rating: 4.9, reviewCount: 567, responseTime: "< 1 hour", ordersCompleted: 3420,
    onTimeDelivery: 98, repeatClients: 85, languages: ["English", "Urdu"],
    certifications: ["HACCP", "ISO 22000", "Halal Certified", "Fair Trade"],
    categories: ["Agriculture", "Rice", "Grains"],
  },
  "sialkot-sports": {
    id: "sialkot-sports", name: "Sialkot Sports Co.", tagline: "FIFA Certified Sports Goods Manufacturer",
    description: "With over 50 years in the sports goods industry, Sialkot Sports Co. is a FIFA Quality Pro certified manufacturer of match-grade footballs, cricket equipment, and sports accessories. Based in Sialkot, the sports capital of Pakistan, we combine traditional craftsmanship with modern technology.",
    avatar: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=200",
    coverImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200",
    location: "Sialkot, Pakistan", memberSince: "Sep 2025", verified: true,
    rating: 4.7, reviewCount: 198, responseTime: "< 3 hours", ordersCompleted: 890,
    onTimeDelivery: 94, repeatClients: 72, languages: ["English", "Urdu"],
    certifications: ["FIFA Quality Pro", "ISO 9001", "Fair Trade"],
    categories: ["Sports Goods", "Footballs", "Cricket Equipment"],
  },
};

const reviews = [
  { id: "1", buyer: "Muhammad Ahmed", rating: 5, comment: "Excellent quality cotton T-shirts. Fabric is top-notch and stitching is perfect. Will definitely order again!", date: "2026-03-02", product: "Premium Cotton T-Shirts" },
  { id: "2", buyer: "Sara Khan", rating: 4, comment: "Good quality but delivery was 2 days late. Product quality made up for it though.", date: "2026-02-28", product: "Polo Shirts Bulk" },
  { id: "3", buyer: "Ali Hassan", rating: 5, comment: "Outstanding service! They even accommodated last minute changes to our order. Highly recommended.", date: "2026-02-20", product: "Custom Embroidered Fabric" },
  { id: "4", buyer: "Dubai Foods LLC", rating: 5, comment: "Premium quality as promised. Packaging was perfect for export.", date: "2026-02-15", product: "Denim Fabric Roll" },
  { id: "5", buyer: "EuroStyle GmbH", rating: 4, comment: "Good communication throughout. Product matched the samples provided.", date: "2026-01-30", product: "Cotton Jersey Fabric" },
];

const SellerProfile = () => {
  const { sellerId } = useParams();
  const profile = sellerProfiles[sellerId || ""] || sellerProfiles["lahore-textile-mills"];
  const { data: realProducts = [] } = useProducts({ limit: 6 });
  const sellerProducts = realProducts.map(toProductCardData);

  const ratingBreakdown = [
    { stars: 5, percent: 78 },
    { stars: 4, percent: 15 },
    { stars: 3, percent: 5 },
    { stars: 2, percent: 1 },
    { stars: 1, percent: 1 },
  ];

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
                </div>
                <p className="text-muted-foreground font-body mb-3">{profile.tagline}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-body">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {profile.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Member since {profile.memberSince}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Responds {profile.responseTime}</span>
                  <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> {profile.languages.join(", ")}</span>
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
              { icon: Star, label: "Rating", value: `${profile.rating}/5`, sub: `${profile.reviewCount} reviews` },
              { icon: Package, label: "Orders Completed", value: profile.ordersCompleted.toLocaleString(), sub: "Total orders" },
              { icon: TrendingUp, label: "On-time Delivery", value: `${profile.onTimeDelivery}%`, sub: "Delivery rate" },
              { icon: ThumbsUp, label: "Repeat Clients", value: `${profile.repeatClients}%`, sub: "Return buyers" },
            ].map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="bg-card rounded-xl border border-border p-4 text-center">
                <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <div className="font-display font-bold text-xl text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground font-body">{sub}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="about" className="mb-12">
            <TabsList className="bg-card border border-border w-full sm:w-auto">
              <TabsTrigger value="about" className="font-display">About</TabsTrigger>
              <TabsTrigger value="products" className="font-display">Products</TabsTrigger>
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
                    <Award className="h-5 w-5 text-primary" /> Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.certifications.map((cert) => (
                      <Badge key={cert} variant="secondary" className="font-body">{cert}</Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" /> Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.categories.map((cat) => (
                      <Badge key={cat} variant="outline" className="font-body">{cat}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="products" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sellerProducts.length > 0 ? sellerProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                )) : (
                  <p className="text-muted-foreground font-body col-span-3 text-center py-12">No products listed yet.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 space-y-6">
              {/* Rating Summary */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="text-center sm:text-left">
                    <div className="font-display font-bold text-5xl text-foreground">{profile.rating}</div>
                    <div className="flex items-center gap-1 justify-center sm:justify-start mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-4 w-4 ${s <= Math.round(profile.rating) ? "fill-warning text-warning" : "text-border"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground font-body mt-1">{profile.reviewCount} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {ratingBreakdown.map(({ stars, percent }) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-body w-12">{stars} stars</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-warning rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground font-body w-8">{percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-display font-bold text-primary text-sm">{review.buyer.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-display font-semibold text-foreground text-sm">{review.buyer}</p>
                          <p className="text-xs text-muted-foreground font-body">{review.product}</p>
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

export default SellerProfile;
