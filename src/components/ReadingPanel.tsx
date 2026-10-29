import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  X,
  Sparkles,
  Layers,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Crown,
  Maximize2,
  Minimize2,
  Bell,
} from 'lucide-react';
import { AssembledContext, DrawnCard } from '../types/tarot';
import { useLanguage } from '../context/LanguageContext';

interface ReadingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  assembledContext: AssembledContext | null;
  readingStreamText: string;
  isStreaming: boolean;
  onSelectCardDetail: (card: DrawnCard) => void;
  drawnCards: DrawnCard[];
  onOpenCordCutting?: () => void;
  onDrawOracleBlessing?: () => void;
  oracleBlessing?: { card_name: string; message: string; image: string } | null;
}

export const ReadingPanel: React.FC<ReadingPanelProps> = ({
  isOpen,
  onClose,
  assembledContext,
  readingStreamText,
  isStreaming,
  onSelectCardDetail,
  drawnCards,
  onOpenCordCutting,
  onDrawOracleBlessing,
  oracleBlessing,
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ai' | 'elements'>('ai');
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');

  // Resizable panel width state
  const [panelWidth, setPanelWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Math.min(Math.max(window.innerWidth * 0.48, 560), 880);
    }
    return 680;
  });
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Oracle contemplation cycling phrase index
  const [oraclePhraseIdx, setOraclePhraseIdx] = useState(0);

  const oraclePhrasesVi = [
    'Nhà tiên tri đang nhắm mắt, lắng nghe tiếng thì thầm của các lá bài...',
    'Đang kết nối ý niệm của bạn vào dòng chảy năng lượng vũ trụ...',
    'Đang xâu chuỗi nhân quả giữa quá khứ, hiện tại và tiềm năng tương lai...',
    'Đang cảm nhận năng lượng bài học và lời khuyên trao quyền...',
    'Từng dòng giải đoán huyền bí đang dần được khắc họa...',
  ];

  const oraclePhrasesEn = [
    'The Oracle closes eyes, listening to the whispers of the cards...',
    'Connecting your intention into the celestial cosmic flow...',
    'Weaving the threads of past, present, and unfolding potential...',
    'Channeling empowerment guidance and actionable wisdom...',
    'The mystical prophecy is forming on the parchment...',
  ];

  useEffect(() => {
    if (!readingStreamText && isStreaming) {
      const interval = setInterval(() => {
        setOraclePhraseIdx((prev) => (prev + 1) % oraclePhrasesVi.length);
      }, 2600);
      return () => clearInterval(interval);
    }
  }, [readingStreamText, isStreaming]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const minW = 380;
      const maxW = Math.min(window.innerWidth - 60, 1400);
      const newW = window.innerWidth - e.clientX;
      if (newW >= minW && newW <= maxW) {
        setPanelWidth(newW);
        setIsMaximized(false);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  if (!isOpen || !assembledContext) return null;

  // Calculate Elemental & Arcana Breakdown
  let majorCount = 0;
  let fireCount = 0; // Wands
  let waterCount = 0; // Cups
  let airCount = 0; // Swords
  let earthCount = 0; // Pentacles

  drawnCards.forEach((c) => {
    const id = c.card_id.toLowerCase();
    if (id.includes('wands')) fireCount++;
    else if (id.includes('cups')) waterCount++;
    else if (id.includes('swords')) airCount++;
    else if (id.includes('pentacles')) earthCount++;
    else majorCount++;
  });

  const totalCards = drawnCards.length || 1;

  const handleCopy = () => {
    const textToCopy =
      activeTab === 'ai' && readingStreamText
        ? readingStreamText
        : assembledContext.card_interpretations
            .map((c) => `[${c.position_name}] ${c.card_name} (${c.orientation}): ${c.position_interpretation}`)
            .join('\n\n');

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        width: isMaximized ? '100vw' : `${panelWidth}px`,
        maxWidth: '100vw',
      }}
      className={`fixed inset-y-0 right-0 z-40 w-full md:w-auto bg-mystic-950/98 backdrop-blur-2xl border-l border-mystic-gold/30 shadow-2xl flex flex-col ${
        isResizing ? 'select-none' : 'transition-[width] duration-150 ease-out'
      } animate-slide-left`}
    >
      {/* Left Edge Resize Drag Handle (Desktop only) */}
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizing(true);
        }}
        className={`hidden md:flex absolute left-0 top-0 bottom-0 w-3 -translate-x-1.5 cursor-col-resize z-50 group items-center justify-center select-none ${
          isResizing ? 'bg-mystic-gold/40' : 'hover:bg-mystic-gold/20'
        }`}
        title={language === 'vi' ? 'Kéo để chỉnh độ rộng bảng luận giải' : 'Drag to resize panel'}
      >
        <div
          className={`w-1 rounded-full transition-all ${
            isResizing
              ? 'h-24 bg-mystic-gold shadow-mystic-glow'
              : 'h-12 bg-white/20 group-hover:bg-mystic-gold/80 group-hover:h-20'
          }`}
        />
      </div>

      {/* Panel Header */}
      <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-b border-mystic-gold/20 flex items-center justify-between bg-mystic-900/70">
        <div>
          <div className="text-[11px] text-mystic-accent font-semibold tracking-wider uppercase">
            {t.readingPanel.headerSub}
          </div>
          <h2 className="font-serif text-lg md:text-xl font-bold text-gold-gradient">
            {assembledContext.spread_name}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          {/* Font Size Adjuster Toggle */}
          <button
            onClick={() =>
              setFontSize((prev) =>
                prev === 'normal' ? 'large' : prev === 'large' ? 'huge' : 'normal'
              )
            }
            className="px-2.5 py-1.5 rounded-xl glass-panel border border-white/10 hover:border-mystic-gold/40 text-slate-300 hover:text-white transition text-xs font-semibold flex items-center space-x-1"
            title={language === 'vi' ? 'Đổi cỡ chữ đọc bài' : 'Toggle font size'}
          >
            <span className="text-[11px] text-mystic-gold">Aa</span>
            <span className="text-[10px] text-slate-400">
              {fontSize === 'normal' ? 'Chuẩn' : fontSize === 'large' ? 'Vừa' : 'Lớn'}
            </span>
          </button>

          {/* Maximize / Restore Button */}
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-2 rounded-xl glass-panel border border-white/10 hover:border-mystic-gold/40 text-slate-300 hover:text-white transition"
            title={isMaximized ? (language === 'vi' ? 'Thu nhỏ lại' : 'Restore size') : (language === 'vi' ? 'Mở rộng toàn màn hình' : 'Maximize panel')}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4 text-mystic-gold" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl glass-panel border border-white/10 hover:border-mystic-gold/40 text-slate-300 hover:text-white transition"
            title={copied ? t.readingPanel.copiedBtn : t.readingPanel.copyBtn}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl glass-panel border border-white/10 hover:border-mystic-gold/40 text-slate-300 hover:text-white transition"
            title={t.readingPanel.closeBtn}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Intention summary pill */}
      {assembledContext.question && (
        <div className="px-6 py-2 bg-mystic-900/40 border-b border-white/5 flex items-center justify-between text-xs text-slate-300">
          <span className="truncate pr-2">
            <strong>{t.readingPanel.intentionLabel}:</strong> "{assembledContext.question}"
          </span>
          <span className="px-2 py-0.5 rounded-full bg-mystic-800 border border-mystic-gold/30 text-mystic-gold uppercase text-[10px] font-semibold">
            {assembledContext.question_type}
          </span>
        </div>
      )}

      {/* Undercurrent Theme Card Pill */}
      {assembledContext.undercurrent_card && (
        <div className="px-6 py-2 bg-gradient-to-r from-purple-950/40 via-mystic-900/60 to-purple-950/40 border-b border-mystic-gold/20 flex items-center justify-between text-xs text-mystic-goldLight">
          <div className="flex items-center space-x-2 truncate">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900/80 border border-purple-500/40 text-purple-300 font-bold uppercase">
              {language === 'vi' ? 'Lá Dẫn Đường' : 'Theme Card'}
            </span>
            <span className="font-serif font-bold text-slate-100 truncate">
              {assembledContext.undercurrent_card.card_name} ({assembledContext.undercurrent_card.orientation === 'upright' ? (language === 'vi' ? 'Thuận' : 'Upright') : (language === 'vi' ? 'Ngược' : 'Reversed')})
            </span>
          </div>
          <span className="text-[11px] text-slate-400 italic truncate max-w-[240px] hidden sm:inline">
            "{assembledContext.undercurrent_card.core_essence}"
          </span>
        </div>
      )}

      {/* 2 Actionable Tabs */}
      <div className="px-6 pt-2.5 flex space-x-4 border-b border-white/5">
        <button
          onClick={() => setActiveTab('ai')}
          className={`pb-2.5 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 border-b-2 transition ${
            activeTab === 'ai'
              ? 'border-mystic-gold text-mystic-goldLight'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-mystic-gold" />
          <span>{t.readingPanel.tabAi}</span>
          {isStreaming && <span className="w-1.5 h-1.5 rounded-full bg-mystic-gold animate-ping" />}
        </button>

        <button
          onClick={() => setActiveTab('elements')}
          className={`pb-2.5 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 border-b-2 transition ${
            activeTab === 'elements'
              ? 'border-mystic-gold text-mystic-goldLight'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-mystic-accent" />
          <span>{t.readingPanel.tabRag}</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* TAB 1: Interpretation Narrative */}
        {activeTab === 'ai' && (
          <div className="space-y-3">
            {readingStreamText ? (
              <div
                className={`reading-ai-body space-y-0 font-sans ${
                  fontSize === 'huge'
                    ? 'text-base md:text-lg'
                    : fontSize === 'large'
                    ? 'text-[15px] md:text-[17px]'
                    : 'text-sm md:text-[15px]'
                }`}
              >
                <ReactMarkdown
                  components={{
                    // H1 — Title banner
                    h1: ({ children }) => (
                      <h1 className="font-serif text-2xl md:text-3xl font-bold text-amber-200 mt-6 mb-4 pb-2 border-b border-amber-500/25 tracking-wide">
                        {children}
                      </h1>
                    ),
                    // H2 — Section header with subtle gold line
                    h2: ({ children }) => (
                      <h2 className="font-serif text-lg md:text-xl font-bold text-amber-200 mt-7 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-5 rounded-full bg-amber-400 inline-block flex-shrink-0" />
                        {children}
                      </h2>
                    ),
                    // H3 — Card position header
                    h3: ({ children }) => (
                      <h3 className="font-serif text-base md:text-lg font-semibold text-amber-300 mt-5 mb-2 tracking-wide">
                        {children}
                      </h3>
                    ),
                    // H4 — Sub-section
                    h4: ({ children }) => (
                      <h4 className="font-semibold text-slate-100 mt-3 mb-1.5">{children}</h4>
                    ),
                    // Paragraph with comfortable book reading line height
                    p: ({ children }) => (
                      <p className="text-slate-100/95 leading-relaxed md:leading-[1.85] mb-4 tracking-normal">
                        {children}
                      </p>
                    ),
                    // Strong / Bold — warm amber highlight
                    strong: ({ children }) => (
                      <strong className="text-amber-200 font-semibold">{children}</strong>
                    ),
                    // Em / Italic — true elegant italic
                    em: ({ children }) => (
                      <em className="text-slate-300 italic font-serif">{children}</em>
                    ),
                    // Blockquote — elegant quote parchment box
                    blockquote: ({ children }) => (
                      <blockquote className="my-5 px-5 py-4 rounded-2xl bg-black/40 border-l-4 border-amber-400 text-amber-100 font-serif italic leading-relaxed shadow-sm">
                        {children}
                      </blockquote>
                    ),
                    // HR — subtle divider
                    hr: () => (
                      <div className="my-6 flex items-center gap-3">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
                        <span className="text-amber-400/60 text-xs">✦</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
                      </div>
                    ),
                    // Unordered list
                    ul: ({ children }) => (
                      <ul className="space-y-2 my-3 pl-1">{children}</ul>
                    ),
                    // Ordered list
                    ol: ({ children }) => (
                      <ol className="space-y-2 my-3 pl-1 list-decimal list-inside">{children}</ol>
                    ),
                    // List item
                    li: ({ children }) => (
                      <li className="flex items-start gap-2 text-slate-100/95 leading-relaxed">
                        <span className="text-amber-400/80 mt-1.5 flex-shrink-0 text-[9px]">◆</span>
                        <span>{children}</span>
                      </li>
                    ),
                    // Code block
                    code: ({ children }) => (
                      <code className="px-1.5 py-0.5 rounded bg-mystic-900 text-amber-200 text-xs font-mono">{children}</code>
                    ),
                  }}
                >
                  {readingStreamText}
                </ReactMarkdown>
                {isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-amber-400 animate-pulse rounded-sm" />
                )}
              </div>
            ) : (
              <div className="py-10 px-4 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
                {/* Visual: Oracle Contemplation Mandala & Crystal Core */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  {/* Outer Rotating Constellation Ring */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-mystic-gold/40 animate-spin-slow" />
                  <div className="absolute inset-3 rounded-full border border-dotted border-purple-500/40 animate-spin-reverse" />
                  
                  {/* Glowing Prana Waves */}
                  <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-purple-900/40 via-mystic-600/30 to-amber-500/20 blur-xl animate-pulse" />

                  {/* Sacred Geometry Orbiting Glyphs */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-mystic-gold text-xs">✦</div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-mystic-gold text-xs">✦</div>
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 text-mystic-gold text-xs">✦</div>
                  <div className="absolute top-1/2 -right-1 -translate-y-1/2 text-mystic-gold text-xs">✦</div>

                  {/* Central Oracle Mind Core */}
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-mystic-950 via-purple-950 to-mystic-900 border-2 border-mystic-gold/60 shadow-mystic-glow flex flex-col items-center justify-center relative z-10 overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-mystic-gold/10 via-transparent to-purple-500/10 pointer-events-none" />
                    <Sparkles className="w-8 h-8 text-mystic-gold animate-bounce mb-1 drop-shadow-md" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-mystic-goldLight">
                      {language === 'vi' ? 'TIÊN TRI' : 'ORACLE'}
                    </span>
                  </div>

                  {/* Floating Mini Cards around Oracle */}
                  {drawnCards.slice(0, 4).map((c, i) => (
                    <div
                      key={c.card_id}
                      style={{
                        transform: `rotate(${i * 90 + 45}deg) translate(76px) rotate(-${i * 90 + 45}deg)`,
                      }}
                      className="absolute w-8 h-12 rounded bg-mystic-900/90 border border-mystic-gold/60 shadow-lg overflow-hidden flex items-center justify-center animate-pulse"
                    >
                      <img src={c.cardData.image} alt={c.card_name} className="w-full h-full object-cover opacity-80" />
                    </div>
                  ))}
                </div>

                {/* Status Title & Cycling Mystical Whispers */}
                <div className="space-y-2 max-w-md">
                  <h3 className="font-serif text-lg font-bold text-gold-gradient tracking-wide">
                    {language === 'vi' ? 'Nhà Tiên Tri Đang Chiêm Nghiệm' : 'The Oracle is Contemplating'}
                  </h3>
                  <p className="text-xs md:text-sm text-mystic-goldLight font-medium italic min-h-[44px] flex items-center justify-center transition-all duration-500 animate-fade-in px-2 leading-relaxed">
                    "{language === 'vi' ? oraclePhrasesVi[oraclePhraseIdx] : oraclePhrasesEn[oraclePhraseIdx]}"
                  </p>
                </div>

                {/* Subtle Energy Line */}
                <div className="w-36 h-0.5 bg-gradient-to-r from-transparent via-mystic-gold/50 to-transparent animate-pulse" />
              </div>
            )}

            {/* Oracle Blessing Card Callout */}
            {oracleBlessing && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-mystic-900 via-mystic-800 to-mystic-900 border border-mystic-gold/40 shadow-mystic-glow flex items-start space-x-3">
                <img
                  src={oracleBlessing.image}
                  alt={oracleBlessing.card_name}
                  className="w-14 h-22 object-cover rounded-lg border border-mystic-gold/50 shrink-0"
                />
                <div>
                  <div className="text-[10px] uppercase font-bold text-mystic-gold tracking-widest">
                    ✨ {language === 'vi' ? 'Thông Điệp Chữa Lành Vũ Trụ (Oracle Blessing)' : 'Oracle Blessing'}
                  </div>
                  <h4 className="font-serif text-sm font-bold text-gold-gradient mt-0.5">
                    {oracleBlessing.card_name}
                  </h4>
                  <p className="text-xs text-slate-300 italic mt-1 leading-relaxed">
                    "{oracleBlessing.message}"
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Elemental Dominance & RAG Cards Breakdown */}
        {activeTab === 'elements' && (
          <div className="space-y-4">
            {/* Elemental Balance Bar */}
            <div className="p-4 rounded-2xl bg-mystic-900/80 border border-mystic-gold/30 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-mystic-goldLight uppercase tracking-wider">
                <span>{language === 'vi' ? 'Cán Cân 4 Nguyên Tố & Ẩn Chính' : '4 Elements & Major Arcana Balance'}</span>
                <span className="text-[11px] text-slate-400">
                  {majorCount} {language === 'vi' ? 'Ẩn Chính' : 'Major'} | {totalCards - majorCount} {language === 'vi' ? 'Ẩn Phụ' : 'Minor'}
                </span>
              </div>

              {/* Progress Distribution */}
              <div className="grid grid-cols-5 gap-2 text-center">
                <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30">
                  <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-amber-300">{fireCount}</div>
                  <div className="text-[9px] text-slate-400">{language === 'vi' ? 'Lửa (Gậy)' : 'Fire'}</div>
                </div>

                <div className="p-2 rounded-xl bg-blue-950/40 border border-blue-500/30">
                  <Droplets className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-blue-300">{waterCount}</div>
                  <div className="text-[9px] text-slate-400">{language === 'vi' ? 'Nước (Cốc)' : 'Water'}</div>
                </div>

                <div className="p-2 rounded-xl bg-teal-950/40 border border-teal-500/30">
                  <Wind className="w-4 h-4 text-teal-400 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-teal-300">{airCount}</div>
                  <div className="text-[9px] text-slate-400">{language === 'vi' ? 'Khí (Kiếm)' : 'Air'}</div>
                </div>

                <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                  <Mountain className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-emerald-300">{earthCount}</div>
                  <div className="text-[9px] text-slate-400">{language === 'vi' ? 'Đất (Tiền)' : 'Earth'}</div>
                </div>

                <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30">
                  <Crown className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-purple-300">{majorCount}</div>
                  <div className="text-[9px] text-slate-400">{language === 'vi' ? 'Ẩn Chính' : 'Major'}</div>
                </div>
              </div>
            </div>

            {/* Individual Cards Breakdown */}
            <div className="space-y-3">
              {assembledContext.card_interpretations.map((card, idx) => {
                const matchedDrawn = drawnCards.find((c) => c.card_id === card.card_id) || drawnCards[idx];
                return (
                  <div
                    key={card.card_id + idx}
                    onClick={() => matchedDrawn && onSelectCardDetail(matchedDrawn)}
                    className="p-3.5 rounded-2xl bg-mystic-900/60 border border-white/10 hover:border-mystic-gold/50 hover:bg-mystic-800/40 transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-mystic-gold uppercase tracking-wider">
                        {card.position_name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-mystic-950/80 border border-mystic-gold/20 text-slate-300">
                        {card.orientation === 'upright'
                          ? language === 'vi'
                            ? 'Thuận'
                            : 'Upright'
                          : language === 'vi'
                          ? 'Ngược'
                          : 'Reversed'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-slate-100 group-hover:text-mystic-goldLight transition">
                          {card.card_name}
                        </h4>
                        <p className="text-xs text-slate-300 mt-1 italic">
                          "{card.position_interpretation}"
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-mystic-gold shrink-0 mt-1 ml-2 transition" />
                    </div>

                    {card.practical && (
                      <div className="mt-2 pt-2 border-t border-white/5 text-xs text-slate-400">
                        💡 <strong>{t.readingPanel.adviceLabel}:</strong> {card.practical}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-3 sm:p-3.5 border-t border-mystic-gold/20 bg-mystic-900/90 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {onDrawOracleBlessing && !oracleBlessing && (
            <button
              onClick={onDrawOracleBlessing}
              className="px-3 py-1.5 rounded-xl bg-mystic-800 hover:bg-mystic-700 text-mystic-goldLight text-xs font-semibold border border-mystic-gold/30 transition flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-mystic-gold" />
              <span>{language === 'vi' ? 'Rút Lá Oracle Chữa Lành' : 'Oracle Blessing'}</span>
            </button>
          )}

          {onOpenCordCutting && (
            <button
              onClick={onOpenCordCutting}
              className="px-3 py-1.5 rounded-xl bg-mystic-950 hover:bg-mystic-900 text-rose-300 text-xs font-medium border border-rose-500/30 transition flex items-center space-x-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-rose-400" />
              <span>{language === 'vi' ? 'Cắt Năng Lượng / Đóng Phiên' : 'Cord Cutting'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
