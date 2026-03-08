import { Shield, Truck, Users, FileText, Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";

const qualities = [
  {
    icon: Shield,
    title: "Buyer Protection",
    desc: "Every order secured with escrow payments",
    bg: "bg-[hsl(280,80%,55%)]",
    iconColor: "text-white",
  },
  {
    icon: Truck,
    title: "Next-Day Delivery",
    desc: "Fast shipping across Pakistan within 24hrs",
    bg: "bg-[hsl(160,70%,45%)]",
    iconColor: "text-white",
  },
  {
    icon: Users,
    title: "Verified Suppliers",
    desc: "5,000+ vetted suppliers with quality ratings",
    bg: "bg-[hsl(35,90%,55%)]",
    iconColor: "text-white",
  },
  {
    icon: FileText,
    title: "RFQ Marketplace",
    desc: "Post needs & let suppliers compete for you",
    bg: "bg-[hsl(200,85%,50%)]",
    iconColor: "text-white",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="bg-gradient-hero py-5 sm:py-7 md:py-10">
      <div className="container mx-auto px-4 flex flex-col items-center text-center">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="font-display font-extrabold text-2xl sm:text-3xl md:text-5xl text-primary-foreground leading-tight mb-6"
        >
          Bulk buying now made easy
        </motion.h1>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="w-full max-w-2xl mb-10"
        >
          <div className="flex rounded-xl overflow-hidden border border-border bg-card shadow-lg focus-within:ring-2 focus-within:ring-primary/30 transition-all">
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
        </motion.div>

        {/* 4 Vibrant Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl"
        >
          {qualities.map((q) => (
            <motion.div
              key={q.title}
              variants={item}
              className={`${q.bg} rounded-2xl p-5 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-200 cursor-default shadow-md`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                <q.icon className={`h-6 w-6 ${q.iconColor}`} />
              </div>
              <h3 className="font-display font-bold text-white text-sm sm:text-base mb-1">{q.title}</h3>
              <p className="text-white/80 font-body text-xs leading-relaxed">{q.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
