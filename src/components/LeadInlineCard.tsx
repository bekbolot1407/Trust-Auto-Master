import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, PhoneCall, ArrowRight } from 'lucide-react';

interface LeadInlineCardProps {
  onOpenManager: () => void;
  viewMode?: 'grid' | 'list';
}

export const LeadInlineCard: React.FC<LeadInlineCardProps> = ({
  onOpenManager,
  viewMode = 'grid',
}) => {
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length < 6) {
      setError('Укажите телефон или Telegram');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#0058cd]/35 bg-gradient-to-r from-[#0058cd]/10 via-white to-white p-3.5 sm:px-5 sm:py-4 dark:border-[#8fff00]/40 dark:from-[#8fff00]/15 dark:via-[#161616] dark:to-[#161616]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0058cd]/10 text-[#0058cd] dark:bg-[#8fff00]/15 dark:text-[#8fff00]">
            <PhoneCall className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-extrabold text-[#0058cd] dark:text-[#8fff00] truncate">
              Оставить заявку на подбор
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
              Подберём 5 проверенных вариантов с аукционов под ваш бюджет за 30 минут.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0058cd] dark:text-emerald-300 shrink-0">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Принято ({phone})</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (error) setError('');
              }}
              placeholder="+996 (___) __-__-__"
              className="w-40 sm:w-48 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0058cd] focus:outline-none dark:border-white/15 dark:bg-[#0D0D0D] dark:text-white dark:focus:border-[#8fff00]"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-lg bg-[#0058cd] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0046a3] dark:bg-[#8fff00] dark:text-slate-950 dark:hover:bg-[#7ae000] whitespace-nowrap"
            >
              <span>Отправить</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col justify-between overflow-hidden rounded-xl border border-[#0058cd]/35 bg-gradient-to-br from-[#0058cd]/10 via-white to-white p-2.5 sm:p-3.5 dark:border-[#8fff00]/40 dark:from-[#8fff00]/15 dark:via-[#161616] dark:to-[#161616]"
    >
      <div>
        <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-[#0058cd]/10 text-[#0058cd] dark:bg-[#8fff00]/15 dark:text-[#8fff00]">
          <PhoneCall className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>

        <h3 className="mt-2 sm:mt-3 text-xs sm:text-base font-extrabold leading-snug text-[#0058cd] dark:text-[#8fff00]">
          Оставить заявку
        </h3>
        <p className="mt-1 text-[10px] sm:text-xs leading-snug sm:leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-3">
          Подберём 5 проверенных вариантов с аукционов под ваш бюджет за 30 минут.
        </p>
      </div>

      {submitted ? (
        <div className="mt-2 sm:mt-3 rounded-lg border border-[#0058cd]/30 bg-[#0058cd]/10 p-2 sm:p-3 text-[10px] sm:text-xs text-[#0058cd] dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          <div className="flex items-center gap-1 font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span>Заявка принята!</span>
          </div>
          <p className="mt-0.5 sm:mt-1 opacity-90 truncate">
            <span className="font-mono">{phone}</span>
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setPhone('');
            }}
            className="mt-1.5 font-semibold underline"
          >
            Новая заявка
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
          <input
            type="text"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (error) setError('');
            }}
            placeholder="+996 (___) __-__-__"
            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0058cd] focus:outline-none dark:border-white/15 dark:bg-[#0D0D0D] dark:text-white dark:focus:border-[#8fff00]"
          />
          {error && <p className="text-[9px] sm:text-[11px] text-red-500">{error}</p>}

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="submit"
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#0058cd] px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-semibold text-white transition-colors hover:bg-[#0046a3] dark:bg-[#8fff00] dark:text-slate-950 dark:hover:bg-[#7ae000] whitespace-nowrap"
            >
              <span>Заявка</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
            </button>
            <button
              type="button"
              onClick={onOpenManager}
              className="rounded-lg border border-slate-200 px-2 py-1.5 sm:px-2.5 sm:py-2 text-[10px] sm:text-[11px] font-medium text-slate-600 hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/15 dark:text-slate-300 dark:hover:border-[#8fff00] dark:hover:text-[#8fff00] shrink-0"
            >
              Голос
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};
