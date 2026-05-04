import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen, Clock } from 'lucide-react';
import api from '../api/axios';

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        setBlogs(res.data.blogs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;

  return (
    <div className="bg-black min-h-screen pb-24">
      <div className="container">
        
        {/* Header */}
        <div className="text-center mb-24 animate-fade-in">
           <span className="section-label">OLFACTORY ARCHIVES</span>
           <h1 className="font-heading text-5xl lg:text-7xl text-ivory mb-6 tracking-wide">The Scent Stories</h1>
           <div className="gold-divider mx-auto" />
           <p className="text-ivory/60 text-lg lg:text-xl font-light max-w-2xl mx-auto italic leading-relaxed font-heading">
             "Notes on history, mastery, and the art of fine fragrance."
           </p>
        </div>

        {blogs.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-gold/10 rounded-2xl bg-black-2">
             <BookOpen className="mx-auto text-gold/10 mb-6" size={48} />
             <p className="text-ivory/40 uppercase tracking-widest text-xs font-bold">The archives are currently being curated</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {blogs.map((blog) => (
              <article key={blog._id} className="group flex flex-col h-full bg-black-2 border border-gold/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-gold/30 hover:shadow-gold animate-fade-up">
                 <Link to={`/blog/${blog.slug}`} className="relative aspect-video overflow-hidden block">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-6 flex items-center gap-4 text-[10px] text-gold font-bold uppercase tracking-[2px]">
                       <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime || '5 min'} read</span>
                    </div>
                 </Link>
                 
                 <div className="p-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-6 mb-6 text-[10px] text-ivory/30 uppercase tracking-[3px] font-bold">
                       <span className="flex items-center gap-2"><Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                       <span className="flex items-center gap-2"><User size={12} /> Inerrancy Curators</span>
                    </div>
                    
                    <Link to={`/blog/${blog.slug}`}>
                       <h3 className="font-heading text-2xl lg:text-3xl text-ivory group-hover:text-gold transition-colors mb-6 leading-tight tracking-wide">
                          {blog.title}
                       </h3>
                    </Link>
                    
                    <p className="text-ivory/40 text-[13px] leading-relaxed mb-10 line-clamp-3 uppercase tracking-wider">
                       {blog.excerpt}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-gold/5">
                       <Link to={`/blog/${blog.slug}`} className="flex items-center gap-3 text-[10px] font-bold text-gold uppercase tracking-[4px] hover:gap-6 transition-all duration-300">
                          Commence Reading <ArrowRight size={16} />
                       </Link>
                    </div>
                 </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogListPage;
