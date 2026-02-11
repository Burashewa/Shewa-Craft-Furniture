import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">ShewaCraft Furniture</h3>
            <p className="text-gray-400">
              Creating beautiful spaces with premium furniture since 2020.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Shop</h4>
            <ul className="space-y-2">
              {['Living Room', 'Bedroom', 'Dining Room', 'Office'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Help</h4>
            <ul className="space-y-2">
              {['Shipping Info', 'Returns', 'FAQ', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
          <p>© 2026 ShewaCraft Furniture. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((policy) => (
              <a
                key={policy}
                href="#"
                className="hover:text-white transition-colors"
              >
                {policy}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
