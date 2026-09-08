import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StaticPageLayout, StaticSection } from '../components/legal/StaticPageLayout';

export default function Help() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;

    const id = hash.replace('#', '');
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <StaticPageLayout
      title="Help"
      subtitle="Shipping, returns, common questions, and how to reach ShewaCraft Support."
      lastUpdated="September 8, 2026"
    >
      <StaticSection id="shipping" title="Shipping info">
        <p>
          ShewaCraft ships furniture with protective packaging suited to each
          piece. Most in-stock orders are prepared within 2–5 business days.
          Delivery windows vary by destination and item size; oversized pieces
          may arrive by scheduled freight rather than standard parcel service.
        </p>
        <p>
          You will receive order updates after checkout. If a listing is marked
          Out of stock, it cannot be purchased until inventory returns.
        </p>
      </StaticSection>

      <StaticSection id="returns" title="Returns">
        <p>
          Unused items in original condition may be returned within 30 days of
          delivery. Please keep original packaging when possible. Custom,
          clearance, or assembled pieces may have different return terms, which
          we will confirm when you open a request.
        </p>
        <p>
          To start a return, open the order from your{' '}
          <Link to="/orders" className="text-gray-900 underline underline-offset-2 hover:no-underline">
            Orders
          </Link>{' '}
          page or contact support. Inspect furniture on arrival and report
          transit damage as soon as you can, with photos of the item and
          packaging.
        </p>
      </StaticSection>

      <StaticSection id="faq" title="FAQ">
        <p>
          <span className="font-medium text-gray-900">Do I need an account to shop?</span>{' '}
          You can browse the catalog without signing in. Adding to cart,
          saving favorites, placing orders, and Chat with Owner require an
          account.
        </p>
        <p>
          <span className="font-medium text-gray-900">What does Out of stock mean?</span>{' '}
          The product stays discoverable in search and filters, but it cannot
          be purchased until it is available again.
        </p>
        <p>
          <span className="font-medium text-gray-900">How do I ask about a piece?</span>{' '}
          Open the product details and use Chat with Owner. Support can also
          help from Messages after you sign in.
        </p>
        <p>
          <span className="font-medium text-gray-900">Where are favorites saved?</span>{' '}
          Signed-in customers can save items and review them on the{' '}
          <Link to="/favorites" className="text-gray-900 underline underline-offset-2 hover:no-underline">
            Favorites
          </Link>{' '}
          page.
        </p>
      </StaticSection>

      <StaticSection id="contact" title="Contact us">
        <p>
          ShewaCraft Support typically replies within a few hours on business
          days. Signed-in customers can message us anytime from{' '}
          <Link to="/messages" className="text-gray-900 underline underline-offset-2 hover:no-underline">
            Messages
          </Link>
          .
        </p>
        <p>
          For order-specific help, include your order number. For a listing
          question, include the product name so we can keep the conversation in
          context. You can also review our{' '}
          <Link to="/privacy" className="text-gray-900 underline underline-offset-2 hover:no-underline">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link to="/terms" className="text-gray-900 underline underline-offset-2 hover:no-underline">
            Terms of Service
          </Link>
          .
        </p>
      </StaticSection>
    </StaticPageLayout>
  );
}
