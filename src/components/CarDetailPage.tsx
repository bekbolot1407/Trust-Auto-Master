import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Calculator,
  Calendar,
  CarFront,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileCheck2,
  Fuel,
  Gavel,
  Gauge,
  Heart,
  MapPin,
  Maximize2,
  PhoneCall,
  Send,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';
import { ALL_CARS } from '../data/cars';
import type { CalculatorPrefill, CarListing } from '../types/car';
import { CarCard } from './CarCard';

interface CarDetailPageProps {
  car: CarListing;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onBackToCatalog: () => void;
  onSelectCar: (car: CarListing) => void;
  onOrderCar: (car: CarListing) => void;
  onOpenInCalculator: (prefill: CalculatorPrefill) => void;
}

const KGS_RATE = 87.5;

interface BodyZone {
  id: string;
  name: string;
  microns: string;
  status: string;
}

const BODY_ZONES: BodyZone[] = [
  { id: 'hood', name: 'Капот', microns: '108 мкм', status: 'Заводской окрас' },
  { id: 'roof', name: 'Крыша', microns: '102 мкм', status: 'Заводской окрас' },
  { id: 'trunk', name: 'Крышка багажника', microns: '110 мкм', status: 'Заводской окрас' },
  { id: 'front-bumper', name: 'Передний бампер', microns: 'Пластик', status: 'Без повреждений' },
  { id: 'rear-bumper', name: 'Задний бампер', microns: 'Пластик', status: 'Без повреждений' },
  { id: 'fl-fender', name: 'Переднее левое крыло', microns: '106 мкм', status: 'Заводской окрас' },
  { id: 'fr-fender', name: 'Переднее правое крыло', microns: '105 мкм', status: 'Заводской окрас' },
  { id: 'fl-door', name: 'Передняя левая дверь', microns: '112 мкм', status: 'Заводской окрас' },
  { id: 'fr-door', name: 'Передняя правая дверь', microns: '109 мкм', status: 'Заводской окрас' },
  { id: 'rl-door', name: 'Задняя левая дверь', microns: '107 мкм', status: 'Заводской окрас' },
  { id: 'rr-door', name: 'Задняя правая дверь', microns: '111 мкм', status: 'Заводской окрас' },
  { id: 'rl-quarter', name: 'Заднее левое крыло', microns: '114 мкм', status: 'Заводской окрас' },
  { id: 'rr-quarter', name: 'Заднее правое крыло', microns: '110 мкм', status: 'Заводской окрас' },
];

export const CarDetailPage: React.FC<CarDetailPageProps> = ({
  car,
  favorites,
  onToggleFavorite,
  onBackToCatalog,
  onSelectCar,
  onOrderCar,
  onOpenInCalculator,
}) => {
  const isFavorite = favorites.has(car.id);
  const images = useMemo(
    () => (car.images && car.images.length > 0 ? car.images : [car.image]),
    [car]
  );

  const [slideIndex, setSlideIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedVin, setCopiedVin] = useState(false);
  const [selectedZone, setSelectedZone] = useState<BodyZone>(BODY_ZONES[0]);

  useEffect(() => {
    setSlideIndex(0);
    setLightboxOpen(false);
    setSelectedZone(BODY_ZONES[0]);
  }, [car.id]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setSlideIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setSlideIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [images.length]);

  const serviceUsd = 200;
  const deltaUsd = Math.max(serviceUsd, car.priceUsd - car.sourcePriceUsd);
  const remainderAfterService = Math.max(0, deltaUsd - serviceUsd);
  const logisticsUsd = Math.round(remainderAfterService * 0.48);
  const customsUsd = Math.max(0, remainderAfterService - logisticsUsd);

  const displayPriceUsd = car.priceUsd;
  const displayPriceKgs = Math.round(displayPriceUsd * KGS_RATE);
  const marketAvgUsd = Math.round(car.priceUsd * 1.18);
  const savingsUsd = marketAvgUsd - car.priceUsd;

  const engineLabel =
    car.engineCc > 0
      ? `${(car.engineCc / 1000).toFixed(1)} л (${car.engineCc} см³)`
      : 'Электро';
  const estimatedHp =
    car.engineCc === 0
      ? '204 л.с.'
      : car.engineCc <= 1200
      ? '76 л.с.'
      : car.engineCc <= 1700
      ? '123 л.с.'
      : car.engineCc <= 2100
      ? '180 л.с.'
      : car.engineCc <= 2600
      ? '249 л.с.'
      : '340 л.с.';

  const similarCars = useMemo(() => {
    return ALL_CARS.filter(
      (item) => item.id !== car.id && (item.segment === car.segment || item.brand === car.brand)
    ).slice(0, 4);
  }, [car.id, car.segment, car.brand]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyVin = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(car.vin).catch(() => {});
    }
    setCopiedVin(true);
    setTimeout(() => setCopiedVin(false), 1800);
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const specRows: { label: string; value: string }[] = [
    { label: 'Марка', value: car.brand },
    { label: 'Модель', value: car.model },
    { label: 'Комплектация', value: car.trim },
    { label: 'Год выпуска', value: String(car.year) },
    { label: 'Пробег', value: `${car.mileageKm.toLocaleString('ru-RU')} км (подтверждён)` },
    { label: 'Двигатель', value: `${car.fuel} · ${engineLabel}` },
    { label: 'Мощность', value: estimatedHp },
    { label: 'Коробка передач', value: car.transmission },
    { label: 'Привод', value: car.drive },
    { label: 'Тип кузова', value: car.bodyType },
    { label: 'Цвет кузова', value: car.color },
    { label: 'Руль', value: 'Левый' },
    { label: 'Страна экспорта', value: car.country },
    { label: 'Площадка / Аукцион', value: car.platform },
  ];

  const equipmentGroups = [
    {
      title: 'Безопасность и ассистенты',
      items: [
        'Адаптивный круиз-контроль (SCC)',
        'Удержание в полосе (LKA / LFA)',
        'Контроль слепых зон (BCA)',
        'Система предотвращения столкновений (FCA)',
        'Камеры кругового обзора 360°',
        '6–8 подушек безопасности и ISOFIX',
      ],
    },
    {
      title: 'Комфорт и интерьер',
      items: [
        'Отделка салона кожей / Nappa',
        'Подогрев и вентиляция передних сидений',
        'Электрорегулировка сидений с памятью',
        'Двухзонный / многозонный климат-контроль',
        'Бесключевой доступ и запуск кнопкой',
        'Подогрев руля и зеркал',
      ],
    },
    {
      title: 'Мультимедиа и свет',
      items: [
        'Полностью светодиодная оптика Full LED',
        'Цифровая приборная панель Supervision',
        'Apple CarPlay и Android Auto',
        'Беспроводная зарядка смартфона',
        'Навигация с большим сенсорным экраном',
        'Премиальная аудиосистема',
      ],
    },
    {
      title: 'Экстерьер и шасси',
      items: [
        'Оригинальные легкосплавные диски',
        'Электропривод крышки багажника',
        'Передние и задние парктроники',
        'Выбор режимов движения Drive Mode',
        'Датчики давления в шинах (TPMS)',
        'Теплозащитное остекление',
      ],
    },
  ];

  const sourcePct = Math.round((car.sourcePriceUsd / Math.max(1, car.priceUsd)) * 100);
  const logisticsPct = Math.round((logisticsUsd / Math.max(1, car.priceUsd)) * 100);
  const customsPct = Math.round((customsUsd / Math.max(1, car.priceUsd)) * 100);
  const servicePct = Math.max(1, 100 - sourcePct - logisticsPct - customsPct);

  return (
    <main className="min-h-screen bg-[#F6F7F9] py-4 sm:py-7 dark:bg-[#000000]">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        {/* Top Breadcrumb + Utility Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onBackToCatalog}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/10 dark:bg-[#141414] dark:text-slate-200 dark:hover:border-[#8fff00] dark:hover:text-[#8fff00] shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Назад в каталог</span>
            </button>

            <nav
              aria-label="Хлебные крошки"
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate"
            >
              <button
                type="button"
                onClick={onBackToCatalog}
                className="hover:text-[#0058cd] dark:hover:text-[#8fff00]"
              >
                Каталог
              </button>
              <span>/</span>
              <span>{car.platformCategory}</span>
              <span>/</span>
              <span>{car.brand}</span>
              <span>/</span>
              <span className="font-semibold text-slate-900 dark:text-white truncate">
                {car.model} ({car.year})
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-[#0058cd] dark:border-white/10 dark:bg-[#141414] dark:text-slate-200 dark:hover:border-[#8fff00]"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#0058cd] dark:text-[#8fff00]" />
                  <span>Ссылка скопирована</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Поделиться</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onToggleFavorite(car.id)}
              aria-pressed={isFavorite}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                isFavorite
                  ? 'border-[#0058cd] bg-[#0058cd]/10 text-[#0058cd] dark:border-[#8fff00] dark:bg-[#8fff00]/15 dark:text-[#8fff00]'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-[#0058cd] dark:border-white/10 dark:bg-[#141414] dark:text-slate-200 dark:hover:border-[#8fff00]'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isFavorite ? 'fill-[#0058cd] text-[#0058cd] dark:fill-[#8fff00] dark:text-[#8fff00]' : ''}`} />
              <span>{isFavorite ? 'В избранном' : 'В избранное'}</span>
            </button>
          </div>
        </div>

        {/* Listing Header Block (Auto-Desk Style) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-white/10 dark:bg-[#141414]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md bg-[#0058cd] px-2 py-0.5 font-mono font-bold text-white dark:bg-[#8fff00] dark:text-slate-950">
                  #{car.id}
                </span>
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  {car.platform} · {car.country}
                </span>
                {car.upcomingAuction && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-[#0058cd]/35 bg-[#0058cd]/10 px-2 py-0.5 font-semibold text-[#0058cd] dark:border-[#8fff00]/40 dark:bg-[#8fff00]/10 dark:text-[#8fff00]">
                    <Gavel className="h-3 w-3" />
                    <span>{car.upcomingAuction}</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-[#0058cd] dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{car.inspectionScore}</span>
                </span>
              </div>

              <h1 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {car.brand} {car.model} {car.trim}, {car.year}
              </h1>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  onClick={handleCopyVin}
                  className="inline-flex items-center gap-1.5 font-mono hover:text-[#0058cd] dark:hover:text-[#8fff00]"
                  title="Скопировать VIN"
                >
                  <span>VIN: {car.vin}</span>
                  {copiedVin ? (
                    <Check className="h-3.5 w-3.5 text-[#0058cd] dark:text-[#8fff00]" />
                  ) : (
                    <Copy className="h-3 w-3 opacity-70" />
                  )}
                </button>
                <span>Пробег: {car.mileageKm.toLocaleString('ru-RU')} км</span>
                <span>Доставка: {car.deliveryDays}</span>
              </div>
            </div>

            {/* Section Anchor Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 lg:pt-0">
              {[
                { id: 'sec-specs', label: 'Характеристики' },
                { id: 'sec-inspection', label: 'Кузов и ЛКП' },
                { id: 'sec-options', label: 'Комплектация' },
                { id: 'sec-price', label: 'Расчёт цены' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => scrollToSection(tab.id)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/10 dark:bg-[#0D0D0D] dark:text-slate-300 dark:hover:border-[#8fff00] dark:hover:text-[#8fff00] whitespace-nowrap shrink-0"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main 2-Column Listing Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* LEFT COLUMN (7 cols): Photo Gallery + Detailed Sections */}
          <div className="lg:col-span-7 space-y-5">
            {/* Gallery */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 sm:p-3.5 dark:border-white/10 dark:bg-[#141414]">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-[#0A0A0A]">
                <motion.img
                  key={images[slideIndex]}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  src={images[slideIndex] || car.image}
                  alt={`${car.brand} ${car.model} ${car.year} — фото ${slideIndex + 1}`}
                  referrerPolicy="no-referrer"
                  onClick={() => setLightboxOpen(true)}
                  className="h-full w-full cursor-zoom-in object-cover"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25"
                />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {car.labels.map((label) => (
                      <span
                        key={label}
                        className="rounded-md bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md border border-white/15"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-lg bg-black/70 px-2.5 py-1 font-mono text-xs tabular-nums text-white backdrop-blur-md">
                      {slideIndex + 1} / {images.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLightboxOpen(true)}
                      aria-label="Увеличить фото"
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/70 text-white backdrop-blur-md transition-colors hover:bg-[#0058cd] hover:text-white dark:hover:bg-[#8fff00] dark:hover:text-slate-950"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setSlideIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                      }
                      aria-label="Предыдущее фото"
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-md transition-colors hover:bg-[#0058cd] hover:text-white dark:hover:bg-[#8fff00] dark:hover:text-slate-950"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSlideIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                      }
                      aria-label="Следующее фото"
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-md transition-colors hover:bg-[#0058cd] hover:text-white dark:hover:bg-[#8fff00] dark:hover:text-slate-950"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {car.isAuction && car.auctionEndsIn && (
                  <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-[#0058cd] px-2.5 py-1 text-xs font-bold text-white dark:bg-[#8fff00] dark:text-slate-950">
                    <Gavel className="h-3.5 w-3.5" />
                    <span>До торгов: {car.auctionEndsIn}</span>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-2.5 grid grid-cols-4 gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSlideIndex(idx)}
                      aria-label={`Выбрать фото ${idx + 1}`}
                      className={`relative aspect-[16/10] overflow-hidden rounded-lg border-2 transition-all ${
                        idx === slideIndex
                          ? 'border-[#0058cd] ring-2 ring-[#0058cd]/30 dark:border-[#8fff00] dark:ring-[#8fff00]/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${car.brand} ${car.model} — миниатюра ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Sticky-Style Summary Card */}
            <div className="lg:hidden rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#141414] space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Итоговая цена под ключ</span>
                  <span className="rounded-md bg-[#0058cd]/10 px-2 py-0.5 text-[11px] font-bold text-[#0058cd] dark:bg-emerald-500/10 dark:text-emerald-400">
                    Выгода ~${savingsUsd.toLocaleString('ru-RU')}
                  </span>
                </div>
                <div className="mt-1 flex items-baseline justify-between gap-2">
                  <span className="font-mono text-2xl font-extrabold tabular-nums text-slate-900 dark:text-white">
                    ${displayPriceUsd.toLocaleString('ru-RU')}
                  </span>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    ~ {displayPriceKgs.toLocaleString('ru-RU')} сом
                  </span>
                </div>
                <div className="mt-2.5 space-y-1.5 border-t border-slate-100 pt-2.5 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Цена на площадке ({car.country}):</span>
                    <span className="font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                      ${car.sourcePriceUsd.toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Доставка в Кыргызстан:</span>
                    <span className="font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                      ${logisticsUsd.toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Растаможка:</span>
                    <span className="font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                      ${customsUsd.toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Услуга:</span>
                    <span className="font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                      ${serviceUsd.toLocaleString('ru-RU')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => onOrderCar(car)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0058cd] px-4 py-3 text-sm font-bold text-white hover:bg-[#0046a3] dark:bg-[#8fff00] dark:text-slate-950 dark:hover:bg-[#7ae000]"
                >
                  <Send className="h-4 w-4" />
                  <span>Заказать авто</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onOpenInCalculator({
                      country: car.country,
                      priceUsd: car.sourcePriceUsd,
                      year: car.year,
                      engineCc: car.engineCc || 2000,
                      fuel: car.fuel,
                      title: `${car.brand} ${car.model} (${car.year})`,
                    })
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200"
                >
                  <Calculator className="h-4 w-4" />
                  <span>Калькулятор</span>
                </button>
              </div>
            </div>

            {/* Section 1: Specifications Table (Auto-Desk dotted key-value rows) */}
            <section
              id="sec-specs"
              className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-white/10 dark:bg-[#141414]"
            >
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Технические характеристики
              </h2>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-xs sm:text-sm">
                {specRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-2 border-b border-dashed border-slate-200 pb-2 dark:border-white/10"
                  >
                    <span className="text-slate-500 dark:text-slate-400 shrink-0">
                      {row.label}
                    </span>
                    <span className="font-semibold text-right text-slate-900 dark:text-white truncate">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2: Interactive Body LKP & Damage Inspection Map */}
            <section
              id="sec-inspection"
              className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-white/10 dark:bg-[#141414]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    Отчёт осмотра кузова и истории (140 п.)
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Нажмите на любую деталь кузова, чтобы посмотреть замеры толщиномером
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0058cd]/10 px-3 py-1 text-xs font-semibold text-[#0058cd] dark:bg-emerald-500/10 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{car.inspectionScore}</span>
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                {/* Interactive Car Schematic */}
                <div className="md:col-span-5 flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#0D0D0D]">
                  <svg
                    viewBox="0 0 220 340"
                    className="h-56 w-auto select-none"
                    aria-label="Схема замера ЛКП кузова"
                  >
                    {/* Car Body Outline */}
                    <rect
                      x="38"
                      y="24"
                      width="144"
                      height="292"
                      rx="36"
                      className="fill-slate-200/70 stroke-slate-400 dark:fill-[#1A1A1A] dark:stroke-white/20"
                      strokeWidth="2"
                    />
                    {/* Front Bumper */}
                    <path
                      d="M46 38 Q110 14 174 38 L168 56 Q110 42 52 56 Z"
                      onClick={() => setSelectedZone(BODY_ZONES[3])}
                      className={`cursor-pointer transition-colors ${
                        selectedZone.id === 'front-bumper'
                          ? 'fill-[#0058cd] stroke-white dark:fill-[#8fff00] dark:stroke-slate-950'
                          : 'fill-[#0058cd]/25 stroke-[#0058cd] hover:fill-[#0058cd]/55 dark:fill-emerald-500/35 dark:stroke-emerald-500 dark:hover:fill-[#8fff00]/70'
                      }`}
                      strokeWidth="1.5"
                    />
                    {/* Hood */}
                    <path
                      d="M52 58 Q110 46 168 58 L162 114 L58 114 Z"
                      onClick={() => setSelectedZone(BODY_ZONES[0])}
                      className={`cursor-pointer transition-colors ${
                        selectedZone.id === 'hood'
                          ? 'fill-[#0058cd] stroke-white dark:fill-[#8fff00] dark:stroke-slate-950'
                          : 'fill-[#0058cd]/25 stroke-[#0058cd] hover:fill-[#0058cd]/55 dark:fill-emerald-500/35 dark:stroke-emerald-500 dark:hover:fill-[#8fff00]/70'
                      }`}
                      strokeWidth="1.5"
                    />
                    {/* Windshield */}
                    <path
                      d="M60 118 L160 118 L152 146 L68 146 Z"
                      className="fill-slate-300/80 dark:fill-white/10"
                    />
                    {/* Roof */}
                    <rect
                      x="68"
                      y="150"
                      width="84"
                      height="76"
                      rx="8"
                      onClick={() => setSelectedZone(BODY_ZONES[1])}
                      className={`cursor-pointer transition-colors ${
                        selectedZone.id === 'roof'
                          ? 'fill-[#0058cd] stroke-white dark:fill-[#8fff00] dark:stroke-slate-950'
                          : 'fill-[#0058cd]/25 stroke-[#0058cd] hover:fill-[#0058cd]/55 dark:fill-emerald-500/35 dark:stroke-emerald-500 dark:hover:fill-[#8fff00]/70'
                      }`}
                      strokeWidth="1.5"
                    />
                    {/* Rear Window */}
                    <path
                      d="M68 230 L152 230 L160 254 L60 254 Z"
                      className="fill-slate-300/80 dark:fill-white/10"
                    />
                    {/* Trunk */}
                    <path
                      d="M58 258 L162 258 L166 286 Q110 296 54 286 Z"
                      onClick={() => setSelectedZone(BODY_ZONES[2])}
                      className={`cursor-pointer transition-colors ${
                        selectedZone.id === 'trunk'
                          ? 'fill-[#0058cd] stroke-white dark:fill-[#8fff00] dark:stroke-slate-950'
                          : 'fill-[#0058cd]/25 stroke-[#0058cd] hover:fill-[#0058cd]/55 dark:fill-emerald-500/35 dark:stroke-emerald-500 dark:hover:fill-[#8fff00]/70'
                      }`}
                      strokeWidth="1.5"
                    />
                    {/* Rear Bumper */}
                    <path
                      d="M52 290 Q110 302 168 290 L174 306 Q110 324 46 306 Z"
                      onClick={() => setSelectedZone(BODY_ZONES[4])}
                      className={`cursor-pointer transition-colors ${
                        selectedZone.id === 'rear-bumper'
                          ? 'fill-[#0058cd] stroke-white dark:fill-[#8fff00] dark:stroke-slate-950'
                          : 'fill-[#0058cd]/25 stroke-[#0058cd] hover:fill-[#0058cd]/55 dark:fill-emerald-500/35 dark:stroke-emerald-500 dark:hover:fill-[#8fff00]/70'
                      }`}
                      strokeWidth="1.5"
                    />
                    {/* Left Side: FL Fender, FL Door, RL Door, RL Quarter */}
                    <rect
                      x="38"
                      y="60"
                      width="14"
                      height="54"
                      rx="4"
                      onClick={() => setSelectedZone(BODY_ZONES[5])}
                      className={`cursor-pointer transition-colors ${
                        selectedZone.id === 'fl-fender'
                          ? 'fill-[#0058cd] stroke-white dark:fill-[#8fff00] dark:stroke-slate-950'
                          : 'fill-[#0058cd]/25 stroke-[#0058cd] hover:fill-[#0058cd]/55 dark:fill-emerald-500/35 dark:stroke-emerald-500 dark:hover:fill-[#8fff00]/70'
                      }`}
                      strokeWidth="1.5"
                    />
                    <rect
                      x="38"
                      y="118"
                      width="18"
                      height="62"
                      rx="4"
                      onClick={() => setSelectedZone(BODY_ZONES[7])}
                      className={`cursor-pointer transition-colors ${
                        selectedZone.id === 'fl-door'
                          ? 'fill-[#0058cd] stroke-white dark:fill-[#8fff00] dark:stroke-slate-950'
                          : 'fill-[#0058cd]/25 stroke-[#0058cd] hover:fill-[#0058cd]/55 dark:fill-emerald-500/35 dark:stroke-emerald-500 dark:hover:fill-[#8fff00]/70'
                      }`}
                      strokeWidth="1.5"
                    />
                    <rect
                      x="38"
                      y="184"
                      width="18"
                      height="60"
                      rx="4"
                      onClick={() => setSelectedZone(BODY_ZONES[9])}
                      className={`cursor-pointer transition-colors ${
                        selectedZone.id === 'rl-door'
                          ? 'fill-[#0058cd] stroke-white dark:fill-[#8fff00] dark:stroke-slate-950'
                          : 'fill-[#0058cd]/25 stroke-[#0058cd] hover:fill-[#0058cd]/55 dark:fill-emerald-500/35 dark:stroke-emerald-500 dark:hover:fill-[#8fff00]/70'
                      }`}
                      strokeWidth="1.5"
                    />
                    <rect
                      x="38"
                      y="248"
                      width="14"
                      height="40"
                      rx="4"
                      onClick={() => setSelectedZone(BODY_ZONES[11])}
                      className={`cursor-pointer transition-colors ${
                        selectedZone.id === 'rl-quarter'
                          ? 'fill-[#0058cd] stroke-white dark:fill-[#8fff00] dark:stroke-slate-950'
                          : 'fill-[#0058cd]/25 stroke-[#0058cd] hover:fill-[#0058cd]/55 dark:fill-emerald-500/35 dark:stroke-emerald-500 dark:hover:fill-[#8fff00]/70'
                      }`}
                      strokeWidth="1.5"
                    />
                    {/* Right Side: FR Fender, FR Door, RR Door, RR Quarter */}
                    <rect
                      x="168"
                      y="60"
                      width="14"
                      height="54"
                      rx="4"
                      onClick={() => setSelectedZone(BODY_ZONES[6])}
                      className={`cursor-pointer transition-colors ${
                        selectedZone.id === 'fr-fender'
                          ? 'fill-[#0058cd] stroke-white dark:fill-[#8fff00] dark:stroke-slate-950'
                          : 'fill-[#0058cd]/25 stroke-[#0058cd] hover:fill-[#0058cd]/55 dark:fill-emerald-500/35 dark:stroke-emerald-500 dark:hover:fill-[#8fff00]/70'
                      }`}
                      strokeWidth="1.5"
                    />
                    <rect
                      x="164"
                      y="118"
                      width="18"
                      height="62"
                      rx="4"
                      onClick={() => setSelectedZone(BODY_ZONES[8])}
                      className={`cursor-pointer transition-colors ${
                        selectedZone.id === 'fr-door'
                          ? 'fill-[#0058cd] stroke-white dark:fill-[#8fff00] dark:stroke-slate-950'
                          : 'fill-[#0058cd]/25 stroke-[#0058cd] hover:fill-[#0058cd]/55 dark:fill-emerald-500/35 dark:stroke-emerald-500 dark:hover:fill-[#8fff00]/70'
                      }`}
                      strokeWidth="1.5"
                    />
                    <rect
                      x="164"
                      y="184"
                      width="18"
                      height="60"
                      rx="4"
                      onClick={() => setSelectedZone(BODY_ZONES[10])}
                      className={`cursor-pointer transition-colors ${
                        selectedZone.id === 'rr-door'
                          ? 'fill-[#0058cd] stroke-white dark:fill-[#8fff00] dark:stroke-slate-950'
                          : 'fill-[#0058cd]/25 stroke-[#0058cd] hover:fill-[#0058cd]/55 dark:fill-emerald-500/35 dark:stroke-emerald-500 dark:hover:fill-[#8fff00]/70'
                      }`}
                      strokeWidth="1.5"
                    />
                    <rect
                      x="168"
                      y="248"
                      width="14"
                      height="40"
                      rx="4"
                      onClick={() => setSelectedZone(BODY_ZONES[12])}
                      className={`cursor-pointer transition-colors ${
                        selectedZone.id === 'rr-quarter'
                          ? 'fill-[#0058cd] stroke-white dark:fill-[#8fff00] dark:stroke-slate-950'
                          : 'fill-[#0058cd]/25 stroke-[#0058cd] hover:fill-[#0058cd]/55 dark:fill-emerald-500/35 dark:stroke-emerald-500 dark:hover:fill-[#8fff00]/70'
                      }`}
                      strokeWidth="1.5"
                    />
                  </svg>

                  <div className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-center dark:border-white/10 dark:bg-[#141414]">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {selectedZone.name}
                    </div>
                    <div className="mt-0.5 text-[11px] font-mono text-[#0058cd] dark:text-[#8fff00]">
                      {selectedZone.microns} · {selectedZone.status}
                    </div>
                  </div>
                </div>

                {/* History & Verification Summary */}
                <div className="md:col-span-7 space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { label: 'Участие в ДТП', value: 'Не зафиксировано' },
                      { label: 'Замены деталей', value: '0 элементов' },
                      { label: 'Утопление / Пожар', value: 'Исключено' },
                      { label: 'Такси / Каршеринг', value: 'Личное авто' },
                    ].map((card) => (
                      <div
                        key={card.label}
                        className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-[#0D0D0D]"
                      >
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {card.label}
                        </div>
                        <div className="mt-1 text-xs sm:text-sm font-bold text-[#0058cd] dark:text-emerald-400">
                          {card.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs sm:text-sm dark:border-white/10 dark:bg-[#0D0D0D]">
                    {[
                      'Компьютерная диагностика двигателя и АКПП без активных ошибок',
                      'Сверка пробега по страховой и сервисной базам (CarHistory / Encar)',
                      'Полный видео-обзор кузова и салона перед внесением оплаты',
                    ].map((txt) => (
                      <div
                        key={txt}
                        className="flex items-start gap-2 text-slate-700 dark:text-slate-300"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#0058cd] dark:text-[#8fff00] shrink-0 mt-0.5" />
                        <span>{txt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Categorized Equipment & Options */}
            <section
              id="sec-options"
              className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-white/10 dark:bg-[#141414]"
            >
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Комплектация и опции ({car.trim})
              </h2>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {equipmentGroups.map((group) => (
                  <div
                    key={group.title}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4 dark:border-white/5 dark:bg-[#0D0D0D]"
                  >
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {group.title}
                    </h3>
                    <ul className="mt-2.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {group.items.map((opt) => (
                        <li key={opt} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-[#0058cd] dark:text-[#8fff00] shrink-0 mt-0.5" />
                          <span>{opt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: Cost Breakdown + Timeline */}
            <section
              id="sec-price"
              className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 dark:border-white/10 dark:bg-[#141414] space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  Расчёт стоимости под ключ в Бишкеке
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    onOpenInCalculator({
                      country: car.country,
                      priceUsd: car.sourcePriceUsd,
                      year: car.year,
                      engineCc: car.engineCc || 2000,
                      fuel: car.fuel,
                      title: `${car.brand} ${car.model} (${car.year})`,
                    })
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0058cd] hover:underline dark:text-[#8fff00]"
                >
                  <Calculator className="h-3.5 w-3.5" />
                  <span>Точный калькулятор растаможки</span>
                </button>
              </div>

              {/* Stacked Visual Cost Bar */}
              <div>
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div style={{ width: `${sourcePct}%` }} className="bg-sky-500" title="Цена авто" />
                  <div
                    style={{ width: `${logisticsPct}%` }}
                    className="bg-indigo-500"
                    title="Логистика"
                  />
                  <div
                    style={{ width: `${customsPct}%` }}
                    className="bg-[#0058cd] dark:bg-[#8fff00]"
                    title="Растаможка"
                  />
                  <div
                    style={{ width: `${servicePct}%` }}
                    className="bg-blue-400 dark:bg-emerald-500"
                    title="Услуги и осмотр"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-sky-500" />
                    Авто ({sourcePct}%)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    Логистика ({logisticsPct}%)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#0058cd] dark:bg-[#8fff00]" />
                    Таможня ({customsPct}%)
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-400 dark:bg-emerald-500" />
                    Услуга ({servicePct}%)
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-600 dark:text-slate-300">
                    Цена на площадке ({car.country}):
                  </span>
                  <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                    ${car.sourcePriceUsd.toLocaleString('ru-RU')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-600 dark:text-slate-300">
                    Доставка в Кыргызстан ({car.deliveryDays}):
                  </span>
                  <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                    ${logisticsUsd.toLocaleString('ru-RU')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-600 dark:text-slate-300">
                    Растаможка:
                  </span>
                  <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                    ${customsUsd.toLocaleString('ru-RU')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-600 dark:text-slate-300">
                    Услуга:
                  </span>
                  <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                    ${serviceUsd.toLocaleString('ru-RU')}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Итого под ключ в г. Бишкек
                  </span>
                  <div className="text-right">
                    <div className="font-mono text-lg sm:text-xl font-extrabold tabular-nums text-[#0058cd] dark:text-[#8fff00]">
                      ${displayPriceUsd.toLocaleString('ru-RU')}
                    </div>
                    <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      ~ {displayPriceKgs.toLocaleString('ru-RU')} сом
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {[
                  { icon: Sparkles, step: '01', title: 'Осмотр за 2 часа' },
                  { icon: FileCheck2, step: '02', title: 'Договор и инвойс' },
                  { icon: Truck, step: '03', title: `Путь ${car.deliveryDays}` },
                  { icon: MapPin, step: '04', title: 'Выдача в Бишкеке' },
                ].map((stage) => {
                  const Icon = stage.icon;
                  return (
                    <div
                      key={stage.step}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-white/5 dark:bg-[#0D0D0D]"
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-[#0058cd] dark:text-[#8fff00]">
                        <span>{stage.step}</span>
                        <Icon className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <div className="mt-1.5 text-xs font-bold text-slate-900 dark:text-white">
                        {stage.title}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* RIGHT STICKY SIDEBAR (Desktop) */}
          <aside className="hidden lg:block lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#141414] space-y-5">
              {/* Price Box */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#0D0D0D]">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Итоговая цена под ключ</span>
                  <span className="rounded-md bg-[#0058cd]/10 px-2 py-0.5 font-bold text-[#0058cd] dark:bg-emerald-500/15 dark:text-emerald-400">
                    Выгода ~${savingsUsd.toLocaleString('ru-RU')}
                  </span>
                </div>
                <div className="mt-1.5 flex items-baseline justify-between gap-2">
                  <span className="font-mono text-3xl font-extrabold tabular-nums text-slate-900 dark:text-white">
                    ${displayPriceUsd.toLocaleString('ru-RU')}
                  </span>
                  <span className="font-mono text-sm font-semibold tabular-nums text-slate-500 dark:text-slate-400">
                    ~ {displayPriceKgs.toLocaleString('ru-RU')} сом
                  </span>
                </div>
                <div className="mt-3 space-y-1.5 border-t border-slate-200 pt-3 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Цена на площадке ({car.country}):</span>
                    <span className="font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                      ${car.sourcePriceUsd.toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Доставка в Кыргызстан:</span>
                    <span className="font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                      ${logisticsUsd.toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Растаможка:</span>
                    <span className="font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                      ${customsUsd.toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Услуга:</span>
                    <span className="font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                      ${serviceUsd.toLocaleString('ru-RU')}
                    </span>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center justify-between border-t border-slate-200 pt-2 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
                  <span>Средняя цена на рынке КР:</span>
                  <span className="font-mono line-through opacity-75">
                    ${marketAvgUsd.toLocaleString('ru-RU')}
                  </span>
                </div>
              </div>

              {/* Quick 4 Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-white/5 dark:bg-[#0D0D0D]">
                  <div className="text-slate-400">Пробег</div>
                  <div className="mt-0.5 font-mono font-bold text-slate-900 dark:text-white">
                    {car.mileageKm.toLocaleString('ru-RU')} км
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-white/5 dark:bg-[#0D0D0D]">
                  <div className="text-slate-400">Двигатель</div>
                  <div className="mt-0.5 font-bold text-slate-900 dark:text-white truncate">
                    {car.fuel} · {car.engineCc > 0 ? `${(car.engineCc / 1000).toFixed(1)} л` : 'EV'}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-white/5 dark:bg-[#0D0D0D]">
                  <div className="text-slate-400">КПП / Привод</div>
                  <div className="mt-0.5 font-bold text-slate-900 dark:text-white truncate">
                    {car.transmission} · {car.drive}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-white/5 dark:bg-[#0D0D0D]">
                  <div className="text-slate-400">Срок доставки</div>
                  <div className="mt-0.5 font-bold text-slate-900 dark:text-white">
                    {car.deliveryDays}
                  </div>
                </div>
              </div>

              {/* Primary CTA Buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => onOrderCar(car)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0058cd] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#0046a3] dark:bg-[#8fff00] dark:text-slate-950 dark:hover:bg-[#7ae000]"
                >
                  <Send className="h-4 w-4" />
                  <span>Заказать авто под ключ</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => onOrderCar(car)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/10 dark:bg-[#0D0D0D] dark:text-slate-200 dark:hover:border-[#8fff00] dark:hover:text-[#8fff00]"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>Менеджер</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenInCalculator({
                        country: car.country,
                        priceUsd: car.sourcePriceUsd,
                        year: car.year,
                        engineCc: car.engineCc || 2000,
                        fuel: car.fuel,
                        title: `${car.brand} ${car.model} (${car.year})`,
                      })
                    }
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/10 dark:bg-[#0D0D0D] dark:text-slate-200 dark:hover:border-[#8fff00] dark:hover:text-[#8fff00]"
                  >
                    <Calculator className="h-3.5 w-3.5" />
                    <span>Калькулятор</span>
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 space-y-1.5 dark:bg-[#0D0D0D] dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#0058cd] dark:text-[#8fff00] shrink-0" />
                  <span>Договор и фиксация цены до выкупа на площадке</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#0058cd] dark:text-[#8fff00] shrink-0" />
                  <span>Офис Trust Auto: г. Бишкек, ул. Ибраимова, 115</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Listings */}
        {similarCars.length > 0 && (
          <section className="pt-4 border-t border-slate-200 dark:border-white/10">
            <div className="mb-3.5 flex items-center justify-between gap-2">
              <h2 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white">
                Похожие предложения
              </h2>
              <button
                type="button"
                onClick={onBackToCatalog}
                className="text-xs sm:text-sm font-semibold text-[#0058cd] hover:underline dark:text-[#8fff00]"
              >
                Все объявления →
              </button>
            </div>
            <div className="grid grid-cols-2 auto-rows-fr gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-3.5">
              {similarCars.map((item) => (
                <CarCard
                  key={item.id}
                  car={item}
                  onSelect={onSelectCar}
                  isFavorite={favorites.has(item.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр фото в полном размере"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Закрыть просмотр"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#0058cd] hover:text-white dark:hover:bg-[#8fff00] dark:hover:text-slate-950"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative flex max-h-[88vh] max-w-5xl w-full items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[slideIndex] || car.image}
              alt={`${car.brand} ${car.model} — фото ${slideIndex + 1}`}
              referrerPolicy="no-referrer"
              className="max-h-[82vh] w-auto max-w-full rounded-xl object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setSlideIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                  }
                  aria-label="Предыдущее фото"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white hover:bg-[#0058cd] hover:text-white dark:hover:bg-[#8fff00] dark:hover:text-slate-950"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSlideIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                  }
                  aria-label="Следующее фото"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white hover:bg-[#0058cd] hover:text-white dark:hover:bg-[#8fff00] dark:hover:text-slate-950"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-white/80">
              {slideIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
