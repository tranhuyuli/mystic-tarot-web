import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Flame, Wind, ArrowRight, X, Heart, Compass, Moon } from 'lucide-react';
import { sound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

interface CleansingRitualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const CleansingRitualModal: React.FC<CleansingRitualModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const { language } = useLanguage();
  const PHASE_DURATION = 4; // 4 seconds per phase
  const [totalCycles, setTotalCycles] = useState(4); // Default to 4 cycles
  
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [elapsedInPhase, setElapsedInPhase] = useState(0); // in ms
  const [cycle, setCycle] = useState(1);
  const phaseRef = useRef<'inhale' | 'hold' | 'exhale'>('inhale');
  const cycleRef = useRef(1);
  const totalCyclesRef = useRef(4);

  useEffect(() => {
    totalCyclesRef.current = totalCycles;
  }, [totalCycles]);

  useEffect(() => {
    if (!isOpen) return;

    sound.playTibetanBowl();
    setPhase('inhale');
    phaseRef.current = 'inhale';
    setElapsedInPhase(0);
    setCycle(1);
    cycleRef.current = 1;

    const totalMs = PHASE_DURATION * 1000;
    const intervalMs = 25; // 40 FPS smooth progression

    const interval = setInterval(() => {
      setElapsedInPhase((prev) => {
        const next = prev + intervalMs;
        if (next >= totalMs) {
          // Transition phase
          if (phaseRef.current === 'inhale') {
            phaseRef.current = 'hold';
            setPhase('hold');
            sound.playTibetanBowl();
          } else if (phaseRef.current === 'hold') {
            phaseRef.current = 'exhale';
            setPhase('exhale');
            sound.playTibetanBowl();
          } else {
            // Exhale finished
            if (cycleRef.current >= totalCyclesRef.current) {
              clearInterval(interval);
              setTimeout(() => {
                onComplete();
              }, 400);
              return totalMs;
            }
            cycleRef.current += 1;
            setCycle(cycleRef.current);
            phaseRef.current = 'inhale';
            setPhase('inhale');
            sound.playTibetanBowl();
          }
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isOpen, totalCycles]);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.max(0, (elapsedInPhase / (PHASE_DURATION * 1000)) * 100));
  const remainingSeconds = Math.max(1, Math.ceil((PHASE_DURATION * 1000 - elapsedInPhase) / 1000));

  // SVG circular stroke calculation (radius = 90)
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const phaseText = {
    vi: {
      inhale: 'Hít sâu vào... Đón nhận ánh sáng và năng lượng thanh khiết từ Vũ Trụ',
      hold: 'Giữ hơi thở... Tĩnh lặng, cảm nhận sự an yên lan tỏa khắp tâm trí',
      exhale: 'Thở ra nhẹ nhàng... Buông bỏ mọi âu lo, căng thẳng và vướng bận',
      inhaleLabel: 'HÍT VÀO',
      holdLabel: 'GIỮ HƠI',
      exhaleLabel: 'THỞ RA',
      inhaleSub: 'Đón nhận năng lượng',
      holdSub: 'Tĩnh lặng tâm trí',
      exhaleSub: 'Buông bỏ phiền muộn',
      title: 'Bước 1: Chuẩn bị & Thiết lập không gian',
      sub: 'Thanh tẩy bằng nến thơm, xô thơm, gỗ trắc xanh và chuông xoay. Hãy thả lỏng, kết nối một cách an toàn và cởi mở để sẵn sàng chia sẻ câu chuyện của bạn.',
      skip: 'Bỏ qua bước định tâm',
      done: 'Đã sẵn sàng mở bài',
      cycleLabel: 'Chu kỳ',
    },
    en: {
      inhale: 'Inhale deeply... Welcoming pure cosmic light and wisdom',
      hold: 'Hold gently... Stillness, clarity, and inner balance',
      exhale: 'Exhale softly... Releasing all doubts, tension, and attachments',
      inhaleLabel: 'INHALE',
      holdLabel: 'HOLD',
      exhaleLabel: 'EXHALE',
      inhaleSub: 'Embrace Light',
      holdSub: 'Find Stillness',
      exhaleSub: 'Release Doubts',
      title: 'Step 1: Preparation & Sacred Cleansing',
      sub: 'Purifying with scented candles, sage, palo santo, and singing bowls. Relax and connect in a safe, open space to share your story.',
      skip: 'Skip centering',
      done: 'Ready to proceed',
      cycleLabel: 'Cycle',
    },
  }[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-mystic-950/90 backdrop-blur-2xl animate-fade-in">
      <div className="w-full max-w-2xl md:max-w-3xl glass-panel-gold rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 border border-mystic-gold/50 shadow-2xl text-center relative overflow-hidden flex flex-col items-center max-h-[94vh] overflow-y-auto">
        {/* Ambient Cosmic Background Glows */}
        <div
          className={`absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
            phase === 'inhale' ? 'bg-amber-400/25 scale-125' : phase === 'hold' ? 'bg-mystic-500/30 scale-130' : 'bg-cyan-500/20 scale-100'
          }`}
        />
        <div
          className={`absolute -bottom-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
            phase === 'inhale' ? 'bg-mystic-gold/25 scale-120' : phase === 'hold' ? 'bg-purple-600/30 scale-130' : 'bg-mystic-800/40 scale-100'
          }`}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 sm:p-2.5 rounded-full glass-panel border border-white/10 hover:border-mystic-gold/40 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Top Ritual Icon Badges */}
        <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-mystic-900/90 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-mystic-glow animate-pulse">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-mystic-900/90 border border-mystic-gold/50 flex items-center justify-center text-mystic-gold shadow-mystic-purple animate-spin-slow">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-mystic-900/90 border border-cyan-400/40 flex items-center justify-center text-cyan-300 animate-float">
            <Wind className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gold-gradient mb-1 sm:mb-1.5 leading-tight">
          {phaseText.title}
        </h2>
        <p className="text-[11px] sm:text-xs md:text-sm text-slate-200 max-w-xl mb-3 sm:mb-5 leading-relaxed">
          {phaseText.sub}
        </p>

        {/* 3-Stage Visual Timeline Pills */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 w-full max-w-lg mb-3 sm:mb-4">
          {[
            { key: 'inhale', label: phaseText.inhaleLabel, sub: phaseText.inhaleSub, icon: '🌬️' },
            { key: 'hold', label: phaseText.holdLabel, sub: phaseText.holdSub, icon: '🧘' },
            { key: 'exhale', label: phaseText.exhaleLabel, sub: phaseText.exhaleSub, icon: '✨' },
          ].map((item) => {
            const isActive = phase === item.key;
            return (
              <div
                key={item.key}
                className={`py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl sm:rounded-2xl border transition-all duration-500 text-center flex flex-col items-center justify-center ${
                  isActive
                    ? 'bg-mystic-800/90 border-mystic-gold shadow-mystic-glow ring-2 ring-mystic-gold/60 scale-105'
                    : 'bg-mystic-900/40 border-white/10 opacity-60'
                }`}
              >
                <div className="text-xs sm:text-sm md:text-base mb-0.5">{item.icon}</div>
                <div className={`text-[10px] sm:text-xs font-bold ${isActive ? 'text-mystic-goldLight' : 'text-slate-300'}`}>
                  {item.label}
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:block truncate">{item.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Multi-Layer Animated Sacred Breathing Orb */}
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 flex items-center justify-center my-1 sm:my-2 select-none flex-shrink-0">
          {/* Layer 1: Rotating Sacred Geometry Outer Mandala */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-spin-slow opacity-40">
            <svg viewBox="0 0 240 240" className="w-full h-full text-mystic-gold">
              <circle cx="120" cy="120" r="110" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3,6" />
              <circle cx="120" cy="120" r="95" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
              <polygon points="120,10 148,92 230,120 148,148 120,230 92,148 10,120 92,92" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
              <polygon points="120,25 187,53 215,120 187,187 120,215 53,187 25,120 53,53" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3" />
            </svg>
          </div>

          {/* Layer 2: Counter-Rotating Constellation Ring */}
          <div className="absolute inset-2 flex items-center justify-center pointer-events-none animate-spin-reverse opacity-30">
            <svg viewBox="0 0 240 240" className="w-full h-full text-mystic-accent">
              <circle cx="120" cy="120" r="102" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="8,12" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 120 + 102 * Math.cos(rad);
                const cy = 120 + 102 * Math.sin(rad);
                return <circle key={idx} cx={cx} cy={cy} r="2.5" fill="currentColor" />;
              })}
            </svg>
          </div>

          {/* Layer 3: Dynamic Breathing Ripple Rings (Scaling organically) */}
          <div
            className={`absolute inset-4 rounded-full border-2 border-mystic-gold/50 transition-all ease-out pointer-events-none duration-1000 ${
              phase === 'inhale'
                ? 'scale-115 opacity-90 border-amber-300 shadow-mystic-glow'
                : phase === 'hold'
                ? 'scale-120 opacity-100 border-mystic-gold shadow-mystic-purple animate-pulse'
                : 'scale-85 opacity-30 border-cyan-400'
            }`}
          />
          <div
            className={`absolute inset-8 rounded-full border border-mystic-accent/60 transition-all ease-out pointer-events-none duration-1000 ${
              phase === 'inhale'
                ? 'scale-110 opacity-80'
                : phase === 'hold'
                ? 'scale-115 opacity-90'
                : 'scale-90 opacity-20'
            }`}
          />

          {/* Layer 4: SVG Smooth Sweeping Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 240 240">
            {/* Background Track */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="5"
            />
            {/* Animated Dynamic Stroke */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              fill="none"
              stroke={phase === 'inhale' ? '#fae6a2' : phase === 'hold' ? '#c084fc' : '#38bdf8'}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                filter: 'drop-shadow(0 0 8px rgba(223, 183, 108, 0.8))',
                transition: 'stroke 0.5s ease',
              }}
            />
          </svg>

          {/* Layer 5: Glowing Prana Inner Core */}
          <div
            className={`w-36 h-36 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center relative z-10 transition-all duration-700 shadow-2xl cursor-default ${
              phase === 'inhale'
                ? 'bg-gradient-to-tr from-amber-600 via-mystic-500 to-amber-300 scale-110 shadow-mystic-glow brightness-115'
                : phase === 'hold'
                ? 'bg-gradient-to-tr from-mystic-700 via-mystic-500 to-mystic-gold scale-115 shadow-mystic-purple brightness-125'
                : 'bg-gradient-to-tr from-slate-800 via-mystic-700 to-cyan-600 scale-90 brightness-95'
            }`}
          >
            {/* Glowing Aura Ring */}
            <div className="absolute inset-1 rounded-full bg-mystic-950/40 backdrop-blur-sm flex flex-col items-center justify-center p-3 border border-white/20">
              <span className="font-serif text-4xl md:text-5xl font-bold text-white tracking-wider drop-shadow-md">
                {remainingSeconds}s
              </span>
              <span className="text-xs uppercase font-extrabold text-mystic-goldLight tracking-widest mt-1">
                {phase === 'inhale' ? phaseText.inhaleLabel : phase === 'hold' ? phaseText.holdLabel : phaseText.exhaleLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Soothing Affirmation / Instruction */}
        <div className="min-h-[48px] flex items-center justify-center my-3 px-4">
          <p className="font-serif text-sm md:text-base font-semibold text-mystic-goldLight italic animate-fade-in text-center leading-relaxed">
            "{phaseText[phase]}"
          </p>
        </div>

        {/* Cycle Progress Indicator & Quick Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 my-3">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400 font-medium">
              {phaseText.cycleLabel} {cycle}/{totalCycles}
            </span>
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalCycles }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    cycle > idx + 1
                      ? 'w-7 bg-emerald-400 shadow-md'
                      : cycle === idx + 1
                      ? 'w-9 bg-mystic-gold shadow-mystic-glow'
                      : 'w-2.5 bg-mystic-800 border border-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 4 / 5 Cycles Selector Buttons */}
          <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-mystic-900/80 border border-mystic-gold/30 text-[11px]">
            {[4, 5].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => setTotalCycles(cnt)}
                className={`px-2.5 py-0.5 rounded-lg font-medium transition ${
                  totalCycles === cnt
                    ? 'bg-mystic-gold text-mystic-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cnt} {language === 'vi' ? 'Chu kỳ' : 'Cycles'}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between w-full pt-4 border-t border-mystic-gold/20 mt-3">
          <button
            onClick={onComplete}
            className="text-xs md:text-sm text-slate-400 hover:text-slate-200 transition font-medium"
          >
            {phaseText.skip}
          </button>

          <button
            onClick={onComplete}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-mystic-goldDark via-mystic-gold to-mystic-goldLight text-mystic-950 font-bold text-xs md:text-sm shadow-mystic-glow flex items-center space-x-2 hover:brightness-110 active:scale-98 transition"
          >
            <span>{phaseText.done}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
