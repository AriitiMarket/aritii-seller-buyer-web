import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineRight } from 'react-icons/ai';
import { EXPERIENCES } from '@/public/experiences';

/**
 * ExperiencePageHeader — THE standard page header for every public experience.
 *
 * One consistent structure so all public pages read as one platform:
 *
 *   [breadcrumb]                      ← where you are
 *   [experience badge]                ← which experience you are in (accented)
 *   [title]                           ← what this page is (h1)
 *   [description]                     ← what it offers you
 *   [actions]                         ← the next step (max 2 CTAs)
 *
 * Marketplace → brand green · Seller → deep forest · Delivery → slate blue.
 * Typography, spacing, radii and focus states are identical everywhere; only
 * the accent shifts with the experience.
 *
 * Usage:
 *   <ExperiencePageHeader
 *     experience={EXPERIENCES.seller}
 *     breadcrumb={[{ label: 'Home', to: '/' }]}
 *     badge="For sellers & businesses"
 *     title="Sell on Aritii"
 *     description="…"
 *     actions={<Link to="/become-a-seller">Start Selling</Link>}
 *   />
 */
const ExperiencePageHeader = ({
  experience = EXPERIENCES.marketplace,
  breadcrumb = [],
  badge,
  title,
  description,
  actions = null,
  children = null,
  visual = null,
  size = 'md',
}) => {
  const titleSize =
    size === 'lg'
      ? 'text-3xl md:text-4xl lg:text-5xl'
      : size === 'sm'
        ? 'text-2xl md:text-3xl'
        : 'text-3xl md:text-4xl';

  return (
    <section
      className="relative w-full bg-[#20305c] border-b border-[#20305c] overflow-hidden"
    >
      {/* Soft accent glow, themed per experience */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.55] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 12% 20%, ${experience.accent}22, transparent 42%), radial-gradient(circle at 88% 75%, ${experience.accent}14, transparent 40%)`,
        }}
      />

      <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 md:py-14 ${visual ? 'grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12' : ''}`}>
        {visual && <div className="order-2 lg:order-2">{visual}</div>}
        <div className={visual ? 'order-1 lg:order-1' : ''}>
        {/* Breadcrumb */}
        {breadcrumb.length > 0 && (
          <nav className="flex items-center flex-wrap gap-x-1.5 gap-y-1 text-[13px] sm:text-sm mb-4 md:mb-5" aria-label="Breadcrumb">
            {breadcrumb.map((item, index) => {
              const last = index === breadcrumb.length - 1;
              return (
                <React.Fragment key={`${item.label}-${index}`}>
                  {index > 0 && (
                    <AiOutlineRight
                      size={12}
                      className="text-white/40 flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  {item.to && !last ? (
                    <Link
                      to={item.to}
                      className="text-white/75 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-white font-medium" aria-current={last ? 'page' : undefined}>
                      {item.label}
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {/* Experience badge */}
        {badge && (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 mb-4 rounded-full border border-white/20 bg-white/10 text-white text-xs font-bold uppercase tracking-wider"
          >
            {badge}
          </span>
        )}

        {/* Title */}
        <h1 className={`${titleSize} font-extrabold text-white leading-tight text-balance ${description ? 'mb-4' : ''}`}>
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mb-6">
            {description}
          </p>
        )}

        {/* Actions */}
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}

        {children}
        </div>
      </div>
    </section>
  );
};

export default ExperiencePageHeader;
