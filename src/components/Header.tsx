import React from 'react';
import { Sparkles, Volume2, VolumeX, RotateCcw, Compass, BookOpen, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  spreadName: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSpreadPicker: () => void;
  onOpenIntentionModal: () => void;
  onResetReading: () => void;
  onOpenReadingPanel: () => void;
  hasReading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  spreadName,
  isMuted,
  onToggleMute,
  onOpenSpreadPicker,
  onOpenIntentionModal,
  onResetReading,
  onOpenReadingPanel,
  hasReading,
}) => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-3 py-2.5 sm:px-4 sm:py-3 md:px-8 md:py-4 flex items-center justify-between pointer-events-none">
      {/* Brand Title */}
      <div className="flex items-center space-x-2 sm:space-x-3 pointer-events-auto cursor-pointer" onClick={onOpenIntentionModal}>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full glass-panel-gold flex items-center justify-center border border-mystic-gold/50 shadow-mystic-glow flex-shrink-0">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-mystic-gold animate-pulse-slow" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-serif text-sm sm:text-base md:text-xl font-bold tracking-wider text-gold-gradient leading-tight">
            {t.header.title}
          </h1>
          <p className="hidden sm:block text-[10px] md:text-xs text-mystic-accent tracking-widest uppercase font-medium">
            {t.header.subtitle}
          </p>
        </div>
      </div>

      {/* Center Spread Badge */}
      <div className="hidden lg:flex items-center space-x-2 pointer-events-auto">
        <button
          onClick={onOpenSpreadPicker}
          className="px-4 py-1.5 rounded-full glass-panel border border-mystic-gold/30 hover:border-mystic-gold/70 text-xs text-slate-200 hover:text-mystic-gold transition flex items-center space-x-2 shadow-lg"
        >
          <Compass className="w-3.5 h-3.5 text-mystic-gold" />
          <span>{t.header.spreadLabel}: <strong className="text-mystic-goldLight">{spreadName}</strong></span>
        </button>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 pointer-events-auto">
        {/* Language Switcher Button */}
        <button
          onClick={toggleLanguage}
          className="px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-xl glass-panel border border-mystic-gold/40 hover:border-mystic-gold text-slate-200 hover:text-white transition flex items-center space-x-1 text-xs font-semibold"
          title="Chuyển đổi ngôn ngữ / Switch Language"
        >
          <Globe className="w-3.5 h-3.5 text-mystic-gold" />
          <span className="tracking-wide text-[11px] sm:text-xs">{language === 'vi' ? '🇻🇳 VN' : '🇬🇧 EN'}</span>
        </button>

        {hasReading && (
          <button
            onClick={onOpenReadingPanel}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-xl glass-panel-gold border border-mystic-gold/50 text-mystic-goldLight hover:bg-mystic-gold/20 transition flex items-center space-x-1.5 text-xs md:text-sm font-medium shadow-mystic-glow"
            title={t.header.viewReading}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-mystic-gold" />
            <span className="hidden md:inline">{t.header.viewReading}</span>
          </button>
        )}

        <button
          onClick={onResetReading}
          className="p-2 sm:p-2.5 rounded-xl glass-panel border border-white/10 hover:border-mystic-gold/40 text-slate-300 hover:text-white transition flex items-center justify-center"
          title={t.header.newReading}
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <button
          onClick={onToggleMute}
          className="p-2 sm:p-2.5 rounded-xl glass-panel border border-white/10 hover:border-mystic-gold/40 text-slate-300 hover:text-white transition flex items-center justify-center"
          title={isMuted ? t.header.unmuteSound : t.header.muteSound}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-mystic-gold" />}
        </button>
      </div>
    </header>
  );
};
