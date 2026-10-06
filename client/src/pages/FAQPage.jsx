import React, { useState } from 'react';
import { ChevronDown, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const allFaqs = [
  {
    cat: 'About',
    q: 'What is Inerrancy?',
    a: 'Inerrancy is a luxury fragrance house offering carefully crafted perfumes designed for distinctive and memorable experiences.',
  },
  {
    cat: 'Shipping',
    q: 'Where do you deliver?',
    a: 'We currently deliver across India. Delivery availability and estimated timelines are shown during checkout.',
  },
  {
    cat: 'Shipping',
    q: 'How long will my order take to arrive?',
    a: 'Orders are generally delivered within 3–7 business days, depending on your location. Remote and difficult-to-service locations may require additional delivery time.',
  },
  {
    cat: 'Shipping',
    q: 'How can I track my order?',
    a: 'Once your order has been shipped, you will receive a tracking link through your registered email address, phone number, or WhatsApp, where applicable.',
  },
  {
    cat: 'Orders',
    q: 'What payment methods do you accept?',
    a: 'We accept credit & debit cards, UPI, Net Banking, popular digital wallets, and Cash on Delivery where available. Available payment methods will be displayed at checkout.',
  },
  {
    cat: 'Orders',
    q: 'Is Cash on Delivery available?',
    a: 'Cash on Delivery may be available for selected locations and orders. Availability is determined at checkout.',
  },
  {
    cat: 'Orders',
    q: 'Can I cancel my order?',
    a: 'Orders can generally be cancelled before they are dispatched. Once an order has been shipped, cancellation may no longer be possible, and the applicable return process will apply.',
  },
  {
    cat: 'Returns',
    q: 'Can I return the perfume?',
    a: 'Yes, eligible unopened and unused products may be returned within the period specified in our Return & Refund Policy. Because fragrances are personal-use products, opened or used perfumes generally cannot be returned unless they are defective or were incorrectly shipped.',
  },
  {
    cat: 'Returns',
    q: 'What if I receive a damaged or incorrect product?',
    a: 'Please contact us as soon as possible after delivery with your order number and photographs of the product and packaging. After verification, we may provide a replacement or refund, as applicable.',
  },
  {
    cat: 'Returns',
    q: 'Can I exchange my perfume?',
    a: 'Exchanges may be offered for products that arrive damaged, defective, or incorrectly shipped, subject to availability.',
  },
  {
    cat: 'Returns',
    q: 'Are open perfumes refundable?',
    a: 'Generally, no. For hygiene and product-safety reasons, opened or used fragrances cannot ordinarily be returned. This does not affect your rights where the product is defective, deficient, incorrectly described, or otherwise covered by applicable consumer law.',
  },
  {
    cat: 'Returns',
    q: 'How do I request a return?',
    a: 'Contact our customer support team at care@inerrancy.in with your order number, name, reason for return, and photographs/videos where applicable. Our team will provide the next steps if your order qualifies for a return.',
  },
  {
    cat: 'Returns',
    q: 'How long do refunds take?',
    a: 'Once an approved return has been received and inspected, the refund will be initiated to the applicable original payment method. The time for the amount to appear in your account can vary depending on your bank or payment provider.',
  },
  {
    cat: 'Products',
    q: 'Do you offer samples?',
    a: 'Sample availability may vary depending on the collection and current promotions. Any available sampling options will be displayed on the relevant product page or checkout.',
  },
  {
    cat: 'Products',
    q: 'Are your perfumes original?',
    a: 'Yes. All products sold through the official Inerrancy store are supplied as authentic Inerrancy products.',
  },
  {
    cat: 'Products',
    q: 'How should I store my perfume?',
    a: 'For the best experience, keep your fragrance away from direct sunlight, away from excessive heat, in a cool and dry environment, and with the bottle properly closed when not in use.',
  },
  {
    cat: 'Products',
    q: 'How long does a perfume last?',
    a: 'Longevity depends on the fragrance, concentration, skin type, weather, application method, and other factors. Performance can vary from person to person.',
  },
  {
    cat: 'Shipping',
    q: 'Can I change my delivery address after placing an order?',
    a: 'If your order has not yet been dispatched, contact us as soon as possible and we will try to update the address. Once the order has been shipped, changes may not be possible.',
  },
  {
    cat: 'Shipping',
    q: 'What if my order says delivered but I haven\'t received it?',
    a: 'Please contact us immediately with your order number. We will investigate the delivery status with the relevant courier partner.',
  },
  {
    cat: 'About',
    q: 'How can I contact Inerrancy?',
    a: 'For questions regarding orders, products, returns, or other concerns, email us at care@inerrancy.in.',
  },
  {
    cat: 'About',
    q: 'How do I make a complaint?',
    a: 'You can contact our customer support/grievance team using the details provided on our website. Complaints must be acknowledged within 48 hours and addressed within one month under applicable rules.',
  },
];

const categories = ['All', ...Array.from(new Set(allFaqs.map((f) => f.cat)))];

const AccordionItem = ({ item, index, catSlug }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gold/10 last:border-none group">
      <button
        id={`faq-${catSlug}-${index}`}
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between py-6 text-left"
      >
        <span className="text-sm text-ivory/60 group-hover:text-ivory transition-colors duration-300 pr-6 leading-relaxed">
          {item.q}
        </span>
        <ChevronDown
          size={16}
          className={`text-gold flex-shrink-0 mt-0.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-60 pb-6' : 'max-h-0'}`}>
        <p className="text-ivory/40 text-sm leading-relaxed font-light">{item.a}</p>
      </div>
    </div>
  );
};

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = allFaqs.filter((f) => {
    const matchCat = activeCategory === 'All' || f.cat === activeCategory;
    const matchSearch =
      search.trim() === '' ||
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const grouped = filtered.reduce((acc, faq) => {
    if (!acc[faq.cat]) acc[faq.cat] = [];
    acc[faq.cat].push(faq);
    return acc;
  }, {});

  return (
    <div className="bg-black min-h-screen pb-24">
      <div className="container">

        {/* Hero */}
        <section className="mb-20 text-center animate-fade-in">
          <span className="section-label">KNOWLEDGE VAULT</span>
          <h1 className="font-heading text-6xl lg:text-8xl text-ivory mb-8 tracking-wide leading-tight">
            Frequently Asked
          </h1>
          <div className="h-px w-20 bg-gold mx-auto mb-10" />
          <p className="text-ivory/40 text-sm tracking-[3px] uppercase max-w-xl mx-auto leading-loose">
            Precision in every answer. Browse the most common questions about Inerrancy, our products, and our service.
          </p>
        </section>

        {/* Search */}
        <section className="max-w-2xl mx-auto mb-14 relative">
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gold/50" />
          <input
            id="faq-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions…"
            className="w-full bg-black-2 border border-gold/15 rounded-xl pl-12 pr-6 py-4 text-sm text-ivory placeholder-ivory/25 outline-none focus:border-gold/40 transition-all duration-300"
            style={{ boxShadow: 'none' }}
          />
        </section>

        {/* Category Tabs */}
        <section className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`faq-cat-${cat.toLowerCase()}`}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs uppercase tracking-[2px] px-6 py-2.5 rounded-full border transition-all duration-300 font-bold ${
                activeCategory === cat
                  ? 'bg-gold text-black border-gold'
                  : 'bg-transparent text-ivory/40 border-gold/15 hover:border-gold/30 hover:text-ivory/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* FAQ Groups */}
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-24">
            <p className="font-heading text-3xl text-ivory/30 italic">No results found.</p>
            <p className="text-ivory/20 text-sm mt-4 tracking-[2px] uppercase">Try a different search term or category.</p>
          </div>
        ) : (
          <section className="space-y-8 mb-24">
            {Object.entries(grouped).map(([cat, items]) => (
              <div
                key={cat}
                className="bg-black-2 border border-gold/10 rounded-3xl p-10 relative overflow-hidden hover:border-gold/18 transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/4 blur-[80px] rounded-full -z-10" />
                <h2 className="font-heading text-3xl text-ivory mb-8 tracking-wide flex items-center gap-4">
                  <span className="text-gold text-lg font-bold">—</span> {cat}
                </h2>
                {items.map((item, i) => (
                  <AccordionItem key={i} item={item} index={i} catSlug={cat.toLowerCase()} />
                ))}
              </div>
            ))}
          </section>
        )}

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { label: 'Questions Answered', value: `${allFaqs.length}+` },
            { label: 'Response Time', value: '< 24 hrs' },
            { label: 'Customer Satisfaction', value: '99%' },
            { label: 'Authentic Products', value: '100%' },
          ].map((stat, i) => (
            <div key={i} className="bg-black-2 border border-gold/10 rounded-2xl p-8 text-center hover:border-gold/20 transition-all duration-300">
              <p className="font-heading text-4xl text-gold mb-2">{stat.value}</p>
              <p className="text-ivory/30 text-xs uppercase tracking-[2px]">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="bg-black-2 border border-gold/10 rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gold/3 blur-[100px] -z-10" />
          <span className="section-label">DIDN'T FIND YOUR ANSWER?</span>
          <h2 className="font-heading text-3xl lg:text-5xl text-ivory mb-6 tracking-wide">
            Our team is at your service.
          </h2>
          <p className="text-ivory/40 text-sm leading-relaxed max-w-md mx-auto mb-8">
            Reach out to us directly and we will respond within one business day — precisely and without ambiguity.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" id="faq-contact-link" className="btn btn-primary">
              Contact Us <ArrowRight size={16} className="ml-2" />
            </Link>
            <a href="mailto:care@inerrancy.in" id="faq-email-link" className="btn btn-outline">
              care@inerrancy.in
            </a>
          </div>
          <div className="gold-divider mx-auto mt-10" />
          <p className="text-ivory/20 text-xs tracking-[3px] uppercase mt-6">
            Inerrancy · Nothing accidental. Nothing excessive. Nothing less than exact.
          </p>
        </section>

      </div>
    </div>
  );
};

export default FAQPage;
