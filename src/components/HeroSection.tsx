import { Zap, ChefHat, Briefcase, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const supplyCategories = [
  {
    icon: Zap,
    title: "Electrical Supply",
    bg: "bg-amber-500",
    iconColor: "text-white"
  },
  {
    icon: ChefHat,
    title: "Restaurant Supply", 
    bg: "bg-red-500",
    iconColor: "text-white"
  },
  {
    icon: Briefcase,
    title: "Office Supply",
    bg: "bg-blue-500", 
    iconColor: "text-white"
  },
  {
    icon: Stethoscope,
    title: "Medical Instruments and Supply",
    bg: "bg-green-500",
    iconColor: "text-white"
  }
];


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
              className="font-display font-extrabold text-2xl sm:text-3xl md:text-5xl text-primary-foreground leading-tight mb-3">
              Bulk buying now made easy!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-body text-lg sm:text-xl text-primary-foreground/90 leading-relaxed mb-6">
              Order in bulk and get it delivered on your doorstep. The only B2B marketplace in Pakistan
            </motion.p>

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

export default HeroSection;