import Hero from "../components/home/Hero";
import ProductGrid from "../components/home/ProductGrid";
import AboutSection from "../components/home/AboutSection";
import ContactBanner from "../components/home/ContactBanner";
import NewsletterSection from "../components/home/NewsletterSection";

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
      <NewsletterSection />
      <AboutSection />
      <ContactBanner />
    </div>
  );
}
