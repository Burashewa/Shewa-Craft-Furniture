import { About } from '../components/About';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <About />
      <Footer />
    </div>
  );
}
