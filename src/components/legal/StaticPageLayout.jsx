import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { Header } from '../Header';
import { Footer } from '../Footer';

export function StaticPageLayout({ title, subtitle, lastUpdated, children }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return undefined;
    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16">
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav
              className="flex items-center gap-1.5 text-sm text-gray-500 mb-4"
              aria-label="Breadcrumb"
            >
              <Link to="/" className="hover:text-gray-900 transition">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" aria-hidden />
              <span className="text-gray-900" aria-current="page">
                {title}
              </span>
            </nav>
            <h1 className="text-3xl sm:text-4xl text-gray-900 mb-2">{title}</h1>
            {subtitle && <p className="text-gray-600 max-w-2xl">{subtitle}</p>}
          </div>
        </div>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {lastUpdated && (
            <p className="text-sm text-gray-500 mb-8">Last updated: {lastUpdated}</p>
          )}
          <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 space-y-8 text-gray-700">{children}</div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

export function StaticSection({ id, title, children }) {
  return (
    <section id={id} className={id ? 'scroll-mt-24' : undefined}>
      <h2 className="text-xl text-gray-900 mb-3">{title}</h2>
      <div className="space-y-3 leading-relaxed">{children}</div>
    </section>
  );
}
