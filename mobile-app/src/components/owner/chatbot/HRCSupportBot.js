import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, 
  TextInput, Image, Platform, KeyboardAvoidingView, Animated, 
  useWindowDimensions 
} from 'react-native';
import { 
  Send, X, Volume2, VolumeX, MoreVertical, 
  Truck, Users, Package, Megaphone, WifiOff, Trash2,
  Paperclip, FileText, ImageIcon 
} from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

const NAVY = '#071B3A';
const SECONDARY_NAVY = '#102A4C';
const GOLD = '#F2C230';
const BG_COLOR = '#F6F8FC';
const CARD_BG = '#FFFFFF';
const BORDER_COLOR = '#E2E8F0';
const TEXT_PRIMARY = '#091B3A';
const TEXT_MUTED = '#71829B';

const SUGGESTIONS = [
  { text: 'Track my order', icon: '📦' },
  { text: 'How to hire staff?', icon: '👨‍🍳' },
  { text: 'Hire marketing agency', icon: '📢' },
  { text: 'Find plumbers/cleaners', icon: '🔧' }
];

const getBotResponse = (text) => {
  const q = text.toLowerCase().trim();
  if (q.includes('order') || q.includes('track') || q.includes('status') || q.includes('delivery')) {
    return {
      type: 'card',
      cardType: 'order',
      cardData: {
        orderId: 'ORD-941',
        product: 'Premium Basmati Rice',
        status: 'Out for Delivery',
        expected: 'Today • 04:30 PM'
      }
    };
  }
  if (q.includes('staff') || q.includes('hire') || q.includes('manpower') || q.includes('chef') || q.includes('waiter') || q.includes('cook')) {
    return {
      type: 'card',
      cardType: 'manpower',
      cardData: {
        title: 'Head Chef Requirement',
        status: 'Active',
        detail: '4 Agency Responses received'
      }
    };
  }
  if (q.includes('marketing') || q.includes('agency') || q.includes('campaign') || q.includes('promote') || q.includes('ad')) {
    return {
      type: 'card',
      cardType: 'marketing',
      cardData: {
        title: 'Summer Campaign',
        status: 'Pending Review',
        detail: '3 New Agency Proposals'
      }
    };
  }
  if (q.includes('service') || q.includes('repair') || q.includes('clean') || q.includes('plumber') || q.includes('electrician') || q.includes('pest')) {
    return {
      type: 'card',
      cardType: 'service',
      cardData: {
        title: 'AC Deep Cleaning Booking',
        status: 'Scheduled',
        detail: 'Scheduled: Tomorrow • 10:30 AM'
      }
    };
  }
  if (q.includes('limit') || q.includes('account') || q.includes('limit check')) {
    return {
      type: 'text',
      text: "You can check your account status, active business limits, and verification files by clicking your Profile picture at the top right and selecting 'Profile View'."
    };
  }
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('sup')) {
    return {
      type: 'text',
      text: "Hello! I am your HRC Business AI assistant. How can I help you manage your business operations, raw material orders, staffing, or marketing campaigns today?"
    };
  }
  return {
    type: 'text',
    text: "I'm your HRC Business Assistant, specialized in helping you manage your HoReCa operations. You can ask me about raw material orders, hiring manpower, booking service professionals, or launching marketing campaigns!"
  };
};

export default function HRCSupportBot({ visible, onClose, user, onNavigate }) {
  const { width } = useWindowDimensions();
  const isLarge = width >= 768;

  // Dynamically resolve user business type and name
  const userName = user?.name || user?.registration?.name || 'Chetan';
  const userRole = user?.role || user?.registration?.role || 'owner';
  const businessType = user?.businessType || user?.registration?.businessType || '';
  
  let businessTypeLabel = 'business';
  if (businessType.toLowerCase().includes('restaurant')) {
    businessTypeLabel = 'Restaurant';
  } else if (businessType.toLowerCase().includes('hotel')) {
    businessTypeLabel = 'Hotel';
  } else if (businessType.toLowerCase().includes('cafe')) {
    businessTypeLabel = 'Cafe';
  } else if (businessType.toLowerCase().includes('vendor')) {
    businessTypeLabel = 'Vendor';
  } else if (userRole.toLowerCase().includes('vendor')) {
    businessTypeLabel = 'vendor';
  }

  const welcomeMessage = {
    id: 'welcome',
    sender: 'bot',
    type: 'text',
    text: `Hello ${userName}! 👋\n\nI’m your HRC Business Assistant.\n\nHow can I help you manage your ${businessTypeLabel} operations today?`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const [messages, setMessages] = useState([welcomeMessage]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(Platform.OS === 'web' ? !navigator.onLine : false);
  const [attachment, setAttachment] = useState(null);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);

  const scrollViewRef = useRef();

  const handlePickDocument = async () => {
    setAttachMenuOpen(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setAttachment({ name: file.name, type: 'pdf', uri: file.uri, size: file.size });
      }
    } catch (e) {
      console.log('Document pick cancelled');
    }
  };

  const handlePickImage = async () => {
    setAttachMenuOpen(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const img = result.assets[0];
        const fileName = img.fileName || img.uri.split('/').pop() || 'image.jpg';
        setAttachment({ name: fileName, type: 'image', uri: img.uri, size: img.fileSize });
      }
    } catch (e) {
      console.log('Image pick cancelled');
    }
  };

  // Typing anim dots
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  // Pulse effect for the green "Online" dot
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true })
      ])
    ).start();
  }, []);

  // Web offline/online event listeners
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Sequential typing dots anim
  useEffect(() => {
    if (isTyping) {
      const animateDot = (dot, delay) => {
        return Animated.sequence([
          Animated.delay(delay),
          Animated.loop(
            Animated.sequence([
              Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
              Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
              Animated.delay(400)
            ])
          )
        ]);
      };

      const animation = Animated.parallel([
        animateDot(dot1, 0),
        animateDot(dot2, 150),
        animateDot(dot3, 300)
      ]);

      animation.start();
      return () => {
        animation.stop();
        dot1.setValue(0);
        dot2.setValue(0);
        dot3.setValue(0);
      };
    }
  }, [isTyping]);

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const messageText = typeof textToSend === 'string' ? textToSend : inputText;
    if (!messageText.trim()) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      type: 'text',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (typeof textToSend !== 'string') setInputText('');
    
    // Simulate bot reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response = getBotResponse(messageText);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        type: response.type,
        text: response.text,
        cardType: response.cardType,
        cardData: response.cardData,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  const handleClearChat = () => {
    setMessages([welcomeMessage]);
    setConfirmClearOpen(false);
    setMoreMenuOpen(false);
  };

  // Check if user has interacted
  const userMessagesCount = messages.filter(m => m.sender === 'user').length;

  const renderCardMessage = (msg) => {
    const { cardType, cardData } = msg;

    if (cardType === 'order') {
      return (
        <View style={styles.actionCard}>
          <View style={styles.actionCardHeader}>
            <Text style={styles.actionCardTitle}>Order {cardData.orderId}</Text>
            <View style={[styles.statusBadge, { backgroundColor: '#EFF6FF' }]}>
              <Text style={[styles.statusBadgeText, { color: '#3B82F6' }]}>{cardData.status}</Text>
            </View>
          </View>
          <Text style={styles.actionCardDetail}>{cardData.product}</Text>
          <Text style={styles.actionCardSub}>Expected: {cardData.expected}</Text>
          <TouchableOpacity 
            style={[styles.cardBtn, { backgroundColor: '#3B82F6' }]} 
            onPress={() => onNavigate && onNavigate('order-tracking')}
            accessibilityRole="button"
          >
            <Text style={styles.cardBtnText}>Track Order</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (cardType === 'manpower') {
      return (
        <View style={styles.actionCard}>
          <View style={styles.actionCardHeader}>
            <Text style={styles.actionCardTitle}>{cardData.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: '#EBFDF5' }]}>
              <Text style={[styles.statusBadgeText, { color: '#16B77A' }]}>{cardData.status}</Text>
            </View>
          </View>
          <Text style={styles.actionCardDetail}>{cardData.detail}</Text>
          <TouchableOpacity 
            style={[styles.cardBtn, { backgroundColor: '#16B77A' }]} 
            onPress={() => onNavigate && onNavigate('manpower')}
            accessibilityRole="button"
          >
            <Text style={styles.cardBtnText}>View Responses</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (cardType === 'service') {
      return (
        <View style={styles.actionCard}>
          <View style={styles.actionCardHeader}>
            <Text style={styles.actionCardTitle}>{cardData.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: '#F5F3FF' }]}>
              <Text style={[styles.statusBadgeText, { color: '#8B5CF6' }]}>{cardData.status}</Text>
            </View>
          </View>
          <Text style={styles.actionCardDetail}>{cardData.detail}</Text>
          <TouchableOpacity 
            style={[styles.cardBtn, { backgroundColor: '#8B5CF6' }]} 
            onPress={() => onNavigate && onNavigate('service')}
            accessibilityRole="button"
          >
            <Text style={styles.cardBtnText}>View Booking</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (cardType === 'marketing') {
      return (
        <View style={styles.actionCard}>
          <View style={styles.actionCardHeader}>
            <Text style={styles.actionCardTitle}>{cardData.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: '#FFFBEB' }]}>
              <Text style={[styles.statusBadgeText, { color: '#F59E0B' }]}>{cardData.status}</Text>
            </View>
          </View>
          <Text style={styles.actionCardDetail}>{cardData.detail}</Text>
          <TouchableOpacity 
            style={[styles.cardBtn, { backgroundColor: '#F59E0B' }]} 
            onPress={() => onNavigate && onNavigate('marketing')}
            accessibilityRole="button"
          >
            <Text style={styles.cardBtnText}>View Proposals</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={[styles.chatCard, isLarge ? styles.chatCardLarge : styles.chatCardMobile]}>
          {/* Header */}
          <View style={styles.chatHeader}>
            <View style={styles.headerProfile}>
              <View style={styles.avatarWrapper}>
                <Image 
                  source={require('../../../../assets/Chatbot.png')} 
                  style={styles.avatarImage} 
                />
              </View>
              <View>
                <Text style={styles.headerTitle}>HRC Business <Text style={styles.goldText}>AI</Text></Text>
                <View style={styles.statusRow}>
                  <Animated.View style={[styles.statusDot, { opacity: pulseAnim }]} />
                  <Text style={styles.statusText}>Online</Text>
                </View>
              </View>
            </View>
            
            {/* Header Actions */}
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => setIsMuted(!isMuted)}
                accessibilityRole="button"
                accessibilityLabel={isMuted ? "Unmute assistant" : "Mute assistant"}
              >
                {isMuted ? <VolumeX size={20} color="#FFFFFF" /> : <Volume2 size={20} color="#FFFFFF" />}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => setMoreMenuOpen(!moreMenuOpen)}
                accessibilityRole="button"
                accessibilityLabel="More options"
              >
                <MoreVertical size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close HRC Business AI"
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* More actions dropdown menu */}
          {moreMenuOpen && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity 
                style={styles.dropdownItem}
                onPress={() => setConfirmClearOpen(true)}
              >
                <Trash2 size={16} color="#EF4444" />
                <Text style={[styles.dropdownItemText, { color: '#EF4444' }]}>Clear Chat</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Offline Banner */}
          {isOffline && (
            <View style={styles.offlineBanner}>
              <WifiOff size={16} color="#D97706" />
              <Text style={styles.offlineText}>You're offline. Messages will send when connection is restored.</Text>
            </View>
          )}

          {/* Messages Scroll Area */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Today Date Pill */}
            <View style={styles.dateSeparator}>
              <Text style={styles.dateText}>Today</Text>
            </View>

            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              const isFirstInBotGroup = !isUser && (idx === 0 || messages[idx - 1].sender !== 'bot');

              return (
                <View 
                  key={msg.id} 
                  style={[
                    styles.messageRow, 
                    isUser ? styles.userRow : styles.botRow
                  ]}
                >
                  {/* Bot Avatar beside the first message in bot group */}
                  {!isUser && (
                    <View style={styles.botAvatarContainer}>
                      {isFirstInBotGroup ? (
                        <Image 
                          source={require('../../../../assets/Chatbot.png')} 
                          style={styles.smallBotAvatar} 
                        />
                      ) : (
                        <View style={styles.smallBotAvatarSpacer} />
                      )}
                    </View>
                  )}

                  <View style={isUser ? styles.userBubbleContainer : styles.botBubbleContainer}>
                    <View 
                      style={[
                        styles.bubble, 
                        isUser ? styles.userBubble : styles.botBubble,
                        !isUser && isFirstInBotGroup && styles.botBubbleFirst
                      ]}
                    >
                      {msg.type === 'card' ? (
                        renderCardMessage(msg)
                      ) : (
                        <Text style={isUser ? styles.userBubbleText : styles.botBubbleText}>
                          {msg.text}
                        </Text>
                      )}
                    </View>
                    
                    {/* Timestamp */}
                    <Text style={[styles.messageTime, isUser && { textAlign: 'right' }]}>
                      {msg.time} {isUser && '✓✓'}
                    </Text>
                  </View>
                </View>
              );
            })}

            {/* Welcome Grid 2x2 State */}
            {userMessagesCount === 0 && (
              <View style={styles.gridContainer}>
                <View style={styles.gridRow}>
                  <TouchableOpacity 
                    style={styles.gridCard} 
                    onPress={() => handleSend('Track my latest order')}
                  >
                    <View style={[styles.gridIconCircle, { backgroundColor: '#EFF6FF' }]}>
                      <Truck size={20} color="#3B82F6" />
                    </View>
                    <Text style={styles.gridCardTitle}>Track My Order</Text>
                    <Text style={styles.gridCardDesc}>Check current order and delivery status</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.gridCard} 
                    onPress={() => handleSend('I want to hire staff')}
                  >
                    <View style={[styles.gridIconCircle, { backgroundColor: '#EBFDF5' }]}>
                      <Users size={20} color="#16B77A" />
                    </View>
                    <Text style={styles.gridCardTitle}>Hire Staff</Text>
                    <Text style={styles.gridCardDesc}>Post a requirement or find staff</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.gridRow}>
                  <TouchableOpacity 
                    style={styles.gridCard} 
                    onPress={() => handleSend('Help me find raw material suppliers')}
                  >
                    <View style={[styles.gridIconCircle, { backgroundColor: '#F5F3FF' }]}>
                      <Package size={20} color="#8B5CF6" />
                    </View>
                    <Text style={styles.gridCardTitle}>Raw Materials</Text>
                    <Text style={styles.gridCardDesc}>Find suppliers and compare products</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.gridCard} 
                    onPress={() => handleSend('I need help with marketing')}
                  >
                    <View style={[styles.gridIconCircle, { backgroundColor: '#FFFBEB' }]}>
                      <Megaphone size={20} color="#F59E0B" />
                    </View>
                    <Text style={styles.gridCardTitle}>Marketing Help</Text>
                    <Text style={styles.gridCardDesc}>Create a campaign or view proposals</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <View style={[styles.messageRow, styles.botRow]}>
                <View style={styles.botAvatarContainer}>
                  <Image 
                    source={require('../../../../assets/Chatbot.png')} 
                    style={styles.smallBotAvatar} 
                  />
                </View>
                <View style={styles.botBubbleContainer}>
                  <View style={[styles.bubble, styles.botBubble, styles.botBubbleFirst, styles.typingBubble]}>
                    <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot1 }] }]} />
                    <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot2 }] }]} />
                    <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot3 }] }]} />
                  </View>
                  <Text style={styles.typingIndicatorText}>HRC Business AI is typing</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Suggestions row shown when messages grow */}
          {userMessagesCount > 0 && !isTyping && (
            <View style={styles.suggestionsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
                {SUGGESTIONS.map((sug, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.suggestionPill}
                    onPress={() => handleSend(sug.text)}
                  >
                    <Text style={styles.suggestionIcon}>{sug.icon}</Text>
                    <Text style={styles.suggestionText}>{sug.text}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Input Bar Composer */}
          <View style={styles.composerContainer}>
            {/* Attachment Preview */}
            {attachment && (
              <View style={styles.attachPreview}>
                <View style={styles.attachPreviewLeft}>
                  {attachment.type === 'pdf' ? (
                    <View style={styles.attachIconCircle}>
                      <FileText size={16} color="#EF4444" />
                    </View>
                  ) : (
                    <Image source={{ uri: attachment.uri }} style={styles.attachThumb} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.attachFileName} numberOfLines={1}>{attachment.name}</Text>
                    <Text style={styles.attachFileType}>
                      {attachment.type === 'pdf' ? 'PDF Document' : 'Image'}
                      {attachment.size ? ` • ${(attachment.size / 1024).toFixed(0)} KB` : ''}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setAttachment(null)} style={styles.attachRemoveBtn}>
                  <X size={14} color="#EF4444" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputBar}>
              {/* Attachment Button */}
              <View>
                <TouchableOpacity 
                  style={styles.attachBtn}
                  onPress={() => setAttachMenuOpen(!attachMenuOpen)}
                  accessibilityRole="button"
                  accessibilityLabel="Attach file"
                >
                  <Paperclip size={20} color={TEXT_MUTED} />
                </TouchableOpacity>

                {/* Attachment Picker Menu */}
                {attachMenuOpen && (
                  <View style={styles.attachMenu}>
                    <TouchableOpacity style={styles.attachMenuItem} onPress={handlePickImage}>
                      <ImageIcon size={18} color="#3B82F6" />
                      <Text style={styles.attachMenuText}>Photo</Text>
                    </TouchableOpacity>
                    <View style={styles.attachMenuDivider} />
                    <TouchableOpacity style={styles.attachMenuItem} onPress={handlePickDocument}>
                      <FileText size={18} color="#EF4444" />
                      <Text style={styles.attachMenuText}>PDF Document</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <TextInput
                style={styles.textInput}
                placeholder="Ask anything about your business..."
                placeholderTextColor="#94A3B8"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => handleSend()}
                returnKeyType="send"
                multiline={true}
              />
              <TouchableOpacity 
                style={[styles.sendBtn, !inputText.trim() && !attachment && styles.sendBtnDisabled]} 
                onPress={() => {
                  if (attachment) {
                    const attachMsg = `📎 Attached: ${attachment.name}`;
                    handleSend(attachMsg);
                    setAttachment(null);
                  } else {
                    handleSend();
                  }
                }}
                disabled={!inputText.trim() && !attachment}
                accessibilityRole="button"
                accessibilityLabel="Send message"
              >
                <Send size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.disclaimerText}>HRC Business AI can make mistakes. Verify important business details.</Text>
          </View>
        </View>

        {/* Custom Confirmation Dialog for Clear Chat */}
        {confirmClearOpen && (
          <Modal
            visible={confirmClearOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setConfirmClearOpen(false)}
          >
            <View style={styles.dialogOverlay}>
              <View style={styles.dialogCard}>
                <Text style={styles.dialogTitle}>Clear conversation?</Text>
                <Text style={styles.dialogDesc}>This will remove the current chat history from this device.</Text>
                <View style={styles.dialogActions}>
                  <TouchableOpacity 
                    style={styles.dialogCancelBtn}
                    onPress={() => setConfirmClearOpen(false)}
                  >
                    <Text style={styles.dialogCancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.dialogConfirmBtn}
                    onPress={handleClearChat}
                  >
                    <Text style={styles.dialogConfirmBtnText}>Clear Chat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 13, 22, 0.65)',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  chatCard: {
    backgroundColor: BG_COLOR,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    width: '100%',
    overflow: 'hidden'
  },
  chatCardMobile: {
    height: '94%',
  },
  chatCardLarge: {
    maxWidth: 640,
    height: '90%',
    borderRadius: 24,
    marginBottom: '3%'
  },
  chatHeader: {
    backgroundColor: NAVY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 80,
    borderBottomWidth: 1,
    borderBottomColor: SECONDARY_NAVY
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  avatarWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  goldText: {
    color: GOLD
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16B77A'
  },
  statusText: {
    fontSize: 12,
    color: '#BFDBFE',
    fontWeight: '600'
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  actionButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21
  },
  dropdownMenu: {
    position: 'absolute',
    top: 75,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    zIndex: 100,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }
    })
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '700'
  },
  offlineBanner: {
    backgroundColor: '#FFF9E6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2'
  },
  offlineText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '600',
    textAlign: 'center'
  },
  messagesScroll: {
    flex: 1
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 30
  },
  dateSeparator: {
    alignSelf: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 20
  },
  dateText: {
    fontSize: 11,
    color: TEXT_MUTED,
    fontWeight: '800'
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%'
  },
  userRow: {
    justifyContent: 'flex-end'
  },
  botRow: {
    justifyContent: 'flex-start'
  },
  botAvatarContainer: {
    width: 36,
    marginRight: 8,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  smallBotAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER_COLOR
  },
  smallBotAvatarSpacer: {
    width: 32,
    height: 32
  },
  userBubbleContainer: {
    maxWidth: '82%',
    alignItems: 'flex-end'
  },
  botBubbleContainer: {
    maxWidth: '82%',
    alignItems: 'flex-start'
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Platform.select({
      web: { boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2 },
      android: { elevation: 1 }
    })
  },
  userBubble: {
    backgroundColor: NAVY,
    borderBottomRightRadius: 4
  },
  botBubble: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderBottomLeftRadius: 18
  },
  botBubbleFirst: {
    borderTopLeftRadius: 4
  },
  userBubbleText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500'
  },
  botBubbleText: {
    color: TEXT_PRIMARY,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500'
  },
  messageTime: {
    fontSize: 10,
    color: TEXT_MUTED,
    fontWeight: '600',
    marginTop: 4,
    marginHorizontal: 4
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 14,
    paddingHorizontal: 16,
    height: 38,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    justifyContent: 'center'
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8'
  },
  typingIndicatorText: {
    fontSize: 10,
    color: TEXT_MUTED,
    fontWeight: '600',
    marginTop: 4,
    marginLeft: 4
  },
  gridContainer: {
    marginTop: 8,
    marginBottom: 16,
    gap: 12
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12
  },
  gridCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    padding: 16,
    minHeight: 115,
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 4 },
      android: { elevation: 2 }
    })
  },
  gridIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  gridCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    marginBottom: 4
  },
  gridCardDesc: {
    fontSize: 11,
    color: TEXT_MUTED,
    lineHeight: 15,
    fontWeight: '500'
  },
  actionCard: {
    padding: 4,
    width: 250
  },
  actionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    flex: 1,
    marginRight: 8
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800'
  },
  actionCardDetail: {
    fontSize: 13,
    color: TEXT_PRIMARY,
    fontWeight: '700',
    marginBottom: 4
  },
  actionCardSub: {
    fontSize: 11,
    color: TEXT_MUTED,
    marginBottom: 12,
    fontWeight: '600'
  },
  cardBtn: {
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8
  },
  cardBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  suggestionsContainer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    backgroundColor: '#FFFFFF'
  },
  suggestionsScroll: {
    paddingHorizontal: 16,
    gap: 10
  },
  suggestionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER_COLOR
  },
  suggestionIcon: {
    fontSize: 14
  },
  suggestionText: {
    fontSize: 13,
    color: NAVY,
    fontWeight: '600'
  },
  composerContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR
  },
  inputBar: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
    marginBottom: 8
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: TEXT_PRIMARY,
    maxHeight: 100,
    minHeight: 44,
    ...Platform.select({
      web: { outlineStyle: 'none' }
    })
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: NAVY,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end'
  },
  sendBtnDisabled: {
    backgroundColor: '#94A3B8'
  },
  disclaimerText: {
    fontSize: 10,
    color: TEXT_MUTED,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 4
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 13, 22, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  dialogCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center'
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    marginBottom: 8,
    textAlign: 'center'
  },
  dialogDesc: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20
  },
  dialogActions: {
    flexDirection: 'row',
    width: '100%',
    gap: 12
  },
  dialogCancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dialogCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_PRIMARY
  },
  dialogConfirmBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dialogConfirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  attachBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER_COLOR
  },
  attachMenu: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    width: 180,
    zIndex: 200,
    ...Platform.select({
      web: { boxShadow: '0 4px 16px rgba(0,0,0,0.1)' },
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 6 }
    })
  },
  attachMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8
  },
  attachMenuText: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY
  },
  attachMenuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 8
  },
  attachPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10
  },
  attachPreviewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1
  },
  attachIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  attachThumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E2E8F0'
  },
  attachFileName: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_PRIMARY
  },
  attachFileType: {
    fontSize: 11,
    color: TEXT_MUTED,
    fontWeight: '600'
  },
  attachRemoveBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8
  }
});
