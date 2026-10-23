import { Link } from 'react-router-dom';
import HeaderSearch from '@/shared/components/header/HeaderSearch';
import { AiOutlineArrowRight } from 'react-icons/ai';
import AritiiLogo from '@/assets/images/brand/aritii-logo.svg';
import { useCatalogCategories } from '@/shared/hooks/useCatalogCategories';

/**
 * Hero - the front door of Aritii Market.
 *
 * Messaging: "Discover. Shop. Sell. Deliver. All in one local marketplace."
 * The hero visual (seller → delivery → buyer) is part of the composition, not a
 * decorative afterthought: it shows how the three experiences connect.
 *
 * CTAs: Explore Marketplace (primary), Sell on Aritii, Delivery Services.
 */

const HeroSection = () => {
  const { categories = [] } = useCatalogCategories({ type: 'product' });

  return (
    <section className="relative isolate w-full min-h-[640px] overflow-hidden bg-[#20305c] sm:min-h-[700px] lg:min-h-[720px]">
      <img
        src="/banner.png"
        alt=""
        aria-hidden="true"
        className="hero-banner-motion absolute inset-0 h-full w-full object-cover object-[54%_center] sm:object-center"
        width="1774"
        height="887"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-[#142044]/55 sm:hidden" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#142044]/10 via-[#20305c]/10 to-[#20305c] sm:bg-gradient-to-r sm:from-[#142044]/90 sm:via-[#20305c]/75 sm:to-[#20305c]/35" aria-hidden="true" />
      <div className="absolute inset-0 hidden bg-gradient-to-t from-[#142044]/55 via-transparent to-[#142044]/15 sm:block" aria-hidden="true" />
      <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Soft glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-16 left-6 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-24 right-10 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-[640px] w-full max-w-7xl flex-col justify-center px-4 pb-16 pt-8 sm:min-h-[700px] sm:px-6 sm:pb-20 sm:pt-12 lg:min-h-[720px] lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 items-center">
          {/* ===== Copy column ===== */}
          <div className="hero-entrance mx-auto w-full max-w-4xl text-center lg:mx-0 lg:text-left">
            <div className="mb-5 flex items-center justify-center gap-3 sm:mb-6 lg:justify-start">
              <img src={AritiiLogo} alt="Aritii Market" className="h-10 w-auto rounded-lg bg-white p-1.5 shadow-lg sm:h-14" />
              <span className="text-left text-sm font-semibold uppercase tracking-[0.22em] text-white/90">Aritii Market</span>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 bg-white/15 border border-white/25 rounded-full text-white text-xs sm:text-sm font-medium backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden="true" />
              The local commerce journey, all connected
            </span>

            <h1 className="mx-auto mb-4 max-w-4xl text-[2rem] font-extrabold leading-[1.12] text-white sm:mb-5 sm:text-4xl md:text-5xl lg:mx-0 lg:text-6xl">
              Discover. Shop. Sell. Deliver.
              <span className="block text-white/90 mt-1">Every step, in one local marketplace.</span>
            </h1>

            <p className="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-white/95 sm:mb-7 sm:text-base lg:mx-0 xl:text-lg">
              Shop trusted local finds, grow your business, and get every order delivered to your door. Aritii brings your whole community together in one easy marketplace.
            </p>

            {/* CTAs — wrap gracefully on md–lg where three buttons meet the text column */}
            <div className="mb-5 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 lg:justify-start">
              <Link
                to="/marketplace"
                className="group w-full rounded-full bg-white px-5 py-3 text-sm font-bold text-[#4a8f28] shadow-xl transition-all duration-300 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-auto sm:px-6 sm:py-3.5 sm:text-base xl:px-8 flex items-center justify-center gap-2"
              >
                <span>Explore Marketplace</span>
                <AiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              <Link
                to="/sell-on-aritii"
                className="w-full rounded-full border border-white/25 bg-[#141414]/80 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/50 hover:bg-[#141414] sm:w-auto sm:px-6 sm:py-3.5 sm:text-base xl:px-8 flex items-center justify-center"
              >
                Sell on Aritii
              </Link>
              <Link
                to="/delivery"
                className="w-full rounded-full border border-white/30 bg-white/15 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/50 hover:bg-white/25 sm:w-auto sm:px-6 sm:py-3.5 sm:text-base xl:px-8 flex items-center justify-center backdrop-blur-sm"
              >
                Delivery Services
              </Link>
            </div>

            <div className="mb-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold sm:text-sm lg:justify-start">
              <Link to="/categories" className="text-white underline decoration-white/50 underline-offset-4 hover:decoration-white">Browse categories</Link>
              <Link to="/products" className="text-white underline decoration-white/50 underline-offset-4 hover:decoration-white">Shop all products</Link>
            </div>

            {/* Trust micro-copy */}
            <p className="mx-auto max-w-xl text-xs text-white/85 sm:text-sm lg:mx-0">
              Secure payments · Verified local sellers · Tracked delivery to your door
            </p>
          </div>

        </div>

        {/* ===== Search + quick categories ===== */}
        <div className="hero-entrance hero-entrance-delay-2 mx-auto mt-7 w-full max-w-3xl sm:mt-10">
          <HeaderSearch
            dark
            variant="inline"
            destination={(term) => `/products?search=${encodeURIComponent(term.trim())}`}
            placeholder="Search for products, shops, and more..."
            ariaLabel="Search marketplace"
            className="w-full"
          />

          {/* Quick trending category & logistics pills from backend */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-white/70 font-semibold">Trending Categories:</span>
            {categories.slice(0, 4).map((cat) => {
              const title = typeof cat === 'string' ? cat : cat.title || cat.name;
              if (!title) return null;
              return (
                <Link
                  key={cat._id || cat.id || title}
                  to={`/products?category=${encodeURIComponent(title)}`}
                  className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm transition-colors font-medium"
                >
                  {title}
                </Link>
              );
            })}
            <Link to="/deals" className="px-3 py-1 rounded-full bg-[#febd69]/25 hover:bg-[#febd69]/35 text-[#febd69] font-bold backdrop-blur-sm transition-colors">
              ⚡ Daily Deals
            </Link>
            <Link to="/delivery" className="px-3 py-1 rounded-full bg-[#00A8E1]/25 hover:bg-[#00A8E1]/35 text-[#58ccff] font-bold backdrop-blur-sm transition-colors">
              🚚 Express Delivery
            </Link>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,60 C480,20 960,100 1440,60 L1440,120 L0,120 Z" className="fill-white dark:fill-gray-900" />
      </svg>
    </section>
  );
};

export { HeroSection };
export default HeroSection;
