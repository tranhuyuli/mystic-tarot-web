export type Language = 'vi' | 'en';

export interface TranslationSchema {
  header: {
    title: string;
    subtitle: string;
    spreadLabel: string;
    viewReading: string;
    newReading: string;
    muteSound: string;
    unmuteSound: string;
    langToggle: string;
  };
  intention: {
    modalTitle: string;
    modalSubtitle: string;
    questionLabel: string;
    questionPlaceholder: string;
    focusLabel: string;
    selectedSpread: string;
    allowReversals: string;
    laterBtn: string;
    startBtn: string;
  };
  categories: {
    general: { label: string; desc: string };
    love: { label: string; desc: string };
    career: { label: string; desc: string };
    spiritual: { label: string; desc: string };
    decision: { label: string; desc: string };
  };
  actions: {
    drawNext: string;
    drawAll: string;
    flipAll: string;
    viewReading: string;
    shuffleDeck: string;
    tapDeckHelper: string;
  };
  readingPanel: {
    headerSub: string;
    intentionLabel: string;
    tabAi: string;
    tabRag: string;
    aiGenerating: string;
    copyBtn: string;
    copiedBtn: string;
    closeBtn: string;
    reGenerate: string;
    exportPdf: string;
    adviceLabel: string;
  };
  cardDetail: {
    reversedBadge: string;
    archetype: string;
    positionInSpread: string;
    essence: string;
    keywords: string;
    psychological: string;
    practical: string;
    shadow: string;
  };
  spreadPicker: {
    title: string;
    subtitle: string;
    cardsCount: string;
    closeBtn: string;
    morePositions: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationSchema> = {
  vi: {
    header: {
      title: 'TÂM AN TAROT',
      subtitle: 'Trực Giác & Chữa Lành Tâm Hồn',
      spreadLabel: 'Trải bài',
      viewReading: 'Xem Luận Giải',
      newReading: 'Trải bài mới',
      muteSound: 'Tắt âm thanh',
      unmuteSound: 'Bật âm thanh',
      langToggle: 'Tiếng Việt',
    },
    intention: {
      modalTitle: 'Bước 2: Khai thác bối cảnh & Xác định câu hỏi',
      modalSubtitle: 'Tạo kết nối an toàn, cởi mở. Hãy chia sẻ câu hỏi hoặc vấn đề bạn đang tìm kiếm câu trả lời để bộ bài soi sáng.',
      questionLabel: 'Câu hỏi hoặc Tâm niệm của bạn',
      questionPlaceholder: 'Ví dụ: Định hướng sự nghiệp sắp tới của tôi ra sao? / Tôi nên làm gì để thấu hiểu mối quan hệ này?...',
      focusLabel: 'Lĩnh vực trọng tâm',
      selectedSpread: 'Kiểu trải bài đã chọn',
      allowReversals: 'Cho phép xuất hiện lá bài ngược (Reversed Cards)',
      laterBtn: 'Để sau',
      startBtn: 'Bắt Đầu Trải Bài',
    },
    categories: {
      general: { label: 'Tổng Quan', desc: 'Dòng chảy năng lượng chung & hướng đi' },
      love: { label: 'Tình Duyên', desc: 'Mối quan hệ, cảm xúc & gắn kết' },
      career: { label: 'Sự Nghiệp', desc: 'Công việc, tài chính & cơ hội' },
      spiritual: { label: 'Tâm Linh', desc: 'Thấu hiểu bản thân, bài học linh hồn' },
      decision: { label: 'Quyết Định', desc: 'Lựa chọn, ngã rẽ & hệ quả' },
    },
    actions: {
      drawNext: 'Rút Bài',
      drawAll: 'Rút Hết',
      flipAll: 'Lật Tất Cả Các Lá Bài',
      viewReading: 'Xem Bài Luận Giải Chi Tiết',
      shuffleDeck: 'Xáo bài lại',
      tapDeckHelper: 'Chạm Tụ Bài để rút',
    },
    readingPanel: {
      headerSub: 'Bản Luận Giải Chi Tiết',
      intentionLabel: 'Ý niệm',
      tabAi: 'Luận Giải Chuyên Sâu',
      tabRag: 'Chi Tiết Từng Lá Bài',
      aiGenerating: 'Nhà tiên tri đang kết nối trực giác & xâu chuỗi thông điệp...',
      copyBtn: 'Sao chép nội dung',
      copiedBtn: 'Đã sao chép!',
      closeBtn: 'Đóng',
      reGenerate: 'Luận giải lại',
      exportPdf: 'In / Xuất Báo Cáo',
      adviceLabel: 'Lời khuyên',
    },
    cardDetail: {
      reversedBadge: 'Lá Bài Ngược (Reversed)',
      archetype: 'Hình tượng mẫu',
      positionInSpread: 'Vị trí trong trải bài',
      essence: 'Bản Chất Cốt Lõi (Essence)',
      keywords: 'Từ Khóa Biểu Tượng',
      psychological: 'Chiều Sâu Tâm Lý',
      practical: 'Lời Khuyên Thực Tế',
      shadow: 'Mặt Tối Cần Lưu Tâm (Shadow)',
    },
    spreadPicker: {
      title: 'Chọn Kiểu Trải Bài (Tarot Spreads)',
      subtitle: '11 kiểu trải bài kinh điển với các vị trí năng lượng chuyên sâu',
      cardsCount: 'Lá bài',
      closeBtn: 'Đóng',
      morePositions: 'vị trí nữa',
    },
  },
  en: {
    header: {
      title: 'TAM AN TAROT',
      subtitle: 'Intuitive Healing & Cosmic Wisdom',
      spreadLabel: 'Spread',
      viewReading: 'View Reading',
      newReading: 'New Reading',
      muteSound: 'Mute Audio',
      unmuteSound: 'Unmute Audio',
      langToggle: 'English',
    },
    intention: {
      modalTitle: 'Step 2: Check-in & Framing',
      modalSubtitle: 'Connect in a safe, open space. Share your question or situation to receive clarity and guidance from the cards.',
      questionLabel: 'Your Question or Intention',
      questionPlaceholder: 'e.g., What should I focus on in my career next month? / How can I navigate this relationship?...',
      focusLabel: 'Focus Area',
      selectedSpread: 'Selected Spread',
      allowReversals: 'Allow Reversed Cards',
      laterBtn: 'Later',
      startBtn: 'Begin Reading',
    },
    categories: {
      general: { label: 'General', desc: 'Overall energy flow and cosmic guidance' },
      love: { label: 'Love', desc: 'Relationships, feelings, and emotional bonds' },
      career: { label: 'Career', desc: 'Work, finances, ambition, and opportunities' },
      spiritual: { label: 'Spiritual', desc: 'Self-discovery and soul growth lessons' },
      decision: { label: 'Decision', desc: 'Choices, crossroad paths, and consequences' },
    },
    actions: {
      drawNext: 'Draw Card',
      drawAll: 'Draw All',
      flipAll: 'Flip All Cards',
      viewReading: 'View Detailed Reading',
      shuffleDeck: 'Reshuffle',
      tapDeckHelper: 'Tap Deck to draw',
    },
    readingPanel: {
      headerSub: 'Detailed Tarot Reading',
      intentionLabel: 'Intention',
      tabAi: 'Deep Interpretation',
      tabRag: 'Card Meanings',
      aiGenerating: 'The Oracle is tuning into the cards and weaving the prophecy...',
      copyBtn: 'Copy Content',
      copiedBtn: 'Copied!',
      closeBtn: 'Close',
      reGenerate: 'Re-Synthesize',
      exportPdf: 'Print / Export Report',
      adviceLabel: 'Advice',
    },
    cardDetail: {
      reversedBadge: 'Reversed Card',
      archetype: 'Archetype',
      positionInSpread: 'Spread Position',
      essence: 'Core Essence',
      keywords: 'Symbolic Keywords',
      psychological: 'Psychological Dimension',
      practical: 'Practical Action Advice',
      shadow: 'Shadow Aspect to Watch',
    },
    spreadPicker: {
      title: 'Select Tarot Spread',
      subtitle: '11 classic spreads with intuitive position mappings',
      cardsCount: 'Cards',
      closeBtn: 'Close',
      morePositions: 'more positions',
    },
  },
};
