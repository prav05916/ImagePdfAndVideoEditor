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
        ? "नमस्ते! मैं ShivanshStudio का एआई असिस्टेंट हूँ। मैं आपको किसी भी टूल को इस्तेमाल करने में या डिज़ाइन से जुड़े सुझाव देने में मदद कर सकता हूँ। मैं आपकी क्या मदद करूँ?"
        : "Hello! I'm your ShivanshStudio AI Assistant. I can help you use any of our tools or give you design tips. How can I help you today?";
  }
};

const simulateAIResponse = (query: string, pathname: string, locale: string): string => {
  const q = query.toLowerCase();
  
  // Detect if the user is asking in Hindi or if the current locale is Hindi
  const isHi = locale === 'hi' || q.includes('नमस्ते') || q.includes('क्या') || q.includes('कैसे') || q.includes('काम') || q.includes('मदद') || q.includes('है') || q.includes('करो');

  // Greeting
  if (q.includes('hello') || q.includes('hi ') || q.trim() === 'hi' || q.includes('hey') || q.includes('नमस्ते') || q.includes('हेलो')) {
    return isHi 
      ? "नमस्ते! मैं ShivanshStudio का एआई सहायक हूँ। मैं आपकी क्या मदद कर सकता हूँ? आप मुझसे हमारे वीडियो एडिटर, एटीएस रिज्यूमे बिल्डर, बैकग्राउंड रिमूवर या अन्य टूल्स के बारे में पूछ सकते हैं!"
      : "Hello! I'm your ShivanshStudio AI Assistant. How can I help you today? Feel free to ask about our Video Editor, ATS Resume Enhancer, Background Remover, or any other tools!";
  }

  // 1. What does this website do / Platform Features
  if (q.includes('what this website does') || q.includes('what does this website do') || q.includes('about this website') || q.includes('what is shivanshstudio') || q.includes('website info') || q.includes('features') || q.includes('available tools') || q.includes('tools') ||
      q.includes('वेबसाइट क्या करती है') || q.includes('क्या काम करती है') || q.includes('कौन से टूल्स हैं') || q.includes('शिवंश स्टूडियो क्या है') || q.includes('फीचर्स')) {
    if (isHi) {
      return `ShivanshStudio एक शक्तिशाली, ऑल-इन-वन क्रिएटिव और प्रोफेशनल यूटिलिटी प्लेटफॉर्म है जो सीधे आपके ब्राउज़र में काम करता है! यहाँ हमारे मुख्य टूल्स हैं:

1. **एआई वीडियो एडिटर** (AI Video Editor): मल्टी-ट्रैक टाइमलाइन एडिटर जहाँ आप क्लिप्स को काट (Split) सकते हैं, हटा (Delete) सकते हैं, स्केल/रोटेशन बदल सकते हैं, कॉपीराइट-मुक्त ऑडियो जोड़ सकते हैं, वॉयसओवर रिकॉर्ड कर सकते हैं और कूल इफेक्ट्स (Sepia, Cyberpunk) लगा सकते हैं।
2. **एटीएस रिज्यूमे इनहेंसर** (ATS Resume Enhancer): एक लाइव रिज्यूमे बिल्डर जो आपके एटीएस स्कोर की गणना करता है और एआई टूल्स का उपयोग करके कीवर्ड्स, मेट्रिक्स और प्रोफेशनल समरी जोड़कर स्कोर बढ़ाने में मदद करता है।
3. **इमेज एडिटर और बैकग्राउंड रिमूवर** (Image Editor & Background Remover): बैकग्राउंड को पलक झपकते ही हटाने और कलर्स को एआई द्वारा बेहतर बनाने के लिए।
4. **वेडिंग कार्ड्स** (Wedding Cards): खूबसूरत शादी के निमंत्रण कार्ड बनाने के लिए।
5. **पोस्टर और कोट मेकर** (Quote Posters): सोशल मीडिया और पोस्टर्स के लिए शानदार डिज़ाइन्स।

क्या आप किसी विशिष्ट टूल के बारे में विस्तार से जानना चाहते हैं?`;
    } else {
      return `ShivanshStudio is a powerful, premium all-in-one creative and professional suite running entirely in your web browser! Here are our core tools:

1. **✨ AI Video Editor** (/video-editor): A full multi-track timeline browser editor that supports adding media clips, splitting, deleting, adjusting scale/rotation, adding royalty-free audio tracks, recording custom voiceovers, adding stylized text overlays, and applying instant canvas filters (Grayscale, Sepia, Cyberpunk, Noir).
2. **📄 ATS Resume Enhancer** (/resume-enhancer): A live, interactive resume builder and optimizer that calculates your real-time ATS score, suggests customized target-role improvements, and automates optimization (keyword insertion, summary refinement, performance metrics injection, contact completion).
3. **🖼️ Image Editor & Background Remover** (/image-editor, /background-remover): Tools to instantly crop, apply AI color enhancement, and clear backgrounds with adjustable thresholds.
4. **💌 Wedding Card Maker** (/wedding-cards): Design beautiful traditional and modern wedding invites with helpful text suggestions.
5. **🎨 Quote Poster Maker** (/quote-poster): Generate gorgeous typographic quote designs instantly.

Which tool would you like to explore or need help with?`;
    }
  }

  // 2. Resume Enhancer not working / help / ATS score / AI tools / Resume / CV
  if (q.includes('resume') || q.includes('cv') || q.includes('ats') || q.includes('enhancer') || q.includes('रिज्यूमे') || q.includes('एटीएस') || q.includes('नौकरी') || q.includes('मदद')) {
    if (q.includes('not working') || q.includes('help') || q.includes('work') || q.includes('काम') || q.includes('मदद') || q.includes('कैसे')) {
      if (isHi) {
        return `रिज्यूमे इनहेंसर और उसके **एआई टूल्स (AI Tools)** का पूरा लाभ उठाने के लिए इन सरल चरणों का पालन करें:

1. **'✨ AI Tools' टैब पर जाएँ**: बाएं साइडबार में 'Content' और 'Templates' के बगल में स्थित **'✨ AI Tools'** टैब पर क्लिक करें।
2. **एआई इम्प्रूवमेंट चेकलिस्ट का उपयोग करें**:
   - **कीवर्ड्स जोड़ें (Insert Keywords)**: अपने स्किल्स में महत्वपूर्ण इंडस्ट्री कीवर्ड्स ऑटो-इंजेक्ट करने के लिए क्लिक करें (+20% एटीएस स्कोर वृद्धि)।
   - **मेट्रिक्स डालें (Inject Metrics)**: काम के अनुभवों में संख्यात्मक और प्रभाव-संचालित उपलब्धियां जोड़ने के लिए क्लिक करें (+20% एटीएस स्कोर वृद्धि)।
   - **समरी सुधारें (Refine Summary)**: एक प्रोफेशनल और आकर्षक कार्यकारी सारांश लिखने के लिए क्लिक करें (+20% एटीएस स्कोर वृद्धि)।
   - **प्रोफाइल पूरा करें (Fill Profile)**: कांटेक्ट और सोशल मीडिया क्रेडेंशियल्स भरने के लिए क्लिक करें (+10% एटीएस स्कोर वृद्धि)।
3. **टारगेट रोल एआई एनालिस्ट (Target Role AI Analyst)**:
   - इनपुट बॉक्स में अपनी लक्षित भूमिका (जैसे "Data Scientist" या "Frontend Developer") दर्ज करें।
   - **'Analyze & Suggest Ideas'** पर क्लिक करें।
   - एआई द्वारा सुझाए गए सुझावों को देखें और **'Apply Tailored Changes'** पर क्लिक करके उन्हें अपने रिज्यूमे पर लाइव लागू करें!
4. **लाइव कैनवास पर एडिट करें**: आप कैनवास पर किसी भी हिस्से पर क्लिक करके उसे सीधे एडिट कर सकते हैं। दाएं पैनल में फ़ॉन्ट, थीम रंग और लेआउट डेंसिटी भी कस्टमाइज़ की जा सकती है!

क्या आपको किसी विशिष्ट सुविधा को सक्षम करने में कोई समस्या आ रही है?`;
      } else {
        return `Here is a complete guide to using the **AI Resume Enhancer & ATS Optimizer** features:

1. **Access the ✨ AI Tools Tab**: In the left sidebar of the /resume-enhancer page, click on the **'✨ AI Tools'** tab next to 'Content' and 'Templates'.
2. **AI Improvement Checklist (Dynamic ATS Boost)**:
   - **✨ Insert Keywords**: Click this to automatically inject target technical keywords like TypeScript, AWS, and system architectures into your Skills block (+20% ATS Score).
   - **✨ Inject Metrics**: Click this to rewrite your work description with quantifiable, high-impact achievements (e.g., 'reduced page load by 45%', 'saved $45k annually') (+20% ATS Score).
   - **✨ Refine Summary**: Click this to generate a powerful, metrics-driven professional summary (+20% ATS Score).
   - **✨ Fill Profile Details**: Click this to complete missing contact details like GitHub and LinkedIn links (+10% ATS Score).
3. **💡 Target Role AI Analyst**:
   - Enter your desired career role (e.g., "Frontend Developer" or "Data Scientist") into the target role box.
   - Click **'Analyze & Suggest Ideas'** to view tailor-made professional recommendations.
   - Click **'Apply Tailored Changes'** to dynamically update your entire resume (Personal title, skills, summary) with specialized optimizations!
4. **Interactive Customization**: You can also select any block directly on the A4 canvas to edit it, and adjust global styles (Theme Color, Typography fonts like Inter/Outfit, and Layout Density) from the right panel!

Let me know if you need help with a specific action or slider!`;
      }
    } else {
      if (isHi) {
        return `रिज्यूमे इनहेंसर आपको अपना एटीएस (ATS) स्कोर बढ़ाने में मदद करता है। आप **'✨ AI Tools'** का उपयोग करके कीवर्ड, व्यावसायिक प्रभाव के मेट्रिक्स और एक बेहतरीन समरी शामिल कर सकते हैं। आपका वर्तमान एटीएस स्कोर कैनवास के ऊपर और बाएं पैनल में रीयल-टाइम में अपडेट होता है! क्या आप जानना चाहते हैं कि इसे कैसे इस्तेमाल करें?`;
      } else {
        return `Our ATS Resume Enhancer helps you bypass automated recruitment filters by calculating a real-time ATS score based on your layout and content. Using the **'✨ AI Tools'** tab, you can instantly inject tailored industry keywords, performance metrics, and a polished summary. Let me know if you'd like step-by-step instructions on how to use it!`;
      }
    }
  }

  // 3. Video Editor specific queries
  if (q.includes('video') || q.includes('editor') || q.includes('trim') || q.includes('merge') || q.includes('split') || q.includes('cut') || q.includes('delete') || q.includes('audio') || q.includes('voice') ||
      q.includes('वीडियो') || q.includes('काट') || q.includes('जोड़') || q.includes('आवाज') || q.includes('ऑडियो')) {
    if (isHi) {
      return `वीडियो एडिटर एक शक्तिशाली मल्टी-ट्रैक टाइमलाइन टूल है। यहाँ बताया गया है कि आप इसका उपयोग कैसे कर सकते हैं:
      
- **टाइमलाइन टूल्स (Timeline Tools)**: क्लिप्स को व्यवस्थित करने के लिए बाएं साइडबार में **Media** (क्लिप्स जोड़ने के लिए), **Audio** (बैकग्राउंड ट्रैक जोड़ने के लिए), **Text** (स्टाइलिश टेक्स्ट ओवरले जोड़ने के लिए), और **Effects** (फिल्टर लगाने के लिए) टैब्स का उपयोग करें।
- **क्लिप्स को काटना (Split Clip)**: टाइमलाइन पर किसी क्लिप को चुनें, प्लेहेड (लाल वर्टिकल लाइन) को उस स्थान पर ले जाएं जहां आप काटना चाहते हैं, और **✂️ Split** पर क्लिक करें।
- **क्लिप हटाना (Delete Clip)**: किसी क्लिप को चुनें और उसे टाइमलाइन से तुरंत हटाने के लिए **🗑 Delete** पर क्लिक करें।
- **वॉयसओवर रिकॉर्डिंग (Voiceover)**: Audio टैब में **🎙 Record Voiceover** बटन पर क्लिक करें। अपने ब्राउज़र में माइक्रोफ़ोन की अनुमति दें और रिकॉर्डिंग शुरू करें!
- **इफेक्ट्स लगाना (Effects)**: Effects टैब पर जाएं और अपनी क्लिप पर **Grayscale, Sepia, Cyberpunk या Noir** प्रभाव लागू करें।

यह सब पूरी तरह से आपके ब्राउज़र में सुरक्षित रूप से चलता है!`;
    } else {
      return `Our advanced **AI Video Editor** features a fully interactive multi-track timeline:

- **Active Left Sidebar Tabs**: Switch between **Media** (to manage clips), **Audio** (to add copyright-free SoundHelix tracks), **Text** (to add pre-styled dynamic text overlays), and **Effects** (to apply filters) tabs.
- **Scrubbing & Playback**: Click or drag the time ruler at the top of the timeline to scrub. Hit the main **Play/Pause** button to sync all video, audio, and text elements in real time.
- **✂️ Split Clips**: Select any clip in the timeline, position the playhead (the red vertical line) where you want to make a cut, and click the **✂️ Split** button to divide it into two.
- **🗑 Delete Clips**: Select any active clip on the timeline and click **🗑 Delete** to remove it instantly.
- **🎙 Custom Voiceover**: Go to the **Audio** tab, click **🎙 Record Voiceover**, grant microphone permission in your browser, and record your custom voiceover stream natively!
- **✨ Instant Canvas Filters**: Under the **Effects** tab, click **Grayscale, Sepia, Cyberpunk, or Noir** to instantly apply visual filters to the preview canvas via inline CSS filters.

Everything is processed secure and fast right inside your browser!`;
    }
  }

  // 4. Background Remover
  if (q.includes('background') || q.includes('remover') || q.includes('remove bg') || q.includes('bg remover') || q.includes('बैकग्राउंड') || q.includes('हटा')) {
    if (isHi) {
      return `बैकग्राउंड रिमूवर टूल आपको अपनी छवियों से पृष्ठभूमि को आसानी से हटाने की सुविधा देता है:
- एक इमेज अपलोड करें।
- रंग मिलान संवेदनशीलता को नियंत्रित करने के लिए **Threshold Slider** का उपयोग करें।
- बिल्कुल साफ कटआउट प्राप्त करने के लिए इसे आवश्यकतानुसार समायोजित करें।`;
    } else {
      return `Our Background Remover tool lets you easily clear backgrounds from images:
- Simply upload any image.
- Adjust the **Threshold Slider** to control the color similarity range.
- Fine-tune it to get the perfect clean cutout for your product images or portraits!`;
    }
  }

  // 5. Wedding cards
  if (q.includes('wedding') || q.includes('card') || q.includes('invitation') || q.includes('शादी') || q.includes('कार्ड') || q.includes('निमंत्रण')) {
    if (isHi) {
      return `वेडिंग कार्ड्स मेकर (/wedding-cards) आपको सुंदर निमंत्रण पत्र बनाने में मदद करता है:
- पारंपरिक, आधुनिक और रॉयल श्रेणियों में से एक टेम्पलेट चुनें।
- एआई द्वारा सुझाए गए सुंदर संदेशों (Invitation Messages) का उपयोग करें।
- फ़ॉन्ट, कलर्स और कार्ड के बैकग्राउंड को आसानी से कस्टमाइज़ करें!`;
    } else {
      return `Our Wedding Card Maker (/wedding-cards) makes invitation design effortless:
- Choose from a wide selection of Premium Traditional, Modern, or Royal templates.
- Use our built-in AI message generator to craft the perfect, heart-felt invitation text.
- Fully customize typography fonts, colors, and layout borders before exporting!`;
    }
  }

  // Generic fallback with helpful info
  if (isHi) {
    return `मुझे समझने में थोड़ी मुश्किल हो रही है, लेकिन मैं आपको सुझाव दे सकता हूँ कि आप हमारे टूल्स के साथ प्रयोग करें! 
    
क्या आप **एआई वीडियो एडिटर** (/video-editor) या **एटीएस रिज्यूमे बिल्डर** (/resume-enhancer) के बारे में कुछ जानना चाहते हैं? मैं आपके प्रश्नों के विस्तृत उत्तर देने के लिए तैयार हूँ!`;
  } else {
    return `I couldn't quite find a direct match for that query, but here's how I can help you:
    
- **AI Video Editor**: Ask me about splitting clips, deleting items, recording custom voiceovers, adding background audio, or applying visual effects.
- **ATS Resume Enhancer**: Ask me how to use the '✨ AI Tools' tab, optimize technical keywords, inject metrics, or analyze your resume for a target job role.

Is there a specific tool or feature you would like help with?`;
  }
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
                    <h3 className="font-bold text-sm">ShivanshStudio AI</h3>
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
