import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Filter, ChevronDown, X, SlidersHorizontal, Grid, List } from 'lucide-react';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [brands, setBrands] = useState([]);

  // Filter states
  const page = parseInt(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || '-createdAt';
  const brandFilter = searchParams.get('brand') || '';
  const categoryFilter = searchParams.get('category') || '';
  const fragranceFilter = searchParams.get('fragranceFamily') || '';
  const occasionFilter = searchParams.get('occasion') || '';
  const collectionFilter = searchParams.get('collection') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(searchParams).toString();
      const res = await api.get(`/products?${query}&limit=12`);
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchBrands = async () => {
    try {
      const res = await api.get('/products/brands');
      setBrands(res.data.brands);
    } catch {}
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchBrands();
    window.addEventListener('brands-updated', fetchBrands);
    return () => window.removeEventListener('brands-updated', fetchBrands);
  }, []);

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', 1);
    if (!value) {
      params.delete(key);
    } else {
      const current = params.get(key) || '';
      const parts = current ? current.split(',') : [];
      if (parts.includes(value)) {
        const filtered = parts.filter(p => p !== value);
        if (filtered.length) params.set(key, filtered.join(','));
        else params.delete(key);
      } else {
        parts.push(value);
        params.set(key, parts.join(','));
      }
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setMobileFilterOpen(false);
  };

  const categories = ['Men', 'Women', 'Unisex'];
  const fragranceFamilies = ['Sweet', 'Fresh', 'Woody', 'Spicy', 'Floral', 'Fruity', 'Citrus', 'Oriental', 'Aqua'];
  const occasions = ['Party & Evening', 'Date Night', 'Daily Wear', 'Summer Fresh', 'Winter Warmth', 'Office Wear'];
  const collections = ['Best Sellers', 'New Arrivals', 'Gift Sets', 'Luxury', 'Viral Hits'];

  const FilterSection = ({ title, items, paramKey, currentValues }) => (
    <div className="mb-10 animate-fade-in">
      <h3 className="text-[10px] font-bold tracking-[3px] text-gold uppercase mb-6 border-b border-gold/10 pb-2">{title}</h3>
      <div className="flex flex-col gap-3">
        {items.map(item => {
          const isActive = currentValues.split(',').includes(item);
          return (
            <label key={item} className="flex items-center gap-3 group cursor-pointer">
              <div 
                onClick={() => handleFilterChange(paramKey, item)}
                className={`w-4 h-4 border transition-all duration-300 flex items-center justify-center ${isActive ? 'bg-gold border-gold' : 'border-gold/30 group-hover:border-gold/60'}`}
              >
                {isActive && <div className="w-1.5 h-1.5 bg-black" />}
              </div>
              <span className={`text-xs tracking-wider transition-colors ${isActive ? 'text-gold font-semibold' : 'text-ivory/60 hover:text-gold'}`}>
                {item}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <div className="container py-12 border-b border-gold/10 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 text-[10px] tracking-widest text-ivory/30 uppercase mb-4">
              <Link to="/" className="hover:text-gold transition-colors text-ivory/50">Home</Link>
              <span>/</span>
              <span className="text-gold">Collections</span>
            </nav>
            <h1 className="font-heading text-4xl lg:text-5xl text-ivory">Luxury Collection</h1>
            <p className="text-ivory/40 text-xs tracking-wider uppercase mt-4">{total} Masterpieces Found</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <select 
                value={sort}
                onChange={(e) => {
                  const p = new URLSearchParams(searchParams);
                  p.set('sort', e.target.value);
                  setSearchParams(p);
                }}
                className="bg-black-2 border border-gold/20 px-6 py-3 text-[10px] tracking-widest uppercase font-bold text-gold outline-none cursor-pointer hover:border-gold transition-all appearance-none pr-10"
              >
                <option value="-createdAt">Newest First</option>
                <option value="price">Price: Low-High</option>
                <option value="-price">Price: High-Low</option>
                <option value="-ratings">Highest Rated</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gold pointer-events-none" />
            </div>
            <button 
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden btn btn-ghost px-4 py-3"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="container pb-20">
        <div className="flex gap-12">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-32">
              <div className="flex justify-between items-center mb-10">
                <h2 className="font-heading text-2xl text-ivory">Filters</h2>
                {searchParams.toString() && (
                  <button onClick={clearFilters} className="text-[10px] text-gold hover:underline tracking-widest uppercase">Clear All</button>
                )}
              </div>
              
              <FilterSection title="Brands" items={brands} paramKey="brand" currentValues={brandFilter} />
              <FilterSection title="Category" items={categories} paramKey="category" currentValues={categoryFilter} />
              <FilterSection title="Family" items={fragranceFamilies} paramKey="fragranceFamily" currentValues={fragranceFilter} />
              <FilterSection title="Occasion" items={occasions} paramKey="occasion" currentValues={occasionFilter} />
              <FilterSection title="Collection" items={collections} paramKey="collection" currentValues={collectionFilter} />
            </div>
          </aside>

          {/* Product Grid */}
          <main className="grow">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="aspect-[3/4] skeleton" />
                    <div className="h-6 skeleton w-3/4 mx-auto" />
                    <div className="h-4 skeleton w-1/2 mx-auto" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <div className="w-20 h-20 rounded-full border border-gold/10 flex items-center justify-center mb-8">
                  <X className="text-gold/20" size={32} />
                </div>
                <h3 className="font-heading text-3xl text-ivory mb-4">No Scent Found</h3>
                <p className="text-ivory/40 max-w-sm mb-10">We couldn't find any products matching your current filters. Try adjusting your selection.</p>
                <button onClick={clearFilters} className="btn btn-primary">Clear all filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="mt-20 flex justify-center items-center gap-4">
                    <button 
                      disabled={page === 1}
                      onClick={() => {
                        const p = new URLSearchParams(searchParams);
                        p.set('page', page - 1);
                        setSearchParams(p);
                        window.scrollTo(0, 0);
                      }}
                      className="w-10 h-10 border border-gold/20 flex items-center justify-center hover:bg-gold hover:text-black transition-all disabled:opacity-20"
                    >
                      <ChevronDown className="rotate-90" size={16} />
                    </button>
                    <div className="flex gap-2">
                      {[...Array(pages)].map((_, i) => (
                        <button 
                          key={i}
                          onClick={() => {
                            const p = new URLSearchParams(searchParams);
                            p.set('page', i + 1);
                            setSearchParams(p);
                            window.scrollTo(0, 0);
                          }}
                          className={`w-10 h-10 border text-[11px] font-bold tracking-widest ${page === i + 1 ? 'border-gold bg-gold text-black' : 'border-gold/20 text-ivory'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button 
                      disabled={page === pages}
                      onClick={() => {
                        const p = new URLSearchParams(searchParams);
                        p.set('page', page + 1);
                        setSearchParams(p);
                        window.scrollTo(0, 0);
                      }}
                      className="w-10 h-10 border border-gold/20 flex items-center justify-center hover:bg-gold hover:text-black transition-all disabled:opacity-20"
                    >
                      <ChevronDown className="-rotate-90" size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[1001] bg-black overflow-y-auto pt-24 px-6 animate-fade-in">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-heading text-3xl text-gold">Filters</h2>
            <button onClick={() => setMobileFilterOpen(false)} className="text-ivory p-2"><X size={24} /></button>
          </div>
          
          <FilterSection title="Brands" items={brands} paramKey="brand" currentValues={brandFilter} />
          <FilterSection title="Category" items={categories} paramKey="category" currentValues={categoryFilter} />
          <FilterSection title="Family" items={fragranceFamilies} paramKey="fragranceFamily" currentValues={fragranceFilter} />
          <FilterSection title="Occasion" items={occasions} paramKey="occasion" currentValues={occasionFilter} />
          <FilterSection title="Collection" items={collections} paramKey="collection" currentValues={collectionFilter} />

          <div className="sticky bottom-0 left-0 right-0 py-6 bg-black border-t border-gold/10 mt-10">
            <button onClick={() => setMobileFilterOpen(false)} className="w-full btn btn-primary">View {total} results</button>
            <button onClick={clearFilters} className="w-full mt-4 text-[10px] tracking-[2px] uppercase text-ivory/40">Clear All</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
