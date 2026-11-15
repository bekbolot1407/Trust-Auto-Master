import React from 'react';
import { motion } from 'motion/react';

interface ManagerBannerProps {
  theme?: 'dark' | 'light';
  onOpenManager: (initialTab?: 'text' | 'voice') => void;
}

export const ManagerBanner: React.FC<ManagerBannerProps> = ({
  theme = 'dark',
  onOpenManager,
}) => {
  const pulseClear = theme === 'dark' ? 'rgba(143, 255, 0, 0)' : 'rgba(0, 88, 205, 0)';
  const pulseGlow = theme === 'dark' ? 'rgba(143, 255, 0, 0.32)' : 'rgba(0, 88, 205, 0.28)';

  return (
    <section className="hidden sm:block pb-3 sm:pb-4">
      <div className="mx-auto max-w-[1440px] px-2.5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full flex-row items-center justify-between gap-2 sm:gap-4 rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-3 py-2.5 sm:px-6 sm:py-4 dark:border-white/10 dark:bg-[#141414]"
        >
          <p className="text-[11px] sm:text-sm lg:text-base font-medium leading-snug text-slate-800 dark:text-slate-200">
            Запишите голосовое или спросите текстом — всё объясним и подберём.
          </p>

          <motion.button
            type="button"
            onClick={() => onOpenManager('voice')}
            animate={{
              scale: [1, 1.04, 1],
              boxShadow: [
                `0 0 0 0 ${pulseClear}`,
                `0 0 0 7px ${pulseGlow}`,
                `0 0 0 0 ${pulseClear}`,
              ],
            }}
            transition={{
              duration: 0.85,
              repeat: Infinity,
              repeatDelay: 2.15,
              ease: 'easeInOut',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center justify-center rounded-lg sm:rounded-xl bg-[#0058cd] px-3 py-2 sm:px-6 sm:py-3 text-[11px] sm:text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#0046a3] dark:bg-[#8fff00] dark:text-slate-950 dark:hover:bg-[#7ae000] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058cd] dark:focus-visible:ring-[#8fff00]"
          >
            Позвать менеджера
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
