# Aritii Market - Configuration Directory

This directory contains the custom Tailwind CSS theme configuration and brand guidelines for the Aritii Market platform.

## 📁 Contents

### Core Files

- **`tailwind.config.js`** - Main Tailwind CSS configuration with Ethiopian brand colors, fonts, and custom component classes
- **`theme.js`** - Exported color palette and font family constants for use in JavaScript/React
- **`index.js`** - Central export hub for importing theme configuration

### Documentation

- **`THEME_GUIDE.md`** - Comprehensive guide to using the theme, colors, fonts, and patterns
- **`USAGE_EXAMPLES.jsx`** - React component examples showing how to implement the theme
- **`INTEGRATION.md`** - Step-by-step guide to integrate the custom configuration into your project
- **`README.md`** - This file

## 🎨 Ethiopian Brand Palette

### Primary Colors

- **Brand Green**: `#083B24` - Deep Ethiopian Forest Green
- **Brand Green Dark**: `#052919` - Darker variant
- **Brand Green Light**: `#0F5435` - Lighter variant

### Accent Colors

- **Brand Gold**: `#E5A93C` - Warm Imperial Gold
- **Brand Gold Hover**: `#D49525` - Interactive state

### Support Colors

- **Brand Sand**: `#F7F5F0` - Light background
- **Brand Cream**: `#FDFAF4` - Warm cream background
- **Brand Charcoal**: `#1A1E1C` - Primary text color
- **Brand Terracotta**: `#C8522C` - Warm accent

## 🔤 Typography

- **Sans-Serif (Default)**: Plus Jakarta Sans — for body text and UI
- **Serif (Display)**: Playfair Display — for headings and branding

## 🎭 Utilities & Patterns

### Pre-built Component Classes

- `.btn-brand-primary` - Primary action button (green)
- `.btn-brand-secondary` - Secondary action button (gold)
- `.card-brand` - Styled card with hover effects
- `.input-brand` - Styled form input
- `.badge-brand` - Badge/tag component
- `.text-brand-primary` - Primary text color
- `.bg-brand-primary` - Primary background color

### Pattern Classes

- `.tibeb-pattern-border` - Ethiopian geometric pattern border with diagonal stripes
- `.pattern-bg-overlay` - Subtle geometric diamond pattern background

## 🚀 Quick Start

### 1. Import Theme in Your Component

```jsx
import { colors, fonts } from '@/config/theme.js';

// Use in Tailwind classes
<div className="bg-brand-green text-white">Content</div>

// Use in styles
const style = { color: colors.brand.gold };
```

### 2. Use Pre-built Components

```jsx
<button className="btn-brand-primary">Click Me</button>
<div className="card-brand p-6">Card content</div>
<input className="input-brand" type="text" />
```

### 3. Apply Patterns

```jsx
<div className="tibeb-pattern-border p-6">
  Premium featured card
</div>

<section className="pattern-bg-overlay bg-brand-cream">
  Section with subtle pattern
</section>
```

## 📚 Documentation Files

### Start Here
1. **README.md** (this file) - Overview and quick reference
2. **THEME_GUIDE.md** - Comprehensive theme documentation

### Implementation
3. **USAGE_EXAMPLES.jsx** - React component examples
4. **INTEGRATION.md** - Integration into your project

## 🎯 Color Usage by Component

| Component | Primary Color | Secondary Color | Text Color |
|-----------|---------------|-----------------|-----------|
| Buttons | `brand-green` | `brand-gold` | `white` / `charcoal` |
| Cards | `white` | `brand-green` | `charcoal` |
| Badges | `brand-gold` | N/A | `brand-gold` |
| Inputs | `white` | `brand-gold` | `charcoal` |
| Headings | N/A | N/A | `brand-green` |
| Body Text | N/A | N/A | `brand-charcoal` |
| Backgrounds | `brand-cream` | `brand-sand` | N/A |

## ✨ Shadow Utilities

- `.shadow-brand-sm` - Subtle shadow (2px blur)
- `.shadow-brand-md` - Medium shadow (4px blur)
- `.shadow-brand-lg` - Large shadow (12px blur)
- `.shadow-gold-glow` - Glowing effect for gold elements

## 🔄 Migration from Old Theme

### Old Colors → New Colors

| Old | New | Usage |
|-----|-----|-------|
| `#0B6E4F` (green) | `brand-green` | Primary actions |
| `#F5A623` (accent) | `brand-gold` | Secondary actions |
| `#C0392B` (red) | `brand-terracotta` | Error states |
| `#FDF6EC` (cream) | `brand-cream` | Backgrounds |

## 📱 Responsive Breakpoints

Tailwind's default breakpoints are available:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px
- `2xl:` - 1536px

Plus custom breakpoints:
- `400px:` - 400px
- `800px:` - 800px
- `1000px:` - 1050px
- `1100px:` - 1110px
- `1300px:` - 1300px

## 🔍 Accessibility

All brand colors meet WCAG AA contrast standards:
- Text on white backgrounds: ✓ AA compliant
- Gold on charcoal: ✓ AA compliant
- Green on white: ✓ AAA compliant

Form inputs include focus states for keyboard navigation.

## 💡 Tips & Best Practices

1. **Use classes over inline styles** - Leverage Tailwind's utility-first approach
2. **Keep patterns subtle** - Use `tibeb-pattern-border` for special sections
3. **Combine utilities** - `btn-brand-primary hover:shadow-brand-lg`
4. **Test contrast** - Use browser DevTools color picker on all new components
5. **Extend thoughtfully** - Add new utilities only when needed

## 🚨 Common Mistakes

❌ **Wrong:**
```jsx
<button style={{backgroundColor: '#083B24'}}>Click</button>
```

✅ **Right:**
```jsx
<button className="btn-brand-primary">Click</button>
```

❌ **Wrong:**
```jsx
<div className="font-sans text-xl text-red-500">Error</div>
```

✅ **Right:**
```jsx
<div className="font-sans text-xl text-brand-terracotta">Error</div>
```

## 📞 Support

- For theme documentation: See `THEME_GUIDE.md`
- For implementation examples: See `USAGE_EXAMPLES.jsx`
- For integration steps: See `INTEGRATION.md`
- For configuration details: See `tailwind.config.js`

## 🔄 Updating the Theme

To modify colors or add new utilities:

1. Edit `tailwind.config.js` in the `colors` or `extend` section
2. If adding exported constants, update `theme.js`
3. Rebuild: `npm run dev` (development) or `npm run build` (production)
4. Test in browser and update `THEME_GUIDE.md` if needed

## 📄 Configuration Version

- **Version**: 1.0.0
- **Created**: September 13, 2026
- **Tailwind CSS**: v3+
- **React**: v18+
- **Node.js**: v18+

---

**Next Step**: Read `THEME_GUIDE.md` for comprehensive theme documentation and implementation patterns.
