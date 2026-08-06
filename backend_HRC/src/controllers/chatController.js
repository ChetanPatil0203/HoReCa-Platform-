const { ChatSession, ChatMessage, User, HorecaRegistration, VendorRegistration, Order, OrderItem, Product, ManpowerRequirement, MarketingRequirement, ServiceProviderRequirement } = require('../models');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Gemini API
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Helper to fetch actual DB records for cards
const getRealDbRecord = async (userId, keyword) => {
  try {
    // 1. Find Horeca or Vendor Registration
    const horeca = await HorecaRegistration.findOne({ where: { userId } });
    const vendor = await VendorRegistration.findOne({ where: { userId } });

    const ownerId = horeca ? horeca.id : null;
    const supplierId = vendor ? vendor.id : null;

    if (keyword === 'order') {
      let order = null;
      if (ownerId) {
        order = await Order.findOne({
          where: { ownerId },
          order: [['createdAt', 'DESC']],
          include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
        });
      } else if (supplierId) {
        order = await Order.findOne({
          where: { supplierId },
          order: [['createdAt', 'DESC']],
          include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
        });
      }

      if (order) {
        const firstItem = order.items && order.items[0];
        const productName = firstItem && firstItem.product ? firstItem.product.name : 'Raw Material Package';
        return {
          type: 'card',
          cardType: 'order',
          cardData: {
            orderId: order.id.slice(0, 8).toUpperCase(),
            product: productName,
            status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
            expected: 'Today • 05:00 PM'
          },
          text: `I found your latest order (${order.id.slice(0, 8).toUpperCase()}). Here is the tracking detail:`
        };
      }
    }

    if (keyword === 'manpower') {
      let req = null;
      if (ownerId) {
        req = await ManpowerRequirement.findOne({ where: { ownerId }, order: [['createdAt', 'DESC']] });
      } else if (supplierId) {
        req = await ManpowerRequirement.findOne({ where: { supplierId }, order: [['createdAt', 'DESC']] });
      }

      if (req) {
        return {
          type: 'card',
          cardType: 'manpower',
          cardData: {
            title: req.jobRole || 'Manpower Requirement',
            status: req.status ? (req.status.charAt(0).toUpperCase() + req.status.slice(1)) : 'Active',
            detail: `Staff Required: ${req.numberOfStaff || 1} candidates`
          },
          text: 'Here is your active manpower requirement status:'
        };
      }
    }

    if (keyword === 'marketing') {
      let req = null;
      if (ownerId) {
        req = await MarketingRequirement.findOne({ where: { ownerId }, order: [['createdAt', 'DESC']] });
      } else if (supplierId) {
        req = await MarketingRequirement.findOne({ where: { supplierId }, order: [['createdAt', 'DESC']] });
      }

      if (req) {
        return {
          type: 'card',
          cardType: 'marketing',
          cardData: {
            title: req.campaignType || 'Marketing Campaign',
            status: req.status ? (req.status.charAt(0).toUpperCase() + req.status.slice(1)) : 'Active',
            detail: `Budget: ${req.budget || 'N/A'}`
          },
          text: 'I retrieved your active marketing campaign details:'
        };
      }
    }

    if (keyword === 'service') {
      let req = null;
      if (ownerId) {
        req = await ServiceProviderRequirement.findOne({ where: { ownerId }, order: [['createdAt', 'DESC']] });
      } else if (supplierId) {
        req = await ServiceProviderRequirement.findOne({ where: { supplierId }, order: [['createdAt', 'DESC']] });
      }

      if (req) {
        return {
          type: 'card',
          cardType: 'service',
          cardData: {
            title: req.serviceType || 'Service Booking',
            status: req.status ? (req.status.charAt(0).toUpperCase() + req.status.slice(1)) : 'Active',
            detail: `Category: ${req.category || 'Maintenance'}`
          },
          text: 'Here are the details for your scheduled service requirement:'
        };
      }
    }
  } catch (err) {
    console.error('Error fetching real db records for chat:', err);
  }
  return null;
};

exports.createSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title } = req.body;
    const session = await ChatSession.create({
      userId,
      title: title || 'New Conversation',
    });
    return res.status(201).json({ success: true, data: session });
  } catch (error) {
    console.error('Error creating chat session:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = await ChatSession.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    console.error('Error getting chat sessions:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await ChatSession.destroy({
      where: { id: sessionId },
    });
    return res.status(200).json({ success: true, message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await ChatMessage.findAll({
      where: { sessionId },
      order: [['createdAt', 'ASC']],
    });
    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Error getting session messages:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { sessionId, text } = req.body;
    const userId = req.user.id;

    if (!sessionId || !text) {
      return res.status(400).json({ success: false, message: 'Session ID and text are required' });
    }

    // Verify session exists
    let session = await ChatSession.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Chat session not found' });
    }

    // If session title is default, update it using the first message
    if (session.title === 'New Conversation' || session.title === 'New Chat') {
      const displayTitle = text.length > 40 ? text.substring(0, 40) + '...' : text;
      await session.update({ title: displayTitle });
    }

    // Save user message
    const userMessage = await ChatMessage.create({
      sessionId,
      sender: 'user',
      type: 'text',
      text,
    });

    let botResponseText = '';
    let responseType = 'text';
    let cardType = null;
    let cardData = null;

    // Detect intent for cards
    const q = text.toLowerCase().trim();
    let cardResponse = null;

    if (q.includes('order') || q.includes('track') || q.includes('status') || q.includes('delivery')) {
      cardResponse = await getRealDbRecord(userId, 'order');
    } else if (q.includes('staff') || q.includes('hire') || q.includes('manpower') || q.includes('chef') || q.includes('waiter') || q.includes('cook')) {
      cardResponse = await getRealDbRecord(userId, 'manpower');
    } else if (q.includes('marketing') || q.includes('agency') || q.includes('campaign') || q.includes('promote') || q.includes('ad')) {
      cardResponse = await getRealDbRecord(userId, 'marketing');
    } else if (q.includes('service') || q.includes('repair') || q.includes('clean') || q.includes('plumber') || q.includes('electrician') || q.includes('pest')) {
      cardResponse = await getRealDbRecord(userId, 'service');
    }

    if (cardResponse) {
      botResponseText = cardResponse.text;
      responseType = 'card';
      cardType = cardResponse.cardType;
      cardData = cardResponse.cardData;
    } else if (genAI) {
      try {
        // Generate with Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const systemInstruction = "You are HRC Business AI, a smart assistant built for HRC HUB. HRC HUB is a B2B platform for Hotels, Restaurants, and Cafes (HoReCa) to manage raw materials, hire manpower, book services, and run marketing. Keep answers helpful, business-focused, professional, and concise. Answer in Marathi or English depending on how user asks.";
        
        const result = await model.generateContent([
          { text: systemInstruction },
          { text: `User Message: ${text}` }
        ]);
        botResponseText = result.response.text();
      } catch (geminiError) {
        console.error('Gemini generation error, falling back to basic reply:', geminiError);
        botResponseText = "I'm your HRC Business Assistant, specialized in helping you manage your HoReCa operations. How can I help you today?";
      }
    } else {
      botResponseText = "I'm your HRC Business Assistant, specialized in helping you manage your HoReCa operations. How can I help you today?";
    }

    // Save bot message
    const botMessage = await ChatMessage.create({
      sessionId,
      sender: 'bot',
      type: responseType,
      text: botResponseText,
      cardType,
      cardData,
    });

    return res.status(200).json({
      success: true,
      data: {
        userMessage,
        botMessage
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
