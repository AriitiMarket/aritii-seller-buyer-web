import React from 'react';
import { Link } from 'react-router-dom';
import { useLayout } from '@/app/providers/LayoutContext';

/**
 * PortalFooter — The consolidated footer for public portals.
 */
const PortalFooter = ({
  accent = '#f59e0b',
  accentHover = '#d97706',
  columns = [],
  accountLabel = 'Sign in to your Seller Central account',
  signInRole = 'SELLER',
}) => {
  const { openLoginModal } = useLayout();

  return (
    <footer className="bg-[#141414] text-gray-400 mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wide">
                {column.title}
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.to.startsWith('#') ? (
                      <a
                        href={link.to}
                        className="text-gray-400 hover:text-white transition-colors duration-150"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-gray-400 hover:text-white transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-400">© {new Date().getFullYear()} Aritii Market</span>

          <button
            type="button"
            onClick={() => openLoginModal(signInRole)}
            className="text-sm font-medium transition-colors duration-150 cursor-pointer"
            style={{ color: accent }}
            onMouseEnter={(e) => (e.currentTarget.style.color = accentHover)}
            onMouseLeave={(e) => (e.currentTarget.style.color = accent)}
          >
            {accountLabel}
          </button>
        </div>
      </div>
    </footer>
  );
};

export { PortalFooter };
export default PortalFooter;
