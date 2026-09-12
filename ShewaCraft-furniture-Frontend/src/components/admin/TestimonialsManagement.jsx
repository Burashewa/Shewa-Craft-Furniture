import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Filter, Quote, Search, Star } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import {
  listAdminTestimonials,
  patchAdminTestimonialFeatured,
} from '../../services/adminService';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { ProductStatCard } from './dashboard/ProductStatCard';

const MotionDiv = motion.div;

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

function RatingStars({ rating }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`w-3.5 h-3.5 ${
            index < rating ? 'fill-gray-900 text-gray-900' : 'text-gray-300'
          }`}
          aria-hidden
        />
      ))}
    </span>
  );
}

export function TestimonialsManagement() {
  const { showToast } = useToast();
  const prefersReducedMotion = useReducedMotion();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [pending, setPending] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const next = await listAdminTestimonials();
    setTestimonials(next);
    setError('');
    return next;
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const next = await listAdminTestimonials();
        if (!active) return;
        setTestimonials(next);
        setError('');
      } catch (err) {
        if (!active) return;
        setTestimonials([]);
        setError(err.message || 'Unable to load reviews');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const eligible = testimonials.length;
    const featured = testimonials.filter((item) => item.featured).length;
    return { eligible, featured };
  }, [testimonials]);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return testimonials.filter((item) => {
      const matchesFeatured =
        featuredFilter === 'all' ||
        (featuredFilter === 'yes' && item.featured) ||
        (featuredFilter === 'no' && !item.featured);
      const haystack = [
        item.customer?.name,
        item.customer?.email,
        item.product,
        item.review,
        item.id,
      ]
        .join(' ')
        .toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      return matchesFeatured && matchesSearch;
    });
  }, [testimonials, featuredFilter, searchQuery]);

  const clearFilters = () => {
    setSearchQuery('');
    setFeaturedFilter('all');
  };

  const handleConfirm = async () => {
    if (!pending || saving) return;
    setSaving(true);
    try {
      const next = await patchAdminTestimonialFeatured(pending.id, pending.featured);
      setTestimonials((prev) =>
        prev.map((item) => (item.id === next.id ? next : item))
      );
      showToast({
        type: 'success',
        title: pending.featured ? 'Featured on homepage' : 'Removed from homepage',
        message: pending.featured
          ? 'This review now appears in Customer Testimonials.'
          : 'The original customer review is unchanged.',
      });
      setPending(null);
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Could not update testimonial',
        message: err.message || 'Unable to update featured status.',
      });
    } finally {
      setSaving(false);
    }
  };

  const entrance = prefersReducedMotion
    ? {}
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } };

  return (
    <MotionDiv
      className="lg:pt-0 pt-16"
      {...entrance}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
    >
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-3xl text-gray-900">Testimonials</h1>
        <p className="text-gray-600 mt-1">
          Feature written customer reviews on the homepage. Ratings and review
          text stay exactly as the customer wrote them.
        </p>
      </div>

      <div className="p-6 space-y-6">
        <section className="grid grid-cols-2 gap-4">
          <ProductStatCard
            label="Written reviews"
            value={stats.eligible}
            icon={Quote}
            active={featuredFilter === 'all'}
            onClick={() => setFeaturedFilter('all')}
          />
          <ProductStatCard
            label="Featured"
            value={stats.featured}
            icon={Star}
            active={featuredFilter === 'yes'}
            onClick={() => setFeaturedFilter('yes')}
          />
        </section>

        <section className="bg-white border border-gray-200 rounded-lg p-4 md:p-5">
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
            <Filter className="w-4 h-4" />
            Search & filters
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search customer, product, or review..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
                aria-label="Search reviews"
              />
            </div>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900"
              aria-label="Filter by featured"
            >
              <option value="all">Featured: all</option>
              <option value="yes">Featured only</option>
              <option value="no">Not featured</option>
            </select>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-gray-500">
              Showing{' '}
              <span className="text-gray-900 font-medium">{filtered.length}</span>{' '}
              of {testimonials.length} written reviews
            </p>
            {(featuredFilter !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={clearFilters}
                className={`text-sm text-gray-700 hover:text-gray-900 underline underline-offset-2 transition duration-200 ${focusRing}`}
              >
                Clear filters
              </button>
            )}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <p className="p-12 text-center text-gray-600">Loading reviews...</p>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-gray-900 font-medium">Unable to load reviews</p>
              <p className="text-sm text-gray-500 mt-1">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  load()
                    .catch((err) =>
                      setError(err.message || 'Unable to load reviews')
                    )
                    .finally(() => setLoading(false));
                }}
                className={`mt-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200 ${focusRing}`}
              >
                Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Quote className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-900 font-medium">No written reviews</p>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Only ratings with a written description can be featured on the
                homepage.
              </p>
              {(featuredFilter !== 'all' || searchQuery) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className={`mt-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200 ${focusRing}`}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Review
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filtered.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/80">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {item.customer?.name || 'Customer'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.customer?.email}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RatingStars rating={item.rating} />
                        </td>
                        <td className="px-6 py-4 max-w-sm">
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {item.review}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{item.product || '—'}</p>
                          <p className="text-xs text-gray-500">{item.id}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.featured ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-gray-900 rounded-sm bg-gray-900 text-white">
                              <Star className="w-3.5 h-3.5 fill-white" />
                              Featured
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-1 text-xs border border-gray-200 rounded-sm bg-gray-50 text-gray-600">
                              Not featured
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setPending({ id: item.id, featured: !item.featured })
                            }
                            className={`px-3 py-1.5 text-sm rounded-md transition duration-200 ${focusRing} ${
                              item.featured
                                ? 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                                : 'bg-gray-900 text-white hover:bg-gray-800'
                            }`}
                          >
                            {item.featured ? 'Unfeature' : 'Feature'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-gray-200">
                {filtered.map((item) => (
                  <article key={item.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {item.customer?.name || 'Customer'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {item.customer?.email}
                        </p>
                      </div>
                      {item.featured ? (
                        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 text-xs border border-gray-900 rounded-sm bg-gray-900 text-white">
                          Featured
                        </span>
                      ) : (
                        <span className="shrink-0 inline-block px-2 py-1 text-xs border border-gray-200 rounded-sm bg-gray-50 text-gray-600">
                          Not featured
                        </span>
                      )}
                    </div>
                    <RatingStars rating={item.rating} />
                    <p className="text-sm text-gray-700">{item.review}</p>
                    <p className="text-xs text-gray-500">
                      {item.product || 'Product'} · {item.id}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setPending({ id: item.id, featured: !item.featured })
                      }
                      className={`w-full py-2 text-sm rounded-md transition duration-200 ${focusRing} ${
                        item.featured
                          ? 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      {item.featured ? 'Unfeature' : 'Feature'}
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={Boolean(pending)}
        title={pending?.featured ? 'Feature this review?' : 'Unfeature this review?'}
        message={
          pending?.featured
            ? 'This written review will appear in Customer Testimonials on the homepage. The customer text will not be changed.'
            : 'This review will leave the homepage. The original customer rating and text stay on the order.'
        }
        confirmLabel={pending?.featured ? 'Feature' : 'Unfeature'}
        cancelLabel="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!saving) setPending(null);
        }}
      />
    </MotionDiv>
  );
}
