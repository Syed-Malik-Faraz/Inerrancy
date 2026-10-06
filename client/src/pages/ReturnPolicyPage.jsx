import React, { useState } from 'react';
import { RefreshCw, Clock, PackageX, Banknote, ShieldAlert, ChevronDown, ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  {
    num: '01',
    Icon: RefreshCw,
    title: 'Returns',
    body: 'We accept returns within 7 days of delivery if:',
    bullets: [
      'The product is unused and unopened.',
      'The original packaging, box, seals, labels and accessories are intact.',
      'The product received is damaged, defective, incorrect, or materially different from what was ordered.',
    ],
    note: 'For hygiene and product-safety reasons, opened or used perfumes and fragrances cannot be returned unless the product is defective or was sent incorrectly.',
  },
  {
    num: '02',
    Icon: ShieldAlert,
    title: 'Damaged or Incorrect Orders',
    body: 'If your order arrives damaged, leaking, broken, or contains the wrong product, please contact us within 48 hours of delivery. Please provide:',
    bullets: [
      'Your order number',
      'Clear photographs of the product and packaging',
      'A photograph/video showing the condition of the package when received, where available',
    ],
    note: 'After verification, we may offer a replacement or refund, as applicable.',
  },
  {
    num: '03',
    Icon: Clock,
    title: 'Change of Mind',
    body: 'Returns due solely to a change of mind are accepted only if:',
    bullets: [
      'The product remains completely unopened, unused and sealed.',
      'The return request is made within 7 days of delivery.',
    ],
    note: 'Return shipping costs in such cases may be borne by the customer.',
  },
  {
    num: '04',
    Icon: PackageX,
    title: 'Non-Returnable Items',
    body: 'The following generally cannot be returned:',
    bullets: [
      'Opened or used perfumes',
      'Products with removed or broken seals',
      'Products damaged after delivery due to improper handling',
      'Gift cards or other non-returnable items, where applicable',
    ],
    note: 'This does not affect your rights in cases where the product is defective, deficient, spurious, incorrectly described, or otherwise covered by applicable consumer law.',
  },
  {
    num: '05',
    Icon: Banknote,
    title: 'Refunds',
    body: null,
    bullets: [
      'Once an approved return is received and inspected, we will notify you regarding the status of your refund.',
      'Approved refunds will generally be issued to the original payment method.',
      'The time taken for the amount to appear in your account may vary depending on your bank, card issuer or payment provider.',
    ],
  },
  {
    num: '06',
    Icon: RefreshCw,
    title: 'Exchanges',
    body: 'We may provide an exchange for products that are:',
    bullets: [
      'Damaged during transit',
      'Defective',
      'Incorrectly shipped',
    ],
    note: 'Exchanges are subject to product availability.',
  },
  {
    num: '07',
    Icon: PackageX,
    title: 'Return Shipping',
    body: null,
    bullets: [
      'Where the return is due to an error on our part, such as an incorrect, defective or damaged product, Inerrancy will arrange or reimburse reasonable return shipping costs, as applicable.',
      'For eligible change-of-mind returns, the applicable return shipping cost will be communicated before the return is processed.',
    ],
  },
  {
    num: '08',
    Icon: Mail,
    title: 'How to Request a Return',
    body: 'To request a return, contact us at care@inerrancy.in. Please include your order number and the reason for the return.',
    bullets: [],
    note: 'Do not send products back without receiving return instructions from our team.',
  },
  {
    num: '09',
    Icon: ShieldAlert,
    title: 'Inspection',
    body: 'All returned products are subject to inspection. If a returned item does not meet the conditions stated in this policy, the return or refund may not be approved, subject to applicable law.',
    bullets: [],
  },
  {
    num: '10',
    Icon: Clock,
    title: 'Cancellation',
    body: null,
    bullets: [
      'Orders may be cancelled before they are dispatched.',
      'Once an order has been shipped, cancellation may no longer be possible, and the applicable return procedure will apply.',
    ],
  },
];

const AccordionItem = ({ section }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gold/10 rounded-2xl overflow-hidden hover:border-gold/20 transition-all duration-500 group">
      <button
        id={`return-section-${section.num}`}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-6 p-7 text-left"
      >
        <span className="font-heading text-4xl text-gold/15 group-hover:text-gold/35 transition-colors duration-300 flex-shrink-0 leading-none w-10">
          {section.num}
        </span>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold flex-shrink-0 group-hover:bg-gold group-hover:text-black transition-all duration-300">
            <section.Icon size={15} />
          </div>
          <h3 className="font-heading text-lg lg:text-xl text-ivory tracking-wide">{section.title}</h3>
        </div>
        <ChevronDown size={16} className={`text-gold/50 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>

      <div className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-[600px]' : 'max-h-0'}`}>
        <div className="px-7 pb-8 border-t border-gold/10 pt-5 space-y-3">
          {section.body && (
            <p className="text-ivory/50 text-sm leading-relaxed font-light">{section.body}</p>
          )}
          {section.bullets && section.bullets.length > 0 && (
            <ul className="space-y-2">
              {section.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-ivory/50 text-sm leading-relaxed font-light">
                  <span className="text-gold mt-1.5 flex-shrink-0 text-xs">◆</span>
                  {b}
                </li>
              ))}
            </ul>
          )}
          {section.note && (
            <p className="text-ivory/30 text-xs leading-relaxed font-light italic border-l-2 border-gold/20 pl-4 mt-3">
              {section.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const ReturnPolicyPage = () => {
  return (
    <div className="bg-black min-h-screen pb-24">
      <div className="container">

        {/* Hero */}
        <section className="mb-20 text-center animate-fade-in">
          <span className="section-label">CUSTOMER CARE</span>
          <h1 className="font-heading text-6xl lg:text-8xl text-ivory mb-8 tracking-wide leading-tight">
            Return &amp; Refund
          </h1>
          <div className="h-px w-20 bg-gold mx-auto mb-10" />
          <p className="text-ivory/40 text-sm tracking-[3px] uppercase max-w-xl mx-auto leading-loose">
            At Inerrancy, we want every order to arrive safely and exactly as expected.
          </p>
          <p className="text-ivory/20 text-xs mt-5 tracking-[2px] uppercase">Last Updated: October 3, 2026</p>
        </section>

        {/* Key Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {[
            { label: '7-Day Return Window', sub: 'For unopened, unused products' },
            { label: '48-Hour Damage Claims', sub: 'For damaged or incorrect orders' },
            { label: 'Original Payment Refund', sub: 'Approved refunds to source method' },
          ].map((item, i) => (
            <div key={i} className="bg-black-2 border border-gold/10 rounded-2xl p-7 text-center hover:border-gold/20 transition-all duration-300">
              <p className="text-gold text-xs font-bold uppercase tracking-[2px] mb-2">{item.label}</p>
              <p className="text-ivory/40 text-xs tracking-wide">{item.sub}</p>
            </div>
          ))}
        </section>

        {/* Eligibility at a glance */}
        <section className="bg-black-2 border border-gold/10 rounded-3xl p-10 lg:p-14 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gold/4 blur-[100px] rounded-full -z-10" />
          <div className="mb-8">
            <span className="section-label">AT A GLANCE</span>
            <h2 className="section-title">What Qualifies?</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { pass: true, text: 'Product unused and unopened' },
              { pass: true, text: 'Original packaging, seals and labels intact' },
              { pass: true, text: 'Product is damaged, defective or incorrect' },
              { pass: true, text: 'Return request within 7 days of delivery' },
              { pass: false, text: 'Opened or used fragrances (unless defective)' },
              { pass: false, text: 'Products with removed or broken seals' },
              { pass: false, text: 'Products damaged after delivery by customer' },
              { pass: false, text: 'Gift cards or specified non-returnable items' },
            ].map((item, i) => (
              <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border ${item.pass ? 'border-luxury-green/15 bg-luxury-green/5' : 'border-luxury-red/15 bg-luxury-red/5'}`}>
                <span className={`text-base flex-shrink-0 mt-0.5 font-bold ${item.pass ? 'text-luxury-green' : 'text-luxury-red'}`}>
                  {item.pass ? '✓' : '✕'}
                </span>
                <p className={`text-sm leading-relaxed ${item.pass ? 'text-ivory/70' : 'text-ivory/40'}`}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Policy Sections */}
        <section className="space-y-3 mb-20">
          <div className="text-center mb-12">
            <span className="section-label">FULL POLICY</span>
            <h2 className="section-title">Return &amp; Refund Terms</h2>
            <div className="gold-divider mx-auto" />
          </div>
          {sections.map((section) => (
            <AccordionItem key={section.num} section={section} />
          ))}
        </section>

        {/* Contact */}
        <section className="bg-black-2 border border-gold/10 rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gold/3 blur-[100px] -z-10" />
          <span className="section-label">SECTION 11 · CONTACT US</span>
          <h2 className="font-heading text-3xl lg:text-4xl text-ivory mb-5 tracking-wide">Inerrancy — The Discipline of Perfection</h2>
          <p className="text-ivory/40 text-sm leading-relaxed max-w-lg mx-auto mb-8">
            For questions regarding returns, refunds or exchanges, our team is ready to assist.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="mailto:care@inerrancy.in" id="return-email-link" className="btn btn-outline inline-flex items-center gap-3">
              <Mail size={15} /> care@inerrancy.in
            </a>
            <Link to="/contact" id="return-contact-link" className="btn btn-primary">
              Contact Us <ArrowRight size={15} className="ml-1" />
            </Link>
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

export default ReturnPolicyPage;
