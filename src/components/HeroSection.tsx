import { Shield, Truck, Users, FileText, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";

const qualities = [
  {
    icon: Shield,
    title: "Buyer Protection",
    desc: "Every order is secured with escrow payments — your money is safe until you confirm delivery.",
    gradient: "from-primary/15 to-primary/5",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
  },
  {
    icon: Truck,
    title: "Next-Day Delivery",
    desc: "Fast, reliable shipping across Pakistan. Get your wholesale orders delivered within 24 hours.",
    gradient: "from-success/15 to-success/5",
    iconBg: "bg-success/15",
    iconColor: "text-success",
  },
  {
    icon: Users,
    title: "Verified Suppliers",
    desc: "Browse 5,000+ vetted suppliers with quality ratings, reviews, and verified business profiles.",
    gradient: "from-warning/15 to-warning/5",
    iconBg: "bg-warning/15",
    iconColor: "text-warning",
  },
  {
    icon: FileText,
    title: "RFQ Marketplace",
    desc: "Post what you need and let suppliers compete — get the best prices through Request for Quotations.",
    gradient: "from-accent-foreground/15 to-accent-foreground/5",
    iconBg: "bg-accent",
    iconColor: "text-accent-foreground",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="bg-gradient-hero pt-4 pb-6 sm:pt-6 sm:pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Left — Hero + Search */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="flex-1 flex flex-col justify-center"
          >
            <h1 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-foreground leading-tight mb-1.5">
              Source Wholesale,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-[hsl(262,83%,58%)]">
                Grow Your Business
              </span>
            </h1>
            <p className="text-muted-foreground font-body text-xs sm:text-sm mb-4 max-w-md">
              Pakistan's most trusted B2B marketplace — connecting buyers with verified suppliers.
            </p>

            <div className="flex w-full max-w-xl rounded-lg overflow-hidden border border-border bg-card shadow-md focus-within:ring-2 focus-within:ring-primary/30 transition-all">
              <div className="flex items-center pl-3 text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <Input
                placeholder="Search products, suppliers, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 rounded-none focus-visible:ring-0 font-body bg-transparent h-10 sm:h-11 text-xs sm:text-sm"
              />
              <button className="bg-primary hover:bg-primary/90 px-5 sm:px-6 text-primary-foreground font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0">
                Search
                <ArrowRight className="h-3.5 w-3.5 hidden sm:block" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3 text-xs text-muted-foreground font-body">
              <span>Popular:</span>
              {["Textiles", "Rice", "Sports Goods", "Surgical Instruments"].map((t) => (
                <button
                  key={t}
                  className="px-2.5 py-0.5 rounded-full border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors text-[11px]"
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right — 4 Quality Cards in 2x2 grid */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3 lg:w-[420px] shrink-0"
          >
            {qualities.map((q) => (
              <motion.div
                key={q.title}
                variants={item}
                className={`group rounded-xl border border-border bg-gradient-to-br ${q.gradient} p-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default`}
              >
                <div className={`w-8 h-8 rounded-lg ${q.iconBg} flex items-center justify-center mb-2`}>
                  <q.icon className={`h-4 w-4 ${q.iconColor}`} />
                </div>
                <h3 className="font-display font-bold text-foreground text-xs sm:text-sm mb-0.5">{q.title}</h3>
                <p className="text-muted-foreground font-body text-[11px] leading-relaxed line-clamp-2">{q.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
