import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import RFQSection from "@/components/RFQSection";
import TrustSection from "@/components/TrustSection";
import Footer from "@/components/Footer";
import AnimatedPage from "@/components/AnimatedPage";

const Index = () => (
  <AnimatedPage>
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <CategoryGrid />
      <FeaturedProducts />
      <RFQSection />
      <TrustSection />
      <Footer />
    </div>
  </AnimatedPage>
);

export default Index;
