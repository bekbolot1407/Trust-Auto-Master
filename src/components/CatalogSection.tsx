import React, { useEffect, useRef, useState } from 'react';
import { CarFront, Handshake, Loader2, RotateCcw } from 'lucide-react';
import type { CarListing, ExportCountry } from '../types/car';
import { CarCard } from './CarCard';
import { LeadInlineCard } from './LeadInlineCard';

interface CatalogSectionProps {
  cars: CarListing[];
  totalAvailable: number;
  onSelectCar: (car: CarListing) => void;
  onOpenManager: () => void;
  onResetFilters: () => void;
  onSelectSouthKorea: () => void;
  selectedCountry: ExportCountry | null;
  activePlatformLabel: string;
  viewMode: 'grid' | 'list';
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  showFavoritesOnly: boolean;
}

const BATCH_SIZE = 50;

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  cars,
  totalAvailable,
  onSelectCar,
  onOpenManager,
  onResetFilters,
  onSelectSouthKorea,
  selectedCountry,
  activePlatformLabel,
  viewMode,
  favorites,
  onToggleFavorite,
  showFavoritesOnly,
}) => {
  const [visibleCount, setVisibleCount] = useState<number>(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [cars]);

  const hasMore = visibleCount < cars.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, cars.length));
            setIsLoadingMore(false);
          }, 260);
        }
      },
      { rootMargin: '320px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, cars.length]);

  const displayedCars = cars.slice(0, visibleCount);

  // Every 7th card (after every 6 cars) is "Оставить заявку"
  const gridItems: Array<
    | { type: 'car'; car: CarListing }
    | { type: 'lead'; key: string }
  > = [];

  displayedCars.forEach((car, index) => {
    gridItems.push({ type: 'car', car });
    if ((index + 1) % 6 === 0) {
      gridItems.push({ type: 'lead', key: `lead-after-${index + 1}` });
    }
  });

  return (
    <section id="catalog-section" className="pt-3 pb-10 sm:pb-14">
      <div className="mx-auto max-w-[1440px] px-2.5 sm:px-6 lg:px-8">
        {/* Compact Catalog Header */}
        <div className="mb-3 sm:mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] sm:text-sm text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-900 dark:text-white">
              {showFavoritesOnly ? 'Избранное' : activePlatformLabel}
            </span>{' '}
            · Показано{' '}
            <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
              {displayedCars.length}
            </span>{' '}
            из{' '}
            <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
              {cars.length}
            </span>{' '}
            (в базе {totalAvailable})
          </div>
        </div>

        {/* Empty / Partner Coming Soon State */}
        {!showFavoritesOnly && selectedCountry && selectedCountry !== 'Южная Корея' ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-14 sm:py-20 text-center dark:border-white/10 dark:bg-[#141414]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0058cd]/10 text-[#0058cd] dark:bg-[#8fff00]/15 dark:text-[#8fff00]">
              <Handshake className="h-7 w-7" />
            </div>
            <span className="mt-4 inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              Направление: {selectedCountry}
            </span>
            <h3 className="mt-3 text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Ищем надежных партнеров. Скоро запуск...
            </h3>
            <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Сейчас в каталоге доступны проверенные автомобили из Южной Кореи, или вы можете оставить индивидуальный запрос менеджеру.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onSelectSouthKorea}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0058cd] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-[#0046a3] dark:bg-[#8fff00] dark:text-slate-950 dark:hover:bg-[#7ae000]"
              >
                <span>🇰🇷 Смотреть авто из Южной Кореи</span>
              </button>
              <button
                type="button"
                onClick={onOpenManager}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/10 dark:bg-[#1C1C1C] dark:text-slate-200 dark:hover:border-[#8fff00] dark:hover:text-[#8fff00]"
              >
                <span>Позвать менеджера</span>
              </button>
            </div>
          </div>
        ) : cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-[#141414]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <CarFront className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              {showFavoritesOnly
                ? 'В избранном пока нет автомобилей'
                : 'По выбранным параметрам авто не найдены'}
            </h3>
            <p className="mt-1.5 max-w-md text-sm text-slate-500 dark:text-slate-400">
              {showFavoritesOnly
                ? 'Нажмите на сердечко на любой карточке автомобиля, чтобы сохранить понравившиеся варианты.'
                : 'Попробуйте сбросить фильтры или оставьте заявку — менеджер подберёт нужную модель с аукциона.'}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/10 dark:bg-[#1C1C1C] dark:text-slate-200 dark:hover:border-[#8fff00] dark:hover:text-[#8fff00]"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Сбросить фильтры</span>
              </button>
              <button
                type="button"
                onClick={onOpenManager}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0058cd] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0046a3] dark:bg-[#8fff00] dark:text-slate-950 dark:hover:bg-[#7ae000]"
              >
                <span>Позвать менеджера</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div
              className={
                viewMode === 'list'
                  ? 'flex flex-col gap-2.5 sm:gap-3'
                  : 'grid grid-cols-2 auto-rows-fr gap-2 sm:gap-3 lg:grid-cols-4 lg:gap-3.5'
              }
            >
              {gridItems.map((item) =>
                item.type === 'lead' ? (
                  <LeadInlineCard
                    key={item.key}
                    onOpenManager={onOpenManager}
                    viewMode={viewMode}
                  />
                ) : (
                  <CarCard
                    key={item.car.id}
                    car={item.car}
                    onSelect={onSelectCar}
                    isFavorite={favorites.has(item.car.id)}
                    onToggleFavorite={onToggleFavorite}
                    viewMode={viewMode}
                  />
                )
              )}
            </div>

            {hasMore && (
              <div
                ref={sentinelRef}
                className="mt-10 flex flex-col items-center justify-center gap-3 py-4"
              >
                {isLoadingMore ? (
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin text-[#0058cd] dark:text-[#8fff00]" />
                    <span>Загружаем следующую партию автомобилей...</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, cars.length))
                    }
                    className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/10 dark:bg-[#141414] dark:text-slate-200 dark:hover:border-[#8fff00] dark:hover:text-[#8fff00]"
                  >
                    Показать ещё {Math.min(BATCH_SIZE, cars.length - visibleCount)} авто
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
