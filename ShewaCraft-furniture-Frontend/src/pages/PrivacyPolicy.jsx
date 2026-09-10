import { Link } from 'react-router-dom';
import { StaticPageLayout, StaticSection } from '../components/legal/StaticPageLayout';

export default function PrivacyPolicy() {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      subtitle="How ShewaCraft Furniture collects, uses, and protects your information when you shop with us."
      lastUpdated="September 8, 2026"
    >
      <StaticSection title="Who we are">
        <p>
          ShewaCraft Furniture (“ShewaCraft”, “we”, “us”) is an online furniture
          marketplace. This policy explains how we handle personal information
          when you browse our catalog, create an account, place an order, save
          favorites, or chat with support.
        </p>
      </StaticSection>

      <StaticSection title="Information we collect">
        <p>Depending on how you use ShewaCraft, we may collect:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Account details such as your name, email address, and sign-in
            credentials.
          </li>
          <li>
            Order information, including shipping details, items purchased,
            quantities, and selected options such as color.
          </li>
          <li>
            Shopping activity such as cart contents, saved favorites, and
            product inquiries.
          </li>
          <li>
            Messages you send to ShewaCraft Support through
            in-app chat.
          </li>
          <li>
            Technical data needed to keep the site working, such as session
            information described in our{' '}
            <Link to="/cookies" className="text-gray-900 underline underline-offset-2 hover:no-underline">
              Cookie Policy
            </Link>
            .
          </li>
        </ul>
      </StaticSection>

      <StaticSection title="How we use your information">
        <p>We use this information to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Create and maintain your account.</li>
          <li>Fulfill orders, process returns, and provide order updates.</li>
          <li>Save your cart and favorites across visits.</li>
          <li>Respond to product questions through ShewaCraft Support chat and Messages.</li>
          <li>Improve our catalog, search, and customer experience.</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
      </StaticSection>

      <StaticSection title="Sharing">
        <p>
          We share information only as needed to operate ShewaCraft — for
          example, with payment, delivery, or hosting providers who help us
          complete an order — or when required by law. ShewaCraft Support may see
          the inquiry details you send about a listing so they can respond.
        </p>
      </StaticSection>

      <StaticSection title="Your choices">
        <p>
          You can update account details, manage favorites, and review orders
          while signed in. To request access, correction, or deletion of your
          personal information, contact ShewaCraft Support from the{' '}
          <Link to="/help#contact" className="text-gray-900 underline underline-offset-2 hover:no-underline">
            Help
          </Link>{' '}
          page.
        </p>
      </StaticSection>

      <StaticSection title="Contact">
        <p>
          Privacy questions can be sent through{' '}
          <Link to="/messages" className="text-gray-900 underline underline-offset-2 hover:no-underline">
            Messages
          </Link>{' '}
          after you sign in, or via the contact options on our Help page.
        </p>
      </StaticSection>
    </StaticPageLayout>
  );
}
