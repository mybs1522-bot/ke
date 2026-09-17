import React, { useState, useEffect, useRef } from 'react';
import { CheckoutPage } from './components/CheckoutPage';
import { HardcopyCheckoutPage } from './components/HardcopyCheckoutPage';
import { SuccessPage } from './components/SuccessPage';
import { AdminModal } from './components/AdminModal';
import { LoginModal } from './components/LoginModal';
import { FAQ_ITEMS, TESTIMONIALS, COURSES, INDUSTRIES, FEATURES, BUSINESS_MODULES } from './constants';
import { SplashScreen } from './components/SplashScreen';
import { HeroSlider } from './components/HeroSlider';
import { ChevronDown, ArrowRight, Star, BookOpen, Sparkles, CheckCircle2, ShieldCheck, Target, TrendingUp, Zap, Users, X, Home, Sofa, ChefHat, Bed, Bath, Map, GraduationCap, Building, Wrench, Hammer, Palette, Download, Infinity, Award, Eye, Heart, Clock, Layers, LifeBuoy, Briefcase, AlertCircle, Package, Truck } from 'lucide-react';
import { Course } from './types';
import { trackMetaEvent } from './utils/meta-tracking';
import { detectVisitorCurrency, buildCurrencyInfo, CurrencyInfo } from './utils/currency-geo';
import {
  Counter, Logo,
  APP_STYLES, PORTRAIT_IMAGES, BOOK_THUMBNAILS, BOOK_IMAGES,
  PROBLEM_POINTS, TRANSFORMATION_STORIES, CURRICULUM_DATA
} from './AppHelpers';

const ICON_MAP: Record<string, any> = { Home, BookOpen, Palette, Building, Hammer, Wrench, Download, Infinity, LifeBuoy, Users, Briefcase, GraduationCap, TrendingUp };

const App: React.FC = () => {
  const [geoInfo, setGeoInfo] = useState<CurrencyInfo>(() => buildCurrencyInfo('NG'));
  const [currentPath, setCurrentPath] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      // Clean up the URL
      window.history.replaceState({}, '', redirect);
      return redirect;
    }
    return window.location.pathname;
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeCurriculumBook, setActiveCurriculumBook] = useState(0);
  const [curriculumPaused, setCurriculumPaused] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Auto-cycle curriculum tabs
  useEffect(() => {
    if (curriculumPaused) return;
    const timer = setInterval(() => {
      setActiveCurriculumBook(prev => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(timer);
  }, [curriculumPaused]);

  // When user clicks a tab manually, pause auto-cycle for 8s
  const handleCurriculumClick = (index: number) => {
    setActiveCurriculumBook(index);
    setCurriculumPaused(true);
    setTimeout(() => setCurriculumPaused(false), 8000);
  };

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [currentPath]);

  useEffect(() => {
    const h = () => setShowStickyBar(window.scrollY > 600);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Detect visitor location and currency automatically
  useEffect(() => {
    detectVisitorCurrency().then(info => {
      setGeoInfo(info);
    });
  }, []);

  // Meta ViewContent for Landing Page
  useEffect(() => {
    if (currentPath === '/') {
      const numericVal = typeof geoInfo.price === 'string' ? parseFloat(geoInfo.price.replace(/,/g, '')) : geoInfo.price;
      trackMetaEvent({
        eventName: 'ViewContent',
        content_name: 'Interior Design System - 6 Book Collection',
        content_ids: ['interior-design-system-6-books'],
        content_type: 'product',
        value: numericVal || 49.00,
        currency: geoInfo.currency || 'USD'
      });
    }
  }, [currentPath, geoInfo]);

  // Routing
  if (currentPath === '/checkout-hardcopy' || currentPath.startsWith('/checkout-hardcopy')) return <HardcopyCheckoutPage />;
  if (currentPath === '/checkout' || currentPath.startsWith('/checkout')) return <CheckoutPage />;
  if (currentPath.startsWith('/success')) return <SuccessPage />;

  const navigateToCheckout = () => {
    const numericVal = typeof geoInfo.price === 'string' ? parseFloat(geoInfo.price.replace(/,/g, '')) : geoInfo.price;
    // Meta AddToCart / InitiateCheckout
    trackMetaEvent({
      eventName: 'AddToCart',
      content_name: 'Interior Design System - 6 Book Collection',
      content_ids: ['interior-design-system-6-books'],
      content_type: 'product',
      value: numericVal || 49.00,
      currency: geoInfo.currency || 'USD'
    });

    // Direct checkout on Selar with the customer's detected currency
    window.location.href = geoInfo.selarUrl;
  };

  const navigateToHardcopy = () => {
    trackMetaEvent({
      eventName: 'AddToCart',
      content_name: 'Interior Design System - 6 Book Hardcopy Collection',
      content_ids: ['interior-design-system-6-books-hardcopy'],
      content_type: 'product',
      value: 199.00,
      currency: 'USD'
    });
    window.scrollTo(0, 0);
    window.history.pushState({}, '', '/checkout-hardcopy');
    setCurrentPath('/checkout-hardcopy');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden antialiased relative">
      <style>{APP_STYLES}</style>
      {/* Light opacity grid overlay across entire page */}
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Splash loading animation — only on landing page */}
      {showSplash && currentPath === '/' && (
        <SplashScreen onComplete={() => {
          setShowSplash(false);
        }} />
      )}

      <main>

        {/* ═══════════════════════════════════════════════
           SECTION 1: HERO — The First Impression
           ═══════════════════════════════════════════════ */}
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(165deg, #fefcf9 0%, #fff8f0 25%, #ffffff 50%, #fef9f2 75%, #fffdf8 100%)' }}>
          {/* Animated ambient orbs */}
          <div className="absolute top-[-150px] right-[-100px] w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 70%)', animation: 'float 8s ease-in-out infinite' }} />
          <div className="absolute bottom-[-100px] left-[-150px] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)', animation: 'float 10s ease-in-out infinite reverse' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(251,191,36,0.04) 0%, transparent 60%)' }} />

          {/* Floating animation keyframes */}
          <style>{`
            @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
            @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
            @keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
            .hero-fade-1 { animation: fadeInUp 0.8s ease-out 0.1s both; }
            .hero-fade-2 { animation: fadeInUp 0.8s ease-out 0.25s both; }
            .hero-fade-3 { animation: fadeInUp 0.8s ease-out 0.4s both; }
            .hero-fade-4 { animation: fadeInUp 0.8s ease-out 0.55s both; }
            .hero-fade-5 { animation: fadeInUp 0.8s ease-out 0.7s both; }
            .hero-scale-in { animation: scaleIn 1s ease-out 0.2s both; }
            .hero-book-glow { filter: drop-shadow(0 20px 60px rgba(234,88,12,0.12)) drop-shadow(0 8px 24px rgba(0,0,0,0.08)); }
            .hero-book-glow:hover { filter: drop-shadow(0 25px 70px rgba(234,88,12,0.18)) drop-shadow(0 12px 32px rgba(0,0,0,0.12)); transition: filter 0.4s ease; }
          `}</style>

          <div className="max-w-6xl mx-auto px-5 relative z-10 pt-10 md:pt-20 pb-10 md:pb-28">

            {/* Centered Hero Content */}
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

              {/* Pain-point opener */}
              <p className="hero-fade-1 text-gray-900 text-sm md:text-lg font-semibold leading-relaxed max-w-lg mb-3">
                In Architecture & Design, <span className="font-black text-gray-950">dimensions and clearances</span> matter most. The real question is&nbsp;—
              </p>
              <h2 className="hero-fade-2 text-xl md:text-3xl font-display font-black text-orange-600 tracking-tight leading-[1.15] mb-5 max-w-xl">
                How to design a Home perfectly without wasting time searching inspirations and dimensions?
              </h2>

              {/* Transition into the product */}
              <p className="hero-fade-3 text-sm md:text-lg text-gray-800 font-semibold mb-6 max-w-md">That's why we present</p>

              {/* Main Headline */}
              <h1 className="hero-fade-3 text-4xl md:text-6xl lg:text-[4.5rem] font-display font-black leading-[1.05] mb-5 text-gray-900 tracking-tightest text-balance">
                6 Books on<br />
                <span style={{ background: 'linear-gradient(135deg, #ea580c 0%, #d97706 50%, #b45309 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Interior & Exterior Design</span>
              </h1>

              {/* Trust badge pill */}
              <div className="hero-fade-4 mb-3 inline-flex items-center gap-1.5 md:gap-2.5 px-3 md:px-5 py-2 md:py-2.5 bg-white/70 backdrop-blur-md border border-orange-100/80 rounded-full shadow-sm shadow-orange-500/5 whitespace-nowrap">
                <div className="hidden md:flex -space-x-2">
                  {PORTRAIT_IMAGES.slice(0, 4).map((img, i) => (
                    <img key={i} src={img} alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <div className="flex items-center gap-0.5 md:gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-orange-400 text-orange-400 md:w-[11px] md:h-[11px]" />)}
                </div>
                <span className="text-[10px] md:text-xs font-bold text-gray-700">Trusted by designers in 21+ countries</span>
              </div>

              {/* Dynamic Localized African / Country Pricing Banner */}
              {geoInfo.countryName && (
                <div className="hero-fade-4 mb-6 inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50/90 border border-orange-200/80 rounded-full text-xs font-semibold text-orange-950 shadow-sm">
                  <span>📍 Special price for <strong className="font-bold text-orange-600">{geoInfo.countryName}</strong>:</span>
                  <span className="font-black text-orange-700">{geoInfo.priceFormatted}</span>
                  {geoInfo.originalPriceFormatted && (
                    <span className="line-through text-gray-400 text-[11px]">{geoInfo.originalPriceFormatted}</span>
                  )}
                </div>
              )}

              {/* Hero Book Cover Gallery Slider */}
              <HeroSlider />

              {/* Pain Point + Value Prop — Below Image */}
              <div className="mt-16 md:mt-24 w-full max-w-4xl mx-auto">
                <div className="reveal text-center mb-10 md:mb-14 max-w-2xl mx-auto space-y-5">
                  <p className="text-orange-500 text-xs font-mono uppercase tracking-[0.25em] font-bold">Before you design anything</p>
                  <h2 className="text-2xl md:text-5xl font-display font-black text-gray-900 tracking-tightest leading-[1.1]">
                    One wrong measurement =<br /><span className="font-serif italic font-normal text-orange-600">thousands wasted.</span>
                  </h2>
                  <p className="text-gray-700 text-sm md:text-lg leading-relaxed">
                    <span className="font-bold text-gray-900">800+ handmade diagrams.</span> Every dimension, clearance & layout — what works and what fails.
                  </p>
                  <p className="text-orange-600 font-bold text-sm md:text-base">
                    20 years of knowledge — yours in hours.
                  </p>
                </div>

                {/* 6 Book Thumbnails Grid */}
                <div className="reveal-scale">
                  <div className="grid grid-cols-3 gap-2 md:gap-5">
                    {BOOK_THUMBNAILS.map((thumb, i) => (
                      <div key={i} className="relative rounded-2xl md:rounded-3xl overflow-hidden aspect-[3/4] bg-gray-100 group cursor-pointer shadow-lg shadow-gray-900/5 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:scale-[1.03]">
                        <img src={thumb.image} alt={thumb.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                          <span className="text-[10px] md:text-xs font-bold text-white/60 uppercase tracking-widest">Book {i + 1}</span>
                          <p className="text-sm md:text-base font-bold text-white leading-tight mt-0.5">{thumb.label}</p>
                        </div>
                        {/* Hover accent border */}
                        <div className="absolute inset-0 rounded-2xl md:rounded-3xl border-2 border-transparent group-hover:border-orange-400/30 transition-colors pointer-events-none" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>



        {/* ═══════════════════════════════════════════════
           SECTION 5B: WHO THIS IS FOR
           ═══════════════════════════════════════════════ */}
        <section className="py-6 md:py-20">
          <div className="max-w-5xl mx-auto px-5">
            <div className="reveal text-center mb-7 md:mb-10">
              <p className="text-orange-500 text-xs font-mono uppercase tracking-widest mb-3 font-semibold">Who is this for?</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight">Trusted by <span className="text-orange-500">Homeowners & Professionals</span> Alike</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {INDUSTRIES.map((ind, i) => {
                const IconComp = ICON_MAP[ind.icon] || Home;
                return (
                  <div key={i} className="reveal text-center bg-white border border-gray-100 rounded-2xl p-4 md:p-5 hover:border-orange-200 hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-50 flex items-center justify-center">
                      <IconComp size={22} className="text-orange-500" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">{ind.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 1C: LEARN WITH INTERACTIVE DIAGRAMS
           ═══════════════════════════════════════════════ */}
        <section className="py-10 md:py-24 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
          <div className="max-w-5xl mx-auto px-5">
            <div className="reveal text-center mb-8 md:mb-14">
              <p className="text-orange-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 font-display">What makes these books special</p>
              <h2 className="text-3xl md:text-6xl font-display font-black text-gray-900 tracking-tightest leading-[1]">
                Learn with <span className="font-serif italic font-normal text-orange-600">Interactive Diagrams</span>
              </h2>
              <p className="text-gray-600 text-base md:text-lg mt-4 max-w-2xl mx-auto">
                Every page is filled with <span className="font-bold text-gray-900">handmade diagrams</span> covering room layouts, clearances, and dimensions — so you can see <span className="font-bold text-emerald-600">what works</span> and <span className="font-bold text-red-600">what doesn't</span> at a glance.
              </p>
            </div>

            {/* Diagram Grid Image */}
            <div className="reveal mb-6 md:mb-10">
              <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-gray-900/10 border border-gray-100 bg-white">
                <img
                  src="/images/interactive-diagrams-grid.png"
                  alt="Interactive floor plan diagrams showing living room, bedroom, bathroom, kitchen, and stairs designs with dimensions and clearances"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Icons Image */}
            <div className="reveal">
              <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-xl shadow-gray-900/5 border border-gray-100 bg-white p-4 md:p-8">
                <img
                  src="/images/interactive-diagrams-icons.png"
                  alt="Four categories: Space Planning, Tips Tricks and Ideas, History of Architecture, Don'ts and Do's"
                  className="w-full h-auto max-w-3xl mx-auto"
                />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 2: BOOK FLIP-THROUGH VIDEO
           ═══════════════════════════════════════════════ */}
        <section className="py-6 md:py-24">
          <div className="max-w-4xl mx-auto px-5">
            <div className="reveal relative overflow-hidden rounded-2xl shadow-2xl" style={{ paddingBottom: '56.25%' }}>
              <iframe
                title="Book flip-through preview"
                src="https://iframe.mediadelivery.net/embed/494628/223e3dd8-1052-49ec-99f4-c326b50108e6?autoplay=true&loop=true&muted=true&preload=true&responsive=true"
                loading="lazy"
                style={{ border: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <div className="text-center">
                <button onClick={navigateToCheckout} className="cta-primary px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all inline-flex items-center gap-3 group whitespace-nowrap cursor-pointer">
                  E-Books Download — {geoInfo.priceFormatted} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </button>
                <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1 font-medium"><Download size={12} className="text-orange-400" /> Download Instantly</p>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase">or</span>
              <div className="text-center">
                <button onClick={navigateToHardcopy} className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-gray-900/15 hover:bg-gray-800 hover:scale-[1.03] active:scale-[0.98] transition-all inline-flex items-center gap-3 group whitespace-nowrap">
                  Get Hardcopies — {geoInfo.hardcopyPriceFormatted} <Package size={18} />
                </button>
                <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1 font-medium"><Truck size={12} className="text-gray-400" /> 10-Day Delivery Globally</p>
              </div>
            </div>

            <div className="mt-10 md:mt-20">
              <div className="reveal text-center mb-7 md:mb-10">
                <p className="text-orange-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 font-display">What's inside</p>
                <h2 className="text-3xl md:text-6xl font-display font-black text-gray-900 tracking-tightest">800+ pages that cover <span className="font-serif italic font-normal text-orange-600">everything</span></h2>
                <p className="text-gray-600 text-base md:text-lg mt-3 max-w-2xl mx-auto">
                  Every clearance. Every dimension. Every mistake you could make — <span className="font-bold text-gray-900">and how to avoid it</span>.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8 reveal">
                {CURRICULUM_DATA.map((book, i) => (
                  <button key={book.id} onClick={() => handleCurriculumClick(i)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${activeCurriculumBook === i
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {book.icon} {book.bookNum}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-900/5 border border-gray-100 reveal">
                <div className="md:flex">
                  <div className="md:w-1/3 aspect-square md:aspect-auto bg-gray-100">
                    <img src={CURRICULUM_DATA[activeCurriculumBook].imageUrl} alt={CURRICULUM_DATA[activeCurriculumBook].title} className="w-full h-full object-cover" />
                  </div>
                  <div className="md:w-2/3 p-5 md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">{CURRICULUM_DATA[activeCurriculumBook].title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {CURRICULUM_DATA[activeCurriculumBook].sections.map((section, j) => (
                        <div key={j}>
                          <h4 className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-2">{section.name}</h4>
                          <ul className="space-y-1.5 md:space-y-2">
                            {section.items.map((item, k) => (
                              <li key={k} className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 size={12} className="text-gray-400 mt-1 shrink-0" />{item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 2B: MARKETING COPY — Confidence Guarantee
           ═══════════════════════════════════════════════ */}
        <section className="py-6 md:py-20">
          <div className="max-w-3xl mx-auto px-5">
            <div className="reveal text-center space-y-4 md:space-y-6">
              <p className="text-gray-600 text-sm md:text-lg mb-1 italic max-w-2xl mx-auto">
                In our business of Architecture and Design, <span className="font-bold text-gray-900">knowing the right dimensions and clearances</span> matters the most.
              </p>
              <p className="text-gray-700 text-sm md:text-lg leading-relaxed max-w-xl mx-auto mb-2 md:mb-4">
                And now, the question is no longer <span className="font-serif italic">how</span> to learn it. The real question is...
              </p>
              <h2 className="text-3xl md:text-6xl font-display font-black text-orange-600 tracking-tightest leading-[1] text-balance mb-5 md:mb-8">
                How to learn it WITHOUT making expensive mistakes?
              </h2>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 rounded-2xl p-5 md:p-8 max-w-2xl mx-auto">
                <div className="flex items-start gap-4">
                  <span className="text-3xl shrink-0">💡</span>
                  <div>
                    <p className="text-gray-800 text-sm md:text-lg leading-relaxed text-left">
                      That's <span className="font-bold text-orange-600">exactly why</span> we created these 6 books. <span className="font-bold text-orange-600">800+ pages of handmade diagrams</span> showing every dimension, clearance, and layout — what works and what fails. <span className="font-serif italic text-gray-900">Learn in hours what took us 20 years to master.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-6 md:py-12 bg-white">
          <div className="max-w-3xl mx-auto px-5">
            <div className="reveal">
              <h2 className="text-2xl md:text-3xl font-display font-black text-gray-900 tracking-tight mb-4 md:mb-6 text-center">
                Here's the thing — <span className="font-serif italic font-normal text-orange-600">this is for you if...</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-3">
                {[
                  { text: 'You want to stay 10 steps ahead of your contractor', icon: '✅' },
                  { text: "You're designing for a client and want to deliver flawlessly", icon: '✅' },
                  { text: 'You love designs that function beautifully and look amazing', icon: '✅' },
                  { text: 'You believe in smart, intuitive design with purpose', icon: '✅' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-100 transition-colors">
                    <span className="text-base shrink-0">{item.icon}</span>
                    <p className="text-gray-800 text-sm font-medium leading-snug">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 3C: SOUND FAMILIAR? — Pain Points
           ═══════════════════════════════════════════════ */}
        <section className="py-6 md:py-24">
          <div className="max-w-4xl mx-auto px-5">
            <div className="reveal text-center mb-8 md:mb-12">
              <p className="text-orange-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 font-display">Sound familiar?</p>
              <h2 className="text-3xl md:text-6xl font-display font-black text-gray-900 tracking-tightest">You know what <span className="font-serif italic font-normal text-orange-600">really hurts?</span></h2>
              <p className="text-gray-600 text-base md:text-lg mt-3 mb-5 md:mb-8">It's not that you don't care about design. You do. But...</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {PROBLEM_POINTS.map((p, i) => (
                <div key={i} className="reveal bg-gray-50 border border-gray-100 rounded-2xl p-5 md:p-6 flex gap-4 items-start hover:border-orange-200 transition-colors">
                  <span className="text-3xl shrink-0">{p.emoji}</span>
                  <p className="text-gray-600 text-sm leading-relaxed">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 2C: WHY THESE BOOKS CHANGE EVERYTHING
           ═══════════════════════════════════════════════ */}
        <section className="py-6 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-5">
            <div className="reveal">
              <div className="border-t-[6px] border-orange-500 pt-7 md:pt-10">
                <h2 className="text-3xl md:text-5xl font-display font-black text-gray-900 tracking-tightest text-center mb-4 md:mb-6">
                  But here's what makes these books <span className="font-serif italic font-normal text-orange-600">different</span>
                </h2>
                <p className="text-center text-gray-600 text-base md:text-lg mb-8 md:mb-12 max-w-xl mx-auto">
                  They're not just theory. They're <span className="font-bold text-gray-900">handmade diagrams</span> that show you <span className="font-bold text-emerald-600">exactly what works</span> and <span className="font-bold text-red-600">exactly what fails</span>.
                </p>
                <div className="space-y-3 md:space-y-4 max-w-xl mx-auto">
                  {[
                    { emoji: '💡', bold: "Instantly look more professional", rest: ' — clients notice when you know exact dimensions without checking your phone' },
                    { emoji: '📐', bold: 'Every measurement is from real projects', rest: ' — not theoretical textbooks that have never seen a real construction site' },
                    { emoji: '🏠', bold: 'Design rooms that actually work', rest: ' — where doors open properly, furniture fits perfectly, and nothing feels cramped' },
                    { emoji: '✨', bold: 'The "unfair advantage"', rest: ' — know things in 2 hours that others take years of trial and error to learn' },
                    { emoji: '💰', bold: 'Save thousands in costly mistakes', rest: ' — one wrong kitchen layout costs more than 10x the price of all 6 books' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm md:text-base">
                      <span className="text-xl shrink-0">{item.emoji}</span>
                      <p className="text-gray-800">
                        <strong className="text-gray-900">{item.bold}</strong>{item.rest}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 4: THE BACKSTORY — Build Trust
           ═══════════════════════════════════════════════ */}
        <section className="py-6 md:py-24 bg-gray-50">
          <div className="max-w-3xl mx-auto px-5">
            <div className="reveal text-center mb-8 md:mb-12">
              <p className="text-orange-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 font-display">Here's the truth</p>
              <h2 className="text-3xl md:text-5xl font-serif italic text-gray-900 mb-5 md:mb-8 leading-[1.1] tracking-tight text-balance">
                "We got tired of watching people waste money on mistakes that could've been avoided."
              </h2>
            </div>
            <div className="reveal space-y-4 text-gray-700 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto">
              <p>After 20 years and 1,000+ projects, we've seen it all. Beautiful homes ruined by <strong className="text-gray-800">one wrong measurement.</strong> One forgotten clearance. One layout that looked perfect on paper but felt <span className="font-serif italic">completely wrong</span> in real life.</p>
              <p>And every single time, the homeowner says: <span className="font-serif italic text-gray-900">"I wish someone had just told me."</span></p>
              <p>Look, here's what nobody tells you: <strong className="text-gray-900">hiring a designer doesn't guarantee you'll avoid these mistakes.</strong> Most designers keep their dimensional knowledge secret — it's their competitive edge.</p>
              <p>And YouTube? It teaches you trends. <span className="font-bold text-gray-900">Trends expire. Dimensions don't.</span></p>
              <p>So we did something different. We took <strong className="text-gray-900">every measurement, every clearance, every layout principle</strong> we've learned and put it into 6 books with <span className="font-bold text-orange-600">handmade diagrams</span> that show you what's right and what's wrong.</p>
              <p className="text-gray-900 font-semibold text-base md:text-xl pt-3 md:pt-4 border-l-4 border-orange-400 pl-4 md:pl-5">20 years of knowledge — yours in hours. No guessing. No mistakes. Just <span className="font-serif italic">clarity</span>.<br/><span className="text-sm text-gray-500 font-normal not-italic">— The Home Design Books Team</span></p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 5: YOU NEED / YOU DON'T NEED
           ═══════════════════════════════════════════════ */}


        {/* ═══════════════════════════════════════════════
           SECTION 6B: WHAT YOU GET — Features
           ═══════════════════════════════════════════════ */}
        <section className="py-10 md:py-20">
          <div className="max-w-5xl mx-auto px-5">
            <div className="reveal text-center mb-7 md:mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight">Everything you get <span className="text-orange-500">for {geoInfo.priceFormatted}</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {FEATURES.map((feat, i) => {
                return (
                  <div key={i} className="reveal bg-white border border-gray-100 rounded-2xl p-5 md:p-6 hover:shadow-lg hover:border-orange-200 transition-all group">
                    <div className="w-12 h-12 mb-4 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-100 transition-colors">
                      {feat.icon}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">{feat.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feat.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 7B: HOW TO USE IT — Business Modules
           ═══════════════════════════════════════════════ */}
        <section className="py-10 md:py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-5">
            <div className="reveal text-center mb-8 md:mb-12">
              <p className="text-orange-600 text-xs font-bold uppercase tracking-[0.2em] mb-4 font-display">Start using them today</p>
              <h2 className="text-3xl md:text-5xl font-display font-black text-gray-900 tracking-tightest">Here's how this <span className="font-serif italic font-normal text-orange-600">pays for itself</span> instantly</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
              {BUSINESS_MODULES.map((mod, i) => {
                const IconComp = ICON_MAP[mod.icon] || Home;
                return (
                  <div key={i} className="reveal bg-white border border-gray-100 rounded-2xl p-5 md:p-6 flex gap-4 md:gap-5 items-start hover:shadow-lg hover:border-orange-200 transition-all">
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                      <IconComp size={22} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 mb-1">{mod.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{mod.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 8: TESTIMONIALS
           ═══════════════════════════════════════════════ */}
        <section className="py-10 md:py-24 overflow-hidden">
          <div className="px-5 mb-8 md:mb-12 text-center">
            <div className="reveal">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 tracking-tight mb-3">Don't just take <span className="text-orange-500">our word for it</span></h2>
              <p className="text-gray-600 text-base md:text-lg">Thousands of designers and homeowners already have these books. Here's what they're saying:</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            {/* Top Row */}
            <div className="flex gap-5 animate-scroll-left hover:pause">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div key={i} className="w-[320px] md:w-[340px] shrink-0 bg-white border border-gray-100 p-5 md:p-7 rounded-3xl shadow-sm hover:shadow-lg transition-all">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-orange-400 text-orange-400" />)}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center font-bold text-sm text-orange-600">{t.name[0]}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">{t.name}</p>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest">{t.role} • {t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Row */}
            <div className="flex gap-5 animate-scroll-right hover:pause">
              {[...TESTIMONIALS.slice().reverse(), ...TESTIMONIALS.slice().reverse()].map((t, i) => (
                <div key={i} className="w-[320px] md:w-[340px] shrink-0 bg-white border border-gray-100 p-5 md:p-7 rounded-3xl shadow-sm hover:shadow-lg transition-all">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-orange-400 text-orange-400" />)}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center font-bold text-sm text-orange-600">{t.name[0]}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">{t.name}</p>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest">{t.role} • {t.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 9: GUARANTEE + PRICING CTA
           ═══════════════════════════════════════════════ */}
        <section className="py-10 md:py-24">
          <div className="max-w-3xl mx-auto px-5">
            {/* Guarantee */}
            <div className="reveal text-center mb-10 md:mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-50 mb-6">
                <ShieldCheck size={36} className="text-emerald-500" />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4 tracking-tight">And yes, you're <span className="text-emerald-600">completely protected</span></h2>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
                Try the books for 30 days. If they don't change how you design — <span className="font-bold text-gray-900">we'll refund every penny.</span> No questions. No forms. Just an email. <span className="font-serif italic">We take the risk, not you.</span>
              </p>
            </div>

            {/* Pricing Card */}
            <div className="reveal bg-white rounded-3xl p-6 md:p-10 shadow-2xl shadow-gray-900/10 border border-gray-100 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />

              <p className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-3">The Complete Collection</p>
              
              <div className="flex flex-col items-center justify-center gap-1 mb-2">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-4xl md:text-6xl font-display font-black text-gray-900 tracking-tighter">
                    {geoInfo.priceFormatted}
                  </span>
                  {geoInfo.originalPriceFormatted && (
                    <span className="text-2xl md:text-3xl line-through text-gray-400 font-bold">
                      {geoInfo.originalPriceFormatted}
                    </span>
                  )}
                </div>
                {geoInfo.countryName && (
                  <span className="text-xs font-bold text-orange-700 bg-orange-50 border border-orange-200/80 px-3 py-1 rounded-full mt-1">
                    ⚡ {geoInfo.isAfrican ? 'African Local Price' : 'Special Offer'} for {geoInfo.countryName} ({geoInfo.currency})
                  </span>
                )}
              </div>

              <p className="text-orange-500 font-semibold text-sm mb-6 md:mb-8">One-time payment · Yours forever · Free updates for life</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 md:mb-8 text-left">
                {[
                  { icon: <BookOpen size={16} />, text: 'All 6 eBooks (PDF)' },
                  { icon: <Download size={16} />, text: 'Instant Download' },
                  { icon: <Infinity size={16} />, text: 'Lifetime Updates' },
                  { icon: <Target size={16} />, text: 'Clearance Charts' },
                  { icon: <Sparkles size={16} />, text: 'High-Res Images' },
                  { icon: <ShieldCheck size={16} />, text: '30-Day Guarantee' },
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-orange-400">{feat.icon}</span> {feat.text}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div>
                  <button onClick={navigateToCheckout} className="cta-primary w-full py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group whitespace-nowrap cursor-pointer">
                    Download Books Now — {geoInfo.priceFormatted} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                  </button>
                  <p className="text-xs text-gray-500 mt-1.5 text-center flex items-center justify-center gap-1 font-medium"><Download size={12} className="text-orange-400" /> Download Instantly via Selar Checkout</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">or</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                <div>
                  <button onClick={navigateToHardcopy} className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-gray-900/15 hover:bg-gray-800 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group whitespace-nowrap">
                    Get Hardcopies — {geoInfo.hardcopyPriceFormatted} <Package size={18} />
                  </button>
                  <p className="text-xs text-gray-500 mt-1.5 text-center flex items-center justify-center gap-1 font-medium"><Truck size={12} className="text-gray-400" /> 10-Day Delivery Globally</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">Secure payment · No subscription</p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 10: FAQ
           ═══════════════════════════════════════════════ */}
        <section className="py-10 md:py-24 bg-gray-50">
          <div className="max-w-3xl mx-auto px-5">
            <div className="reveal text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 tracking-tight">Still have <span className="text-orange-500">questions?</span></h2>
              <p className="text-gray-600 text-base md:text-lg mt-2 md:mt-3">We get it. Here are the answers:</p>
            </div>
            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, i) => (
                <details key={i} className="reveal group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm" open={openFaqIndex === i}>
                  <summary
                    className="flex items-center justify-between p-4 md:p-5 cursor-pointer list-none"
                    onClick={(e) => { e.preventDefault(); setOpenFaqIndex(openFaqIndex === i ? null : i); }}
                  >
                    <span className="text-sm md:text-base font-semibold text-gray-800 pr-6">{faq.question}</span>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform shrink-0 ${openFaqIndex === i ? 'rotate-180' : ''}`} />
                  </summary>
                  <div className="px-4 md:px-5 pb-4 md:pb-5">
                    <p className="text-gray-700 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
           SECTION 11: FINAL CTA
           ═══════════════════════════════════════════════ */}
        <section className="py-6 md:py-24 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl mx-auto px-5 text-center relative z-10">
            <div className="reveal">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 md:mb-5 tracking-tight">Look, every day you wait is another <span className="font-serif italic text-orange-400">mistake</span> you might make.</h2>

              <p className="text-gray-400 text-lg mb-8">Thousands of people already have these books. The only question is — <span className="font-bold text-white">will you keep guessing, or start designing with confidence?</span></p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <div className="text-center">
                  <button onClick={navigateToCheckout} className="cta-primary px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all inline-flex items-center gap-3 group whitespace-nowrap cursor-pointer">
                    E-Books Download — {geoInfo.priceFormatted} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                  </button>
                  <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1 font-medium"><Download size={12} className="text-orange-400" /> Download Instantly</p>
                </div>
                <span className="text-xs font-bold text-gray-600 uppercase">or</span>
                <div className="text-center">
                  <button onClick={navigateToHardcopy} className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg shadow-xl hover:bg-gray-100 hover:scale-[1.03] active:scale-[0.98] transition-all inline-flex items-center gap-3 group whitespace-nowrap border border-gray-200 cursor-pointer">
                    Get Hardcopies — {geoInfo.hardcopyPriceFormatted} <Package size={18} />
                  </button>
                  <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1 font-medium"><Truck size={12} /> 10-Day Delivery Globally</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400" /> 30-Day Guarantee</span>
                <span className="flex items-center gap-1.5"><Zap size={14} className="text-orange-400" /> Instant Download</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 bg-gray-900 border-t border-gray-800">
          <div className="max-w-5xl mx-auto px-5">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  <BookOpen size={16} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-white">Home Design Books</span>
              </div>
              <div className="flex items-center gap-6 text-xs text-gray-500">
                <span>30-Day Money-Back Guarantee</span>
                <span>·</span>
                <span>Secure Instant Checkout</span>
              </div>
              <p className="text-xs text-gray-600"> {new Date().getFullYear()} Home Design Books. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Sticky Bottom Bar */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200 px-4 py-3 shadow-2xl shadow-gray-900/10">
          <div className="max-w-6xl mx-auto">
            {/* Mobile: timer + full-width button */}
            <div className="sm:hidden">
              <button onClick={navigateToCheckout} className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-orange-500/20 cursor-pointer">
                Get All 6 Books — {geoInfo.priceFormatted} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
              </button>
            </div>

            {/* Desktop: portraits + timer + price + button */}
            <div className="hidden sm:flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {PORTRAIT_IMAGES.slice(0, 3).map((img, i) => (
                    <img key={i} src={img} alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 leading-none">Trusted readers</p>
                  <p className="text-[10px] text-gray-600">trusted worldwide</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={navigateToCheckout} className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-sm hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 group whitespace-nowrap shadow-lg shadow-orange-500/20 cursor-pointer">
                  Get All 6 Books — {geoInfo.priceFormatted} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;