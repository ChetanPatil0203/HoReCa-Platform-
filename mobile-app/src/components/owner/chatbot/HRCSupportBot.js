import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, 
  TextInput, Image, Platform, KeyboardAvoidingView, Animated 
} from 'react-native';
import { Send, X, Bot, MessageSquare } from 'lucide-react-native';

const NAVY = '#071B3A';
const BLUE = '#2563EB';

const SUGGESTIONS = [
  { text: 'Track my order', icon: '📦' },
  { text: 'How to hire staff?', icon: '👨‍🍳' },
  { text: 'Hire marketing agency', icon: '📢' },
  { text: 'Find plumbers/cleaners', icon: '🔧' }
];

const getBotResponse = (text) => {
  const q = text.toLowerCase().trim();
  if (q.includes('order') || q.includes('track') || q.includes('status') || q.includes('delivery')) {
    return "Certainly! I've checked your active raw material orders. Order #RM-9284 is currently Out for Delivery and is estimated to arrive at Chetan Cafe by 2:00 PM today. You can track this in real-time under the 'Order Tracking' page.";
  }
  if (q.includes('staff') || q.includes('hire') || q.includes('manpower') || q.includes('chef') || q.includes('waiter') || q.includes('cook')) {
    return "To hire staff (like chefs, kitchen staff, front-of-house waiters), just tap the 'Manpower' page from the dashboard and click 'Post Requirement'. Verified agencies will review your post and send candidate resumes directly to you!";
  }
  if (q.includes('marketing') || q.includes('agency') || q.includes('campaign') || q.includes('promote') || q.includes('ad')) {
    return "Promoting your restaurant is easy! Go to the 'Marketing' page, where you can click 'Post Requirement' to share a project scope with advertising agencies, or click 'Browse Agencies' to view profiles, reviews, and portfolios of top local marketing partners.";
  }
  if (q.includes('service') || q.includes('repair') || q.includes('clean') || q.includes('plumber') || q.includes('electrician') || q.includes('pest')) {
    return "Need facility services? Under the 'Service Providers' tab, click 'Find Providers' to search for deep cleaners, plumbers, electricians, or pest control agencies. You can review ratings and book them directly from the app!";
  }
  if (q.includes('limit') || q.includes('account') || q.includes('limit check')) {
    return "You can check your account status, active business limits, and verification files by clicking your Profile picture at the top right and selecting 'Profile View'.";
  }
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('sup')) {
    return "Hello Chetan! I am your HRC Business AI assistant. How can I help you manage your Cafe operations, raw material orders, staffing, or marketing campaigns today?";
  }
  return "I'm your HRC Business Assistant, specialized in helping you manage your HoReCa operations. You can ask me about raw material orders, hiring manpower, booking service professionals, or launching marketing campaigns!";
};

export default function HRCSupportBot({ visible, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello Chetan! I am your HRC Business Assistant. How can I help you manage your Cafe operations today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  // Pulse effect for the green "Online" dot
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1000,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

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
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (typeof textToSend !== 'string') setInputText('');
    
    // Simulate bot reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: getBotResponse(messageText),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.chatCard}>
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
                <Text style={styles.headerTitle}>HRC Business AI</Text>
                <View style={styles.statusRow}>
                  <Animated.View style={[styles.statusDot, { opacity: pulseAnim }]} />
                  <Text style={styles.statusText}>Online</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityRole="button">
              <X size={20} color={NAVY} />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(msg => (
              <View 
                key={msg.id} 
                style={[
                  styles.messageBubbleContainer, 
                  msg.sender === 'user' ? styles.userBubbleContainer : styles.botBubbleContainer
                ]}
              >
                <View 
                  style={[
                    styles.bubble, 
                    msg.sender === 'user' ? styles.userBubble : styles.botBubble
                  ]}
                >
                  <Text style={msg.sender === 'user' ? styles.userBubbleText : styles.botBubbleText}>
                    {msg.text}
                  </Text>
                </View>
                <Text style={styles.messageTime}>{msg.time}</Text>
              </View>
            ))}

            {isTyping && (
              <View style={[styles.messageBubbleContainer, styles.botBubbleContainer]}>
                <View style={[styles.bubble, styles.botBubble, styles.typingBubble]}>
                  <Text style={styles.typingText}>Typing...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Suggestions (only shown when conversation starts) */}
          {messages.length === 1 && !isTyping && (
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

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask a question about your business..."
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
              returnKeyType="send"
            />
            <TouchableOpacity 
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]} 
              onPress={() => handleSend()}
              disabled={!inputText.trim()}
              accessibilityRole="button"
            >
              <Send size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 13, 22, 0.55)',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  chatCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: '75%',
    maxHeight: 650,
    ...Platform.select({
      web: { boxShadow: '0 -4px 30px rgba(0,0,0,0.08)' },
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 16 },
      android: { elevation: 12 }
    })
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#071B3A',
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
    color: NAVY
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#10B981'
  },
  statusText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600'
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  messagesScroll: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  messagesContent: {
    padding: 20,
    gap: 16,
    paddingBottom: 40
  },
  messageBubbleContainer: {
    maxWidth: '85%',
    gap: 4
  },
  userBubbleContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end'
  },
  botBubbleContainer: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start'
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18
  },
  userBubble: {
    backgroundColor: NAVY,
    borderBottomRightRadius: 4
  },
  botBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 4
  },
  userBubbleText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500'
  },
  botBubbleText: {
    color: '#0F172A',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500'
  },
  messageTime: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
    marginHorizontal: 4
  },
  typingBubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#E2E8F0'
  },
  typingText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600'
  },
  suggestionsContainer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF'
  },
  suggestionsScroll: {
    paddingHorizontal: 20,
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
    borderColor: '#E2E8F0'
  },
  suggestionIcon: {
    fontSize: 14
  },
  suggestionText: {
    fontSize: 13,
    color: NAVY,
    fontWeight: '600'
  },
  inputBar: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
    gap: 12,
    alignItems: 'center'
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 22,
    paddingHorizontal: 16,
    height: 44,
    fontSize: 14,
    color: '#0F172A',
    ...Platform.select({
      web: { outlineStyle: 'none' }
    })
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendBtnDisabled: {
    backgroundColor: '#93C5FD'
  }
});
