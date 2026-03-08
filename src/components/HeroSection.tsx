import { Search, ArrowRight, Shield, Truck, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroBanner from "@/assets/hero-banner.jpg";
import { Link } from "react-router-dom";

const stats = [
  { label: "Verified Suppliers", value: "12,000+" },
  { label: "Product Categories", value: "500+" },
  { label: "Orders Fulfilled", value: "2.5M+" },
  { label: "Cities Covered", value: "180+" },
];

const HeroSection = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroBanner} alt="B2B Wholesale Marketplace" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-foreground/70" />
    </div>

    <div className="relative container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
          <BadgeCheck className="h-4 w-4" />
          Pakistan's Trusted B2B Platform
        </div>
        <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight mb-4">
          Source Wholesale,{" "}
          <span className="text-gradient-hero">Grow Your Business</span>
        </h1>
        <p className="text-lg text-primary-foreground/80 mb-8 font-body">
          Connect with verified Pakistani suppliers. Get the best wholesale prices on textiles, electronics, agriculture, and 500+ categories.
        </p>

        <div className="flex rounded-xl overflow-hidden shadow-lg mb-8">
          <Input
            placeholder="What are you looking for?"
            className="h-14 border-0 rounded-none text-base bg-card text-foreground font-body"
          />
          <button className="bg-gradient-hero px-8 text-primary-foreground font-semibold hover:opacity-90 transition flex items-center gap-2 whitespace-nowrap">
            <Search className="h-5 w-5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/products">
            <Button variant="secondary" className="gap-2 font-body">
              Browse Products <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/rfq">
            <Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2 font-body">
              Post an RFQ
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card/10 backdrop-blur-md rounded-xl p-4 text-center border border-primary-foreground/10">
            <div className="font-display font-extrabold text-2xl text-primary-foreground">{stat.value}</div>
            <div className="text-sm text-primary-foreground/70 font-body">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="relative bg-card border-t border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-center gap-8 text-sm font-body">
          {[
            { icon: Shield, text: "Secure Escrow Payments" },
            { icon: BadgeCheck, text: "Verified Suppliers" },
            { icon: Truck, text: "Pan-Pakistan Delivery" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-5 w-5 text-primary" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;