import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, Clock, ChevronLeft, Share2 } from 'lucide-react';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import api from '../api/axios';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${slug}`);
        setBlog(res.data.blog);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) return <div className="page-loader"><div className="spinner" /></div>;
  if (!blog) return <div className="page-loader">Story not found.</div>;

  return (
    <div className="bg-black min-h-screen pb-24 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gold/5 blur-[150px] rounded-full -z-10" />

      <div className="container max-w-4xl animate-fade-in">
        
        {/* Navigation */}
        <Link to="/blog" className="inline-flex items-center gap-2 text-[10px] font-bold text-gold uppercase tracking-[4px] mb-12 hover:gap-4 transition-all group">
           <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Archives
        </Link>

        {/* Header content */}
        <header className="mb-16">
           <div className="flex items-center gap-6 mb-8 text-[11px] text-gold font-bold uppercase tracking-[4px]">
              <span className="flex items-center gap-2 px-3 py-1 bg-gold/5 rounded-full border border-gold/10">Inerrancy Editorials</span>
              <span>•</span>
              <span className="flex items-center gap-2 text-ivory/40 uppercase tracking-[2px]">{blog.readTime || '5 min'} read</span>
           </div>
           
           <h1 className="font-heading text-5xl lg:text-7xl text-ivory mb-10 leading-tight tracking-wide italic">
              {blog.title}
           </h1>
           
           <div className="flex items-center justify-between pb-10 border-b border-gold/10">
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 rounded-full bg-black-2 border border-gold/20 flex items-center justify-center text-gold font-heading text-xl">
                    I
                 </div>
                 <div>
                    <p className="text-xs font-bold text-ivory uppercase tracking-widest">Inerrancy Curators</p>
                    <p className="text-[10px] text-ivory/30 uppercase tracking-[2px] mt-1">{new Date(blog.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 {[FaFacebookF, FaTwitter, FaInstagram].map((Icon, i) => (
                   <button key={i} className="w-10 h-10 rounded-full border border-gold/10 flex items-center justify-center text-ivory/30 hover:text-gold hover:border-gold transition-all duration-300">
                      <Icon size={16} />
                   </button>
                 ))}
              </div>
           </div>
        </header>

        {/* Feature Image */}
        <div className="aspect-[21/9] mb-20 rounded-2xl overflow-hidden border border-gold/10 shadow-2xl">
           <img src={blog.image} alt={blog.title} className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700" />
        </div>

        {/* Main Content */}
        <article className="prose prose-invert max-w-none">
           <p className="text-2xl font-heading text-ivory/80 italic leading-relaxed mb-12 py-8 border-l-2 border-gold pl-12 bg-gold-muted/20">
              {blog.excerpt}
           </p>
           
           <div 
             className="text-ivory/70 text-lg leading-loose space-y-8 font-light tracking-wide first-letter:text-6xl first-letter:font-heading first-letter:text-gold first-letter:mr-3 first-letter:float-left first-letter:mt-3"
             dangerouslySetInnerHTML={{ __html: blog.content }} 
           />
        </article>

        {/* Bottom Social */}
        <div className="mt-28 py-12 border-y border-gold/10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-4">
              <Share2 className="text-gold" size={20} />
              <span className="text-[10px] text-ivory font-bold uppercase tracking-[4px]">Share this masterpiece</span>
           </div>
           <div className="flex gap-4">
              <button className="btn btn-outline btn-sm px-8">Facebook</button>
              <button className="btn btn-outline btn-sm px-8">X (Twitter)</button>
              <button className="btn btn-outline btn-sm px-8">LinkedIn</button>
           </div>
        </div>

        {/* Tags */}
        {blog.tags?.length > 0 && (
           <div className="mt-12 flex flex-wrap gap-3">
              {blog.tags.map((tag, i) => (
                <span key={i} className="px-4 py-2 bg-black-2 border border-gold/10 rounded-full text-[10px] text-gold/60 uppercase tracking-widest font-bold">
                   #{tag}
                </span>
              ))}
           </div>
        )}

      </div>
    </div>
  );
};

export default BlogDetailPage;
