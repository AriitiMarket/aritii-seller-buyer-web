/**
 * Aritii Market - Theme Usage Examples
 * Copy and adapt these examples for your components
 */

// ============================================================================
// BASIC COLOR USAGE
// ============================================================================

export function ColorExamples() {
  return (
    <div className="p-8 space-y-4">
      {/* Green Colors */}
      <div className="bg-brand-green text-white p-4 rounded-lg">
        Brand Green: #083B24 (Primary)
      </div>
      <div className="bg-brand-green-dark text-white p-4 rounded-lg">
        Brand Green Dark: #052919 (Darker)
      </div>
      <div className="bg-brand-green-light text-white p-4 rounded-lg">
        Brand Green Light: #0F5435 (Lighter)
      </div>

      {/* Gold Colors */}
      <div className="bg-brand-gold text-brand-charcoal p-4 rounded-lg">
        Brand Gold: #E5A93C (Primary)
      </div>
      <div className="bg-brand-gold-hover text-white p-4 rounded-lg">
        Brand Gold Hover: #D49525 (Hover State)
      </div>

      {/* Earth Tones */}
      <div className="bg-brand-sand text-brand-charcoal p-4 rounded-lg border border-gray-300">
        Brand Sand: #F7F5F0
      </div>
      <div className="bg-brand-cream text-brand-charcoal p-4 rounded-lg border border-gray-300">
        Brand Cream: #FDFAF4
      </div>
      <div className="bg-brand-charcoal text-white p-4 rounded-lg">
        Brand Charcoal: #1A1E1C
      </div>
      <div className="bg-brand-terracotta text-white p-4 rounded-lg">
        Brand Terracotta: #C8522C
      </div>
    </div>
  );
}

// ============================================================================
// BUTTON EXAMPLES
// ============================================================================

export function ButtonExamples() {
  return (
    <div className="p-8 space-y-4">
      <div className="space-y-2">
        <h3 className="font-semibold text-brand-charcoal">Primary Button</h3>
        <button className="btn-brand-primary">
          Click Me
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-brand-charcoal">Secondary Button</h3>
        <button className="btn-brand-secondary">
          Secondary Action
        </button>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-brand-charcoal">Button Sizes</h3>
        <div className="flex gap-2">
          <button className="btn-brand-primary text-sm px-3 py-1">Small</button>
          <button className="btn-brand-primary">Medium</button>
          <button className="btn-brand-primary text-lg px-6 py-3">Large</button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-brand-charcoal">Button States</h3>
        <div className="flex gap-2">
          <button className="btn-brand-primary">Normal</button>
          <button className="btn-brand-primary opacity-50 cursor-not-allowed">Disabled</button>
          <button className="btn-brand-primary">
            <span>With Icon →</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CARD EXAMPLES
// ============================================================================

export function CardExamples() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Basic Card */}
      <div className="card-brand p-6">
        <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
          Basic Card
        </h3>
        <p className="text-gray-600 mb-4">
          This is a standard brand card with hover effects.
        </p>
        <button className="btn-brand-secondary">Learn More</button>
      </div>

      {/* Card with Tibeb Pattern */}
      <div className="tibeb-pattern-border p-6">
        <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
          Premium Card
        </h3>
        <p className="text-gray-600 mb-4">
          Card with Ethiopian Tibeb geometric pattern border.
        </p>
        <button className="btn-brand-primary">View Details</button>
      </div>

      {/* Product Card */}
      <div className="card-brand overflow-hidden">
        <div className="h-40 bg-brand-cream flex items-center justify-center">
          <span className="text-brand-gold text-4xl">📦</span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-brand-charcoal mb-1">
            Product Name
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Premium Ethiopian coffee beans
          </p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-brand-gold">$29.99</span>
            <button className="btn-brand-secondary text-sm px-3 py-1">
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Featured Card */}
      <div className="bg-brand-green text-white p-6 rounded-xl">
        <div className="badge-brand bg-brand-gold/30 text-brand-gold mb-3">
          Featured
        </div>
        <h3 className="text-lg font-semibold mb-2">
          Featured Product
        </h3>
        <p className="text-brand-green-light mb-4">
          Highlighted product with special offer
        </p>
        <button className="bg-brand-gold text-brand-charcoal px-4 py-2 rounded-lg font-semibold hover:bg-brand-gold-hover transition-colors">
          Explore
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// FORM EXAMPLES
// ============================================================================

export function FormExamples() {
  return (
    <div className="p-8 max-w-md">
      <h2 className="text-2xl font-semibold text-brand-charcoal mb-6">
        Contact Form
      </h2>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-charcoal mb-2">
            Name
          </label>
          <input
            className="input-brand"
            type="text"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-charcoal mb-2">
            Email
          </label>
          <input
            className="input-brand"
            type="email"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-charcoal mb-2">
            Message
          </label>
          <textarea
            className="input-brand min-h-32"
            placeholder="Your message..."
          />
        </div>

        <div className="pt-2">
          <button className="btn-brand-primary w-full">
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// PATTERN & DESIGN EXAMPLES
// ============================================================================

export function PatternExamples() {
  return (
    <div className="space-y-6 p-8">
      {/* Tibeb Pattern Border */}
      <div className="tibeb-pattern-border p-8 bg-white">
        <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
          Tibeb Pattern Border
        </h3>
        <p className="text-gray-600">
          This element has an Ethiopian Tibeb geometric pattern with a gold border.
        </p>
      </div>

      {/* Pattern Background Overlay */}
      <div className="pattern-bg-overlay bg-brand-cream p-8 rounded-lg">
        <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
          Pattern Background Overlay
        </h3>
        <p className="text-gray-600">
          Subtle geometric pattern overlay on cream background.
        </p>
      </div>

      {/* Combined Patterns */}
      <div className="pattern-bg-overlay bg-brand-green/10 tibeb-pattern-border p-8">
        <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
          Combined Patterns
        </h3>
        <p className="text-gray-600">
          Using both Tibeb border and background pattern for visual interest.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// TYPOGRAPHY EXAMPLES
// ============================================================================

export function TypographyExamples() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-serif text-5xl text-brand-green mb-2">
          Serif Display (Playfair)
        </h1>
        <p className="text-sm text-gray-600">
          Use font-serif for large headings and premium branding
        </p>
      </div>

      <div>
        <h2 className="font-sans text-3xl text-brand-green mb-2">
          Sans Heading (Plus Jakarta)
        </h2>
        <p className="text-sm text-gray-600">
          Use font-sans for body text and UI elements
        </p>
      </div>

      <div className="bg-brand-cream p-4 rounded-lg">
        <p className="font-sans text-brand-charcoal leading-relaxed">
          The quick brown fox jumps over the lazy dog. This is a sample paragraph
          using the Plus Jakarta Sans font family for body text. It provides excellent
          readability and modern appearance for the Aritii Market platform.
        </p>
      </div>

      <div className="flex gap-2">
        <span className="badge-brand">New</span>
        <span className="badge-brand">Featured</span>
        <span className="badge-brand">Sale</span>
      </div>
    </div>
  );
}

// ============================================================================
// COMPLETE PAGE SECTION EXAMPLE
// ============================================================================

export function HeroSection() {
  return (
    <section className="pattern-bg-overlay bg-brand-cream py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl md:text-5xl text-brand-green mb-4">
            Welcome to Aritii Market
          </h1>
          <p className="text-lg text-brand-charcoal mb-8">
            Discover authentic Ethiopian products, crafted with care and delivered with pride.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button className="btn-brand-primary">
              Start Shopping
            </button>
            <button className="btn-brand-secondary">
              Become a Seller
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedProducts() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-serif text-3xl md:text-4xl text-brand-green mb-12 text-center">
          Featured Collections
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="tibeb-pattern-border p-6 group cursor-pointer">
              <div className="h-48 bg-brand-cream rounded-lg mb-4 flex items-center justify-center group-hover:bg-brand-sand transition-colors">
                <span className="text-5xl">🌾</span>
              </div>
              <h3 className="font-semibold text-brand-charcoal mb-2">
                Collection {i}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Authentic Ethiopian products for modern living.
              </p>
              <button className="btn-brand-secondary w-full text-sm">
                Browse
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SHADOW & ELEVATION EXAMPLES
// ============================================================================

export function ShadowExamples() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="shadow-brand-sm p-6 bg-white rounded-lg text-center">
        <p className="text-sm text-gray-600">Shadow Small</p>
      </div>
      <div className="shadow-brand-md p-6 bg-white rounded-lg text-center">
        <p className="text-sm text-gray-600">Shadow Medium</p>
      </div>
      <div className="shadow-brand-lg p-6 bg-white rounded-lg text-center">
        <p className="text-sm text-gray-600">Shadow Large</p>
      </div>
      <div className="shadow-gold-glow p-6 bg-brand-gold rounded-lg text-center">
        <p className="text-sm text-brand-charcoal font-semibold">Gold Glow</p>
      </div>
    </div>
  );
}
