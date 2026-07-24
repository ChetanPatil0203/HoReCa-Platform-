// ─────────────────────────────────────────────
//  Raw Material Marketplace — Local Mock Data
// ─────────────────────────────────────────────

export const CATEGORIES = [
  { id: 'veg-fruits', label: 'Vegetables & Fruits', emoji: '🥦', color: '#16A34A', bg: '#F0FDF4' },
  { id: 'dairy', label: 'Dairy Products', emoji: '🥛', color: '#2563EB', bg: '#EFF6FF' },
  { id: 'grains', label: 'Rice, Flour & Grains', emoji: '🌾', color: '#D97706', bg: '#FFFBEB' },
  { id: 'oil-spices', label: 'Oil & Spices', emoji: '🌶️', color: '#DC2626', bg: '#FEF2F2' },
  { id: 'meat', label: 'Chicken, Meat & Seafood', emoji: '🍗', color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'beverages', label: 'Beverages', emoji: '🧃', color: '#0891B2', bg: '#ECFEFF' },
  { id: 'cleaning', label: 'Cleaning Material', emoji: '🧼', color: '#059669', bg: '#ECFDF5' },
  { id: 'packaging', label: 'Packaging Material', emoji: '📦', color: '#92400E', bg: '#FEF3C7' },
];

export const SUPPLIERS = [];

export const SUPPLIER_PRODUCTS = {};

// Original exports for the first page
export const PRODUCTS = [];

export const CATEGORY_PRODUCTS = {};

export const VENDORS = [];

export const FEATURES = [
  { id: 'quotes', emoji: '📋', label: 'Request Quotes', desc: 'Get competitive quotes from multiple vendors instantly' },
  { id: 'compare', emoji: '⚖️', label: 'Compare & Save', desc: 'Compare prices and quality before you order' },
  { id: 'payment', emoji: '🔒', label: 'Secure Payment', desc: 'Safe and verified payment gateway for all orders' },
  { id: 'delivery', emoji: '🚚', label: 'On-time Delivery', desc: 'Reliable delivery partners for fresh produce daily' },
];

export const SORT_OPTIONS = [
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Rating' },
  { id: 'delivery', label: 'Fastest Delivery' },
  { id: 'orders', label: 'Most Ordered' },
];
