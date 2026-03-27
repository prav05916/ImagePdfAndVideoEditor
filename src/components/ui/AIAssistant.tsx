'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const getContextualPreamble = (pathname: string, locale: string) => {
  const isHi = locale === 'hi';
  switch (pathname) {
    case '/video-editor':
      return isHi
        ? "नमस्ते! मैं आपका एआई वीडियो संपादक सहायक हूँ। मैं आपको वीडियो ट्रिम करने या कई क्लिप्स को एक साथ मर्ज करने में मदद कर सकता हूँ। मैं क्या करूँ?"
        : "Hi! I'm your AI Video Editor Assistant. I can help you trim videos or merge multiple clips together locally. What would you like to do?";
    case '/image-editor':
      return isHi 
        ? "नमस्ते! मैं आपका एआई डिज़ाइन असिस्टेंट हूँ। मैं इमेज को क्रॉप करने, रंग बदलने या एआई द्वारा इमेज की क्वालिटी बढ़ाने में आपकी मदद कर सकता हूँ। आप क्या करना चाहेंगे?"
        : "Hi! I'm your AI Design Assistant. I can help you crop images, adjust colors, or use our AI to enhance image quality. What would you like to do?";
    case '/wedding-cards':
      return isHi 
        ? "नमस्ते! क्या आपको शादी का कार्ड बनाने में मदद चाहिए? मैं आपको सही टेम्पलेट चुनने और कार्ड के टेक्स्ट को बेहतर बनाने में सुझाव दे सकता हूँ।"
        : "Hi there! Need help designing a wedding card? I can suggest the best template for your theme or help you write the perfect invitation message.";
    case '/background-remover':
      return isHi
        ? "नमस्ते! क्या आप बैकग्राउंड हटाना चाहते हैं? थ्रेशोल्ड स्लाइडर का उपयोग करें ताकि सिर्फ वही हिस्सा हटे जो आप चाहते हैं।"
        : "Hello! Removing a background? Try adjusting the threshold slider to get the perfect cutout. I'm here if you have questions!";
    case '/quote-poster':
      return isHi
        ? "नमस्ते! क्या मैं आपको पोस्टर के लिए कोई अच्छा कोट (Quote) सुझा सकता हूँ? बस मुझे विषय बताएँ!"
        : "Hi! Need a quote for your poster? Just tell me the topic (e.g., inspiration, love, success) and I'll generate one for you!";
    default:
      return isHi
        ? "नमस्ते! मैं PixelCraft Studio का एआई असिस्टेंट हूँ। मैं आपको किसी भी टूल को इस्तेमाल करने में या डिज़ाइन से जुड़े सुझाव देने में मदद कर सकता हूँ। मैं आपकी क्या मदद करूँ?"
        : "Hello! I'm your PixelCraft Studio AI Assistant. I can help you use any of our tools or give you design tips. How can I help you today?";
  }
};

const simulateAIResponse = (query: string, pathname: string, locale: string): string => {
  const q = query.toLowerCase();
  const isHi = locale === 'hi';

  if (q.includes('hello') || q.includes('hi ') || q.includes('नमस्ते')) {
    return isHi ? "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?" : "Hello! How can I assist you with your design today?";
  }

  if (pathname === '/video-editor') {
    if (q.includes('trim') || q.includes('cut') || q.includes('काट')) {
      return isHi
        ? "वीडियो ट्रिम करने के लिए, वीडियो अपलोड करें, 'प्रारंभ समय' और 'समाप्ति समय' (सेकंड में) दर्ज करें और 'वीडियो ट्रिम करें' पर क्लिक करें।"
        : "To trim a video, simply upload your file, set the 'Start Time' and 'End Time' in seconds, and click 'Trim Video'. The processing happens entirely in your browser!";
    }
    if (q.includes('merge') || q.includes('join') || q.includes('जोड़')) {
      return isHi
        ? "दो वीडियो मर्ज करने के लिए, दोनों फ़ाइलें अपलोड करें और 'वीडियो मर्ज करें' पर क्लिक करें। ध्यान रहे, दोनों वीडियो का फॉर्मेट एक जैसा होना चाहिए।"
        : "To merge two videos, upload the first video, then the second one. Click 'Merge Videos' and I'll stitch them together for you.";
    }
  }

  if (pathname === '/quote-poster') {
    if (q.includes('quote') || q.includes('suggest') || q.includes('कोट')) {
      return isHi 
        ? "यहाँ एक सुझाव है: 'सफलता की शुरुआत हमेशा एक कोशिश से होती है।' आप इसे अपने पोस्टर में इस्तेमाल कर सकते हैं!"
        : "Here's a suggestion: 'The secret of getting ahead is getting started.' Feel free to use this in your poster!";
    }
  }

  if (pathname === '/wedding-cards') {
    if (q.includes('message') || q.includes('text') || q.includes('संदेश')) {
      return isHi
        ? "आप यह संदेश इस्तेमाल कर सकते हैं: 'हमें आपको अपने विवाह समारोह में आमंत्रित करते हुए अत्यंत हर्ष हो रहा है। आपकी उपस्थिति हमारे लिए आशीर्वाद होगी।'"
        : "How about this message: 'With joyful hearts, we invite you to share in our happiness as we celebrate our wedding day. Your presence will make it special.'";
    }
  }

  if (pathname === '/image-editor') {
    if (q.includes('enhance') || q.includes('quality') || q.includes('क्वालिटी')) {
      return isHi
        ? "'AI Enhance' बटन का उपयोग करें। यह आपकी इमेज को शार्प करेगा और कलर्स को अपने आप बैलेंस कर देगा।"
        : "Click the 'AI Enhance' button! It applies a sharpening filter and auto-balances the colors to make your image pop.";
    }
  }

  // Generic fallback
  return isHi
    ? "मुझे समझने में थोड़ी मुश्किल हो रही है, लेकिन मैं आपको सुझाव दे सकता हूँ कि आप हमारे टूल्स के साथ प्रयोग करें! क्या आप किसी विशिष्ट टूल के बारे में जानना चाहते हैं?"
    : "I'm a simulated AI for this demo, but here's a tip: don't be afraid to experiment with the sliders and features! Is there a specific tool you need help finding?";
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();
  const { locale } = useAppStore();

  useEffect(() => {
    // Reset/Initialize chat when route or locale changes
    const initialMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: getContextualPreamble(pathname, locale),
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [pathname, locale]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI delay
    setTimeout(() => {
      const responseContent = simulateAIResponse(userMessage.content, pathname, locale);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full gradient-primary shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform group"
            >
              <span className="group-hover:animate-bounce">✨</span>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 right-0 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-surface rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-border gradient-primary flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="text-xl">✨</div>
                  <div>
                    <h3 className="font-bold text-sm">PixelCraft AI</h3>
                    <p className="text-xs text-white/80">Online & ready to help</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg scrollbar-thin">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-surface-lighter text-text-primary border border-border rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-surface-lighter border border-border p-4 rounded-2xl rounded-bl-sm flex gap-1">
                      <motion.div className="w-2 h-2 rounded-full bg-text-muted" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                      <motion.div className="w-2 h-2 rounded-full bg-text-muted" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                      <motion.div className="w-2 h-2 rounded-full bg-text-muted" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-surface border-t border-border">
                <div className="flex items-center gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={locale === 'hi' ? "मुझसे कुछ भी पूछें..." : "Ask me anything..."}
                    className="flex-1 max-h-24 min-h-[44px] bg-surface-lighter border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-primary resize-none overflow-y-auto"
                    rows={1}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
