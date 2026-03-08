import { Shield, BadgeCheck, TrendingUp, Globe, Star, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const trustBadges = [
  { icon: Shield, label: "Escrow Protection", desc: "Every transaction is protected with escrow payments" },
  { icon: BadgeCheck, label: "Verified Sellers", desc: "All suppliers go through rigorous verification" },
  { icon: TrendingUp, label: "PKR 2.5B+ GMV", desc: "Trusted by thousands of businesses across Pakistan" },
  { icon: Globe, label: "15+ Countries", desc: "Serving buyers and sellers worldwide" },
];

const testimonials = [
  {
    name: "Muhammad Ahmed",
    role: "Procurement Manager",
    company: "Metro Wholesale",
    location: "Karachi",
    rating: 5,
    text: "BULKUR transformed how we source products. We found verified suppliers in Faisalabad who deliver consistently high-quality textiles at competitive prices. The escrow system gives us complete peace of mind.",
  },
  {
    name: "Fatima Zahra",
    role: "CEO",
    company: "Dubai Foods LLC",
    location: "Dubai, UAE",
    rating: 5,
    text: "As an international buyer, trust was my biggest concern. BULKUR's verification process and dispute resolution system made importing from Pakistan seamless. Our rice orders have been flawless.",
  },
  {
    name: "Usman Ali",
    role: "Owner",
    company: "Sialkot Sports Co.",
    location: "Sialkot",
    rating: 5,
    text: "Since joining BULKUR, our export orders increased by 40%. The RFQ system connects us with serious buyers, and the platform handles payments professionally. Best decision for our business.",
  },
];

const TrustSection = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4">
      {/* Trust Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {trustBadges.map(({ icon: Icon, label, desc }) => (
          <div key={label} className="text-center p-6 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display font-bold text-foreground mb-1">{label}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-body">{desc}</p>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="text-center mb-10">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-2">Trusted by Businesses Across Pakistan</h2>
        <p className="text-muted-foreground font-body">Hear from buyers and sellers who grow with BULKUR</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-card rounded-xl border border-border p-6 relative">
            <Quote className="h-8 w-8 text-primary/10 absolute top-4 right-4" />
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-4 w-4 ${s <= t.rating ? "fill-warning text-warning" : "text-border"}`} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-6">"{t.text}"</p>
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-display font-bold text-primary text-sm">{t.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-display font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground font-body">{t.role}, {t.company} • {t.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustSection;
