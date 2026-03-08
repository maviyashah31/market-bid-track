import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import RFQSection from "@/components/RFQSection";
import Footer from "@/components/Footer";
import AnimatedPage from "@/components/AnimatedPage";

const Index = () => (
  <AnimatedPage>
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <RFQSection />
      <Footer />
    </div>
  </AnimatedPage>
);

export default Index;
