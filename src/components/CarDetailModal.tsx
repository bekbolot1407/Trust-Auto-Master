import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Calculator, Send, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalculatorPrefill, CarListing } from '../types/car';

interface CarDetailModalProps {
  car: CarListing | null;
  onClose: () => void;
  onOrderCar: (car: CarListing) => void;
  onOpenInCalculator: (prefill: CalculatorPrefill) => void;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  onClose,
  onOrderCar,
  onOpenInCalculator,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    setSlideIndex(0);
  }, [car]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (car) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [car, onClose]);

  const images = car ? (car.images && car.images.length > 0 ? car.images : [car.image]) : [];

  return (
    <AnimatePresence>
      {car && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="car-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#13161E]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть окно"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-[#0058cd] hover:text-white dark:hover:bg-[#8fff00] dark:hover:text-slate-950"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left Image Carousel */}
              <div className="md:col-span-6 relative aspect-[4/3] md:aspect-auto md:min-h-[360px] bg-slate-100 dark:bg-[#1A1E29]">
                <img
                  src={images[slideIndex] || car.image}
                  alt={`${car.brand} ${car.model}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setSlideIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                      }
                      aria-label="Предыдущее фото"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-[#0058cd] hover:text-white dark:hover:bg-[#8fff00] dark:hover:text-slate-950"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSlideIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                      }
                      aria-label="Следующее фото"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-[#0058cd] hover:text-white dark:hover:bg-[#8fff00] dark:hover:text-slate-950"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 backdrop-blur-sm">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          aria-label={`Фото ${idx + 1}`}
                          onClick={() => setSlideIndex(idx)}
                          className={`h-1.5 rounded-full transition-all ${
                            idx === slideIndex
                              ? 'w-4 bg-[#0058cd] dark:bg-[#8fff00]'
                              : 'w-1.5 bg-white/50 hover:bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                  {car.labels.map((label) => (
                    <span
                      key={label}
                      className="rounded-md bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Details */}
              <div className="md:col-span-6 p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-medium text-[#0058cd] dark:text-[#8fff00]">
                    {car.platform} · {car.country} · Доставка {car.deliveryDays}
                  </div>
                  <h2
                    id="car-modal-title"
                    className="mt-1 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white"
                  >
                    {car.brand} {car.model} ({car.year})
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {car.trim} · VIN: <span className="font-mono">{car.vin}</span>
                  </p>

                  {/* Price */}
                  <div className="mt-4 rounded-xl bg-slate-50 p-3.5 dark:bg-[#1A1E29]">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Цена под ключ в Бишкек:
                      </span>
                      <span className="font-mono text-2xl font-extrabold tabular-nums text-slate-900 dark:text-white">
                        ${car.priceUsd.toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Цена на площадке ({car.country}):</span>
                      <span className="font-mono tabular-nums">
                        ${car.sourcePriceUsd.toLocaleString('ru-RU')}
                      </span>
                    </div>
                  </div>

                  {/* Specs */}
                  <dl className="mt-4 grid grid-cols-2 gap-y-2 gap-x-4 text-xs sm:text-sm">
                    <div>
                      <dt className="text-slate-400">Пробег</dt>
                      <dd className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                        {car.mileageKm.toLocaleString('ru-RU')} км
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Двигатель</dt>
                      <dd className="font-semibold text-slate-900 dark:text-white">
                        {car.fuel}
                        {car.engineCc > 0 ? ` (${(car.engineCc / 1000).toFixed(1)} л)` : ''}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">КПП / Привод</dt>
                      <dd className="font-semibold text-slate-900 dark:text-white">
                        {car.transmission} · {car.drive}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Кузов / Цвет</dt>
                      <dd className="font-semibold text-slate-900 dark:text-white">
                        {car.bodyType} · {car.color}
                      </dd>
                    </div>
                  </dl>

                  {/* Inspection Check */}
                  <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-white/10 dark:text-slate-300">
                    <div className="flex items-center gap-2 font-semibold text-[#0058cd] dark:text-emerald-400">
                      <ShieldCheck className="h-4 w-4 shrink-0" />
                      <span>{car.inspectionScore}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[#0058cd] dark:text-[#8fff00]" />
                      <span>Фото и видео-отчёт толщиномером перед оплатой</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-[#0058cd] dark:text-[#8fff00]" />
                      <span>Проверка страховой истории и реального пробега</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => onOrderCar(car)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0058cd] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0046a3] dark:bg-[#8fff00] dark:text-slate-950 dark:hover:bg-[#7ae000]"
                  >
                    <Send className="h-4 w-4" />
                    <span>Заказать авто</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onOpenInCalculator({
                        country: car.country,
                        priceUsd: car.sourcePriceUsd,
                        year: car.year,
                        engineCc: car.engineCc || 2000,
                        fuel: car.fuel,
                        title: `${car.brand} ${car.model} (${car.year})`,
                      })
                    }
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-[#0058cd] hover:text-[#0058cd] dark:border-white/15 dark:text-slate-200 dark:hover:border-[#8fff00] dark:hover:text-[#8fff00]"
                  >
                    <Calculator className="h-4 w-4" />
                    <span>Калькулятор</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
