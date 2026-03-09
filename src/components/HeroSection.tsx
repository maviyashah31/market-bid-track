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

            {/* Supply Categories */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="grid grid-cols-2 gap-3">
              {supplyCategories.map((category) => (
                <Link
                  key={category.title}
                  to={`/products?category=${encodeURIComponent(category.title)}`}
                  className={`${category.bg} flex flex-col items-center justify-center gap-2 rounded-xl hover:shadow-lg transition-all cursor-pointer group p-4`}
                >
                  <category.icon className={`h-6 w-6 ${category.iconColor} group-hover:scale-110 transition-transform`} />
                  <span className="font-display font-semibold text-white text-center text-xs leading-tight">{category.title}</span>
                </Link>
              ))}
            </motion.div>
          </div>

        </div>
      </section>
    </>
  );
};

export default HeroSection;