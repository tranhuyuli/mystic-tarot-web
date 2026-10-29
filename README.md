# 🔮 Mystic Tarot Web

<p align="center">
  <img src="public/cards/major-00-the-fool.png" alt="Mystic Tarot" width="160" />
</p>

<p align="center">
  <b>Ứng dụng trải nghiệm Tarot tương tác đa chiều 3D/2D Canvas kết hợp RAG Knowledge Engine & LLM Streaming chuyên sâu.</b>
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Three.js-0.173-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-6.1-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /></a>
</p>

---

## 🌟 Giới thiệu

**Mystic Tarot Web** là một nền tảng bói bài và chiêm nghiệm Tarot hiện đại, kết hợp giữa nghệ thuật biểu tượng học truyền thống và công nghệ tương tác 3D WebGL cùng trí tuệ nhân tạo (AI/LLM). 

Không chỉ dừng lại ở việc lật bài thông thường, ứng dụng tái hiện toàn bộ nghi thức Tarot từ việc thanh tẩy năng lượng, đặt chủ đích (Intention), kinh bài trực giác (Cut Deck), cho đến việc phân tích giải đoán cá nhân hóa thông qua hệ thống **RAG (Retrieval-Augmented Generation)** dựa trên cơ sở dữ liệu tri thức 78 lá bài đồ sộ.

---

## ✨ Tính năng nổi bật

### 🎴 1. Trải nghiệm tương tác 3D/2D Canvas
- Render hiệu ứng bài Tarot chuyển động mượt mà bằng **Three.js** với ánh sáng huyền bí, bóng đổ và hiệu ứng phản quang (sheen effect).
- Thao tác kéo thả, tương tác lật bài với âm thanh xúc giác (sound design) chân thực.

### 🕯️ 2. Hệ thống nghi thức huyền thuật (Rituals)
- **Cleansing Ritual (Nghi thức tẩy uế):** Thanh tẩy năng lượng bộ bài trước phiên trải bài bằng chuông đồng, nến và khói hương xô thơm.
- **Intention Setting (Thiết lập chủ đích):** Định hình câu hỏi và kết nối năng lượng tâm thức theo các chủ đề: Tình cảm, Sự nghiệp, Phát triển bản thân, Quyết định...
- **Cut Deck (Kinh bài trực giác):** Chẻ bài theo 3 phần theo đúng quy chuẩn nghi thức Tarot cổ điển.
- **Cord Cutting (Cắt đứt liên kết):** Không gian giải phóng năng lượng tiêu cực và cắt đứt dây liên kết năng lượng độc hại.

### 🧠 3. RAG Engine & Giải đoán AI thời gian thực (LLM Streaming)
- **Knowledge Base chuyên sâu (~2.3MB):** Dữ liệu chi tiết cho toàn bộ 78 lá bài bao gồm: Archetype, Chiêm tinh (Zodiac, Planet, Element), Biểu tượng học, Lời khẳng định (Affirmations), Ý nghĩa xuôi/ngược theo từng ngữ cảnh trải bài.
- **RAG Context Retrieval:** Thuật toán tự động đối chiếu các lá bài trong phiên trải, vị trí trải bài và câu hỏi người dùng để xây dựng prompt hoàn chỉnh.
- **SSE Streaming:** Tương thích chuẩn OpenAI API, hỗ trợ streaming giải đoán thời gian thực mượt mà từ nhiều nhà cung cấp (OpenAI, DeepSeek, Anthropic/Claude qua OpenRouter, Ollama cục bộ...).

### 🌐 4. Đa ngôn ngữ & Thiết kế tối ưu (i18n & UI)
- Hỗ trợ hoàn chỉnh **Tiếng Việt 🇻🇳** và **English 🇬🇧**.
- Giao diện Dark/Mystic sang trọng xây dựng trên Tailwind CSS, tối ưu hoàn hảo trên cả thiết bị di động (Mobile Responsive) và máy tính bàn.

---

## 🏗️ Kiến trúc dự án

```text
mystic-tarot-web/
├── public/                 # Static assets (79 card images PNG, favicon, manifest...)
├── scripts/                # Script trích xuất tri thức Tarot & tiện ích
├── src/
│   ├── components/         # Giao diện UI & Modals (Canvas, Rituals, ReadingPanel...)
│   │   ├── TarotCanvas.tsx # 3D/2D WebGL Three.js render lá bài
│   │   ├── ReadingPanel.tsx# Khung hiển thị & stream lời giải đoán AI
│   │   └── ...
│   ├── context/            # Quản lý trạng thái đa ngôn ngữ (LanguageContext)
│   ├── data/               # tarotKnowledgeBase.json (Cơ sở tri thức 78 lá bài)
│   ├── engine/             # RAG Engine & cấu trúc System Prompts
│   ├── i18n/               # Bản dịch từ điển Tiếng Việt & Tiếng Anh
│   ├── services/           # Service gọi API LLM backend
│   └── types/              # Định nghĩa kiểu dữ liệu TypeScript
├── server.js               # Express production server kèm LLM proxy endpoint
├── vite.config.ts          # Vite build config & dev server SSE streaming middleware
├── Dockerfile              # Docker container build đa tầng
└── docker-compose.yml      # Cấu hình khởi chạy Docker 1-click
```

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy

### Yêu cầu tiên quyết
- **Node.js**: v18.0.0 trở lên
- **npm** hoặc **yarn** / **pnpm**
- *(Tùy chọn)* **Docker & Docker Compose** nếu muốn triển khai bằng container.

### 1. Clone repository
```bash
git clone https://github.com/tranhuyuli/mystic-tarot-web.git
cd mystic-tarot-web
```

### 2. Cài đặt thư viện dependencies
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Chỉnh sửa `.env` để cấu hình nhà cung cấp LLM mong muốn:

#### Tùy chọn A: Sử dụng OpenAI
```env
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=sk-proj-your-openai-api-key
LLM_MODEL=gpt-4o-mini
LLM_TEMPERATURE=0.7
```

#### Tùy chọn B: Sử dụng DeepSeek
```env
LLM_BASE_URL=https://api.deepseek.com/v1
LLM_API_KEY=sk-your-deepseek-key
LLM_MODEL=deepseek-chat
LLM_TEMPERATURE=0.7
```

#### Tùy chọn C: Sử dụng OpenRouter (Claude, Llama, Gemini...)
```env
LLM_BASE_URL=https://openrouter.ai/api/v1
LLM_API_KEY=sk-or-v1-your-openrouter-key
LLM_MODEL=anthropic/claude-3.5-sonnet
LLM_TEMPERATURE=0.7
```

#### Tùy chọn D: Chạy hoàn toàn cục bộ qua Ollama (Không tốn phí)
```env
LLM_BASE_URL=http://localhost:11434/v1
LLM_API_KEY=ollama
LLM_MODEL=llama3.1:latest
LLM_TEMPERATURE=0.7
```

### 4. Khởi chạy môi trường phát triển (Development)
```bash
npm run dev
```
Ứng dụng sẽ khả dụng tại: `http://localhost:3000`

---

## 🐳 Triển khai với Docker

Dự án đã tích hợp sẵn Dockerfile đa tầng (multi-stage build) và Docker Compose tối ưu dung lượng và bảo mật:

```bash
# Build và khởi chạy container ở chế độ background
docker compose up -d --build

# Xem log runtime của server
docker compose logs -f

# Dừng container
docker compose down
```

Truy cập ứng dụng tại: `http://localhost:3000`

---

## 🔒 Chính sách bảo mật & Best Practices

- **Bảo vệ khóa bí mật API:** Các cấu hình LLM (`LLM_API_KEY`, endpoint) được xử lý hoàn toàn tại phía backend middleware / Node server, tuyệt đối không bị lộ ra phía client (trình duyệt người dùng).
- **Git Security:** File `.env` chứa bí mật và các build artifacts kích thước lớn đã được cấu hình `.gitignore` loại trừ hoàn toàn.

---

## 📄 Bản quyền & Đóng góp

Dự án được xây dựng phục vụ mục đích nghiên cứu, học tập và trải nghiệm chiêm nghiệm Tarot tương tác. Mọi đóng góp (Pull Request, Issue) đều được hoan nghênh!

---

<p align="center">
  Made with ✨ & 🔮 by <a href="https://github.com/tranhuyuli">tranhuyuli</a>
</p>
