// Từ điển dịch tên 78 lá bài, 11 kiểu trải bài và các biểu tượng Tarot sang Tiếng Việt chuẩn mực

export const VIETNAMESE_CARD_NAMES: Record<string, string> = {
  // Major Arcana (22 lá Ẩn Chính)
  the_fool: '0. Kẻ Khờ (The Fool)',
  the_magician: 'I. Pháp Sư (The Magician)',
  the_high_priestess: 'II. Nữ Tư Tế (The High Priestess)',
  the_empress: 'III. Nữ Hoàng (The Empress)',
  the_emperor: 'IV. Hoàng Đế (The Emperor)',
  the_hierophant: 'V. Giáo Hoàng (The Hierophant)',
  the_lovers: 'VI. Tình Nhân (The Lovers)',
  the_chariot: 'VII. Cỗ Xe (The Chariot)',
  strength: 'VIII. Sức Mạnh (Strength)',
  the_hermit: 'IX. Ẩn Sĩ (The Hermit)',
  wheel_of_fortune: 'X. Bánh Xe Số Phận (Wheel of Fortune)',
  justice: 'XI. Công Lý (Justice)',
  the_hanged_man: 'XII. Kẻ Treo Ngược (The Hanged Man)',
  death: 'XIII. Chuyển Hóa (Death)',
  temperance: 'XIV. Tiết Độ (Temperance)',
  the_devil: 'XV. Ác Quỷ (The Devil)',
  the_tower: 'XVI. Tòa Tháp (The Tower)',
  the_star: 'XVII. Ngôi Sao (The Star)',
  the_moon: 'XVIII. Mặt Trăng (The Moon)',
  the_sun: 'XIX. Mặt Trời (The Sun)',
  judgement: 'XX. Phán Xét (Judgement)',
  the_world: 'XXI. Thế Giới (The World)',

  // Cups (Bộ Cốc - Nước)
  ace_of_cups: 'Ace of Cups (Ách Cốc)',
  two_of_cups: 'Two of Cups (Hai Cốc)',
  three_of_cups: 'Three of Cups (Ba Cốc)',
  four_of_cups: 'Four of Cups (Bốn Cốc)',
  five_of_cups: 'Five of Cups (Năm Cốc)',
  six_of_cups: 'Six of Cups (Sáu Cốc)',
  seven_of_cups: 'Seven of Cups (Bảy Cốc)',
  eight_of_cups: 'Eight of Cups (Tám Cốc)',
  nine_of_cups: 'Nine of Cups (Chín Cốc)',
  ten_of_cups: 'Ten of Cups (Mười Cốc)',
  page_of_cups: 'Page of Cups (Tiểu Đồng Cốc)',
  knight_of_cups: 'Knight of Cups (Hiệp Sĩ Cốc)',
  queen_of_cups: 'Queen of Cups (Hoàng Hậu Cốc)',
  king_of_cups: 'King of Cups (Vua Cốc)',

  // Pentacles (Bộ Tiền - Đất)
  ace_of_pentacles: 'Ace of Pentacles (Ách Tiền)',
  two_of_pentacles: 'Two of Pentacles (Hai Tiền)',
  three_of_pentacles: 'Three of Pentacles (Ba Tiền)',
  four_of_pentacles: 'Four of Pentacles (Bốn Tiền)',
  five_of_pentacles: 'Five of Pentacles (Năm Tiền)',
  six_of_pentacles: 'Six of Pentacles (Sáu Tiền)',
  seven_of_pentacles: 'Seven of Pentacles (Bảy Tiền)',
  eight_of_pentacles: 'Eight of Pentacles (Tám Tiền)',
  nine_of_pentacles: 'Nine of Pentacles (Chín Tiền)',
  ten_of_pentacles: 'Ten of Pentacles (Mười Tiền)',
  page_of_pentacles: 'Page of Pentacles (Tiểu Đồng Tiền)',
  knight_of_pentacles: 'Knight of Pentacles (Hiệp Sĩ Tiền)',
  queen_of_pentacles: 'Queen of Pentacles (Hoàng Hậu Tiền)',
  king_of_pentacles: 'King of Pentacles (Vua Tiền)',

  // Swords (Bộ Kiếm - Khí)
  ace_of_swords: 'Ace of Swords (Ách Kiếm)',
  two_of_swords: 'Two of Swords (Hai Kiếm)',
  three_of_swords: 'Three of Swords (Ba Kiếm)',
  four_of_swords: 'Four of Swords (Bốn Kiếm)',
  five_of_swords: 'Five of Swords (Năm Kiếm)',
  six_of_swords: 'Six of Swords (Sáu Kiếm)',
  seven_of_swords: 'Seven of Swords (Bảy Kiếm)',
  eight_of_swords: 'Eight of Swords (Tám Kiếm)',
  nine_of_swords: 'Nine of Swords (Chín Kiếm)',
  ten_of_swords: 'Ten of Swords (Mười Kiếm)',
  page_of_swords: 'Page of Swords (Tiểu Đồng Kiếm)',
  knight_of_swords: 'Knight of Swords (Hiệp Sĩ Kiếm)',
  queen_of_swords: 'Queen of Swords (Hoàng Hậu Kiếm)',
  king_of_swords: 'King of Swords (Vua Kiếm)',

  // Wands (Bộ Gậy - Lửa)
  ace_of_wands: 'Ace of Wands (Ách Gậy)',
  two_of_wands: 'Two of Wands (Hai Gậy)',
  three_of_wands: 'Three of Wands (Ba Gậy)',
  four_of_wands: 'Four of Wands (Bốn Gậy)',
  five_of_wands: 'Five of Wands (Năm Gậy)',
  six_of_wands: 'Six of Wands (Sáu Gậy)',
  seven_of_wands: 'Seven of Wands (Bảy Gậy)',
  eight_of_wands: 'Eight of Wands (Tám Gậy)',
  nine_of_wands: 'Nine of Wands (Chín Gậy)',
  ten_of_wands: 'Ten of Wands (Mười Gậy)',
  page_of_wands: 'Page of Wands (Tiểu Đồng Gậy)',
  knight_of_wands: 'Knight of Wands (Hiệp Sĩ Gậy)',
  queen_of_wands: 'Queen of Wands (Hoàng Hậu Gậy)',
  king_of_wands: 'King of Wands (Vua Gậy)',
};

// Từ điển Archetypes (Hình tượng tâm lý học Jung)
export const VIETNAMESE_ARCHETYPES: Record<string, string> = {
  the_innocent: 'Kẻ Ngây Thơ (The Innocent)',
  the_magician: 'Nhà Ảo Thuật / Pháp Sư (The Magician)',
  the_high_priestess: 'Nữ Tư Tế Trực Giác (The Intuitive Priestess)',
  the_empress: 'Người Mẹ / Sự Màu Mỡ (The Great Mother)',
  the_emperor: 'Người Cha / Nhà Kiến Thiết (The Sovereign / Father)',
  the_hierophant: 'Người Dẫn Đường Tinh Thần (The Spiritual Teacher)',
  the_lover: 'Người Yêu Thương (The Lover)',
  the_chariot: 'Chiến Binh Quyết Đoán (The Focused Warrior)',
  the_hero: 'Người Hùng (The Hero)',
  the_hermit: 'Ẩn Sĩ Tự Vấn (The Sage / Seeker)',
  the_sage: 'Bậc Trí Huệ (The Sage)',
  the_creator: 'Nhà Sáng Tạo (The Creator)',
  the_ruler: 'Nhà Lãnh Đạo (The Ruler)',
  the_caregiver: 'Người Nuôi Dưỡng (The Caregiver)',
  the_jester: 'Kẻ Tiếu Ngạo (The Jester)',
  the_rebel: 'Kẻ Nổi Loạn / Chuyển Hóa (The Rebel / Transformer)',
  the_explorer: 'Nhà Thám Hiểm (The Explorer)',
  the_destroyer: 'Lực Lượng Chuyển Hóa (The Destroyer of Illusions)',
  the_shadow: 'Bóng Tối Tiềm Thức (The Shadow Self)',
};

// Toàn bộ 11 kiểu trải bài từ Arcanite với bản dịch chuẩn xác 100%
export const VIETNAMESE_SPREAD_INFO: Record<string, { name: string; description: string; positions: Record<string, string> }> = {
  'single-focus': {
    name: '1 Lá — Thông Điệp Trọng Tâm',
    description: 'Trải 1 lá bài đơn giản để nhận thông điệp, lời khuyên và năng lượng soi sáng cho ngày hôm nay.',
    positions: {
      'Focus': 'Thông Điệp Trọng Tâm: Năng lượng hoặc bài học vũ trụ muốn bạn lưu tâm nhất.',
    },
  },
  'past-present-future': {
    name: '3 Lá — Quá Khứ, Hiện Tại & Tương Lai',
    description: 'Trải bài dòng thời gian kinh điển giúp nhìn rõ nguồn gốc vấn đề, thực tại và xu hướng phát triển.',
    positions: {
      'Past': '1. Quá Khứ: Nền tảng, sự kiện hoặc bài học đã đưa bạn đến hiện tại.',
      'Present': '2. Hiện Tại: Năng lượng, trạng thái tâm lý và thực tại lúc này.',
      'Future': '3. Tương Lai: Hướng đi tiềm năng và kết quả nếu giữ nguyên hướng hiện tại.',
    },
  },
  'mind-body-spirit': {
    name: '3 Lá — Tâm Trí, Thân Thể & Linh Hồn',
    description: 'Góc nhìn toàn diện về sức khỏe tinh thần, thể chất và sự kết nối tâm linh của bạn.',
    positions: {
      'Mind': '1. Tâm Trí (Mind): Trạng thái tinh thần, suy nghĩ và tư duy hiện tại.',
      'Body': '2. Thân Thể (Body): Năng lượng thể chất, sức khỏe và hành động thực tế.',
      'Spirit': '3. Linh Hồn (Spirit): Nhu cầu nội tâm sâu thẳm và bài học tâm linh.',
    },
  },
  'situation-action-outcome': {
    name: '3 Lá — Tình Huống, Hành Động & Kết Quả',
    description: 'Trải bài định hướng hành động thiết thực cho mọi khó khăn, dự án hay quyết định cụ thể.',
    positions: {
      'Situation': '1. Bối Cảnh: Bản chất thật sự của tình huống bạn đang đối mặt.',
      'Action': '2. Hành Động: Bước đi tốt nhất bạn nên thực hiện lúc này.',
      'Outcome': '3. Kết Quả: Hệ quả trực tiếp từ hành động bạn chọn.',
    },
  },
  'five-card-cross': {
    name: '5 Lá — Thập Tự Định Hướng (5-Card Cross)',
    description: 'Trải bài chữ thập bao quát toàn diện các khía cạnh trọng yếu của một sự việc.',
    positions: {
      'Present Situation': '1. Thực Tại: Bối cảnh trung tâm của vấn đề.',
      'Challenge': '2. Thử Thách: Trở ngại hoặc mâu thuẫn cần vượt qua.',
      'Past Influences': '3. Quá Khứ: Nguồn gốc năng lượng dẫn đến tình cảnh hiện nay.',
      'Future Potential': '4. Tiềm Năng: Khả năng mở ra trong tương lai gần.',
      'Advice': '5. Lời Khuyên: Hành động sáng suốt nhất lúc này.',
    },
  },
  'four-card-decision': {
    name: '4 Lá — Cân Nhắc Quyết Định (4-Card Decision)',
    description: 'Công cụ hoàn hảo để cân đo đong đếm giữa hai lựa chọn, phân tích mặt hỗ trợ và lực cản.',
    positions: {
      'Option A': '1. Lựa Chọn A: Bản chất và hướng phát triển của phương án A.',
      'Option B': '2. Lựa Chọn B: Bản chất và hướng phát triển của phương án B.',
      'What Helps': '3. Yếu Tố Hỗ Trợ: Nguồn lực hoặc thuận lợi đang đứng về phía bạn.',
      'What Hinders': '4. Yếu Tố Cản Trở: Khó khăn tiềm ẩn cần đề phòng.',
    },
  },
  'relationship-spread': {
    name: '6 Lá — Thấu Hiểu Mối Quan Hệ (Relationship)',
    description: 'Phân tích chiều sâu tâm lý, cảm xúc hai phía, nền tảng gắn kết và tiềm năng tương lai.',
    positions: {
      'You': '1. Bản Thân Bạn: Cảm xúc, suy nghĩ và vị thế của bạn trong mối quan hệ.',
      'The Other': '2. Đối Phương: Cảm xúc, mong muốn và vị thế của người ấy.',
      'The Relationship': '3. Năng Lượng Chung: Bản chất sợi dây liên kết hiện tại giữa hai người.',
      'Past Foundation': '4. Nền Tảng Quá Khứ: Điều gì đã kết nối hai bạn lại với nhau.',
      'Present State': '5. Thực Trạng: Những diễn biến đang diễn ra giữa hai người.',
      'Future Potential': '6. Hướng Tương Lai: Tiềm năng phát triển của mối quan hệ.',
    },
  },
  'horseshoe-traditional': {
    name: '7 Lá — Trải Bài Móng Ngựa Cổ Điển (Horseshoe)',
    description: 'Kiểu trải bài chiêm tinh truyền thống mang lại bức tranh diễn tiến từng bước của sự việc.',
    positions: {
      'Past': '1. Quá Khứ: Nguồn gốc ảnh hưởng đến vấn đề.',
      'Present': '2. Hiện Tại: Hoàn cảnh và cảm xúc hiện thời.',
      'Hidden Influences': '3. Yếu Tố Ẩn: Những điều bạn chưa nhìn thấy hoặc chưa nhận ra.',
      'Your Approach': '4. Thái Độ Bản Thân: Cách bạn tiếp cận và giải quyết vấn đề.',
      'Others Around You': '5. Người Xung Quanh: Tác động từ môi trường và những người liên quan.',
      'Hopes and Fears': '6. Hy Vọng & Nỗi Sợ: Tâm tư thầm kín bên trong.',
      'Final Outcome': '7. Kết Quả Cuối Cùng: Hướng đi và cái kết của sự việc.',
    },
  },
  'horseshoe-apex': {
    name: '7 Lá — Móng Ngựa Trọng Tâm Đỉnh (Apex Horseshoe)',
    description: 'Biến thể móng ngựa với lá bài đỉnh chóp làm tiêu điểm chuyển hóa năng lượng.',
    positions: {
      'Past Foundation': '1. Nền Móng Quá Khứ: Gốc rễ ban đầu của sự việc.',
      'Recent Past': '2. Quá Khứ Gần: Những điều vừa xảy ra.',
      'Present Influences': '3. Thực Tại: Năng lượng bao bọc xung quanh bạn.',
      'Key Focus': '4. Tiêu Điểm Trọng Tâm: Trọng tâm bài học hoặc nút thắt cốt lõi (Đỉnh).',
      'Future Influences': '5. Chuyển Biến Tương Lai: Những lực đẩy mới sắp xuất hiện.',
      'Near Future': '6. Tương Lai Gần: Bước phát triển tiếp theo.',
      'Final Outcome': '7. Kết Quả Chung Cuộc: Cái kết trọn vẹn của hành trình.',
    },
  },
  'celtic-cross': {
    name: '10 Lá — Thập Tự Celtic (Celtic Cross)',
    description: 'Trải bài toàn diện và sâu sắc bậc nhất trong Tarot, soi chiếu mọi ngóc ngách từ tiềm thức đến thực tại.',
    positions: {
      'Present Situation': '1. Trọng Tâm Hiện Tại: Trọng tâm câu hỏi và hoàn cảnh lúc này.',
      'Challenge': '2. Thử Thách: Rào cản hoặc nguồn năng lượng đang đối kháng.',
      'Distant Past': '3. Nền Móng Quá Khứ: Gốc rễ tiềm thức và bài học đã qua.',
      'Recent Past': '4. Quá Khứ Gần: Những sự kiện vừa qua đang dần kết thúc.',
      'Possible Outcome': '5. Tiềm Năng Tối Thượng: Kết quả lý tưởng tốt nhất có thể đạt được.',
      'Near Future': '6. Tương Lai Gần: Những chuyển biến sắp sửa diễn ra.',
      'Your Approach': '7. Nội Lực Bản Thân: Thái độ, tư duy và cách bạn nhìn nhận vấn đề.',
      'External Influences': '8. Môi Trường Xung Quanh: Tác động từ người khác và hoàn cảnh.',
      'Hopes and Fears': '9. Hy Vọng & Nỗi Sợ: Những mong ước thầm kín hoặc lo âu bên trong.',
      'Final Outcome': '10. Kết Quả Chung Cuộc: Hướng hội tụ năng lượng cuối cùng.',
    },
  },
  'year-ahead': {
    name: '12 Lá — Chiêm Nghiệm 12 Tháng Trong Năm (Year Ahead)',
    description: 'Bức tranh chiêm tinh tổng thể soi sáng năng lượng cho từng tháng trong một năm sắp tới.',
    positions: {
      'January': 'Tháng 1 (Khởi Đầu): Năng lượng mở màn năm mới.',
      'February': 'Tháng 2: Sự thanh lọc và kết nối.',
      'March': 'Tháng 3: Sự thức tỉnh và sáng tạo.',
      'April': 'Tháng 4: Hành động và định hình mục tiêu.',
      'May': 'Tháng 5: Sự nở rộ và đón nhận cơ hội.',
      'June': 'Tháng 6: Điểm cân bằng giữa năm.',
      'July': 'Tháng 7: Chiêm nghiệm và tái tạo nội lực.',
      'August': 'Tháng 8: Tỏa sáng và khẳng định bản thân.',
      'September': 'Tháng 9: Gặt hái và sắp xếp lại trật tự.',
      'October': 'Tháng 10: Chuyển hóa và buông bỏ cái cũ.',
      'November': 'Tháng 11: Chiều sâu trực giác và cảm xúc.',
      'December': 'Tháng 12: Đúc kết và đón nhận trọn vẹn.',
    },
  },
};

export function getVietnameseCardName(cardId: string, fallbackName: string): string {
  return VIETNAMESE_CARD_NAMES[cardId] || fallbackName;
}

export function getVietnameseArchetype(archetypeKey: string | undefined): string {
  if (!archetypeKey) return '';
  return VIETNAMESE_ARCHETYPES[archetypeKey] || archetypeKey.replace(/_/g, ' ');
}
