import { Shield, Truck, Users, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { categories } from "@/data/mockData";

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
  return (
    <>
      <section className="bg-gradient-hero py-6 sm:py-8 md:py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-center md:gap-12">
          {/* Left: Heading + Categories */}
          <div className="flex-1 max-w-xl mb-6 md:mb-0">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-display font-extrabold text-2xl sm:text-3xl md:text-5xl text-primary-foreground leading-tight mb-5">
              Bulk buying now made easy!
            </motion.h1>

            {/* Quick Categories */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="grid grid-cols-4 gap-2">
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat.id}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-card/80 border border-border hover:border-primary hover:shadow-md transition-all cursor-pointer group py-3"
                >
                  <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <span className="font-display font-semibold text-[9px] sm:text-[11px] text-foreground truncate max-w-full px-1">{cat.name}</span>
                </Link>
              ))}
            </motion.div>
          </div>

          {/* Right: 4 Cards in 2x2 */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-4 w-full md:w-[380px] shrink-0">
            {qualities.map((q) => (
              <motion.div
                key={q.title}
                variants={item}
                className={`${q.bg} rounded-xl p-5 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-200 cursor-default shadow-md`}>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                  <q.icon className={`h-6 w-6 ${q.iconColor}`} />
                </div>
                <h3 className="font-display font-bold text-white text-sm mb-1">{q.title}</h3>
                <p className="text-white/80 font-body text-xs leading-snug">{q.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

  return (
    <>
      {/* Sticky Search Bar */}
      <div
        className={`fixed left-0 right-0 z-40 bg-gradient-hero backdrop-blur-md border-b border-primary/20 shadow-md transition-all duration-300 ${isSticky ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ top: navHeight }}
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex rounded-xl overflow-hidden border border-border bg-card shadow-sm focus-within:ring-2 focus-within:ring-primary/30 transition-all max-w-2xl mx-auto">
            <div className="flex items-center pl-3 text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
            <Input
              placeholder="Search products, suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-0 rounded-none focus-visible:ring-0 font-body bg-transparent h-9 text-sm" />
            <button onClick={handleSearch} className="bg-primary hover:bg-primary/90 px-5 text-primary-foreground font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0">
              Search
              <ArrowRight className="h-3.5 w-3.5 hidden sm:block" />
            </button>
          </div>
        </div>
      </div>

      <section className="bg-gradient-hero py-3 sm:py-4 md:py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-center md:gap-12">
        {/* Left: Heading + Search */}
        <div className="flex-1 max-w-2xl mb-4 md:mb-0">
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
            className="w-full">
            
            <div className="flex rounded-xl overflow-hidden border border-border bg-card shadow-lg focus-within:ring-2 focus-within:ring-primary/30 transition-all">
              <div className="flex items-center pl-3 text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
              <Input
                placeholder="Search products, suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="border-0 rounded-none focus-visible:ring-0 font-body bg-transparent h-10 sm:h-11 text-sm" />
              
              <button onClick={handleSearch} className="bg-primary hover:bg-primary/90 px-5 text-primary-foreground font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0">
                Search
                <ArrowRight className="h-3.5 w-3.5 hidden sm:block" />
              </button>
            </div>
          </motion.div>

          {/* Quick Categories */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="grid grid-cols-4 gap-2 mt-3">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center justify-center gap-1 rounded-xl bg-card/80 border border-border hover:border-primary hover:shadow-md transition-all cursor-pointer group py-2"
              >
                <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="font-display font-semibold text-[8px] sm:text-[10px] text-foreground truncate max-w-full px-1">{cat.name}</span>
              </Link>
            ))}
          </motion.div>

        </div>


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
    </section>
    </>
  );
};

export default HeroSection;