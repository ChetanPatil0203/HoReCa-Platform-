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

export const SUPPLIERS = [
  { id: 'sup1', name: 'Fresh Farm Suppliers', initials: 'FF', color: '#16A34A', bg: '#F0FDF4', rating: 4.8, reviews: 256, minOrder: 500, deliveryTime: '30-45 mins', location: 'Jalgaon', wholesale: true, verified: true, categories: ['veg-fruits', 'dairy'] },
  { id: 'sup2', name: 'Green Basket', initials: 'GB', color: '#2563EB', bg: '#EFF6FF', rating: 4.6, reviews: 189, minOrder: 200, deliveryTime: '45-60 mins', location: 'Jalgaon', wholesale: true, verified: true, categories: ['veg-fruits', 'beverages'] },
  { id: 'sup3', name: 'Daily Greens', initials: 'DG', color: '#059669', bg: '#ECFDF5', rating: 4.5, reviews: 120, minOrder: 300, deliveryTime: '60-90 mins', location: 'Jalgaon', wholesale: true, verified: true, categories: ['veg-fruits'] },
  { id: 'sup4', name: 'Nature\'s Harvest', initials: 'NH', color: '#D97706', bg: '#FFFBEB', rating: 4.7, reviews: 310, minOrder: 1000, deliveryTime: 'Same Day', location: 'Jalgaon', wholesale: true, verified: true, categories: ['grains', 'oil-spices'] },
];

export const SUPPLIER_PRODUCTS = {
  'sup1': [
    { id: 'p1', name: 'Tomato', price: 25, unit: 'kg', moq: 5, categoryId: 'veg-fruits', subCategory: 'Vegetables', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&h=200&fit=crop', description: 'Fresh red tomatoes', quality: 'Grade A', origin: 'Local Farms', shelfLife: '7 days', stock: 50, supplierId: 'sup1', supplierName: 'Fresh Farm Suppliers' },
    { id: 'p2', name: 'Onion', price: 20, unit: 'kg', moq: 5, categoryId: 'veg-fruits', subCategory: 'Vegetables', image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=300&h=200&fit=crop', description: 'Dry red onions', quality: 'Premium', origin: 'Nashik', shelfLife: '30 days', stock: 100, supplierId: 'sup1', supplierName: 'Fresh Farm Suppliers' },
    { id: 'p3', name: 'Potato', price: 18, unit: 'kg', moq: 5, categoryId: 'veg-fruits', subCategory: 'Vegetables', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=200&fit=crop', description: 'Fresh potatoes', quality: 'Grade A', origin: 'Local', shelfLife: '14 days', stock: 200, supplierId: 'sup1', supplierName: 'Fresh Farm Suppliers' },
    { id: 'p4', name: 'Cucumber', price: 22, unit: 'kg', moq: 5, categoryId: 'veg-fruits', subCategory: 'Vegetables', image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=300&h=200&fit=crop', description: 'Crisp green cucumber', quality: 'Standard', origin: 'Local', shelfLife: '5 days', stock: 40, supplierId: 'sup1', supplierName: 'Fresh Farm Suppliers' },
    { id: 'p5', name: 'Apple', price: 120, unit: 'kg', moq: 5, categoryId: 'veg-fruits', subCategory: 'Fruits', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?w=300&h=200&fit=crop', description: 'Fresh red apples', quality: 'Premium', origin: 'Kashmir', shelfLife: '10 days', stock: 30, supplierId: 'sup1', supplierName: 'Fresh Farm Suppliers' },
    { id: 'p6', name: 'Full-Cream Milk', price: 68, unit: 'litre', moq: 10, categoryId: 'dairy', subCategory: 'Milk', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop', description: 'Fresh full cream milk', quality: 'Premium', origin: 'Dairy Farm', shelfLife: '2 days', stock: 100, supplierId: 'sup1', supplierName: 'Fresh Farm Suppliers' }
  ],
  'sup2': [
    { id: 'p7', name: 'Cabbage', price: 15, unit: 'kg', moq: 5, categoryId: 'veg-fruits', subCategory: 'Vegetables', image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=300&h=200&fit=crop', description: 'Fresh cabbage', quality: 'Grade A', origin: 'Local', shelfLife: '7 days', stock: 50, supplierId: 'sup2', supplierName: 'Green Basket' },
    { id: 'p8', name: 'Carrot', price: 30, unit: 'kg', moq: 5, categoryId: 'veg-fruits', subCategory: 'Vegetables', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=200&fit=crop', description: 'Fresh carrots', quality: 'Premium', origin: 'Local', shelfLife: '10 days', stock: 60, supplierId: 'sup2', supplierName: 'Green Basket' },
    { id: 'p9', name: 'Mineral Water 1L (Case)', price: 420, unit: 'case', moq: 5, categoryId: 'beverages', subCategory: 'Water', image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=300&h=200&fit=crop', description: 'Packaged drinking water', quality: 'Standard', origin: 'Brand', shelfLife: '6 months', stock: 50, supplierId: 'sup2', supplierName: 'Green Basket' }
  ],
  'sup3': [
    { id: 'p10', name: 'Spinach', price: 28, unit: 'kg', moq: 5, categoryId: 'veg-fruits', subCategory: 'Leafy', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=200&fit=crop', description: 'Fresh spinach leaves', quality: 'Organic', origin: 'Local', shelfLife: '3 days', stock: 20, supplierId: 'sup3', supplierName: 'Daily Greens' },
    { id: 'p11', name: 'Coriander', price: 40, unit: 'kg', moq: 2, categoryId: 'veg-fruits', subCategory: 'Herbs', image: 'https://images.unsplash.com/photo-1596484552993-9c869fb7a9b6?w=300&h=200&fit=crop', description: 'Fresh coriander', quality: 'Standard', origin: 'Local', shelfLife: '3 days', stock: 15, supplierId: 'sup3', supplierName: 'Daily Greens' },
  ],
  'sup4': [
    { id: 'p12', name: 'Premium Basmati Rice', price: 85, unit: 'kg', moq: 50, categoryId: 'grains', subCategory: 'Rice', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop', description: 'Aged basmati rice', quality: 'Premium', origin: 'Punjab', shelfLife: '1 year', stock: 500, supplierId: 'sup4', supplierName: 'Nature\'s Harvest' },
    { id: 'p13', name: 'Toor Dal', price: 118, unit: 'kg', moq: 10, categoryId: 'grains', subCategory: 'Pulses', image: 'https://images.unsplash.com/photo-1585996452243-7f2a13cc75b2?w=300&h=200&fit=crop', description: 'Premium toor dal', quality: 'Grade A', origin: 'Local', shelfLife: '6 months', stock: 200, supplierId: 'sup4', supplierName: 'Nature\'s Harvest' },
    { id: 'p14', name: 'Sunflower Oil 15L', price: 1850, unit: 'tin', moq: 2, categoryId: 'oil-spices', subCategory: 'Oil', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop', description: 'Refined sunflower oil', quality: 'Standard', origin: 'Brand', shelfLife: '6 months', stock: 100, supplierId: 'sup4', supplierName: 'Nature\'s Harvest' },
  ]
};

// Original exports for the first page
export const PRODUCTS = [
  {
    id: 'p1', name: 'Red Onion', categoryId: 'veg-fruits',
    emoji: '🧅', color: '#B91C1C', bg: '#FEF2F2',
    price: 38, unit: 'per kg', moq: '20 kg', rating: 4.7,
    vendor: 'Farm to Fork', badge: 'Best Seller', badgeColor: '#16A34A',
    delivery: 'Same Day', inStock: true, orders: 320,
  },
  {
    id: 'p2', name: 'Potato', categoryId: 'veg-fruits',
    emoji: '🥔', color: '#92400E', bg: '#FEF3C7',
    price: 24, unit: 'per kg', moq: '25 kg', rating: 4.5,
    vendor: 'AgroPrime Foods', badge: null, badgeColor: null,
    delivery: 'Next Day', inStock: true, orders: 210,
  },
  {
    id: 'p3', name: 'Tomato', categoryId: 'veg-fruits',
    emoji: '🍅', color: '#DC2626', bg: '#FEF2F2',
    price: 42, unit: 'per kg', moq: '20 kg', rating: 4.6,
    vendor: 'Farm to Fork', badge: 'Fresh Stock', badgeColor: '#2563EB',
    delivery: 'Same Day', inStock: true, orders: 280,
  },
  {
    id: 'p4', name: 'Toor Dal', categoryId: 'grains',
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

export const CATEGORY_PRODUCTS = {};

export const VENDORS = [
  { id: 'v1', name: 'Metro Fresh Supplies', initials: 'MF', color: '#D97706', bg: '#FFFBEB', rating: 4.8, location: 'Mumbai, Maharashtra', products: 128, badge: 'Top Rated', badgeColor: '#16A34A' },
  { id: 'v2', name: 'Shree Traders', initials: 'ST', color: '#2563EB', bg: '#EFF6FF', rating: 4.6, location: 'Pune, Maharashtra', products: 84, badge: 'Verified', badgeColor: '#2563EB' },
  { id: 'v3', name: 'Quality Foods', initials: 'QF', color: '#7C3AED', bg: '#F5F3FF', rating: 4.7, location: 'Nashik, Maharashtra', products: 96, badge: null, badgeColor: null },
  { id: 'v4', name: 'Reliable Suppliers', initials: 'RS', color: '#059669', bg: '#ECFDF5', rating: 4.5, location: 'Nagpur, Maharashtra', products: 62, badge: null, badgeColor: null },
];

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
