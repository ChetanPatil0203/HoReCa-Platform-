const isWeb = typeof window !== 'undefined' && window.localStorage;

const getLocal = (key, fallback) => {
  if (isWeb) {
    const data = window.localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  }
  return fallback;
};

const saveLocal = (key, data) => {
  if (isWeb) {
    window.localStorage.setItem(key, JSON.stringify(data));
  }
};

let memOrders = getLocal('hrchub_orders', [
  { id: "ORD-287", title: "Premium Basmati Rice", category: "raw-material", qty: "500 kg", vendor: "Metro Fresh Supplies", date: "14 Jun 2026", status: "Accepted", amount: "₹18,500", client: "The Meridian Hotels" },
  { id: "ORD-286", title: "Weekend Kitchen Staff (2)", category: "manpower", qty: "2 persons", vendor: "Elite Staffing Co.", date: "13 Jun 2026", status: "Pending", amount: "₹6,400", client: "The Meridian Hotels" },
  { id: "ORD-285", title: "Deep Kitchen Cleaning", category: "service", qty: "Full property", vendor: "ProClean Services", date: "13 Jun 2026", status: "Accepted", amount: "₹8,500", client: "The Meridian Hotels" },
  { id: "ORD-284", title: "June Social Campaign", category: "marketing", qty: "30 days", vendor: "BrandCraft Agency", date: "12 Jun 2026", status: "New", amount: "₹35,000", client: "The Meridian Hotels" },
  { id: "ORD-283", title: "Fresh Vegetables Pack", category: "raw-material", qty: "200 kg", vendor: "Metro Fresh Supplies", date: "11 Jun 2026", status: "Accepted", amount: "₹12,200", client: "The Meridian Hotels" },
  { id: "ORD-279", title: "Atlantic Salmon Fillet", category: "raw-material", qty: "50 kg", vendor: "Pacific Seafood Co.", date: "08 Jun 2026", status: "Pending", amount: "₹24,000", client: "The Meridian Hotels" }
]);

export const mockDb = {
  getOrders: () => memOrders,
  saveOrders: (list) => {
    memOrders = list;
    saveLocal('hrchub_orders', list);
  },
  addOrder: (order) => {
    memOrders.unshift(order);
    saveLocal('hrchub_orders', memOrders);
  }
};
