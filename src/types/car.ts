export type ExportCountry =
  | 'Южная Корея'
  | 'США'
  | 'Китай'
  | 'Япония'
  | 'Дубай'
  | 'Грузия'
  | 'Европа';

export type PlatformCategory = 'Наш автопарк' | 'Площадки Кореи' | 'Аукционы';

export type KoreanDealer =
  | 'Encar'
  | 'KB Chachacha'
  | 'K Car'
  | 'Lotte'
  | 'HeyDealer'
  | 'AutoBell';

export type AuctionHouse =
  | 'HeyDealer'
  | 'Lotte Auction'
  | 'Hyundai Glovis'
  | 'AutoBell'
  | 'KCar'
  | 'AutoHub';

export type PlatformSource = 'Наш автопарк' | KoreanDealer | AuctionHouse;

export type SegmentKey =
  | 'under-10k'
  | 'under-15k'
  | 'under-20k'
  | 'under-25k'
  | 'premium';

export type FuelType = 'Бензин' | 'Дизель' | 'Гибрид' | 'Электро' | 'Газ (LPG)';
export type TransmissionType = 'Автомат' | 'Робот' | 'Вариатор' | 'Механика';
export type DriveType = 'Передний' | 'Полный (AWD)' | 'Задний';
export type BodyType = 'Седан' | 'Кроссовер' | 'Внедорожник' | 'Минивэн' | 'Хэтчбек' | 'Купе';

export type SortOption =
  | 'default'
  | 'price-asc'
  | 'price-desc'
  | 'year-desc'
  | 'mileage-asc';

export interface CarListing {
  id: string;
  brand: string;
  model: string;
  trim: string;
  year: number;
  priceUsd: number; // Итоговая цена под ключ в КР ($)
  sourcePriceUsd: number; // Цена на площадке/аукционе ($)
  mileageKm: number;
  engineCc: number;
  fuel: FuelType;
  transmission: TransmissionType;
  drive: DriveType;
  bodyType: BodyType;
  color: string;
  country: ExportCountry;
  platformCategory: PlatformCategory;
  platform: PlatformSource;
  segment: SegmentKey;
  labels: string[];
  vin: string;
  image: string;
  images: string[];
  inspectionScore: string;
  deliveryDays: string;
  isAuction: boolean;
  auctionEndsIn?: string;
  upcomingAuction?: string;
  auctionStartPriceUsd?: number;
  auctionEstimatedWinPriceUsd?: number | null;
  insuranceReport: {
    ownerChanges: number;
    ownDamageCount: number;
    ownDamageAmountUsd: number;
    otherDamageCount: number;
    otherDamageAmountUsd: number;
  };
}

export interface FilterState {
  segment: SegmentKey | null;
  country: ExportCountry | null;
  platformCategory: PlatformCategory;
  subPlatform: string;
  upcomingAuction: string;
  search: string;
  brand: string;
  model: string;
  bodyType: string;
  fuel: string;
  transmission: string;
  drive: string;
  yearFrom: string;
  yearTo: string;
  engineFrom: string;
  engineTo: string;
  priceFrom: string;
  priceTo: string;
  mileageFrom: string;
  mileageTo: string;
  sort: SortOption;
}

export interface CalculatorPrefill {
  country: ExportCountry;
  priceUsd: number;
  year: number;
  engineCc: number;
  fuel: FuelType;
  title?: string;
}
