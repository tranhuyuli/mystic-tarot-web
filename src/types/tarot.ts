export type Suit = 'major_arcana' | 'cups' | 'pentacles' | 'swords' | 'wands';

export type Orientation = 'upright' | 'reversed';

export type QuestionType = 'general' | 'love' | 'career' | 'spiritual' | 'decision';

export interface CardCoreMeanings {
  essence: string;
  keywords: string[];
  psychological?: string;
  spiritual?: string;
  practical?: string;
  shadow?: string;
}

export interface PositionInterpretationItem {
  upright: string;
  reversed: string;
  keywords?: string[];
}

export interface CardData {
  card_id: string;
  card_name: string;
  card_number: number;
  suit: Suit;
  archetype?: string;
  image: string;
  core_meanings: {
    upright: CardCoreMeanings;
    reversed: CardCoreMeanings;
  };
  position_interpretations?: {
    temporal_positions?: Record<string, PositionInterpretationItem>;
    situational_positions?: Record<string, PositionInterpretationItem>;
    relational_positions?: Record<string, PositionInterpretationItem>;
    decision_positions?: Record<string, PositionInterpretationItem>;
    spiritual_positions?: Record<string, PositionInterpretationItem>;
    action_positions?: Record<string, PositionInterpretationItem>;
  };
  question_context?: Record<string, {
    upright?: { interpretation: string; keywords: string[] };
    reversed?: { interpretation: string; keywords: string[] };
  }>;
  elemental_correspondences?: {
    element?: string;
    zodiac?: string;
    planet?: string;
  };
  symbols?: Record<string, string>;
  affirmations?: {
    upright?: string[];
    reversed?: string[];
  };
}

export interface SpreadPosition {
  name: string;
  short_description?: string;
  detailed_description?: string;
  rag_mapping: string;
  x?: number;
  y?: number;
  rotation?: number;
}

export interface SpreadData {
  name: string;
  description: string;
  card_count: number;
  layout_id?: string;
  positions: SpreadPosition[];
  categories?: string[];
  difficulty?: string;
}

export interface DrawnCard {
  card_id: string;
  card_name: string;
  cardData: CardData;
  position_index: number;
  position_name: string;
  position_description: string;
  orientation: Orientation;
  isFlipped: boolean;
}

export interface AssembledCardContext {
  card_id: string;
  card_name: string;
  position_index: number;
  position_name: string;
  position_description: string;
  orientation: Orientation;
  position_interpretation: string;
  position_keywords: string[];
  question_context?: string;
  question_keywords?: string[];
  core_essence: string;
  archetype?: string;
  psychological?: string;
  spiritual?: string;
  practical?: string;
  shadow?: string;
  element?: string;
  zodiac?: string;
  affirmation?: string;
}

export interface AssembledContext {
  spread_id: string;
  spread_name: string;
  question: string;
  question_type: QuestionType;
  card_interpretations: AssembledCardContext[];
  undercurrent_card?: AssembledCardContext;
}

export interface LLMConfig {
  baseURL: string;
  apiKey: string;
  model: string;
  temperature: number;
}
