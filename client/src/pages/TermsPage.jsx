import React, { useState } from 'react';
import { ScrollText, ShieldCheck, CreditCard, RefreshCw, Lock, AlertOctagon, Globe, Users, FileText, ChevronDown, Mail } from 'lucide-react';

const sections = [
  {
    num: '01',
    Icon: ScrollText,
    title: 'About Our Store',
    body: null,
    bullets: [
      'Business Name: Inerrancy (OPC) Private Limited',
      'Website: inerrancy.in',
      'Email: care@inerrancy.in',
    ],
  },
  {
    num: '02',
    Icon: Users,
    title: 'Eligibility',
    body: 'By using this website or placing an order, you confirm that:',
    bullets: [
      'You are legally capable of entering into a binding agreement under applicable Indian law.',
      'The information you provide to us is accurate and complete.',
      'You will use the website only for lawful purposes.',
    ],
    note: 'If you are purchasing on behalf of another person or organisation, you confirm that you are authorised to do so.',
  },
  {
    num: '03',
    Icon: ShieldCheck,
    title: 'Products and Product Information',
    body: 'We make reasonable efforts to ensure that product descriptions, photographs, specifications, prices, and other information are accurate. However:',
    bullets: [
      'Product colours may appear slightly different depending on your device or screen.',
      'Product dimensions and specifications may have reasonable variations where applicable.',
      'Product availability may change without notice.',
      'We reserve the right to correct errors or inaccuracies on our website.',
    ],
  },
  {
    num: '04',
    Icon: CreditCard,
    title: 'Prices and Taxes',
    body: null,
    bullets: [
      'All prices displayed on our website are in Indian Rupees (INR) unless otherwise stated.',
      'Applicable taxes, shipping charges, and other fees will be displayed during the checkout process where applicable.',
      'We reserve the right to change product prices at any time. Any price change will not affect an order that has already been accepted and confirmed, except where permitted or required by applicable law.',
    ],
  },
  {
    num: '05',
    Icon: FileText,
    title: 'Orders',
    body: 'When you place an order, you are making an offer to purchase the selected products. We reserve the right to cancel or refuse an order in circumstances such as:',
    bullets: [
      'The product being unavailable',
      'An obvious pricing or listing error',
      'Suspected fraudulent or unauthorised activity',
      'Incorrect or incomplete customer information',
      'Delivery restrictions',
      'Circumstances beyond our reasonable control',
    ],
    note: 'If we cancel an order after payment has been received, we will process an applicable refund using the original or appropriate payment method.',
  },
  {
    num: '06',
    Icon: CreditCard,
    title: 'Payment',
    body: null,
    bullets: [
      'We accept payment methods displayed at checkout.',
      'Payments may be processed through third-party payment gateways. You agree to provide accurate payment and billing information.',
      'We do not knowingly store sensitive payment credentials such as your card PIN, CVV, UPI PIN, or banking password.',
      'You must not use another person\'s payment method without authorisation.',
    ],
  },
  {
    num: '07',
    Icon: Globe,
    title: 'Shipping and Delivery',
    body: 'We deliver to locations supported by our shipping partners. Estimated delivery times may vary due to:',
    bullets: [
      'Courier delays',
      'Weather conditions',
      'Public holidays',
      'Incorrect address information',
      'Operational disruptions',
      'Events outside our reasonable control',
    ],
    note: 'You are responsible for providing a complete and accurate delivery address and contact information.',
  },
  {
    num: '08',
    Icon: RefreshCw,
    title: 'Returns, Exchanges and Refunds',
    body: 'Returns, exchanges, cancellations, and refunds are governed by our Return & Refund Policy. Products may be subject to eligibility conditions, including requirements relating to:',
    bullets: [
      'Time limits',
      'Product condition',
      'Original packaging',
      'Tags and accessories',
      'Proof of purchase',
    ],
    note: 'Nothing in these Terms limits any consumer rights available to you under applicable Indian law.',
  },
  {
    num: '09',
    Icon: FileText,
    title: 'Cancellation',
    body: null,
    bullets: [
      'You may request cancellation of an order before it has been processed or dispatched, subject to our cancellation policy.',
      'Once an order has been dispatched, cancellation may no longer be possible. In such cases, you may need to follow the applicable return procedure.',
      'If a cancellation is accepted after payment, any applicable refund will be processed in accordance with our refund policy and applicable law.',
    ],
  },
  {
    num: '10',
    Icon: ScrollText,
    title: 'Promotional Offers and Discounts',
    body: 'From time to time, we may offer discounts, promotional codes, sales, or other offers. Promotional offers may have additional terms, including:',
    bullets: [
      'Expiration dates',
      'Minimum purchase requirements',
      'Product exclusions',
      'Usage limits',
      'One-time-use restrictions',
    ],
    note: 'We reserve the right to withdraw or modify promotional offers where permitted by law.',
  },
  {
    num: '11',
    Icon: Users,
    title: 'User Accounts',
    body: 'If you create an account on our website, you are responsible for maintaining the confidentiality of your login information. You agree to:',
    bullets: [
      'Provide accurate information',
      'Keep your password confidential',
      'Notify us if you suspect unauthorised access',
      'Not use another person\'s account without permission',
    ],
    note: 'We may suspend or terminate accounts involved in fraudulent, abusive, or unlawful activity, subject to applicable law.',
  },
  {
    num: '12',
    Icon: AlertOctagon,
    title: 'Prohibited Uses',
    body: 'You agree not to:',
    bullets: [
      'Use the website for unlawful purposes',
      'Attempt to gain unauthorised access to our systems',
      'Interfere with website security or functionality',
      'Introduce viruses, malware, or harmful code',
      'Scrape or reproduce website content without permission',
      'Submit false or misleading information',
      'Engage in fraudulent transactions',
      'Abuse promotional offers',
      'Use the website to infringe the rights of others',
    ],
  },
  {
    num: '13',
    Icon: Lock,
    title: 'Intellectual Property',
    body: 'Unless otherwise stated, the website and its contents — including logos, brand names, product photographs, graphics, text, website design, software, videos, and other original materials — are owned by or licensed to Inerrancy and are protected by applicable intellectual-property laws.',
    note: 'You may not reproduce, distribute, modify, sell, or commercially exploit our content without prior written permission, except where permitted by law.',
  },
  {
    num: '14',
    Icon: FileText,
    title: 'User-Submitted Content',
    body: 'If you submit reviews, photographs, comments, feedback, or other content to our website, you represent that:',
    bullets: [
      'You have the right to submit the content.',
      'The content does not violate applicable law.',
      'The content does not infringe on another person\'s intellectual-property or privacy rights.',
      'The content is not fraudulent, abusive, defamatory, or misleading.',
    ],
    note: 'You grant us a non-exclusive right to use, reproduce, display, and publish such content for operating and promoting our business, subject to applicable law. We reserve the right to remove content that violates these Terms or applicable law.',
  },
  {
    num: '15',
    Icon: Globe,
    title: 'Third-Party Services',
    body: 'Our website may use third-party services such as payment gateways, shipping companies, analytics services, hosting providers, and customer-support services.',
    note: 'Your use of third-party services may also be subject to their respective terms and policies. We are not responsible for services or content controlled entirely by third parties, except to the extent required by applicable law.',
  },
  {
    num: '16',
    Icon: AlertOctagon,
    title: 'Limitation of Liability',
    body: 'To the extent permitted by applicable law, Inerrancy will not be responsible for indirect, incidental, special, or consequential losses arising from your use of the website or purchase of products.',
    note: 'Nothing in these Terms excludes or limits liability that cannot legally be excluded or limited under applicable Indian law. Nothing in these Terms is intended to restrict any rights or remedies available to consumers under applicable law.',
  },
  {
    num: '17',
    Icon: ShieldCheck,
    title: 'Force Majeure',
    body: 'We will not be responsible for delays or failures caused by circumstances beyond our reasonable control, including natural disasters, war, governmental actions, strikes, transport disruptions, telecommunications failures, or major technical failures.',
    note: 'Where required by applicable law, we will take reasonable steps to minimise the impact of such circumstances.',
  },
  {
    num: '18',
    Icon: ScrollText,
    title: 'Consumer Rights',
    body: 'Nothing in these Terms is intended to take away, restrict, or waive any mandatory rights or protections available to consumers under applicable Indian law.',
    note: 'Where applicable, consumers may have rights under Indian consumer-protection and e-commerce laws and regulations.',
  },
  {
    num: '19',
    Icon: Globe,
    title: 'Governing Law',
    body: 'These Terms shall be governed by the laws of India. Nothing in these Terms prevents a consumer from exercising rights or remedies available under applicable Indian consumer-protection laws.',
    note: 'Subject to applicable law, disputes relating to these Terms or purchases made through the website shall be handled by the courts or appropriate authorities having jurisdiction over the matter.',
  },
  {
    num: '20',
    Icon: FileText,
    title: 'Changes to These Terms',
    body: 'We may update these Terms from time to time to reflect changes to our business, services, technology, or applicable laws. The updated Terms will be published on this page with a revised "Last Updated" date.',
    note: 'Your continued use of the website after changes are published constitutes acceptance of the updated Terms, to the extent permitted by applicable law.',
  },
];

const SectionBlock = ({ section }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gold/10 rounded-2xl overflow-hidden hover:border-gold/20 transition-all duration-500 group">
      <button
        id={`terms-section-${section.num}`}
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
          {section.body && <p className="text-ivory/50 text-sm leading-relaxed font-light">{section.body}</p>}
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
            <p className="text-ivory/30 text-xs leading-relaxed font-light italic border-l-2 border-gold/20 pl-4 mt-2">
              {section.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const TermsPage = () => {
  return (
    <div className="bg-black min-h-screen pb-24">
      <div className="container">

        {/* Hero */}
        <section className="mb-20 text-center animate-fade-in">
          <span className="section-label">INERRANCY — THE DISCIPLINE OF PERFECTION</span>
          <h1 className="font-heading text-6xl lg:text-8xl text-ivory mb-8 tracking-wide leading-tight">
            Terms of Service
          </h1>
          <div className="h-px w-20 bg-gold mx-auto mb-10" />
          <p className="text-ivory/40 text-sm tracking-[3px] uppercase max-w-xl mx-auto leading-loose">
            These Terms of Service govern your access to and use of our website and the purchase of products through our online store.
          </p>
          <p className="text-ivory/20 text-xs mt-5 tracking-[2px] uppercase">Last Updated: [Date]</p>
        </section>

        {/* Intro */}
        <section className="bg-black-2 border border-gold/10 rounded-2xl p-10 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/4 blur-[80px] rounded-full -z-10" />
          <p className="text-ivory/50 text-sm leading-relaxed font-light">
            Welcome to Inerrancy — The Discipline of Perfection. By accessing or using our website{' '}
            <a href="https://www.inerrancy.in" className="text-gold hover:text-gold-light transition-colors">
              www.inerrancy.in
            </a>
            , you agree to these Terms. If you do not agree with any part of these Terms, please do not use our website.
          </p>
        </section>

        {/* Quick Overview */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Authentic Products', sub: 'Factory sealed originals only' },
            { label: '7-Day Returns', sub: 'Unopened & unused items' },
            { label: 'India-Governed', sub: 'Subject to Indian law' },
            { label: 'Secure Payments', sub: 'PCI-compliant gateways' },
          ].map((item, i) => (
            <div key={i} className="bg-black-2 border border-gold/10 rounded-2xl p-6 text-center hover:border-gold/20 transition-all duration-300">
              <p className="text-gold text-xs font-bold uppercase tracking-[2px] mb-2">{item.label}</p>
              <p className="text-ivory/30 text-xs tracking-wide">{item.sub}</p>
            </div>
          ))}
        </section>

        {/* Sections */}
        <section className="space-y-3 mb-20">
          <div className="text-center mb-12">
            <span className="section-label">FULL TERMS</span>
            <h2 className="section-title">Terms &amp; Conditions</h2>
            <div className="gold-divider mx-auto" />
          </div>
          {sections.map((section) => (
            <SectionBlock key={section.num} section={section} />
          ))}
        </section>

        {/* Contact */}
        <section className="bg-black-2 border border-gold/10 rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gold/3 blur-[100px] -z-10" />
          <span className="section-label">SECTION 24 · CONTACT US</span>
          <h2 className="font-heading text-3xl lg:text-4xl text-ivory mb-5 tracking-wide">
            Questions about these Terms?
          </h2>
          <p className="text-ivory/40 text-sm leading-relaxed max-w-lg mx-auto mb-8">
            For questions, complaints, order-related issues, or concerns regarding these Terms, please contact us.
          </p>
          <a
            href="mailto:care@inerrancy.in"
            id="terms-contact-link"
            className="btn btn-outline inline-flex items-center gap-3"
          >
            <Mail size={15} /> care@inerrancy.in
          </a>
          <div className="gold-divider mx-auto mt-10" />
          <p className="text-ivory/20 text-xs tracking-[3px] uppercase mt-6">
            Inerrancy · Nothing accidental. Nothing excessive. Nothing less than exact.
          </p>
        </section>

      </div>
    </div>
  );
};

export default TermsPage;
