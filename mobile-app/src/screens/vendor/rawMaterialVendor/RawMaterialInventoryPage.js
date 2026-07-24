import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity,
  useWindowDimensions, Modal, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Alert
} from 'react-native';
import {
  Search, SlidersHorizontal, PackagePlus, Package, MoreVertical, ChevronRight, XCircle,
  Boxes, CircleCheck, TriangleAlert, CircleX
} from 'lucide-react-native';

const NAVY = '#071B3A';
const GOLD = '#F6B800';
const BG = '#F8FAFC';
const WHITE = '#FFFFFF';
const MUTED = '#64748B';

const STATUS_CHIPS = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

const CATEGORIES = [
  'Vegetables', 'Fruits', 'Dairy Products', 'Grocery', 'Grains and Rice',
  'Flour', 'Pulses', 'Oils', 'Bakery Products', 'Meat', 'Seafood'
];

const MOCK_INVENTORY = [];

export default function RawMaterialInventoryPage() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(MOCK_INVENTORY);
  const [searchActive, setSearchActive] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [tempCategoryFilter, setTempCategoryFilter] = useState('All');
  
  // Modals & Menus
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  
  const [updateStockModalVisible, setUpdateStockModalVisible] = useState(false);
  const [stockUpdateForm, setStockUpdateForm] = useState({ type: 'Add Stock', qty: '', reason: '', expiry: '', note: '' });

  // Add Product Form
  const [productForm, setProductForm] = useState({ name: '', category: '', sku: '', unit: '', price: '', moq: '', openingStock: '', reservedStock: '0', expiry: '', status: 'Active' });

  // Derived state
  const filteredProducts = products.filter(p => {
    if (activeFilter !== 'All' && p.status !== activeFilter) return false;
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const overviewCounts = {
    total: products.length,
    inStock: products.filter(p => p.status === 'In Stock').length,
    lowStock: products.filter(p => p.status === 'Low Stock').length,
    outOfStock: products.filter(p => p.status === 'Out of Stock').length
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'In Stock': return { bg: '#F0FDF4', text: '#16A34A' };
      case 'Low Stock': return { bg: '#FFFBEB', text: '#D97706' };
      case 'Out of Stock': return { bg: '#FEF2F2', text: '#DC2626' };
      default: return { bg: '#F1F5F9', text: '#64748B' }; // Inactive
    }
  };

  const handleAction = (product, action) => {
    setActiveMenuId(null);
    setSelectedProduct(product);
    
    if (action === 'details') {
      setDetailsModalVisible(true);
    } else if (action === 'Update Stock') {
      setStockUpdateForm({ type: 'Add Stock', qty: '', reason: '', expiry: '', note: '' });
      setUpdateStockModalVisible(true);
    } else if (action === 'Delete Product') {
      Alert.alert(
        "Cannot delete this product",
        "This product is connected to existing orders, deliveries or inventory records. Deactivate it instead.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Deactivate Product", onPress: () => {
              setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: 'Inactive' } : p));
          }}
        ]
      );
    } else if (action === 'Mark Out of Stock') {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: 'Out of Stock', availableStock: 0, currentStock: p.reservedStock } : p));
    } else if (action === 'Deactivate Product') {
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: 'Inactive' } : p));
    } else if (action === 'Activate Product') {
      const newStatus = product.availableStock > 0 ? (product.availableStock <= 20 ? 'Low Stock' : 'In Stock') : 'Out of Stock';
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, status: newStatus } : p));
    }
  };

  const submitUpdateStock = () => {
    const qty = parseInt(stockUpdateForm.qty, 10);
    if (isNaN(qty)) return;

    let newCurrent = selectedProduct.currentStock;
    if (stockUpdateForm.type === 'Add Stock') newCurrent += qty;
    if (stockUpdateForm.type === 'Reduce Stock') newCurrent -= qty;
    if (stockUpdateForm.type === 'Set Exact Quantity') newCurrent = qty;

    const newAvailable = newCurrent - selectedProduct.reservedStock;
    if (newAvailable < 0) return; // Validation

    const newStatus = newAvailable === 0 ? 'Out of Stock' : (newAvailable <= 20 ? 'Low Stock' : 'In Stock');

    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, currentStock: newCurrent, availableStock: newAvailable, status: newStatus } : p));
    setUpdateStockModalVisible(false);
  };

  const submitAddProduct = () => {
    if (!productForm.name || !productForm.sku || !productForm.category) return;
    const newStock = parseInt(productForm.openingStock, 10) || 0;
    const resStock = parseInt(productForm.reservedStock, 10) || 0;
    const availStock = newStock - resStock;
    const newStatus = availStock === 0 ? 'Out of Stock' : (availStock <= 20 ? 'Low Stock' : 'In Stock');

    const newProduct = {
      id: `PRD-${Date.now()}`,
      sku: productForm.sku,
      name: productForm.name,
      category: productForm.category,
      currentStock: newStock,
      reservedStock: resStock,
      availableStock: availStock,
      unit: productForm.unit || 'kg',
      wholesalePrice: productForm.price || 0,
      moq: productForm.moq || 1,
      expiry: productForm.expiry || null,
      status: newStatus,
      history: [], created: "Today", updated: "Today"
    };

    setProducts(prev => [newProduct, ...prev]);
    setAddProductModalVisible(false);
    setProductForm({ name: '', category: '', sku: '', unit: '', price: '', moq: '', openingStock: '', reservedStock: '0', expiry: '', status: 'Active' });
  };

  const getMenuOptions = (status) => {
    if (status === 'Inactive') return ['Edit Product', 'Activate Product', 'Delete Product'];
    return ['Edit Product', 'Update Pricing', 'Mark Out of Stock', 'Deactivate Product', 'Delete Product'];
  };

  const renderProductCard = ({ item }) => {
    const sStyle = getStatusStyle(item.status);
    const isMenuOpen = activeMenuId === item.id;
    const menuOptions = getMenuOptions(item.status);

    return (
      <View style={[styles.card, isMenuOpen && { zIndex: 999, elevation: 10 }]}>
        {/* Top Row */}
        <View style={[styles.cardTop, isMenuOpen && { zIndex: 999 }]}>
          <View style={styles.cardHeaderLeft}>
            <View style={styles.productIconBox}>
              <Package size={20} color="#3B82F6" />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.productSku}>SKU: {item.sku}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[styles.statusBadge, { backgroundColor: sStyle.bg }]}>
              <Text style={[styles.statusText, { color: sStyle.text }]}>{item.status}</Text>
            </View>
            <View style={{position: 'relative', marginLeft: 4}}>
              <TouchableOpacity style={styles.moreBtn} onPress={() => setActiveMenuId(isMenuOpen ? null : item.id)}>
                <MoreVertical size={20} color={MUTED} />
              </TouchableOpacity>
              {isMenuOpen && (
                <View style={styles.dropdownMenu}>
                  {menuOptions.map((opt, i) => (
                    <React.Fragment key={i}>
                      {opt === 'Delete Product' && <View style={styles.dropdownDivider} />}
                      <TouchableOpacity style={styles.dropdownItem} onPress={() => handleAction(item, opt)}>
                        <Text style={[styles.dropdownText, opt === 'Delete Product' && {color: '#EF4444'}]}>{opt}</Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Category */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>

        {/* Stock Summary Strip */}
        <View style={styles.stockStrip}>
          <View style={styles.stockStripCol}>
            <Text style={styles.stockStripLabel}>Available</Text>
            <Text style={styles.stockStripValue}>{item.availableStock} {item.unit}</Text>
          </View>
          <View style={styles.stockStripDivider} />
          <View style={styles.stockStripCol}>
            <Text style={styles.stockStripLabel}>Reserved</Text>
            <Text style={styles.stockStripValue}>{item.reservedStock} {item.unit}</Text>
          </View>
          <View style={styles.stockStripDivider} />
          <View style={styles.stockStripCol}>
            <Text style={styles.stockStripLabel}>Total</Text>
            <Text style={styles.stockStripValue}>{item.currentStock} {item.unit}</Text>
          </View>
        </View>

        {/* Commercial Details */}
        <View style={styles.commercialRow}>
          <View style={styles.commercialCol}>
            <Text style={styles.commercialLabel}>Wholesale</Text>
            <Text style={styles.commercialValue}>₹{item.wholesalePrice}/{item.unit}</Text>
          </View>
          <View style={styles.commercialCol}>
            <Text style={styles.commercialLabel}>MOQ</Text>
            <Text style={styles.commercialValue}>{item.moq} {item.unit}</Text>
          </View>
          {item.expiry && (
            <View style={styles.commercialCol}>
              <Text style={styles.commercialLabel}>Expiry</Text>
              <Text style={styles.commercialValue}>{item.expiry}</Text>
            </View>
          )}
        </View>

        {/* Footer Actions */}
        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.textActionBtn} onPress={() => handleAction(item, 'details')}>
            <Text style={styles.textActionText}>View Details</Text>
            <ChevronRight size={16} color={NAVY} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryActionBtn} onPress={() => handleAction(item, 'Update Stock')}>
            <Text style={styles.primaryActionText}>Update Stock</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={() => setActiveMenuId(null)}>
        <View style={styles.container}>
          
          <View style={styles.pageHeader}>
            <View style={styles.pageHeaderLeft}>
              <Text style={styles.pageTitle}>Inventory</Text>
              <Text style={styles.pageSubtitle}>Manage products, stock levels and pricing</Text>
            </View>
            <View style={styles.pageHeaderActions}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setSearchActive(!searchActive)}><Search size={22} color={NAVY} /></TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => setFilterVisible(true)}><SlidersHorizontal size={22} color={NAVY} /></TouchableOpacity>
              {!isMobile && (
                <TouchableOpacity style={styles.btnAddProductDesktop} onPress={() => setAddProductModalVisible(true)}>
                  <PackagePlus size={18} color={WHITE} style={{marginRight: 6}} />
                  <Text style={styles.btnAddProductText}>Add Product</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {isMobile && (
            <View style={styles.mobileAddBtnContainer}>
              <TouchableOpacity style={styles.btnAddProductDesktop} onPress={() => setAddProductModalVisible(true)}>
                <PackagePlus size={18} color={WHITE} style={{marginRight: 6}} />
                <Text style={styles.btnAddProductText}>Add Product</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Overview Card */}
          <View style={styles.overviewContainer}>
            <View style={styles.overviewCard}>
              <TouchableOpacity style={styles.overviewCol} onPress={() => setActiveFilter('All')}>
                <View style={[styles.overviewIconBox, {backgroundColor: '#EFF6FF'}]}>
                  <Boxes size={18} color="#3B82F6" />
                </View>
                <Text style={styles.overviewCount}>{overviewCounts.total}</Text>
                <Text style={styles.overviewLabel}>Total</Text>
              </TouchableOpacity>
              <View style={styles.overviewDivider} />
              
              <TouchableOpacity style={styles.overviewCol} onPress={() => setActiveFilter('In Stock')}>
                <View style={[styles.overviewIconBox, {backgroundColor: '#F0FDF4'}]}>
                  <CircleCheck size={18} color="#16A34A" />
                </View>
                <Text style={styles.overviewCount}>{overviewCounts.inStock}</Text>
                <Text style={styles.overviewLabel}>In Stock</Text>
              </TouchableOpacity>
              <View style={styles.overviewDivider} />
              
              <TouchableOpacity style={styles.overviewCol} onPress={() => setActiveFilter('Low Stock')}>
                <View style={[styles.overviewIconBox, {backgroundColor: '#FFFBEB'}]}>
                  <TriangleAlert size={18} color="#D97706" />
                </View>
                <Text style={styles.overviewCount}>{overviewCounts.lowStock}</Text>
                <Text style={styles.overviewLabel}>Low Stock</Text>
              </TouchableOpacity>
              <View style={styles.overviewDivider} />
              
              <TouchableOpacity style={styles.overviewCol} onPress={() => setActiveFilter('Out of Stock')}>
                <View style={[styles.overviewIconBox, {backgroundColor: '#FEF2F2'}]}>
                  <CircleX size={18} color="#DC2626" />
                </View>
                <Text style={styles.overviewCount}>{overviewCounts.outOfStock}</Text>
                <Text style={styles.overviewLabel}>Out of Stock</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search and Filters */}
          <View style={styles.searchFilterContainer}>
            {searchActive && (
              <View style={styles.searchBox}>
                <Search size={18} color={MUTED} style={{marginRight: 8}} />
                <TextInput 
                  style={styles.searchInput} 
                  placeholder="Search products by name, SKU or category..." 
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery !== '' && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}><XCircle size={16} color={MUTED} /></TouchableOpacity>
                )}
              </View>
            )}
            <View style={styles.tabsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                {STATUS_CHIPS.map(chip => (
                  <TouchableOpacity
                    key={chip}
                    style={[styles.tab, activeFilter === chip && styles.activeTab]}
                    onPress={() => setActiveFilter(chip)}
                  >
                    <Text style={[styles.tabText, activeFilter === chip && styles.activeTabText]}>{chip}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <FlatList
            data={filteredProducts}
            keyExtractor={item => item.id}
            renderItem={renderProductCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Package size={32} color="#CBD5E1" />
                <Text style={styles.emptyTextTitle}>No {activeFilter === 'All' ? '' : activeFilter.toLowerCase()} products {activeFilter === 'All' ? 'found' : ''}</Text>
                <Text style={styles.emptyTextSub}>
                  {activeFilter === 'All' ? 'Add products to start managing your inventory.' : `All products are currently ${activeFilter === 'Low Stock' ? 'sufficiently stocked' : 'available'}.`}
                </Text>
              </View>
            }
          />
        </View>
      </TouchableWithoutFeedback>

      {/* Update Stock Modal */}
      <Modal visible={updateStockModalVisible} animationType="fade" transparent={true} onRequestClose={() => setUpdateStockModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={() => setUpdateStockModalVisible(false)}>
            <View style={styles.modalOverlayCenter}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[styles.centerModalContent, isMobile ? {width: '90%'} : {maxWidth: 480, width: '100%'}]}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Update Stock</Text>
                    <TouchableOpacity onPress={() => setUpdateStockModalVisible(false)}><XCircle size={24} color={MUTED} /></TouchableOpacity>
                  </View>
                  <ScrollView style={styles.modalBody}>
                    {selectedProduct && (
                      <View style={styles.contextBox}>
                        <Text style={styles.contextTitle}>{selectedProduct.name}</Text>
                        <Text style={styles.contextSub}>SKU: {selectedProduct.sku}</Text>
                        
                        <View style={[styles.stockStrip, {marginTop: 12}]}>
                          <View style={styles.stockStripCol}>
                            <Text style={styles.stockStripLabel}>Available</Text>
                            <Text style={styles.stockStripValue}>{selectedProduct.availableStock} {selectedProduct.unit}</Text>
                          </View>
                          <View style={styles.stockStripCol}>
                            <Text style={styles.stockStripLabel}>Reserved</Text>
                            <Text style={styles.stockStripValue}>{selectedProduct.reservedStock} {selectedProduct.unit}</Text>
                          </View>
                          <View style={styles.stockStripCol}>
                            <Text style={styles.stockStripLabel}>Total</Text>
                            <Text style={styles.stockStripValue}>{selectedProduct.currentStock} {selectedProduct.unit}</Text>
                          </View>
                        </View>
                      </View>
                    )}

                    <Text style={styles.inputLabel}>Update Type</Text>
                    <View style={styles.segmentedControl}>
                      {['Add Stock', 'Reduce Stock', 'Set Exact Quantity'].map((type) => (
                        <TouchableOpacity 
                          key={type} 
                          style={[styles.segmentBtn, stockUpdateForm.type === type && styles.segmentBtnActive]}
                          onPress={() => setStockUpdateForm({...stockUpdateForm, type})}
                        >
                          <Text style={[styles.segmentBtnText, stockUpdateForm.type === type && styles.segmentBtnTextActive]}>{type}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text style={styles.inputLabel}>Quantity</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={stockUpdateForm.qty} onChangeText={t => setStockUpdateForm({...stockUpdateForm, qty: t})} />
                    
                    <Text style={styles.inputLabel}>Reason (Optional)</Text>
                    <TextInput style={styles.input} value={stockUpdateForm.reason} onChangeText={t => setStockUpdateForm({...stockUpdateForm, reason: t})} />
                  </ScrollView>
                  <View style={styles.modalFooterActions}>
                    <TouchableOpacity style={styles.btnModalOutline} onPress={() => setUpdateStockModalVisible(false)}>
                      <Text style={styles.btnModalOutlineText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnModalPrimary} onPress={submitUpdateStock}>
                      <Text style={styles.btnModalPrimaryText}>Update Stock</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add Product Modal */}
      <Modal visible={addProductModalVisible} animationType="fade" transparent={true} onRequestClose={() => setAddProductModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
          <TouchableWithoutFeedback onPress={() => setAddProductModalVisible(false)}>
            <View style={styles.modalOverlayCenter}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={[styles.centerModalContent, isMobile ? {width: '95%'} : {maxWidth: 560, width: '100%'}, {maxHeight: '85%'}]}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Add Product</Text>
                    <TouchableOpacity onPress={() => setAddProductModalVisible(false)}><XCircle size={24} color={MUTED} /></TouchableOpacity>
                  </View>
                  <ScrollView style={styles.modalBody}>
                    <Text style={styles.inputLabel}>Product Name</Text>
                    <TextInput style={styles.input} value={productForm.name} onChangeText={t => setProductForm({...productForm, name: t})} />
                    
                    <View style={{flexDirection: 'row', gap: 12}}>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>SKU</Text>
                        <TextInput style={styles.input} value={productForm.sku} onChangeText={t => setProductForm({...productForm, sku: t})} />
                      </View>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>Unit (e.g. kg, L)</Text>
                        <TextInput style={styles.input} value={productForm.unit} onChangeText={t => setProductForm({...productForm, unit: t})} />
                      </View>
                    </View>

                    <Text style={styles.inputLabel}>Category</Text>
                    <View style={styles.categoryGrid}>
                      {CATEGORIES.map(cat => (
                        <TouchableOpacity key={cat} style={[styles.catPill, productForm.category === cat && styles.catPillActive]} onPress={() => setProductForm({...productForm, category: cat})}>
                          <Text style={[styles.catPillText, productForm.category === cat && styles.catPillTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={{flexDirection: 'row', gap: 12}}>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>Wholesale Price</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={productForm.price} onChangeText={t => setProductForm({...productForm, price: t})} />
                      </View>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>MOQ</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={productForm.moq} onChangeText={t => setProductForm({...productForm, moq: t})} />
                      </View>
                    </View>

                    <View style={{flexDirection: 'row', gap: 12}}>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>Opening Stock</Text>
                        <TextInput style={styles.input} keyboardType="numeric" value={productForm.openingStock} onChangeText={t => setProductForm({...productForm, openingStock: t})} />
                      </View>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>Expiry Date</Text>
                        <TextInput style={styles.input} placeholder="Optional" value={productForm.expiry} onChangeText={t => setProductForm({...productForm, expiry: t})} />
                      </View>
                    </View>
                    <View style={{height: 20}} />
                  </ScrollView>
                  <View style={styles.modalFooterActions}>
                    <TouchableOpacity style={styles.btnModalOutline} onPress={() => setAddProductModalVisible(false)}>
                      <Text style={styles.btnModalOutlineText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnModalPrimary} onPress={submitAddProduct}>
                      <Text style={styles.btnModalPrimaryText}>Save Product</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Details Modal */}
      <Modal visible={detailsModalVisible} animationType="fade" transparent={true} onRequestClose={() => setDetailsModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setDetailsModalVisible(false)}>
          <View style={styles.modalOverlayCenter}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.centerModalContent, isMobile ? {width: '95%'} : {maxWidth: 560, width: '100%'}, {maxHeight: '85%'}]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Product Details</Text>
                  <TouchableOpacity onPress={() => setDetailsModalVisible(false)}><XCircle size={24} color={MUTED} /></TouchableOpacity>
                </View>
                {selectedProduct && (
                  <ScrollView style={styles.modalBody}>
                    <View style={{flexDirection: 'row', marginBottom: 16}}>
                      <View style={styles.productIconBoxLarge}>
                        <Package size={28} color="#3B82F6" />
                      </View>
                      <View style={{flex: 1}}>
                        <Text style={styles.productNameLarge}>{selectedProduct.name}</Text>
                        <Text style={styles.productSkuLarge}>SKU: {selectedProduct.sku}</Text>
                        <View style={{flexDirection: 'row', marginTop: 4}}>
                          <View style={styles.categoryBadge}><Text style={styles.categoryText}>{selectedProduct.category}</Text></View>
                          <View style={[styles.statusBadge, { backgroundColor: getStatusStyle(selectedProduct.status).bg }]}><Text style={[styles.statusText, { color: getStatusStyle(selectedProduct.status).text }]}>{selectedProduct.status}</Text></View>
                        </View>
                      </View>
                    </View>

                    {selectedProduct.status === 'Low Stock' && (
                      <View style={styles.lowStockWarning}>
                        <TriangleAlert size={16} color="#D97706" style={{marginRight: 8}} />
                        <Text style={styles.lowStockWarningText}>Low stock threshold reached</Text>
                      </View>
                    )}
                    
                    <View style={styles.detailBlock}>
                      <Text style={styles.detailLabel}>STOCK DETAILS</Text>
                      <View style={styles.stockStrip}>
                        <View style={styles.stockStripCol}><Text style={styles.stockStripLabel}>Available</Text><Text style={styles.stockStripValue}>{selectedProduct.availableStock} {selectedProduct.unit}</Text></View>
                        <View style={styles.stockStripDivider} />
                        <View style={styles.stockStripCol}><Text style={styles.stockStripLabel}>Reserved</Text><Text style={styles.stockStripValue}>{selectedProduct.reservedStock} {selectedProduct.unit}</Text></View>
                        <View style={styles.stockStripDivider} />
                        <View style={styles.stockStripCol}><Text style={styles.stockStripLabel}>Total</Text><Text style={styles.stockStripValue}>{selectedProduct.currentStock} {selectedProduct.unit}</Text></View>
                      </View>
                    </View>

                    <View style={styles.detailBlock}>
                      <Text style={styles.detailLabel}>COMMERCIAL DETAILS</Text>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                        <Text style={styles.detailSubValue}>Wholesale Price</Text>
                        <Text style={styles.detailValue}>₹{selectedProduct.wholesalePrice}/{selectedProduct.unit}</Text>
                      </View>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                        <Text style={styles.detailSubValue}>Minimum Order Qty (MOQ)</Text>
                        <Text style={styles.detailValue}>{selectedProduct.moq} {selectedProduct.unit}</Text>
                      </View>
                      {selectedProduct.expiry && (
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          <Text style={styles.detailSubValue}>Expiry Date</Text>
                          <Text style={styles.detailValue}>{selectedProduct.expiry}</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.detailBlock}>
                      <Text style={styles.detailLabel}>SYSTEM DETAILS</Text>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                        <Text style={styles.detailSubValue}>Created Date</Text>
                        <Text style={styles.detailValue}>{selectedProduct.created}</Text>
                      </View>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.detailSubValue}>Last Updated</Text>
                        <Text style={styles.detailValue}>{selectedProduct.updated}</Text>
                      </View>
                    </View>
                    <View style={{height: 20}} />
                  </ScrollView>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Filter Bottom Sheet */}
      <Modal visible={filterVisible} animationType="slide" transparent>
        <View style={styles.modalOverlayBottom}>
          <View style={[styles.bottomSheet, {height: 'auto', paddingBottom: 40}]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)}><XCircle size={24} color={MUTED} /></TouchableOpacity>
            </View>
            <View style={styles.sheetBody}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20}}>
                {['All', ...CATEGORIES].map(cat => (
                  <TouchableOpacity 
                    key={cat} 
                    style={[styles.filterChip, tempCategoryFilter === cat && styles.filterChipActive]} 
                    onPress={() => setTempCategoryFilter(cat)}
                  >
                    <Text style={[styles.filterChipText, tempCategoryFilter === cat && styles.filterChipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalFooterActions}>
                <TouchableOpacity style={styles.btnModalOutline} onPress={() => { setTempCategoryFilter('All'); setCategoryFilter('All'); setFilterVisible(false); }}><Text style={styles.btnModalOutlineText}>Clear Filters</Text></TouchableOpacity>
                <TouchableOpacity style={styles.btnModalPrimary} onPress={() => { setCategoryFilter(tempCategoryFilter); setFilterVisible(false); }}><Text style={styles.btnModalPrimaryText}>Apply Filters</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BG },
  container: { flex: 1, backgroundColor: BG, maxWidth: 1200, width: '100%', alignSelf: 'center' },
  
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
  pageHeaderLeft: { flex: 1 },
  pageTitle: { fontSize: 24, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: MUTED },
  pageHeaderActions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 8, marginLeft: 8 },
  btnAddProductDesktop: { flexDirection: 'row', alignItems: 'center', backgroundColor: NAVY, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, marginLeft: 12 },
  btnAddProductText: { fontSize: 14, fontWeight: 'bold', color: WHITE },

  mobileAddBtnContainer: { paddingHorizontal: 16, paddingBottom: 16, alignItems: 'flex-start' },

  overviewContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  overviewCard: { flexDirection: 'row', backgroundColor: WHITE, borderRadius: 16, paddingVertical: 16, borderWidth: 1, borderColor: '#E6EBF2', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  overviewCol: { flex: 1, alignItems: 'center' },
  overviewDivider: { width: 1, backgroundColor: '#F1F5F9' },
  overviewIconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  overviewCount: { fontSize: 20, fontWeight: 'bold', color: NAVY, marginBottom: 2 },
  overviewLabel: { fontSize: 12, color: MUTED, fontWeight: '500', textAlign: 'center' },

  searchFilterContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, height: 44, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14, color: NAVY },
  tabsContainer: {},
  tabsScroll: { gap: 10 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: WHITE, borderWidth: 1, borderColor: '#E2E8F0' },
  activeTab: { backgroundColor: NAVY, borderColor: NAVY },
  tabText: { fontSize: 14, fontWeight: '600', color: MUTED },
  activeTabText: { color: WHITE },

  listContent: { paddingHorizontal: 16, paddingBottom: 115 },
  
  card: { backgroundColor: WHITE, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1, borderWidth: 1, borderColor: '#E6EBF2' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, zIndex: 10 },
  cardHeaderLeft: { flexDirection: 'row', flex: 1, paddingRight: 10 },
  productIconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  productName: { fontSize: 15, fontWeight: 'bold', color: NAVY },
  productSku: { fontSize: 12, color: MUTED, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  moreBtn: { padding: 4, marginRight: -4 },
  
  dropdownMenu: { position: 'absolute', top: 30, right: 0, backgroundColor: WHITE, borderRadius: 12, width: 170, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, zIndex: 100, borderWidth: 1, borderColor: '#E8EDF4', paddingVertical: 4 },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 16 },
  dropdownText: { fontSize: 13, fontWeight: '600', color: NAVY },
  dropdownDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 4 },
  
  categoryBadge: { alignSelf: 'flex-start', backgroundColor: '#F8FAFC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 12 },
  categoryText: { fontSize: 11, color: MUTED, fontWeight: '600' },
  
  stockStrip: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 10, marginBottom: 16 },
  stockStripCol: { flex: 1, alignItems: 'center' },
  stockStripDivider: { width: 1, backgroundColor: '#E2E8F0' },
  stockStripLabel: { fontSize: 11, color: MUTED, marginBottom: 2 },
  stockStripValue: { fontSize: 14, fontWeight: 'bold', color: NAVY },
  
  commercialRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  commercialCol: { flex: 1, minWidth: '30%' },
  commercialLabel: { fontSize: 11, color: MUTED, marginBottom: 2 },
  commercialValue: { fontSize: 13, fontWeight: '600', color: NAVY },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 14 },
  textActionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingRight: 16 },
  textActionText: { fontSize: 14, fontWeight: 'bold', color: NAVY, marginRight: 4 },
  primaryActionBtn: { borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 14, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  primaryActionText: { fontSize: 14, fontWeight: '600', color: NAVY },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTextTitle: { fontSize: 15, fontWeight: 'bold', color: NAVY, marginTop: 12, marginBottom: 4 },
  emptyTextSub: { fontSize: 13, color: MUTED, textAlign: 'center' },

  // Modals
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(3, 15, 38, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  centerModalContent: { backgroundColor: WHITE, borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: NAVY },
  modalBody: { padding: 20 },
  
  contextBox: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, marginBottom: 16 },
  contextTitle: { fontSize: 15, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  contextSub: { fontSize: 13, color: MUTED },
  
  inputLabel: { fontSize: 13, fontWeight: '600', color: NAVY, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: NAVY },
  
  segmentedControl: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 10, padding: 4 },
  segmentBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  segmentBtnActive: { backgroundColor: WHITE, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  segmentBtnText: { fontSize: 13, fontWeight: '500', color: MUTED },
  segmentBtnTextActive: { color: NAVY, fontWeight: 'bold' },
  
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  catPillActive: { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' },
  catPillText: { fontSize: 13, color: MUTED },
  catPillTextActive: { color: '#1E40AF', fontWeight: '600' },

  modalFooterActions: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 12 },
  btnModalOutline: { flex: 1, height: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  btnModalOutlineText: { fontSize: 14, fontWeight: '600', color: NAVY },
  btnModalPrimary: { flex: 1, height: 44, backgroundColor: NAVY, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  btnModalPrimaryText: { fontSize: 14, fontWeight: 'bold', color: WHITE },
  
  detailBlock: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailLabel: { fontSize: 11, fontWeight: 'bold', color: MUTED, marginBottom: 12, textTransform: 'uppercase' },
  detailValue: { fontSize: 15, fontWeight: 'bold', color: NAVY, marginBottom: 4 },
  detailSubValue: { fontSize: 14, color: MUTED },
  
  productIconBoxLarge: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  productNameLarge: { fontSize: 18, fontWeight: 'bold', color: NAVY },
  productSkuLarge: { fontSize: 13, color: MUTED, marginTop: 2 },
  
  lowStockWarning: { flexDirection: 'row', backgroundColor: '#FFFBEB', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#FEF3C7', marginBottom: 16, alignItems: 'center' },
  lowStockWarningText: { fontSize: 13, fontWeight: 'bold', color: '#B45309' },
  modalOverlayBottom: { flex: 1, backgroundColor: 'rgba(3, 15, 38, 0.55)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: WHITE, borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden' },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  sheetTitle: { fontSize: 16, fontWeight: '800', color: NAVY },
  sheetBody: { padding: 20 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8, marginBottom: 8 },
  filterChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  filterChipTextActive: { color: WHITE },
});
