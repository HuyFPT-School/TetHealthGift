// FILE: src/pages/HomePage.jsx
// Header & Footer đã có trong PublicLayout (App.jsx) — không import lại

import Hero from "../components/home/Hero";
import CategoryTabs from "../components/home/CategoryTabs";
import ProductGrid from "../components/home/ProductGrid";
import AboutSection from "../components/home/AboutSection";
import ContactBanner from "../components/home/ContactBanner";
import FeatureBar from "../components/home/FeatureBar";

export default function HomePage() {
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
        background: "#fafafa",
      }}
    >
      <Hero />
      <CategoryTabs />
      <ProductGrid />
      <AboutSection />
      <ContactBanner />
      <FeatureBar />
    </div>
  );
}
