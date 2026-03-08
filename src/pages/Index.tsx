import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import RFQSection from "@/components/RFQSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <CategoryGrid />
    <FeaturedProducts />
    <RFQSection />
    <Footer />
  </div>
);

export default Index;
