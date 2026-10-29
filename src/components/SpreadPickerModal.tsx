import React from 'react';
import { X, Layers } from 'lucide-react';
import { getLocalizedSpreads } from '../engine/ragEngine';
import { useLanguage } from '../context/LanguageContext';
import { SpreadData } from '../types/tarot';

interface SpreadPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSpreadId: string;
  onSelectSpread: (spreadId: string) => void;
}

export const SpreadPickerModal: React.FC<SpreadPickerModalProps> = ({
  isOpen,
  onClose,
  selectedSpreadId,
  onSelectSpread,
}) => {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  const spreads = getLocalizedSpreads(language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mystic-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-3xl max-h-[85vh] glass-panel-gold rounded-3xl p-6 border border-mystic-gold/40 shadow-2xl flex flex-col relative overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-mystic-gold/20">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full glass-panel flex items-center justify-center border border-mystic-gold/40">
              <Layers className="w-5 h-5 text-mystic-gold" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-gold-gradient">
                {t.spreadPicker.title}
              </h3>
              <p className="text-xs text-slate-300">
                {t.spreadPicker.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full glass-panel border border-white/10 hover:border-mystic-gold/40 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spreads Grid */}
        <div className="overflow-y-auto py-4 grid grid-cols-1 md:grid-cols-2 gap-3 pr-1">
          {Object.entries(spreads).map(([id, spread]: [string, SpreadData]) => {
            const isSelected = selectedSpreadId === id;
            return (
              <div
                key={id}
                onClick={() => {
                  onSelectSpread(id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-mystic-800/80 border-mystic-gold shadow-mystic-glow ring-1 ring-mystic-gold'
                    : 'bg-mystic-900/50 border-white/10 hover:border-mystic-gold/40 hover:bg-mystic-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-serif font-bold text-slate-100 group-hover:text-mystic-goldLight transition">
                      {spread.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-mystic-700/60 border border-mystic-gold/30 text-mystic-gold">
                      {spread.card_count} {t.spreadPicker.cardsCount}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                    {spread.description}
                  </p>
                </div>

                {/* Positions Preview Tags */}
                <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1">
                  {spread.positions.slice(0, 4).map((pos, pIdx) => (
                    <span
                      key={pIdx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-mystic-950/70 border border-white/5 text-slate-400"
                    >
                      {pos.name}
                    </span>
                  ))}
                  {spread.positions.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                      +{spread.positions.length - 4} {t.spreadPicker.morePositions}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-mystic-gold/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-mystic-800 hover:bg-mystic-700 text-slate-200 text-xs font-medium border border-white/10 transition"
          >
            {t.spreadPicker.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
