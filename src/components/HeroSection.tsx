import { Shield, Truck, BadgeCheck, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const trustBadges = [
  { icon: Shield, text: "Secure Escrow Payments" },
  { icon: BadgeCheck, text: "Verified Suppliers" },
  { icon: Truck, text: "Pan-Pakistan Delivery" },
];

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="bg-gradient-hero py-10 sm:py-14 md:py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-foreground/15 text-primary-foreground px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 backdrop-blur-sm">
          <BadgeCheck className="h-4 w-4" />
          Pakistan's Trusted B2B Platform
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight mb-5 sm:mb-8">
          Source Wholesale, Grow Your Business
        </h1>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="flex w-full rounded-lg overflow-hidden border-2 border-white/30 focus-within:border-white/60 transition-all bg-white/20 backdrop-blur-md shadow-lg">
            <Input
              placeholder="What are you looking for"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 rounded-none focus-visible:ring-0 font-body bg-transparent text-white placeholder:text-white/70 h-12 sm:h-14 text-sm sm:text-base"
            />
            <button className="bg-white/25 hover:bg-white/35 px-5 sm:px-8 text-white transition-colors">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {trustBadges.map(({ icon: Icon, text }) => (
            <div key={text} className="bg-primary-foreground/10 backdrop-blur-md rounded-xl px-4 py-3 sm:px-6 sm:py-4 border border-primary-foreground/15 flex items-center gap-2.5">
              <Icon className="h-5 w-5 text-primary-foreground" />
              <span className="text-xs sm:text-sm font-semibold text-primary-foreground">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
