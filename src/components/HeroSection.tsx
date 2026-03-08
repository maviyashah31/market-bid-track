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
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="bg-background pt-6 pb-10 sm:pt-10 sm:pb-14">
      <div className="container mx-auto px-4">
        {/* Search Area */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto text-center mb-10 sm:mb-14"
        >
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight mb-3">
            Source Wholesale,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-[hsl(262,83%,58%)]">
              Grow Your Business
            </span>
          </h1>
          <p className="text-muted-foreground font-body text-sm sm:text-base mb-6 max-w-xl mx-auto">
            Pakistan's most trusted B2B marketplace — connecting buyers with verified suppliers.
          </p>

          <div className="flex w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-border bg-card shadow-lg focus-within:ring-2 focus-within:ring-primary/30 transition-all">
            <div className="flex items-center pl-4 text-muted-foreground">
              <Search className="h-5 w-5" />
            </div>
            <Input
              placeholder="Search products, suppliers, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 rounded-none focus-visible:ring-0 font-body bg-transparent h-12 sm:h-14 text-sm sm:text-base"
            />
            <button className="bg-primary hover:bg-primary/90 px-6 sm:px-8 text-primary-foreground font-semibold text-sm transition-colors flex items-center gap-2 shrink-0">
              Search
              <ArrowRight className="h-4 w-4 hidden sm:block" />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs text-muted-foreground font-body">
            <span>Popular:</span>
            {["Textiles", "Rice", "Sports Goods", "Surgical Instruments"].map((t) => (
              <button
                key={t}
                className="px-3 py-1 rounded-full border border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Quality Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {qualities.map((q) => (
            <motion.div
              key={q.title}
              variants={item}
              className={`group relative rounded-2xl border border-border bg-gradient-to-br ${q.gradient} p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default`}
            >
              <div className={`w-12 h-12 rounded-xl ${q.iconBg} flex items-center justify-center mb-4`}>
                <q.icon className={`h-6 w-6 ${q.iconColor}`} />
              </div>
              <h3 className="font-display font-bold text-foreground text-lg mb-2">{q.title}</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">{q.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
