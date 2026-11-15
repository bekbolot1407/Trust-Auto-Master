import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Gavel,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  ALL_BRANDS,
  AUCTION_HOUSES,
  KOREAN_DEALERS,
  UPCOMING_AUCTIONS,
  getModelsForBrand,
} from '../data/cars';
import type { FilterState, PlatformCategory, SortOption } from '../types/car';

interface FilterPanelProps {
  filters: FilterState;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onSelectPlatformCategory: (category: PlatformCategory) => void;
  onSelectUpcomingAuction: (auctionLabel: string) => void;
  onResetFilters: () => void;
  categoryCounts: Record<PlatformCategory, number>;
  subPlatformCounts: Record<string, number>;
  upcomingAuctionCounts: Record<string, number>;
  activeFilterCount: number;
  matchedCount: number;
  viewMode: 'grid' | 'list';
  onChangeViewMode: (mode: 'grid' | 'list') => void;
  onScrollToCatalog: () => void;
}

const BODY_TYPES = ['Седан', 'Кроссовер', 'Внедорожник', 'Минивэн', 'Хэтчбек'];
const FUEL_TYPES = ['Бензин', 'Дизель', 'Гибрид', 'Электро', 'Газ (LPG)'];
const TRANSMISSIONS = ['Автомат', 'Робот', 'Вариатор', 'Механика'];
const DRIVES = ['Передний', 'Полный (AWD)', 'Задний'];
const YEARS = Array.from({ length: 10 }, (_, idx) => String(2026 - idx));
const ENGINE_VOLUMES = ['1.0', '1.4', '1.6', '2.0', '2.2', '2.5', '3.0', '3.5'];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'year-desc', label: 'Сначала новее' },
  { value: 'mileage-asc', label: 'Меньше пробег' },
];

type MobileSheetType = 'brand' | 'all' | 'price' | 'year' | 'mileage' | 'auctions' | null;

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onUpdateFilter,
  onSelectPlatformCategory,
  onSelectUpcomingAuction,
  onResetFilters,
  categoryCounts,
  subPlatformCounts,
  upcomingAuctionCounts,
  activeFilterCount,
  matchedCount,
  viewMode,
  onChangeViewMode,
  onScrollToCatalog,
}) => {
  const [mobileSheet, setMobileSheet] = useState<MobileSheetType>(null);
  const availableModels = getModelsForBrand(filters.brand);

  const controlClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-[#0058cd] focus:bg-white focus:outline-none dark:border-white/10 dark:bg-[#0D0D0D] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-[#8fff00] dark:focus:bg-[#111111]';

  const subPlatforms =
    filters.platformCategory === 'Площадки Кореи'
      ? KOREAN_DEALERS
      : filters.platformCategory === 'Аукционы'
      ? AUCTION_HOUSES
      : [];

  const brandSummary =
    [filters.brand, filters.model].filter(Boolean).join(' ') ||
    filters.search.trim() ||
    'Марка и модель';

  const hasBrandSummary = Boolean(filters.brand || filters.model || filters.search.trim());
  const hasPrice = Boolean(filters.priceFrom || filters.priceTo);
  const hasYear = Boolean(filters.yearFrom || filters.yearTo);
  const hasMileage = Boolean(filters.mileageFrom || filters.mileageTo);
  const hasUpcomingAuction = Boolean(filters.upcomingAuction);

  return (
    <section id="filters-section" className="py-1.5 sm:py-2">
      <div className="mx-auto max-w-[1440px] px-2.5 sm:px-6 lg:px-8 space-y-2.5 sm:space-y-3.5">
        {/* Part 1: 3-Button Platform Category Switcher + Conditional Dealers / Auctions Sub-row */}
        <div className="flex flex-col items-center gap-2 sm:gap-2.5 py-1">
          {/* Top 3-button segmented control */}
          <div className="inline-flex max-w-full items-center overflow-x-auto no-scrollbar rounded-full border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-[#141414]">
            <button
              type="button"
              onClick={() => onSelectPlatformCategory('Наш автопарк')}
              aria-pressed={filters.platformCategory === 'Наш автопарк'}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 sm:px-5 sm:py-2 text-[11px] sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058cd] dark:focus-visible:ring-[#8fff00] ${
                filters.platformCategory === 'Наш автопарк'
                  ? 'bg-[#0058cd] text-white shadow-sm dark:bg-[#8fff00] dark:text-slate-950'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <span>Наш автопарк</span>
              <span
                className={`font-mono text-[10px] sm:text-xs tabular-nums ${
                  filters.platformCategory === 'Наш автопарк'
                    ? 'text-white/85 dark:text-slate-900/75'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {categoryCounts['Наш автопарк'] || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectPlatformCategory('Площадки Кореи')}
              aria-pressed={filters.platformCategory === 'Площадки Кореи'}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 sm:px-5 sm:py-2 text-[11px] sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058cd] dark:focus-visible:ring-[#8fff00] ${
                filters.platformCategory === 'Площадки Кореи'
                  ? 'bg-[#0058cd] text-white shadow-sm dark:bg-[#8fff00] dark:text-slate-950'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <span>Площадки Кореи</span>
              <span
                className={`font-mono text-[10px] sm:text-xs tabular-nums ${
                  filters.platformCategory === 'Площадки Кореи'
                    ? 'text-white/85 dark:text-slate-900/75'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {categoryCounts['Площадки Кореи'] || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectPlatformCategory('Аукционы')}
              aria-pressed={filters.platformCategory === 'Аукционы'}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 sm:px-5 sm:py-2 text-[11px] sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058cd] dark:focus-visible:ring-[#8fff00] ${
                filters.platformCategory === 'Аукционы'
                  ? 'bg-[#0058cd] text-white shadow-sm dark:bg-[#8fff00] dark:text-slate-950'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Gavel className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
              <span>Аукционы</span>
              <span
                className={`font-mono text-[10px] sm:text-xs tabular-nums ${
                  filters.platformCategory === 'Аукционы'
                    ? 'text-white/85 dark:text-slate-900/75'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {categoryCounts['Аукционы'] || 0}
              </span>
            </button>
          </div>

          {/* Conditional Sub-row: Shown ONLY for "Площадки Кореи" or "Аукционы" */}
          {subPlatforms.length > 0 && (
            <div className="flex w-full items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar sm:flex-wrap py-0.5">
              <button
                type="button"
                onClick={() => onUpdateFilter('subPlatform', '')}
                aria-pressed={filters.subPlatform === ''}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058cd] dark:focus-visible:ring-[#8fff00] ${
                  filters.subPlatform === ''
                    ? 'border-[#0058cd] bg-[#0058cd]/10 text-[#0058cd] dark:border-[#8fff00] dark:bg-[#8fff00]/15 dark:text-[#8fff00]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-[#0058cd]/50 dark:border-white/10 dark:bg-[#141414] dark:text-slate-300 dark:hover:border-[#8fff00]/50'
                }`}
              >
                <span>Все</span>
                <span className="font-mono text-[10px] sm:text-[11px] tabular-nums opacity-75">
                  {categoryCounts[filters.platformCategory] || 0}
                </span>
              </button>

              {subPlatforms.map((item) => {
                const isSelected = filters.subPlatform === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onUpdateFilter('subPlatform', isSelected ? '' : item)}
                    aria-pressed={isSelected}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058cd] dark:focus-visible:ring-[#8fff00] ${
                      isSelected
                        ? 'border-[#0058cd] bg-[#0058cd]/10 text-[#0058cd] dark:border-[#8fff00] dark:bg-[#8fff00]/15 dark:text-[#8fff00]'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-[#0058cd]/50 dark:border-white/10 dark:bg-[#141414] dark:text-slate-300 dark:hover:border-[#8fff00]/50'
                    }`}
                  >
                    <span>{item}</span>
                    <span className="font-mono text-[10px] sm:text-[11px] tabular-nums opacity-75">
                      {subPlatformCounts[item] || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Part 2A: Compact Mobile Filter (matches reference design) */}
        <div className="sm:hidden space-y-2">
          {/* Search / Brand & Model Pill */}
          <button
            type="button"
            onClick={() => setMobileSheet('brand')}
            className={`flex w-full items-center justify-between gap-2 rounded-full border px-4 py-2.5 text-left transition-colors ${
              hasBrandSummary
                ? 'border-[#0058cd] bg-white text-slate-900 dark:border-[#8fff00] dark:bg-[#141414] dark:text-white'
                : 'border-slate-200 bg-white text-slate-500 dark:border-white/10 dark:bg-[#141414] dark:text-slate-400'
            }`}
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <Search className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="truncate text-sm font-medium">{brandSummary}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
          </button>

          {/* Single-line Horizontal Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setMobileSheet('all')}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                activeFilterCount > 0
                  ? 'border-[#0058cd] bg-[#0058cd]/10 text-[#0058cd] dark:border-[#8fff00] dark:bg-[#8fff00]/15 dark:text-[#8fff00]'
                  : 'border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-[#141414] dark:text-white'
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Фильтры</span>
              {activeFilterCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0058cd] px-1 font-mono text-[10px] font-bold text-white dark:bg-[#8fff00] dark:text-slate-950">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {filters.platformCategory === 'Аукционы' && (
              <button
                type="button"
                onClick={() => setMobileSheet('auctions')}
                className={`inline-flex items-center gap-1 rounded-full border px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  hasUpcomingAuction
                    ? 'border-[#0058cd] bg-[#0058cd]/10 text-[#0058cd] dark:border-[#8fff00] dark:bg-[#8fff00]/15 dark:text-[#8fff00]'
                    : 'border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-[#141414] dark:text-white'
                }`}
              >
                <Calendar className="h-3.5 w-3.5 text-[#0058cd] dark:text-[#8fff00]" />
                <span>
                  {filters.upcomingAuction ? filters.upcomingAuction : 'Ближайшие аукционы'}
                </span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileSheet('price')}
              className={`inline-flex items-center gap-1 rounded-full border px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                hasPrice
                  ? 'border-[#0058cd] bg-[#0058cd]/10 text-[#0058cd] dark:border-[#8fff00] dark:bg-[#8fff00]/15 dark:text-[#8fff00]'
                  : 'border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-[#141414] dark:text-white'
              }`}
            >
              <span>Цена</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>

            <button
              type="button"
              onClick={() => setMobileSheet('year')}
              className={`inline-flex items-center gap-1 rounded-full border px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                hasYear
                  ? 'border-[#0058cd] bg-[#0058cd]/10 text-[#0058cd] dark:border-[#8fff00] dark:bg-[#8fff00]/15 dark:text-[#8fff00]'
                  : 'border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-[#141414] dark:text-white'
              }`}
            >
              <span>Год</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>

            <button
              type="button"
              onClick={() => setMobileSheet('mileage')}
              className={`inline-flex items-center gap-1 rounded-full border px-3.5 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                hasMileage
                  ? 'border-[#0058cd] bg-[#0058cd]/10 text-[#0058cd] dark:border-[#8fff00] dark:bg-[#8fff00]/15 dark:text-[#8fff00]'
                  : 'border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-[#141414] dark:text-white'
              }`}
            >
              <span>Пробег</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </button>
          </div>
        </div>

        {/* Part 2B: Desktop Filter Box */}
        <div className="hidden sm:block rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#141414]">
          <div className="space-y-3">
            {/* Conditional Upcoming Auctions Selector when Аукционы is selected */}
            {filters.platformCategory === 'Аукционы' && (
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#0058cd]/35 bg-[#0058cd]/5 p-3 dark:border-[#8fff00]/40 dark:bg-[#8fff00]/5">
                <label
                  htmlFor="upcoming-auction-select"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap"
                >
                  <Calendar className="h-4 w-4 text-[#0058cd] dark:text-[#8fff00]" />
                  <span>Ближайшие аукционы:</span>
                </label>
                <select
                  id="upcoming-auction-select"
                  value={filters.upcomingAuction}
                  onChange={(e) => onSelectUpcomingAuction(e.target.value)}
                  className="flex-1 min-w-[240px] rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 focus:border-[#0058cd] focus:outline-none dark:border-white/10 dark:bg-[#0D0D0D] dark:text-white dark:focus:border-[#8fff00]"
                >
                  <option value="">Все ближайшие аукционы</option>
                  {UPCOMING_AUCTIONS.map((auc) => (
                    <option key={auc.label} value={auc.label}>
                      {auc.label} ({upcomingAuctionCounts[auc.label] || 0} лотов)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Row 1: Марка (50%) + Модель (50%) */}
            <div className="grid grid-cols-2 gap-3">
              <select
                value={filters.brand}
                onChange={(e) => {
                  onUpdateFilter('brand', e.target.value);
                  onUpdateFilter('model', '');
                }}
                aria-label="Марка"
                className={controlClass}
              >
                <option value="">Марка</option>
                {ALL_BRANDS.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>

              <select
                value={filters.model}
                onChange={(e) => onUpdateFilter('model', e.target.value)}
                aria-label="Модель"
                className={controlClass}
              >
                <option value="">Модель</option>
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 2: Кузов, КПП, Двигатель, Привод, Объём от, Объём до */}
            <div className="grid grid-cols-6 gap-3">
              <select
                value={filters.bodyType}
                onChange={(e) => onUpdateFilter('bodyType', e.target.value)}
                aria-label="Кузов"
                className={controlClass}
              >
                <option value="">Кузов</option>
                {BODY_TYPES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              <select
                value={filters.transmission}
                onChange={(e) => onUpdateFilter('transmission', e.target.value)}
                aria-label="КПП"
                className={controlClass}
              >
                <option value="">КПП</option>
                {TRANSMISSIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <select
                value={filters.fuel}
                onChange={(e) => onUpdateFilter('fuel', e.target.value)}
                aria-label="Двигатель"
                className={controlClass}
              >
                <option value="">Двигатель</option>
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>

              <select
                value={filters.drive}
                onChange={(e) => onUpdateFilter('drive', e.target.value)}
                aria-label="Привод"
                className={controlClass}
              >
                <option value="">Привод</option>
                {DRIVES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                value={filters.engineFrom}
                onChange={(e) => onUpdateFilter('engineFrom', e.target.value)}
                aria-label="Объём от"
                className={controlClass}
              >
                <option value="">Объём от</option>
                {ENGINE_VOLUMES.map((v) => (
                  <option key={v} value={v}>
                    от {v} л
                  </option>
                ))}
              </select>

              <select
                value={filters.engineTo}
                onChange={(e) => onUpdateFilter('engineTo', e.target.value)}
                aria-label="Объём до"
                className={controlClass}
              >
                <option value="">Объём до</option>
                {ENGINE_VOLUMES.map((v) => (
                  <option key={v} value={v}>
                    до {v} л
                  </option>
                ))}
              </select>
            </div>

            {/* Row 3: Год от, Год до, Пробег от, Пробег до, Цена от $, Цена до $ */}
            <div className="grid grid-cols-6 gap-3">
              <select
                value={filters.yearFrom}
                onChange={(e) => onUpdateFilter('yearFrom', e.target.value)}
                aria-label="Год от"
                className={controlClass}
              >
                <option value="">Год от</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    от {y}
                  </option>
                ))}
              </select>

              <select
                value={filters.yearTo}
                onChange={(e) => onUpdateFilter('yearTo', e.target.value)}
                aria-label="Год до"
                className={controlClass}
              >
                <option value="">Год до</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    до {y}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min={0}
                step={5000}
                value={filters.mileageFrom}
                onChange={(e) => onUpdateFilter('mileageFrom', e.target.value)}
                placeholder="Пробег от"
                className={`${controlClass} font-mono tabular-nums placeholder:font-sans`}
              />

              <input
                type="number"
                min={0}
                step={5000}
                value={filters.mileageTo}
                onChange={(e) => onUpdateFilter('mileageTo', e.target.value)}
                placeholder="Пробег до"
                className={`${controlClass} font-mono tabular-nums placeholder:font-sans`}
              />

              <input
                type="number"
                min={0}
                step={500}
                value={filters.priceFrom}
                onChange={(e) => onUpdateFilter('priceFrom', e.target.value)}
                placeholder="Цена от, $"
                className={`${controlClass} font-mono tabular-nums placeholder:font-sans`}
              />

              <input
                type="number"
                min={0}
                step={500}
                value={filters.priceTo}
                onChange={(e) => onUpdateFilter('priceTo', e.target.value)}
                placeholder="Цена до, $"
                className={`${controlClass} font-mono tabular-nums placeholder:font-sans`}
              />
            </div>

            {/* Bottom Action Row inside Filter Box */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>
                  {activeFilterCount > 0
                    ? `Сбросить параметры (${activeFilterCount})`
                    : 'Все параметры'}
                </span>
              </button>

              <button
                type="button"
                onClick={onScrollToCatalog}
                className="inline-flex items-center justify-center rounded-xl bg-[#0058cd] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0046a3] dark:bg-[#8fff00] dark:text-slate-950 dark:hover:bg-[#7ae000] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058cd] dark:focus-visible:ring-[#8fff00]"
              >
                Показать {matchedCount.toLocaleString('ru-RU')} предложений
              </button>
            </div>
          </div>
        </div>

        {/* Sub-bar below Filter Box: View Mode (Grid/List) + Sort Select */}
        <div className="flex items-center justify-between gap-4 pt-0.5 sm:pt-1">
          <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-[#141414]">
            <button
              type="button"
              onClick={() => onChangeViewMode('grid')}
              aria-label="Сетка"
              aria-pressed={viewMode === 'grid'}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-slate-200 text-slate-900 dark:bg-white/15 dark:text-white'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('list')}
              aria-label="Список"
              aria-pressed={viewMode === 'list'}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-slate-200 text-slate-900 dark:bg-white/15 dark:text-white'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <select
            value={filters.sort}
            onChange={(e) => onUpdateFilter('sort', e.target.value as SortOption)}
            aria-label="Сортировка"
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 focus:border-[#0058cd] focus:outline-none dark:border-white/10 dark:bg-[#141414] dark:text-slate-200 dark:focus:border-[#8fff00]"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile Interactive Filter Bottom-Sheet */}
      {mobileSheet && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xs sm:hidden"
          onClick={() => setMobileSheet(null)}
        >
          <div
            className="w-full max-h-[85vh] overflow-y-auto rounded-t-2xl border-t border-slate-200 bg-white p-4 pb-6 dark:border-white/10 dark:bg-[#141414]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2.5 dark:border-white/10">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {mobileSheet === 'brand' && 'Марка, модель и поиск'}
                {mobileSheet === 'price' && 'Цена под ключ ($)'}
                {mobileSheet === 'year' && 'Год выпуска'}
                {mobileSheet === 'mileage' && 'Пробег (км)'}
                {mobileSheet === 'auctions' && 'Ближайшие аукционы'}
                {mobileSheet === 'all' && 'Все фильтры'}
              </h3>
              <button
                type="button"
                onClick={() => setMobileSheet(null)}
                aria-label="Закрыть"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {mobileSheet === 'brand' && (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => onUpdateFilter('search', e.target.value)}
                    placeholder="Поиск по слову или VIN..."
                    className={`${controlClass} pl-10`}
                  />
                </div>
                <select
                  value={filters.brand}
                  onChange={(e) => {
                    onUpdateFilter('brand', e.target.value);
                    onUpdateFilter('model', '');
                  }}
                  aria-label="Марка"
                  className={controlClass}
                >
                  <option value="">Все марки</option>
                  {ALL_BRANDS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.model}
                  onChange={(e) => onUpdateFilter('model', e.target.value)}
                  aria-label="Модель"
                  className={controlClass}
                >
                  <option value="">Все модели</option>
                  {availableModels.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {mobileSheet === 'price' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={filters.priceFrom}
                    onChange={(e) => onUpdateFilter('priceFrom', e.target.value)}
                    placeholder="Цена от, $"
                    className={`${controlClass} font-mono tabular-nums`}
                  />
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={filters.priceTo}
                    onChange={(e) => onUpdateFilter('priceTo', e.target.value)}
                    placeholder="Цена до, $"
                    className={`${controlClass} font-mono tabular-nums`}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['10000', '13000', '18000', '25000'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        onUpdateFilter('priceFrom', '');
                        onUpdateFilter('priceTo', val);
                      }}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        filters.priceTo === val
                          ? 'border-[#0058cd] bg-[#0058cd]/10 text-[#0058cd] dark:border-[#8fff00] dark:bg-[#8fff00]/15 dark:text-[#8fff00]'
                          : 'border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300'
                      }`}
                    >
                      до {Number(val).toLocaleString('ru-RU')}$
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mobileSheet === 'year' && (
              <div className="grid grid-cols-2 gap-2.5">
                <select
                  value={filters.yearFrom}
                  onChange={(e) => onUpdateFilter('yearFrom', e.target.value)}
                  aria-label="Год от"
                  className={controlClass}
                >
                  <option value="">Год от</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      от {y}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.yearTo}
                  onChange={(e) => onUpdateFilter('yearTo', e.target.value)}
                  aria-label="Год до"
                  className={controlClass}
                >
                  <option value="">Год до</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      до {y}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {mobileSheet === 'mileage' && (
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  type="number"
                  min={0}
                  step={5000}
                  value={filters.mileageFrom}
                  onChange={(e) => onUpdateFilter('mileageFrom', e.target.value)}
                  placeholder="Пробег от, км"
                  className={`${controlClass} font-mono tabular-nums`}
                />
                <input
                  type="number"
                  min={0}
                  step={5000}
                  value={filters.mileageTo}
                  onChange={(e) => onUpdateFilter('mileageTo', e.target.value)}
                  placeholder="Пробег до, км"
                  className={`${controlClass} font-mono tabular-nums`}
                />
              </div>
            )}

            {mobileSheet === 'auctions' && (
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onSelectUpcomingAuction('');
                    setMobileSheet(null);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm font-medium ${
                    filters.upcomingAuction === ''
                      ? 'border-[#0058cd] bg-[#0058cd]/10 text-[#0058cd] dark:border-[#8fff00] dark:bg-[#8fff00]/15 dark:text-[#8fff00]'
                      : 'border-slate-200 text-slate-700 dark:border-white/10 dark:text-slate-200'
                  }`}
                >
                  <span>Все ближайшие аукционы</span>
                  <span className="font-mono text-xs">{categoryCounts['Аукционы'] || 0}</span>
                </button>
                {UPCOMING_AUCTIONS.map((auc) => {
                  const isSel = filters.upcomingAuction === auc.label;
                  return (
                    <button
                      key={auc.label}
                      type="button"
                      onClick={() => {
                        onSelectUpcomingAuction(isSel ? '' : auc.label);
                        setMobileSheet(null);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm font-medium ${
                        isSel
                          ? 'border-[#0058cd] bg-[#0058cd]/10 text-[#0058cd] dark:border-[#8fff00] dark:bg-[#8fff00]/15 dark:text-[#8fff00]'
                          : 'border-slate-200 text-slate-700 dark:border-white/10 dark:text-slate-200'
                      }`}
                    >
                      <span>{auc.label}</span>
                      <span className="font-mono text-xs opacity-75">
                        {upcomingAuctionCounts[auc.label] || 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {mobileSheet === 'all' && (
              <div className="space-y-2.5">
                {filters.platformCategory === 'Аукционы' && (
                  <select
                    value={filters.upcomingAuction}
                    onChange={(e) => onSelectUpcomingAuction(e.target.value)}
                    aria-label="Ближайшие аукционы"
                    className={controlClass}
                  >
                    <option value="">Ближайшие аукционы: Все</option>
                    {UPCOMING_AUCTIONS.map((auc) => (
                      <option key={auc.label} value={auc.label}>
                        {auc.label} ({upcomingAuctionCounts[auc.label] || 0})
                      </option>
                    ))}
                  </select>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filters.brand}
                    onChange={(e) => {
                      onUpdateFilter('brand', e.target.value);
                      onUpdateFilter('model', '');
                    }}
                    className={controlClass}
                  >
                    <option value="">Марка</option>
                    {ALL_BRANDS.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.model}
                    onChange={(e) => onUpdateFilter('model', e.target.value)}
                    className={controlClass}
                  >
                    <option value="">Модель</option>
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filters.bodyType}
                    onChange={(e) => onUpdateFilter('bodyType', e.target.value)}
                    className={controlClass}
                  >
                    <option value="">Кузов</option>
                    {BODY_TYPES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.transmission}
                    onChange={(e) => onUpdateFilter('transmission', e.target.value)}
                    className={controlClass}
                  >
                    <option value="">КПП</option>
                    {TRANSMISSIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.fuel}
                    onChange={(e) => onUpdateFilter('fuel', e.target.value)}
                    className={controlClass}
                  >
                    <option value="">Двигатель</option>
                    {FUEL_TYPES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.drive}
                    onChange={(e) => onUpdateFilter('drive', e.target.value)}
                    className={controlClass}
                  >
                    <option value="">Привод</option>
                    {DRIVES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.engineFrom}
                    onChange={(e) => onUpdateFilter('engineFrom', e.target.value)}
                    className={controlClass}
                  >
                    <option value="">Объём от</option>
                    {ENGINE_VOLUMES.map((v) => (
                      <option key={v} value={v}>
                        от {v} л
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.engineTo}
                    onChange={(e) => onUpdateFilter('engineTo', e.target.value)}
                    className={controlClass}
                  >
                    <option value="">Объём до</option>
                    {ENGINE_VOLUMES.map((v) => (
                      <option key={v} value={v}>
                        до {v} л
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={filters.yearFrom}
                    onChange={(e) => onUpdateFilter('yearFrom', e.target.value)}
                    className={controlClass}
                  >
                    <option value="">Год от</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        от {y}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filters.yearTo}
                    onChange={(e) => onUpdateFilter('yearTo', e.target.value)}
                    className={controlClass}
                  >
                    <option value="">Год до</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        до {y}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={0}
                    step={5000}
                    value={filters.mileageFrom}
                    onChange={(e) => onUpdateFilter('mileageFrom', e.target.value)}
                    placeholder="Пробег от"
                    className={`${controlClass} font-mono tabular-nums`}
                  />
                  <input
                    type="number"
                    min={0}
                    step={5000}
                    value={filters.mileageTo}
                    onChange={(e) => onUpdateFilter('mileageTo', e.target.value)}
                    placeholder="Пробег до"
                    className={`${controlClass} font-mono tabular-nums`}
                  />
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={filters.priceFrom}
                    onChange={(e) => onUpdateFilter('priceFrom', e.target.value)}
                    placeholder="Цена от, $"
                    className={`${controlClass} font-mono tabular-nums`}
                  />
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={filters.priceTo}
                    onChange={(e) => onUpdateFilter('priceTo', e.target.value)}
                    placeholder="Цена до, $"
                    className={`${controlClass} font-mono tabular-nums`}
                  />
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2.5 pt-2 border-t border-slate-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => {
                  onResetFilters();
                  setMobileSheet(null);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:text-slate-300"
              >
                Сбросить
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileSheet(null);
                  onScrollToCatalog();
                }}
                className="flex-1 rounded-xl bg-[#0058cd] px-4 py-2.5 text-xs font-bold text-white dark:bg-[#8fff00] dark:text-slate-950"
              >
                Показать {matchedCount.toLocaleString('ru-RU')} предложений
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
