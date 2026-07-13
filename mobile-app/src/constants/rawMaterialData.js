// ─────────────────────────────────────────────
//  Raw Material Marketplace — Local Mock Data
// ─────────────────────────────────────────────

export const CATEGORIES = [
  { id: 'veg-fruits',  label: 'Vegetables & Fruits',     emoji: '🥦', color: '#16A34A', bg: '#F0FDF4' },
  { id: 'dairy',       label: 'Dairy Products',           emoji: '🥛', color: '#2563EB', bg: '#EFF6FF' },
  { id: 'grains',      label: 'Rice, Flour & Grains',     emoji: '🌾', color: '#D97706', bg: '#FFFBEB' },
  { id: 'oil-spices',  label: 'Oil & Spices',             emoji: '🌶️', color: '#DC2626', bg: '#FEF2F2' },
  { id: 'meat',        label: 'Chicken, Meat & Seafood',  emoji: '🍗', color: '#7C3AED', bg: '#F5F3FF' },
  { id: 'beverages',   label: 'Beverages',                emoji: '🧃', color: '#0891B2', bg: '#ECFEFF' },
  { id: 'cleaning',    label: 'Cleaning Material',        emoji: '🧼', color: '#059669', bg: '#ECFDF5' },
  { id: 'packaging',   label: 'Packaging Material',       emoji: '📦', color: '#92400E', bg: '#FEF3C7' },
];

// ── Frequently Ordered (home carousel) ──────────────────────
export const PRODUCTS = [
  {
    id: 'p1', name: 'Red Onion',    categoryId: 'veg-fruits',
    emoji: '🧅', color: '#B91C1C', bg: '#FEF2F2',
    price: 38, unit: 'per kg', moq: '20 kg', rating: 4.7,
    vendor: 'Farm to Fork', badge: 'Best Seller', badgeColor: '#16A34A',
    delivery: 'Same Day', inStock: true, orders: 320,
  },
  {
    id: 'p2', name: 'Potato',       categoryId: 'veg-fruits',
    emoji: '🥔', color: '#92400E', bg: '#FEF3C7',
    price: 24, unit: 'per kg', moq: '25 kg', rating: 4.5,
    vendor: 'AgroPrime Foods', badge: null, badgeColor: null,
    delivery: 'Next Day', inStock: true, orders: 210,
  },
  {
    id: 'p3', name: 'Tomato',       categoryId: 'veg-fruits',
    emoji: '🍅', color: '#DC2626', bg: '#FEF2F2',
    price: 42, unit: 'per kg', moq: '20 kg', rating: 4.6,
    vendor: 'Farm to Fork', badge: 'Fresh Stock', badgeColor: '#2563EB',
    delivery: 'Same Day', inStock: true, orders: 280,
  },
  {
    id: 'p4', name: 'Toor Dal',     categoryId: 'grains',
    emoji: '🫘', color: '#D97706', bg: '#FFFBEB',
    price: 118, unit: 'per kg', moq: '10 kg', rating: 4.8,
    vendor: 'Metro Fresh Supplies', badge: 'Top Rated', badgeColor: '#D97706',
    delivery: 'Next Day', inStock: true, orders: 190,
  },
  {
    id: 'p5', name: 'Sunflower Oil 15L', categoryId: 'oil-spices',
    emoji: '🫙', color: '#CA8A04', bg: '#FEF9C3',
    price: 1850, unit: 'per tin', moq: '2 tins', rating: 4.9,
    vendor: 'Quality Foods', badge: 'Bulk Deal', badgeColor: '#7C3AED',
    delivery: '2 Days', inStock: true, orders: 145,
  },
];

// ── Per-Category Product Lists ───────────────────────────────
export const CATEGORY_PRODUCTS = {
  'veg-fruits': [
    { id: 'vf1', name: 'Red Onion',    categoryId: 'veg-fruits', emoji: '🧅', color: '#B91C1C', bg: '#FEF2F2', price: 38,  unit: 'per kg',  moq: '20 kg',  rating: 4.7, vendor: 'Farm to Fork',        badge: 'Best Seller', badgeColor: '#16A34A', delivery: 'Same Day', inStock: true,  orders: 320 },
    { id: 'vf2', name: 'Potato',       categoryId: 'veg-fruits', emoji: '🥔', color: '#92400E', bg: '#FEF3C7', price: 24,  unit: 'per kg',  moq: '25 kg',  rating: 4.5, vendor: 'AgroPrime Foods',     badge: null,          badgeColor: null,      delivery: 'Next Day', inStock: true,  orders: 210 },
    { id: 'vf3', name: 'Tomato',       categoryId: 'veg-fruits', emoji: '🍅', color: '#DC2626', bg: '#FEF2F2', price: 42,  unit: 'per kg',  moq: '20 kg',  rating: 4.6, vendor: 'Farm to Fork',        badge: 'Fresh Stock', badgeColor: '#2563EB', delivery: 'Same Day', inStock: true,  orders: 280 },
    { id: 'vf4', name: 'Cabbage',      categoryId: 'veg-fruits', emoji: '🥬', color: '#16A34A', bg: '#F0FDF4', price: 18,  unit: 'per kg',  moq: '10 kg',  rating: 4.3, vendor: 'AgroPrime Foods',     badge: null,          badgeColor: null,      delivery: 'Same Day', inStock: true,  orders: 150 },
    { id: 'vf5', name: 'Green Chilli', categoryId: 'veg-fruits', emoji: '🌶️', color: '#15803D', bg: '#F0FDF4', price: 55,  unit: 'per kg',  moq: '5 kg',   rating: 4.4, vendor: 'Shree Traders',       badge: null,          badgeColor: null,      delivery: 'Next Day', inStock: false, orders: 90  },
    { id: 'vf6', name: 'Cucumber',     categoryId: 'veg-fruits', emoji: '🥒', color: '#15803D', bg: '#F0FDF4', price: 22,  unit: 'per kg',  moq: '10 kg',  rating: 4.2, vendor: 'Farm to Fork',        badge: null,          badgeColor: null,      delivery: 'Same Day', inStock: true,  orders: 120 },
    { id: 'vf7', name: 'Carrot',       categoryId: 'veg-fruits', emoji: '🥕', color: '#EA580C', bg: '#FFF7ED', price: 30,  unit: 'per kg',  moq: '15 kg',  rating: 4.6, vendor: 'Metro Fresh Supplies', badge: 'Top Rated',   badgeColor: '#D97706', delivery: 'Same Day', inStock: true,  orders: 175 },
    { id: 'vf8', name: 'Spinach',      categoryId: 'veg-fruits', emoji: '🌿', color: '#16A34A', bg: '#F0FDF4', price: 28,  unit: 'per kg',  moq: '5 kg',   rating: 4.5, vendor: 'Farm to Fork',        badge: null,          badgeColor: null,      delivery: '2 Days',   inStock: true,  orders: 80  },
  ],
  'dairy': [
    { id: 'd1', name: 'Full-Cream Milk',  categoryId: 'dairy', emoji: '🥛', color: '#2563EB', bg: '#EFF6FF', price: 68,  unit: 'per litre', moq: '20 L',  rating: 4.8, vendor: 'Pure Dairy Co.',       badge: 'Top Rated', badgeColor: '#16A34A', delivery: 'Same Day', inStock: true, orders: 400 },
    { id: 'd2', name: 'Paneer (Fresh)',   categoryId: 'dairy', emoji: '🧀', color: '#D97706', bg: '#FFFBEB', price: 340, unit: 'per kg',    moq: '5 kg',  rating: 4.7, vendor: 'Pure Dairy Co.',       badge: 'Fresh',     badgeColor: '#16A34A', delivery: 'Same Day', inStock: true, orders: 230 },
    { id: 'd3', name: 'Curd (Dahi)',      categoryId: 'dairy', emoji: '🥄', color: '#2563EB', bg: '#EFF6FF', price: 55,  unit: 'per kg',    moq: '10 kg', rating: 4.5, vendor: 'Pure Dairy Co.',       badge: null,        badgeColor: null,      delivery: 'Same Day', inStock: true, orders: 190 },
    { id: 'd4', name: 'Butter (Amul)',   categoryId: 'dairy', emoji: '🧈', color: '#D97706', bg: '#FFFBEB', price: 520, unit: 'per kg',    moq: '2 kg',  rating: 4.9, vendor: 'Metro Fresh Supplies',  badge: 'Best Seller',badgeColor: '#16A34A', delivery: 'Next Day', inStock: true, orders: 310 },
  ],
  'grains': [
    { id: 'g1', name: 'Premium Basmati Rice',    categoryId: 'grains', emoji: '🍚', color: '#D97706', bg: '#FFFBEB', price: 85,  unit: 'per kg', moq: '50 kg', rating: 4.9, vendor: 'Metro Fresh Supplies', badge: 'Best Seller', badgeColor: '#16A34A', delivery: 'Next Day', inStock: true,  orders: 450 },
    { id: 'g2', name: 'Wheat Flour (Atta)',      categoryId: 'grains', emoji: '🌾', color: '#D97706', bg: '#FFFBEB', price: 44,  unit: 'per kg', moq: '20 kg', rating: 4.6, vendor: 'Shree Traders',        badge: null,          badgeColor: null,      delivery: '2 Days',   inStock: true,  orders: 220 },
    { id: 'g3', name: 'Toor Dal',               categoryId: 'grains', emoji: '🫘', color: '#D97706', bg: '#FFFBEB', price: 118, unit: 'per kg', moq: '10 kg', rating: 4.8, vendor: 'Metro Fresh Supplies', badge: 'Top Rated',   badgeColor: '#D97706', delivery: 'Next Day', inStock: true,  orders: 190 },
    { id: 'g4', name: 'Maida (Refined Flour)',   categoryId: 'grains', emoji: '🧂', color: '#94A3B8', bg: '#F8FAFC', price: 38,  unit: 'per kg', moq: '20 kg', rating: 4.4, vendor: 'Reliable Suppliers',   badge: null,          badgeColor: null,      delivery: '2 Days',   inStock: false, orders: 130 },
  ],
  'oil-spices': [
    { id: 'os1', name: 'Sunflower Oil 15L', categoryId: 'oil-spices', emoji: '🫙', color: '#CA8A04', bg: '#FEF9C3', price: 1850, unit: 'per tin', moq: '2 tins', rating: 4.9, vendor: 'Quality Foods',  badge: 'Bulk Deal', badgeColor: '#7C3AED', delivery: '2 Days',   inStock: true, orders: 145 },
    { id: 'os2', name: 'Mustard Oil 5L',    categoryId: 'oil-spices', emoji: '🫒', color: '#D97706', bg: '#FFFBEB', price: 720,  unit: 'per can', moq: '4 cans', rating: 4.6, vendor: 'Quality Foods',  badge: null,        badgeColor: null,      delivery: 'Next Day', inStock: true, orders: 98  },
    { id: 'os3', name: 'Turmeric Powder',   categoryId: 'oil-spices', emoji: '🌼', color: '#D97706', bg: '#FFFBEB', price: 180,  unit: 'per kg',  moq: '5 kg',   rating: 4.7, vendor: 'Shree Traders', badge: 'Organic',   badgeColor: '#16A34A', delivery: 'Next Day', inStock: true, orders: 200 },
  ],
  'meat': [
    { id: 'm1', name: 'Chicken (Fresh Whole)', categoryId: 'meat', emoji: '🍗', color: '#7C3AED', bg: '#F5F3FF', price: 195, unit: 'per kg', moq: '10 kg', rating: 4.7, vendor: 'Fresh Meat Co.', badge: 'Daily Fresh', badgeColor: '#16A34A', delivery: 'Same Day', inStock: true, orders: 340 },
    { id: 'm2', name: 'Mutton (Boneless)',     categoryId: 'meat', emoji: '🥩', color: '#B91C1C', bg: '#FEF2F2', price: 680, unit: 'per kg', moq: '5 kg',  rating: 4.8, vendor: 'Fresh Meat Co.', badge: null,          badgeColor: null,      delivery: 'Same Day', inStock: true, orders: 180 },
  ],
  'beverages': [
    { id: 'bv1', name: 'Mineral Water 1L (Case)', categoryId: 'beverages', emoji: '💧', color: '#0891B2', bg: '#ECFEFF', price: 420, unit: 'per case (24)', moq: '5 cases', rating: 4.8, vendor: 'Metro Fresh Supplies', badge: 'Best Seller', badgeColor: '#16A34A', delivery: 'Same Day', inStock: true, orders: 520 },
    { id: 'bv2', name: 'Fresh Orange Juice 1L',   categoryId: 'beverages', emoji: '🍊', color: '#EA580C', bg: '#FFF7ED', price: 110, unit: 'per litre',    moq: '20 L',     rating: 4.5, vendor: 'Reliable Suppliers',   badge: null,          badgeColor: null,      delivery: 'Next Day', inStock: true, orders: 120 },
  ],
  'cleaning': [
    { id: 'cl1', name: 'Dishwash Liquid 5L', categoryId: 'cleaning', emoji: '🧴', color: '#059669', bg: '#ECFDF5', price: 380, unit: 'per can', moq: '4 cans', rating: 4.6, vendor: 'CleanPro Supplies', badge: null, badgeColor: null, delivery: '2 Days', inStock: true,  orders: 140 },
    { id: 'cl2', name: 'Floor Cleaner 5L',   categoryId: 'cleaning', emoji: '🫧', color: '#059669', bg: '#ECFDF5', price: 295, unit: 'per can', moq: '4 cans', rating: 4.4, vendor: 'CleanPro Supplies', badge: null, badgeColor: null, delivery: '2 Days', inStock: false, orders: 80  },
  ],
  'packaging': [
    { id: 'pk1', name: 'Takeaway Boxes (Pack 100)', categoryId: 'packaging', emoji: '📦', color: '#92400E', bg: '#FEF3C7', price: 450, unit: 'per pack',   moq: '10 packs',   rating: 4.5, vendor: 'PackRight Co.', badge: null, badgeColor: null, delivery: '2 Days', inStock: true, orders: 210 },
    { id: 'pk2', name: 'Food-Grade Polybags',       categoryId: 'packaging', emoji: '🛍️', color: '#92400E', bg: '#FEF3C7', price: 180, unit: 'per bundle', moq: '5 bundles',  rating: 4.3, vendor: 'PackRight Co.', badge: null, badgeColor: null, delivery: '2 Days', inStock: true, orders: 160 },
  ],
};

export const VENDORS = [
  { id: 'v1', name: 'Metro Fresh Supplies', initials: 'MF', color: '#D97706', bg: '#FFFBEB', rating: 4.8, location: 'Mumbai, Maharashtra', products: 128, badge: 'Top Rated', badgeColor: '#16A34A' },
  { id: 'v2', name: 'Shree Traders',        initials: 'ST', color: '#2563EB', bg: '#EFF6FF', rating: 4.6, location: 'Pune, Maharashtra',   products: 84,  badge: 'Verified',   badgeColor: '#2563EB' },
  { id: 'v3', name: 'Quality Foods',        initials: 'QF', color: '#7C3AED', bg: '#F5F3FF', rating: 4.7, location: 'Nashik, Maharashtra', products: 96,  badge: null, badgeColor: null },
  { id: 'v4', name: 'Reliable Suppliers',   initials: 'RS', color: '#059669', bg: '#ECFDF5', rating: 4.5, location: 'Nagpur, Maharashtra', products: 62,  badge: null, badgeColor: null },
];

export const FEATURES = [
  { id: 'quotes',   emoji: '📋', label: 'Request Quotes',   desc: 'Get competitive quotes from multiple vendors instantly' },
  { id: 'compare',  emoji: '⚖️',  label: 'Compare & Save',  desc: 'Compare prices and quality before you order' },
  { id: 'payment',  emoji: '🔒', label: 'Secure Payment',   desc: 'Safe and verified payment gateway for all orders' },
  { id: 'delivery', emoji: '🚚', label: 'On-time Delivery', desc: 'Reliable delivery partners for fresh produce daily' },
];

export const SORT_OPTIONS = [
  { id: 'price-asc',  label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating',     label: 'Rating' },
  { id: 'delivery',   label: 'Fastest Delivery' },
  { id: 'orders',     label: 'Most Ordered' },
];
