import React, { useState } from 'react';
import { Cookie, BarChart2, Settings, Target, ShieldCheck, Clock, Globe, ChevronDown, Mail } from 'lucide-react';

const sections = [
  {
    num: '01',
    Icon: Cookie,
    title: 'What Are Cookies?',
    body: 'Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit and provide essential functionality.',
    note: 'We may also use similar technologies such as pixels, tags, local storage, and analytics technologies.',
  },
  {
    num: '02',
    Icon: Settings,
    title: 'Why We Use Cookies',
    subsections: [
      {
        heading: 'Essential Cookies',
        text: 'These cookies are necessary for our website to function properly. They may be used to:',
        bullets: [
          'Keep products in your shopping cart',
          'Maintain your session',
          'Process checkout',
          'Remember essential preferences',
          'Protect against fraudulent activity',
          'Maintain website security',
        ],
        note: 'These cookies may be necessary for you to use certain features of our website.',
      },
      {
        heading: 'Functional Cookies',
        text: 'These cookies help us remember choices you make, such as language preferences, region, previously selected settings, and other website preferences.',
      },
      {
        heading: 'Analytics Cookies',
        text: 'We may use analytics technologies to understand how visitors use our website. This may include information such as pages visited, time spent on pages, device and browser information, general website usage patterns, and traffic sources. This helps us improve our website and shopping experience.',
      },
      {
        heading: 'Marketing Cookies',
        text: 'Where applicable and permitted, we may use cookies and similar technologies to measure advertising performance, understand interactions with advertisements, show more relevant promotional content, and measure conversions. Marketing cookies may be provided by third-party advertising or analytics services.',
      },
    ],
  },
  {
    num: '03',
    Icon: Globe,
    title: 'Third-Party Cookies',
    body: 'Some cookies may be placed by third-party services that we use to operate our website. These may include providers involved in:',
    bullets: [
      'Payment processing',
      'Analytics',
      'Advertising',
      'Social-media functionality',
      'Website security',
      'Customer support',
    ],
    note: 'Third parties may process information collected through these technologies according to their own privacy policies.',
  },
  {
    num: '04',
    Icon: Settings,
    title: 'Your Cookie Choices',
    body: 'When applicable, you can manage non-essential cookies through our cookie-consent settings. You may also control or delete cookies through your web browser.',
    note: 'Please note that disabling certain cookies may affect website functionality. For example, some features of the shopping cart or checkout may not work correctly without essential cookies.',
  },
  {
    num: '05',
    Icon: ShieldCheck,
    title: 'Cookie Consent',
    body: 'Where required by applicable law, we will request your consent before using non-essential cookies or similar technologies. You can change or withdraw your cookie preferences where the relevant controls are available on our website.',
    note: 'Withdrawing consent does not affect the lawfulness of processing that occurred before your withdrawal.',
  },
  {
    num: '06',
    Icon: ShieldCheck,
    title: 'Personal Information',
    body: 'Some cookies may collect information that can be associated with you or your device. Our use of information collected through cookies is also governed by our Privacy Policy.',
    note: 'We take reasonable measures to protect information collected through our website.',
  },
  {
    num: '07',
    Icon: Clock,
    title: 'How Long Cookies Stay on Your Device',
    subsections: [
      {
        heading: 'Session Cookies',
        text: 'These are generally deleted when you close your browser.',
      },
      {
        heading: 'Persistent Cookies',
        text: 'These remain on your device for a specified period or until you delete them.',
      },
    ],
    note: 'The exact duration depends on the purpose of the cookie and the service that places it.',
  },
  {
    num: '08',
    Icon: Cookie,
    title: 'Changes to This Cookie Policy',
    body: 'We may update this Cookie Policy from time to time to reflect changes in our website, technologies, services, or applicable laws.',
    note: 'Any updated version will be published on this page with a revised "Last Updated" date.',
  },
];

const cookieTypes = [
  // {
  //   Icon: ShieldCheck,
  //   id: 'essential',
  //   title: 'Strictly Necessary',
  //   tag: 'Always Active',
  //   tagColor: 'text-luxury-green bg-luxury-green/10 border-luxury-green/20',
  //   forced: true,
  //   examples: ['Session authentication token', 'Cart & wishlist state', 'CSRF security token', 'Cookie consent preferences'],
  // },
  // {
  //   Icon: BarChart2,
  //   id: 'analytics',
  //   title: 'Analytics',
  //   tag: 'Optional',
  //   tagColor: 'text-gold bg-gold/10 border-gold/20',
  //   forced: false,
  //   examples: ['Page view tracking', 'Session duration', 'Traffic source attribution', 'Device & browser info'],
  // },
  // {
  //   Icon: Target,
  //   id: 'marketing',
  //   title: 'Marketing',
  //   tag: 'Optional',
  //   tagColor: 'text-gold bg-gold/10 border-gold/20',
  //   forced: false,
  //   examples: ['Ad performance measurement', 'Conversion tracking', 'Promotional content relevance', 'Social media interaction'],
  // },
  // {
  //   Icon: Settings,
  //   id: 'functional',
  //   title: 'Functional',
  //   tag: 'Optional',
  //   tagColor: 'text-gold bg-gold/10 border-gold/20',
  //   forced: false,
  //   examples: ['Language / region preference', 'Previously selected settings', 'Website personalisation', 'Form auto-fill data'],
  // },
];

const SectionBlock = ({ section }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gold/10 rounded-2xl overflow-hidden hover:border-gold/20 transition-all duration-500 group">
      <button
        id={`cookie-section-${section.num}`}
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
            <>
              {section.body && <p className="text-ivory/50 text-sm leading-relaxed font-light">{section.body}</p>}
              {section.subsections.map((sub, i) => (
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
                  {sub.note && (
                    <p className="text-ivory/25 text-xs leading-relaxed font-light italic border-l-2 border-gold/15 pl-3 mt-3">
                      {sub.note}
                    </p>
                  )}
                </div>
              ))}
              {section.note && (
                <p className="text-ivory/30 text-xs leading-relaxed font-light italic border-l-2 border-gold/20 pl-4 mt-2">
                  {section.note}
                </p>
              )}
            </>
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

const Toggle = ({ id, checked, onChange, disabled }) => (
  <button
    id={`cookie-toggle-${id}`}
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => !disabled && onChange(!checked)}
    className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      } ${checked ? 'bg-gold' : 'bg-black-3 border border-gold/20'}`}
  >
    <span
      className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${checked ? 'left-7 bg-black' : 'left-1 bg-ivory/30'
        }`}
    />
  </button>
);

const CookiePolicyPage = () => {
  const [prefs, setPrefs] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-black min-h-screen pb-24">
      <div className="container">

        {/* Hero */}
        <section className="mb-20 text-center animate-fade-in">
          <span className="section-label">INERRANCY — THE DISCIPLINE OF PERFECTION</span>
          <h1 className="font-heading text-6xl lg:text-8xl text-ivory mb-8 tracking-wide leading-tight">
            Cookie Policy
          </h1>
          {/* <div className="h-px w-20 bg-gold mx-auto mb-10" /> */}
          {/* <p className="text-ivory/40 text-sm tracking-[3px] uppercase max-w-xl mx-auto leading-loose">
            This page explains how we use cookies and similar technologies when you visit or shop on inerrancy.in.
          </p> */}
        </section>

        {/* Cookie Type Toggles */}
        <section className="space-y-5 mb-20">
          <div className="text-center mb-12">
            {/* <span className="section-label">MANAGE YOUR PREFERENCES</span> */}
            {/* <h2 className="section-title">Cookie Categories</h2> */}
            {/* <div className="gold-divider mx-auto" /> */}
          </div>

          {cookieTypes.map((type) => (
            <div
              key={type.id}
              className="bg-black-2 border border-gold/10 rounded-2xl p-8 lg:p-10 hover:border-gold/20 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold/40 to-transparent rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-5 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold flex-shrink-0 group-hover:bg-gold group-hover:text-black transition-all duration-300 mt-1">
                    <type.Icon size={17} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="font-heading text-xl lg:text-2xl text-ivory tracking-wide">{type.title}</h3>
                      <span className={`text-[10px] font-bold uppercase tracking-[2px] px-3 py-1 rounded-full border ${type.tagColor}`}>
                        {type.tag}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                      {type.examples.map((ex, i) => (
                        <span key={i} className="text-[10px] uppercase tracking-[1px] text-ivory/30 border border-gold/8 rounded-lg px-3 py-2">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 mt-1">
                  <Toggle
                    id={type.id}
                    checked={prefs[type.id]}
                    disabled={type.forced}
                    onChange={(val) => setPrefs((prev) => ({ ...prev, [type.id]: val }))}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Save Row */}
          {/* <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-black-2 border border-gold/10 rounded-2xl p-7">
            <p className="text-ivory/40 text-sm">
              Your preferences are stored locally and will persist across sessions. You may update them at any time from this page.
            </p>
            <button
              id="cookie-save-btn"
              onClick={handleSave}
              className={`btn flex-shrink-0 transition-all duration-300 ${saved ? 'btn-outline text-luxury-green border-luxury-green/40' : 'btn-primary'}`}
            >
              {saved ? '✓ Preferences Saved' : 'Save My Preferences'}
            </button>
          </div> */}
        </section>

        {/* Policy Sections */}
        <section className="space-y-3 mb-20">
          <div className="text-center mb-12">
            {/* <span className="section-label">FULL POLICY</span> */}
            {/* <h2 className="section-title">Cookie Policy Details</h2> */}
            <div className="gold-divider mx-auto" />
          </div>
          {sections.map((section) => (
            <SectionBlock key={section.num} section={section} />
          ))}
        </section>

        {/* Contact */}
        <section className="bg-black-2 border border-gold/10 rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gold/3 blur-[100px] -z-10" />
          <span className="section-label">SECTION 09 · CONTACT US</span>
          <h2 className="font-heading text-3xl lg:text-4xl text-ivory mb-5 tracking-wide">
            Questions about cookies?
          </h2>
          <p className="text-ivory/40 text-sm leading-relaxed max-w-lg mx-auto mb-8">
            If you have questions about our use of cookies or your privacy choices, contact us.
          </p>
          <a
            href="mailto:care@inerrancy.in"
            id="cookie-contact-link"
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

export default CookiePolicyPage;
