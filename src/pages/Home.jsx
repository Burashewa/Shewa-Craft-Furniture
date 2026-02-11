import { AnimatePresence} from "framer-motion";
import { useRef, useState } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { FeaturedProducts } from "../components/FeatureProdects";
import { AboutSection } from "../components/AboutSection"; 
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
        <Hero onLearnMoreClick={scrollToAbout} />
        <FeaturedProducts onViewDetails ={openProductDetails} />
        <AboutSection ref={aboutRef} />
        <Footer />

        {/* Modal */}
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
