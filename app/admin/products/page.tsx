'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Edit3, X, Save, ShoppingBag, Loader2, Star } from 'lucide-react';

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
  popular: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
};

const CATEGORIES = ['AI Models', 'Video & Motion', 'Developer Tools', 'Productivity', 'Audio & Voice'];
const ICONS = ['Brain', 'Video', 'Code', 'MessageSquare', 'Wand2', 'Volume2', 'Compass'];
const ICON_BGS = [
  'from-blue-600 to-indigo-600', 'from-rose-500 to-purple-600', 'from-blue-500 to-cyan-500',
  'from-emerald-600 to-teal-700', 'from-amber-600 to-orange-600', 'from-slate-800 to-slate-950',
  'from-indigo-700 to-purple-800', 'from-cyan-600 to-blue-700', 'from-teal-600 to-emerald-700',
  'from-fuchsia-600 to-pink-600',
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [category, setCategory] = useState('AI Models');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [iconName, setIconName] = useState('Brain');
  const [iconBg, setIconBg] = useState(ICON_BGS[0]);
  const [popular, setPopular] = useState(false);
  const [rating, setRating] = useState('4.5');
  const [reviewsCount, setReviewsCount] = useState('0');

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setName(''); setProvider(''); setCategory('AI Models'); setDescription('');
    setBadge(''); setFeaturesText(''); setIconName('Brain'); setIconBg(ICON_BGS[0]);
    setPopular(false); setRating('4.5'); setReviewsCount('0');
    setEditingId(null); setShowForm(false);
  };

  const handleSave = async () => {
    if (!name.trim() || !provider.trim()) return;
    setSaving(true);

    const features = featuresText.split('\n').map(f => f.trim()).filter(Boolean);
    const payload = {
      name, provider, category, description, badge, features,
      icon_name: iconName, icon_bg: iconBg, popular,
      rating: parseFloat(rating) || 4.5,
      reviews_count: parseInt(reviewsCount) || 0,
    };

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId);
    } else {
      await supabase.from('products').insert(payload);
    }

    setSaving(false);
    resetForm();
    fetchProducts();
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
    setPopular(p.popular);
    setRating(String(p.rating));
    setReviewsCount(String(p.reviews_count));
    setShowForm(true);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-400" />
            Products & Perks
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage the AI tools catalogue shown to interns</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name"
              className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
            <input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="Provider (e.g., Google Gemini)"
              className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="Badge (e.g., Popular, Trending)"
              className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
            <div className="flex items-center gap-4">
              <input value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating" type="number" step="0.01" min="0" max="5"
                className="flex-1 p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
              <input value={reviewsCount} onChange={(e) => setReviewsCount(e.target.value)} placeholder="Reviews" type="number"
                className="flex-1 p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />
            </div>
          </div>

          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..." rows={2}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" />

          <div>
            <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 block">Features (one per line)</label>
            <textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" rows={4}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={iconName} onChange={(e) => setIconName(e.target.value)}
              className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500">
              {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            <select value={iconBg} onChange={(e) => setIconBg(e.target.value)}
              className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500">
              {ICON_BGS.map(bg => <option key={bg} value={bg}>{bg.replace(/from-|to-/g, '').replace(/-\d+/g, '')}</option>)}
            </select>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-3">
              <input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)} className="accent-emerald-500" />
              Mark as Popular
            </label>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving || !name.trim() || !provider.trim()}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </div>
      )}

      {/* Product List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-emerald-400 animate-spin" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-slate-500 text-sm">No products yet.</div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 flex items-center justify-between gap-4 group hover:border-slate-600 transition-all">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.icon_bg} flex items-center justify-center shrink-0`}>
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white text-sm truncate">{p.name}</h3>
                    {p.popular && <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded">POPULAR</span>}
                    {p.badge && <span className="px-1.5 py-0.5 bg-slate-700 text-slate-300 text-[10px] font-bold rounded">{p.badge}</span>}
                  </div>
                  <p className="text-[11px] text-slate-500">{p.provider} · {p.category} · ★ {p.rating}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(p)} className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-colors" title="Edit">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
