import Header from "../components/layout/Header";
import Hero from "../components/home/Hero";
import CategoryTabs from "../components/home/CategoryTabs";
import ProductGrid from "../components/home/ProductGrid";
import AboutSection from "../components/home/AboutSection";
import ContactBanner from "../components/home/ContactBanner";
import FeatureBar from "../components/home/FeatureBar";
import Footer from "../components/layout/Footer";

export default function HomePage() {
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
        background: "#fafafa",
      }}
    >
      <Header />
      <Hero />
      <CategoryTabs />
      <ProductGrid />
      <AboutSection />
      <ContactBanner />
      <FeatureBar />
      <Footer />
    </div>
  );
}
