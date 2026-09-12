import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { ConveyorSlider } from './ui/ConveyorSlider';
import { fetchFeaturedTestimonials } from '../services/testimonialService';

const TESTIMONIAL_VISIBLE_AT = [
  { minWidth: 0, count: 1 },
  { minWidth: 768, count: 3 },
];

function TestimonialCard({ testimonial }) {
  const rating = Math.max(0, Math.min(5, Number(testimonial.rating) || 0));
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm h-full">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, index) => (
          <Star
            key={index}
            className="w-5 h-5 fill-gray-900 text-gray-900"
          />
        ))}
      </div>
      <p className="text-gray-600 mb-6 leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div>
        <p className="text-gray-900">{testimonial.name}</p>
        {testimonial.product ? (
          <p className="text-sm text-gray-500">{testimonial.product}</p>
        ) : null}
      </div>
    </div>
  );
}

function TestimonialsGrid({ items }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {items.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  );
}

function SectionHeading() {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl text-gray-900 mb-4">What Our Customers Say</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Real stories from people who furnished their spaces with ShewaCraft
      </p>
    </div>
  );
}

export function Testimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const next = await fetchFeaturedTestimonials();
        if (!active) return;
        setItems(next);
        setError('');
      } catch (err) {
        if (!active) return;
        setItems([]);
        setError(err.message || 'Unable to load testimonials');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  let body = null;
  if (loading) {
    body = <p className="text-center text-gray-600">Loading customer stories...</p>;
  } else if (error) {
    body = <p className="text-center text-gray-600">{error}</p>;
  } else if (items.length === 0) {
    body = (
      <p className="text-center text-gray-600">
        Customer stories will appear here when featured reviews are published.
      </p>
    );
  } else {
    body = (
      <ConveyorSlider
        items={items}
        getKey={(testimonial) => testimonial.id}
        renderItem={(testimonial) => <TestimonialCard testimonial={testimonial} />}
        visibleAt={TESTIMONIAL_VISIBLE_AT}
        ariaLabel="Customer testimonials"
        previousLabel="Previous testimonial"
        nextLabel="Next testimonial"
        dotsLabel="Testimonials"
        itemLabel={(_testimonial, index) => `Go to testimonial ${index + 1}`}
        fallback={<TestimonialsGrid items={items} />}
      />
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading />
        {body}
      </div>
    </section>
  );
}
