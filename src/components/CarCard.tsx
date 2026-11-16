import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Gavel, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CarListing } from '../types/car';

interface CarCardProps {
  car: CarListing;
  onSelect: (car: CarListing) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  viewMode?: 'grid' | 'list';
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  onSelect,
  isFavorite,
  onToggleFavorite,
  viewMode = 'grid',
}) => {
  const images = car.images && car.images.length > 0 ? car.images : [car.image];
  const [slideIndex, setSlideIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const formattedPriceUsd = car.priceUsd.toLocaleString('ru-RU');
  const formattedSourcePriceUsd = car.sourcePriceUsd.toLocaleString('ru-RU');
  const formattedMileage = car.mileageKm.toLocaleString('ru-RU');
  const engineLabel = car.engineCc > 0 ? `${(car.engineCc / 1000).toFixed(1)} л` : 'EV';
  const sourcePriceLabel =
    car.country === 'Южная Корея' ? 'Цена в Корее' : `Цена (${car.country})`;

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || images.length <= 1) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 28) {
      if (diff > 0) {
        setSlideIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        setSlideIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }
    touchStartX.current = null;
  };

  if (viewMode === 'list') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.22 }}
        className="group flex flex-row items-stretch overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-[#0058cd]/60 dark:border-white/10 dark:bg-[#141414] dark:hover:border-[#8fff00]/60"
      >
        <div
          onClick={() => onSelect(car)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(car);
            }
          }}
          className="relative w-40 sm:w-72 aspect-[6/5] shrink-0 overflow-hidden bg-slate-100 dark:bg-[#0D0D0D] cursor-pointer"
        >
          <img
            src={images[slideIndex]}
            alt={`${car.brand} ${car.model}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Предыдущее фото"
                className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-[#0058cd] hover:text-white dark:hover:bg-[#8fff00] dark:hover:text-slate-950 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Следующее фото"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-[#0058cd] hover:text-white dark:hover:bg-[#8fff00] dark:hover:text-slate-950 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <div className="absolute bottom-1.5 right-1.5 z-10 flex items-center gap-1 rounded-full bg-black/55 px-1.5 py-0.5 backdrop-blur-sm">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Фото ${idx + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlideIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === slideIndex ? 'w-3 bg-[#0058cd] dark:bg-[#8fff00]' : 'w-1.5 bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 pointer-events-none">
            {car.labels.slice(0, 1).map((label) => (
              <span
                key={label}
                className="rounded bg-[#0058cd] px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-white dark:bg-[#8fff00] dark:text-slate-950"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between gap-2 sm:gap-4 p-2.5 sm:px-5 min-w-0">
          <button
            type="button"
            onClick={() => onSelect(car)}
            className="text-left min-w-0 flex-1"
          >
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h3 className="text-xs sm:text-base font-bold text-slate-900 group-hover:text-[#0058cd] dark:text-white dark:group-hover:text-[#8fff00] truncate">
                {car.brand} {car.model}
              </h3>
              <span className="font-mono text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                {car.year}
              </span>
              <span className="rounded bg-[#0058cd]/10 px-1.5 py-0.5 text-[9px] sm:text-[11px] font-semibold text-[#0058cd] dark:bg-[#8fff00]/15 dark:text-[#8fff00] truncate max-w-[160px] sm:max-w-none">
                {car.trim}
              </span>
            </div>
            <p className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
              {formattedMileage} км · {engineLabel} · {car.fuel} · {car.transmission} · {car.drive}
            </p>
            <div className="mt-1 sm:mt-2 flex flex-wrap gap-1.5">
              {car.labels.map((label) => (
                <span
                  key={label}
                  className="text-[9px] sm:text-[11px] font-medium text-slate-600 dark:text-slate-300"
                >
                  • {label}
                </span>
              ))}
            </div>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {sourcePriceLabel}:{' '}
                <span className="font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                  ${formattedSourcePriceUsd}
                </span>
              </div>
              <div className="mt-0.5 flex items-baseline justify-end gap-1">
                <span className="font-mono text-xs sm:text-base font-extrabold tabular-nums text-[#0058cd] dark:text-[#8fff00]">
                  ${formattedPriceUsd}
                </span>
                <span className="text-[9px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300">
                  под ключ
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onToggleFavorite(car.id)}
              aria-label="В избранное"
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#0058cd] dark:hover:bg-white/5 dark:hover:text-[#8fff00]"
            >
              <Heart
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFavorite ? 'fill-[#0058cd] text-[#0058cd] dark:fill-[#8fff00] dark:text-[#8fff00]' : ''}`}
              />
            </button>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-150 hover:border-[#0058cd]/60 dark:border-white/10 dark:bg-[#141414] dark:hover:border-[#8fff00]/60"
    >
      {/* Large 11:10 Image Carousel */}
      <div
        onClick={() => onSelect(car)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(car);
          }
        }}
        className="relative aspect-[11/10] w-full overflow-hidden bg-slate-100 text-left dark:bg-[#0D0D0D] focus-visible:outline-none cursor-pointer"
      >
        <img
          src={images[slideIndex]}
          alt={`${car.brand} ${car.model} ${car.year} — фото ${slideIndex + 1}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 pointer-events-none"
        />

        {/* Top Source Badge & Auction Timer */}
        <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 right-1.5 sm:right-2 flex items-center justify-between gap-1 text-[8px] sm:text-[10px] font-semibold text-white pointer-events-none">
          <span className="rounded bg-black/55 px-1 sm:px-1.5 py-0.5 backdrop-blur-sm truncate">
            {car.platform} · {car.country}
          </span>
          {car.isAuction && car.auctionEndsIn ? (
            <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded bg-[#0058cd] px-1 sm:px-1.5 py-0.5 text-white dark:bg-[#8fff00] dark:text-slate-950 shrink-0">
              <Gavel className="h-2.5 w-2.5" />
              <span>{car.auctionEndsIn}</span>
            </span>
          ) : images.length > 1 ? (
            <span className="rounded bg-black/55 px-1.5 py-0.5 font-mono tabular-nums text-white/90 backdrop-blur-sm shrink-0">
              {slideIndex + 1}/{images.length}
            </span>
          ) : null}
        </div>

        {/* Carousel Prev / Next Controls */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Предыдущее фото"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-[#0058cd] hover:text-white dark:hover:bg-[#8fff00] dark:hover:text-slate-950 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Следующее фото"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-all hover:bg-[#0058cd] hover:text-white dark:hover:bg-[#8fff00] dark:hover:text-slate-950 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </>
        )}

        {/* Bottom Compact Labels + Carousel Indicator Dots */}
        <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2 right-1.5 sm:right-2 flex items-end justify-between gap-1.5">
          <div className="flex flex-wrap items-center gap-1 pointer-events-none">
            {car.labels.map((label) => {
              const isPromo = label.includes('15%') || label.includes('Выгодная');
              return (
                <span
                  key={label}
                  className={`rounded px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[10px] font-semibold backdrop-blur-sm ${
                    isPromo
                      ? 'bg-[#0058cd] text-white dark:bg-[#8fff00] dark:text-slate-950'
                      : 'bg-black/65 text-slate-100 border border-white/15'
                  }`}
                >
                  {label}
                </span>
              );
            })}
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-1 rounded-full bg-black/55 px-1.5 py-1 backdrop-blur-sm shrink-0">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Переключить на фото ${idx + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSlideIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === slideIndex
                      ? 'w-3.5 bg-[#0058cd] dark:bg-[#8fff00]'
                      : 'w-1.5 bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info & Pricing Block */}
      <div className="flex flex-1 flex-col justify-between p-2 sm:p-3">
        <button
          type="button"
          onClick={() => onSelect(car)}
          className="text-left focus-visible:outline-none min-w-0"
        >
          <h3 className="text-xs sm:text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#0058cd] dark:text-white dark:group-hover:text-[#8fff00] truncate">
            {car.brand} {car.model}
          </h3>

          <div className="mt-1 flex items-center gap-1.5 min-w-0">
            <span className="font-mono text-[10px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
              {car.year}
            </span>
            <span className="truncate rounded bg-[#0058cd]/10 px-1.5 py-0.5 text-[9px] sm:text-[11px] font-semibold text-[#0058cd] dark:bg-[#8fff00]/15 dark:text-[#8fff00]">
              {car.trim}
            </span>
          </div>

          <div className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
            <span className="font-mono tabular-nums">{formattedMileage} км</span> · {engineLabel} · {car.fuel}
          </div>
          <div className="mt-0.5 text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {car.transmission} · {car.drive}
          </div>
        </button>

        <div className="mt-2 border-t border-slate-100 pt-1.5 sm:pt-2 dark:border-white/10">
          <button
            type="button"
            onClick={() => onSelect(car)}
            className="flex w-full items-center justify-between gap-1 text-left text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400"
          >
            <span className="truncate">{sourcePriceLabel}:</span>
            <span className="font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-300 shrink-0">
              ${formattedSourcePriceUsd}
            </span>
          </button>

          <div className="mt-0.5 flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={() => onSelect(car)}
              className="flex min-w-0 items-baseline gap-1 sm:gap-1.5 text-left"
            >
              <span className="font-mono text-[13px] sm:text-base font-extrabold tabular-nums text-[#0058cd] dark:text-[#8fff00] shrink-0">
                ${formattedPriceUsd}
              </span>
              <span className="text-[9px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
                под ключ
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(car.id);
              }}
              aria-label={isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}
              className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0058cd] dark:hover:bg-white/5 dark:hover:text-[#8fff00]"
            >
              <Heart
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFavorite ? 'fill-[#0058cd] text-[#0058cd] dark:fill-[#8fff00] dark:text-[#8fff00]' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
