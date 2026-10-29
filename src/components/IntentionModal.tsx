import React, { useState } from 'react';
import { Sparkles, Compass, Heart, Briefcase, Moon, Scale, CheckCircle2 } from 'lucide-react';
import { QuestionType } from '../types/tarot';
import { sound } from '../utils/audio';
import { getLocalizedSpreads } from '../engine/ragEngine';
import { useLanguage } from '../context/LanguageContext';

interface IntentionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartReading: (
    question: string,
    questionType: QuestionType,
    spreadId: string,
    allowReversals: boolean
  ) => void;
  currentSpreadId: string;
  onOpenCleansing?: () => void;
}

export const IntentionModal: React.FC<IntentionModalProps> = ({
  isOpen,
  onClose,
  onStartReading,
  currentSpreadId,
  onOpenCleansing,
}) => {
  const { language, t } = useLanguage();
  const [question, setQuestion] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>('general');
  const [selectedSpreadId, setSelectedSpreadId] = useState(currentSpreadId || 'past-present-future');
  const [allowReversals, setAllowReversals] = useState(true);

  if (!isOpen) return null;

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playShuffle();
    onStartReading(question.trim(), questionType, selectedSpreadId, allowReversals);
    onClose();
  };

  const spreads = getLocalizedSpreads(language);
  const currentSpread = spreads[selectedSpreadId] || spreads['past-present-future'];

  const categoriesList: { type: QuestionType; label: string; icon: any; desc: string }[] = [
    { type: 'general', label: t.categories.general.label, icon: Compass, desc: t.categories.general.desc },
    { type: 'love', label: t.categories.love.label, icon: Heart, desc: t.categories.love.desc },
    { type: 'career', label: t.categories.career.label, icon: Briefcase, desc: t.categories.career.desc },
    { type: 'spiritual', label: t.categories.spiritual.label, icon: Moon, desc: t.categories.spiritual.desc },
    { type: 'decision', label: t.categories.decision.label, icon: Scale, desc: t.categories.decision.desc },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-mystic-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl md:max-w-3xl lg:max-w-4xl glass-panel-gold rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-12 border border-mystic-gold/40 shadow-2xl relative overflow-hidden max-h-[94vh] overflow-y-auto">
        {/* Background ambient glow */}
        <div className="absolute -top-28 -right-28 w-80 h-80 bg-mystic-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-mystic-gold/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full glass-panel border border-mystic-gold/50 shadow-mystic-glow mb-2 sm:mb-3">
            <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-mystic-gold animate-pulse-slow" />
          </div>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gold-gradient leading-tight">
            {t.intention.modalTitle}
          </h2>
          <p className="text-xs md:text-sm lg:text-base text-slate-200 mt-2 max-w-2xl mx-auto leading-relaxed">
            {t.intention.modalSubtitle}
          </p>
        </div>

        <form onSubmit={handleStart} className="space-y-5">
          {/* Question / Intention Input */}
          <div>
            <label className="block text-xs md:text-sm font-semibold uppercase tracking-wider text-mystic-goldLight mb-2">
              {t.intention.questionLabel}
            </label>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t.intention.questionPlaceholder}
              rows={3}
              className="w-full px-5 py-3.5 rounded-2xl bg-mystic-900/80 border border-mystic-gold/30 focus:border-mystic-gold focus:ring-2 focus:ring-mystic-gold/40 text-slate-100 placeholder-slate-500 text-sm md:text-base transition outline-none resize-none shadow-inner leading-relaxed"
            />
          </div>

          {/* Focus Area Selector */}
          <div>
            <label className="block text-xs md:text-sm font-semibold uppercase tracking-wider text-mystic-goldLight mb-2">
              {t.intention.focusLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 md:gap-3">
              {categoriesList.map((cat) => {
                const isSelected = questionType === cat.type;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.type}
                    type="button"
                    onClick={() => setQuestionType(cat.type)}
                    className={`p-3.5 sm:p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-mystic-700/70 border-mystic-gold text-white shadow-mystic-glow ring-1 ring-mystic-gold/80 scale-[1.02]'
                        : 'bg-mystic-900/50 border-white/10 text-slate-300 hover:border-mystic-gold/40 hover:bg-mystic-800/50 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-mystic-gold/20 text-mystic-gold' : 'bg-mystic-950/60 text-slate-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-mystic-gold" />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-100">{cat.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{cat.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spread Selection Summary with Tooltip & Position Previews */}
          <div className="p-4 md:p-5 rounded-2xl bg-mystic-900/80 border border-mystic-gold/30 space-y-3 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs md:text-sm text-slate-200 uppercase tracking-wider font-semibold">
                  {t.intention.selectedSpread}
                </span>
                {/* Info Tooltip Icon */}
                <div className="relative group cursor-pointer inline-flex items-center">
                  <div className="w-5 h-5 rounded-full bg-mystic-800 border border-mystic-gold/40 flex items-center justify-center text-xs text-mystic-gold font-bold">
                    ?
                  </div>
                  {/* Tooltip Content */}
                  <div className="absolute bottom-full left-0 mb-2 w-72 p-3 rounded-2xl glass-panel-gold border border-mystic-gold/50 shadow-2xl text-xs text-slate-200 hidden group-hover:block z-20 pointer-events-none leading-relaxed">
                    <strong className="text-mystic-goldLight block mb-1 text-sm">{currentSpread?.name}</strong>
                    {currentSpread?.description}
                  </div>
                </div>
              </div>

              <select
                value={selectedSpreadId}
                onChange={(e) => setSelectedSpreadId(e.target.value)}
                className="bg-mystic-950 border border-mystic-gold/50 rounded-xl px-4 py-2 text-xs md:text-sm text-mystic-goldLight font-medium outline-none focus:ring-2 focus:ring-mystic-gold/50 cursor-pointer"
              >
                {Object.entries(spreads).map(([id, spread]) => (
                  <option key={id} value={id}>
                    {spread.name} ({spread.card_count} {t.spreadPicker.cardsCount})
                  </option>
                ))}
              </select>
            </div>

            {/* Description explanation */}
            <p className="text-xs md:text-sm text-slate-300 italic border-t border-white/5 pt-2">
              "{currentSpread?.description}"
            </p>

            {/* Positions Preview Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs uppercase tracking-wider text-mystic-accent font-semibold mr-1">
                {language === 'vi' ? 'Các vị trí:' : 'Positions:'}
              </span>
              {currentSpread?.positions.map((pos, pIdx) => (
                <span
                  key={pIdx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-mystic-950/90 border border-mystic-gold/25 text-slate-200 flex items-center space-x-1"
                >
                  <span className="text-mystic-gold font-bold">{pIdx + 1}.</span>
                  <span>{pos.name}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Reversals Option & Cleansing Link */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 pt-1">
            <label className="text-xs md:text-sm text-slate-300 cursor-pointer flex items-center space-x-2.5">
              <input
                type="checkbox"
                checked={allowReversals}
                onChange={(e) => setAllowReversals(e.target.checked)}
                className="w-4 h-4 rounded border-mystic-gold/40 text-mystic-gold focus:ring-mystic-gold/50 accent-mystic-gold cursor-pointer"
              />
              <span>{t.intention.allowReversals}</span>
            </label>

            {onOpenCleansing && (
              <button
                type="button"
                onClick={onOpenCleansing}
                className="text-xs md:text-sm text-mystic-accent hover:underline flex items-center space-x-1.5 font-medium transition"
              >
                <span>🕯️ {language === 'vi' ? 'Làm lại bước Thanh tẩy & Định tâm' : 'Redo Sacred Cleansing'}</span>
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-mystic-goldDark via-mystic-gold to-mystic-goldLight text-mystic-950 font-bold text-sm md:text-base tracking-wide shadow-mystic-glow hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center space-x-2 mt-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>{t.intention.startBtn}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
