import React, { useState } from 'react';
import { Bell, Sparkles, Check, Heart, RotateCcw, X } from 'lucide-react';
import { sound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

interface CordCuttingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetSession: () => void;
}

export const CordCuttingModal: React.FC<CordCuttingModalProps> = ({
  isOpen,
  onClose,
  onResetSession,
}) => {
  const { language } = useLanguage();
  const [isTapping, setIsTapping] = useState(false);
  const [isCleansed, setIsCleansed] = useState(false);

  if (!isOpen) return null;

  const handleTapCleansing = () => {
    setIsTapping(true);
    sound.playDeckTapping();

    setTimeout(() => {
      setIsTapping(false);
      setIsCleansed(true);
    }, 1200);
  };

  const text = {
    vi: {
      title: 'Bước 5: Cắt Dây Năng Lượng & Đóng Phiên',
      sub: 'Trong nghi thức Tarot truyền thống, reader gõ nhẹ 3 tiếng lên bộ bài để xả năng lượng dư thừa, bảo vệ trường năng lượng cá nhân và trả lại sự tự do thanh thản cho người hỏi.',
      tapBtn: 'Gõ Nhẹ 3 Tiếng Xả Năng Lượng',
      cleansedTitle: 'Năng Lượng Đã Được Thanh Lọc & Khép Lại Trọn Vẹn!',
      cleansedDesc: 'Cảm ơn sự hiện diện và tin tưởng của bạn. Mong rằng những thông điệp này sẽ là ngọn đèn soi sáng và tiếp thêm sức mạnh cho bạn!',
      newSession: 'Khởi đầu phiên trải bài mới',
      close: 'Đóng lại',
    },
    en: {
      title: 'Step 5: Cord Cutting & Energy Release',
      sub: 'In authentic Tarot practice, tapping the deck three times clears residual emotional energies, disconnects energetic cords, and grounds the querent in sovereign peace.',
      tapBtn: 'Tap Deck 3 Times to Release Energy',
      cleansedTitle: 'Energetic Cords Cleared & Session Complete!',
      cleansedDesc: 'Thank you for your openness and divine trust. May the cosmic wisdom illuminate your path with grace and clarity!',
      newSession: 'Start a New Reading',
      close: 'Close',
    },
  }[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mystic-950/90 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-lg glass-panel-gold rounded-3xl p-6 md:p-8 border border-mystic-gold/50 shadow-2xl text-center relative overflow-hidden flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full glass-panel border border-white/10 hover:border-mystic-gold/40 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {!isCleansed ? (
          <>
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 shadow-mystic-glow mb-3">
              <Bell className={`w-7 h-7 ${isTapping ? 'animate-bounce' : ''}`} />
            </div>

            <h2 className="font-serif text-2xl font-bold text-gold-gradient mb-2">
              {text.title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mb-6">
              {text.sub}
            </p>

            <button
              onClick={handleTapCleansing}
              disabled={isTapping}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 text-white font-bold text-sm shadow-mystic-glow hover:brightness-110 active:scale-98 transition flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isTapping ? (language === 'vi' ? 'Đang gõ xả năng lượng...' : 'Tapping deck...') : text.tapBtn}</span>
            </button>
          </>
        ) : (
          <div className="space-y-4 py-2 animate-fade-in">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 shadow-mystic-glow">
              <Heart className="w-7 h-7" />
            </div>

            <h2 className="font-serif text-xl font-bold text-emerald-300">
              {text.cleansedTitle}
            </h2>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              {text.cleansedDesc}
            </p>

            <div className="pt-4 flex items-center justify-center space-x-3">
              <button
                onClick={() => {
                  onClose();
                  onResetSession();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-mystic-goldDark to-mystic-gold text-mystic-950 font-bold text-xs shadow-mystic-glow hover:brightness-110 transition flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{text.newSession}</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs transition"
              >
                {text.close}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
