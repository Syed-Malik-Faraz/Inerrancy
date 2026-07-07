import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Send, X, Star, ShoppingBag, Eye, RotateCcw, Wand2 } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const SUGGESTED_PROMPTS = [
  { icon: '🎉', text: 'Long-lasting perfume for parties below ₹1500' },
  { icon: '💼', text: 'Fresh fragrance for daily office wear' },
  { icon: '🌹', text: 'Romantic floral scent for date night under ₹2000' },
  { icon: '🌲', text: 'Woody masculine perfume for winter evenings' },
  { icon: '🎁', text: 'Floral and light gift for mom under ₹1000' },
  { icon: '👑', text: 'Strong oud-based oriental perfume for men' },
];

export default function AIRecommenderPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [filters, setFilters] = useState(null);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const handleSubmit = async (query) => {
    const q = (query || message).trim();
    if (!q) return;
    if (query) setMessage(query);
    setLoading(true);
    setResults(null);
    setError(null);
    setFilters(null);
    try {
      const res = await api.post('/ai-recommend', { message: q });
      if (res.data.success) {
        setResults(res.data.recommendations);
        setFilters(res.data.filters);
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setFilters(null);
    setError(null);
    setMessage('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const showInput = !results && !loading;

  return (
    <div className="min-h-screen bg-black pt-36 pb-28">
      <div className="container max-w-5xl mx-auto px-4">

        {/* ── Hero ── */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-px bg-gold/25" />
            <Sparkles size={16} className="text-gold" />
            <div className="w-12 h-px bg-gold/25" />
          </div>
          <p className="text-[9px] text-gold font-bold tracking-[8px] uppercase mb-5">Powered by AI</p>
          <h1 className="font-heading text-5xl lg:text-7xl text-ivory tracking-wider mb-5 leading-none">
            AI Perfume Finder
          </h1>
          <p className="text-ivory/35 text-[13px] tracking-[1px] max-w-md mx-auto leading-relaxed">
            Tell us what you're looking for in plain words — our AI will match the perfect fragrance from our collection
          </p>
        </div>

        {/* ── Search Input ── */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="border border-gold/20 bg-black-2 shadow-[0_0_60px_rgba(0,0,0,0.5)]">
            {/* Textarea */}
            <div className="relative">
              <Wand2 size={14} className="absolute top-5 left-5 text-gold/35 pointer-events-none" />
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. I need a long-lasting woody perfume for office under ₹1500…"
                rows={3}
                className="w-full bg-transparent text-ivory pl-11 pr-5 pt-5 pb-4 text-sm outline-none placeholder-ivory/20 resize-none tracking-wide leading-relaxed"
              />
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gold/10 bg-black/20">
              <span className="text-[9px] text-ivory/20 uppercase tracking-[3px] font-bold hidden sm:block">
                Enter to search
              </span>
              <div className="flex items-center gap-2 ml-auto">
                {message && (
                  <button
                    onClick={() => setMessage('')}
                    className="text-ivory/25 hover:text-ivory/50 transition-colors p-1"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  onClick={() => handleSubmit()}
                  disabled={loading || !message.trim()}
                  className="btn btn-primary py-2.5 px-7 text-[9px] tracking-[3px] font-bold flex items-center gap-2 disabled:opacity-35 disabled:cursor-not-allowed"
                >
                  {loading
                    ? <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    : <Send size={12} />}
                  {loading ? 'Finding…' : 'Find Perfumes'}
                </button>
              </div>
            </div>
          </div>

          {/* ── Suggested Prompts ── */}
          {showInput && (
            <div className="mt-10">
              <p className="text-[9px] text-ivory/25 uppercase tracking-[5px] font-bold mb-5 text-center">
                Try one of these
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTED_PROMPTS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSubmit(p.text)}
                    className="flex items-center gap-3 text-left border border-gold/10 bg-black-2/40 px-4 py-3 hover:border-gold/30 hover:bg-black-2 transition-all duration-300 group"
                  >
                    <span className="text-base shrink-0">{p.icon}</span>
                    <span className="text-[11px] text-ivory/45 group-hover:text-ivory/70 tracking-wide transition-colors leading-snug">
                      {p.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="text-center py-28">
            <div className="relative inline-flex items-center justify-center mb-7">
              <div className="w-14 h-14 border border-gold/15 border-t-gold rounded-full animate-spin" />
              <Sparkles size={16} className="text-gold absolute" />
            </div>
            <p className="text-ivory/30 text-[10px] uppercase tracking-[5px] font-bold animate-pulse">
              Curating your perfect fragrance…
            </p>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="border border-luxury-red/15 bg-luxury-red/5 px-8 py-10">
              <p className="text-ivory/50 text-sm leading-relaxed mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="text-[9px] text-gold uppercase tracking-[3px] font-bold border border-gold/20 px-6 py-2.5 hover:border-gold/40 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {results && !loading && (
          <div ref={resultsRef}>

            {/* Filter summary strip */}
            {filters && (
              <div className="mb-10">
                <div className="border border-gold/10 bg-black-2/40 px-5 py-4 flex flex-wrap gap-2 items-center justify-center">
                  <span className="text-[9px] text-gold/40 uppercase tracking-[3px] font-bold">I understood:</span>
                  {filters.category    && <FilterTag label={filters.category} />}
                  {filters.occasion    && <FilterTag label={filters.occasion} />}
                  {filters.fragranceFamily && <FilterTag label={`${filters.fragranceFamily} Fragrance`} />}
                  {filters.maxPrice    && <FilterTag label={`Under ₹${filters.maxPrice}`} />}
                  {filters.minPrice    && <FilterTag label={`From ₹${filters.minPrice}`} />}
                  {filters.longevity   && <FilterTag label={filters.longevity} />}
                  {filters.season      && <FilterTag label={filters.season} />}
                  {filters.timeOfUse   && <FilterTag label={`${filters.timeOfUse} Wear`} />}
                  {filters.premium     && <FilterTag label="Luxury" />}
                </div>
              </div>
            )}

            {results.length === 0 ? (
              /* Empty state */
              <div className="text-center py-20">
                <p className="text-[40px] mb-5">🔍</p>
                <p className="text-ivory/50 text-sm mb-2">No perfumes found matching your requirements.</p>
                <p className="text-ivory/25 text-xs mb-8">Try increasing your budget or changing the fragrance type.</p>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 border border-gold/25 text-ivory/50 hover:text-gold hover:border-gold/50 transition-all py-3 px-8 text-lg uppercase tracking-[3px] font-bold"
                >
                  <RotateCcw size={12} /> Search Again
                </button>
              </div>
            ) : (
              <>
                {/* Count label */}
                <div className="text-center mb-10">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-10 h-px bg-gold/20" />
                    <p className="text-[9px] text-gold/50 uppercase tracking-[5px] font-bold">
                      {results.length} Curated Match{results.length !== 1 ? 'es' : ''} For You
                    </p>
                    <div className="w-10 h-px bg-gold/20" />
                  </div>
                </div>

                {/* Product grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
                  {results.map((rec, i) => (
                    <AIProductCard
                      key={rec.productId?.toString() || i}
                      rec={rec}
                      rank={i + 1}
                      addToCart={addToCart}
                    />
                  ))}
                </div>

                {/* Search again */}
                <div className="text-center border-t border-gold/10 pt-10">
                  <p className="text-ivory/25 text-xs uppercase tracking-[3px] font-bold mb-5">
                    Not what you were looking for?
                  </p>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 border border-gold/20 text-ivory/40 hover:text-gold hover:border-gold/40 transition-all py-3 px-8 text-lg uppercase tracking-[3px] font-bold"
                  >
                    <RotateCcw size={12} /> Start New Search
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function FilterTag({ label }) {
  return (
    <span className="text-[9px] border border-gold/20 text-gold/70 px-3 py-1 uppercase tracking-widest font-bold">
      {label}
    </span>
  );
}

function AIProductCard({ rec, rank, addToCart }) {
  const discountPct = rec.discountPrice
    ? Math.round(((rec.price - rec.discountPrice) / rec.price) * 100)
    : 0;

  const scoreColor =
    rec.matchScore >= 85 ? 'text-gold' :
    rec.matchScore >= 65 ? 'text-ivory/70' :
    'text-ivory/40';

  return (
    <div className="group flex flex-col border border-gold/10 bg-black-2 hover:border-gold/25 transition-all duration-500 animate-fade-in">

      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-black border-b border-gold/10 shrink-0">
        <Link to={`/product/${rec.productId}`} className="block h-full">
          <img
            src={rec.images?.[0] || '/Inerrancy-logo.jpeg'}
            alt={rec.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Top badges */}
        <div className="absolute top-0 left-0 right-0 flex justify-between p-3">
          <span className="bg-gold text-black text-[9px] font-bold px-2 py-1 tracking-[2px] uppercase">
            #{rank} Pick
          </span>
          <span className={`bg-black/75 border border-white/10 text-[10px] font-bold px-2 py-1 tracking-widest ${scoreColor}`}>
            {rec.matchScore}%
          </span>
        </div>

        {/* Discount badge */}
        {discountPct > 0 && (
          <div className="absolute bottom-3 left-3 bg-luxury-red text-white text-[9px] font-bold px-2 py-1 tracking-wider uppercase">
            -{discountPct}% OFF
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">

        {/* Brand + Name */}
        <div>
          <p className="text-[9px] text-gold font-bold tracking-[4px] uppercase mb-1">{rec.brand}</p>
          <Link to={`/product/${rec.productId}`}>
            <h3 className="font-heading text-[17px] text-ivory hover:text-gold transition-colors leading-snug">
              {rec.name}
            </h3>
          </Link>
        </div>

        {/* Stars */}
        {rec.ratings > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex text-gold gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  fill={i < Math.floor(rec.ratings) ? 'currentColor' : 'transparent'}
                  className={i >= Math.floor(rec.ratings) ? 'text-white/15' : ''}
                />
              ))}
            </div>
            <span className="text-[10px] text-ivory/25">({rec.numReviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          {rec.discountPrice ? (
            <>
              <span className="text-gold font-bold text-lg">₹{rec.discountPrice}</span>
              <span className="text-ivory/25 text-xs line-through">₹{rec.price}</span>
            </>
          ) : (
            <span className="text-ivory font-bold">₹{rec.price}</span>
          )}
        </div>

        {/* Tags row */}
        <div className="flex flex-wrap gap-1.5">
          {rec.fragranceFamily && (
            <span className="text-[8px] bg-gold/5 border border-gold/15 text-gold/60 px-2 py-0.5 uppercase tracking-wider">
              {rec.fragranceFamily}
            </span>
          )}
          {rec.occasion && (
            <span className="text-[8px] bg-white/3 border border-white/8 text-ivory/40 px-2 py-0.5 uppercase tracking-wider">
              {rec.occasion}
            </span>
          )}
          {rec.category && (
            <span className="text-[8px] bg-white/3 border border-white/8 text-ivory/40 px-2 py-0.5 uppercase tracking-wider">
              {rec.category}
            </span>
          )}
        </div>

        {/* Match bar */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-[8px] text-ivory/25 uppercase tracking-[2px] font-bold">AI Match</span>
            <span className={`text-[8px] font-bold ${scoreColor}`}>{rec.matchScore}%</span>
          </div>
          <div className="h-px bg-white/8 w-full overflow-hidden">
            <div
              className="h-full bg-gold/70 transition-all duration-1000 ease-out"
              style={{ width: `${rec.matchScore}%` }}
            />
          </div>
        </div>

        {/* AI Reason */}
        <p className="text-[11px] text-ivory/40 leading-relaxed italic border-l border-gold/20 pl-3 flex-1">
          {rec.reason}
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => addToCart(rec.productId)}
            className="flex-1 bg-gold text-black py-2.5 text-[9px] font-bold uppercase tracking-[2px] hover:bg-gold-light transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag size={12} /> Add to Cart
          </button>
          <Link
            to={`/product/${rec.productId}`}
            className="border border-gold/20 text-ivory/50 hover:text-gold hover:border-gold/40 transition-all px-3 flex items-center justify-center"
          >
            <Eye size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
