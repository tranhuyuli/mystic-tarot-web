import React, { useState, useEffect, useRef } from 'react';
import { TarotCanvas } from './components/TarotCanvas';
import { Header } from './components/Header';
import { IntentionModal } from './components/IntentionModal';
import { SpreadPickerModal } from './components/SpreadPickerModal';
import { CardDetailModal } from './components/CardDetailModal';
import { ReadingPanel } from './components/ReadingPanel';
import { CleansingRitualModal } from './components/CleansingRitualModal';
import { CordCuttingModal } from './components/CordCuttingModal';
import { DrawnCard, QuestionType, SpreadData, AssembledContext } from './types/tarot';
import {
  RAW_CARDS,
  getLocalizedCards,
  getLocalizedSpreads,
  shuffleDeck,
  assembleReadingContext,
} from './engine/ragEngine';
import { synthesizeReadingStream } from './services/llmService';
import { sound } from './utils/audio';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Sparkles, RotateCw, Eye, BookOpen, Flame, Bell } from 'lucide-react';

const TarotAppContent: React.FC = () => {
  const { language, t } = useLanguage();

  // State
  const [spreadId, setSpreadId] = useState<string>('past-present-future');
  const [question, setQuestion] = useState<string>('');
  const [questionType, setQuestionType] = useState<QuestionType>('general');
  const [allowReversals, setAllowReversals] = useState<boolean>(true);

  const [deck, setDeck] = useState<{ card_id: string; orientation: 'upright' | 'reversed' }[]>([]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);

  const [assembledContext, setAssembledContext] = useState<AssembledContext | null>(null);
  const [readingStreamText, setReadingStreamText] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [oracleBlessing, setOracleBlessing] = useState<{ card_name: string; message: string; image: string } | null>(null);
  const [undercurrentCard, setUndercurrentCard] = useState<DrawnCard | null>(null);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);

  // Ritual Modals (All closed by default so user sees 3D space first)
  const [isCleansingOpen, setIsCleansingOpen] = useState<boolean>(false);
  const [isIntentionModalOpen, setIsIntentionModalOpen] = useState<boolean>(false);
  const [isCutDeckOpen, setIsCutDeckOpen] = useState<boolean>(false);
  const [isCordCuttingOpen, setIsCordCuttingOpen] = useState<boolean>(false);

  // UI Modals
  const [isSpreadPickerOpen, setIsSpreadPickerOpen] = useState<boolean>(false);
  const [isReadingPanelOpen, setIsReadingPanelOpen] = useState<boolean>(false);
  const [selectedCardForDetail, setSelectedCardForDetail] = useState<DrawnCard | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const spreads = getLocalizedSpreads(language);
  const cards = getLocalizedCards(language);
  const currentSpread: SpreadData = spreads[spreadId] || spreads['past-present-future'];

  // Initialize deck on mount
  useEffect(() => {
    resetDeck();
  }, [allowReversals]);

  // When language switches, update card_name & position_name in drawnCards
  useEffect(() => {
    setDrawnCards((prev) =>
      prev.map((c) => {
        const localizedCard = cards[c.card_id];
        const localizedPos = currentSpread.positions[c.position_index - 1];
        return {
          ...c,
          card_name: localizedCard?.card_name || c.card_name,
          position_name: localizedPos?.name || c.position_name,
          position_description: localizedPos?.detailed_description || localizedPos?.short_description || c.position_description,
          cardData: localizedCard || c.cardData,
        };
      })
    );

    if (assembledContext) {
      const updatedCtx = assembleReadingContext(spreadId, question, questionType, drawnCards, language);
      setAssembledContext(updatedCtx);
    }
  }, [language]);

  const resetDeck = () => {
    const shuffled = shuffleDeck(allowReversals);
    setDeck(shuffled);
    setDrawnCards([]);
    setAssembledContext(null);
    setReadingStreamText('');
    setOracleBlessing(null);
    setUndercurrentCard(null);
    setIsStreaming(false);
    setIsSessionActive(false);
  };

  // Start fresh reading from intention modal -> opens Cut Deck ritual!
  const handleStartReading = (
    newQuestion: string,
    newType: QuestionType,
    newSpreadId: string,
    newReversals: boolean
  ) => {
    setQuestion(newQuestion);
    setQuestionType(newType);
    setSpreadId(newSpreadId);
    setAllowReversals(newReversals);

    const shuffled = shuffleDeck(newReversals);
    setDeck(shuffled);
    setDrawnCards([]);
    setAssembledContext(null);
    setReadingStreamText('');
    setOracleBlessing(null);
    setIsSessionActive(true);

    // Open Step 3: Cut Deck Ritual
    setIsCutDeckOpen(true);
  };

  // Draw 1 next card from deck into current spread
  const handleDrawNextCard = () => {
    if (drawnCards.length >= currentSpread.card_count) return;
    if (deck.length === 0) return;

    setIsSessionActive(true);
    const nextIndex = drawnCards.length;
    const cardItem = deck[nextIndex];
    const cardData = cards[cardItem.card_id];
    const posDef = currentSpread.positions[nextIndex] || {
      name: `Vị trí ${nextIndex + 1}`,
      rag_mapping: '',
      short_description: `Vị trí thứ ${nextIndex + 1}`,
    };

    const newDrawn: DrawnCard = {
      card_id: cardItem.card_id,
      card_name: cardData.card_name,
      cardData: cardData,
      position_index: nextIndex + 1,
      position_name: posDef.name,
      position_description: posDef.detailed_description || posDef.short_description || '',
      orientation: cardItem.orientation,
      isFlipped: false,
    };

    const updatedDrawn = [...drawnCards, newDrawn];
    setDrawnCards(updatedDrawn);
  };

  // Draw all remaining cards automatically
  const handleQuickDrawAll = () => {
    const needed = currentSpread.card_count - drawnCards.length;
    if (needed <= 0) return;

    setIsSessionActive(true);
    sound.playShuffle();
    const newCards: DrawnCard[] = [];
    for (let i = drawnCards.length; i < currentSpread.card_count; i++) {
      const cardItem = deck[i];
      if (!cardItem) break;
      const cardData = cards[cardItem.card_id];
      const posDef = currentSpread.positions[i] || {
        name: `Vị trí ${i + 1}`,
        rag_mapping: '',
        short_description: `Vị trí thứ ${i + 1}`,
      };

      newCards.push({
        card_id: cardItem.card_id,
        card_name: cardData.card_name,
        cardData: cardData,
        position_index: i + 1,
        position_name: posDef.name,
        position_description: posDef.detailed_description || posDef.short_description || '',
        orientation: cardItem.orientation,
        isFlipped: false,
      });
    }

    setDrawnCards([...drawnCards, ...newCards]);
  };

  // Flip individual card
  const handleCardClick = (cardIndex: number) => {
    if (cardIndex < 0 || cardIndex >= drawnCards.length) return;

    setDrawnCards((prev) => {
      const next = [...prev];
      next[cardIndex] = {
        ...next[cardIndex],
        isFlipped: !next[cardIndex].isFlipped,
      };
      return next;
    });
  };

  // Flip all cards at once
  const handleFlipAll = () => {
    sound.playCardFlip();
    setDrawnCards((prev) =>
      prev.map((c) => ({
        ...c,
        isFlipped: true,
      }))
    );
  };

  // Check if all cards for the spread are drawn and flipped -> Trigger AI synthesis!
  const allCardsDrawn = drawnCards.length === currentSpread.card_count && currentSpread.card_count > 0;
  const allCardsFlipped = allCardsDrawn && drawnCards.every((c) => c.isFlipped);

  useEffect(() => {
    if (allCardsFlipped && !assembledContext && !isStreaming) {
      // Assemble context with Layer 1 RAG Engine in the selected language + Undercurrent Card
      const ctx = assembleReadingContext(spreadId, question, questionType, drawnCards, language, undercurrentCard);
      setAssembledContext(ctx);
      sound.playWisdomChime();

      // Trigger Layer 2 LLM Synthesis Streaming automatically
      startSynthesis(ctx);
      setIsReadingPanelOpen(true);
    }
  }, [allCardsFlipped, assembledContext, isStreaming, spreadId, question, questionType, drawnCards, language, undercurrentCard]);

  const startSynthesis = async (ctx: AssembledContext) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsStreaming(true);
    setReadingStreamText('');

    await synthesizeReadingStream(
      ctx,
      language,
      (chunk) => {
        setReadingStreamText((prev) => prev + chunk);
      },
      () => {
        setIsStreaming(false);
      },
      (error) => {
        setIsStreaming(false);
        setReadingStreamText((prev) => prev + `\n\n⚠️ **Notice:** ${error}`);
      },
      abortControllerRef.current.signal
    );
  };

  // Step 5: Draw Oracle Blessing Card
  const handleDrawOracleBlessing = () => {
    sound.playWisdomChime();
    const remainingCards = deck.slice(currentSpread.card_count);
    const chosen = remainingCards[0] || deck[0];
    const cardData = cards[chosen.card_id];

    const message =
      language === 'vi'
        ? `Lá bài ${cardData.card_name} mang đến thông điệp chữa lành: "${cardData.core_meanings.upright.essence}". Hãy tin tưởng vào hành trình của bạn!`
        : `The card ${cardData.card_name} brings a divine blessing: "${cardData.core_meanings.upright.essence}". Trust your authentic journey!`;

    setOracleBlessing({
      card_name: cardData.card_name,
      message,
      image: cardData.image,
    });
  };

  const handleToggleMute = () => {
    sound.isMuted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-mystic-950">
      {/* 1. Header Bar */}
      <Header
        spreadName={currentSpread.name}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenSpreadPicker={() => setIsSpreadPickerOpen(true)}
        onOpenIntentionModal={() => setIsCleansingOpen(true)}
        onResetReading={resetDeck}
        onOpenReadingPanel={() => setIsReadingPanelOpen(true)}
        hasReading={assembledContext !== null}
      />

      {/* 2. 3D Tarot Table Canvas */}
      <TarotCanvas
        drawnCards={drawnCards}
        spread={currentSpread}
        onCardClick={handleCardClick}
        onDrawNextCard={handleDrawNextCard}
        isReadingFinished={allCardsFlipped}
        deckRemainingCount={deck.length - drawnCards.length}
        isCuttingDeck={isCutDeckOpen}
        cutPreviewCards={[0, 1, 2].map((idx) => {
          const deckIdx = idx === 0 ? 0 : idx === 1 ? Math.floor(deck.length / 2) : Math.max(0, deck.length - 1);
          const item = deck[deckIdx] || { card_id: 'the_fool', orientation: 'upright' as const };
          const cData = cards[item.card_id] || cards['the_fool'];
          return {
            card_id: item.card_id,
            card_name: cData?.card_name || 'Tarot Card',
            cardData: cData,
            position_index: 0,
            position_name: language === 'vi' ? 'Năng Lượng Dẫn Đường' : 'Undercurrent Theme',
            position_description: language === 'vi' ? 'Dòng chảy tiềm thức bao trùm' : 'Overarching subconscious theme',
            orientation: item.orientation,
            isFlipped: true,
          };
        })}
        onCutDeckComplete={(stackIdx, revealedCard) => {
          setIsCutDeckOpen(false);
          if (revealedCard) {
            setUndercurrentCard(revealedCard);
          }
        }}
      />

      {/* Mobile Top Begin Reading Button */}
      {!isSessionActive && drawnCards.length === 0 && (
        <div className="sm:hidden absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-auto w-[88%] max-w-xs animate-fade-in">
          <button
            onClick={() => setIsCleansingOpen(true)}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-mystic-goldDark via-mystic-gold to-mystic-goldLight text-mystic-950 font-bold text-xs tracking-wide shadow-mystic-glow hover:brightness-110 active:scale-98 transition flex items-center justify-center space-x-2 animate-pulse border border-mystic-goldLight/40"
          >
            <Sparkles className="w-4 h-4 flex-shrink-0 text-mystic-950" />
            <span>{language === 'vi' ? 'Bắt Đầu Trải Bài' : 'Begin Reading'}</span>
          </button>
        </div>
      )}

      {/* Next Position Floating Indicator */}
      {isSessionActive && !allCardsDrawn && !isCutDeckOpen && (
        <div className="absolute bottom-20 sm:bottom-22 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce-slow">
          <div className="px-4 py-1.5 rounded-full glass-panel-gold border border-mystic-gold/40 text-[11px] sm:text-xs text-mystic-goldLight shadow-mystic-glow flex items-center space-x-1.5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-mystic-gold animate-spin-slow" />
            <span>
              {language === 'vi'
                ? `Vị trí tiếp theo: ${currentSpread.positions[drawnCards.length]?.name || `Lá ${drawnCards.length + 1}`}`
                : `Next position: ${currentSpread.positions[drawnCards.length]?.name || `Card ${drawnCards.length + 1}`}`}
            </span>
          </div>
        </div>
      )}

      {/* 3. Floating Interactive Bottom Action Bar */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 pointer-events-auto max-w-[98vw] px-1">
        {!isSessionActive && drawnCards.length === 0 ? (
          <button
            onClick={() => setIsCleansingOpen(true)}
            className="hidden sm:flex px-5 py-3 sm:px-7 sm:py-3.5 rounded-2xl bg-gradient-to-r from-mystic-goldDark via-mystic-gold to-mystic-goldLight text-mystic-950 font-bold text-xs sm:text-sm tracking-wide shadow-mystic-glow hover:brightness-110 active:scale-98 transition items-center space-x-2 animate-pulse"
          >
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>{language === 'vi' ? 'Bắt Đầu Trải Bài' : 'Begin Reading'}</span>
          </button>
        ) : (
          <>
            {/* Quick Cleansing Button */}
            <button
              onClick={() => setIsCleansingOpen(true)}
              className="p-2.5 sm:p-3 rounded-2xl glass-panel border border-white/10 hover:border-amber-400/40 text-amber-300 hover:text-amber-200 transition flex-shrink-0"
              title={language === 'vi' ? 'Thanh tẩy & Định tâm' : 'Sacred Cleansing'}
            >
              <Flame className="w-4 h-4 animate-pulse" />
            </button>

            {!allCardsDrawn && (
              <>
                <button
                  onClick={handleDrawNextCard}
                  className="px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-gradient-to-r from-mystic-goldDark via-mystic-gold to-mystic-goldLight text-mystic-950 font-bold text-xs sm:text-sm shadow-mystic-glow hover:brightness-110 transition flex items-center space-x-1.5 sm:space-x-2"
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">
                    {drawnCards.length === 0
                      ? (language === 'vi' ? `Rút Lá Đầu Tiên (1/${currentSpread.card_count})` : `Draw 1st Card (1/${currentSpread.card_count})`)
                      : `${t.actions.drawNext} (${drawnCards.length + 1}/${currentSpread.card_count})`}
                  </span>
                </button>

                <button
                  onClick={handleQuickDrawAll}
                  className="px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl glass-panel border border-white/10 hover:border-mystic-gold/40 text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition flex-shrink-0"
                >
                  {t.actions.drawAll}
                </button>
              </>
            )}
          </>
        )}

        {allCardsDrawn && !allCardsFlipped && (
          <button
            onClick={handleFlipAll}
            className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl bg-gradient-to-r from-mystic-500 to-mystic-600 text-white font-bold text-xs sm:text-sm shadow-mystic-purple hover:brightness-110 transition flex items-center space-x-2 animate-pulse"
          >
            <Eye className="w-4 h-4 flex-shrink-0" />
            <span>{t.actions.flipAll}</span>
          </button>
        )}

        {allCardsFlipped && (
          <button
            onClick={() => setIsReadingPanelOpen(true)}
            className="px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl glass-panel-gold border border-mystic-gold text-mystic-goldLight font-bold text-xs sm:text-sm shadow-mystic-glow hover:bg-mystic-gold/20 transition flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4 text-mystic-gold flex-shrink-0" />
            <span>{t.actions.viewReading}</span>
          </button>
        )}

        {/* Cord Cutting Ritual Button */}
        {allCardsFlipped && (
          <button
            onClick={() => setIsCordCuttingOpen(true)}
            className="p-2.5 sm:p-3 rounded-2xl glass-panel border border-rose-500/30 hover:border-rose-400 text-rose-300 hover:text-rose-200 transition flex-shrink-0"
            title={language === 'vi' ? 'Cắt Dây Năng Lượng / Đóng Phiên' : 'Cord Cutting Ritual'}
          >
            <Bell className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={resetDeck}
          className="p-2.5 sm:p-3 rounded-2xl glass-panel border border-white/10 hover:border-mystic-gold/40 text-slate-300 hover:text-white transition flex-shrink-0"
          title={t.actions.shuffleDeck}
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* 4. Ritual Modals */}
      <CleansingRitualModal
        isOpen={isCleansingOpen}
        onClose={() => setIsCleansingOpen(false)}
        onComplete={() => {
          setIsCleansingOpen(false);
          setIsIntentionModalOpen(true);
        }}
      />

      <IntentionModal
        isOpen={isIntentionModalOpen}
        onClose={() => setIsIntentionModalOpen(false)}
        onStartReading={handleStartReading}
        currentSpreadId={spreadId}
        onOpenCleansing={() => {
          setIsIntentionModalOpen(false);
          setIsCleansingOpen(true);
        }}
      />

      <CordCuttingModal
        isOpen={isCordCuttingOpen}
        onClose={() => setIsCordCuttingOpen(false)}
        onResetSession={() => {
          resetDeck();
          setIsIntentionModalOpen(true);
        }}
      />

      {/* 5. UI Modals & Drawers */}
      <SpreadPickerModal
        isOpen={isSpreadPickerOpen}
        onClose={() => setIsSpreadPickerOpen(false)}
        selectedSpreadId={spreadId}
        onSelectSpread={(newId) => {
          setSpreadId(newId);
          resetDeck();
        }}
      />

      <CardDetailModal
        card={selectedCardForDetail}
        onClose={() => setSelectedCardForDetail(null)}
      />

      <ReadingPanel
        isOpen={isReadingPanelOpen}
        onClose={() => setIsReadingPanelOpen(false)}
        assembledContext={assembledContext}
        readingStreamText={readingStreamText}
        isStreaming={isStreaming}
        onSelectCardDetail={(card) => setSelectedCardForDetail(card)}
        drawnCards={drawnCards}
        onOpenCordCutting={() => setIsCordCuttingOpen(true)}
        onDrawOracleBlessing={handleDrawOracleBlessing}
        oracleBlessing={oracleBlessing}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <TarotAppContent />
    </LanguageProvider>
  );
};

export default App;
