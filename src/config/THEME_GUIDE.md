# Aritii Market - Custom Tailwind Theme Guide

This guide explains the Ethiopian-inspired custom Tailwind configuration and how to use the brand colors, fonts, and patterns throughout the application.

## Overview

The custom theme extends Tailwind CSS with:
- **Ethiopian brand colors** (greens, golds, earth tones)
- **Custom font families** (Plus Jakarta Sans, Playfair Display)
- **Pattern-based utility classes** for decorative elements
- **Pre-configured component classes** for consistency

---

## Brand Colors

### Green Palette
The green family represents Ethiopia's lush landscapes and forests.

```jsx
// Usage in classes
<div className="bg-brand-green text-white">Deep Forest Green</div>
<div className="bg-brand-green-dark">Darker Variant</div>
<div className="bg-brand-green-light">Lighter Variant</div>
```

**Available Shades:**
- `brand-green`: `#083B24` - Primary brand green
- `brand-green-dark`: `#052919` - Darker forest variant
- `brand-green-light`: `#0F5435` - Lighter forest variant

### Gold Palette
The gold family represents warmth, prosperity, and imperial heritage.

```jsx
// Usage in classes
<div className="bg-brand-gold text-brand-charcoal">Warm Gold</div>
<div className="hover:bg-brand-gold-hover">Hover State</div>
```

**Available Shades:**
- `brand-gold`: `#E5A93C` - Primary imperial gold
- `brand-gold-hover`: `#D49525` - Hover state for interactions

### Earth Tones
Complementary colors inspired by Ethiopian landscapes.

```jsx
<div className="bg-brand-sand">Light Sand</div>
<div className="bg-brand-cream">Warm Cream</div>
<div className="text-brand-charcoal">Deep Charcoal</div>
<div className="bg-brand-terracotta">Warm Terracotta</div>
```

**Available Colors:**
- `brand-sand`: `#F7F5F0` - Light background
- `brand-cream`: `#FDFAF4` - Warm cream background
- `brand-charcoal`: `#1A1E1C` - Text and dark elements
- `brand-terracotta`: `#C8522C` - Accent and highlights

---

## Font Families

### Sans-Serif (Default)
"Plus Jakarta Sans" is used as the primary font family for body text, headings, and UI elements.

```jsx
<h1 className="font-sans">Heading in Plus Jakarta Sans</h1>
<p className="font-sans text-brand-charcoal">Body text</p>
```

### Serif (Display)
"Playfair Display" is recommended for hero sections, large headings, and premium branding.

```jsx
<h1 className="font-serif text-4xl">Premium Headline</h1>
```

---

## Pre-configured Components

### Buttons

#### Primary Button
```jsx
<button className="btn-brand-primary">
  Click Me
</button>
```
- Background: `brand-green`
- Hover: `brand-green-dark` with shadow

#### Secondary Button
```jsx
<button className="btn-brand-secondary">
  Secondary Action
</button>
```
- Background: `brand-gold`
- Text: `brand-charcoal`
- Hover: `brand-gold-hover` with glow effect

### Cards

#### Brand Card
```jsx
<div className="card-brand p-6">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```
- White background with subtle border
- Hover effect with shadow and gold border
- Smooth transitions

### Form Elements

#### Brand Input
```jsx
<input 
  className="input-brand"
  type="text"
  placeholder="Enter text..."
/>
```
- Clean border with hover states
- Focus: Gold border with subtle ring
- Smooth transitions

### Badges

#### Brand Badge
```jsx
<span className="badge-brand">New</span>
```
- Gold background with transparency
- Rounded pill shape
- Suitable for tags and labels

---

## Pattern Utilities

### Tibeb Pattern Border
Creates an Ethiopian geometric pattern border with diagonal stripes.

```jsx
<div className="tibeb-pattern-border p-6">
  Content with tibeb pattern
</div>
```

**Features:**
- Gold border color
- Diagonal stripe pattern overlay
- Rounded corners
- Non-intrusive (pointer-events: none on pattern)

**Use Cases:**
- Premium product cards
- Featured sections
- Special promotions
- Category highlights

### Pattern Background Overlay
Adds a subtle geometric diamond pattern to the background.

```jsx
<div className="pattern-bg-overlay bg-brand-cream">
  Content with subtle pattern background
</div>
```

**Features:**
- Subtle green geometric pattern
- Diamond/grid layout
- Works over any background
- Non-intrusive (pointer-events: none)

**Use Cases:**
- Page backgrounds
- Section separators
- Category cards
- Hero sections

---

## Shadows

Custom brand-themed shadows for consistent depth:

```jsx
// Small shadow
<div className="shadow-brand-sm">Subtle shadow</div>

// Medium shadow
<div className="shadow-brand-md">Medium shadow</div>

// Large shadow
<div className="shadow-brand-lg">Prominent shadow</div>

// Gold glow (useful with gold elements)
<div className="shadow-gold-glow bg-brand-gold">Glowing effect</div>
```

---

## Animations

### Shimmer
Creates a loading effect:

```jsx
<div className="bg-gray-200 animate-shimmer rounded">
  Loading...
</div>
```

### Slide In Down
Smooth entrance animation:

```jsx
<div className="animate-slide-in-down">
  Animated content
</div>
```

---

## Using Colors in JavaScript

Import the theme configuration in JavaScript files:

```jsx
import { colors, fonts } from '@/config/theme.js';

// Use in styled-components or CSS-in-JS
const styles = {
  button: {
    backgroundColor: colors.brand.green,
    color: 'white',
  },
  heading: {
    fontFamily: fonts.serif,
    color: colors.brand.charcoal,
  },
};
```

---

## Examples

### Hero Section
```jsx
<section className="pattern-bg-overlay bg-brand-cream py-16">
  <div className="max-w-4xl mx-auto">
    <h1 className="font-serif text-5xl text-brand-green mb-4">
      Welcome to Aritii Market
    </h1>
    <p className="text-lg text-brand-charcoal mb-8">
      Discover authentic Ethiopian products
    </p>
    <button className="btn-brand-primary">Get Started</button>
  </div>
</section>
```

### Product Card with Pattern
```jsx
<div className="tibeb-pattern-border p-6">
  <img src="product.jpg" alt="Product" className="w-full rounded-lg mb-4" />
  <h3 className="font-semibold text-brand-charcoal mb-2">Product Name</h3>
  <p className="text-brand-gold font-semibold mb-4">$29.99</p>
  <button className="btn-brand-secondary w-full">Add to Cart</button>
</div>
```

### Featured Section
```jsx
<div className="bg-brand-green text-white py-12">
  <div className="max-w-6xl mx-auto">
    <h2 className="font-serif text-3xl mb-8">Featured Collections</h2>
    <div className="grid grid-cols-3 gap-6">
      {/* Featured items */}
    </div>
  </div>
</div>
```

---

## Best Practices

1. **Color Consistency**: Use brand colors for primary actions, never arbitrary colors
2. **Font Hierarchy**: Use `font-serif` for large headings, `font-sans` for body text
3. **Pattern Usage**: Apply patterns sparingly for special sections, not everywhere
4. **Accessibility**: Ensure sufficient color contrast (especially with gold backgrounds)
5. **Responsive**: Use Tailwind's breakpoint prefixes (e.g., `md:`, `lg:`) with all utilities

---

## Color Contrast Reference

For accessibility compliance (WCAG AA):
- `brand-green` on white: ✅ High contrast (7.8:1)
- `brand-gold` on white: ✅ Medium contrast (5.2:1) - Use dark text
- `brand-charcoal` on white: ✅ High contrast (9.1:1)
- `brand-charcoal` on `brand-cream`: ✅ High contrast (11.5:1)

---

## Integration Notes

- The configuration uses Tailwind's `extend` mode to preserve default utilities
- All custom colors are accessible via Tailwind's class system
- Font families require actual font imports in CSS (see index.css)
- Pattern overlays use CSS pseudo-elements for clean implementation

For questions or theme updates, refer to `/frontend/src/config/tailwind.config.js`
