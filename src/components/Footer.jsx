import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const shopLinks = [
  { label: 'Living Room', to: '/products?category=Living Room' },
  { label: 'Bedroom', to: '/products?category=Bedroom' },
  { label: 'Dining Room', to: '/products?category=Dining' },
  { label: 'Office', to: '/products?category=Office' },
];

const helpLinks = [
  { label: 'Shipping Info', to: '/help#shipping' },
  { label: 'Returns', to: '/help#returns' },
  { label: 'FAQ', to: '/help#faq' },
  { label: 'Contact Us', to: '/help#contact' },
];

const policyLinks = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Cookie Policy', to: '/cookies' },
];

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/', icon: Facebook },
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: Instagram },
  { label: 'Twitter', href: 'https://x.com/', icon: Twitter },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">
              <Link to="/" className="hover:text-gray-200 transition duration-200">
                ShewaCraft Furniture
              </Link>
            </h3>
            <p className="text-gray-400">
              Creating beautiful spaces with premium furniture since 2020.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 hover:scale-105 transition duration-200 motion-reduce:transform-none focus:outline-none focus:ring-2 focus:ring-gray-500"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Shop</h4>
            <ul className="space-y-2">
              {shopLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-gray-400 hover:text-white transition duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Help</h4>
            <ul className="space-y-2">
              {helpLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-gray-400 hover:text-white transition duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
          <p>© 2026 ShewaCraft Furniture. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            {policyLinks.map((policy) => (
              <Link
                key={policy.label}
                to={policy.to}
                className="hover:text-white transition duration-200"
              >
                {policy.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
