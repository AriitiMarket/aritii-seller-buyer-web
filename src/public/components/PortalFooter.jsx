import React from 'react';
import { Link } from 'react-router-dom';
import { useLayout } from '@/app/providers/LayoutContext';

/**
 * PortalFooter — the ONE footer for every public portal.
 *
 * The Seller Center and the Delivery Center used to carry their own copy of
 * this footer: four link columns plus a bottom bar with a sign-in call to
 * action. The copies were ~90% identical and only the labels and the accent
 * differed, so both now render this component with their own columns.
 */
const PortalFooter = ({
  accent = '#FF9900',
  accentHover = '#E68A00',
  columns = [],
  accountLabel = 'Sign in to your Seller Central account',
  signInRole = 'SELLER',
}) => {
  const { openLoginModal } = useLayout();

  return (
    <footer className="bg-[#131921] text-[#CCCCCB] mt-16 border-t border-[#232f3e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-wide">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.to.startsWith('#') ? (
                      <a
                        href={link.to}
                        className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-[#CCCCCB] hover:text-white transition-colors duration-150"
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
        <div className="py-6 border-t border-[#232f3e] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-[#CCCCCB]">© {new Date().getFullYear()} Aritii Market</span>

          <button
            type="button"
            onClick={() => openLoginModal(signInRole)}
            className="text-sm font-medium transition-colors duration-150"
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
