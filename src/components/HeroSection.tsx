import { Shield, Truck, Users, FileText, Search, ArrowRight, ShoppingCart, PackageCheck, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";

const qualities = [
{
  icon: Shield,
  title: "Buyer Protection",
  desc: "Every order secured with escrow payments",
  bg: "bg-[hsl(280,80%,55%)]",
  iconColor: "text-white"
},
{
  icon: Truck,
  title: "Next-Day Delivery",
  desc: "Fast shipping across Pakistan within 24hrs",
  bg: "bg-[hsl(160,70%,45%)]",
  iconColor: "text-white"
},
{
  icon: Users,
  title: "Verified Suppliers",
  desc: "5,000+ vetted suppliers with quality ratings",
  bg: "bg-[hsl(35,90%,55%)]",
  iconColor: "text-white"
},
{
  icon: FileText,
  title: "RFQ Marketplace",
  desc: "Post needs & let suppliers compete for you",
  bg: "bg-[hsl(200,85%,50%)]",
  iconColor: "text-white"
}];


const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="bg-gradient-hero py-3 sm:py-4 md:py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between md:gap-6">
        {/* Left: Heading + Search */}
        <div className="flex-1 max-w-xl mb-4 md:mb-0">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="font-display font-extrabold text-xl sm:text-2xl md:text-4xl text-primary-foreground leading-tight mb-4">
            
            Bulk buying now made easy!
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="max-w-lg">
            
            <div className="flex rounded-xl overflow-hidden border border-border bg-card shadow-lg focus-within:ring-2 focus-within:ring-primary/30 transition-all">
              <div className="flex items-center pl-3 text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <Input
                placeholder="Search products, suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 rounded-none focus-visible:ring-0 font-body bg-transparent h-10 sm:h-11 text-sm" />
              
              <button className="bg-primary hover:bg-primary/90 px-5 text-primary-foreground font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0">
                Search
                <ArrowRight className="h-3.5 w-3.5 hidden sm:block" />
              </button>
            </div>
          </motion.div>

        </div>

        {/* Center: Steps vertical with arrows */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="hidden md:flex flex-col items-center gap-1.5">
          
          {[
          { icon: Search, step: "1", title: "Browse", desc: "Find products" },
          { icon: ShoppingCart, step: "2", title: "Add to Cart", desc: "Select & add" },
          { icon: PackageCheck, step: "3", title: "Checkout", desc: "Get delivered" }].
          map((s, i, arr) =>
          <div key={i} className="flex flex-col items-center">
              <div className="bg-card/80 border border-border rounded-lg px-4 py-2 flex items-center gap-2 min-w-[140px]">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <s.icon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-primary">Step {s.step}</span>
                  <p className="text-xs font-semibold text-foreground leading-tight">{s.title}</p>
                </div>
              </div>
              {i < arr.length - 1 &&
            <ChevronDown className="h-4 w-4 text-primary/60 my-0.5" />
            }
            </div>
          )}
        </motion.div>

        {/* Right: 4 Cards in 2x2 */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3 w-full md:w-[320px] shrink-0">
          
          {qualities.map((q) =>
          <motion.div
            key={q.title}
            variants={item}
            className={`${q.bg} rounded-xl p-3 flex flex-col items-center text-center hover:-translate-y-0.5 transition-transform duration-200 cursor-default shadow-md`}>
            
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center mb-1.5">
                <q.icon className={`h-4 w-4 ${q.iconColor}`} />
              </div>
              <h3 className="font-display font-bold text-white text-xs mb-0.5">{q.title}</h3>
              <p className="text-white/80 font-body text-[10px] leading-snug">{q.desc}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>);

};

export default HeroSection;