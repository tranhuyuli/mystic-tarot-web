import React, { useState } from 'react';
import { Layers, Sparkles, Check, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

interface CutDeckModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const CutDeckModal: React.FC<CutDeckModalProps> = ({ isOpen, onComplete }) => {
  const { language } = useLanguage();
  const [selectedStack, setSelectedStack] = useState<number | null>(null);
  const [isCutting, setIsCutting] = useState(false);

  if (!isOpen) return null;

  const handleSelectStack = (stackIndex: number) => {
    setSelectedStack(stackIndex);
    setIsCutting(true);
    sound.playCutDeck();

    setTimeout(() => {
      onComplete();
      setIsCutting(false);
      setSelectedStack(null);
    }, 900);
  };

  const text = {
    vi: {
      title: 'Bước 3: Nghi Thức Chẻ Bài (Cut the Deck)',
      sub: 'Chạm vào 1 trong 3 tụ bài để đưa dấu ấn năng lượng và trực giác của bạn vào bộ bài trước khi chia.',
      stack1: 'Tụ 1: Năng Lượng Tiềm Thức',
      stack2: 'Tụ 2: Năng Lượng Hiện Thực',
      stack3: 'Tụ 3: Năng Lượng Tương Lai',
      cutting: 'Đang gộp bài và hội tụ năng lượng...',
      skip: 'Bỏ qua chẻ bài',
    },
    en: {
      title: 'Step 3: Cut the Deck Ritual',
      sub: 'Tap one of the 3 stacks to infuse your intuitive energy into the deck before dealing.',
      stack1: 'Stack 1: Subconscious Energy',
      stack2: 'Stack 2: Conscious Reality',
      stack3: 'Stack 3: Future Potential',
      cutting: 'Recombining deck with your energy...',
      skip: 'Skip cutting',
    },
  }[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mystic-950/85 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-2xl md:max-w-3xl glass-panel-gold rounded-3xl p-8 md:p-12 border border-mystic-gold/50 shadow-2xl text-center relative overflow-hidden flex flex-col items-center">
        {/* Background ambient glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-mystic-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-mystic-gold/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full glass-panel border border-mystic-gold/50 shadow-mystic-glow mb-3">
          <Layers className="w-7 h-7 text-mystic-gold animate-bounce" />
        </div>

        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-gold-gradient mb-2">
          {text.title}
        </h2>
        <p className="text-xs md:text-sm lg:text-base text-slate-200 max-w-xl mb-6 leading-relaxed">
          {text.sub}
        </p>

        {/* 3 Cut Stacks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 md:gap-4 w-full my-4">
          {[1, 2, 3].map((idx) => {
            const isSelected = selectedStack === idx;
            const stackLabel = idx === 1 ? text.stack1 : idx === 2 ? text.stack2 : text.stack3;
            return (
              <button
                key={idx}
                disabled={isCutting}
                onClick={() => handleSelectStack(idx)}
                className={`group relative p-5 md:p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center space-y-3 cursor-pointer ${
                  isSelected
                    ? 'bg-mystic-800 border-mystic-gold shadow-mystic-glow scale-105 ring-2 ring-mystic-gold'
                    : 'bg-mystic-900/60 border-white/10 hover:border-mystic-gold/50 hover:bg-mystic-800/50 hover:scale-102'
                }`}
              >
                {/* 3D Stack Graphic */}
                <div className="relative w-20 h-28 flex items-center justify-center perspective-500 my-1">
                  <div className="absolute top-0 w-16 h-24 rounded-xl bg-mystic-950 border border-mystic-gold/30 shadow-md transform -rotate-3" />
                  <div className="absolute top-1.5 w-16 h-24 rounded-xl bg-mystic-900 border border-mystic-gold/40 shadow-lg transform rotate-2" />
                  <div className="absolute top-3 w-16 h-24 rounded-xl bg-gradient-to-tr from-mystic-800 to-mystic-950 border-2 border-mystic-gold/60 shadow-2xl flex items-center justify-center group-hover:-translate-y-1 transition">
                    <Sparkles className="w-6 h-6 text-mystic-gold" />
                  </div>
                </div>

                <div className="text-center pt-1">
                  <div className="text-sm md:text-base font-serif font-bold text-slate-100 group-hover:text-mystic-goldLight">
                    {stackLabel.split(':')[0]}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {stackLabel.split(':')[1]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Status */}
        <div className="h-9 flex items-center justify-center my-3 text-xs md:text-sm text-mystic-goldLight font-medium">
          {isCutting ? (
            <span className="flex items-center space-x-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-mystic-gold" />
              <span>{text.cutting}</span>
            </span>
          ) : (
            <span>✨ {language === 'vi' ? 'Chạm để chọn tụ chẻ bài' : 'Tap a stack to cut the deck'}</span>
          )}
        </div>

        {/* Skip button */}
        <button
          onClick={onComplete}
          className="text-xs md:text-sm text-slate-400 hover:text-slate-200 pt-2 transition font-medium"
        >
          {text.skip}
        </button>
      </div>
    </div>
  );
};
