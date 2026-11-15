import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, FileCheck2, Truck, MapPin, PhoneCall } from 'lucide-react';

interface AboutSectionProps {
  onOpenManager: () => void;
  onOpenCalculator: () => void;
  onBackToCatalog: () => void;
}

const STEPS = [
  {
    num: '01.',
    title: 'Подбор и проверка по 140 пунктам',
    desc: 'Выбираем лучшие лоты на Encar, KB Chachacha, K Car и закрытых аукционах. Выезжаем на осмотр с толщиномером и эндоскопом.',
  },
  {
    num: '02.',
    title: 'Официальный договор и выкуп',
    desc: 'Фиксируем конечную стоимость в договоре без скрытых доплат. Вы оплачиваете инвойс прозрачно через банк.',
  },
  {
    num: '03.',
    title: 'Логистика и фотоотчёты',
    desc: 'Отправляем авто морским фрахтом, автовозом или ж/д транспортом. На каждом этапе вы получаете фото- и видео-отчёты.',
  },
  {
    num: '04.',
    title: 'Растаможка и выдача в Бишкеке',
    desc: 'Проводим таможенную очистку в КР, оформляем ЭПТС и СБКТС, и передаём вам готовый автомобиль под ключ.',
  },
];

const METRICS = [
  { value: '1 480+', label: 'доставленных авто в КР с 2021 года' },
  { value: '140', label: 'пунктов технической и ЛКП проверки' },
  { value: '7 стран', label: 'прямого экспорта без посредников' },
  { value: '25–35 дн.', label: 'средний срок доставки из Кореи' },
];

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenManager,
  onOpenCalculator,
  onBackToCatalog,
}) => {
  return (
    <main className="min-h-[75vh] bg-[#F6F7F9] py-6 sm:py-12 dark:bg-[#000000]">
      <div className="mx-auto max-w-[1440px] px-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBackToCatalog}
          className="mb-5 sm:mb-7 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/10 dark:bg-[#141414] dark:text-slate-200 dark:hover:border-[#8fff00] dark:hover:text-[#8fff00]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Вернуться в каталог</span>
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-8 lg:p-10 dark:border-white/10 dark:bg-[#0A0A0A]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Left Intro & Metrics */}
            <div className="lg:col-span-5">
              <span className="text-xs font-semibold text-[#0058cd] dark:text-[#8fff00]">
                О компании Trust Auto
              </span>
              <h1 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
                Честный импорт проверенных автомобилей в Кыргызстан
              </h1>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Мы сами проверяем каждый автомобиль на площадках Южной Кореи, США, Китая, Японии, Дубая, Грузии и Европы — в родном окрасе, с подтверждённым пробегом и чистой историей.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {METRICS.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 sm:p-4 dark:border-white/10 dark:bg-[#141414]"
                  >
                    <div className="font-mono text-lg sm:text-xl lg:text-2xl font-extrabold tabular-nums text-[#0058cd] dark:text-[#8fff00]">
                      {m.value}
                    </div>
                    <div className="mt-1 text-xs leading-snug text-slate-600 dark:text-slate-300">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenManager}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0058cd] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0046a3] dark:bg-[#8fff00] dark:text-slate-950 dark:hover:bg-[#7ae000]"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Связаться с менеджером</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenCalculator}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/10 dark:text-slate-200 dark:hover:border-[#8fff00] dark:hover:text-[#8fff00]"
                >
                  <span>Рассчитать растаможку</span>
                </button>
              </div>
            </div>

            {/* Right 4 Steps */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {STEPS.map((step, idx) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.06 }}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 dark:border-white/10 dark:bg-[#141414]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-[#0058cd] dark:text-[#8fff00]">
                      {step.num}
                    </span>
                    {idx === 0 && <ShieldCheck className="h-4 w-4 text-slate-400" />}
                    {idx === 1 && <FileCheck2 className="h-4 w-4 text-slate-400" />}
                    {idx === 2 && <Truck className="h-4 w-4 text-slate-400" />}
                    {idx === 3 && <MapPin className="h-4 w-4 text-slate-400" />}
                  </div>
                  <h2 className="mt-3 text-base font-bold leading-tight text-slate-900 dark:text-white">
                    {step.title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {step.desc}
                  </p>
                </motion.div>
              ))}

              {/* Office Address Bar */}
              <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 sm:px-5 sm:py-4 text-xs sm:text-sm dark:border-white/10 dark:bg-[#141414]">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="h-4 w-4 text-[#0058cd] dark:text-[#8fff00] shrink-0" />
                  <span>
                    Офис в Кыргызстане:{' '}
                    <strong className="text-slate-900 dark:text-white">
                      г. Бишкек, ул. Ибраимова, 115
                    </strong>
                  </span>
                </div>
                <span className="font-mono text-slate-500 dark:text-slate-400">
                  Пн–Сб · 09:00–20:00
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
