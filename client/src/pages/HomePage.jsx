import Hero from "../components/home/Hero";
import ProductGrid from "../components/home/ProductGrid";
import AboutSection from "../components/home/AboutSection";

export default function HomePage() {
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
        background: "#fafafa",
      }}
    >
      <Hero />
      <ProductGrid />
      <AboutSection />
    </div>
  );
}
