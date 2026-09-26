const colors = {
  primary: '#75d04b',
  primaryDark: '#5ac12f',
  primaryLight: '#f3ffee',
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
  white: '#ffffff',
  buyerBg: '#FDF6EC',
  sellerBg: '#F5F5F5',
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  error: '#ef4444',
  danger: '#ef4444',
  success: '#22c55e',
  warning: '#eab308',
  info: '#3b82f6',
  seller: '#f97316'
};

const layout = {
  maxWidth: 'max-w-7xl',
  sidebarWidth: { buyer: 264, seller: 280 },
  headerHeight: {
    public: 'h-16',
    marketplace: 'h-16',
    buyer: 'h-[68px]',
    seller: 'h-[72px]'
  },
  mobileSidebar: 'w-[70%] max-w-[300px]',
  zIndex: {
    header: 50,
    sidebar: 46,
    overlay: 45,
    notification: 60
  }
};

const fonts = {
  primary: 'Inter, sans-serif',
  heading: 'Inter, sans-serif'
};

const roundness = {
  button: '9999px',
  card: '8px',
  input: '8px',
  modal: '12px',
  badge: '9999px'
};

const shadow = {
  card: '0 1px 3px rgba(0,0,0,0.1)',
  hover: '0 4px 12px rgba(0,0,0,0.15)',
  button: 'none',
  topbar: '0 1px 3px rgba(0,0,0,0.05)'
};

const theme = {
  colors,
  layout,
  fonts,
  roundness,
  shadow
};

export default theme;