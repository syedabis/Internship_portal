'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit3, X, Save, ShoppingBag, Loader2, Sparkles, Image as ImageIcon, UploadCloud } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  provider: string;
  category: string;
  description: string;
  badge: string;
  features: string[];
  icon_name: string;
  icon_bg: string;
  image_url?: string;
  popular: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
};

const CATEGORIES = ['AI Models', 'Video & Motion', 'Developer Tools', 'Productivity', 'Audio & Voice'];
const ICON_BGS = [
  'from-blue-600 to-indigo-600', 'from-rose-500 to-purple-600', 'from-blue-500 to-cyan-500',
  'from-emerald-600 to-teal-700', 'from-amber-600 to-orange-600', 'from-slate-800 to-slate-950',
  'from-indigo-700 to-purple-800', 'from-cyan-600 to-blue-700', 'from-teal-600 to-emerald-700',
  'from-fuchsia-600 to-pink-600',
];

const INITIAL_PRODUCTS = [
  {
    name: 'Google AI One Premium',
    provider: 'Google Gemini',
    category: 'AI Models',
    description: 'Get Gemini 1.5 Pro, 2TB Google One Cloud Storage, and seamless integration in Docs & Gmail.',
    badge: 'Popular',
    popular: true,
    rating: 4.9,
    reviews_count: 1420,
    icon_bg: 'from-blue-600 to-indigo-600',
    icon_name: 'Brain',
    features: ['Gemini 1.5 Pro with 1M context', '2TB Google One Storage', 'Integration with Docs, Sheets & Gmail', 'Priority Access to Experimental Features']
  },
  {
    name: 'Higgsfield AI Pro',
    provider: 'Higgsfield Inc.',
    category: 'Video & Motion',
    description: 'Create cinematic AI video animations with precise camera controls and photorealistic render quality.',
    badge: 'Trending',
    rating: 4.8,
    reviews_count: 890,
    icon_bg: 'from-rose-500 to-purple-600',
    icon_name: 'Video',
    features: ['4K Camera-controlled Video Gens', 'Anime & Photorealistic Models', 'Unlimited Image-to-Video conversion', 'Commercial Royalty-free License']
  },
  {
    name: 'Zoom Pro + AI Companion',
    provider: 'Zoom Video Communications',
    category: 'Productivity',
    description: 'Unlimited meeting duration, AI automated meeting summaries, and smart action item generation.',
    badge: 'Best Seller',
    rating: 4.7,
    reviews_count: 3100,
    icon_bg: 'from-blue-500 to-cyan-500',
    icon_name: 'Video',
    features: ['Unlimited 30-hour meeting duration', 'Automated AI Meeting Summaries', '5GB Cloud Recording Storage', 'Custom Branded Meeting Rooms']
  },
  {
    name: 'ChatGPT Plus / Team',
    provider: 'OpenAI',
    category: 'AI Models',
    description: 'Access GPT-4o, DALL-E 3 image creation, Advanced Data Analysis, and custom GPT builders.',
    badge: 'Top Rated',
    popular: true,
    rating: 4.95,
    reviews_count: 5200,
    icon_bg: 'from-emerald-600 to-teal-700',
    icon_name: 'MessageSquare',
    features: ['GPT-4o & GPT-4o-mini Priority', 'DALL-E 3 High-Res Image Generation', 'Custom GPT creation & Code Interpreter', 'Browsing & File Upload Analysis']
  },
  {
    name: 'Claude Pro (Anthropic)',
    provider: 'Anthropic',
    category: 'AI Models',
    description: 'Leverage Claude 3.5 Sonnet with 200k context window, interactive code artifacts, and deep reasoning.',
    badge: 'Dev Pick',
    rating: 4.9,
    reviews_count: 2400,
    icon_bg: 'from-amber-600 to-orange-600',
    icon_name: 'Brain',
    features: ['Claude 3.5 Sonnet & Opus', '200,000 Token Context Window', 'Interactive Artifacts & Canvas', '5x More Usage vs Free Tier']
  },
  {
    name: 'Cursor Pro AI Editor',
    provider: 'Anysphere',
    category: 'Developer Tools',
    description: 'The ultimate AI-first code editor. Instant code edits, multi-file codebase indexing, and terminal agent.',
    badge: 'Essential for Devs',
    popular: true,
    rating: 4.98,
    reviews_count: 1850,
    icon_bg: 'from-slate-800 to-slate-950',
    icon_name: 'Code',
    features: ['Unlimited Fast Copilot Auto-complete', '500 Fast GPT-4o & Sonnet Edits/mo', 'Codebase-wide Indexing & Chat', 'Terminal Command Generation']
  },
  {
    name: 'Midjourney Standard',
    provider: 'Midjourney Inc.',
    category: 'Video & Motion',
    description: 'State-of-the-art AI image generation. High-definition concept art, web assets, and commercial license.',
    badge: 'Creative Choice',
    rating: 4.88,
    reviews_count: 4100,
    icon_bg: 'from-indigo-700 to-purple-800',
    icon_name: 'Wand2',
    features: ['15 Fast GPU hours per month', 'Unlimited Relaxed GPU hours', 'General Commercial Terms', 'Access to Web & Discord Generator']
  },
  {
    name: 'ElevenLabs AI Voice',
    provider: 'ElevenLabs',
    category: 'Audio & Voice',
    description: 'Realistic voice cloning, text-to-speech in 29 languages, and AI audio dubbing for media projects.',
    badge: 'High Demand',
    rating: 4.85,
    reviews_count: 1290,
    icon_bg: 'from-cyan-600 to-blue-700',
    icon_name: 'Volume2',
    features: ['100,000 Text-to-Speech characters/mo', 'Instant Voice Cloning (10 voices)', 'Multi-lingual Dubbing Studio', 'Commercial Usage License']
  },
  {
    name: 'Perplexity Pro Research',
    provider: 'Perplexity AI',
    category: 'Productivity',
    description: 'AI-powered deep research search engine with inline academic citation and multi-modal file parsing.',
    badge: 'Research Pick',
    rating: 4.92,
    reviews_count: 2980,
    icon_bg: 'from-teal-600 to-emerald-700',
    icon_name: 'Compass',
    features: ['300+ Pro Searches per day', 'Choice of Claude 3.5, Sonar & GPT-4o', 'Unlimited File & PDF Uploads', '$5/mo API Credits Included']
  },
  {
    name: 'Luma Dream Machine Pro',
    provider: 'Luma AI',
    category: 'Video & Motion',
    description: 'Next-gen 3D asset generator and realistic video synthesis for game developers and motion designers.',
    badge: 'Next-Gen',
    rating: 4.79,
    reviews_count: 750,
    icon_bg: 'from-fuchsia-600 to-pink-600',
    icon_name: 'Video',
    features: ['120 High-Priority Video Gens/mo', 'Text-to-3D Model Export (GLTF/OBJ)', 'Commercial Rendering Rights', 'Keyframe Camera Control']
  }
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [category, setCategory] = useState('AI Models');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [iconName, setIconName] = useState('Brain');
  const [iconBg, setIconBg] = useState(ICON_BGS[0]);
  const [imageUrl, setImageUrl] = useState('');
  const [popular, setPopular] = useState(false);
  const [rating, setRating] = useState('4.5');
  const [reviewsCount, setReviewsCount] = useState('0');

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    
    if (data && data.length > 0) {
      setProducts(data);
    } else {
      // Auto seed initial products into Supabase so every product has a real UUID
      const { data: seededData } = await supabase.from('products').insert(INITIAL_PRODUCTS).select();
      if (seededData && seededData.length > 0) {
        setProducts(seededData);
      } else {
        const { data: reFetch } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        setProducts(reFetch || []);
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setName(''); setProvider(''); setCategory('AI Models'); setDescription('');
    setBadge(''); setFeaturesText(''); setIconName('Brain'); setIconBg(ICON_BGS[0]);
    setImageUrl(''); setPopular(false); setRating('4.5'); setReviewsCount('0');
    setEditingId(null); setShowForm(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawResult = event.target?.result as string;
      if (!rawResult) return;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/png', 0.9);
          setImageUrl(compressedBase64);
        } else {
          setImageUrl(rawResult);
        }
      };
      img.onerror = () => setImageUrl(rawResult);
      img.src = rawResult;
    };
    reader.readAsDataURL(file);
    // Reset file input value so re-selecting triggers onChange
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!name.trim() || !provider.trim()) return;
    setSaving(true);

    const features = featuresText.split('\n').map(f => f.trim()).filter(Boolean);
    const payload = {
      name: name.trim(),
      provider: provider.trim(),
      category,
      description: description.trim(),
      badge: badge.trim(),
      features,
      icon_name: iconName,
      icon_bg: iconBg,
      image_url: imageUrl.trim() || null,
      popular,
      rating: parseFloat(rating) || 4.5,
      reviews_count: parseInt(reviewsCount) || 0,
    };

    let success = false;

    if (editingId) {
      // 1. Try updating by ID
      const { data, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', editingId)
        .select();

      if (!error && data && data.length > 0) {
        success = true;
      } else {
        // 2. Try updating by Name (in case ID didn't match UUID in DB)
        const { data: nameData } = await supabase
          .from('products')
          .update(payload)
          .eq('name', name.trim())
          .select();

        if (nameData && nameData.length > 0) {
          success = true;
        } else {
          // 3. Insert as new record if neither ID nor Name matched
          const { error: insertErr } = await supabase.from('products').insert([payload]);
          if (!insertErr) success = true;
          else alert('Error updating product: ' + insertErr.message);
        }
      }
    } else {
      const { error: insertErr } = await supabase.from('products').insert([payload]);
      if (!insertErr) success = true;
      else alert('Error adding product: ' + insertErr.message);
    }

    setSaving(false);
    if (success) {
      resetForm();
      await fetchProducts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setProvider(p.provider);
    setCategory(p.category);
    setDescription(p.description);
    setBadge(p.badge || '');
    setFeaturesText(Array.isArray(p.features) ? p.features.join('\n') : '');
    setIconName(p.icon_name || 'Brain');
    setIconBg(p.icon_bg || ICON_BGS[0]);
    setImageUrl(p.image_url || '');
    setPopular(p.popular);
    setRating(String(p.rating));
    setReviewsCount(String(p.reviews_count || 0));
    setShowForm(true);
  };

  return (
    <div className="space-y-6 pb-16 font-sans max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-700 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Products & Perks Catalogue</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage AI tools, software subscriptions, product images, and developer perks.</p>
          </div>
        </div>

        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Form Card */}
      {showForm && (
        <div className="bg-white border border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-4 ring-2 ring-emerald-500/10">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{editingId ? 'Edit Product' : 'Add New Product'}</span>
            </h3>
            <button onClick={resetForm} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product Name (e.g. Google AI One Premium)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />
            <input
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="Provider (e.g. Google Gemini)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Upload Image Section */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Product Logo / Image
            </label>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4 text-emerald-600" />
                <span>Upload Image File</span>
              </button>

              {/* Or URL input */}
              <div className="relative flex-1">
                <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or paste image URL (e.g. https://.../logo.png)"
                  className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                />
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Image Preview */}
              {imageUrl ? (
                <div className="flex items-center gap-2 shrink-0 bg-emerald-50/50 p-1.5 rounded-xl border border-emerald-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-8 h-8 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shadow-xs"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  <span className="text-[10px] text-emerald-700 font-extrabold pr-1">Image Set</span>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 text-[10px] font-bold">
                  No Image
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Badge (e.g. Popular, Trending)"
              className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            />

            <div className="flex items-center gap-2">
              <input
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Rating"
                type="number"
                step="0.01"
                min="0"
                max="5"
                className="w-1/2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <input
                value={reviewsCount}
                onChange={(e) => setReviewsCount(e.target.value)}
                placeholder="Reviews"
                type="number"
                className="w-1/2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product description summary..."
            rows={2}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-normal text-slate-800 focus:outline-none focus:border-emerald-500"
          />

          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">
              Features (one bullet per line)
            </label>
            <textarea
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="Gemini 1.5 Pro with 1M context&#10;2TB Google One Storage&#10;Integration with Docs & Gmail"
              rows={3}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={popular}
                onChange={(e) => setPopular(e.target.checked)}
                className="accent-emerald-600 rounded"
              />
              <span>Highlight card as Popular</span>
            </label>

            <button
              onClick={handleSave}
              disabled={saving || !name.trim() || !provider.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{editingId ? 'Update Product' : 'Add Product'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Product List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex justify-center items-center">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          No products listed yet. Click "Add Product" to add your first catalogue tool.
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between gap-4 group hover:border-emerald-500/40 transition-all"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-12 h-12 rounded-2xl object-cover p-1 bg-slate-50 border border-slate-200 shrink-0 shadow-xs"
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.icon_bg} flex items-center justify-center text-white shrink-0 shadow-xs`}>
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                )}
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{p.name}</h3>
                    {p.popular && (
                      <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold rounded-full">
                        POPULAR
                      </span>
                    )}
                    {p.badge && (
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-full">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {p.provider} · <span className="font-semibold text-slate-700">{p.category}</span> · ★ {p.rating} ({p.reviews_count} reviews)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(p)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
