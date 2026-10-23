import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X } from 'lucide-react';
import {
  FaBox,
  FaTshirt,
  FaTruck,
  FaSyncAlt,
  FaPaperPlane,
  FaHeadset,
  FaUserShield
} from './Fa5Icons';

export default function KaalChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(false);
  const [sessionId] = useState(() => {
    let saved = localStorage.getItem('brahmman_chat_session_id');
    if (!saved) {
      saved = `session-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      localStorage.setItem('brahmman_chat_session_id', saved);
    }
    return saved;
  });

  const getCustomerProfile = () => {
    try {
      const stored = localStorage.getItem('brahmman_user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.name) {
          return {
            name: u.name,
            email: u.email || 'rahul.sharma@gmail.com',
            phone: u.phone || '+91 98765 43210'
          };
        }
      }
    } catch {}
    return {
      name: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      phone: '+91 98765 43210'
    };
  };

  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'team',
      senderName: 'Support Team',
      text: 'Namaste! Welcome to our Support Team desk. How can we assist you with your order, sizing, or styling today?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const syncChat = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/chats/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.session?.messages?.length > 0) {
          setMessages(data.session.messages.map(m => ({
            id: m.id,
            sender: m.sender,
            senderName: m.senderName,
            text: m.text,
            time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          })));
        }
      }
    } catch {}
  };

  useEffect(() => {
    if (!isOpen) return;
    syncChat();
    const interval = setInterval(syncChat, 2500);
    return () => clearInterval(interval);
  }, [isOpen, sessionId]);

  const quickTopics = [
    {
      label: 'Track my order',
      Icon: FaBox,
      reply: 'To track your order, please provide your Order ID (e.g. ORD-10821) or phone number. We dispatch within 24-48 hours via Bluedart/Delhivery.'
    },
    {
      label: 'Size & Oversized Fit',
      Icon: FaTshirt,
      reply: 'All our drops feature an authentic Boxy Drop-Shoulder silhouette. For an oversized drape, choose your standard size. For a regular fit, order one size down.'
    },
    {
      label: 'Shipping & COD',
      Icon: FaTruck,
      reply: 'Free express shipping across Bharat on orders above ₹999. Cash on Delivery (COD) and instant UPI are both available at checkout.'
    },
    {
      label: '7-Day Exchange',
      Icon: FaSyncAlt,
      reply: 'We offer a hassle-free 7-day exchange window for sizing. Simply request an exchange with your Order ID.'
    }
  ];

  const handleSend = async (textToSend = null) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const profile = getCustomerProfile();

    const userMsg = {
      id: `local-${Date.now()}`,
      sender: 'customer',
      senderName: profile.name,
      text,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    try {
      await fetch('http://localhost:5000/api/chats/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          sender: 'customer',
          senderName: profile.name,
          customerName: profile.name,
          customerEmail: profile.email,
          customerPhone: profile.phone,
          text
        })
      });
    } catch (e) {
      console.log('Backend chat offline, fallback local bot');
    }

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let reply = 'Thank you for reaching out! Our Support Team has received your request and will reply shortly.';
      const lower = text.toLowerCase();
      if (lower.includes('track') || lower.includes('order')) {
        reply = 'You can track your order using the "Track Your Order" link in our header with your registered phone number or Order ID.';
      } else if (lower.includes('size') || lower.includes('fit') || lower.includes('measurement')) {
        reply = 'Our T-shirts are heavy 280-340 GSM with a relaxed boxy cut. Check our Size Guide on any product page for exact chest and length measurements.';
      } else if (lower.includes('cod') || lower.includes('payment') || lower.includes('upi')) {
        reply = 'Yes! We support Cash on Delivery (COD) across 26,000+ Indian pincodes as well as instant QR / UPI / Credit Card checkout.';
      }

      setMessages(prev => [...prev, {
        id: `support-${Date.now()}`,
        sender: 'support',
        senderName: 'Support Team',
        text: reply,
        time: 'Just now'
      }]);
    }, 700);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">

      {!isOpen && !teaserDismissed && (
        <div
          onClick={() => setIsOpen(true)}
          className="bg-[#18181b] text-white border border-white/10 rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3.5 cursor-pointer hover:bg-[#202025] transition-all animate-bounce-subtle"
        >

          <div className="w-8 h-8 rounded-full bg-[#d4af37] text-black flex items-center justify-center text-xs shadow-md flex-shrink-0">
            <FaHeadset size={14} className="text-black" />
          </div>

          <div className="text-left">
            <div className="text-xs font-bold text-white">
              <span>Support Team</span>
            </div>
            <div className="text-xs text-gray-300">Admin and support team</div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setTeaserDismissed(true);
            }}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors ml-1"
            aria-label="Dismiss greeting"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-white text-black shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-gray-200"
          aria-label="Open Support Team Desk"
          title="Chat with Support Team"
        >
          <MessageSquare size={22} className="fill-black" />
        </button>
      )}

      {isOpen && (
        <div className="bg-[#121215] border border-white/15 text-white w-[350px] sm:w-[390px] h-[520px] rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden animate-fadeIn">

          <div className="bg-[#18181e] p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#d4af37] text-black font-extrabold flex items-center justify-center shadow flex-shrink-0">
                <FaHeadset size={16} className="text-black" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  Support Team
                </h3>
                <span className="text-[11px] text-gray-400">Admin and support team</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close Support Team Chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs scrollbar-thin">
            {messages.map((m, idx) => {
              const isUser = m.sender === 'customer' || m.sender === 'user';
              const isAdmin = m.sender === 'admin';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[9px] text-gray-400 mb-0.5 px-1 flex items-center gap-1">
                    {isAdmin ? (
                      <>
                        <FaUserShield size={11} className="text-amber-400" />
                        <span>Support Team (Admin)</span>
                      </>
                    ) : isUser ? (
                      <span>{m.senderName || 'You'}</span>
                    ) : (
                      <>
                        <FaHeadset size={11} className="text-[#d4af37]" />
                        <span>Support Team</span>
                      </>
                    )}
                  </span>
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      isAdmin
                        ? 'bg-amber-400 text-black font-semibold rounded-bl-sm shadow-md'
                        : isUser
                        ? 'bg-[#d4af37] text-black font-medium rounded-br-sm'
                        : 'bg-white/10 text-gray-200 border border-white/10 rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-gray-500 mt-1 px-1">{m.time}</span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1 text-[11px] text-gray-400 pl-2">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse delay-100">●</span>
                <span className="animate-pulse delay-200">●</span>
                <span className="text-[10px] ml-1">Team replying...</span>
              </div>
            )}

            <div ref={messagesEndRef} />

            {messages.length <= 2 && (
              <div className="pt-2 space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1">
                  Frequently Asked:
                </span>
                {quickTopics.map((topic, i) => {
                  const TopicIcon = topic.Icon;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSend(topic.label)}
                      className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-gray-300 transition-colors flex items-center gap-2.5"
                    >
                      <TopicIcon size={12} className="text-[#d4af37] flex-shrink-0" />
                      <span>{topic.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-3 bg-[#18181e] border-t border-white/10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Message Support Team..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-[#d4af37]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-[#d4af37] text-black hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center justify-center shadow"
                aria-label="Send Message"
              >
                <FaPaperPlane size={13} />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
