/**
 * Modular Checkout & African Geolocation Currency Handler
 * Integrated with Selar Direct Checkout & Dynamic 4x Hardcopy Pricing
 */

const SELAR_CURRENCY_DATA = {
  "NGN": {
    "currency": "NGN",
    "symbol": "₦",
    "ebook": "₦40,000.00",
    "hardcopy": "₦160,000.00",
    "ebookStrike": "₦70,000",
    "hardcopyStrike": "₦280,000",
    "countryName": "Nigeria"
  },
  "GHS": {
    "currency": "GHS",
    "symbol": "GH¢",
    "ebook": "GH¢350.00",
    "hardcopy": "GH¢1,400.00",
    "ebookStrike": "GH¢700",
    "hardcopyStrike": "GH¢2,800",
    "countryName": "Ghana"
  },
  "KES": {
    "currency": "KES",
    "symbol": "KSh",
    "ebook": "KSh3,999.00",
    "hardcopy": "KSh15,996.00",
    "ebookStrike": "KSh5,000",
    "hardcopyStrike": "KSh20,000",
    "countryName": "Kenya"
  },
  "ZAR": {
    "currency": "ZAR",
    "symbol": "R",
    "ebook": "R499.00",
    "hardcopy": "R1,996.00",
    "ebookStrike": "R700",
    "hardcopyStrike": "R2,800",
    "countryName": "South Africa"
  },
  "TZS": {
    "currency": "TZS",
    "symbol": "TSh",
    "ebook": "TSh79,900.00",
    "hardcopy": "TSh319,600.00",
    "ebookStrike": "TSh100,000",
    "hardcopyStrike": "TSh400,000",
    "countryName": "Tanzania"
  },
  "UGX": {
    "currency": "UGX",
    "symbol": "USh",
    "ebook": "USh119,000.00",
    "hardcopy": "USh476,000.00",
    "ebookStrike": "USh150,000",
    "hardcopyStrike": "USh600,000",
    "countryName": "Uganda"
  },
  "XAF": {
    "currency": "XAF",
    "symbol": "CFA",
    "ebook": "CFA19,900.00",
    "hardcopy": "CFA79,600.00",
    "ebookStrike": "CFA40,000",
    "hardcopyStrike": "CFA160,000",
    "countryName": "Cameroon / Central Africa"
  },
  "XOF": {
    "currency": "XOF",
    "symbol": "CFA",
    "ebook": "CFA32,085.41",
    "hardcopy": "CFA128,341.64",
    "ebookStrike": "CFA65,000",
    "hardcopyStrike": "CFA260,000",
    "countryName": "Côte d'Ivoire / West Africa"
  },
  "RWF": {
    "currency": "RWF",
    "symbol": "R₣",
    "ebook": "R₣78,324.79",
    "hardcopy": "R₣313,299.16",
    "ebookStrike": "R₣150,000",
    "hardcopyStrike": "R₣600,000",
    "countryName": "Rwanda"
  },
  "ZMW": {
    "currency": "ZMW",
    "symbol": "ZK",
    "ebook": "ZMW1,034.07",
    "hardcopy": "ZMW4,136.28",
    "ebookStrike": "ZMW2,000",
    "hardcopyStrike": "ZMW8,000",
    "countryName": "Zambia"
  },
  "SLE": {
    "currency": "SLE",
    "symbol": "Le",
    "ebook": "Le1,280.67",
    "hardcopy": "Le5,122.68",
    "ebookStrike": "Le2,500",
    "hardcopyStrike": "Le10,000",
    "countryName": "Sierra Leone"
  },
  "USD": {
    "currency": "USD",
    "symbol": "$",
    "ebook": "$49.00",
    "hardcopy": "$196.00",
    "ebookStrike": "$98.00",
    "hardcopyStrike": "$392.00",
    "countryName": "Global"
  },
  "GBP": {
    "currency": "GBP",
    "symbol": "£",
    "ebook": "£37.68",
    "hardcopy": "£150.72",
    "ebookStrike": "£75.00",
    "hardcopyStrike": "£300.00",
    "countryName": "United Kingdom"
  }
};

const COUNTRY_MAP = {
  NG: { currency: 'NGN', countryName: 'Nigeria', isAfrican: true },
  GH: { currency: 'GHS', countryName: 'Ghana', isAfrican: true },
  KE: { currency: 'KES', countryName: 'Kenya', isAfrican: true },
  ZA: { currency: 'ZAR', countryName: 'South Africa', isAfrican: true },
  NA: { currency: 'ZAR', countryName: 'Namibia', isAfrican: true },
  SZ: { currency: 'ZAR', countryName: 'Eswatini', isAfrican: true },
  LS: { currency: 'ZAR', countryName: 'Lesotho', isAfrican: true },
  TZ: { currency: 'TZS', countryName: 'Tanzania', isAfrican: true },
  UG: { currency: 'UGX', countryName: 'Uganda', isAfrican: true },
  RW: { currency: 'RWF', countryName: 'Rwanda', isAfrican: true },
  ZM: { currency: 'ZMW', countryName: 'Zambia', isAfrican: true },
  SL: { currency: 'SLE', countryName: 'Sierra Leone', isAfrican: true },
  
  // XAF (Central Africa)
  CM: { currency: 'XAF', countryName: 'Cameroon', isAfrican: true },
  GA: { currency: 'XAF', countryName: 'Gabon', isAfrican: true },
  CG: { currency: 'XAF', countryName: 'Republic of the Congo', isAfrican: true },
  CD: { currency: 'XAF', countryName: 'DR Congo', isAfrican: true },
  TD: { currency: 'XAF', countryName: 'Chad', isAfrican: true },
  GQ: { currency: 'XAF', countryName: 'Equatorial Guinea', isAfrican: true },
  CF: { currency: 'XAF', countryName: 'Central African Republic', isAfrican: true },

  // XOF (West Africa)
  CI: { currency: 'XOF', countryName: "Côte d'Ivoire", isAfrican: true },
  SN: { currency: 'XOF', countryName: 'Senegal', isAfrican: true },
  BJ: { currency: 'XOF', countryName: 'Benin', isAfrican: true },
  BF: { currency: 'XOF', countryName: 'Burkina Faso', isAfrican: true },
  ML: { currency: 'XOF', countryName: 'Mali', isAfrican: true },
  NE: { currency: 'XOF', countryName: 'Niger', isAfrican: true },
  TG: { currency: 'XOF', countryName: 'Togo', isAfrican: true },
  GW: { currency: 'XOF', countryName: 'Guinea-Bissau', isAfrican: true },

  // Other African Countries
  EG: { currency: 'USD', countryName: 'Egypt', isAfrican: true },
  MA: { currency: 'USD', countryName: 'Morocco', isAfrican: true },
  ET: { currency: 'USD', countryName: 'Ethiopia', isAfrican: true },
  DZ: { currency: 'USD', countryName: 'Algeria', isAfrican: true },
  TN: { currency: 'USD', countryName: 'Tunisia', isAfrican: true },
  BW: { currency: 'USD', countryName: 'Botswana', isAfrican: true },
  MU: { currency: 'USD', countryName: 'Mauritius', isAfrican: true },
  ZW: { currency: 'USD', countryName: 'Zimbabwe', isAfrican: true },
  AO: { currency: 'USD', countryName: 'Angola', isAfrican: true },
  MZ: { currency: 'USD', countryName: 'Mozambique', isAfrican: true },
  MG: { currency: 'USD', countryName: 'Madagascar', isAfrican: true },
  MW: { currency: 'USD', countryName: 'Malawi', isAfrican: true },
  GM: { currency: 'USD', countryName: 'Gambia', isAfrican: true },
  LR: { currency: 'USD', countryName: 'Liberia', isAfrican: true },
  GN: { currency: 'USD', countryName: 'Guinea', isAfrican: true },
  SO: { currency: 'USD', countryName: 'Somalia', isAfrican: true },
  SD: { currency: 'USD', countryName: 'Sudan', isAfrican: true },
  SS: { currency: 'USD', countryName: 'South Sudan', isAfrican: true },

  GB: { currency: 'GBP', countryName: 'United Kingdom', isAfrican: false },
  US: { currency: 'USD', countryName: 'United States', isAfrican: false }
};

const TIMEZONE_TO_COUNTRY = {
  'Africa/Lagos': 'NG',
  'Africa/Accra': 'GH',
  'Africa/Nairobi': 'KE',
  'Africa/Johannesburg': 'ZA',
  'Africa/Dar_es_Salaam': 'TZ',
  'Africa/Kampala': 'UG',
  'Africa/Kigali': 'RW',
  'Africa/Lusaka': 'ZM',
  'Africa/Freetown': 'SL',
  'Africa/Douala': 'CM',
  'Africa/Libreville': 'GA',
  'Africa/Brazzaville': 'CG',
  'Africa/Kinshasa': 'CD',
  'Africa/Abidjan': 'CI',
  'Africa/Dakar': 'SN',
  'Africa/Cairo': 'EG',
  'Africa/Casablanca': 'MA',
  'Africa/Addis_Ababa': 'ET',
  'Africa/Algiers': 'DZ',
  'Africa/Tunis': 'TN',
  'Africa/Gaborone': 'BW',
  'Africa/Maputo': 'MZ',
  'Africa/Harare': 'ZW',
  'Africa/Windhoek': 'NA',
  'Africa/Luanda': 'AO'
};

let currentVisitorCurrency = 'NGN';
let currentVisitorInfo = SELAR_CURRENCY_DATA['NGN'];

function updateDOMPrices(info) {
  if (!info) return;
  currentVisitorInfo = info;
  currentVisitorCurrency = info.currency;

  // 1. Update Swatch Cards (E-Book vs Hardcopy 4x)
  document.querySelectorAll('.luxury-swatch-card, [data-swatch-option]').forEach(card => {
    const opt = (card.dataset.swatchOption || card.getAttribute('data-swatch-option') || '').toLowerCase();
    const priceEl = card.querySelector('.luxury-card-price') || card.querySelector('.price') || card.querySelector('[class*="price"]');
    if (priceEl) {
      if (opt.includes('hard')) {
        priceEl.textContent = info.hardcopy;
      } else {
        priceEl.textContent = info.ebook;
      }
    }
  });

  // 2. Update Main / Sale Price Elements
  const currentPriceSelectors = [
    '.product__price--sale',
    '.current-price',
    '[data-product-price]',
    '.arch-pill-price-active',
    '.arch-sticky-bar__price'
  ];

  document.querySelectorAll(currentPriceSelectors.join(', ')).forEach(el => {
    el.textContent = info.ebook;
  });

  // 3. Update Strike / Old Price Elements
  const oldPriceSelectors = [
    '.product__price--old',
    '.old-price',
    '[data-product-price-sale]',
    '.arch-pill-price-cut'
  ];

  if (info.ebookStrike) {
    document.querySelectorAll(oldPriceSelectors.join(', ')).forEach(el => {
      el.textContent = info.ebookStrike;
      el.style.display = '';
    });
  }

  // 4. Update or Insert Location Badge
  let badge = document.getElementById('geo-location-badge');
  if (!badge) {
    badge = document.createElement('div');
    badge.id = 'geo-location-badge';
    badge.style.cssText = 'display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #fff7ed; border: 1px solid #fdba74; border-radius: 9999px; font-size: 13px; font-weight: 600; color: #9a3412; margin: 10px 0 14px 0; box-shadow: 0 1px 3px rgba(234, 88, 12, 0.08);';
    
    const priceHolder = document.querySelector('.product__price--holder') || document.querySelector('.product-form') || document.querySelector('[data-buy-button]')?.parentElement;
    if (priceHolder && priceHolder.parentElement) {
      priceHolder.parentElement.insertBefore(badge, priceHolder);
    }
  }

  if (badge) {
    badge.innerHTML = `<span>📍 Special price for <strong>${info.countryName}</strong>:</span> <span style="font-weight: 800; color: #ea580c;">${info.ebook}</span> <span style="text-decoration: line-through; color: #9ca3af; font-size: 11px; margin-left: 2px;">${info.ebookStrike}</span>`;
  }
}

async function detectAndApplyGeoCurrency() {
  const urlParams = new URLSearchParams(window.location.search);
  const currParam = urlParams.get('currency')?.toUpperCase();
  const countryParam = urlParams.get('country')?.toUpperCase();

  // 1. Explicit Query Param
  if (currParam && SELAR_CURRENCY_DATA[currParam]) {
    const info = {
      ...SELAR_CURRENCY_DATA[currParam],
      countryName: countryParam && COUNTRY_MAP[countryParam] ? COUNTRY_MAP[countryParam].countryName : SELAR_CURRENCY_DATA[currParam].countryName
    };
    updateDOMPrices(info);
    return;
  }

  if (countryParam && COUNTRY_MAP[countryParam]) {
    const c = COUNTRY_MAP[countryParam];
    const info = {
      ...(SELAR_CURRENCY_DATA[c.currency] || SELAR_CURRENCY_DATA['NGN']),
      countryName: c.countryName
    };
    updateDOMPrices(info);
    return;
  }

  // 2. Cached
  try {
    const cached = localStorage.getItem('visitor_geo_currency');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - (parsed.timestamp || 0) < 86400000 && parsed.currency && SELAR_CURRENCY_DATA[parsed.currency]) {
        updateDOMPrices({
          ...SELAR_CURRENCY_DATA[parsed.currency],
          countryName: parsed.countryName || SELAR_CURRENCY_DATA[parsed.currency].countryName
        });
        return;
      }
    }
  } catch(e) {}

  // 3. Fast Geo Lookup
  let detectedCountry = '';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);
    const res = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.country_code) {
        detectedCountry = data.country_code.toUpperCase();
      }
    }
  } catch(err) {
    try {
      const res = await fetch('https://api.country.is/');
      if (res.ok) {
        const data = await res.json();
        if (data && data.country) {
          detectedCountry = data.country.toUpperCase();
        }
      }
    } catch(e2) {}
  }

  // 4. Timezone Fallback
  if (!detectedCountry && typeof Intl !== 'undefined') {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && TIMEZONE_TO_COUNTRY[tz]) {
        detectedCountry = TIMEZONE_TO_COUNTRY[tz];
      }
    } catch(e3) {}
  }

  // Default to NGN
  if (!detectedCountry) {
    detectedCountry = 'NG';
  }

  const mapping = COUNTRY_MAP[detectedCountry] || { currency: 'NGN', countryName: 'Nigeria', isAfrican: true };
  const currencyCode = mapping.currency || 'NGN';
  const info = {
    ...(SELAR_CURRENCY_DATA[currencyCode] || SELAR_CURRENCY_DATA['NGN']),
    countryName: mapping.countryName
  };

  try {
    localStorage.setItem('visitor_geo_currency', JSON.stringify({
      countryCode: detectedCountry,
      countryName: mapping.countryName,
      currency: currencyCode,
      timestamp: Date.now()
    }));
  } catch(e) {}

  updateDOMPrices(info);
}

/**
 * Main Checkout Handler - Direct Selar Checkout
 */
function handleCheckout(orderData) {
  if (orderData && orderData.variantTitle && orderData.variantTitle.toLowerCase().includes('hard')) {
    alert('The Deluxe Printed Hardcopy edition is currently out of stock. Please select the E-Book edition for instant access.');
    return;
  }

  const selarDirectUrl = `https://sketchup.selar.com/581484b788?add_to_cart=1&currency=${encodeURIComponent(currentVisitorCurrency)}`;
  window.location.href = selarDirectUrl;
}

function initSwatchSelector() {
  const handleSwatchClick = (e) => {
    const card = e.target.closest('.luxury-swatch-card, [data-swatch-option]');
    if (!card) return;
    e.preventDefault();
    e.stopPropagation();

    const option = card.dataset.swatchOption || card.getAttribute('data-swatch-option') || 'E-Book';
    const isHardcopy = option.toLowerCase().includes('hard') || card.dataset.swatchSoldout === 'true';

    document.querySelectorAll('.luxury-swatch-card, [data-swatch-option]').forEach(c => {
      const cOpt = c.dataset.swatchOption || c.getAttribute('data-swatch-option');
      if (cOpt === option) {
        c.classList.add('swatch--active');
      } else {
        c.classList.remove('swatch--active');
      }
    });

    if (isHardcopy) {
      alert('The Deluxe Printed Hardcopy edition is currently out of stock. Please select the E-Book edition for instant access.');
    }
  };

  document.querySelectorAll('.luxury-swatch-card, [data-swatch-option]').forEach(card => {
    card.style.cursor = 'pointer';
    card.removeEventListener('click', handleSwatchClick);
    card.addEventListener('click', handleSwatchClick);
  });
}

function initCheckoutListeners() {
  const attachButtons = () => {
    const buyButtons = document.querySelectorAll('[data-buy-button], .product-form__buttons button, [name="add"], form[action*="/cart/add"] button[type="submit"], .button--primary, .bstr-sticky-btn');
    buyButtons.forEach(btn => {
      if (btn.dataset.selarAttached) return;
      btn.dataset.selarAttached = 'true';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleCheckout({ productTitle: '6 Books For Interior & Exterior Design', variantTitle: 'E-Book Edition' });
      });
    });
  };

  attachButtons();
  setTimeout(attachButtons, 500);
  setTimeout(attachButtons, 1500);
}

// Immediate execution & on DOM ready
detectAndApplyGeoCurrency();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initSwatchSelector();
    initCheckoutListeners();
    detectAndApplyGeoCurrency();
  });
} else {
  initSwatchSelector();
  initCheckoutListeners();
  detectAndApplyGeoCurrency();
}
// Repeat after 500ms and 1500ms to catch any lazy-rendered elements
setTimeout(detectAndApplyGeoCurrency, 300);
setTimeout(detectAndApplyGeoCurrency, 1000);
