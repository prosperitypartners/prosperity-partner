/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Phone, 
  MessageCircle, 
  TrendingUp, 
  Settings, 
  Cpu, 
  ShieldCheck, 
  ExternalLink, 
  ChevronRight, 
  CheckCircle2,
  Menu,
  X,
  ArrowUpRight,
  Globe,
  Zap,
  BarChart3,
  Bot,
  Send,
  Loader2,
  Star,
  Quote
} from 'lucide-react';

// --- Services ---

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Components ---

const Logo = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={`${className} transition-all duration-300`}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Refined SVG path to match the sophisticated gold loop bird logo */}
    <g stroke="#D4AF37" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Wing segments top left */}
      <path d="M40 32C45 25 55 28 58 35" />
      <path d="M45 28C52 24 62 26 62 32" />
      {/* Head facing right */}
      <path d="M62 32C65 30 75 32 78 44C80 50 78 60 70 66" />
      {/* The unique loop and body connection */}
      <path d="M62 32C52 40 48 45 52 58C54 65 46 68 44 60C42 52 55 55 70 66" />
      {/* Sweeping tail lines at the bottom */}
      <path d="M28 72C38 70 68 75 92 70" />
      <path d="M45 78C55 77 75 80 92 77" />
      {/* Eye */}
      <circle cx="70" cy="45" r="1.2" fill="#D4AF37" stroke="none" />
    </g>
  </svg>
);

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hi! I\'m the Prosperity Partners AI. How can I help you grow today? (Ask about Marketing, Finance, or Tech)' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: `You are an AI assistant for Prosperity Partners, a hybrid firm offering:
          1. Digital Marketing (SEO, Google/Meta Ads, Web Dev, Social Media).
          2. Financial Planning & Investment (Mutual Funds, AIF, PMS, Unlisted Shares, Bonds, Insurance) - ALWAYS highlight that financial guidance is FREE.
          3. AI & Tech Solutions (AI Chatbots, Voice Agents, Automation).
          
          Tone: Professional, helpful, and results-oriented. 
          Goal: Answer questions about services and encourage booking a FREE consultation via WhatsApp.
          Keep responses concise and informative.`
        }
      });

      const aiText = response.text || "I'm sorry, I encountered an error. Please try again or contact us via WhatsApp.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting right now. Please reach out to us directly via WhatsApp for immediate support." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-28 right-8 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-[90vw] max-w-[380px] overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-brand-navy p-6 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                  <Logo className="w-9 h-9" />
                </div>
                <div>
                  <h4 className="font-bold">Growth Assistant</h4>
                  <p className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">Online Now</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-navy text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-brand-navy" />
                    <span className="text-xs text-gray-500">AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-2 pr-1">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything..."
                  className="flex-grow bg-transparent border-none focus:ring-0 text-sm px-2 py-2"
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-brand-navy text-white p-2 rounded-lg disabled:opacity-50 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-brand-navy rounded-full shadow-2xl flex items-center justify-center text-white relative mt-4 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-brand-gold translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-20" />
        {isOpen ? <X className="w-8 h-8" /> : <Logo className="w-10 h-10" />}
      </motion.button>
    </div>
  );
};

const Testimonials = () => {
  const [activeTab, setActiveTab] = useState<'marketing' | 'finance' | 'ai'>('marketing');

  const testimonials = {
    marketing: [
      {
        name: "Anita Sharma",
        company: "Glow Cosmetics",
        content: "Working with Prosperity Partners transformed our online presence. Our lead volume increased by 150% in just 3 months.",
        rating: 5
      },
      {
        name: "Rahul Verma",
        company: "TechPro Solutions",
        content: "Their Google Ads strategy is data-driven and results-oriented. The ROI has been phenomenal for our B2B campaigns.",
        rating: 5
      }
    ],
    finance: [
      {
        name: "Vikram Mehta",
        company: "IT Professional",
        content: "The free financial guidance was a game-changer for my family. We finally have a clear roadmap for our long-term goals.",
        rating: 5
      },
      {
        name: "Priya Goyal",
        company: "SME Owner",
        content: "Highly recommended for their transparency and expert advice on mutual funds and portfolio management. Truly 100% free.",
        rating: 5
      }
    ],
    ai: [
      {
        name: "David Chen",
        company: "Global Logistics",
        content: "The AI Chatbot they developed handles 70% of our customer queries automatically. Our efficiency has soared.",
        rating: 5
      },
      {
        name: "Sarah Johnson",
        company: "HealthFirst Clinic",
        content: "Their voice agents are incredibly natural. It has completely automated our appointment booking and follow-up process.",
        rating: 5
      }
    ]
  };

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-brand-gold font-bold uppercase tracking-widest text-sm">Success Stories</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-8">What Our Clients Say</h2>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {['marketing', 'finance', 'ai'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-8 py-3 rounded-full font-bold transition-all uppercase tracking-widest text-xs ${
                  activeTab === tab 
                    ? 'bg-brand-navy text-white shadow-xl shadow-brand-navy/20' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {testimonials[activeTab].map((t, idx) => (
              <motion.div
                key={`${activeTab}-${idx}`}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-gray-50 p-10 rounded-[2.5rem] relative group hover:bg-white hover:shadow-2xl hover:shadow-gray-200 transition-all border border-transparent hover:border-gray-100"
              >
                <div className="absolute top-8 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="w-12 h-12 text-brand-navy" />
                </div>
                
                <div className="flex mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-brand-gold fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-8 italic">"{t.content}"</p>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-navy/5 rounded-full flex items-center justify-center font-bold text-brand-navy">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Marketing', href: '#marketing' },
    { name: 'Finance', href: '#finance' },
    { name: 'AI Solutions', href: '#ai' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'About', href: '#about' },
  ];

  return (
    <nav 
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-brand-navy p-1.5 rounded-xl shadow-sm">
            <Logo className="w-9 h-9" />
          </div>
          <span className="text-xl font-display font-bold tracking-tight text-brand-navy">
            Prosperity <span className="text-brand-gold font-light">Partners</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <motion.a 
              key={link.name} 
              href={link.href} 
              whileHover={{ scale: 1.05 }}
              className="text-sm font-medium hover:text-brand-gold transition-colors"
            >
              {link.name}
            </motion.a>
          ))}
          <motion.a 
            href="https://wa.me/your-number" 
            target="_blank" 
            referrerPolicy="no-referrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full hover:bg-[#128C7E] transition-all shadow-md font-medium text-sm"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp Us</span>
          </motion.a>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-brand-navy p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium"
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="https://wa.me/your-number" 
                className="flex items-center justify-center space-x-2 bg-[#25D366] text-white p-4 rounded-xl font-bold"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Get Free Consultation</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const ServiceCard = ({ icon: Icon, title, description, tags, colorClass, highlight }: any) => (
  <motion.div 
    whileHover={{ 
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }}
    transition={{ type: "spring", stiffness: 300 }}
    className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col h-full"
  >
    <div className={`p-3 rounded-2xl w-fit ${colorClass} mb-6`}>
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-2xl font-display font-bold mb-4">{title}</h3>
    <p className="text-gray-600 mb-6 flex-grow leading-relaxed">{description}</p>
    <div className="flex flex-wrap gap-2 mb-6">
      {tags.map((tag: string) => (
        <span key={tag} className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-500 rounded-full">
          {tag}
        </span>
      ))}
    </div>
    {highlight && (
      <div className="bg-brand-gold/10 p-4 rounded-2xl mb-6">
        <span className="text-sm font-bold text-brand-gold uppercase tracking-wider">{highlight}</span>
      </div>
    )}
    <motion.button 
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center text-brand-navy font-bold transition-transform"
    >
      Learn More <ChevronRight className="ml-1 w-4 h-4" />
    </motion.button>
  </motion.div>
);

export default function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-brand-gold/30">
      <Navbar />
      <Chatbot />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-gold/5 pointer-events-none" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-brand-gold/10 text-brand-gold px-4 py-2 rounded-full mb-8"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span className="text-xs font-bold uppercase tracking-widest">Free Consultation & Guidance</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-8"
            >
              Your Hybrid Growth <span className="text-brand-gold italic font-serif font-normal">Powerhouse</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Digital Marketing, Financial Planning, and AI Solutions—all under one roof. 
              We bridge the gap between creative strategy and technical excellence.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.a 
                href="https://wa.me/your-number"
                whileHover={{ scale: 1.03, y: -2, shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-brand-navy text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all"
              >
                Start Your Free Journey
              </motion.a>
              <motion.a 
                href="#services"
                whileHover={{ scale: 1.03, backgroundColor: "rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto border-2 border-brand-navy/10 px-8 py-4 rounded-2xl font-bold text-lg transition-all"
              >
                Explore Services
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <div className="bg-brand-navy py-12 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 flex space-x-4 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="h-full w-px bg-white/20" />
          ))}
        </div>
        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Founded On', val: 'Integrity' },
              { label: 'Consultations', val: 'Free' },
              { label: 'Support', val: '24/7' },
              { label: 'Results', val: 'Guaranteed' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-brand-gold/60 text-xs font-bold uppercase mb-1 tracking-widest">{stat.label}</p>
                <p className="text-white text-2xl font-display font-medium">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marketing Section */}
      <section id="marketing" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <span className="text-brand-purple font-bold uppercase tracking-widest text-sm">Creative Growth</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-6">Digital Marketing that <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-pink-500">Delivers Real Revenue</span></h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                From SEO to aggressive ad campaigns, we don't just chase clicks—we chase conversions. 
                Our strategy is rooted in data and executed with creative flair.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Full-service SEO & Content Marketing',
                  'High-Performance Google & Meta Ads',
                  'Brand Strategy & Social Media Mgmt',
                  'Modern Website Development'
                ].map((item, idx) => (
                  <motion.li 
                    key={item} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex items-center space-x-3 text-gray-700"
                  >
                    <CheckCircle2 className="text-brand-purple w-5 h-5 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.button 
                whileHover={{ scale: 1.03, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-brand-purple text-white px-8 py-4 rounded-xl font-bold flex items-center group"
              >
                Scale Your Brand <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative"
            >
              <div className="aspect-square bg-gradient-to-br from-brand-purple/10 to-pink-500/10 rounded-[4rem] flex items-center justify-center overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3" 
                  alt="Marketing Strategy" 
                  className="w-full h-full object-cover p-12 rounded-[5rem] transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 hidden lg:block max-w-[240px]"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Globe className="text-brand-purple w-5 h-5" />
                  <span className="font-bold text-sm">Global Reach</span>
                </div>
                <p className="text-xs text-gray-500">Expand your business footprint across geographies with localized marketing.</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Finance Section */}
      <section id="finance" className="py-24 finance-gradient relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
          <div className="grid grid-cols-12 gap-1 w-full h-full">
            {[...Array(144)].map((_, i) => (
              <div key={i} className="border border-white/20 aspect-square" />
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-brand-gold font-bold uppercase tracking-widest text-sm">Wealth Creation</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mt-4 mb-4">Financial Planning & Investments</h2>
            <div className="inline-block bg-brand-gold text-brand-navy font-bold px-6 py-2 rounded-full mt-2">
              100% FREE GUIDANCE FOREVER
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                title: 'Mutual Funds & PMS',
                desc: 'Diversified portfolios managed by experts to beat market benchmarks.',
                icon: BarChart3,
                tags: ['Equity', 'Debt', 'Hybrid']
              },
              {
                title: 'Unlisted Shares & AIF',
                desc: 'Get early access to future unicorns and premium investment vehicles.',
                icon: ShieldCheck,
                tags: ['Pre-IPO', 'High Growth']
              },
              {
                title: 'Bonds & Insurance',
                desc: 'Secure your future with fixed returns and comprehensive risk protection.',
                icon: ShieldCheck,
                tags: ['Life', 'Health', 'Stable']
              }
            ].map((service, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  y: -10,
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)"
                }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[2rem] transition-all group"
              >
                <div className="w-14 h-14 bg-brand-gold rounded-2xl flex items-center justify-center mb-6 text-brand-navy transition-transform group-hover:scale-110">
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4">{service.title}</h3>
                <p className="text-white/70 mb-6 leading-relaxed">{service.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold px-3 py-1 bg-white/10 text-white/50 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-xl border border-brand-gold/30 p-10 rounded-[3rem] text-center max-w-4xl mx-auto"
          >
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 italic">Investment doesn't have to be complicated.</h3>
            <p className="text-white/80 text-lg mb-8">
              We offer loan against mutual funds, portfolio reviews, and goal planning at absolutely zero cost. 
              Our mission is to make quality financial guidance accessible to all.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <motion.a 
                href="https://wa.me/your-number"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-brand-gold text-brand-navy px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white transition-all flex items-center shadow-xl shadow-brand-gold/20"
              >
                Get Free Investment Plan <ChevronRight className="ml-2 w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-24 bg-[#020617] relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="flex-1 order-2 lg:order-1"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-brand-cyan/20 blur-3xl opacity-50 rounded-full" />
                <img 
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2487&ixlib=rb-4.0.3" 
                  alt="AI Technology" 
                  className="relative w-full rounded-[3rem] shadow-2xl shadow-brand-cyan/10 border border-white/5"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating AI Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-10 -right-10 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 hidden xl:block"
                >
                  <Bot className="text-brand-cyan w-10 h-10 mb-2" />
                  <p className="text-white text-sm font-bold">24/7 AI Agents</p>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="flex-1 order-1 lg:order-2"
            >
              <span className="text-brand-cyan font-bold uppercase tracking-widest text-sm">Enterprise Intelligence</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mt-4 mb-6 leading-tight">AI & Tech Solutions to <span className="text-brand-cyan">Automate Your Success</span></h2>
              <p className="text-white/60 text-lg mb-8 leading-relaxed">
                Technology should work for you, not the other way around. Our AI deployments 
                handle the heavy lifting so you can focus on building your vision.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: 'Interactive AI Chatbots', desc: 'Custom trained on your business data to handle leads and support.' },
                  { title: 'Voice Agents', desc: 'Natural-sounding AI that speaks your brand voice and handles calls.' },
                  { title: 'Business Automation', desc: 'Workflow optimization that saves thousands of manual hours every year.' }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex group"
                  >
                    <div className="mr-4 mt-1">
                      <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan group-hover:bg-brand-cyan group-hover:text-black transition-all">
                        <Cpu className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-white/40 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.05, shadow: "0 0 20px rgba(34, 211, 238, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="mt-12 w-full sm:w-auto border-2 border-brand-cyan text-brand-cyan px-8 py-4 rounded-xl font-bold hover:bg-brand-cyan hover:text-black transition-all uppercase tracking-widest text-xs"
              >
                Demo Our AI Agent
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* Bilingual / Accessibility Highlight */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-display font-medium mb-6">Designed For Every Indian Business</h2>
            <p className="text-gray-500 mb-8 italic">शुद्ध हिंदी और अंग्रेजी - हम सबकी भाषा समझते हैं।</p>
            <div className="flex justify-center space-x-12 opacity-40">
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold"
              >
                English
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="text-4xl font-serif"
              >
                हिन्दी
              </motion.span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-navy pt-24 pb-12 text-white/60 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-white/10 p-1.5 rounded-lg">
                  <Logo className="w-10 h-10" />
                </div>
                <span className="text-2xl font-display font-bold text-white">Prosperity Partners</span>
              </div>
              <p className="mb-8 italic leading-relaxed font-serif text-lg text-white/80">
                Helping businesses and individuals grow through the power of Marketing, Finance, and AI.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Services</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#marketing" className="hover:text-brand-gold transition-colors">Digital Marketing</a></li>
                <li><a href="#finance" className="hover:text-brand-gold transition-colors">Investment Guidance</a></li>
                <li><a href="#finance" className="hover:text-brand-gold transition-colors">Mutual Funds & AIF</a></li>
                <li><a href="#ai" className="hover:text-brand-gold transition-colors">AI & Tech Solutions</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#testimonials" className="hover:text-brand-gold transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors">Free Consultations</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors">Free Portfolio Review</a></li>
                <li><a href="#" className="hover:text-brand-gold transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Contact Us</h4>
              <div className="space-y-6">
                <a href="https://wa.me/your-number" className="flex items-center space-x-3 text-[#25D366] hover:scale-105 transition-transform origin-left">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <span className="font-bold">WhatsApp Support</span>
                </a>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-white/40" />
                  <span>Available Mon-Sat, 10am-7pm</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium uppercase tracking-widest">
            <p>© 2024 Prosperity Partners. All rights reserved.</p>
            <div className="flex space-x-8">
              <span>Made with ❤️ in India</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Bubble */}
      <motion.a
        href="https://wa.me/your-number"
        target="_blank"
        referrerPolicy="no-referrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-8 right-8 z-[60] bg-[#25D366] text-white p-5 rounded-full shadow-2xl flex items-center group overflow-hidden"
      >
        <div className="flex items-center relative z-10">
          <MessageCircle className="w-7 h-7 fill-current" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-300 font-bold whitespace-nowrap">
            Free Consultation
          </span>
        </div>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </motion.a>
    </div>
  );
}
