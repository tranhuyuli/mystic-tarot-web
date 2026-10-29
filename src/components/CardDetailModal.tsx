import React from 'react';
import { X, Sparkles, Compass, ShieldAlert, HeartHandshake, Eye } from 'lucide-react';
import { DrawnCard } from '../types/tarot';
import { useLanguage } from '../context/LanguageContext';
import { getVietnameseArchetype } from '../utils/vietnameseTarot';

interface CardDetailModalProps {
  card: DrawnCard | null;
  onClose: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, onClose }) => {
  const { language, t } = useLanguage();
  if (!card) return null;

  const cardData = card.cardData;
  const orientation = card.orientation;
  const isReversed = orientation === 'reversed';
  const coreMeaning = cardData.core_meanings[orientation] || cardData.core_meanings.upright;

  const archetypeDisplay = language === 'vi'
    ? getVietnameseArchetype(cardData.archetype)
    : (cardData.archetype ? cardData.archetype.replace(/_/g, ' ') : '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mystic-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] glass-panel-gold rounded-3xl p-6 md:p-8 border border-mystic-gold/40 shadow-2xl flex flex-col md:flex-row gap-6 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full glass-panel border border-white/10 hover:border-mystic-gold/40 text-slate-400 hover:text-white transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: High-Res Card Image */}
        <div className="flex flex-col items-center justify-center md:w-1/2">
          <div className="relative group perspective-1000">
            <div
              className={`w-48 h-80 md:w-56 md:h-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-mystic-gold/50 shadow-mystic-glow transition-transform duration-500 ${
                isReversed ? 'rotate-180' : ''
              }`}
            >
              <img
                src={cardData.image}
                alt={cardData.card_name}
                className="w-full h-full object-cover"
              />
            </div>
            {isReversed && (
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-rose-900/90 text-rose-200 border border-rose-500/40 text-[11px] font-bold tracking-wider uppercase shadow-lg">
                {t.cardDetail.reversedBadge}
              </span>
            )}
          </div>

          <div className="mt-4 text-center">
            <h3 className="font-serif text-xl font-bold text-gold-gradient">
              {cardData.card_name}
            </h3>
            {archetypeDisplay && (
              <p className="text-xs text-mystic-accent capitalize">
                {t.cardDetail.archetype}: {archetypeDisplay}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Deep Interpretation Breakdown */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Position Info */}
          <div className="p-3.5 rounded-2xl bg-mystic-900/80 border border-mystic-gold/20">
            <div className="text-[11px] text-mystic-gold uppercase tracking-wider font-semibold">
              {t.cardDetail.positionInSpread}: {card.position_name}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {card.position_description}
            </p>
          </div>

          {/* Essence */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-mystic-goldLight font-bold mb-1 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-mystic-gold" />
              <span>{t.cardDetail.essence}</span>
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed bg-mystic-900/40 p-3 rounded-xl border border-white/5">
              {coreMeaning.essence}
            </p>
          </div>

          {/* Keywords */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-mystic-goldLight font-bold mb-1.5 flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5 text-mystic-gold" />
              <span>{t.cardDetail.keywords}</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {coreMeaning.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-lg bg-mystic-800/80 border border-mystic-gold/30 text-mystic-goldLight"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Psychological & Practical Dimensions */}
          {coreMeaning.psychological && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-mystic-accent font-bold mb-1 flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-mystic-accent" />
                <span>{t.cardDetail.psychological}</span>
              </h4>
              <p className="text-xs text-slate-300 bg-mystic-900/40 p-2.5 rounded-xl border border-white/5">
                {coreMeaning.psychological}
              </p>
            </div>
          )}

          {coreMeaning.practical && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-1 flex items-center space-x-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.cardDetail.practical}</span>
              </h4>
              <p className="text-xs text-slate-300 bg-mystic-900/40 p-2.5 rounded-xl border border-white/5">
                {coreMeaning.practical}
              </p>
            </div>
          )}

          {coreMeaning.shadow && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-rose-400 font-bold mb-1 flex items-center space-x-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>{t.cardDetail.shadow}</span>
              </h4>
              <p className="text-xs text-slate-300 bg-rose-950/20 p-2.5 rounded-xl border border-rose-500/20">
                {coreMeaning.shadow}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
