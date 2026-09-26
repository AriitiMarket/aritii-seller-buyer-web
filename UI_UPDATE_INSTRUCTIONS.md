# Aritii Market — Complete UI/UX Redesign Instructions

> **Purpose:** Update the entire frontend seller/buyer/marketplace/public app to match the
> Multivendor-Web (Next.js) design language. **No logic changes.** Only visual, layout,
> spacing, color, typography, and animation updates.
>
> **Target Design Source:** `/home/yihunebelay/Desktop/aritii-market/Multivendor-Web`
> **App Being Updated:** `/home/yihunebelay/Desktop/aritii-market/frontend`

---

## TABLE OF CONTENTS

1. [Design System Foundation](#1-design-system-foundation)
2. [Common UI Components](#2-common-ui-components)
3. [Public Section (Landing, Header, Footer)](#3-public-section)
4. [Marketplace Section](#4-marketplace-section)
5. [Buyer Section](#5-buyer-section)
6. [Business / Seller Section](#6-business--seller-section)
7. [Auth Section](#7-auth-section)
8. [Shared Hooks & Utilities (Visual Only)](#8-shared-hooks--utilities)
9. [File-by-File Checklist](#9-file-by-file-checklist)

---

## 1. DESIGN SYSTEM FOUNDATION

### 1.1 Tailwind Config — `tailwind.config.cjs`

**Replace the entire `theme.extend.colors` block:**

```js
// REMOVE these colors:
// brand-primary: '#0B6E4F'
// brand-green-dark: '#0B5A3F'
// brand-green: '#16A34A'
// brand-accent: '#F5A623'
// brand-gold: '#D4AF37'
// brand-secondary: '#C0392B'
// brand-cream: '#FDF6EC'
// brand-charcoal: '#1F2937'
// brand-muted: '#6B7280'
// brand-border: '#E5E7EB'

// ADD these colors (matching Multivendor-Web):
colors: {
  brand: {
    primary: '#75d04b',        // Lime green — the main brand color
    'primary-light': '#f3ffee', // Very light green tint for badges/bgs
    'primary-dark': '#5ac12f',  // Darker green for pressed states
    'primary-hover': '#68c73e',
    'primary-pressed': '#56b02f',
    'primary-disabled': '#b9e8a3',
    'secondary-border': '#111827',
    dark: '#141414',            // Footer bg, dark surfaces
  },
},
```

**Replace the entire `theme.extend.fontFamily` block:**

```js
fontFamily: {
  inter: ['Inter', 'sans-serif'],   // Primary font (replaces Poppins/Roboto)
},
```

**Replace the entire `theme.extend` block with:**

```js
extend: {
  colors: { /* as above */ },
  fontFamily: { /* as above */ },
  width: {
    'custom-button': '110px',
    'app-bar-search': '408px',
  },
  height: {
    'custom-button': '45px',
  },
  fontSize: {
    'heading-1': '20px',
    'heading-2': '36px',
    'card-h1': '16px',
  },
  scale: {
    '102': '1.02',
  },
  container: {
    center: true,
    padding: '2rem',
    screens: {
      '2xl': '1400px',
    },
  },
},
```

**Add dark mode config at root level:**

```js
darkMode: 'class',
```

**Add plugin:**

```js
plugins: [
  require('tailwind-scrollbar'),
],
```

**Update `content` paths:**

```js
content: [
  './index.html',
  './src/**/*.{js,jsx}',
],
```

---

### 1.2 CSS Variables — `src/styles/variables.css`

**Replace ALL contents with:**

```css
:root {
  --primary-color: #75d04b;
  --primary-light: #f3ffee;
  --primary-dark: #5ac12f;
  --primary-hover: #68c73e;
  --primary-pressed: #56b02f;
  --primary-focus: rgba(117, 208, 75, 0.32);
  --primary-disabled: #b9e8a3;
  --secondary-color: #75d04b;
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 255, 255, 255;
  --background-end-rgb: 255, 255, 255;
}

/* Dark mode variables */
.dark {
  --foreground-rgb: 255, 255, 255;
  --background-start-rgb: 17, 24, 39;
  --background-end-rgb: 17, 24, 39;
}
```

---

### 1.3 Global CSS — `src/styles/globals.css`

**Replace ALL contents with the following structure:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ===== RESET ===== */
*, *::before, *::after {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  overflow: auto;
  overflow-x: hidden;
}

body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ===== SCROLLBAR ===== */
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.8);
}
::-webkit-scrollbar-thumb {
  background: #d3d3d3;
  border-radius: 7px;
}

/* ===== TYPOGRAPHY SCALE ===== */
@layer components {
  .heading-1 { font-size: 30px; line-height: 40px; font-weight: 700; }
  .heading-2 { font-size: 22px; line-height: 40px; font-weight: 700; }
  .heading-3 { font-size: 20px; line-height: 36px; font-weight: 700; }
  .heading-4 { font-size: 18px; line-height: 32px; font-weight: 700; }
  .heading-5 { font-size: 16px; line-height: 28px; font-weight: 700; }
  .heading-6 { font-size: 14px; line-height: 24px; font-weight: 700; }
  .heading-7 { font-size: 12px; line-height: 20px; font-weight: 700; }

  .card-h1 { font-size: 15px; line-height: 20px; letter-spacing: 3%; font-weight: 700; }
  .card-h2 { font-size: 13px; line-height: 20px; letter-spacing: 3%; font-weight: 400; }
  .card-h3 { font-size: 11px; line-height: 20px; letter-spacing: 3%; font-weight: 400; }
}

/* ===== LAYOUT SYSTEM ===== */
@layer components {
  .screen-container {
    display: flex;
    flex-direction: column;
    height: 90dvh;
    overflow-y: auto;
  }

  .layout-top-container {
    position: sticky;
    z-index: 997;
    left: 0;
    top: 0;
    width: 100%;
    border-bottom: 0.2px solid rgba(0, 0, 0, 0.1);
  }

  .layout-main-container {
    display: flex;
  }

  .layout-main {
    width: 100%;
    position: relative;
  }

  .padding-container {
    @apply w-full px-4 md:px-6 lg:px-12 xl:px-20 2xl:px-[80px];
  }
}

/* ===== DARK MODE OVERRIDES ===== */
.dark body,
.dark #root {
  background-color: #111827;
  color: white;
}

/* ===== ANIMATIONS ===== */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
```

---

### 1.4 Theme — `src/styles/theme.js`

**Replace ALL contents:**

```js
const theme = {
  colors: {
    primary: '#75d04b',
    'primary-light': '#f3ffee',
    'primary-dark': '#5ac12f',
    'primary-hover': '#68c73e',
    'primary-pressed': '#56b02f',
    'primary-focus': 'rgba(117, 208, 75, 0.32)',
    'primary-disabled': '#b9e8a3',
    secondary: '#75d04b',
    background: '#ffffff',
    surface: '#ffffff',
    text: '#000000',
    muted: '#6b7280',
    border: '#e5e7eb',
    dark: '#141414',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
  },
  fonts: {
    primary: 'Inter, sans-serif',
    heading: 'Inter, sans-serif',
  },
  roundness: {
    button: '9999px',
    card: '8px',
    input: '8px',
    modal: '12px',
    badge: '9999px',
  },
  shadow: {
    card: '0 1px 3px rgba(0, 0, 0, 0.1)',
    hover: '0 4px 12px rgba(0, 0, 0, 0.15)',
    button: 'none',
    topbar: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
};

export default theme;
```

---

### 1.5 Styles Utility — `src/styles/styles.js`

**Replace ALL contents:**

```js
const styles = {
  custom_container: 'w-full px-4 md:px-6 lg:px-12 xl:px-20 2xl:px-[80px]',
  heading: 'text-xl md:text-2xl lg:text-[30px] font-bold font-inter',
  section: 'w-full px-4 md:px-6 lg:px-12 xl:px-20 2xl:px-[80px]',
  productTitle: 'text-base font-semibold text-gray-900 dark:text-white',
  productDiscountPrice: 'font-bold text-base text-[#75d04b] font-inter',
  price: 'font-medium text-sm text-gray-400 line-through pl-3',
  shop_name: 'pt-3 text-sm text-[#75d04b] pb-3',
  active_indicator: 'absolute bottom-[-27%] left-0 h-[3px] w-full bg-[#75d04b]',
  button: 'h-[45px] min-w-[110px] bg-[#75d04b] text-white font-semibold rounded-full hover:brightness-95 active:scale-[0.98] transition-all duration-200',
  cart_button: 'px-5 h-[38px] rounded-full bg-[#75d04b] flex items-center justify-center cursor-pointer',
  cart_button_text: 'text-white text-sm font-semibold',
  input: 'w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25 transition-all duration-200',
  activeStatus: 'w-[10px] h-[10px] rounded-full absolute top-0 right-1 bg-[#75d04b]',
  noramlFlex: 'flex items-center',
};

export default styles;
```

---

### 1.6 Styles Index — `src/styles/index.js`

**Replace ALL contents:**

```js
export { default as theme } from './theme';
export { default as styles } from './styles';
```

---

## 2. COMMON UI COMPONENTS

### 2.1 Button — `src/components/common/Button/Button.jsx`

**Current:** Green-700 bg, rounded-lg, Poppins font.
**Target:** Lime green `#75d04b` bg, `rounded-full`, Inter font.

```jsx
// REPLACE the button className with:
const Button = ({ children, type = 'button', className = '', ...props }) => {
  return (
    <button
      type={type}
      className={`h-[45px] min-w-[110px] px-5 bg-[#75d04b] text-white font-semibold
        text-sm rounded-full shadow-none
        hover:brightness-95 active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
        focus-visible:ring-2 focus-visible:ring-[#75d04b]/40
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

**Delete** `Button.module.css` — no longer needed.

---

### 2.2 Input — `src/components/common/Input/Input.jsx`

**Current:** Gray-200 border, rounded-lg.
**Target:** Same border but with green focus ring.

```jsx
const Input = ({ label, id, className = '', ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm
          placeholder:text-gray-400
          focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25 focus:outline-none
          dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500
          transition-all duration-200"
        {...props}
      />
    </div>
  );
};
```

**Delete** `Input.module.css`.

---

### 2.3 Modal — `src/components/common/Modal/Modal.jsx`

**Current:** Basic fixed overlay, no animation.
**Target:** Animated overlay with framer-motion style, `rounded-xl`, dismissible mask.

```jsx
import { useEffect } from 'react';

const Modal = ({ open, title, children, onClose }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in-up">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-gray-900 dark:text-white p-6 shadow-xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
            text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        {title && (
          <div className="mb-4 pr-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          </div>
        )}

        {/* Content */}
        <div className="pt-2">{children}</div>
      </div>
    </div>
  );
};
```

**Delete** `Modal.module.css`.

---

### 2.4 Loading — `src/components/common/Loading/Loading.jsx`

**Current:** `border-brand-border` + `border-t-brand-primary`.
**Target:** `border-gray-200` + `border-t-[#75d04b]`.

```jsx
const Loading = ({ variant = 'page', label = '' }) => {
  if (variant === 'inline') {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-[#75d04b]" />
        {label && <p className="mt-2 text-sm text-gray-500">{label}</p>}
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="h-20 w-20 animate-spin rounded-full border-4 border-gray-200 border-t-[#75d04b]" />
      {label && <p className="mt-4 text-sm text-gray-500">{label}</p>}
    </div>
  );
};
```

---

### 2.5 EmptyState — `src/components/common/EmptyState/EmptyState.jsx`

**Current:** Gray-800 title.
**Target:** Same structure, dark mode support.

```jsx
const EmptyState = ({ title = 'Nothing here yet', description, action }) => {
  return (
    <div className="py-12 text-center">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
```

---

### 2.6 BrandLogo — `src/components/common/BrandLogo.jsx`

**Current:** `#052919` / gold gradient.
**Target:** `#141414` bg with emerald gradient accent (matching Multivendor-Web SVG logo).

```jsx
const BrandLogo = ({ size = 'md', showText = true, showTagline = false, linked = false }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const Wrapper = linked ? 'a' : 'div';
  const wrapperProps = linked ? { href: '/' } : {};

  return (
    <Wrapper {...wrapperProps} className="flex items-center gap-2">
      {/* Monogram */}
      <div
        className={`${sizes[size]} rounded-full bg-[#141414] flex items-center justify-center
          text-white font-extrabold border-2 border-[#75d04b] flex-shrink-0`}
      >
        A
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold text-[#141414] dark:text-white text-sm leading-tight">
            aritii
          </span>
          <span className="text-[10px] font-semibold text-[#75d04b] tracking-widest leading-tight">
            MARKET
          </span>
          {showTagline && (
            <span className="hidden sm:block text-[10px] text-gray-500">
              Your Marketplace
            </span>
          )}
        </div>
      )}
    </Wrapper>
  );
};
```

---

### 2.7 Ratings — `src/components/common/Ratings.jsx`

**Current:** Gold stars `#f6b100`.
**Target:** Yellow stars `#facc15` (Tailwind yellow-400), matching Multivendor-Web.

```jsx
import { AiFillStar, AiOutlineStar, BsStarHalf } from 'react-icons/ai';

const Ratings = ({ rating = 0, size = 18 }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= Math.floor(rating)) {
          return <AiFillStar key={star} size={size} className="text-yellow-400 mr-0.5" />;
        }
        if (star - 0.5 <= rating) {
          return <BsStarHalf key={star} size={size - 1} className="text-yellow-400 mr-0.5" />;
        }
        return <AiOutlineStar key={star} size={size} className="text-yellow-400 mr-0.5" />;
      })}
    </div>
  );
};
```

---

### 2.8 ImageWithFallback — `src/components/common/ImageWithFallback.jsx`

**No changes needed** — functional component, no brand colors.

---

## 3. PUBLIC SECTION

### 3.1 TopNotificationBar — `src/public/components/TopNotificationBar.jsx`

**Current:** `bg-gradient-to-r from-brand-green-dark to-green-900` + gold border.
**Target:** `bg-[#141414]` (dark near-black) + green accent border.

**Replace these classes:**
```
FROM: bg-gradient-to-r from-brand-green-dark to-green-900
TO:   bg-[#141414]

FROM: border-b-2 border-brand-gold
TO:   border-b-2 border-[#75d04b]

FROM: text-slate-200 text-xs
TO:   text-gray-300 text-xs

FROM: bg-gradient-to-r from-brand-gold to-yellow-400 text-brand-green-dark
TO:   bg-[#75d04b] text-white
```

---

### 3.2 PublicHeader — `src/public/components/PublicHeader.jsx`

**This is the main public navigation bar. Complete redesign:**

**Overall structure (keep same):**
```
header (sticky top-0 z-50 bg-white border-b border-gray-200)
  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
    Logo | Nav Links | Cart + Auth buttons
```

**Replace these class patterns throughout:**

| Current Pattern | Target Pattern |
|---|---|
| `text-[#052919]` (active nav) | `text-[#75d04b]` |
| `bg-green-50` (active nav bg) | `bg-[#f3ffee]` (primary-light) |
| `hover:text-[#052919]` | `hover:text-[#75d04b]` |
| `bg-[#052919]` (CTA buttons) | `bg-[#75d04b] rounded-full` |
| `hover:bg-[#031a0d]` | `hover:brightness-95` |
| `w-4 h-4 bg-[#052919]` (cart badge) | `h-5 min-w-[20px] bg-[#75d04b] rounded-full` |
| `font-Roboto` | `font-inter` |
| `text-[#052919]` (logo text) | `text-[#141414] dark:text-white` |
| `rounded-lg` (buttons) | `rounded-full` |
| `text-gray-700 hover:text-[#052919]` | `text-gray-700 hover:text-[#75d04b]` |

**Dropdown menu pattern:**
```
FROM: bg-white rounded-xl shadow-2xl border border-gray-200
TO:   bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700
```

**Add dark mode classes to all elements:**
- Background: `dark:bg-gray-900`
- Text: `dark:text-white`
- Borders: `dark:border-gray-800`
- Hover bg: `dark:hover:bg-gray-800`

---

### 3.3 PublicLayout — `src/public/layout/PublicLayout.jsx`

**No structural changes** — just ensure `min-h-screen flex flex-col bg-white dark:bg-gray-900`.

---

### 3.4 Footer — `src/shared/components/Footer.jsx`

**Current:** `bg-[#1F2937]` (charcoal), gold accent links.
**Target:** `bg-[#141414]` (near-black), green accent links.

**Replace these class patterns:**

| Current | Target |
|---|---|
| `bg-[#1F2937]` | `bg-[#141414]` |
| `text-[#E5A93C]` (accent text) | `text-[#75d04b]` |
| `hover:text-[#E5A93C]` | `hover:text-[#75d04b]` |
| `border-gray-700` | `border-gray-800` |
| `text-gray-400` (link text) | `text-gray-400` (keep same) |
| `text-gray-500` (copyright) | `text-gray-500` (keep same) |

---

### 3.5 Home Page — `src/public/pages/Home.jsx`

**No logic changes.** Just update visual wrappers.

**Ensure sections have:**
- `dark:bg-gray-900 dark:text-white` on section containers
- Remove any `bg-cream` or `bg-[#FDF6EC]` — use `bg-white dark:bg-gray-900`
- Section headings: `text-[#111827] dark:text-white text-xl font-semibold`

---

### 3.6 HeroSection — `src/public/sections/HeroSection.jsx`

**Current:** Gradient with `#052919`, gold accent.
**Target:** Green hero with `#75d04b` background, white text.

**Replace these patterns:**

| Current | Target |
|---|---|
| `from-white via-gray-50 to-[#052919]/5` | `bg-[#75d04b]` (solid green) |
| `text-[#052919]` (headings) | `text-white` |
| `text-[#E5A93C]` (accent text) | `text-white` |
| `bg-[#E5A93C]` (CTA) | `bg-white text-[#75d04b]` (inverted) |
| `bg-[#052919]` (dark CTA) | `bg-[#141414]` (dark button) |
| `border-[#E5A93C]` | `border-white` |

**Add SVG wave bottom** (from Multivendor-Web Start section):
```jsx
{/* Wave transition from hero to content */}
<svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 200" fill="none">
  <path
    d="M0,100 C500,60 500,60 1000,100 L1000,200 L0,200 Z"
    className="fill-white dark:fill-gray-900"
  />
</svg>
```

---

### 3.7 FeaturedCategories — `src/public/sections/FeaturedCategories.jsx`

**Current:** `rounded-2xl`, cream backgrounds.
**Target:** `rounded-md`, white cards with shadow.

**Replace:**
- `rounded-2xl` → `rounded-md`
- `bg-cream` / `bg-[#FDF6EC]` → `bg-white dark:bg-gray-800`
- Add `shadow-md hover:scale-[1.02] transition-transform duration-500`

---

### 3.8 PromoBanner — `src/public/sections/PromoBanner.jsx`

**Current:** Gold/dark gradients.
**Target:** Green-based gradients.

**Replace gradient patterns:**
```
FROM: from-[#E5A93C]/90 to-[#E5A93C]/70
TO:   from-[#75d04b]/90 to-[#75d04b]/70

FROM: from-[#052919]/90 to-[#052919]/70
TO:   from-[#141414]/90 to-[#141414]/70

FROM: from-[#C8522C]/90 to-[#C8522C]/70
TO:   from-red-500/90 to-red-500/70
```

---

### 3.9 HowItWorksSection — `src/public/sections/HowItWorksSection.jsx`

**Replace:**
- Any `#052919` → `#75d04b`
- Any `#E5A93C` → `#75d04b`
- Step indicators: `bg-[#75d04b]` with white number text

---

### 3.10 BusinessCTA — `src/public/sections/BusinessCTA.jsx`

**Current:** Dark green `bg-[#052919]`, gold accent.
**Target:** Dark `bg-[#141414]`, green accent.

**Replace:**
- `bg-[#052919]` → `bg-[#141414]`
- `text-[#E5A93C]` → `text-[#75d04b]`
- `bg-[#E5A93C]` → `bg-[#75d04b] text-white`
- `hover:bg-[#031a0d]` → `hover:brightness-95`

---

### 3.11 MarketplaceCTA — `src/public/sections/MarketplaceCTA.jsx`

**Replace:**
- `bg-[#052919]` → `bg-[#75d04b]`
- `text-[#052919]` → `text-[#75d04b]`
- `bg-[#E5A93C]` → `bg-[#75d04b]`

---

### 3.12 DeliveryExplanation — `src/public/sections/DeliveryExplanation.jsx`

**Replace any `#052919` / `#E5A93C` / `brand-*` references to match new palette.**

---

### 3.13 EventsSection — `src/public/sections/EventsSection.jsx`

**Same pattern: replace all brand color references.**

---

### 3.14 Advertisements — `src/public/sections/Advertisements.jsx`

**Same pattern.**

---

### 3.15 Promotions — `src/public/sections/Promotions.jsx`

**Same pattern.**

---

### 3.16 SelectedProducts — `src/public/sections/SelectedProducts.jsx`

**Same pattern.**

---

### 3.17 SelectedShops — `src/public/sections/SelectedShops.jsx`

**Same pattern.**

---

### 3.18 About, Events, FAQ, HowItWorks Pages

**File paths:**
- `src/public/pages/About.jsx`
- `src/public/pages/Events.jsx`
- `src/public/pages/FAQ.jsx`
- `src/public/pages/HowItWorks.jsx`

**Replace all `#052919` / `#E5A93C` / `brand-*` references to match new palette.**

---

## 4. MARKETPLACE SECTION

### 4.1 MarketplaceHeader — `src/marketplace/components/MarketplaceHeader.jsx`

**Current:** Same as PublicHeader with search.
**Target:** Same updates as PublicHeader (Section 3.2).

**Additional search bar update:**
```
FROM: bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E5A93C]
TO:   bg-white border border-gray-200 rounded-full focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25
```

**Category pills update:**
```
FROM: bg-gray-100 text-xs font-medium text-gray-700 rounded-full
TO:   bg-gray-100 text-xs font-medium text-gray-700 rounded-full (keep same)
```

---

### 4.2 ProductCard — `src/shared/components/ProductCard.jsx`

**Current:** `#0B6E4F` price, gold rating.
**Target:** `#75d04b` price, yellow rating.

**Replace these patterns:**

| Current | Target |
|---|---|
| `text-[#0B6E4F]` (price) | `text-[#75d04b]` |
| `text-[#C0392B]` (strikethrough price) | `text-gray-400` |
| `shadow-sm hover:shadow-md` | Keep same |
| `rounded-lg` | `rounded-md` |
| `group-hover:scale-[1.03]` | `hover:scale-[1.02]` (match Multivendor-Web) |
| `text-[#68d284]` (sold count) | `text-[#75d04b]` |
| Action button bg: `hover:bg-gray-100` | `hover:bg-gray-100 dark:hover:bg-gray-800` |
| Heart active: `text-red-500 hover:bg-red-50` | Keep same |
| Focus ring: `focus-visible:ring-[#0B6E4F]` | `focus-visible:ring-[#75d04b]` |

---

### 4.3 ShopCard — `src/shared/components/ShopCard.jsx`

**Replace:**
- `text-brand-primary` → `text-[#75d04b]`
- `border-brand-border` → `border-gray-200`
- `border-2` → `border` (thinner, match Multivendor-Web cards)
- `rounded-xl` → `rounded-md`
- `text-brand-charcoal` → `text-gray-900 dark:text-white`
- `text-brand-muted` → `text-gray-500 dark:text-gray-400`
- Add `dark:bg-gray-800`

---

### 4.4 Products Page — `src/marketplace/pages/Products.jsx`

**Replace:**
- Filter sidebar: `bg-white rounded-lg shadow-sm` (keep)
- Product grid: `gap-4 md:gap-6` (keep)
- Page bg: `bg-gray-50 dark:bg-gray-900`
- Section headings: `text-[#111827] dark:text-white`

---

### 4.5 Shops Page — `src/marketplace/pages/Shops.jsx`

**Replace:**
- `bg-[#FDF6EC]` (cream bg) → `bg-white dark:bg-gray-900`
- Shop grid cards: match ShopCard updates above

---

### 4.6 Categories, Deals, BestSelling, SearchResults, ShopDetail, ProductDetail Pages

**File paths:**
- `src/marketplace/pages/Categories.jsx`
- `src/marketplace/pages/Deals.jsx`
- `src/marketplace/pages/BestSelling.jsx`
- `src/marketplace/pages/SearchResults.jsx`
- `src/marketplace/pages/ShopDetail.jsx`
- `src/marketplace/pages/ProductDetail.jsx`

**Global replacements for ALL these files:**
1. Find-replace `#052919` → `#75d04b`
2. Find-replace `#0B6E4F` → `#75d04b`
3. Find-replace `#E5A93C` → `#75d04b`
4. Find-replace `#C0392B` → keep as error/danger color
5. Find-replace `brand-primary` → `[#75d04b]`
6. Find-replace `brand-accent` → `[#75d04b]`
7. Find-replace `brand-green-dark` → `[#141414]`
8. Find-replace `brand-charcoal` → `gray-900`
9. Find-replace `brand-muted` → `gray-500`
10. Find-replace `brand-border` → `gray-200`
11. Find-replace `brand-cream` → `white`
12. Find-replace `font-Roboto` → `font-inter`
13. Find-replace `rounded-2xl` → `rounded-md`
14. Add `dark:bg-gray-900 dark:text-white` to page containers

---

## 5. BUYER SECTION

### 5.1 BuyerHeader — `src/buyer/components/BuyerHeader.jsx`

**Same updates as PublicHeader (Section 3.2).**

**Replace:**
- `text-[#052919]` → `text-[#75d04b]`
- `bg-[#052919]` → `bg-[#75d04b] rounded-full`
- `hover:bg-[#031a0d]` → `hover:brightness-95`
- `text-[#E5A93C]` → `text-[#75d04b]`
- `border-[#E5A93C]` → `border-[#75d04b]`
- Add `dark:` variants

---

### 5.2 BuyerSidebar — `src/buyer/components/BuyerSidebar.jsx`

**Current:** N/A (may not exist yet or uses sidebar pattern).
**Target style:**
```
bg-white dark:bg-gray-900
border-r border-gray-200 dark:border-gray-800
Nav item active: bg-[#f3ffee] text-[#75d04b] border-l-4 border-[#75d04b]
Nav item inactive: text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800
```

---

### 5.3 BuyerLayout — `src/buyer/components/BuyerLayout.jsx`

**Replace:**
- Background: `bg-gray-50 dark:bg-gray-900`
- Header: `bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800`

---

### 5.4 Checkout, TrackOrder, UserOrderDetailComponent

**File paths:**
- `src/buyer/components/Checkout.jsx`
- `src/buyer/components/CheckoutSteps.jsx`
- `src/buyer/components/Payment.jsx`
- `src/buyer/components/TrackOrder.jsx`
- `src/buyer/components/TrackOrder.css`
- `src/buyer/components/UserOrderDetailComponent.jsx`
- `src/buyer/components/UserOrderDetailComponent.css`

**Global replacements:**
1. `#052919` → `#75d04b`
2. `#0B6E4F` → `#75d04b`
3. `#E5A93C` → `#75d04b`
4. `brand-primary` → `[#75d04b]`
5. `brand-accent` → `[#75d04b]`
6. `brand-green-dark` → `[#141414]`
7. `font-Roboto` → `font-inter`
8. Steps indicator: `bg-[#75d04b]` for active, `bg-gray-200` for inactive
9. Checkout summary: `rounded-md` not `rounded-lg`
10. Order tracking progress: green `#75d04b` for completed steps

---

### 5.5 Buyer Pages

**File paths:**
- `src/buyer/pages/Dashboard/Dashboard.jsx`
- `src/buyer/pages/Dashboard/ProductsBrowse.jsx`
- `src/buyer/pages/Dashboard/ShopsBrowse.jsx`
- `src/buyer/pages/Addresses.jsx`
- `src/buyer/pages/Checkout.jsx`
- `src/buyer/pages/OrderDetail.jsx`
- `src/buyer/pages/Orders.jsx`
- `src/buyer/pages/OrderSuccess.jsx`
- `src/buyer/pages/OrderTracking.jsx`
- `src/buyer/pages/Payment.jsx`
- `src/buyer/pages/Profile.jsx`
- `src/buyer/pages/Requests/Inbox.jsx`
- `src/buyer/pages/Requests/Requests.jsx`
- `src/buyer/pages/Reviews.jsx`
- `src/buyer/pages/Settings.jsx`
- `src/buyer/pages/Wishlist.jsx`

**Global replacements for ALL these files:**
1. Find-replace `#052919` → `#75d04b`
2. Find-replace `#0B6E4F` → `#75d04b`
3. Find-replace `#E5A93C` → `#75d04b`
4. Find-replace `brand-primary` → `[#75d04b]`
5. Find-replace `brand-accent` → `[#75d04b]`
6. Find-replace `brand-green-dark` → `[#141414]`
7. Find-replace `brand-charcoal` → `gray-900`
8. Find-replace `brand-muted` → `gray-500`
9. Find-replace `brand-border` → `gray-200`
10. Find-replace `font-Roboto` → `font-inter`
11. Add `dark:bg-gray-900 dark:text-white` to page containers

---

### 5.6 Buyer Services (Visual Impact: None)

**Files in `src/buyer/services/` — NO CHANGES.** These are API service files with no visual elements.

---

### 5.7 Buyer Hooks (Visual Impact: None)

**Files in `src/buyer/hooks/` — NO CHANGES.** These are data/state hooks.

---

## 6. BUSINESS / SELLER SECTION

### 6.1 BusinessLayout — `src/business/components/BusinessLayout.jsx`

**Current:** `bg-[#F5F5F5]`, `w-[280px]` sidebar.
**Target:** `bg-gray-50 dark:bg-gray-900`, sidebar matches Multivendor-Web profile layout.

**Replace:**
```
FROM: min-h-screen bg-[#F5F5F5]
TO:   min-h-screen bg-gray-50 dark:bg-gray-900

FROM: bg-white shadow sticky top-0 z-40
TO:   bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800

FROM: w-[280px] bg-white border-r border-gray-200
TO:   w-[280px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800

FROM: px-3 py-3 md:px-4 md:py-4
TO:   p-4 md:p-6 lg:px-12 (match PaddingContainer pattern)
```

**Mobile sidebar:**
```
FROM: shadow-xl
TO:   shadow-2xl
```

---

### 6.2 BusinessHeader — `src/business/components/BusinessHeader/BusinessHeader.jsx`

**Current:** `h-[80px]`, `border-brand`, orange accent.
**Target:** `min-h-[72px] sm:min-h-[80px]`, `border-gray-200`, green accent.

**Replace:**
```
FROM: h-[80px] bg-white shadow sticky top-0 left-0 z-40
TO:   min-h-[72px] sm:min-h-[80px] bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800

FROM: border-b border-brand
TO:   border-b border-gray-200 dark:border-gray-800

FROM: text-sm font-[600] text-brand-primary
TO:   text-sm font-semibold text-[#75d04b]

FROM: bg-brand-primary/10 text-brand-primary
TO:   bg-[#f3ffee] text-[#75d04b] rounded-full

FROM: border-2 border-brand-primary
TO:   border-2 border-[#75d04b]

FROM: hover:bg-brand-primary/10
TO:   hover:bg-[#f3ffee]

FROM: text-red-600 hover:bg-red-50
TO:   text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10
```

**Profile dropdown:**
```
FROM: bg-white rounded-lg shadow-lg border border-gray-100
TO:   bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700
```

---

### 6.3 BusinessSidebar — `src/business/components/BusinessSidebar/BusinessSidebar.jsx`

**Current:** Orange accent (`orange-600`, `orange-50`, `orange-700`).
**Target:** Green accent matching Multivendor-Web profile sidebar.

**Replace ALL orange references:**
```
FROM: text-orange-600        TO: text-[#75d04b]
FROM: bg-orange-50           TO: bg-[#f3ffee]
FROM: text-orange-700        TO: text-[#75d04b]
FROM: border-orange-200      TO: border-[#75d04b]/30
FROM: text-gray-700 hover:bg-gray-50 border-gray-200
TO:   text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent hover:border-gray-200 dark:hover:border-gray-700

FROM: bg-teal-50 text-teal-700 border-teal-200
TO:   bg-[#f3ffee] text-[#75d04b] border-[#75d04b]/30

FROM: bg-red-50 text-red-600 hover:bg-red-100 border-red-200
TO:   bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 border-red-200 dark:border-red-500/30
```

**Section label:**
```
FROM: text-[11px] font-semibold text-orange-600 uppercase tracking-wide
TO:   text-[11px] font-semibold text-gray-500 uppercase tracking-wide
```

---

### 6.4 BusinessDashboardHero — `src/business/components/BusinessDashboardHero.jsx`

**Current:** Standard stat cards with colored backgrounds.
**Target:** Match Multivendor-Web card pattern with primary-light backgrounds.

**Stat card pattern:**
```
FROM: bg-green-50 text-green-700 text-green-600
TO:   bg-[#f3ffee] text-[#75d04b] (primary-light for all stats)

Or keep differentiated colors but update to match:
Revenue: bg-blue-50 text-blue-700 (keep)
Orders:  bg-[#f3ffee] text-[#75d04b] (green → primary)
Products: bg-purple-50 text-purple-700 (keep)
Events:  bg-amber-50 text-amber-700 (was yellow, use amber)
```

**Card pattern:**
```
FROM: bg-white rounded-lg p-5 shadow-sm border border-gray-100
TO:   bg-white dark:bg-gray-800 rounded-md p-5 shadow-sm border border-gray-100 dark:border-gray-700
hover:shadow-md transition
```

**Welcome section:**
```
FROM: bg-white rounded-lg p-6 shadow-sm border border-gray-100
TO:   bg-white dark:bg-gray-800 rounded-md p-6 shadow-sm border border-gray-100 dark:border-gray-700
```

**Table pattern:**
```
FROM: border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 uppercase
TO:   bg-gray-50 dark:bg-gray-800 text-xs font-semibold text-gray-500 uppercase tracking-wide

FROM: border-b border-gray-200 hover:bg-gray-50
TO:   border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800
```

**Status badges:**
```
succeeded/delivered: bg-green-100 text-green-700  → bg-[#f3ffee] text-[#75d04b]
pending:            bg-yellow-100 text-yellow-700  → bg-amber-50 text-amber-700
cancelled:          bg-red-100 text-red-700        → bg-red-50 text-red-600
```

---

### 6.5 ShopSwitcher — `src/business/components/ShopSwitcher.jsx`

**Replace:**
```
FROM: border-b border-gray-200
TO:   border-b border-gray-200 dark:border-gray-700

FROM: w-full rounded-md border border-gray-300 bg-white
TO:   w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
```

---

### 6.6 Business Pages

**File paths:**
- `src/business/pages/Dashboard.jsx`
- `src/business/pages/Analytics/Analytics.jsx`
- `src/business/pages/Analytics/StoreMetrics.jsx`
- `src/business/pages/Events/Events.jsx`
- `src/business/pages/Inventory/Inventory.jsx`
- `src/business/pages/Orders/Orders.jsx`
- `src/business/pages/Orders/History.jsx`
- `src/business/pages/Orders/Detail.jsx`
- `src/business/pages/Orders/Messages.jsx`
- `src/business/pages/Orders/Refunds.jsx`
- `src/business/pages/Products/Products.jsx`
- `src/business/pages/Products/Create.jsx`
- `src/business/pages/Products/Detail.jsx`
- `src/business/pages/Products/Edit.jsx`
- `src/business/pages/Profile/Profile.jsx`
- `src/business/pages/Profile/Settings.jsx`
- `src/business/pages/Promotions/Promotions.jsx`
- `src/business/pages/Shops/Shops.jsx`
- `src/business/pages/Shops/ShopDetail.jsx`

**Global replacements for ALL these files:**
1. Find-replace `#052919` → `#75d04b`
2. Find-replace `#0B6E4F` → `#75d04b`
3. Find-replace `#E5A93C` → `#75d04b`
4. Find-replace `brand-primary` → `[#75d04b]`
5. Find-replace `brand-accent` → `[#75d04b]`
6. Find-replace `brand-green-dark` → `[#141414]`
7. Find-replace `brand-charcoal` → `gray-900`
8. Find-replace `brand-muted` → `gray-500`
9. Find-replace `brand-border` → `gray-200`
10. Find-replace `brand-cream` → `white`
11. Find-replace `font-Roboto` → `font-inter`
12. Find-replace `rounded-2xl` → `rounded-md`
13. Find-replace `rounded-lg` → `rounded-md` (for cards)
14. Add `dark:bg-gray-900 dark:text-white` to page containers

---

### 6.7 Business Components (Other)

**File paths:**
- `src/business/components/AllEvents.jsx`
- `src/business/components/AllEvents.css`
- `src/business/components/AllOrdersOfASingleShop.jsx`
- `src/business/components/AllOrdersOfASingleShop.css`
- `src/business/components/AllProductsOfASingleShop.jsx`
- `src/business/components/AllProductsOfASingleShop.css`
- `src/business/components/AllRefundOrders.jsx`
- `src/business/components/CreateProduct.jsx`
- `src/business/components/BusinessMessages.jsx`
- `src/business/components/OrderDetails.jsx`
- `src/business/components/ShopInfo.jsx`
- `src/business/components/ShopProfileData.jsx`
- `src/business/components/ShopSettings.jsx`

**Same global replacements as Section 6.6.**

**CSS files:** Update color values directly:
- `#052919` → `#75d04b`
- `#0B6E4F` → `#75d04b`
- `#E5A93C` → `#75d04b`
- `#1F2937` → `#141414`
- `#C0392B` → keep as danger color

---

## 7. AUTH SECTION

### 7.1 LoginPage — `src/auth/pages/LoginPage.jsx`

**Current:** Green-700 submit, `shadow-lg`, centered layout.
**Target:** Lime green `#75d04b` submit, `rounded-full`, matches Multivendor-Web auth modal.

**Replace:**
```
FROM: min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100
TO:   min-h-screen flex items-center justify-center py-12 px-4 bg-white dark:bg-gray-900

FROM: w-full max-w-md
TO:   w-full max-w-[450px]

FROM: bg-white rounded-2xl shadow-lg p-8 border border-gray-100
TO:   bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700

FROM: text-4xl font-bold text-gray-900
TO:   text-2xl font-bold text-gray-900 dark:text-white

FROM: bg-green-700 hover:bg-green-800
TO:   bg-[#75d04b] hover:brightness-95

FROM: rounded-lg py-3
TO:   rounded-full py-3

FROM: focus:ring-2 focus:ring-green-600
TO:   focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25

FROM: font-semibold text-green-600 hover:text-green-700
TO:   font-semibold text-[#75d04b] hover:text-[#5ac12f]

FROM: font-semibold text-green-700 hover:text-green-800
TO:   font-semibold text-[#75d04b] hover:text-[#5ac12f]
```

---

### 7.2 SignUpPage — `src/auth/pages/SignUpPage.jsx`

**Same updates as LoginPage (Section 7.1).**

---

### 7.3 Login Component — `src/auth/components/Login.jsx`

**Same updates. Additional:**
- Email icon color: `text-gray-400` (keep)
- Password toggle: `text-gray-400 hover:text-gray-600` (keep)
- "Or continue with" divider: `border-gray-200` (keep)
- Form spacing: `space-y-5` (keep)

---

### 7.4 SignUp Component — `src/auth/components/SignUp.jsx`

**Same updates as Login component.**

---

### 7.5 ShopLoginPage — `src/auth/components/ShopLoginPage.jsx`

**Same updates as LoginPage.**

---

### 7.6 SellerApplication — `src/auth/components/SellerApplication.jsx`

**Same updates as LoginPage.**

---

### 7.7 CreateShopPage — `src/auth/pages/CreateShopPage.jsx`

**Same updates as LoginPage.**

---

## 8. SHARED HOOKS & UTILITIES

### 8.1 Shared Hooks — `src/shared/hooks/`

**NO VISUAL CHANGES.** These are data/state hooks:
- `useAppBootstrap.js` — session restore
- `useAuth.js` — re-export
- `useDebounce.js` — debounce utility
- `useMediaQuery.js` — media queries
- `useResponsive.js` — re-export

---

### 8.2 Shared Types — `src/shared/types/`

**NO CHANGES.** These are JSDoc type definitions.

---

### 8.3 Shared Utils — `src/shared/utils/`

**NO VISUAL CHANGES.** These are pure utility functions.

---

### 8.4 Store — `src/store/`

**NO CHANGES.** Redux store configuration and slices.

---

### 8.5 Services — `src/services/`

**NO CHANGES.** API service files.

---

### 8.6 Domain Services — `src/<domain>/services/`

**NO CHANGES.** Re-export files.

---

### 8.7 Domain Hooks — `src/<domain>/hooks/`

**NO CHANGES.** Data/state hooks.

---

### 8.8 App Providers — `src/app/providers/`

**`AppProviders.jsx`** — Add dark mode class toggle:
```jsx
// Wrap with dark mode support
useEffect(() => {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
}, []);
```

**`ThemeContext.jsx`** — Update default color references if any.

---

### 8.9 App Routes — `src/app/routes/`

**NO CHANGES.** Route definitions have no visual elements.

---

### 8.10 App Config — `src/app/config/`

**Update `appConfig.js`** if it contains any brand name/color references:
```js
APP_NAME: 'aritii market',  // was 'Aritii Market' or similar
```

---

## 9. FILE-BY-FILE CHECKLIST

Use this checklist to track progress. Mark each file as done after updating.

### 9.1 Design Foundation (Do First)
- [ ] `tailwind.config.cjs` — Colors, fonts, dark mode, plugins
- [ ] `src/styles/variables.css` — CSS custom properties
- [ ] `src/styles/globals.css` — Global styles, typography, layout, scrollbar, dark mode
- [ ] `src/styles/theme.js` — Theme tokens
- [ ] `src/styles/styles.js` — Utility class strings
- [ ] `src/styles/index.js` — Barrel export

### 9.2 Common Components
- [ ] `src/components/common/Button/Button.jsx`
- [ ] `src/components/common/Button/Button.module.css` — DELETE
- [ ] `src/components/common/Input/Input.jsx`
- [ ] `src/components/common/Input/Input.module.css` — DELETE
- [ ] `src/components/common/Modal/Modal.jsx`
- [ ] `src/components/common/Modal/Modal.module.css` — DELETE
- [ ] `src/components/common/Loading/Loading.jsx`
- [ ] `src/components/common/EmptyState/EmptyState.jsx`
- [ ] `src/components/common/BrandLogo.jsx`
- [ ] `src/components/common/Ratings.jsx`
- [ ] `src/components/common/ImageWithFallback.jsx` — No changes
- [ ] `src/components/common/LocationSelector.jsx`
- [ ] `src/components/layout/ErrorBoundary/ErrorBoundary.jsx` — No changes

### 9.3 App Providers & Config
- [ ] `src/app/providers/AppProviders.jsx`
- [ ] `src/app/providers/LayoutContext.jsx` — No changes
- [ ] `src/app/providers/ThemeContext.jsx`
- [ ] `src/app/config/appConfig.js`
- [ ] `src/app/config/env.js` — No changes

### 9.4 Public Section
- [ ] `src/public/components/TopNotificationBar.jsx`
- [ ] `src/public/components/PublicHeader.jsx`
- [ ] `src/public/layout/PublicLayout.jsx`
- [ ] `src/public/NotFound.jsx`
- [ ] `src/public/pages/Home.jsx`
- [ ] `src/public/pages/About.jsx`
- [ ] `src/public/pages/Events.jsx`
- [ ] `src/public/pages/FAQ.jsx`
- [ ] `src/public/pages/HowItWorks.jsx`
- [ ] `src/public/sections/HeroSection.jsx`
- [ ] `src/public/sections/Advertisements.jsx`
- [ ] `src/public/sections/BusinessCTA.jsx`
- [ ] `src/public/sections/DeliveryExplanation.jsx`
- [ ] `src/public/sections/EventsSection.jsx`
- [ ] `src/public/sections/FeaturedCategories.jsx`
- [ ] `src/public/sections/HowItWorksSection.jsx`
- [ ] `src/public/sections/MarketplaceCTA.jsx`
- [ ] `src/public/sections/PromoBanner.jsx`
- [ ] `src/public/sections/Promotions.jsx`
- [ ] `src/public/sections/SelectedProducts.jsx`
- [ ] `src/public/sections/SelectedShops.jsx`

### 9.5 Shared Components
- [ ] `src/shared/components/Footer.jsx`
- [ ] `src/shared/components/ProductCard.jsx`
- [ ] `src/shared/components/ShopCard.jsx`

### 9.6 Marketplace Section
- [ ] `src/marketplace/components/MarketplaceHeader.jsx`
- [ ] `src/marketplace/components/CategoryCard.jsx`
- [ ] `src/marketplace/components/CategoryRail.jsx`
- [ ] `src/marketplace/components/ProductDetail.jsx`
- [ ] `src/marketplace/components/SuggestedProducts.jsx`
- [ ] `src/marketplace/pages/Products.jsx`
- [ ] `src/marketplace/pages/ProductDetail.jsx`
- [ ] `src/marketplace/pages/Categories.jsx`
- [ ] `src/marketplace/pages/Shops.jsx`
- [ ] `src/marketplace/pages/ShopDetail.jsx`
- [ ] `src/marketplace/pages/Deals.jsx`
- [ ] `src/marketplace/pages/BestSelling.jsx`
- [ ] `src/marketplace/pages/SearchResults.jsx`

### 9.7 Auth Section
- [ ] `src/auth/pages/LoginPage.jsx`
- [ ] `src/auth/pages/SignUpPage.jsx`
- [ ] `src/auth/pages/CreateShopPage.jsx`
- [ ] `src/auth/components/Login.jsx`
- [ ] `src/auth/components/SignUp.jsx`
- [ ] `src/auth/components/ShopLoginPage.jsx`
- [ ] `src/auth/components/SellerApplication.jsx`
- [ ] `src/auth/authSlice.js` — No changes

### 9.8 Buyer Section
- [ ] `src/buyer/components/BuyerHeader.jsx`
- [ ] `src/buyer/components/BuyerSidebar.jsx`
- [ ] `src/buyer/components/BuyerLayout.jsx`
- [ ] `src/buyer/components/BuyerAccountSidebar.jsx`
- [ ] `src/buyer/components/Checkout.jsx`
- [ ] `src/buyer/components/CheckoutSteps.jsx`
- [ ] `src/buyer/components/Payment.jsx`
- [ ] `src/buyer/components/TrackOrder.jsx`
- [ ] `src/buyer/components/TrackOrder.css`
- [ ] `src/buyer/components/UserOrderDetailComponent.jsx`
- [ ] `src/buyer/components/UserOrderDetailComponent.css`
- [ ] `src/buyer/pages/Dashboard/Dashboard.jsx`
- [ ] `src/buyer/pages/Dashboard/ProductsBrowse.jsx`
- [ ] `src/buyer/pages/Dashboard/ShopsBrowse.jsx`
- [ ] `src/buyer/pages/Addresses.jsx`
- [ ] `src/buyer/pages/Checkout.jsx`
- [ ] `src/buyer/pages/OrderDetail.jsx`
- [ ] `src/buyer/pages/Orders.jsx`
- [ ] `src/buyer/pages/OrderSuccess.jsx`
- [ ] `src/buyer/pages/OrderTracking.jsx`
- [ ] `src/buyer/pages/Payment.jsx`
- [ ] `src/buyer/pages/Profile.jsx`
- [ ] `src/buyer/pages/Requests/Inbox.jsx`
- [ ] `src/buyer/pages/Requests/Requests.jsx`
- [ ] `src/buyer/pages/Reviews.jsx`
- [ ] `src/buyer/pages/Settings.jsx`
- [ ] `src/buyer/pages/Wishlist.jsx`

### 9.9 Business / Seller Section
- [ ] `src/business/components/BusinessLayout.jsx`
- [ ] `src/business/components/BusinessHeader/BusinessHeader.jsx`
- [ ] `src/business/components/BusinessSidebar/BusinessSidebar.jsx`
- [ ] `src/business/components/BusinessDashboardHero.jsx`
- [ ] `src/business/components/BusinessMessages.jsx`
- [ ] `src/business/components/ShopSwitcher.jsx`
- [ ] `src/business/components/ShopInfo.jsx`
- [ ] `src/business/components/ShopProfileData.jsx`
- [ ] `src/business/components/ShopSettings.jsx`
- [ ] `src/business/components/CreateProduct.jsx`
- [ ] `src/business/components/OrderDetails.jsx`
- [ ] `src/business/components/AllEvents.jsx`
- [ ] `src/business/components/AllEvents.css`
- [ ] `src/business/components/AllOrdersOfASingleShop.jsx`
- [ ] `src/business/components/AllOrdersOfASingleShop.css`
- [ ] `src/business/components/AllProductsOfASingleShop.jsx`
- [ ] `src/business/components/AllProductsOfASingleShop.css`
- [ ] `src/business/components/AllRefundOrders.jsx`
- [ ] `src/business/pages/Dashboard.jsx`
- [ ] `src/business/pages/Analytics/Analytics.jsx`
- [ ] `src/business/pages/Analytics/StoreMetrics.jsx`
- [ ] `src/business/pages/Events/Events.jsx`
- [ ] `src/business/pages/Inventory/Inventory.jsx`
- [ ] `src/business/pages/Orders/Orders.jsx`
- [ ] `src/business/pages/Orders/History.jsx`
- [ ] `src/business/pages/Orders/Detail.jsx`
- [ ] `src/business/pages/Orders/Messages.jsx`
- [ ] `src/business/pages/Orders/Refunds.jsx`
- [ ] `src/business/pages/Products/Products.jsx`
- [ ] `src/business/pages/Products/Create.jsx`
- [ ] `src/business/pages/Products/Detail.jsx`
- [ ] `src/business/pages/Products/Edit.jsx`
- [ ] `src/business/pages/Profile/Profile.jsx`
- [ ] `src/business/pages/Profile/Settings.jsx`
- [ ] `src/business/pages/Promotions/Promotions.jsx`
- [ ] `src/business/pages/Shops/Shops.jsx`
- [ ] `src/business/pages/Shops/ShopDetail.jsx`

### 9.10 Static Assets
- [ ] `src/assets/images/brand/*` — Replace logo SVGs with aritii-branded versions
- [ ] `src/assets/index.js` — Update exports if logo paths changed

---

## COLOR QUICK REFERENCE

### Primary Palette (Use These)

| Token | Hex | When to Use |
|---|---|---|
| Primary | `#75d04b` | Buttons, links, badges, active states, focus rings |
| Primary Light | `#f3ffee` | Light backgrounds, badge backgrounds, active nav bg |
| Primary Dark | `#5ac12f` | Hover states, pressed states |
| Primary Disabled | `#b9e8a3` | Disabled button background |

### Neutral Palette

| Token | Hex | When to Use |
|---|---|---|
| Near-black | `#141414` | Footer bg, dark surfaces, dark buttons |
| Gray-900 | `#111827` | Dark mode main background |
| Gray-800 | `#1f2937` | Dark mode cards, panels |
| Gray-700 | `#374151` | Dark mode borders, hover bg |
| Gray-500 | `#6b7280` | Muted/secondary text |
| Gray-400 | `#9ca3af` | Placeholder text |
| Gray-300 | `#d1d5db` | Borders, dividers |
| Gray-200 | `#e5e7eb` | Default borders |
| Gray-100 | `#f3f4f6` | Light backgrounds |
| Gray-50 | `#f9fafb` | Very light backgrounds |
| White | `#ffffff` | Light mode backgrounds |

### Semantic Colors

| Token | When to Use |
|---|---|
| `green-500` / `#22c55e` | Success states |
| `red-500` / `#ef4444` | Error / danger states |
| `amber-500` / `#f59e0b` | Warning states |
| `yellow-400` / `#facc15` | Star ratings |
| `blue-500` / `#3b82f6` | Information states |

### Colors to REMOVE Entirely

| Old Token | Old Hex | Notes |
|---|---|---|
| brand-primary (old) | `#0B6E4F` | Replaced by `#75d04b` |
| brand-green-dark | `#0B5A3F` | Replaced by `#141414` |
| brand-green | `#16A34A` | Replaced by `#75d04b` |
| brand-accent | `#F5A623` | Replaced by `#75d04b` |
| brand-gold | `#D4AF37` | Replaced by `#75d04b` |
| brand-secondary | `#C0392B` | Keep red-500 for danger only |
| brand-cream | `#FDF6EC` | Replaced by white |
| brand-charcoal | `#1F2937` | Replaced by gray-900 / `#141414` |
| Inline `#052919` | `#052919` | Replaced by `#75d04b` or `#141414` |
| Inline `#E5A93C` | `#E5A93C` | Replaced by `#75d04b` |

---

## DESIGN CONVENTIONS TO FOLLOW

### Border Radius
- **Buttons:** `rounded-full` (pill shape, matching Multivendor-Web)
- **Cards:** `rounded-md` (8px)
- **Modals:** `rounded-xl` (12px)
- **Inputs:** `rounded-lg` (8px)
- **Badges:** `rounded-full` (pill)
- **Avatars:** `rounded-full`

### Shadows
- **Cards:** `shadow-sm` default, `hover:shadow-md` on hover
- **Topbar:** `shadow-sm` when sticky
- **Modals:** `shadow-xl`
- **Sidebar:** `shadow-2xl` (mobile)
- **Buttons:** `shadow-none` (no shadow on buttons)

### Hover Effects
- **Cards:** `hover:scale-[1.02] transition-transform duration-500`
- **Buttons:** `hover:brightness-95 active:scale-[0.98] transition-all duration-200`
- **Links:** `hover:text-[#75d04b]`
- **Nav items:** `hover:bg-gray-50 dark:hover:bg-gray-800`

### Focus Rings
- `focus-visible:ring-2 focus-visible:ring-[#75d04b]/40`
- `focus:border-[#75d04b] focus:ring-2 focus:ring-[#75d04b]/25`

### Dark Mode Pattern
Every visible container needs:
```
bg-white dark:bg-gray-900
text-gray-900 dark:text-white
border-gray-200 dark:border-gray-800
```

### Padding Container
Content sections use:
```
w-full px-4 md:px-6 lg:px-12 xl:px-20 2xl:px-[80px]
```

### Typography
- **Font:** Inter (not Poppins, not Roboto)
- **Headings:** `font-bold` or `font-extrabold`
- **Buttons:** `font-semibold text-sm`
- **Body:** `text-sm` or `text-base`
- **Small/Labels:** `text-xs font-medium`
- **Remove all** `font-Roboto` references

---

## IMPLEMENTATION ORDER

1. **Foundation first** (Section 1) — tailwind.config, CSS files, theme
2. **Common components** (Section 2) — Button, Input, Modal, Loading, BrandLogo
3. **Shared components** (Section 5 of checklist) — Footer, ProductCard, ShopCard
4. **Public section** (Section 3) — Header, Footer, all sections/pages
5. **Marketplace section** (Section 4) — Header, cards, all pages
6. **Auth section** (Section 7) — Login, SignUp pages
7. **Buyer section** (Section 5) — Layout, header, sidebar, all pages
8. **Business/Seller section** (Section 6) — Layout, header, sidebar, all pages
9. **Verify** — Run `npm run dev` and visually check every page

---

## VERIFICATION COMMAND

After all updates, run:
```bash
cd /home/yihunebelay/Desktop/aritii-market/frontend && npm run dev
```

Check each route visually:
- `/` — Public home page
- `/login` — Login page
- `/sign-up` — Sign up page
- `/products` — Marketplace products
- `/shops` — Marketplace shops
- `/my-dashboard` — Buyer dashboard
- `/business` — Seller dashboard
- `/business/products` — Seller products
- `/business/orders` — Seller orders
- `/business/shops` — Seller shops

Ensure no:
- Orange (`#F5A623`, `orange-*`) remains
- Dark green (`#052919`, `#0B6E4F`, `#0B5A3F`) remains
- Gold (`#D4AF37`, `#E5A93C`) remains
- `font-Roboto` remains
- `brand-cream` / `#FDF6EC` remains
- Poppins font references remain
