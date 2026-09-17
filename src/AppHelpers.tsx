import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Zap, CheckCircle, Users, BookOpen, Star } from 'lucide-react';
import { Sofa, ChefHat, Bed, Bath, Layers, Map } from 'lucide-react';

export const getDriveUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;

// Original book cover images (now served locally)
export const BOOK_IMAGES = {
  living: '/images/living_room.png',
  kitchen: '/images/kitchen.png',
  bedroom: '/images/bedroom.png',
  washroom: '/images/washroom.png',
  study: '/images/study.png',
  elevations: '/images/elevations.png',
};

export const CURRICULUM_DATA = [
  {
    id: 'living', title: 'Living Room Design Book', bookNum: 'Book 1', icon: <Sofa size={20} />, color: 'border-orange-500', imageUrl: BOOK_IMAGES.living, sections: [
      { name: 'Clearances', items: ['Porch clearances', 'Furniture arrangements', 'Minimum recommended spaces', 'Utilizing space under staircase'] },
      { name: 'Interior Style', items: ['Manipulate interiors with perception', 'Rugs and curtains placement', 'Creating visual interest', 'Decoding interior styles'] },
      { name: 'Layout Logic', items: ['Conversation circle dimensions', 'TV viewing distances', 'Traffic flow optimization', 'Focal point selection'] },
      { name: 'Storage Hacks', items: ['Built-in cabinetry', 'Multi-functional furniture', 'Display vs hidden storage', 'Vertical space utilization'] }
    ]
  },
  {
    id: 'kitchens', title: 'Kitchen Design Book', bookNum: 'Book 2', icon: <ChefHat size={20} />, color: 'border-orange-500', imageUrl: BOOK_IMAGES.kitchen, sections: [
      { name: 'Layouts and Zones', items: ['Kitchen triangle and zoning', 'Future of kitchen design', 'Kitchen layouts with examples', 'Advantages and limitations'] },
      { name: 'Components', items: ['Stove placement clearances', 'Refrigerator types and mistakes', 'Sink types and placement', 'Pantry types and planning'] },
      { name: 'Storage', items: ['Kitchen top & bottom cabinets', 'Corner and hidden storage', 'Kitchen dimensions', 'Breakfast counter'] },
      { name: 'Services', items: ['Electrical points placement', 'Lighting types and zones'] }
    ]
  },
  {
    id: 'bedrooms', title: 'Bedroom Design Book', bookNum: 'Book 3', icon: <Bed size={20} />, color: 'border-blue-500', imageUrl: BOOK_IMAGES.bedroom, sections: [
      { name: 'Bed', items: ['Bed sizes by room types', 'Principles of Vastu and Feng Shui', 'Common mistakes placing the bed', 'Examples of Dos and Donts'] },
      { name: 'Furniture', items: ['Closets and compartments', 'Walk-in closet designs', 'Television placement', 'Chester drawers & clearances'] },
      { name: 'Circulation', items: ['Circulation inside layouts', 'Furniture placements for APT', 'Bedroom circulation zones', 'Mistakes to avoid'] },
      { name: 'Services', items: ['Electrical points placements', 'HVAC types and best zones', 'Types of Lighting', 'Bedroom placement'] }
    ]
  },
  {
    id: 'toilets', title: 'Washroom Design Book', bookNum: 'Book 4', icon: <Bath size={20} />, color: 'border-teal-500', imageUrl: BOOK_IMAGES.washroom, sections: [
      { name: 'Components', items: ['Water closet types', 'Vastu & Fen Shui of wares', 'Basin types and placements', 'Bathtubs and showers'] },
      { name: 'Clearances', items: ['Wheelchair accessibility', 'Handicap toilet designs', 'Dimensions and clearances', 'Zoning in a toilet'] },
      { name: 'Services', items: ['Drainage & water supply', 'Electrical zones in a toilet', 'Lighting recommendations', 'Exhaust and ventilation'] },
      { name: 'Tips & Tricks', items: ['Design for small bathrooms', 'Creating visually interesting toilets', 'Creating focal points', 'Color coding in a toilet'] }
    ]
  },
  {
    id: 'study', title: 'Study Design Book', bookNum: 'Book 5', icon: <Layers size={20} />, color: 'border-purple-500', imageUrl: BOOK_IMAGES.study, sections: [
      { name: 'Ergonomics', items: ['Desk heights and chair types', 'Monitor positioning', 'Cable management hacks', 'Lighting for focus'] },
      { name: 'Video Calls', items: ['Background styling', 'Lighting angles', 'Acoustics for home office', 'Professional aesthetics'] },
      { name: 'Planning', items: ['Zoning for productivity', 'Privacy solutions', 'Built-in library designs', 'Space-saving desks'] },
      { name: 'Services', items: ['Electrical outlet mapping', 'HVAC for closed rooms', 'High-speed internet wiring'] }
    ]
  },
  {
    id: 'exteriors', title: 'Elevations Design Book', bookNum: 'Book 6', icon: <Map size={20} />, color: 'border-green-500', imageUrl: BOOK_IMAGES.elevations, sections: [
      { name: 'Sunpath', items: ['What is Sunpath', 'How to read Sunpath', 'How to avoid glare', 'Window treatments'] },
      { name: 'Winds', items: ['Windrose diagram', 'Effects of wind on house', 'Promote good ventilation', 'Mistakes in windy areas'] },
      { name: 'Exterior Design', items: ['Slopes and contours', 'Site selection in hilly regions', 'Common construction mistakes', 'Rules and Guidelines'] },
      { name: 'Elevations', items: ['Psychrometric chart', 'Climate responsive architecture', 'Arid/Cold/Temperate design'] }
    ]
  }
];

export const PORTRAIT_IMAGES = [
  '/portraits/reader1.jpg',
  '/portraits/reader2.jpg',
  '/portraits/reader3.jpg',
  '/portraits/reader4.jpg',
  '/portraits/reader5.jpg',
  '/portraits/reader6.jpg',
  '/portraits/reader7.jpg'
];

export const BOOK_THUMBNAILS = [
  { label: 'Living Room', image: BOOK_IMAGES.living },
  { label: 'Kitchen', image: BOOK_IMAGES.kitchen },
  { label: 'Bedroom', image: BOOK_IMAGES.bedroom },
  { label: 'Washroom', image: BOOK_IMAGES.washroom },
  { label: 'Study', image: BOOK_IMAGES.study },
  { label: 'Elevations', image: BOOK_IMAGES.elevations }
];

export const PROBLEM_POINTS = [
  { emoji: "😩", text: "You spend hours searching for dimensions... and the room still feels 'off.' You know something's wrong but can't figure out what." },
  { emoji: "💸", text: "That expensive furniture looked perfect in the store. At home? It blocks the walkway. Now you live with the regret every single day." },
  { emoji: "😶", text: "Designers, YouTube, blogs — nobody gives you the actual numbers. Just vibes and mood boards that don't translate to real life." },
  { emoji: "🤯", text: "You have the taste. What's missing is the precise knowledge that separates pros from amateurs. The handmade diagrams that show what's right and what's wrong." },
];

export const TRANSFORMATION_STORIES = [
  { name: "Sarah M.", role: "Homeowner", before: "Spent $5,000 on furniture that looked beautiful in the store but terrible together at home.", after: "Redesigned her living room using Book 1's layout rules. Guests now ask if she hired a professional.", emoji: "🏠" },
  { name: "Michael C.", role: "Architecture Student", before: "Struggling with clearances and building services in university projects.", after: "Aced his final year thesis project with the practical knowledge from Books 4, 5, and 6.", emoji: "🎓" },
  { name: "Emily W.", role: "Real Estate Developer", before: "Losing deals because model homes looked generic and uninspired.", after: "Uses the 6-book system to stage every home. Sales velocity up 60%.", emoji: "📈" },
];

// Counter component
export const Counter = ({ target, duration = 1500 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        setStarted(true);
        let startTime: number | null = null;
        const step = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          setCount(Math.floor(progress * target));
          if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration, started]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

// Logo — light theme
export const Logo = () => (
  <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
      <BookOpen size={20} className="text-white" />
    </div>
    <div>
      <span className="font-display font-bold text-base tracking-tight leading-none text-gray-900 whitespace-nowrap block">Home Design Books</span>
      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600 whitespace-nowrap">6 Books · 800+ Pages</span>
    </div>
  </div>
);

// Countdown Timer — evergreen version starting at 07:37:40 (synced with landing page & checkout)
export const CountdownTimer = () => {
  const DURATION_SECONDS = (7 * 3600) + (37 * 60) + 40;
  const STORAGE_KEY = 'arch_evergreen_deadline_v1';

  const getTargetTime = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (stored) {
      const target = parseInt(stored, 10);
      if (!isNaN(target) && target > now) return target;
    }

    const newTarget = now + (DURATION_SECONDS * 1000);
    localStorage.setItem(STORAGE_KEY, newTarget.toString());
    return newTarget;
  };

  const getTimeLeft = (target: number) => {
    const diff = Math.max(0, Math.floor((target - Date.now()) / 1000));
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return { h, m, s, diff };
  };

  const [target, setTarget] = useState(getTargetTime);
  const [time, setTime] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => {
      const remaining = getTimeLeft(target);
      if (remaining.diff <= 0) {
        const newTarget = Date.now() + (DURATION_SECONDS * 1000);
        localStorage.setItem(STORAGE_KEY, newTarget.toString());
        setTarget(newTarget);
        setTime(getTimeLeft(newTarget));
      } else {
        setTime(remaining);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target]);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return (
    <div className="flex items-center gap-1 font-mono text-xs font-bold">
      <span className="bg-gray-900 text-white px-1.5 py-0.5 rounded">{pad(time.h)}</span>
      <span className="text-gray-400">:</span>
      <span className="bg-gray-900 text-white px-1.5 py-0.5 rounded">{pad(time.m)}</span>
      <span className="text-gray-400">:</span>
      <span className="bg-gray-900 text-white px-1.5 py-0.5 rounded">{pad(time.s)}</span>
    </div>
  );
};

// CSS Animations — light theme version
export const APP_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,400;1,9..144,700&display=swap');

  :root {
    --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    --font-display: 'Outfit', sans-serif;
    --font-serif: 'Fraunces', serif;
  }

  body {
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  .font-display { font-family: var(--font-display); }
  .font-serif { font-family: var(--font-serif); }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes softPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
  @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-12px); } 100% { transform: translateY(0px); } }
  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes glow {
    0%, 100% { 
      text-shadow: 0 0 10px rgba(249, 115, 22, 0.2), 0 0 20px rgba(249, 115, 22, 0.1); 
      filter: brightness(1);
    }
    50% { 
      text-shadow: 0 0 20px rgba(249, 115, 22, 0.5), 0 0 40px rgba(249, 115, 22, 0.2), 0 0 60px rgba(249, 115, 22, 0.1); 
      filter: brightness(1.1);
    }
  }

  .animate-marquee { animation: marquee 40s linear infinite; }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delayed { animation: float 6s ease-in-out infinite; animation-delay: 3s; }
  .animate-shimmer {
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }

  .glow-text {
    animation: glow 4s ease-in-out infinite;
    font-weight: 900;
    letter-spacing: -0.02em;
  }

  .premium-gradient {
    background: linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #fbbf24 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .text-balance {
    text-wrap: balance;
  }

  .tracking-tightest { letter-spacing: -0.05em; }
  .tracking-tighter { letter-spacing: -0.03em; }
`;
