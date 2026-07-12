import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { CategorySection } from "../components/CategorySection";
import { FeaturedProducts } from "../components/FeatureProdects";
import { AboutSection } from "../components/AboutSection";
import { Testimonials } from "../components/Testimonials";
import { HomeCTA } from "../components/HomeCTA";
import { Footer } from "../components/Footer";
import { ProductDetailView } from "../components/ProductDetailView";

export default function Home() {
  const aboutRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const scrollToAbout = () => {
    aboutRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
  };
  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <Header />
      <Hero onAboutClick={scrollToAbout} />
      <CategorySection />
      <FeaturedProducts onViewDetails={openProductDetails} />
      <AboutSection ref={aboutRef} />
      <Testimonials />
      <HomeCTA />
      <Footer />

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            onClose={closeProductDetails}
          />
        )}
      </AnimatePresence>
    </>
  );
}
