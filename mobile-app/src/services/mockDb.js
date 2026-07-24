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

let memOrders = getLocal('hrchub_orders', []);

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
