import { Link } from 'react-router-dom';
import { StaticPageLayout, StaticSection } from '../components/legal/StaticPageLayout';

export default function CookiePolicy() {
  return (
    <StaticPageLayout
      title="Cookie Policy"
      subtitle="How ShewaCraft Furniture uses cookies and similar storage to keep your shopping session working."
      lastUpdated="September 8, 2026"
    >
      <StaticSection title="What cookies are">
        <p>
          Cookies and similar technologies (including browser local storage) are
          small pieces of data stored on your device. ShewaCraft uses them to
          keep you signed in, remember cart and favorite items, and maintain
          basic site preferences.
        </p>
      </StaticSection>

      <StaticSection title="Essential cookies">
        <p>
          These are required for the storefront to function. Without them, you
          may not be able to sign in, stay signed in, or keep items in your
          cart.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Account session so you remain signed in while you shop.</li>
          <li>Cart and saved-item state tied to your account.</li>
          <li>Security and routing needed to load pages correctly.</li>
        </ul>
      </StaticSection>

      <StaticSection title="Preference and analytics-style cookies">
        <p>
          We may use limited preference or analytics-style storage to understand
          which catalog pages are useful and to remember simple UI choices, such
          as a previously selected product category. These do not include
          advertising networks, and we do not sell cookie data.
        </p>
      </StaticSection>

      <StaticSection title="How to control cookies">
        <p>
          You can delete or block cookies in your browser settings. If you
          disable essential storage, sign-in, cart, and favorites may not work
          as expected. Managing cookies in your browser does not change the
          personal information practices described in our{' '}
          <Link to="/privacy" className="text-gray-900 underline underline-offset-2 hover:no-underline">
            Privacy Policy
          </Link>
          .
        </p>
      </StaticSection>

      <StaticSection title="Updates">
        <p>
          We may update this policy if our use of cookies changes. The date at
          the top of this page shows when it was last revised. Questions can be
          sent through{' '}
          <Link to="/help#contact" className="text-gray-900 underline underline-offset-2 hover:no-underline">
            Help
          </Link>
          .
        </p>
      </StaticSection>
    </StaticPageLayout>
  );
}
