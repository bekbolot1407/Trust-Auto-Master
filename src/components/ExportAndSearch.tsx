import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { EXPORT_COUNTRIES } from '../data/cars';
import type { ExportCountry } from '../types/car';

interface ExportAndSearchProps {
  selectedCountry: ExportCountry | null;
  onSelectCountry: (country: ExportCountry | null) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalMatchedCount: number;
}

export const ExportAndSearch: React.FC<ExportAndSearchProps> = ({
  selectedCountry,
  onSelectCountry,
  searchQuery,
  onSearchChange,
  totalMatchedCount,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollCountries = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === 'left' ? -150 : 150,
      behavior: 'smooth',
    });
  };

  return (
    <section className="pt-2.5 sm:pt-4 pb-2 sm:pb-3">
      <div className="mx-auto max-w-[1440px] px-2.5 sm:px-6 lg:px-8 space-y-2 sm:space-y-3.5">
        {/* Listing Count Indicator */}
        <div className="font-mono text-[11px] sm:text-xs tabular-nums text-slate-500 dark:text-slate-400">
          {totalMatchedCount.toLocaleString('ru-RU')} объявлений
        </div>

        {/* Экспорт из: Single-line horizontally scrollable row on mobile, wrapping cleanly on sm+ */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] sm:text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
            Экспорт из:
          </span>

          <button
            type="button"
            onClick={() => scrollCountries('left')}
            aria-label="Прокрутить страны назад"
            className="sm:hidden flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 active:scale-95 dark:border-white/10 dark:bg-[#141414] dark:text-slate-300"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex flex-1 min-w-0 items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap scroll-smooth py-0.5"
          >
            <button
              type="button"
              onClick={() => onSelectCountry(null)}
              aria-pressed={selectedCountry === null}
              className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-full border px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-sm font-medium transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058cd] dark:focus-visible:ring-[#8fff00] ${
                selectedCountry === null
                  ? 'border-[#0058cd] bg-[#0058cd] text-white font-semibold dark:border-[#8fff00] dark:bg-[#8fff00] dark:text-slate-950'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-[#0058cd]/50 dark:border-white/10 dark:bg-[#141414] dark:text-slate-200 dark:hover:border-[#8fff00]/50'
              }`}
            >
              <span aria-hidden="true">🌐</span>
              <span>Все</span>
            </button>

            {EXPORT_COUNTRIES.map((country) => {
              const isSelected = selectedCountry === country.name;
              return (
                <button
                  key={country.name}
                  type="button"
                  onClick={() => onSelectCountry(isSelected ? null : country.name)}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-1 sm:gap-1.5 rounded-full border px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-sm font-medium transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058cd] dark:focus-visible:ring-[#8fff00] ${
                    isSelected
                      ? 'border-[#0058cd] bg-[#0058cd] text-white font-semibold dark:border-[#8fff00] dark:bg-[#8fff00] dark:text-slate-950'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-[#0058cd]/50 dark:border-white/10 dark:bg-[#141414] dark:text-slate-200 dark:hover:border-[#8fff00]/50'
                  }`}
                >
                  <span aria-hidden="true">{country.flag}</span>
                  <span>{country.name}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollCountries('right')}
            aria-label="Прокрутить страны вперёд"
            className="sm:hidden flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 active:scale-95 dark:border-white/10 dark:bg-[#141414] dark:text-slate-300"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Поиск по ключевым словам */}
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="keyword-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск по ключевым словам (марка, модель, VIN, Родной окрас, Гибрид...)"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#0058cd] focus:outline-none dark:border-white/10 dark:bg-[#0D0D0D] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-[#8fff00]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Очистить поиск"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
