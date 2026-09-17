// African and Global currency mapping from Selar product: https://sketchup.selar.com/581484b788

export interface CurrencyInfo {
  currency: string;
  symbol: string;
  price: number | string;
  priceFormatted: string;
  originalPriceFormatted?: string;
  hardcopyPriceFormatted: string;
  hardcopyOriginalPriceFormatted?: string;
  countryCode: string;
  countryName: string;
  isAfrican: boolean;
  selarUrl: string;
}

export const SELAR_CURRENCY_DATA: Record<string, Omit<CurrencyInfo, 'countryCode' | 'countryName' | 'isAfrican' | 'selarUrl'>> = {
  NGN: {
    currency: 'NGN',
    symbol: '₦',
    price: '40,000.00',
    priceFormatted: '₦40,000.00',
    originalPriceFormatted: '₦70,000',
    hardcopyPriceFormatted: '₦160,000.00',
    hardcopyOriginalPriceFormatted: '₦280,000',
  },
  GHS: {
    currency: 'GHS',
    symbol: 'GH¢',
    price: '350.00',
    priceFormatted: 'GH¢350.00',
    originalPriceFormatted: 'GH¢700',
    hardcopyPriceFormatted: 'GH¢1,400.00',
    hardcopyOriginalPriceFormatted: 'GH¢2,800',
  },
  KES: {
    currency: 'KES',
    symbol: 'KSh',
    price: '3,999.00',
    priceFormatted: 'KSh3,999.00',
    originalPriceFormatted: 'KSh5,000',
    hardcopyPriceFormatted: 'KSh15,996.00',
    hardcopyOriginalPriceFormatted: 'KSh20,000',
  },
  ZAR: {
    currency: 'ZAR',
    symbol: 'R',
    price: '499.00',
    priceFormatted: 'R499.00',
    originalPriceFormatted: 'R700',
    hardcopyPriceFormatted: 'R1,996.00',
    hardcopyOriginalPriceFormatted: 'R2,800',
  },
  TZS: {
    currency: 'TZS',
    symbol: 'TSh',
    price: '79,900.00',
    priceFormatted: 'TSh79,900.00',
    originalPriceFormatted: 'TSh100,000',
    hardcopyPriceFormatted: 'TSh319,600.00',
    hardcopyOriginalPriceFormatted: 'TSh400,000',
  },
  UGX: {
    currency: 'UGX',
    symbol: 'USh',
    price: '119,000.00',
    priceFormatted: 'USh119,000.00',
    originalPriceFormatted: 'USh150,000',
    hardcopyPriceFormatted: 'USh476,000.00',
    hardcopyOriginalPriceFormatted: 'USh600,000',
  },
  XAF: {
    currency: 'XAF',
    symbol: 'CFA',
    price: '19,900.00',
    priceFormatted: 'CFA19,900.00',
    originalPriceFormatted: 'CFA40,000',
    hardcopyPriceFormatted: 'CFA79,600.00',
    hardcopyOriginalPriceFormatted: 'CFA160,000',
  },
  XOF: {
    currency: 'XOF',
    symbol: 'CFA',
    price: '32,085.41',
    priceFormatted: 'CFA32,085.41',
    originalPriceFormatted: 'CFA65,000',
    hardcopyPriceFormatted: 'CFA128,341.64',
    hardcopyOriginalPriceFormatted: 'CFA260,000',
  },
  RWF: {
    currency: 'RWF',
    symbol: 'R₣',
    price: '78,324.79',
    priceFormatted: 'R₣78,324.79',
    originalPriceFormatted: 'R₣150,000',
    hardcopyPriceFormatted: 'R₣313,299.16',
    hardcopyOriginalPriceFormatted: 'R₣600,000',
  },
  ZMW: {
    currency: 'ZMW',
    symbol: 'ZK',
    price: '1,034.07',
    priceFormatted: 'ZMW1,034.07',
    originalPriceFormatted: 'ZMW2,000',
    hardcopyPriceFormatted: 'ZMW4,136.28',
    hardcopyOriginalPriceFormatted: 'ZMW8,000',
  },
  SLE: {
    currency: 'SLE',
    symbol: 'Le',
    price: '1,280.67',
    priceFormatted: 'Le1,280.67',
    originalPriceFormatted: 'Le2,500',
    hardcopyPriceFormatted: 'Le5,122.68',
    hardcopyOriginalPriceFormatted: 'Le10,000',
  },
  USD: {
    currency: 'USD',
    symbol: '$',
    price: '49.00',
    priceFormatted: '$49.00',
    originalPriceFormatted: '$98.00',
    hardcopyPriceFormatted: '$196.00',
    hardcopyOriginalPriceFormatted: '$392.00',
  },
  GBP: {
    currency: 'GBP',
    symbol: '£',
    price: '37.68',
    priceFormatted: '£37.68',
    originalPriceFormatted: '£75.00',
    hardcopyPriceFormatted: '£150.72',
    hardcopyOriginalPriceFormatted: '£300.00',
  },
};

// Map ISO 2-letter Country Codes to Currencies & Names
export const COUNTRY_MAP: Record<string, { currency: string; countryName: string; isAfrican: boolean }> = {
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
  
  CM: { currency: 'XAF', countryName: 'Cameroon', isAfrican: true },
  GA: { currency: 'XAF', countryName: 'Gabon', isAfrican: true },
  CG: { currency: 'XAF', countryName: 'Republic of the Congo', isAfrican: true },
  CD: { currency: 'XAF', countryName: 'DR Congo', isAfrican: true },
  TD: { currency: 'XAF', countryName: 'Chad', isAfrican: true },
  GQ: { currency: 'XAF', countryName: 'Equatorial Guinea', isAfrican: true },
  CF: { currency: 'XAF', countryName: 'Central African Republic', isAfrican: true },

  CI: { currency: 'XOF', countryName: "Côte d'Ivoire", isAfrican: true },
  SN: { currency: 'XOF', countryName: 'Senegal', isAfrican: true },
  BJ: { currency: 'XOF', countryName: 'Benin', isAfrican: true },
  BF: { currency: 'XOF', countryName: 'Burkina Faso', isAfrican: true },
  ML: { currency: 'XOF', countryName: 'Mali', isAfrican: true },
  NE: { currency: 'XOF', countryName: 'Niger', isAfrican: true },
  TG: { currency: 'XOF', countryName: 'Togo', isAfrican: true },
  GW: { currency: 'XOF', countryName: 'Guinea-Bissau', isAfrican: true },

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
  US: { currency: 'USD', countryName: 'United States', isAfrican: false },
};

const TIMEZONE_TO_COUNTRY: Record<string, string> = {
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
  'Africa/Luanda': 'AO',
};

export function getSelarDirectCheckoutUrl(currency: string): string {
  const code = (currency || 'NGN').toUpperCase();
  return `https://sketchup.selar.com/581484b788?add_to_cart=1&currency=${code}`;
}

export function buildCurrencyInfo(countryCode: string, currencyOverride?: string): CurrencyInfo {
  let mapped = COUNTRY_MAP[countryCode.toUpperCase()];
  let currency = currencyOverride || (mapped ? mapped.currency : 'NGN');
  let countryName = mapped ? mapped.countryName : (countryCode ? countryCode : 'Nigeria');
  let isAfrican = mapped ? mapped.isAfrican : true;

  const data = SELAR_CURRENCY_DATA[currency] || SELAR_CURRENCY_DATA['NGN'];

  return {
    ...data,
    currency,
    countryCode: countryCode || 'NG',
    countryName,
    isAfrican,
    selarUrl: getSelarDirectCheckoutUrl(currency),
  };
}

export async function detectVisitorCurrency(): Promise<CurrencyInfo> {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const currParam = params.get('currency')?.toUpperCase();
    const countryParam = params.get('country')?.toUpperCase();

    if (currParam && SELAR_CURRENCY_DATA[currParam]) {
      const cc = countryParam || (currParam === 'NGN' ? 'NG' : currParam === 'GHS' ? 'GH' : currParam === 'KES' ? 'KE' : currParam === 'ZAR' ? 'ZA' : 'US');
      return buildCurrencyInfo(cc, currParam);
    }

    if (countryParam && COUNTRY_MAP[countryParam]) {
      return buildCurrencyInfo(countryParam);
    }

    try {
      const cached = localStorage.getItem('visitor_geo_currency');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - (parsed.timestamp || 0) < 86400000 && parsed.countryCode) {
          return buildCurrencyInfo(parsed.countryCode, parsed.currency);
        }
      }
    } catch (e) {}
  }

  let detectedCountry = '';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.country_code) {
        detectedCountry = data.country_code.toUpperCase();
      }
    }
  } catch (err) {
    try {
      const res = await fetch('https://api.country.is/');
      if (res.ok) {
        const data = await res.json();
        if (data && data.country) {
          detectedCountry = data.country.toUpperCase();
        }
      }
    } catch (e2) {}
  }

  if (!detectedCountry && typeof Intl !== 'undefined') {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && TIMEZONE_TO_COUNTRY[tz]) {
        detectedCountry = TIMEZONE_TO_COUNTRY[tz];
      }
    } catch (e3) {}
  }

  if (!detectedCountry) {
    detectedCountry = 'NG';
  }

  const result = buildCurrencyInfo(detectedCountry);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('visitor_geo_currency', JSON.stringify({
        countryCode: result.countryCode,
        currency: result.currency,
        timestamp: Date.now()
      }));
    } catch (e) {}
  }

  return result;
}
