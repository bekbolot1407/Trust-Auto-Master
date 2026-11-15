import React from 'react';
import { Instagram, Send, Youtube } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FooterProps {
  onNavigate: (target: 'catalog' | 'auctions' | 'calculator' | 'about') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 bg-[#F6F7F9] py-6 sm:py-8 dark:border-white/10 dark:bg-[#000000]">
      <div className="mx-auto flex max-w-[1440px] flex-row items-center justify-between gap-3 sm:gap-6 px-2.5 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <div className="flex items-center">
            <img
              src="/assets/aistudio/________________2026-11-15___20.34.30-removebg-preview_781c8d6b.png"
              alt="Trust Auto"
              referrerPolicy="no-referrer"
              className="h-4 sm:h-6 lg:h-7 w-auto object-contain brightness-0 dark:brightness-100"
            />
          </div>
          <p className="mt-1 sm:mt-1.5 text-[9px] sm:text-xs text-slate-500 dark:text-slate-400">
            © 2026 Trust Auto. Проверенные авто под ключ в Кыргызстан.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-2 sm:gap-5 text-[10px] sm:text-sm font-medium text-slate-600 dark:text-slate-400">
          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className="hover:text-[#0058cd] dark:hover:text-[#8fff00] transition-colors whitespace-nowrap"
          >
            Каталог
          </button>
          <button
            type="button"
            onClick={() => onNavigate('auctions')}
            className="hover:text-[#0058cd] dark:hover:text-[#8fff00] transition-colors whitespace-nowrap"
          >
            Аукционы
          </button>
          <button
            type="button"
            onClick={() => onNavigate('calculator')}
            className="hover:text-[#0058cd] dark:hover:text-[#8fff00] transition-colors whitespace-nowrap"
          >
            Калькулятор
          </button>
          <button
            type="button"
            onClick={() => onNavigate('about')}
            className="hover:text-[#0058cd] dark:hover:text-[#8fff00] transition-colors whitespace-nowrap"
          >
            О нас
          </button>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/10 dark:bg-[#141414] dark:text-slate-300 dark:hover:border-[#8fff00] dark:hover:text-[#8fff00]"
          >
            <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/10 dark:bg-[#141414] dark:text-slate-300 dark:hover:border-[#8fff00] dark:hover:text-[#8fff00]"
          >
            <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>
          <a
            href="https://wa.me/996555000000"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/10 dark:bg-[#141414] dark:text-slate-300 dark:hover:border-[#8fff00] dark:hover:text-[#8fff00]"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/10 dark:bg-[#141414] dark:text-slate-300 dark:hover:border-[#8fff00] dark:hover:text-[#8fff00]"
          >
            <Youtube className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};
