import React, { useState } from 'react';
import { PhoneCall, Heart, Moon, Sun, Menu, X } from 'lucide-react';

export type ActivePage = 'catalog' | 'calculator' | 'about' | 'listing';

interface HeaderProps {
  activePage: ActivePage;
  activeNavSection: 'catalog' | 'auctions' | 'calculator' | 'about';
  onNavigate: (target: 'catalog' | 'auctions' | 'calculator' | 'about') => void;
  onOpenManager: () => void;
  favoritesCount: number;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeNavSection,
  onNavigate,
  onOpenManager,
  favoritesCount,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: 'catalog' | 'auctions' | 'calculator' | 'about'; label: string }[] = [
    { id: 'catalog', label: 'Каталог' },
    { id: 'auctions', label: 'Аукционы' },
    { id: 'calculator', label: 'Калькулятор' },
    { id: 'about', label: 'О нас' },
  ];

  const handleMobileNav = (target: 'catalog' | 'auctions' | 'calculator' | 'about') => {
    setMobileMenuOpen(false);
    onNavigate(target);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-[#000000]/95">
      <div className="mx-auto flex h-14 md:h-16 max-w-[1440px] items-center justify-between gap-3 md:gap-6 lg:gap-8 px-3 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Logo */}
        <button
          type="button"
          onClick={() => handleMobileNav('catalog')}
          aria-label="Trust Auto — На главную"
          className="flex items-center text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058cd] dark:focus-visible:ring-[#8fff00] rounded-lg"
        >
          <img
            src="/assets/aistudio/________________2026-11-15___20.34.30-removebg-preview_781c8d6b.png"
            alt="Trust Auto"
            referrerPolicy="no-referrer"
            className="h-5 sm:h-6 md:h-7 lg:h-8 w-auto object-contain brightness-0 dark:brightness-100 transition-opacity hover:opacity-90"
          />
        </button>

        {/* Zone 2: Desktop Navigation Links */}
        <nav
          aria-label="Основная навигация"
          className="hidden md:flex items-center gap-1.5 lg:gap-2 text-xs lg:text-sm font-medium min-w-0"
        >
          {navItems.map((item) => {
            const isActive = activeNavSection === item.id;
            const isAuction = item.id === 'auctions';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`rounded-lg px-3 lg:px-3.5 py-1.5 whitespace-nowrap shrink-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058cd] dark:focus-visible:ring-[#8fff00] ${
                  isActive
                    ? 'bg-slate-100 text-[#0058cd] font-semibold dark:bg-[#141414] dark:text-[#8fff00]'
                    : isAuction
                    ? 'border border-slate-300 text-slate-800 hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/25 dark:text-white dark:hover:border-[#8fff00] dark:hover:text-[#8fff00]'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Theme Icons + Favorites + Primary CTA + Mobile Menu Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Icon-only Dark / Light Theme Switcher */}
          <div
            role="group"
            aria-label="Переключение темы"
            className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-white/10 dark:bg-[#141414]"
          >
            <button
              type="button"
              onClick={() => theme !== 'dark' && onToggleTheme()}
              aria-label="Тёмная тема"
              aria-pressed={theme === 'dark'}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                theme === 'dark'
                  ? 'bg-[#8fff00] text-slate-950'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => theme !== 'light' && onToggleTheme()}
              aria-label="Светлая тема"
              aria-pressed={theme === 'light'}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                theme === 'light'
                  ? 'bg-[#0058cd] text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onToggleFavoritesOnly}
            aria-pressed={showFavoritesOnly}
            title="Избранные автомобили"
            className={`inline-flex h-8 items-center gap-1.5 rounded-lg border px-2 sm:px-2.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              showFavoritesOnly
                ? 'border-[#0058cd] bg-[#0058cd]/10 text-[#0058cd] dark:border-[#8fff00] dark:bg-[#8fff00]/15 dark:text-[#8fff00]'
                : 'border-slate-200 text-slate-600 hover:border-[#0058cd]/50 hover:text-[#0058cd] dark:border-white/10 dark:text-slate-300 dark:hover:border-[#8fff00]/50 dark:hover:text-[#8fff00]'
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                showFavoritesOnly ? 'fill-[#0058cd] text-[#0058cd] dark:fill-[#8fff00] dark:text-[#8fff00]' : ''
              }`}
            />
            {favoritesCount > 0 && (
              <span className="font-mono tabular-nums">{favoritesCount}</span>
            )}
          </button>

          {/* Compact Phone CTA icon on mobile, full CTA button on sm+ */}
          <button
            type="button"
            onClick={onOpenManager}
            aria-label="Связаться с менеджером"
            className="inline-flex h-8 sm:h-auto items-center justify-center gap-2 rounded-lg bg-[#0058cd] px-2.5 sm:px-3.5 sm:py-2 text-xs lg:text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#0046a3] active:scale-[0.99] dark:bg-[#8fff00] dark:text-slate-950 dark:hover:bg-[#7ae000] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058cd] dark:focus-visible:ring-[#8fff00]"
          >
            <PhoneCall className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span className="hidden sm:inline">Связаться с менеджером</span>
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={mobileMenuOpen}
            className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-colors hover:border-[#0058cd] dark:border-white/10 dark:bg-[#141414] dark:text-white dark:hover:border-[#8fff00]"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-3 py-3 dark:border-white/10 dark:bg-[#0A0A0A]">
          <nav aria-label="Мобильная навигация" className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = activeNavSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleMobileNav(item.id)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-left transition-colors ${
                    isActive
                      ? 'bg-[#0058cd]/10 text-[#0058cd] dark:bg-[#8fff00]/15 dark:text-[#8fff00]'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{item.id === 'about' ? 'О компании Trust Auto' : item.label}</span>
                  {isActive && <span className="h-2 w-2 rounded-full bg-[#0058cd] dark:bg-[#8fff00]" />}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenManager();
              }}
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0058cd] px-4 py-2.5 text-sm font-bold text-white dark:bg-[#8fff00] dark:text-slate-950"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Связаться с менеджером</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
