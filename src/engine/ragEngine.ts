import tarotKB from '../data/tarotKnowledgeBase.json';
import {
  CardData,
  SpreadData,
  DrawnCard,
  Orientation,
  QuestionType,
  AssembledContext,
  AssembledCardContext,
} from '../types/tarot';
import { Language } from '../i18n/translations';
import { VIETNAMESE_CARD_NAMES, VIETNAMESE_SPREAD_INFO, getVietnameseCardName } from '../utils/vietnameseTarot';

const rawData = tarotKB as {
  spreads: any[];
  layouts: Record<string, any>;
  cards: Record<string, any>;
};

// Base raw data
export const RAW_CARDS: Record<string, CardData> = rawData.cards;

// Get cards dictionary localized by language
export function getLocalizedCards(lang: Language = 'vi'): Record<string, CardData> {
  const result: Record<string, CardData> = {};
  Object.entries(RAW_CARDS).forEach(([cardId, cardData]) => {
    const cardName = lang === 'vi' ? getVietnameseCardName(cardId, cardData.card_name) : cardData.card_name;
    result[cardId] = {
      ...cardData,
      card_name: cardName,
    };
  });
  return result;
}

// Get spreads dictionary localized by language
export function getLocalizedSpreads(lang: Language = 'vi'): Record<string, SpreadData> {
  const result: Record<string, SpreadData> = {};

  if (Array.isArray(rawData.spreads)) {
    rawData.spreads.forEach((s: any) => {
      const layout = rawData.layouts?.[s.layout];
      const viSpread = VIETNAMESE_SPREAD_INFO[s.id];

      const spreadName = lang === 'vi' ? (viSpread?.name || s.name) : s.name;
      const spreadDesc = lang === 'vi' ? (viSpread?.description || s.description) : s.description;

      const positionsWithCoords = s.positions.map((pos: any, pIdx: number) => {
        const layoutPos = layout?.positions?.[pIdx];
        const viPosDesc = viSpread?.positions?.[pos.name];

        const posName = lang === 'vi'
          ? (viPosDesc ? viPosDesc.split(':')[0] : pos.name)
          : pos.name;

        const posDetailedDesc = lang === 'vi'
          ? (viPosDesc || pos.detailed_description || pos.short_description)
          : (pos.detailed_description || pos.short_description);

        return {
          ...pos,
          name: posName,
          detailed_description: posDetailedDesc,
          short_description: posDetailedDesc,
          x: layoutPos?.x ?? (50 + (pIdx - (s.positions.length - 1) / 2) * 18),
          y: layoutPos?.y ?? 35,
          rotation: layoutPos?.rotation ?? 0,
        };
      });

      result[s.id] = {
        name: spreadName,
        description: spreadDesc,
        card_count: s.positions?.length || 1,
        layout_id: s.layout,
        positions: positionsWithCoords,
        categories: s.category ? [s.category] : [],
        difficulty: s.difficulty,
      };
    });
  }

  return result;
}

// Default export collections for initial state
export const ALL_CARDS: Record<string, CardData> = getLocalizedCards('vi');
export const ALL_SPREADS: Record<string, SpreadData> = getLocalizedSpreads('vi');

// Helper to look up deep RAG path in card JSON
export function getCardInterpretationByRag(
  card: CardData,
  ragMapping: string,
  orientation: Orientation
): { interpretation: string; keywords: string[] } {
  if (!ragMapping || !card.position_interpretations) {
    const core = card.core_meanings[orientation];
    return {
      interpretation: core?.essence || '',
      keywords: core?.keywords || []
    };
  }

  // Parse rag_mapping e.g., "temporal_positions.past" or "situational_positions.challenge"
  const parts = ragMapping.split('.');
  const category = parts[0] as keyof typeof card.position_interpretations;
  const positionKey = parts[1];

  const categoryObj = card.position_interpretations[category] as Record<string, any> | undefined;
  if (categoryObj && categoryObj[positionKey]) {
    const posData = categoryObj[positionKey];
    return {
      interpretation: posData[orientation] || posData.upright || '',
      keywords: posData.keywords || []
    };
  }

  // Fallback to core essence
  const core = card.core_meanings[orientation];
  return {
    interpretation: core?.essence || '',
    keywords: core?.keywords || []
  };
}

// Fisher-Yates shuffle with random orientations
export function shuffleDeck(allowReversals: boolean = true): { card_id: string; orientation: Orientation }[] {
  const cardIds = Object.keys(RAW_CARDS);
  const deck = cardIds.map(id => ({
    card_id: id,
    orientation: (allowReversals && Math.random() < 0.3) ? ('reversed' as Orientation) : ('upright' as Orientation)
  }));

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

// Layer 1: Deterministic Context Assembler (Arcanite RAG Logic)
export function assembleReadingContext(
  spreadId: string,
  question: string,
  questionType: QuestionType,
  drawnCards: DrawnCard[],
  lang: Language = 'vi',
  undercurrentCard?: DrawnCard | null
): AssembledContext {
  const spreads = getLocalizedSpreads(lang);
  const spread = spreads[spreadId] || {
    name: 'Tarot Spread',
    description: '',
    card_count: drawnCards.length,
    positions: []
  };

  const cardInterpretations: AssembledCardContext[] = drawnCards.map((drawn, idx) => {
    const card = drawn.cardData;
    const position = spread.positions[idx] || {
      name: drawn.position_name,
      rag_mapping: '',
      short_description: drawn.position_description,
      detailed_description: drawn.position_description
    };

    const interp = getCardInterpretationByRag(card, position.rag_mapping, drawn.orientation);
    const core = card.core_meanings[drawn.orientation] || card.core_meanings.upright;

    // Get question context if relevant
    let questionContextText = '';
    let questionKeywords: string[] = [];
    if (questionType && questionType !== 'general' && card.question_context?.[questionType]) {
      const qData = card.question_context[questionType][drawn.orientation] || card.question_context[questionType].upright;
      if (qData) {
        questionContextText = qData.interpretation;
        questionKeywords = qData.keywords || [];
      }
    }

    const affirmations = card.affirmations?.[drawn.orientation] || card.affirmations?.upright || [];
    const affirmation = affirmations.length > 0 ? affirmations[0] : undefined;

    return {
      card_id: card.card_id,
      card_name: card.card_name,
      position_index: idx + 1,
      position_name: position.name,
      position_description: position.detailed_description || position.short_description || '',
      orientation: drawn.orientation,
      position_interpretation: interp.interpretation,
      position_keywords: interp.keywords,
      question_context: questionContextText,
      question_keywords: questionKeywords,
      core_essence: core.essence,
      archetype: card.archetype,
      psychological: core.psychological,
      spiritual: core.spiritual,
      practical: core.practical,
      shadow: core.shadow,
      element: card.elemental_correspondences?.element,
      zodiac: card.elemental_correspondences?.zodiac,
      affirmation
    };
  });

  let undercurrentContext: AssembledCardContext | undefined = undefined;
  if (undercurrentCard) {
    const uCard = undercurrentCard.cardData;
    const uCore = uCard.core_meanings[undercurrentCard.orientation] || uCard.core_meanings.upright;
    undercurrentContext = {
      card_id: uCard.card_id,
      card_name: uCard.card_name,
      position_index: 0,
      position_name: lang === 'vi' ? 'Lá Năng Lượng Chủ Đạo (Undercurrent Theme)' : 'Undercurrent Theme Card',
      position_description: lang === 'vi' ? 'Dòng chảy năng lượng tiềm thức bao trùm' : 'Overarching subconscious theme',
      orientation: undercurrentCard.orientation,
      position_interpretation: uCore.essence,
      position_keywords: uCore.keywords,
      core_essence: uCore.essence,
      archetype: uCard.archetype,
      psychological: uCore.psychological,
      spiritual: uCore.spiritual,
      practical: uCore.practical,
      shadow: uCore.shadow,
      element: uCard.elemental_correspondences?.element,
      zodiac: uCard.elemental_correspondences?.zodiac,
    };
  }

  return {
    spread_id: spreadId,
    spread_name: spread.name,
    question,
    question_type: questionType,
    card_interpretations: cardInterpretations,
    undercurrent_card: undercurrentContext
  };
}

// Generate Offline Deterministic Reading Markdown (Fallback without LLM)
export function generateDeterministicReading(context: AssembledContext, lang: Language = 'vi'): string {
  if (lang === 'en') {
    let md = `## 🔮 Intuitive Reading (Deterministic Interpretation)\n\n`;
    md += `**Spread:** ${context.spread_name}\n`;
    if (context.question) {
      md += `**Intention & Question:** "${context.question}"\n`;
    }
    md += `**Focus Area:** ${context.question_type.toUpperCase()}\n\n`;
    md += `---\n\n`;

    context.card_interpretations.forEach((c) => {
      const orientationLabel = c.orientation === 'upright' ? 'Upright' : 'Reversed';
      md += `### Position ${c.position_index}: ${c.position_name} — **${c.card_name}** *(${orientationLabel})*\n\n`;
      md += `> **Position Meaning:** ${c.position_description}\n\n`;
      md += `**Core Essence:** ${c.core_essence}\n\n`;
      md += `**Position Interpretation:**\n${c.position_interpretation}\n\n`;

      if (c.question_context) {
        md += `**${context.question_type} Context:** ${c.question_context}\n\n`;
      }

      if (c.practical) {
        md += `💡 **Practical Guidance:** ${c.practical}\n\n`;
      }

      if (c.affirmation) {
        md += `✨ **Affirmation:** *"${c.affirmation}"*\n\n`;
      }

      md += `---\n\n`;
    });

    md += `### 🌿 Closing Cosmic Wisdom\n\n`;
    md += `The cards mirror the currents of your present energy. Trust your inner knowing, let empowering insights guide your next steps, and welcome growth through life's transformations.`;
    return md;
  }

  // Vietnamese
  let md = `## 🔮 Luận Giải Trực Quan (Deterministic Interpretation)\n\n`;
  md += `**Trải bài:** ${context.spread_name}\n`;
  if (context.question) {
    md += `**Ý niệm & Câu hỏi:** "${context.question}"\n`;
  }
  md += `**Lĩnh vực:** ${context.question_type.toUpperCase()}\n\n`;
  md += `---\n\n`;

  context.card_interpretations.forEach((c) => {
    const orientationLabel = c.orientation === 'upright' ? 'Thuận (Upright)' : 'Ngược (Reversed)';
    md += `### Vị trí ${c.position_index}: ${c.position_name} — **${c.card_name}** *(${orientationLabel})*\n\n`;
    md += `> **Ý nghĩa vị trí:** ${c.position_description}\n\n`;
    md += `**Bản chất lá bài:** ${c.core_essence}\n\n`;
    md += `**Luận giải cho vị trí này:**\n${c.position_interpretation}\n\n`;

    if (c.question_context) {
      md += `**Góc nhìn ${context.question_type}:** ${c.question_context}\n\n`;
    }

    if (c.practical) {
      md += `💡 **Lời khuyên thực tế:** ${c.practical}\n\n`;
    }

    if (c.affirmation) {
      md += `✨ **Khẳng định tích cực (Affirmation):** *"${c.affirmation}"*\n\n`;
    }

    md += `---\n\n`;
  });

  md += `### 🌿 Lời Kết & Thông Điệp Tổng Thể\n\n`;
  md += `Các lá bài phản ánh dòng chảy năng lượng hiện tại của bạn. Hãy lắng nghe trực giác của chính mình, lấy những thông điệp tích cực làm kim chỉ nam và đón nhận thử thách như những bước chuyển hóa của hành trình phát triển cá nhân.`;

  return md;
}
