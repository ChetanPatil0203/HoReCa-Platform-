// mockDb.js — Persistent local database simulation using localStorage

const DEFAULT_ORDERS = [
  {
    id: "ORD-291",
    title: "Premium Basmati Rice",
    qty: "600 kg",
    vendor: "Metro Fresh Supplies",
    date: "16 Jun 2026",
    status: "New",
    amount: "₹21,000",
    client: "The Meridian Hotels",
    clientType: "Hotel",
    location: "Bandra, Mumbai",
    urgency: "Urgent",
    category: "raw-material",
    notes: "Long grain, aged 2yr preferred. Must deliver before 8am. Loading dock at rear entrance.",
    truckLat: 15,
    temperature: 24,
    humidity: 55,
  },
  {
    id: "ORD-289",
    title: "Sunflower Oil (Refined) – 100L",
    qty: "100 L",
    vendor: "Metro Fresh Supplies",
    date: "17 Jun 2026",
    status: "Pending",
    amount: "₹14,500",
    client: "The Meridian Hotels",
    clientType: "Hotel",
    location: "Andheri, Mumbai",
    urgency: "Normal",
    category: "raw-material",
    notes: "Double-filtered, FSSAI certified. 5L cans preferred.",
    truckLat: 45,
    temperature: 22,
    humidity: 50,
  },
  {
    id: "ORD-287",
    title: "Atlantic Salmon Fillet",
    qty: "80 kg",
    vendor: "Pacific Seafood Co.",
    date: "15 Jun 2026",
    status: "Accepted",
    amount: "₹78,400",
    client: "The Meridian Hotels",
    clientType: "Hotel",
    location: "Juhu, Mumbai",
    urgency: "Urgent",
    category: "raw-material",
    notes: "Chilled, not frozen. HACCP certified vendor only. Chilled transport mandatory.",
    truckLat: 70,
    temperature: 3.8,
    humidity: 85,
  },
  {
    id: "ORD-283",
    title: "Fresh Vegetables Pack",
    qty: "200 kg",
    vendor: "Metro Fresh Supplies",
    date: "14 Jun 2026",
    status: "Delivered",
    amount: "₹8,200",
    client: "The Meridian Hotels",
    clientType: "Hotel",
    location: "Lower Parel, Mumbai",
    urgency: "Normal",
    category: "raw-material",
    truckLat: 100,
    temperature: 12,
    humidity: 70,
  },
];

const DEFAULT_TICKETS = [
  {
    id: "CH-2025-812",
    raisedBy: "The Meridian Hotels",
    issueType: "Payment Delay",
    priority: "SLA Critical",
    status: "Open",
    assignedTo: "Support Rep A",
    date: "24 May 2026, 11:20 AM",
    description: "Merchant has not received payment for Order #ORD-1250 placed on 20 May 2026. Delay exceeds standard 24h cycle.",
    comments: [
      { sender: "System", text: "Ticket created automatically due to payout delay threshold breach.", time: "11:20 AM" },
      { sender: "Super Admin", text: "We are looking into this issue and will resolve it soon.", time: "11:25 AM" }
    ]
  },
  {
    id: "CH-2025-813",
    raisedBy: "Café Coffee Day",
    issueType: "Wrong Item Delivered",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "Support Rep B",
    date: "24 May 2026, 09:10 AM",
    description: "Received whole coffee beans instead of medium-grind powder for stock item CCD-89.",
    comments: [
      { sender: "Neha Mathews", text: "Please expedite, we are running out of espresso powder.", time: "09:12 AM" }
    ]
  }
];

const DEFAULT_KYC = [
  {
    id: "KYC-1024",
    businessName: "Hotel Blue Sapphire",
    type: "Hotel",
    proprietor: "Rahul Mehta",
    location: "Mumbai",
    dateSubmitted: "24 May 2026, 10:50 AM",
    status: "Pending",
    fssaiNumber: "FSSAI-122456708912",
    gstinNumber: "27AABCB1234H1Z5",
    panNumber: "AABCB1234H"
  },
  {
    id: "KYC-1025",
    businessName: "The Grand Palace",
    type: "Hotel",
    proprietor: "Suresh Das",
    location: "Delhi",
    dateSubmitted: "24 May 2026, 08:30 AM",
    status: "Pending",
    fssaiNumber: "FSSAI-108746283941",
    gstinNumber: "07AAACG8472K1Z3",
    panNumber: "AAACG8472K"
  }
];

const DEFAULT_FEED_ITEMS = [
  { id:"fw-01", orderId:"ORD-M001", category:"manpower", title:"Weekend Banquet Servers – 10 persons",
    description:"Need 10 trained servers for Saturday evening gala dinner. 6PM–midnight shift. Formal attire mandatory. Experience in fine dining essential.",
    businessName:"The Meridian Grand", businessType:"Hotel", location:"Bandra, Mumbai",
    qty:"10 persons", date:"21 Jun 2026", budget:"₹20,000", tags:["Fine Dining","Weekend","Formal"],
    status:"New", postedAt:"5 min ago", urgency:"Urgent" },
  { id:"fw-02", orderId:"ORD-M002", category:"manpower", title:"Head Chef – Italian Cuisine (Long Term)",
    description:"Seeking experienced Head Chef specialising in Italian cuisine. Min 5yr experience. Pasta, risotto, wood-fired pizza expertise required. Trial shift before confirmation.",
    businessName:"Trattoria Milano", businessType:"Restaurant", location:"Colaba, Mumbai",
    qty:"1 person", date:"25 Jun 2026", budget:"₹65,000/mo", tags:["Head Chef","Italian","Long Term"],
    status:"Pending", postedAt:"2 hrs ago", urgency:"Normal" },
  { id:"fw-03", orderId:"ORD-M003", category:"manpower", title:"Barista – Part-time (Weekends Only)",
    description:"Looking for a skilled barista for weekend shifts (Sat & Sun, 8AM–4PM). Latte art essential. English proficiency required.",
    businessName:"Café Zephyr Group", businessType:"Café", location:"Lower Parel, Mumbai",
    qty:"2 persons", date:"22 Jun 2026", budget:"₹7,200", tags:["Barista","Part-time","Coffee"],
    status:"New", postedAt:"3 hrs ago", urgency:"Normal" },
  { id:"fw-04", orderId:"ORD-M004", category:"manpower", title:"Security Guards – Night Shift",
    description:"Require 2 security guards for night shift (10PM–6AM). Ex-military or retired police preferred. CCTV monitoring experience required.",
    businessName:"Azure Palace Hotel", businessType:"Hotel", location:"Juhu, Mumbai",
    qty:"2 persons", date:"20 Jun 2026", budget:"₹36,000/mo", tags:["Security","Night Shift","Hotel"],
    status:"Proposal Sent", postedAt:"Yesterday", urgency:"Normal" },
  { id:"fw-05", orderId:"ORD-S001", category:"service", title:"HVAC Annual Maintenance – 22 Units",
    description:"Full annual maintenance contract for 22 HVAC units across 4 floors. Includes quarterly filter replacement and emergency call-out within 4 hours.",
    businessName:"Sunset Resort", businessType:"Hotel", location:"Versova, Mumbai",
    qty:"22 units / 12 months", date:"25 Jun 2026", budget:"₹85,000/yr", tags:["HVAC","AMC","Annual Contract"],
    status:"New", postedAt:"1 hr ago", urgency:"Normal" },
  { id:"fw-06", orderId:"ORD-S002", category:"service", title:"Commercial Kitchen Deep Cleaning (3 Sections)",
    description:"Overnight deep clean required for 3 kitchen sections. Must use FSSAI-approved food-safe chemicals only. Work window: 12AM–5AM.",
    businessName:"The Meridian Grand", businessType:"Hotel", location:"Bandra, Mumbai",
    qty:"3 kitchen sections", date:"20 Jun 2026", budget:"₹22,000", tags:["Deep Clean","Overnight","FSSAI"],
    status:"Pending", postedAt:"4 hrs ago", urgency:"Urgent" },
  { id:"fw-07", orderId:"ORD-S003", category:"service", title:"Monthly Pest Control – Full Property",
    description:"FSSAI-compliant rodent and cockroach treatment for full restaurant premises. Certified pest control agency only. Child and food-safe chemicals mandatory.",
    businessName:"Spice Route Restaurant", businessType:"Restaurant", location:"Andheri, Mumbai",
    qty:"Full property", date:"22 Jun 2026", budget:"₹4,800", tags:["Pest Control","FSSAI","Monthly"],
    status:"New", postedAt:"6 hrs ago", urgency:"Normal" },
  { id:"fw-08", orderId:"ORD-S004", category:"service", title:"Electrical Wiring Audit & Repair",
    description:"Complete electrical audit of kitchen and dining area. Identify and repair faults. Must be a licensed electrical contractor. Compliance certificate required on completion.",
    businessName:"Café Zephyr Group", businessType:"Café", location:"Lower Parel, Mumbai",
    qty:"Full property", date:"24 Jun 2026", budget:"₹12,000", tags:["Electrical","Licensed","Audit"],
    status:"Accepted", postedAt:"2 days ago", urgency:"Normal" },
  { id:"fw-09", orderId:"ORD-K001", category:"marketing", title:"July Social Media Campaign – 30 Days",
    description:"Full social media management for July. 12 Reels + 20 static posts for Instagram & Facebook. Food-forward aesthetic. Influencer collaboration preferred.",
    businessName:"Azure Palace Hotel", businessType:"Hotel", location:"Juhu, Mumbai",
    qty:"30 days", date:"01 Jul 2026", budget:"₹40,000", tags:["Social Media","Instagram","Reels"],
    status:"New", postedAt:"30 min ago", urgency:"Normal" },
  { id:"fw-10", orderId:"ORD-K002", category:"marketing", title:"Complete Menu Photography – 82 Items",
    description:"Professional food photography for full menu (82 dishes). Dark-wood table styling preferred. Natural light setup. RAW files + retouched JPEGs. Delivery within 5 working days.",
    businessName:"Spice Route Restaurant", businessType:"Restaurant", location:"Andheri, Mumbai",
    qty:"82 menu items", date:"26 Jun 2026", budget:"₹18,000", tags:["Photography","Menu","Food Styling"],
    status:"Proposal Sent", postedAt:"Yesterday", urgency:"Normal" },
  { id:"fw-11", orderId:"ORD-K003", category:"marketing", title:"Google Ads Campaign – 3 Months",
    description:"Search + Display Ads setup and management for 3 months. Focus on reservation conversions. ₹8,000/month ad spend handled by client. ROI reporting monthly.",
    businessName:"The Grand Bistro", businessType:"Restaurant", location:"Fort, Mumbai",
    qty:"3 months", date:"01 Jul 2026", budget:"₹24,000", tags:["Google Ads","PPC","ROI"],
    status:"New", postedAt:"5 hrs ago", urgency:"Urgent" },
  { id:"fw-12", orderId:"ORD-K004", category:"marketing", title:"Influencer Campaign – 5 Micro Creators",
    description:"Coordinate 5 food-lifestyle micro-influencers (20K–100K followers). Reels + stories. Full content calendar and deliverables list to be submitted before execution.",
    businessName:"Café Zephyr Group", businessType:"Café", location:"Lower Parel, Mumbai",
    qty:"5 creators", date:"28 Jun 2026", budget:"₹42,000", tags:["Influencer","Micro","Content"],
    status:"Accepted", postedAt:"2 days ago", urgency:"Normal" }
];

export const mockDb = {
  init: () => {
    let resetOrders = false;
    try {
      const existing = localStorage.getItem("hrchub_orders");
      if (existing) {
        const parsed = JSON.parse(existing);
        if (parsed.length > 0 && (!parsed[0].vendor || !parsed[0].client || !parsed[0].category)) {
          resetOrders = true;
        }
      }
    } catch (e) {
      resetOrders = true;
    }

    if (!localStorage.getItem("hrchub_orders") || resetOrders) {
      localStorage.setItem("hrchub_orders", JSON.stringify(DEFAULT_ORDERS));
    } else {
      try {
        const existing = localStorage.getItem("hrchub_orders");
        if (existing) {
          const parsed = JSON.parse(existing);
          const filtered = parsed.filter((o) => o.id !== "ORD-952");
          if (filtered.length !== parsed.length) {
            localStorage.setItem("hrchub_orders", JSON.stringify(filtered));
          }
        }
      } catch (e) {}
    }
    if (!localStorage.getItem("hrchub_tickets")) {
      localStorage.setItem("hrchub_tickets", JSON.stringify(DEFAULT_TICKETS));
    }
    if (!localStorage.getItem("hrchub_kyc")) {
      localStorage.setItem("hrchub_kyc", JSON.stringify(DEFAULT_KYC));
    }
    if (!localStorage.getItem("hrchub_feed")) {
      localStorage.setItem("hrchub_feed", JSON.stringify(DEFAULT_FEED_ITEMS));
    }
  },

  getOrders: () => {
    mockDb.init();
    return JSON.parse(localStorage.getItem("hrchub_orders") || "[]");
  },

  saveOrders: (orders) => {
    localStorage.setItem("hrchub_orders", JSON.stringify(orders));
  },

  addOrder: (order) => {
    const orders = mockDb.getOrders();
    orders.unshift(order);
    mockDb.saveOrders(orders);
  },

  updateOrderStatus: (id, status, extra = {}) => {
    const orders = mockDb.getOrders();
    const updated = orders.map(o => {
      if (o.id === id) {
        const truckLat = status === "Accepted" ? 10 : status === "Delivered" ? 100 : o.truckLat;
        const temperature = status === "Accepted" ? 4.0 : o.temperature;
        return { ...o, status, truckLat, temperature, ...extra };
      }
      return o;
    });
    mockDb.saveOrders(updated);
  },

  getTickets: () => {
    mockDb.init();
    return JSON.parse(localStorage.getItem("hrchub_tickets") || "[]");
  },

  saveTickets: (tickets) => {
    localStorage.setItem("hrchub_tickets", JSON.stringify(tickets));
  },

  getKYC: () => {
    mockDb.init();
    return JSON.parse(localStorage.getItem("hrchub_kyc") || "[]");
  },

  saveKYC: (kyc) => {
    localStorage.setItem("hrchub_kyc", JSON.stringify(kyc));
  },

  getFeed: () => {
    mockDb.init();
    return JSON.parse(localStorage.getItem("hrchub_feed") || "[]");
  },

  saveFeed: (feed) => {
    localStorage.setItem("hrchub_feed", JSON.stringify(feed));
  },

  addFeedItem: (item) => {
    const feed = mockDb.getFeed();
    feed.unshift(item);
    mockDb.saveFeed(feed);
  },

  updateFeedItemStatus: (id, status) => {
    const feed = mockDb.getFeed();
    const updated = feed.map(i => i.id === id ? { ...i, status } : i);
    mockDb.saveFeed(updated);
  }
};
