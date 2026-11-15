import React from 'react';
import { motion } from 'motion/react';
import {
  ChevronRight,
  Instagram,
  Send,
  Youtube,
} from 'lucide-react';
import {
  IMG_10K,
  IMG_13K,
  IMG_18K,
  IMG_25K,
  IMG_PREMIUM,
} from '../data/cars';
import type { SegmentKey } from '../types/car';
import { WhatsAppIcon } from './WhatsAppIcon';

interface HeroSegmentsProps {
  selectedSegment: SegmentKey | null;
  onSelectSegment: (segment: SegmentKey | null) => void;
  segmentCounts: Record<SegmentKey, number>;
}

const SOCIAL_CARDS = [
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: Instagram,
    badgeClass: 'bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white',
  },
  {
    name: 'Telegram',
    href: 'https://t.me',
    icon: Send,
    badgeClass: 'bg-sky-500 text-white',
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/996555000000',
    icon: WhatsAppIcon,
    badgeClass: 'bg-emerald-500 text-white',
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    icon: Youtube,
    badgeClass: 'bg-red-600 text-white',
  },
];

const RIGHT_SEGMENTS: {
  key: SegmentKey;
  title: string;
  tag: string;
  image: string;
  enterFromX: number;
  hoverShiftClass: string;
}[] = [
  {
    key: 'under-10k',
    title: 'до 10 000$ под ключ',
    tag: 'Kia Morning GT Line 2026',
    image: IMG_10K,
    enterFromX: 90,
    hoverShiftClass: 'group-hover:-translate-x-2.5 group-hover:scale-[1.08]',
  },
  {
    key: 'under-15k',
    title: 'до 15 000$ под ключ',
    tag: 'Hyundai Avante (CN7) 2023',
    image: IMG_13K,
    enterFromX: -90,
    hoverShiftClass: 'group-hover:translate-x-2.5 group-hover:scale-[1.08]',
  },
  {
    key: 'under-20k',
    title: 'до 20 000$ под ключ',
    tag: 'Hyundai Santa Fe Calligraphy',
    image: IMG_18K,
    enterFromX: 90,
    hoverShiftClass: 'group-hover:-translate-x-2.5 group-hover:scale-[1.08]',
  },
  {
    key: 'under-25k',
    title: 'до 25 000$ под ключ',
    tag: 'Hyundai Palisade LX3 2025',
    image: IMG_25K,
    enterFromX: -90,
    hoverShiftClass: 'group-hover:translate-x-2.5 group-hover:scale-[1.08]',
  },
];

export const HeroSegments: React.FC<HeroSegmentsProps> = ({
  selectedSegment,
  onSelectSegment,
  segmentCounts,
}) => {
  const isPremiumSelected = selectedSegment === 'premium';

  return (
    <section className="pt-3.5 pb-2.5 sm:pt-7 sm:pb-4">
      <div className="mx-auto max-w-[1440px] px-2.5 sm:px-6 lg:px-8">
        {/* Top Headline */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-[17px] sm:text-[22px] lg:text-[27px] font-extrabold leading-[1.2] tracking-tight text-slate-900 dark:text-white"
          >
            Проверенные авто под ключ в{' '}
            <span className="text-[#0058cd] dark:text-[#8fff00]">Кыргызстан</span>{' '}
            🇰🇬
          </motion.h1>
          <span className="mt-1 sm:mt-1.5 block text-[11px] sm:text-[13px] lg:text-[14px] leading-snug sm:leading-relaxed text-slate-600 dark:text-slate-400">
            Ежедневно предлагаем более 10 000 автомобилей из разных стран. Без посредников и наценок.
          </span>
        </div>

        {/* 4 Slim Social Cards Row (Name only, compact full-width on mobile) */}
        <div className="mt-2.5 sm:mt-4 grid w-full grid-cols-4 gap-1 sm:gap-2.5 lg:gap-3">
          {SOCIAL_CARDS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -2 }}
                className="group flex w-full min-w-0 items-center justify-between gap-1 sm:gap-2.5 rounded-lg sm:rounded-xl border border-slate-200 bg-white px-1.5 py-1 sm:px-3.5 sm:py-2 transition-all duration-150 hover:border-[#0058cd]/60 dark:border-white/10 dark:bg-[#141414] dark:hover:border-[#8fff00]/60"
              >
                <div className="flex items-center gap-1 sm:gap-2.5 min-w-0">
                  <span
                    className={`flex h-4 w-4 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full ${item.badgeClass}`}
                  >
                    <Icon className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                  </span>
                  <span className="text-[9.5px] sm:text-xs lg:text-sm font-bold leading-tight text-slate-900 dark:text-white truncate">
                    {item.name}
                  </span>
                </div>
                <ChevronRight className="hidden sm:block h-4 w-4 shrink-0 text-slate-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[#0058cd] dark:group-hover:text-[#8fff00]" />
              </motion.a>
            );
          })}
        </div>

        {/* Asymmetric Full-Bleed Animated Bento Segment Grid (identical 12-col layout on mobile & desktop) */}
        <div className="mt-3 sm:mt-4 grid grid-cols-12 gap-2 sm:gap-3 lg:gap-4">
          {/* Left Tall Featured Card: Премиум (BMW X7 G07) */}
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectSegment(isPremiumSelected ? null : 'premium')}
            aria-pressed={isPremiumSelected}
            className={`group relative col-span-4 flex min-h-[168px] sm:min-h-[260px] lg:min-h-[348px] flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl border bg-[#001029] dark:bg-[#0a1200] p-2.5 sm:p-4 lg:p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058cd] dark:focus-visible:ring-[#8fff00] ${
              isPremiumSelected
                ? 'border-[#0058cd] ring-2 ring-[#0058cd]/60 shadow-xl shadow-[#0058cd]/20 dark:border-[#8fff00] dark:ring-[#8fff00]/60 dark:shadow-[#8fff00]/20'
                : 'border-[#0058cd]/40 hover:border-[#0058cd] hover:shadow-xl hover:shadow-[#0058cd]/15 dark:border-[#8fff00]/35 dark:hover:border-[#8fff00] dark:hover:shadow-[#8fff00]/15'
            }`}
          >
            {/* Full-bleed Driving-In Car Photo */}
            <motion.img
              src={IMG_PREMIUM}
              alt="Премиум — BMW X7 (G07) xDrive 40i M Sport 6-местный"
              referrerPolicy="no-referrer"
              initial={{ x: 110, opacity: 0, scale: 1.06 }}
              animate={{ x: 0, opacity: 1, scale: 1.02 }}
              transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:-translate-x-2.5 group-hover:scale-110"
            />

            {/* Contrast Scrims */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/55 transition-opacity duration-300 group-hover:via-black/20"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0058cd]/35 via-transparent to-transparent dark:from-[#8fff00]/25 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
            />

            {/* Top Row: Bold Editorial Display + Count */}
            <div className="relative z-10 flex items-start justify-between gap-1 sm:gap-2">
              <div className="text-[15px] sm:text-2xl lg:text-4xl font-black leading-[0.95] tracking-tight text-white drop-shadow-sm select-none">
                <span className="text-[#4f9dff] dark:text-[#8fff00]">Премиум</span>
                <span className="block text-[9px] sm:text-sm lg:text-xl text-white/90 font-bold mt-0.5 sm:mt-1">
                  BMW X7 (G07)
                </span>
              </div>
              <span className="rounded sm:rounded-lg bg-black/55 px-1.5 py-0.5 sm:px-2.5 sm:py-1 font-mono text-[8px] sm:text-xs tabular-nums text-white/90 backdrop-blur-md border border-white/10 whitespace-nowrap">
                {segmentCounts.premium} авто
              </span>
            </div>

            {/* Bottom CTA Label */}
            <div className="relative z-10 flex items-center justify-between pt-2 sm:pt-4">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-sm lg:text-base font-bold text-white leading-tight">
                <span>Премиум</span>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 text-[#4f9dff] dark:text-[#8fff00] transition-transform duration-200 group-hover:translate-x-1.5" />
              </div>
            </div>
          </motion.button>

          {/* Right 2x2 Grid: 4 Full-Bleed Animated Budget Segments */}
          <div className="col-span-8 grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
            {RIGHT_SEGMENTS.map((seg, idx) => {
              const isSelected = selectedSegment === seg.key;
              const count = segmentCounts[seg.key] || 0;

              return (
                <motion.button
                  key={seg.key}
                  type="button"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.08 + idx * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onSelectSegment(isSelected ? null : seg.key)}
                  aria-pressed={isSelected}
                  className={`group relative flex h-[80px] sm:h-[124px] lg:h-[166px] flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl border bg-[#0E0E0E] p-2 sm:p-3.5 lg:p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058cd] dark:focus-visible:ring-[#8fff00] ${
                    isSelected
                      ? 'border-[#0058cd] ring-2 ring-[#0058cd]/60 shadow-lg shadow-[#0058cd]/20 dark:border-[#8fff00] dark:ring-[#8fff00]/60 dark:shadow-[#8fff00]/20'
                      : 'border-slate-200/80 hover:border-[#0058cd] hover:shadow-lg hover:shadow-[#0058cd]/15 dark:border-white/10 dark:hover:border-[#8fff00] dark:hover:shadow-[#8fff00]/15'
                  }`}
                >
                  {/* Full-bleed Car Image Driving Into Card */}
                  <motion.img
                    src={seg.image}
                    alt={`${seg.title} — ${seg.tag}`}
                    referrerPolicy="no-referrer"
                    initial={{ x: seg.enterFromX, opacity: 0, scale: 1.05 }}
                    animate={{ x: 0, opacity: 1, scale: 1.01 }}
                    transition={{
                      duration: 0.85,
                      delay: 0.16 + idx * 0.09,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out ${seg.hoverShiftClass}`}
                  />

                  {/* Layered Contrast Scrim + Subtle Hover Glow */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/45 transition-opacity duration-300 group-hover:via-black/25"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0058cd]/35 dark:from-[#8fff00]/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  {/* Top Row: Tag + Count */}
                  <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-2">
                    <span className="text-[8px] sm:text-[10px] lg:text-[11px] font-semibold tracking-wide text-slate-200/90 truncate">
                      {seg.tag}
                    </span>
                    <span className="rounded sm:rounded-md bg-black/55 px-1 py-0.5 sm:px-2 sm:py-0.5 font-mono text-[8px] sm:text-[11px] tabular-nums text-white/90 backdrop-blur-md border border-white/10 whitespace-nowrap shrink-0">
                      {count} авто
                    </span>
                  </div>

                  {/* Bottom Title with Kinetic Chevron */}
                  <div className="relative z-10 flex items-center justify-between gap-1 sm:gap-2">
                    <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs lg:text-base font-bold leading-tight text-white drop-shadow-sm">
                      <span>{seg.title}</span>
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 text-[#4f9dff] dark:text-[#8fff00] transition-transform duration-200 group-hover:translate-x-1.5" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
