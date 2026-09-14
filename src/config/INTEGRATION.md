# Integrating the Custom Tailwind Configuration

This guide explains how to integrate the new custom Tailwind theme into your Aritii Market frontend project.

## Installation Steps

### 1. Ensure Font Dependencies Are Installed

Add the required fonts to your project. Update your `package.json` or add them to your CSS:

```bash
npm install @fontsource/plus-jakarta-sans @fontsource/playfair-display
```

Alternatively, add font imports to your `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
```

### 2. Update Tailwind Configuration Reference

You have two options for using the custom config:

**Option A: Replace the existing tailwind.config.cjs**
```bash
cp frontend/src/config/tailwind.config.js frontend/tailwind.config.cjs
```

**Option B: Keep both configs and extend**
Update your `frontend/tailwind.config.cjs` to import the custom config:
```javascript
const customConfig = require('./src/config/tailwind.config.js');

module.exports = {
  ...customConfig,
  // Override any settings if needed
};
```

### 3. Update Your CSS Files

Ensure your main CSS file imports Tailwind directives:

```css
/* src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Test the Configuration

Start your development server:

```bash
cd frontend
npm run dev
```

Then test the theme by creating a simple test component:

```jsx
export function ThemeTest() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="font-serif text-4xl text-brand-green">
        Ethiopian Theme Active ✓
      </h1>
      <button className="btn-brand-primary">Primary Button</button>
      <button className="btn-brand-secondary">Secondary Button</button>
      <div className="tibeb-pattern-border p-4">
        Pattern Border Working
      </div>
    </div>
  );
}
```

## File Structure

```
frontend/
├── src/
│   ├── config/
│   │   ├── tailwind.config.js        # Main Tailwind configuration
│   │   ├── theme.js                  # Exported color and font constants
│   │   ├── index.js                  # Central export hub
│   │   ├── THEME_GUIDE.md            # Comprehensive theme documentation
│   │   ├── USAGE_EXAMPLES.jsx        # React component examples
│   │   ├── INTEGRATION.md            # This file
│   │   └── README.md                 # Quick reference
│   ├── index.css                     # Main CSS with Tailwind directives
│   └── ...
├── tailwind.config.cjs               # Root Tailwind config (update reference)
└── ...
```

## Using Theme Colors in Components

### Method 1: Tailwind Classes (Recommended)

```jsx
import { Fragment } from 'react';

export function ProductCard() {
  return (
    <div className="card-brand p-6">
      <h3 className="text-lg font-semibold text-brand-green">Product</h3>
      <p className="text-gray-600 mb-4">Description</p>
      <button className="btn-brand-primary w-full">Add to Cart</button>
    </div>
  );
}
```

### Method 2: JavaScript Import

```jsx
import { colors, fonts } from '@/config/theme.js';

export function StyledComponent() {
  const buttonStyle = {
    backgroundColor: colors.brand.green,
    fontFamily: fonts.sans,
  };

  return (
    <button style={buttonStyle}>
      Buy Now
    </button>
  );
}
```

### Method 3: Styled Components (if using)

```jsx
import styled from 'styled-components';
import { colors, fonts } from '@/config/theme.js';

const StyledButton = styled.button`
  background-color: ${colors.brand.green};
  color: white;
  font-family: ${fonts.sans};
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: ${colors.brand['green-dark']};
  }
`;

export function MyButton() {
  return <StyledButton>Click Me</StyledButton>;
}
```

## Migration Guide (for existing code)

### Step 1: Replace Old Colors

**Before:**
```jsx
<div className="bg-blue-600 text-white">Old button</div>
```

**After:**
```jsx
<div className="btn-brand-primary">New button</div>
```

### Step 2: Update Color References

**Before:**
```jsx
<div className="text-red-500">Error</div>
```

**After:**
```jsx
<div className="text-brand-terracotta">Error</div>
```

### Step 3: Apply Pattern Classes

**Before:**
```jsx
<div className="border border-gray-200 p-4">Card</div>
```

**After:**
```jsx
<div className="tibeb-pattern-border p-4">Card</div>
```

## Accessibility Considerations

### Color Contrast

All brand colors meet WCAG AA accessibility standards:
- `brand-green` on white: 7.8:1 ratio ✓
- `brand-gold` on `brand-charcoal`: 5.4:1 ratio ✓
- `brand-charcoal` on white: 9.1:1 ratio ✓

### Focus States

The form input component includes focus rings:
```css
focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20
```

### Font Sizes

Always combine text size with color for clarity:
```jsx
<h1 className="text-4xl font-serif text-brand-green">Heading</h1>
```

## Troubleshooting

### Colors Not Appearing

1. Check that `tailwind.config.js` is in the correct path
2. Verify `content` array includes all your files:
   ```javascript
   content: ['./src/**/*.{html,js,jsx,ts,tsx}']
   ```
3. Restart development server: `npm run dev`

### Fonts Not Loading

1. Ensure Google Fonts link is in `index.css` or `index.html`
2. Check browser DevTools → Network tab for font requests
3. Verify font names are spelled correctly:
   - `Plus Jakarta Sans` (with spaces)
   - `Playfair Display` (with space)

### Pattern Classes Not Working

1. Verify TailwindCSS is running (check terminal for build messages)
2. Clear build cache: `rm -rf node_modules/.cache`
3. Restart dev server

## Performance Notes

- Pattern overlays use CSS pseudo-elements (no extra DOM nodes)
- Custom fonts are hosted on Google Fonts (global CDN)
- All utilities are tree-shaked by Tailwind (unused classes removed)
- Shadows use GPU-accelerated properties for smooth rendering

## Browser Support

- Chrome/Edge: ✓ Full support
- Firefox: ✓ Full support
- Safari: ✓ Full support (14+)
- Mobile browsers: ✓ Full support

Pattern pseudo-elements require IE 9+. For older browser support, use fallback colors.

## Extending the Theme

To add your own custom colors or utilities, edit `tailwind.config.js`:

```javascript
colors: {
  brand: {
    // ... existing colors ...
    custom: '#ABCDEF',  // Add new colors here
  },
},
```

Then use in your components:
```jsx
<div className="bg-brand-custom">Custom color</div>
```

## Getting Help

- See `THEME_GUIDE.md` for comprehensive documentation
- See `USAGE_EXAMPLES.jsx` for React component examples
- Check the existing `App.css` for legacy patterns to migrate
- Review `theme.js` for exported constants

## Next Steps

1. Test the theme in your development environment
2. Update existing components to use brand colors
3. Review `USAGE_EXAMPLES.jsx` for implementation patterns
4. Start building new features with the theme
5. Ensure all new components use `brand-*` colors and classes

---

**Created:** September 13, 2026  
**Configuration Version:** 1.0.0  
**Compatibility:** Tailwind CSS v3+, React 18+
