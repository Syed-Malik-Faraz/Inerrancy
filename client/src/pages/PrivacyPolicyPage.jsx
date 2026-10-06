import React, { useState } from 'react';
import { Eye, Database, Share2, Lock, UserCheck, Shield, Globe, ChevronDown, Mail } from 'lucide-react';

const sections = [
  {
    num: '01',
    Icon: Database,
    title: 'Information We Collect',
    subsections: [
      {
        heading: 'Personal Information',
        bullets: [
          'Full name',
          'Billing and shipping address',
          'Email address',
          'Phone/mobile number',
          'Account login information, where applicable',
          'Order and purchase history',
          'Information you provide when contacting customer support',
        ],
      },
      {
        heading: 'Payment Information',
        text: 'Payments may be processed through third-party payment gateways. We generally do not store your complete debit card, credit card, UPI, or banking credentials on our servers. Payment information is handled by the relevant payment service provider in accordance with its own privacy and security policies.',
      },
      {
        heading: 'Automatically Collected Information',
        text: 'When you visit our website, certain information may be collected automatically, including:',
        bullets: ['IP address', 'Browser type and device information', 'Operating system', 'Pages visited', 'Date and time of visits', 'Referring website or source', 'Cookies and similar technologies'],
      },
    ],
  },
  {
    num: '02',
    Icon: Eye,
    title: 'How We Use Your Information',
    body: 'We may use the information collected to:',
    bullets: [
      'Process and deliver your orders',
      'Confirm and communicate about your purchases',
      'Process payments and refunds',
      'Provide customer support',
      'Manage your account',
      'Improve our website, products, and services',
      'Prevent fraud, misuse, and unauthorised activity',
      'Send transactional communications such as order confirmations and delivery updates',
      'Send promotional communications where permitted and where you have provided appropriate consent',
      'Comply with applicable laws and legal requirements',
    ],
  },
  {
    num: '03',
    Icon: Shield,
    title: 'Cookies',
    body: 'Our website may use cookies and similar technologies to improve your browsing experience. Cookies may help us:',
    bullets: [
      'Keep items in your shopping cart',
      'Remember your preferences',
      'Understand how visitors use our website',
      'Improve website performance',
      'Provide relevant marketing or analytics, where applicable',
    ],
    note: 'You may disable cookies through your browser settings. However, disabling certain cookies may affect some website functionality.',
  },
  {
    num: '04',
    Icon: Share2,
    title: 'Sharing of Information',
    body: 'We do not sell or rent your personal information. We may share necessary information with trusted third parties when required to operate our business, including:',
    bullets: [
      'Payment gateway providers',
      'Shipping and delivery partners',
      'Website hosting and technology providers',
      'Analytics and marketing service providers, where applicable',
      'Customer support providers',
      'Government authorities or law-enforcement agencies when legally required',
    ],
    note: 'We only share information that is reasonably necessary for the relevant purpose.',
  },
  {
    num: '05',
    Icon: Lock,
    title: 'Payment Security',
    body: null,
    bullets: [
      'We use third-party payment service providers to process online payments.',
      'We do not request or intentionally store your complete payment card details, PINs, passwords, or banking credentials on our servers.',
      'You should never share your OTP, PIN, CVV, password, or other confidential payment information with anyone claiming to represent Inerrancy.',
    ],
  },
  {
    num: '06',
    Icon: Lock,
    title: 'Data Security',
    body: 'We take reasonable technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, misuse, or destruction.',
    note: 'No method of transmission or electronic storage is completely secure. Therefore, while we take reasonable precautions, we cannot guarantee absolute security.',
  },
  {
    num: '07',
    Icon: Database,
    title: 'Data Retention',
    body: 'We retain personal information only for as long as reasonably necessary to:',
    bullets: [
      'Provide our products and services',
      'Complete transactions',
      'Maintain business and transaction records',
      'Resolve disputes',
      'Prevent fraud',
      'Comply with legal, tax, accounting, and regulatory obligations',
    ],
    note: 'When information is no longer required, we may securely delete or anonymise it, subject to applicable legal requirements.',
  },
  {
    num: '08',
    Icon: UserCheck,
    title: 'Your Rights and Choices',
    body: 'Depending on applicable law, you may have rights relating to your personal information, including the ability to:',
    bullets: [
      'Request access to personal information we hold about you',
      'Request correction of inaccurate information',
      'Request deletion of information where legally permitted',
      'Withdraw consent where processing is based on consent',
      'Opt out of promotional communications',
      'Raise a complaint regarding the handling of your personal information',
    ],
    note: 'To exercise an applicable privacy right, contact us using the details provided below.',
  },
  {
    num: '09',
    Icon: Eye,
    title: 'Marketing Communications',
    body: 'If you have opted to receive promotional communications, we may send you information about new products, discounts, offers, sales, promotions, and other updates.',
    note: 'You may unsubscribe from promotional emails by using the unsubscribe option provided in the communication or by contacting us. Transactional communications such as order confirmations and shipping updates may still be sent when necessary.',
  },
  {
    num: '10',
    Icon: Globe,
    title: 'Third-Party Websites',
    body: 'Our website may contain links to third-party websites, payment services, social media platforms, or other external services.',
    note: 'We are not responsible for the privacy practices or content of third-party websites. We recommend reviewing their respective privacy policies before providing personal information.',
  },
  {
    num: '11',
    Icon: Shield,
    title: "Children's Privacy",
    body: "Our website is not intended to knowingly collect personal information from children in circumstances where such collection is prohibited by applicable law.",
    note: "If you believe that a child has provided personal information to us improperly, please contact us so that we can take appropriate action.",
  },
  {
    num: '12',
    Icon: UserCheck,
    title: 'Grievance Redressal',
    body: 'If you have a concern, complaint, or question regarding your personal information or this Privacy Policy, you may contact our grievance/contact representative.',
    bullets: ['Email: care@inerrancy.in'],
    note: 'We will make reasonable efforts to address privacy-related complaints in accordance with applicable law.',
  },
  {
    num: '13',
    Icon: Database,
    title: 'Changes to This Privacy Policy',
    body: 'We may update this Privacy Policy from time to time to reflect changes in our business, technology, services, or applicable laws. Any updated version will be published on this page with a revised "Last Updated" date.',
    note: 'We encourage you to review this Privacy Policy periodically.',
  },
  {
    num: '14',
    Icon: Globe,
    title: 'Governing Law',
    body: 'This Privacy Policy shall be governed by the applicable laws of India. Any disputes shall be subject to the jurisdiction of the courts or authorities having jurisdiction under applicable Indian law.',
  },
];

const SectionBlock = ({ section }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gold/10 rounded-2xl overflow-hidden hover:border-gold/20 transition-all duration-500 group">
      <button
        id={`privacy-section-${section.num}`}
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

      <div className={`overflow-hidden transition-all duration-500 ${open ? 'max-h-[800px]' : 'max-h-0'}`}>
        <div className="px-7 pb-8 border-t border-gold/10 pt-5 space-y-4">
          {section.subsections ? (
            section.subsections.map((sub, i) => (
              <div key={i} className="bg-black-3 border border-gold/8 rounded-xl p-5">
                <h4 className="text-gold text-xs font-bold uppercase tracking-[2px] mb-3">{sub.heading}</h4>
                {sub.text && <p className="text-ivory/50 text-sm leading-relaxed font-light mb-3">{sub.text}</p>}
                {sub.bullets && (
                  <ul className="space-y-1.5">
                    {sub.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-3 text-ivory/50 text-sm leading-relaxed font-light">
                        <span className="text-gold mt-1.5 flex-shrink-0 text-xs">◆</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-black min-h-screen pb-24">
      <div className="container">

        {/* Hero */}
        <section className="mb-20 text-center animate-fade-in">
          <span className="section-label">INERRANCY — THE DISCIPLINE OF PERFECTION</span>
          <h1 className="font-heading text-6xl lg:text-8xl text-ivory mb-8 tracking-wide leading-tight">
            Privacy Policy
          </h1>
          <div className="h-px w-20 bg-gold mx-auto mb-10" />
          <p className="text-ivory/40 text-sm tracking-[3px] uppercase max-w-xl mx-auto leading-loose">
            We respect your privacy and are committed to protecting your personal information.
          </p>
          <p className="text-ivory/20 text-xs mt-5 tracking-[2px] uppercase">Last Updated: [Date]</p>
        </section>

        {/* Intro */}
        <section className="bg-black-2 border border-gold/10 rounded-2xl p-10 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/4 blur-[80px] rounded-full -z-10" />
          <p className="text-ivory/50 text-sm leading-relaxed font-light">
            This Privacy Policy explains how we collect, use, store, and protect your information when you visit or make a purchase through our website{' '}
            <a href="https://www.inerrancy.in" className="text-gold hover:text-gold-light transition-colors">
              www.inerrancy.in
            </a>
            . By using our website, you agree to the practices described in this Privacy Policy.
          </p>
        </section>

        {/* Principle Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {[
            { icon: Lock, label: 'Data Never Sold', desc: 'Your personal information is never sold or rented to any third party.' },
            { icon: Eye, label: 'Full Transparency', desc: 'We tell you exactly what we collect, why we collect it, and how long we keep it.' },
            { icon: UserCheck, label: 'Your Control', desc: 'Access, correct, or delete your data at any time — no questions asked.' },
          ].map((item, i) => (
            <div key={i} className="bg-black-2 border border-gold/10 rounded-2xl p-8 flex flex-col items-center text-center group hover:border-gold/20 transition-all duration-500">
              <div className="w-12 h-12 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold mb-5 group-hover:bg-gold group-hover:text-black transition-all duration-300">
                <item.icon size={18} />
              </div>
              <h3 className="font-heading text-xl text-ivory mb-2 tracking-wide">{item.label}</h3>
              <p className="text-ivory/40 text-sm leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Policy Sections */}
        <section className="space-y-3 mb-20">
          <div className="text-center mb-12">
            <span className="section-label">IN DETAIL</span>
            <h2 className="section-title">Our Privacy Practices</h2>
            <div className="gold-divider mx-auto" />
          </div>
          {sections.map((section) => (
            <SectionBlock key={section.num} section={section} />
          ))}
        </section>

        {/* Contact */}
        <section className="bg-black-2 border border-gold/10 rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gold/3 blur-[100px] -z-10" />
          <span className="section-label">SECTION 15 · CONTACT US</span>
          <h2 className="font-heading text-3xl lg:text-4xl text-ivory mb-5 tracking-wide">
            Questions about your privacy?
          </h2>
          <p className="text-ivory/40 text-sm leading-relaxed max-w-lg mx-auto mb-8">
            If you have any questions about this Privacy Policy or how we handle your information, please contact us.
          </p>
          <a
            href="mailto:care@inerrancy.in"
            id="privacy-contact-link"
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

export default PrivacyPolicyPage;
