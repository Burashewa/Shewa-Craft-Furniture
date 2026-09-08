import { Link } from 'react-router-dom';
import { StaticPageLayout, StaticSection } from '../components/legal/StaticPageLayout';

export default function TermsOfService() {
  return (
    <StaticPageLayout
      title="Terms of Service"
      subtitle="The rules that govern browsing, ordering, and using the ShewaCraft Furniture marketplace."
      lastUpdated="September 8, 2026"
    >
      <StaticSection title="Using ShewaCraft">
        <p>
          By accessing ShewaCraft Furniture, you agree to these terms. You must
          be old enough to form a contract in your region and provide accurate
          account information if you sign up.
        </p>
        <p>
          These terms are for the ShewaCraft storefront. They are not a
          substitute for professional legal advice.
        </p>
      </StaticSection>

      <StaticSection title="Accounts">
        <p>
          Some features — including cart checkout, favorites, orders, and Chat
          with Owner — require a signed-in customer account. You are
          responsible for keeping your sign-in details confidential and for
          activity that occurs under your account.
        </p>
      </StaticSection>

      <StaticSection title="Products, pricing, and stock">
        <p>
          Product photos, descriptions, prices, and specifications are provided
          to help you shop. We work to keep listings accurate, but details may
          change. Items marked Out of stock remain visible in the catalog and
          cannot be purchased until they are available again.
        </p>
        <p>
          Prices are shown in US dollars and may be updated without notice
          before an order is placed.
        </p>
      </StaticSection>

      <StaticSection title="Orders">
        <p>
          Placing an order through Cart constitutes an offer to purchase the
          selected items. We may decline or cancel an order if a product cannot
          be fulfilled, payment cannot be completed, or the request appears
          fraudulent or abusive.
        </p>
        <p>
          You can review order status from your{' '}
          <Link to="/orders" className="text-gray-900 underline underline-offset-2 hover:no-underline">
            Orders
          </Link>{' '}
          page after signing in.
        </p>
      </StaticSection>

      <StaticSection title="Delivery and returns">
        <p>
          Delivery timing, packaging, and return conditions are described on our{' '}
          <Link to="/help" className="text-gray-900 underline underline-offset-2 hover:no-underline">
            Help
          </Link>{' '}
          page. Furniture must be inspected on arrival. Return requests should
          be opened promptly if an item arrives damaged or is not as described.
        </p>
      </StaticSection>

      <StaticSection title="Acceptable use">
        <p>
          You agree not to misuse ShewaCraft, including attempting to disrupt
          the site, scrape listings in an abusive way, impersonate others, or
          use chat and messages for harassment or spam.
        </p>
      </StaticSection>

      <StaticSection title="Limitation of liability">
        <p>
          ShewaCraft provides the marketplace on an “as is” basis. To the
          fullest extent permitted by law, we are not liable for indirect or
          consequential losses arising from your use of the site, delays in
          delivery, or unavailability of a listed product.
        </p>
      </StaticSection>

      <StaticSection title="Changes">
        <p>
          We may update these terms as the marketplace evolves. Continued use of
          ShewaCraft after changes are posted means you accept the revised
          terms. Related policies include our{' '}
          <Link to="/privacy" className="text-gray-900 underline underline-offset-2 hover:no-underline">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link to="/cookies" className="text-gray-900 underline underline-offset-2 hover:no-underline">
            Cookie Policy
          </Link>
          .
        </p>
      </StaticSection>
    </StaticPageLayout>
  );
}
