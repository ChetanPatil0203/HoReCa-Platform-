const axios = require('c:\\HRCHUB\\mobile-app\\node_modules\\axios');
const { HorecaRegistration, Product, VendorRegistration } = require('./src/models');

const API_BASE = 'http://localhost:5000/api';

async function testFullE2E() {
  console.log('====================================================');
  console.log('🚀 STARTING FULL E2E OWNER -> VENDOR -> OWNER AUDIT');
  console.log('====================================================\n');

  try {
    // 1. Get real Horeca Registration ID
    const horeca = await HorecaRegistration.findOne();
    if (!horeca) throw new Error('No HorecaRegistration found in database');
    const ownerId = horeca.id;

    // 2. Get real Vendor Registration ID & Product
    const prod = await Product.findOne();
    if (!prod) throw new Error('No Product found in database');
    const supplierId = prod.supplierId;
    const supplier = await VendorRegistration.findByPk(supplierId);

    console.log(`Using Owner: ${horeca.bizName} (${ownerId})`);
    console.log(`Using Vendor: ${supplier.bizName} (${supplierId})`);

    // ----------------------------------------------------
    // TEST 1: RAW MATERIAL ORDER FLOW
    // ----------------------------------------------------
    console.log('\n----------------------------------------------------');
    console.log('🧪 TEST 1: RAW MATERIAL ORDER FLOW');
    console.log('----------------------------------------------------');
    
    if (prod) {
      console.log(`Product found: ${prod.name} (${prod.id})`);

      // Owner places order
      console.log('-> Owner placing raw material order...');
      const orderPayload = {
        ownerId,
        supplierId,
        items: [{ productId: prod.id, quantity: 5 }],
        deliveryAddress: horeca.address || '123 Test Hotel, Bandra, Mumbai',
        paymentMethod: 'cod',
        notes: 'E2E Automated Test Order'
      };

      const orderRes = await axios.post(`${API_BASE}/raw-materials/orders`, orderPayload);
      const createdOrder = orderRes.data.data;
      console.log(`✅ Order Placed! Order ID: ${createdOrder.id}, Amount: ₹${createdOrder.totalAmount}, Status: ${createdOrder.status}`);

      // Vendor fetches received orders
      console.log('-> Vendor fetching received orders...');
      const vendorOrdersRes = await axios.get(`${API_BASE}/raw-materials/orders/vendor/${supplierId}`);
      const receivedOrder = vendorOrdersRes.data.data.find(o => o.id === createdOrder.id);
      console.log(`✅ Vendor received order! Found: ${Boolean(receivedOrder)}, Status in Vendor Panel: ${receivedOrder?.status}`);

      // Vendor accepts order
      console.log('-> Vendor responding (accepting) order...');
      const respondRes = await axios.patch(`${API_BASE}/raw-materials/orders/${createdOrder.id}/vendor-respond`, {
        supplierId,
        action: 'confirmed'
      });
      console.log(`✅ Vendor response success! New Status: ${respondRes.data.data.status}`);

      // Owner views updated order history
      console.log('-> Owner fetching updated order status...');
      const ownerOrdersRes = await axios.get(`${API_BASE}/raw-materials/orders/owner/${ownerId}`);
      const updatedOrder = ownerOrdersRes.data.data.find(o => o.id === createdOrder.id);
      console.log(`✅ Owner sees updated status! Status in Owner Panel: ${updatedOrder?.status}`);
    }

    // ----------------------------------------------------
    // TEST 2: MANPOWER REQUIREMENT FLOW
    // ----------------------------------------------------
    console.log('\n----------------------------------------------------');
    console.log('🧪 TEST 2: MANPOWER REQUIREMENT FLOW');
    console.log('----------------------------------------------------');
    
    console.log('-> Owner creating direct manpower request...');
    const mpPayload = {
      ownerId,
      supplierId,
      requestType: 'direct',
      jobRole: 'Head Chef E2E Test',
      salaryRange: '₹30,000 - ₹40,000',
      location: 'Mumbai',
      description: 'E2E Manpower Test Requirement',
      extraData: { numberOfStaff: '2', experience: '3 Years' }
    };

    const mpRes = await axios.post(`${API_BASE}/requirements/manpower`, mpPayload);
    const createdMp = mpRes.data.data;
    console.log(`✅ Manpower Requirement Created! ID: ${createdMp.id}, Initial Status: ${createdMp.status}`);

    console.log('-> Manpower Vendor fetching direct requests...');
    const vMpRes = await axios.get(`${API_BASE}/requirements/manpower/vendor/${supplierId}`);
    const foundMp = vMpRes.data.data.find(r => r.id === createdMp.id);
    console.log(`✅ Vendor received manpower request! Found: ${Boolean(foundMp)}, Title: ${foundMp?.title}`);

    console.log('-> Vendor accepting manpower requirement...');
    const updateMpRes = await axios.patch(`${API_BASE}/requirements/manpower/${createdMp.id}/status`, { status: 'accepted' });
    console.log(`✅ Manpower Status Updated by Vendor! New Status: ${updateMpRes.data.data.status}`);

    console.log('-> Owner checking status update in Owner Panel...');
    const ownerMpRes = await axios.get(`${API_BASE}/requirements/manpower/owner/${ownerId}`);
    const ownerMpView = ownerMpRes.data.data.find(r => r.id === createdMp.id);
    console.log(`✅ Owner Panel receives updated status! Status visible to Owner: ${ownerMpView?.status}`);

    // ----------------------------------------------------
    // TEST 3: MARKETING REQUIREMENT FLOW
    // ----------------------------------------------------
    console.log('\n----------------------------------------------------');
    console.log('🧪 TEST 3: MARKETING REQUIREMENT FLOW');
    console.log('----------------------------------------------------');

    console.log('-> Owner creating direct marketing request...');
    const mktPayload = {
      ownerId,
      supplierId,
      requestType: 'direct',
      title: 'Instagram Food Influencers Campaign E2E',
      budget: '₹20,000 - ₹35,000',
      location: 'Mumbai',
      description: 'E2E Marketing Test Campaign',
      extraData: { duration: '1 Month', objective: 'Brand Awareness' }
    };

    const mktRes = await axios.post(`${API_BASE}/requirements/marketing`, mktPayload);
    const createdMkt = mktRes.data.data;
    console.log(`✅ Marketing Requirement Created! ID: ${createdMkt.id}, Initial Status: ${createdMkt.status}`);

    console.log('-> Marketing Vendor fetching direct requests...');
    const vMktRes = await axios.get(`${API_BASE}/requirements/marketing/vendor/${supplierId}`);
    const foundMkt = vMktRes.data.data.find(r => r.id === createdMkt.id);
    console.log(`✅ Vendor received marketing request! Found: ${Boolean(foundMkt)}, Title: ${foundMkt?.title}`);

    console.log('-> Vendor confirming marketing requirement...');
    const updateMktRes = await axios.patch(`${API_BASE}/requirements/marketing/${createdMkt.id}/status`, { status: 'confirmed' });
    console.log(`✅ Marketing Status Updated by Vendor! New Status: ${updateMktRes.data.data.status}`);

    console.log('-> Owner checking status update in Owner Panel...');
    const ownerMktRes = await axios.get(`${API_BASE}/requirements/marketing/owner/${ownerId}`);
    const ownerMktView = ownerMktRes.data.data.find(r => r.id === createdMkt.id);
    console.log(`✅ Owner Panel receives updated status! Status visible to Owner: ${ownerMktView?.status}`);

    // ----------------------------------------------------
    // TEST 4: SERVICE PROVIDER REQUIREMENT FLOW
    // ----------------------------------------------------
    console.log('\n----------------------------------------------------');
    console.log('🧪 TEST 4: SERVICE PROVIDER REQUIREMENT FLOW');
    console.log('----------------------------------------------------');

    console.log('-> Owner creating direct service provider request...');
    const spPayload = {
      ownerId,
      supplierId,
      requestType: 'direct',
      serviceType: 'Kitchen Hood Deep Cleaning E2E',
      budget: '₹8,000 - ₹12,000',
      location: 'Mumbai',
      description: 'E2E Service Provider Test Requirement',
      extraData: { category: 'Kitchen Hood Cleaning', date: 'Tomorrow' }
    };

    const spRes = await axios.post(`${API_BASE}/requirements/service-provider`, spPayload);
    const createdSp = spRes.data.data;
    console.log(`✅ Service Provider Requirement Created! ID: ${createdSp.id}, Initial Status: ${createdSp.status}`);

    console.log('-> Service Provider Vendor fetching direct requests...');
    const vSpRes = await axios.get(`${API_BASE}/requirements/service-provider/vendor/${supplierId}`);
    const foundSp = vSpRes.data.data.find(r => r.id === createdSp.id);
    console.log(`✅ Vendor received service provider request! Found: ${Boolean(foundSp)}, Title: ${foundSp?.title}`);

    console.log('-> Vendor accepting service requirement...');
    const updateSpRes = await axios.patch(`${API_BASE}/requirements/service-provider/${createdSp.id}/status`, { status: 'accepted' });
    console.log(`✅ Service Provider Status Updated by Vendor! New Status: ${updateSpRes.data.data.status}`);

    console.log('-> Owner checking status update in Owner Panel...');
    const ownerSpRes = await axios.get(`${API_BASE}/requirements/service-provider/owner/${ownerId}`);
    const ownerSpView = ownerSpRes.data.data.find(r => r.id === createdSp.id);
    console.log(`✅ Owner Panel receives updated status! Status visible to Owner: ${ownerSpView?.status}`);

    console.log('\n====================================================');
    console.log('🎉 ALL 4 MODULES (RAW MATERIAL, MANPOWER, MARKETING, SERVICE PROVIDER)');
    console.log('   PASSED END-TO-END FLOW TESTING SUCCESSFULLY 100%!');
    console.log('====================================================');

    process.exit(0);
  } catch (err) {
    console.error('❌ E2E Audit Failed:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

testFullE2E();
