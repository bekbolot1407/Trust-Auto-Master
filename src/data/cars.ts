import type {
  AuctionHouse,
  BodyType,
  CarListing,
  DriveType,
  ExportCountry,
  FuelType,
  KoreanDealer,
  PlatformCategory,
  PlatformSource,
  SegmentKey,
  TransmissionType,
} from '../types/car';

export const IMG_10K = '/src/assets/images/kia_morning_10k_1794660023595.jpg';
export const IMG_13K = '/src/assets/images/hyundai_avante_13k_1794660024650.jpg';
export const IMG_18K = '/src/assets/images/hyundai_santafe_18k_1794660025182.jpg';
export const IMG_25K = '/src/assets/images/hyundai_palisade_25k_1794660027364.jpg';
export const IMG_PREMIUM = '/src/assets/images/bmw_x7_premium_1794660025372.jpg';
export const IMG_15K = '/src/assets/images/car_segment_15k_1794647135143.jpg';
export const IMG_20K = '/src/assets/images/car_segment_20k_1794647135737.jpg';
export const IMG_ALT_10K = '/src/assets/images/car_segment_10k_1794647134449.jpg';
export const IMG_ALT_25K = '/src/assets/images/car_segment_25k_1794647136091.jpg';
export const IMG_ALT_PREMIUM = '/src/assets/images/car_segment_premium_1794647136438.jpg';
export const IMG_EV = '/src/assets/images/car_catalog_ev_1794647137081.jpg';
export const IMG_COUPE = '/src/assets/images/car_catalog_coupe_1794647137908.jpg';
export const IMG_OFFROAD = '/src/assets/images/car_catalog_offroad_1794647137765.jpg';

export const EXPORT_COUNTRIES: { name: ExportCountry; flag: string; transit: string }[] = [
  { name: 'Южная Корея', flag: '🇰🇷', transit: '25–35 дней' },
  { name: 'США', flag: '🇺🇸', transit: '45–60 дней' },
  { name: 'Китай', flag: '🇨🇳', transit: '10–18 дней' },
  { name: 'Япония', flag: '🇯🇵', transit: '30–40 дней' },
  { name: 'Дубай', flag: '🇦🇪', transit: '20–30 дней' },
  { name: 'Грузия', flag: '🇬🇪', transit: '10–14 дней' },
  { name: 'Европа', flag: '🇪🇺', transit: '20–30 дней' },
];

export const KOREAN_DEALERS: KoreanDealer[] = [
  'Encar',
  'KB Chachacha',
  'K Car',
  'Lotte',
  'HeyDealer',
  'AutoBell',
];

export const AUCTION_HOUSES: AuctionHouse[] = [
  'HeyDealer',
  'Lotte Auction',
  'Hyundai Glovis',
  'AutoBell',
  'KCar',
  'AutoHub',
];

export const UPCOMING_AUCTIONS: { label: string; house: AuctionHouse }[] = [
  { label: 'HeyDealer — 18 ноября', house: 'HeyDealer' },
  { label: 'Lotte Auto Global — 18 ноября', house: 'Lotte Auction' },
  { label: 'Hyundai Glovis — 19 ноября', house: 'Hyundai Glovis' },
  { label: 'AutoBell — 20 ноября', house: 'AutoBell' },
  { label: 'KCar Auction — 21 ноября', house: 'KCar' },
  { label: 'AutoHub — 22 ноября', house: 'AutoHub' },
  { label: 'HeyDealer Zero — 24 ноября', house: 'HeyDealer' },
  { label: 'Lotte Rental — 25 ноября', house: 'Lotte Auction' },
  { label: 'Hyundai Glovis Sihwa — 26 ноября', house: 'Hyundai Glovis' },
  { label: 'AutoBell Global — 28 ноября', house: 'AutoBell' },
];

export const SOURCE_PLATFORMS: PlatformSource[] = [
  'Наш автопарк',
  ...KOREAN_DEALERS,
];

export interface SegmentConfig {
  key: SegmentKey;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  maxPrice?: number;
  minPrice?: number;
}

export const SEGMENTS: SegmentConfig[] = [
  {
    key: 'under-10k',
    title: 'до 10 000$ под ключ',
    subtitle: 'под ключ',
    badge: 'Kia Morning GT Line 2026',
    image: IMG_10K,
    maxPrice: 10000,
  },
  {
    key: 'under-15k',
    title: 'до 15 000$ под ключ',
    subtitle: 'под ключ',
    badge: 'Hyundai Avante CN7 2023',
    image: IMG_13K,
    maxPrice: 15000,
  },
  {
    key: 'under-20k',
    title: 'до 20 000$ под ключ',
    subtitle: 'под ключ',
    badge: 'Hyundai Santa Fe Calligraphy',
    image: IMG_18K,
    maxPrice: 20000,
  },
  {
    key: 'under-25k',
    title: 'до 25 000$ под ключ',
    subtitle: 'под ключ',
    badge: 'Hyundai Palisade LX3 2025',
    image: IMG_25K,
    maxPrice: 25000,
  },
  {
    key: 'premium',
    title: 'Премиум',
    subtitle: 'от дилера',
    badge: 'BMW X7 G07 xDrive 40i',
    image: IMG_PREMIUM,
    minPrice: 25001,
  },
];

interface ModelTemplate {
  brand: string;
  model: string;
  trims: string[];
  bodyType: BodyType;
  fuels: FuelType[];
  engineCc: number;
  transmissions: TransmissionType[];
  drives: DriveType[];
  basePrice: number;
  countries: ExportCountry[];
  image: string;
}

const TEMPLATES: ModelTemplate[] = [
  {
    brand: 'Hyundai',
    model: 'The New Avante (CN7)',
    trims: ['1.6 Inspiration', 'Modern', 'Smart'],
    bodyType: 'Седан',
    fuels: ['Бензин', 'Газ (LPG)', 'Гибрид'],
    engineCc: 1598,
    transmissions: ['Вариатор', 'Автомат'],
    drives: ['Передний'],
    basePrice: 11200,
    countries: ['Южная Корея', 'США', 'Грузия'],
    image: IMG_13K,
  },
  {
    brand: 'Kia',
    model: 'K3',
    trims: ['Prestige', 'Signature', 'Trendy'],
    bodyType: 'Седан',
    fuels: ['Бензин', 'Газ (LPG)'],
    engineCc: 1598,
    transmissions: ['Вариатор', 'Автомат'],
    drives: ['Передний'],
    basePrice: 8600,
    countries: ['Южная Корея'],
    image: IMG_ALT_10K,
  },
  {
    brand: 'Chevrolet',
    model: 'Spark / Trax',
    trims: ['Premier', 'LT', 'RS'],
    bodyType: 'Хэтчбек',
    fuels: ['Бензин'],
    engineCc: 1399,
    transmissions: ['Вариатор', 'Автомат'],
    drives: ['Передний'],
    basePrice: 7800,
    countries: ['Южная Корея', 'США', 'Грузия'],
    image: IMG_ALT_10K,
  },
  {
    brand: 'Kia',
    model: 'The New Morning (JA)',
    trims: ['GT Line', 'Signature', 'Prestige'],
    bodyType: 'Хэтчбек',
    fuels: ['Бензин'],
    engineCc: 998,
    transmissions: ['Автомат'],
    drives: ['Передний'],
    basePrice: 8200,
    countries: ['Южная Корея'],
    image: IMG_10K,
  },
  {
    brand: 'Hyundai',
    model: 'Sonata DN8',
    trims: ['Inspiration', 'Premium Plus', 'Sensuous'],
    bodyType: 'Седан',
    fuels: ['Бензин', 'Гибрид', 'Газ (LPG)'],
    engineCc: 1999,
    transmissions: ['Автомат'],
    drives: ['Передний'],
    basePrice: 12900,
    countries: ['Южная Корея', 'США'],
    image: IMG_COUPE,
  },
  {
    brand: 'Kia',
    model: 'K5 DL3',
    trims: ['Noblesse', 'Signature', 'Prestige'],
    bodyType: 'Седан',
    fuels: ['Бензин', 'Гибрид', 'Газ (LPG)'],
    engineCc: 1999,
    transmissions: ['Автомат'],
    drives: ['Передний'],
    basePrice: 13500,
    countries: ['Южная Корея', 'США'],
    image: IMG_COUPE,
  },
  {
    brand: 'Toyota',
    model: 'Camry XV70',
    trims: ['SE', 'XLE', 'XSE Hybrid'],
    bodyType: 'Седан',
    fuels: ['Бензин', 'Гибрид'],
    engineCc: 2487,
    transmissions: ['Автомат', 'Вариатор'],
    drives: ['Передний'],
    basePrice: 16800,
    countries: ['США', 'Дубай', 'Грузия', 'Япония'],
    image: IMG_COUPE,
  },
  {
    brand: 'Hyundai',
    model: 'Tucson NX4',
    trims: ['Inspiration', 'Modern', 'Hybrid AWD'],
    bodyType: 'Кроссовер',
    fuels: ['Бензин', 'Дизель', 'Гибрид'],
    engineCc: 1598,
    transmissions: ['Робот', 'Автомат'],
    drives: ['Передний', 'Полный (AWD)'],
    basePrice: 14600,
    countries: ['Южная Корея', 'США', 'Китай'],
    image: IMG_15K,
  },
  {
    brand: 'Kia',
    model: 'Sportage NQ5',
    trims: ['Noblesse', 'Signature Gravity', 'Prestige'],
    bodyType: 'Кроссовер',
    fuels: ['Бензин', 'Дизель', 'Гибрид'],
    engineCc: 1999,
    transmissions: ['Автомат', 'Робот'],
    drives: ['Передний', 'Полный (AWD)'],
    basePrice: 14900,
    countries: ['Южная Корея', 'США', 'Европа'],
    image: IMG_15K,
  },
  {
    brand: 'Kia',
    model: 'Sorento MQ4',
    trims: ['Noblesse', 'Signature', 'Gravity'],
    bodyType: 'Кроссовер',
    fuels: ['Дизель', 'Гибрид', 'Бензин'],
    engineCc: 2151,
    transmissions: ['Робот', 'Автомат'],
    drives: ['Полный (AWD)', 'Передний'],
    basePrice: 18900,
    countries: ['Южная Корея', 'США'],
    image: IMG_20K,
  },
  {
    brand: 'Hyundai',
    model: 'Новый Santa Fe',
    trims: ['Calligraphy', 'Prestige', 'Exclusive'],
    bodyType: 'Кроссовер',
    fuels: ['Дизель', 'Бензин', 'Гибрид'],
    engineCc: 2497,
    transmissions: ['Робот', 'Автомат'],
    drives: ['Полный (AWD)'],
    basePrice: 16200,
    countries: ['Южная Корея', 'США'],
    image: IMG_18K,
  },
  {
    brand: 'Kia',
    model: 'Carnival KA4',
    trims: ['Noblesse 9-мест', 'Signature Limousine'],
    bodyType: 'Минивэн',
    fuels: ['Дизель', 'Бензин'],
    engineCc: 2151,
    transmissions: ['Автомат'],
    drives: ['Передний'],
    basePrice: 17600,
    countries: ['Южная Корея'],
    image: IMG_20K,
  },
  {
    brand: 'Hyundai',
    model: 'Palisade (LX3)',
    trims: ['HEV 2.5T 4WD 7-местный Calligraphy', 'Prestige'],
    bodyType: 'Внедорожник',
    fuels: ['Гибрид', 'Бензин'],
    engineCc: 2497,
    transmissions: ['Автомат'],
    drives: ['Полный (AWD)'],
    basePrice: 23200,
    countries: ['Южная Корея', 'США'],
    image: IMG_25K,
  },
  {
    brand: 'Toyota',
    model: 'Highlander',
    trims: ['Limited', 'Platinum Hybrid', 'XLE'],
    bodyType: 'Внедорожник',
    fuels: ['Гибрид', 'Бензин'],
    engineCc: 2487,
    transmissions: ['Вариатор', 'Автомат'],
    drives: ['Полный (AWD)'],
    basePrice: 24200,
    countries: ['США', 'Дубай', 'Грузия'],
    image: IMG_25K,
  },
  {
    brand: 'Zeekr',
    model: '001 / X',
    trims: ['YOU 100 kWh', 'WE 86 kWh', 'ME AWD'],
    bodyType: 'Кроссовер',
    fuels: ['Электро'],
    engineCc: 0,
    transmissions: ['Автомат'],
    drives: ['Полный (AWD)'],
    basePrice: 23900,
    countries: ['Китай'],
    image: IMG_EV,
  },
  {
    brand: 'Li Auto',
    model: 'L7 / L9',
    trims: ['Max', 'Pro', 'Ultra'],
    bodyType: 'Внедорожник',
    fuels: ['Гибрид'],
    engineCc: 1496,
    transmissions: ['Автомат'],
    drives: ['Полный (AWD)'],
    basePrice: 31500,
    countries: ['Китай'],
    image: IMG_EV,
  },
  {
    brand: 'BYD',
    model: 'Song Plus / Han',
    trims: ['Flagship EV', 'DM-i Champion'],
    bodyType: 'Кроссовер',
    fuels: ['Электро', 'Гибрид'],
    engineCc: 0,
    transmissions: ['Автомат'],
    drives: ['Передний', 'Полный (AWD)'],
    basePrice: 17900,
    countries: ['Китай'],
    image: IMG_EV,
  },
  {
    brand: 'Genesis',
    model: 'GV70 / GV80',
    trims: ['Sport Package', 'Signature Design'],
    bodyType: 'Внедорожник',
    fuels: ['Бензин', 'Дизель'],
    engineCc: 2497,
    transmissions: ['Автомат'],
    drives: ['Полный (AWD)'],
    basePrice: 32400,
    countries: ['Южная Корея', 'США'],
    image: IMG_PREMIUM,
  },
  {
    brand: 'BMW',
    model: 'X7 (G07) xDrive 40i',
    trims: ['M Sport 6-местный', 'M Sport Pro', 'Executive'],
    bodyType: 'Внедорожник',
    fuels: ['Бензин', 'Дизель', 'Гибрид'],
    engineCc: 2998,
    transmissions: ['Автомат'],
    drives: ['Полный (AWD)'],
    basePrice: 42900,
    countries: ['Южная Корея', 'Европа', 'США', 'Дубай'],
    image: IMG_PREMIUM,
  },
  {
    brand: 'Mercedes-Benz',
    model: 'GLE 450 / GLS',
    trims: ['AMG Line', '4MATIC Exclusive'],
    bodyType: 'Внедорожник',
    fuels: ['Бензин', 'Дизель'],
    engineCc: 2999,
    transmissions: ['Автомат'],
    drives: ['Полный (AWD)'],
    basePrice: 44500,
    countries: ['Европа', 'Южная Корея', 'Дубай', 'США'],
    image: IMG_PREMIUM,
  },
  {
    brand: 'Toyota',
    model: 'Land Cruiser Prado / Lexus GX',
    trims: ['TXL', 'Overtrail', 'Executive Lounge'],
    bodyType: 'Внедорожник',
    fuels: ['Бензин', 'Дизель'],
    engineCc: 2755,
    transmissions: ['Автомат'],
    drives: ['Полный (AWD)'],
    basePrice: 36800,
    countries: ['Дубай', 'Япония', 'Европа', 'Грузия'],
    image: IMG_OFFROAD,
  },
  {
    brand: 'Honda',
    model: 'CR-V / Accord',
    trims: ['Touring Hybrid', 'EX-L'],
    bodyType: 'Кроссовер',
    fuels: ['Гибрид', 'Бензин'],
    engineCc: 1993,
    transmissions: ['Вариатор'],
    drives: ['Полный (AWD)', 'Передний'],
    basePrice: 14800,
    countries: ['Япония', 'США', 'Китай'],
    image: IMG_15K,
  },
  {
    brand: 'Lexus',
    model: 'RX 350 / ES 300h',
    trims: ['F Sport', 'Luxury'],
    bodyType: 'Кроссовер',
    fuels: ['Гибрид', 'Бензин'],
    engineCc: 2487,
    transmissions: ['Автомат', 'Вариатор'],
    drives: ['Полный (AWD)', 'Передний'],
    basePrice: 28900,
    countries: ['США', 'Дубай', 'Япония', 'Южная Корея'],
    image: IMG_25K,
  },
];

const COLORS = [
  'Графитовый серый',
  'Перламутровый белый',
  'Чёрный обсидиан',
  'Серебристый металлик',
  'Глубокий синий',
  'Титановый матовый',
];

const LABEL_SETS: string[][] = [
  ['Родной окрас', 'Выгодная цена'],
  ['Родной окрас', 'Дешевле на 15%'],
  ['Без ДТП', '1 владелец'],
  ['Выгодная цена', 'Полная история'],
  ['Родной окрас', 'Свежий привоз'],
  ['Дешевле на 15%', 'Без ДТП'],
  ['Топ комплектация', 'Родной окрас'],
];

const AUCTION_TIMERS = [
  '04ч 18м',
  '11ч 45м',
  '1 дн 03ч',
  '02ч 50м',
  '19ч 10м',
];

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function getSegmentForPrice(price: number): SegmentKey {
  if (price <= 10000) return 'under-10k';
  if (price <= 15000) return 'under-15k';
  if (price <= 20000) return 'under-20k';
  if (price <= 25000) return 'under-25k';
  return 'premium';
}

const GALLERY_POOL = [
  IMG_PREMIUM,
  IMG_10K,
  IMG_13K,
  IMG_18K,
  IMG_25K,
  IMG_15K,
  IMG_20K,
  IMG_ALT_10K,
  IMG_ALT_25K,
  IMG_ALT_PREMIUM,
  IMG_EV,
  IMG_COUPE,
  IMG_OFFROAD,
];

function buildImagesGallery(primary: string, seed: number): string[] {
  const others = GALLERY_POOL.filter((img) => img !== primary);
  const picks: string[] = [primary];
  for (let k = 0; k < 3; k++) {
    picks.push(others[(seed + k * 3) % others.length]);
  }
  return picks;
}

function getDeliveryDays(country: ExportCountry): string {
  const found = EXPORT_COUNTRIES.find((c) => c.name === country);
  return found ? found.transit : '25–35 дней';
}

function buildCatalog(): CarListing[] {
  const list: CarListing[] = [];
  // 130 (+ 5 hero = 135) in Наш автопарк, 112 in Площадки Кореи, 50 in Аукционы
  const totalCount = 292;

  for (let i = 0; i < totalCount; i++) {
    const r1 = pseudoRandom(i + 1);
    const r2 = pseudoRandom(i + 101);
    const r3 = pseudoRandom(i + 201);
    const r4 = pseudoRandom(i + 301);

    const tpl = TEMPLATES[i % TEMPLATES.length];
    const yearOffset = Math.floor(r1 * 7); // 0..6
    const year = Math.min(2026, 2019 + yearOffset);
    const priceJitter = Math.round((r2 - 0.35) * 2800);
    const yearFactor = (year - 2020) * 650;
    const priceUsd = Math.max(6900, Math.round((tpl.basePrice + priceJitter + yearFactor) / 100) * 100);
    const sourcePriceUsd = Math.round(priceUsd * 0.78);

    const mileageKm = Math.max(4200, Math.round((2026 - year) * 14500 + r3 * 24000));
    const fuel = tpl.fuels[i % tpl.fuels.length];
    const transmission = tpl.transmissions[i % tpl.transmissions.length];
    const drive = tpl.drives[i % tpl.drives.length];
    const trim = tpl.trims[i % tpl.trims.length];

    let platformCategory: PlatformCategory;
    let platform: PlatformSource;
    let upcomingAuction: string | undefined;
    let country: ExportCountry;

    if (i < 130) {
      platformCategory = 'Наш автопарк';
      platform = 'Наш автопарк';
      country = tpl.countries[Math.floor(r4 * tpl.countries.length) % tpl.countries.length];
    } else if (i < 242) {
      platformCategory = 'Площадки Кореи';
      platform = KOREAN_DEALERS[(i - 130) % KOREAN_DEALERS.length];
      country = 'Южная Корея';
    } else {
      platformCategory = 'Аукционы';
      const slot = UPCOMING_AUCTIONS[(i - 242) % UPCOMING_AUCTIONS.length];
      platform = slot.house;
      upcomingAuction = slot.label;
      country = i % 5 === 0 ? 'США' : i % 7 === 0 ? 'Япония' : 'Южная Корея';
    }

    const isAuction = platformCategory === 'Аукционы';
    const labels = [...LABEL_SETS[i % LABEL_SETS.length]];
    if (isAuction && !labels.includes('Торг на аукционе')) {
      labels[1] = 'Лот аукциона';
    }

    const vinNum = String(100000 + i * 7919).slice(-6);
    const vinPrefix = tpl.brand.slice(0, 3).toUpperCase();

    list.push({
      id: `TA-${1001 + i}`,
      brand: tpl.brand,
      model: tpl.model,
      trim,
      year,
      priceUsd,
      sourcePriceUsd,
      mileageKm,
      engineCc: fuel === 'Электро' ? 0 : tpl.engineCc,
      fuel,
      transmission,
      drive,
      bodyType: tpl.bodyType,
      color: COLORS[i % COLORS.length],
      country,
      platformCategory,
      platform,
      segment: getSegmentForPrice(priceUsd),
      labels,
      vin: `${vinPrefix}KG${year}${vinNum}`,
      image: tpl.image,
      images: buildImagesGallery(tpl.image, i),
      inspectionScore: r2 > 0.35 ? 'Класс A · Заводской ЛКП' : 'Класс A · Проверен по 140 п.',
      deliveryDays: getDeliveryDays(country),
      isAuction,
      auctionEndsIn: isAuction ? AUCTION_TIMERS[i % AUCTION_TIMERS.length] : undefined,
      upcomingAuction,
    });
  }

  // Ensure the 5 hero segment showcase models appear cleanly at the front of the catalog
  const featuredHeroCars: CarListing[] = [
    {
      id: 'TA-HERO-1',
      brand: 'BMW',
      model: 'X7 (G07) xDrive 40i M Sport',
      trim: '6-местный',
      year: 2024,
      priceUsd: 54900,
      sourcePriceUsd: 44800,
      mileageKm: 18400,
      engineCc: 2998,
      fuel: 'Бензин',
      transmission: 'Автомат',
      drive: 'Полный (AWD)',
      bodyType: 'Внедорожник',
      color: 'Чёрный обсидиан',
      country: 'Южная Корея',
      platformCategory: 'Наш автопарк',
      platform: 'Наш автопарк',
      segment: 'premium',
      labels: ['Родной окрас', 'Топ комплектация'],
      vin: 'BMWKG2024X70001',
      image: IMG_PREMIUM,
      images: [IMG_PREMIUM, IMG_ALT_PREMIUM, IMG_25K, IMG_OFFROAD],
      inspectionScore: 'Класс A · Заводской ЛКП',
      deliveryDays: '25–35 дней',
      isAuction: false,
    },
    {
      id: 'TA-HERO-2',
      brand: 'Kia',
      model: 'The New Morning (JA)',
      trim: 'GT Line',
      year: 2026,
      priceUsd: 9400,
      sourcePriceUsd: 7300,
      mileageKm: 3200,
      engineCc: 998,
      fuel: 'Бензин',
      transmission: 'Автомат',
      drive: 'Передний',
      bodyType: 'Хэтчбек',
      color: 'Перламутровый белый',
      country: 'Южная Корея',
      platformCategory: 'Наш автопарк',
      platform: 'Наш автопарк',
      segment: 'under-10k',
      labels: ['Родной окрас', 'Выгодная цена'],
      vin: 'KIAKG2026JA0002',
      image: IMG_10K,
      images: [IMG_10K, IMG_ALT_10K, IMG_13K, IMG_15K],
      inspectionScore: 'Класс A · Заводской ЛКП',
      deliveryDays: '25–35 дней',
      isAuction: false,
    },
    {
      id: 'TA-HERO-3',
      brand: 'Hyundai',
      model: 'The New Avante (CN7)',
      trim: '1.6 Inspiration',
      year: 2023,
      priceUsd: 12400,
      sourcePriceUsd: 9600,
      mileageKm: 24500,
      engineCc: 1598,
      fuel: 'Бензин',
      transmission: 'Вариатор',
      drive: 'Передний',
      bodyType: 'Седан',
      color: 'Графитовый серый',
      country: 'Южная Корея',
      platformCategory: 'Наш автопарк',
      platform: 'Наш автопарк',
      segment: 'under-15k',
      labels: ['Родной окрас', 'Дешевле на 15%'],
      vin: 'HYUKG2023CN7003',
      image: IMG_13K,
      images: [IMG_13K, IMG_COUPE, IMG_10K, IMG_15K],
      inspectionScore: 'Класс A · Проверен по 140 п.',
      deliveryDays: '25–35 дней',
      isAuction: false,
    },
    {
      id: 'TA-HERO-4',
      brand: 'Hyundai',
      model: 'Новый Santa Fe',
      trim: 'Calligraphy',
      year: 2023,
      priceUsd: 17600,
      sourcePriceUsd: 13800,
      mileageKm: 29100,
      engineCc: 2497,
      fuel: 'Бензин',
      transmission: 'Автомат',
      drive: 'Полный (AWD)',
      bodyType: 'Кроссовер',
      color: 'Графитовый серый',
      country: 'Южная Корея',
      platformCategory: 'Наш автопарк',
      platform: 'Наш автопарк',
      segment: 'under-20k',
      labels: ['Без ДТП', '1 владелец'],
      vin: 'HYUKG2023SF0004',
      image: IMG_18K,
      images: [IMG_18K, IMG_20K, IMG_25K, IMG_15K],
      inspectionScore: 'Класс A · Заводской ЛКП',
      deliveryDays: '25–35 дней',
      isAuction: false,
    },
    {
      id: 'TA-HERO-5',
      brand: 'Hyundai',
      model: 'Palisade (LX3) HEV 2.5T 4WD',
      trim: '7-местный Calligraphy',
      year: 2025,
      priceUsd: 24600,
      sourcePriceUsd: 19500,
      mileageKm: 8400,
      engineCc: 2497,
      fuel: 'Гибрид',
      transmission: 'Автомат',
      drive: 'Полный (AWD)',
      bodyType: 'Внедорожник',
      color: 'Чёрный обсидиан',
      country: 'Южная Корея',
      platformCategory: 'Наш автопарк',
      platform: 'Наш автопарк',
      segment: 'under-25k',
      labels: ['Топ комплектация', 'Родной окрас'],
      vin: 'HYUKG2025LX3005',
      image: IMG_25K,
      images: [IMG_25K, IMG_ALT_25K, IMG_18K, IMG_PREMIUM],
      inspectionScore: 'Класс A · Заводской ЛКП',
      deliveryDays: '25–35 дней',
      isAuction: false,
    },
  ];

  return [...featuredHeroCars, ...list];
}

export const ALL_CARS: CarListing[] = buildCatalog();

export const ALL_BRANDS: string[] = Array.from(
  new Set(ALL_CARS.map((c) => c.brand))
).sort();

export function getModelsForBrand(brand: string): string[] {
  if (!brand) {
    return Array.from(new Set(ALL_CARS.map((c) => c.model))).sort();
  }
  return Array.from(
    new Set(ALL_CARS.filter((c) => c.brand === brand).map((c) => c.model))
  ).sort();
}
