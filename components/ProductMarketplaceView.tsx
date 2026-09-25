'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Star,
  Tag,
  X,
  MessageCircle,
  Video,
  Code,
  Brain,
  MessageSquare,
  Wand2,
  Volume2,
  Compass,
  Headphones,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export interface Product {
  id: string;
  name: string;
  provider: string;
  category: 'AI Models' | 'Video & Motion' | 'Developer Tools' | 'Productivity' | 'Audio & Voice';
  description: string;
  badge?: string;
  rating: number;
  reviews_count?: number;
  reviewsCount?: number;
  icon_bg?: string;
  iconBg?: string;
  icon_name?: string;
  image_url?: string | null;
  features: string[];
  popular?: boolean;
  price?: number;
}

const STATIC_PRODUCTS: Product[] = [
  {
    id: 'google-ai-one',
    name: 'Google AI One Premium',
    provider: 'Google Gemini',
    category: 'AI Models',
    description: 'Get Gemini 1.5 Pro, 2TB Google One Cloud Storage, and seamless integration in Docs & Gmail.',
    badge: 'Popular',
    popular: true,
    rating: 4.9,
    reviewsCount: 1420,
    iconBg: 'from-blue-600 to-indigo-600',
    icon_name: 'Brain',
    features: ['Gemini 1.5 Pro with 1M context', '2TB Google One Storage', 'Integration with Docs, Sheets & Gmail', 'Priority Access to Experimental Features']
  },
  {
    id: 'higgsfield-ai',
    name: 'Higgsfield AI Pro',
    provider: 'Higgsfield Inc.',
    category: 'Video & Motion',
    description: 'Create cinematic AI video animations with precise camera controls and photorealistic render quality.',
    badge: 'Trending',
    rating: 4.8,
    reviewsCount: 890,
    iconBg: 'from-rose-500 to-purple-600',
    icon_name: 'Video',
    features: ['4K Camera-controlled Video Gens', 'Anime & Photorealistic Models', 'Unlimited Image-to-Video conversion', 'Commercial Royalty-free License']
  },
  {
    id: 'zoom-pro-ai',
    name: 'Zoom Pro + AI Companion',
    provider: 'Zoom Video Communications',
    category: 'Productivity',
    description: 'Unlimited meeting duration, AI automated meeting summaries, and smart action item generation.',
    badge: 'Best Seller',
    rating: 4.7,
    reviewsCount: 3100,
    iconBg: 'from-blue-500 to-cyan-500',
    icon_name: 'Video',
    features: ['Unlimited 30-hour meeting duration', 'Automated AI Meeting Summaries', '5GB Cloud Recording Storage', 'Custom Branded Meeting Rooms']
  },
  {
    id: 'chatgpt-plus',
    name: 'ChatGPT Plus / Team',
    provider: 'OpenAI',
    category: 'AI Models',
    description: 'Access GPT-4o, DALL-E 3 image creation, Advanced Data Analysis, and custom GPT builders.',
    badge: 'Top Rated',
    popular: true,
    rating: 4.95,
    reviewsCount: 5200,
    iconBg: 'from-emerald-600 to-teal-700',
    icon_name: 'MessageSquare',
    features: ['GPT-4o & GPT-4o-mini Priority', 'DALL-E 3 High-Res Image Generation', 'Custom GPT creation & Code Interpreter', 'Browsing & File Upload Analysis']
  },
  {
    id: 'claude-pro',
    name: 'Claude Pro (Anthropic)',
    provider: 'Anthropic',
    category: 'AI Models',
    description: 'Leverage Claude 3.5 Sonnet with 200k context window, interactive code artifacts, and deep reasoning.',
    badge: 'Dev Pick',
    rating: 4.9,
    reviewsCount: 2400,
    iconBg: 'from-amber-600 to-orange-600',
    icon_name: 'Brain',
    features: ['Claude 3.5 Sonnet & Opus', '200,000 Token Context Window', 'Interactive Artifacts & Canvas', '5x More Usage vs Free Tier']
  },
  {
    id: 'cursor-pro',
    name: 'Cursor Pro AI Editor',
    provider: 'Anysphere',
    category: 'Developer Tools',
    description: 'The ultimate AI-first code editor. Instant code edits, multi-file codebase indexing, and terminal agent.',
    badge: 'Essential for Devs',
    popular: true,
    rating: 4.98,
    reviewsCount: 1850,
    iconBg: 'from-slate-800 to-slate-950',
    icon_name: 'Code',
    features: ['Unlimited Fast Copilot Auto-complete', '500 Fast GPT-4o & Sonnet Edits/mo', 'Codebase-wide Indexing & Chat', 'Terminal Command Generation']
  },
  {
    id: 'midjourney-standard',
    name: 'Midjourney Standard',
    provider: 'Midjourney Inc.',
    category: 'Video & Motion',
    description: 'State-of-the-art AI image generation. High-definition concept art, web assets, and commercial license.',
    badge: 'Creative Choice',
    rating: 4.88,
    reviewsCount: 4100,
    iconBg: 'from-indigo-700 to-purple-800',
    icon_name: 'Wand2',
    features: ['15 Fast GPU hours per month', 'Unlimited Relaxed GPU hours', 'General Commercial Terms', 'Access to Web & Discord Generator']
  },
  {
    id: 'elevenlabs-pro',
    name: 'ElevenLabs AI Voice',
    provider: 'ElevenLabs',
    category: 'Audio & Voice',
    description: 'Realistic voice cloning, text-to-speech in 29 languages, and AI audio dubbing for media projects.',
    badge: 'High Demand',
    rating: 4.85,
    reviewsCount: 1290,
    iconBg: 'from-cyan-600 to-blue-700',
    icon_name: 'Volume2',
    features: ['100,000 Text-to-Speech characters/mo', 'Instant Voice Cloning (10 voices)', 'Multi-lingual Dubbing Studio', 'Commercial Usage License']
  },
  {
    id: 'perplexity-pro',
    name: 'Perplexity Pro Research',
    provider: 'Perplexity AI',
    category: 'Productivity',
    description: 'AI-powered deep research search engine with inline academic citation and multi-modal file parsing.',
    badge: 'Research Pick',
    rating: 4.92,
    reviewsCount: 2980,
    iconBg: 'from-teal-600 to-emerald-700',
    icon_name: 'Compass',
    features: ['300+ Pro Searches per day', 'Choice of Claude 3.5, Sonar & GPT-4o', 'Unlimited File & PDF Uploads', '$5/mo API Credits Included']
  },
  {
    id: 'luma-dream-machine',
    name: 'Luma Dream Machine Pro',
    provider: 'Luma AI',
    category: 'Video & Motion',
    description: 'Next-gen 3D asset generator and realistic video synthesis for game developers and motion designers.',
    badge: 'Next-Gen',
    rating: 4.79,
    reviewsCount: 750,
    iconBg: 'from-fuchsia-600 to-pink-600',
    icon_name: 'Video',
    features: ['120 High-Priority Video Gens/mo', 'Text-to-3D Model Export (GLTF/OBJ)', 'Commercial Rendering Rights', 'Keyframe Camera Control']
  }
];

export const ProductMarketplaceView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'AI Models', 'Video & Motion', 'Developer Tools', 'Productivity', 'Audio & Voice'];

  const getLocalImageMap = (): Record<string, string> => {
    try {
      const saved = localStorage.getItem('cortexa_product_images');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  const getLocalProductsOverride = (): Product[] | null => {
    try {
      const saved = localStorage.getItem('cortexa_products_list');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const loadProducts = async () => {
    const localMap = getLocalImageMap();
    const localOverride = getLocalProductsOverride();

    const base: Product[] = localOverride && localOverride.length > 0 ? localOverride : STATIC_PRODUCTS;

    const initialMerged = base.map(p => ({
      ...p,
      image_url: localMap[p.id] || localMap[p.name] || p.image_url || null
    }));

    setProducts(initialMerged);
    setLoading(false);

    // Non-blocking background fetch from Supabase
    try {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0 && !localOverride) {
        const remoteMerged = (data as Product[]).map(p => ({
          ...p,
          image_url: localMap[p.id] || localMap[p.name] || p.image_url || null
        }));
        setProducts(remoteMerged);
      }
    } catch {
      // Fallback silently if offline or missing table
    }
  };

  useEffect(() => {
    loadProducts();

    const handleUpdate = () => loadProducts();
    window.addEventListener('cortexa_products_updated', handleUpdate);
    return () => window.removeEventListener('cortexa_products_updated', handleUpdate);
  }, []);

  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'Video': return Video;
      case 'Code': return Code;
      case 'MessageSquare': return MessageSquare;
      case 'Wand2': return Wand2;
      case 'Volume2': return Volume2;
      case 'Compass': return Compass;
      default: return Brain;
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenWhatsApp = (productName: string) => {
    const message = encodeURIComponent(`Hi! I am interested in getting access to ${productName}. Could you please guide me on how to get started?`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* Hero Store Banner */}
      <div className="relative rounded-3xl p-8 sm:p-10 overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: "url('/progress_card_bg.jpeg')" }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Tools & Software Access</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            AI & Software <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Products Catalogue</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Get instant access to top-tier AI models, video generators, developer tools, and productivity suites. Talk directly with our team on WhatsApp to get instant setup guidance and access.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-semibold">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Direct WhatsApp Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-emerald-400" />
              <span>24/7 Team Assistance</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>Verified Intern Perks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search + Category Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Google AI, Higgsfield, Zoom, ChatGPT..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100/80 hover:bg-slate-200/60 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24 bg-white rounded-3xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const IconComponent = getIconComponent(product.icon_name);
            const bgClass = product.icon_bg || product.iconBg || 'from-blue-600 to-indigo-600';
            const reviews = product.reviews_count ?? product.reviewsCount ?? 0;

            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden relative ${
                  product.popular ? 'border-emerald-500/60 ring-2 ring-emerald-500/20' : 'border-slate-200/90'
                }`}
              >
                {/* Card Content */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 rounded-2xl object-cover p-1 bg-slate-50 border border-slate-200 shrink-0 shadow-md"
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${bgClass} text-white flex items-center justify-center shadow-md shrink-0`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {product.provider}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 leading-tight">
                          {product.name}
                        </h3>
                      </div>
                    </div>

                    {product.badge && (
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide shrink-0 ${
                        product.popular 
                          ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30' 
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                    {product.description}
                  </p>

                  {/* Rating & Optional Price */}
                  <div className="flex items-center justify-between gap-1 text-amber-500 font-bold text-xs pt-2 border-t border-slate-100 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-[11px] text-slate-400 font-normal">({reviews} reviews)</span>
                    </div>

                    {product.price && product.price > 0 ? (
                      <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[10px] font-extrabold rounded-full">
                        ${product.price.toFixed(2)}/mo
                      </span>
                    ) : null}
                  </div>

                  {/* Feature Bullet points */}
                  <div className="space-y-2 bg-slate-50/70 p-3 rounded-xl border border-slate-100 text-xs">
                    {(product.features || []).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Chat on WhatsApp Action */}
                <div className="p-5 pt-3 bg-slate-50/50 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenWhatsApp(product.name)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-700" />
                    <span>Chat on WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No products found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No tools matched your search query &quot;{searchQuery}&quot;. Try clearing filters or searching for another AI tool.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
