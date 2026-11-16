import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, ArrowLeft, CheckCircle2, Info, Lock, Send } from 'lucide-react';
import { EXPORT_COUNTRIES } from '../data/cars';
import type { CalculatorPrefill, ExportCountry, FuelType } from '../types/car';

interface CalculatorPageProps {
  prefill: CalculatorPrefill | null;
  onBackToCatalog: () => void;
  onOrderFromCalculator: (summary: string) => void;
}

const LOGISTICS_BASE: Record<ExportCountry, number> = {
  'Южная Корея': 1850,
  'США': 2950,
  'Китай': 1450,
  'Япония': 2100,
  'Дубай': 2200,
  'Грузия': 1150,
  'Европа': 2350,
};

const KGS_RATE = 87.5;

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
  prefill,
  onBackToCatalog,
  onOrderFromCalculator,
}) => {
  const [country] = useState<ExportCountry>('Южная Корея');
  const [year, setYear] = useState<number>(prefill?.year || 2022);
  const [fuel, setFuel] = useState<FuelType>(prefill?.fuel || 'Бензин');
  const [engineCc, setEngineCc] = useState<number>(prefill?.engineCc || 2000);

  const calculation = useMemo(() => {
    const safeCc = fuel === 'Электро' ? 0 : Math.max(600, Number(engineCc) || 0);
    const age = Math.max(0, 2026 - year);

    const logistics = LOGISTICS_BASE[country];
    const trustAutoService = 200; // Фиксированная услуга компании

    // Ориентировочная формула расчёта таможенной очистки КР (по объёму, возрасту и типу двигателя)
    let customsDuty = 0;
    if (fuel === 'Электро') {
      // Льготный режим на электромобили
      customsDuty = 450;
    } else if (fuel === 'Гибрид') {
      if (age <= 3) {
        customsDuty = Math.round(safeCc * 0.95);
      } else if (age <= 5) {
        customsDuty = Math.round(safeCc * 1.25);
      } else if (age <= 7) {
        customsDuty = Math.round(safeCc * 1.65);
      } else {
        customsDuty = Math.round(safeCc * 2.2);
      }
    } else if (age <= 3) {
      customsDuty = Math.round(safeCc * 1.15);
    } else if (age <= 5) {
      customsDuty = Math.round(safeCc * 1.45);
    } else if (age <= 7) {
      customsDuty = Math.round(safeCc * 1.95);
    } else {
      customsDuty = Math.round(safeCc * 2.6);
    }

    const totalUsd = customsDuty + logistics + trustAutoService;
    const totalKgs = Math.round(totalUsd * KGS_RATE);

    return {
      logistics,
      customsDuty,
      trustAutoService,
      totalUsd,
      totalKgs,
      transit: EXPORT_COUNTRIES.find((c) => c.name === country)?.transit || '25–35 дней',
    };
  }, [country, year, fuel, engineCc]);

  const breakdownItems = [
    {
      label: 'Растаможка',
      value: calculation.customsDuty,
      color: 'bg-[#0058cd] dark:bg-[#8fff00]',
    },
    {
      label: `Доставка в Кыргызстан (${calculation.transit})`,
      value: calculation.logistics,
      color: 'bg-indigo-500',
    },
    {
      label: 'Услуга',
      value: calculation.trustAutoService,
      color: 'bg-blue-400 dark:bg-emerald-500',
    },
  ];

  const handleOrderClick = () => {
    const summary = `Расчёт из калькулятора: ${country}, ${year} г., ${fuel}${fuel !== 'Электро' ? `, ${engineCc} см³` : ''}. Растаможка ≈ $${calculation.customsDuty.toLocaleString('ru-RU')}, доставка $${calculation.logistics.toLocaleString('ru-RU')}, услуга $200. Итого расходы ≈ $${calculation.totalUsd.toLocaleString('ru-RU')}.`;
    onOrderFromCalculator(summary);
  };

  return (
    <main className="py-8 pb-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          type="button"
          onClick={onBackToCatalog}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/10 dark:bg-[#13161E] dark:text-slate-200 dark:hover:border-[#8fff00] dark:hover:text-[#8fff00]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Вернуться в каталог</span>
        </button>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2.5 text-sm font-semibold text-[#0058cd] dark:text-[#8fff00]">
            <Calculator className="h-4 w-4" />
            <span>Таможенный калькулятор КР</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
            Калькулятор растаможки и доставки в Кыргызстан 🇰🇬
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {prefill?.title
              ? `Предзаполнено для: ${prefill.title}. Вы можете скорректировать год, тип и объём двигателя.`
              : 'Рассчитайте ориентировочную стоимость растаможки, доставки до Бишкека и услуги компании по параметрам автомобиля.'}
          </p>
        </motion.div>

        {/* 2-Column Split: Form Left, Live Breakdown Right */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Left Form */}
          <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-white/10 dark:bg-[#13161E] space-y-6">
            {/* 1. Country selection (South Korea active, others locked) */}
            <div>
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <label className="text-sm font-bold text-slate-900 dark:text-white">
                  1. Страна экспорта
                </label>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Сейчас доступна Южная Корея
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {EXPORT_COUNTRIES.map((c) => {
                  const isKorea = c.name === 'Южная Корея';
                  const isActive = country === c.name && isKorea;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      disabled={!isKorea}
                      title={isKorea ? c.name : `${c.name} — скоро запуск`}
                      className={`flex items-center justify-between gap-1.5 rounded-lg border px-3 py-2.5 text-left text-xs sm:text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-[#0058cd] bg-[#0058cd] text-white font-semibold dark:border-[#8fff00] dark:bg-[#8fff00] dark:text-slate-950'
                          : 'border-slate-200 bg-slate-100/80 text-slate-400 opacity-60 cursor-not-allowed dark:border-white/10 dark:bg-[#1A1E29]/60 dark:text-slate-500'
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="shrink-0">{c.flag}</span>
                        <span className="truncate">{c.name}</span>
                      </span>
                      {!isKorea && <Lock className="h-3 w-3 shrink-0 opacity-75" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Year */}
            <div>
              <label
                htmlFor="calc-year"
                className="mb-2 block text-sm font-bold text-slate-900 dark:text-white"
              >
                2. Год выпуска
              </label>
              <select
                id="calc-year"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-base font-semibold tabular-nums text-slate-900 focus:border-[#0058cd] focus:bg-white focus:outline-none dark:border-white/10 dark:bg-[#1A1E29] dark:text-white dark:focus:border-[#8fff00]"
              >
                {Array.from({ length: 12 }, (_, i) => 2026 - i).map((y) => (
                  <option key={y} value={y}>
                    {y} год
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Возраст авто напрямую влияет на таможенную ставку в КР.
              </p>
            </div>

            {/* 3. Fuel & 4. Engine */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-900 dark:text-white">
                  3. Тип двигателя
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Бензин', 'Дизель', 'Гибрид', 'Электро'] as FuelType[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFuel(f)}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                        fuel === f
                          ? 'border-[#0058cd] bg-[#0058cd] text-white font-semibold dark:border-[#8fff00] dark:bg-[#8fff00] dark:text-slate-950'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#0058cd]/50 dark:border-white/10 dark:bg-[#1A1E29] dark:text-slate-300 dark:hover:border-[#8fff00]/50'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="calc-cc"
                  className="mb-2 block text-sm font-bold text-slate-900 dark:text-white"
                >
                  4. Объём двигателя (см³)
                </label>
                <input
                  id="calc-cc"
                  type="number"
                  min={600}
                  max={6500}
                  step={100}
                  disabled={fuel === 'Электро'}
                  value={fuel === 'Электро' ? 0 : engineCc}
                  onChange={(e) => setEngineCc(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-base font-semibold tabular-nums text-slate-900 disabled:opacity-50 focus:border-[#0058cd] focus:bg-white focus:outline-none dark:border-white/10 dark:bg-[#1A1E29] dark:text-white dark:focus:border-[#8fff00]"
                />
                {fuel === 'Электро' ? (
                  <p className="mt-2 text-xs text-[#0058cd] dark:text-emerald-500 font-medium">
                    Для электромобилей действует льготная растаможка в КР.
                  </p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {[1500, 1600, 2000, 2500, 3000].map((cc) => (
                      <button
                        key={cc}
                        type="button"
                        onClick={() => setEngineCc(cc)}
                        className={`rounded px-2 py-1 font-mono text-xs tabular-nums transition-colors ${
                          engineCc === cc
                            ? 'bg-[#0058cd] text-white font-semibold dark:bg-[#8fff00] dark:text-slate-950'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300'
                        }`}
                      >
                        {(cc / 1000).toFixed(1)} л
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Live Breakdown Card */}
          <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-7 dark:border-white/10 dark:bg-[#13161E]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/10">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Итого: растаможка, доставка и услуга
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                г. Бишкек 🇰🇬
              </span>
            </div>

            {/* Grand Total */}
            <div className="my-5">
              <div className="font-mono text-3xl sm:text-4xl font-extrabold tabular-nums text-slate-900 dark:text-white">
                ${calculation.totalUsd.toLocaleString('ru-RU')}
              </div>
              <div className="mt-1 font-mono text-sm tabular-nums text-slate-500 dark:text-slate-400">
                ≈ {calculation.totalKgs.toLocaleString('ru-RU')} сом (без учёта цены авто)
              </div>
            </div>

            {/* Stacked Cost Proportion Bar */}
            <div className="mb-5 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
              {breakdownItems.map((item) => {
                const pct = (item.value / calculation.totalUsd) * 100;
                return (
                  <div
                    key={item.label}
                    style={{ width: `${pct}%` }}
                    className={`${item.color} transition-all duration-300`}
                    title={`${item.label}: $${item.value.toLocaleString('ru-RU')}`}
                  />
                );
              })}
            </div>

            {/* Line Items */}
            <div className="space-y-3 border-t border-slate-100 pt-4 dark:border-white/10">
              {breakdownItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-sm ${item.color}`} />
                    <span className="truncate text-slate-600 dark:text-slate-300">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white shrink-0">
                    ${item.value.toLocaleString('ru-RU')}
                  </span>
                </div>
              ))}
            </div>

            {/* Guarantee Note */}
            <div className="mt-5 flex items-start gap-2.5 rounded-lg bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-600 dark:bg-[#1A1E29] dark:text-slate-300">
              <Info className="h-4 w-4 shrink-0 text-[#0058cd] dark:text-[#8fff00] mt-0.5" />
              <span>
                Расчёт включает растаможку, доставку из Южной Кореи и услугу $200. Точную ставку по конкретному VIN зафиксирует менеджер в договоре.
              </span>
            </div>

            <button
              type="button"
              onClick={handleOrderClick}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0058cd] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0046a3] dark:bg-[#8fff00] dark:text-slate-950 dark:hover:bg-[#7ae000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058cd] dark:focus-visible:ring-[#8fff00]"
            >
              <Send className="h-4 w-4" />
              <span>Рассчитать авто с менеджером</span>
            </button>

            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#0058cd] dark:text-emerald-500" />
              <span>Фиксированная услуга $200 без скрытых доплат</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
