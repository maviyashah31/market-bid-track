import { Shield, Truck, BadgeCheck } from "lucide-react";

const trustBadges = [
  { icon: Shield, text: "Secure Escrow Payments" },
  { icon: BadgeCheck, text: "Verified Suppliers" },
  { icon: Truck, text: "Pan-Pakistan Delivery" },
];

const HeroSection = () => (
  <section className="bg-gradient-hero py-12 sm:py-16 md:py-20">
    <div className="container mx-auto px-4 text-center">
      <div className="inline-flex items-center gap-2 bg-primary-foreground/15 text-primary-foreground px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 backdrop-blur-sm">
        <BadgeCheck className="h-4 w-4" />
        Pakistan's Trusted B2B Platform
      </div>
      <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary-foreground leading-tight mb-3 sm:mb-4">
        Source Wholesale, Grow Your Business
      </h1>
      <p className="text-sm sm:text-lg text-primary-foreground/80 mb-8 sm:mb-10 font-body max-w-2xl mx-auto">
        Connect with verified Pakistani suppliers. Get the best wholesale prices on textiles, electronics, agriculture, and 500+ categories.
      </p>

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

export default HeroSection;
