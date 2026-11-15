import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mic,
  Square,
  Play,
  Trash2,
  MessageSquareText,
  Send,
  CheckCircle2,
} from 'lucide-react';

interface ManagerModalProps {
  isOpen: boolean;
  initialTab?: 'text' | 'voice';
  prefillMessage?: string;
  onClose: () => void;
}

export const ManagerModal: React.FC<ManagerModalProps> = ({
  isOpen,
  initialTab = 'text',
  prefillMessage = '',
  onClose,
}) => {
  const [tab, setTab] = useState<'text' | 'voice'>(initialTab);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [messenger, setMessenger] = useState<'WhatsApp' | 'Telegram' | 'Звонок'>('WhatsApp');
  const [message, setMessage] = useState(prefillMessage);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (prefillMessage) setMessage(prefillMessage);
  }, [prefillMessage, isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setError('');
    setRecordSeconds(0);
    setHasRecording(false);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
    } catch {
      // Fallback interactive timer recording mode when mic permission is blocked
      mediaRecorderRef.current = null;
    }

    setIsRecording(true);
    timerRef.current = window.setInterval(() => {
      setRecordSeconds((s) => s + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setHasRecording(true);
  };

  const discardRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setHasRecording(false);
    setRecordSeconds(0);
  };

  const formatDuration = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contact.trim().length < 5) {
      setError('Укажите ваш номер телефона, WhatsApp или @username в Telegram');
      return;
    }
    if (tab === 'voice' && !hasRecording && !isRecording) {
      setError('Нажмите на микрофон, чтобы записать голосовое, либо перейдите во вкладку «Текст»');
      return;
    }
    if (isRecording) stopRecording();
    setError('');
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setError('');
    discardRecording();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={resetAndClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="manager-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#13161E]"
          >
            <button
              type="button"
              onClick={resetAndClose}
              aria-label="Закрыть"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="pr-8">
              <span className="text-xs font-semibold text-[#0058cd] dark:text-[#8fff00]">Trust Auto · Бишкек</span>
              <h2
                id="manager-modal-title"
                className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white"
              >
                Связаться с менеджером
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Запишите голосовое или спросите текстом — всё объясним и подберём.
              </p>
            </div>

            {submitted ? (
              <div className="mt-6 rounded-xl border border-[#0058cd]/30 bg-[#0058cd]/10 p-5 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
                <CheckCircle2 className="mx-auto h-10 w-10 text-[#0058cd] dark:text-emerald-500" />
                <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                  Заявка успешно отправлена!
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                  {tab === 'voice'
                    ? `Ваше голосовое сообщение (${formatDuration(recordSeconds)}) передано эксперту.`
                    : 'Ваш запрос передан старшему менеджеру Trust Auto.'}{' '}
                  Ответим в <span className="font-semibold">{messenger}</span> на контакт{' '}
                  <span className="font-mono font-semibold">{contact}</span> в течение 5 минут.
                </p>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="mt-5 w-full rounded-lg bg-[#0058cd] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0046a3] dark:bg-[#8fff00] dark:text-slate-950 dark:hover:bg-[#7ae000]"
                >
                  Вернуться на сайт
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {/* Mode Tabs */}
                <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-[#1A1E29]">
                  <button
                    type="button"
                    onClick={() => setTab('voice')}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-colors ${
                      tab === 'voice'
                        ? 'bg-[#0058cd] text-white dark:bg-[#8fff00] dark:text-slate-950'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                    }`}
                  >
                    <Mic className="h-4 w-4" />
                    <span>Голосовое</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('text')}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-colors ${
                      tab === 'text'
                        ? 'bg-[#0058cd] text-white dark:bg-[#8fff00] dark:text-slate-950'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                    }`}
                  >
                    <MessageSquareText className="h-4 w-4" />
                    <span>Текстом</span>
                  </button>
                </div>

                {/* Voice Recorder UI */}
                {tab === 'voice' && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#1A1E29]">
                    <div className="flex items-center justify-between gap-3">
                      {!isRecording && !hasRecording && (
                        <button
                          type="button"
                          onClick={startRecording}
                          className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-dashed border-[#0058cd] bg-[#0058cd]/10 px-4 py-4 text-sm font-semibold text-[#0058cd] transition-colors hover:bg-[#0058cd]/15 dark:border-[#8fff00] dark:bg-[#8fff00]/10 dark:text-[#8fff00] dark:hover:bg-[#8fff00]/20"
                        >
                          <Mic className="h-5 w-5" />
                          <span>Начать запись голосового сообщения</span>
                        </button>
                      )}

                      {isRecording && (
                        <div className="flex w-full items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                            <span className="font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white">
                              Идёт запись · {formatDuration(recordSeconds)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3.5 py-2 text-xs font-semibold text-white hover:bg-red-600"
                          >
                            <Square className="h-3.5 w-3.5 fill-current" />
                            <span>Стоп</span>
                          </button>
                        </div>
                      )}

                      {hasRecording && !isRecording && (
                        <div className="flex w-full items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            {audioUrl ? (
                              <button
                                type="button"
                                onClick={() => audioElRef.current?.play()}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0058cd] text-white dark:bg-[#8fff00] dark:text-slate-950"
                                aria-label="Прослушать запись"
                              >
                                <Play className="h-4 w-4 fill-current" />
                              </button>
                            ) : (
                              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0058cd]/15 text-[#0058cd] dark:bg-emerald-500/15 dark:text-emerald-500">
                                <CheckCircle2 className="h-4 w-4" />
                              </span>
                            )}
                            <div>
                              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                Голосовое записано
                              </div>
                              <div className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                                Длительность: {formatDuration(Math.max(1, recordSeconds))}
                              </div>
                            </div>
                            {audioUrl && <audio ref={audioElRef} src={audioUrl} className="hidden" />}
                          </div>
                          <button
                            type="button"
                            onClick={discardRecording}
                            aria-label="Удалить запись"
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Preferred Messenger */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
                    Куда ответить?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['WhatsApp', 'Telegram', 'Звонок'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMessenger(m)}
                        className={`rounded-lg border py-2 text-xs font-semibold transition-colors ${
                          messenger === m
                            ? 'border-[#0058cd] bg-[#0058cd]/10 text-[#0058cd] dark:border-[#8fff00] dark:bg-[#8fff00]/15 dark:text-[#8fff00]'
                            : 'border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Ваше имя
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Например, Азамат"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0058cd] focus:bg-white focus:outline-none dark:border-white/10 dark:bg-[#0D0D0D] dark:text-white dark:focus:border-[#8fff00]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Телефон или @Telegram *
                    </label>
                    <input
                      type="text"
                      value={contact}
                      onChange={(e) => {
                        setContact(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="+996 555 00-00-00"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0058cd] focus:bg-white focus:outline-none dark:border-white/10 dark:bg-[#0D0D0D] dark:text-white dark:focus:border-[#8fff00]"
                    />
                  </div>
                </div>

                {tab === 'text' && (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      Какой автомобиль интересует?
                    </label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Опишите марку, год, желаемый бюджет или оставьте ссылку на лот..."
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0058cd] focus:bg-white focus:outline-none dark:border-white/10 dark:bg-[#0D0D0D] dark:text-white dark:focus:border-[#8fff00]"
                    />
                  </div>
                )}

                {error && <p className="text-xs font-medium text-red-500">{error}</p>}

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0058cd] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0046a3] dark:bg-[#8fff00] dark:text-slate-950 dark:hover:bg-[#7ae000]"
                >
                  <Send className="h-4 w-4" />
                  <span>Отправить менеджеру</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
