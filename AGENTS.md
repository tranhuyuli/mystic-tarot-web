<!-- bmad:context -->
<!-- Verified 2026-08-17. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## mystic-tarot-web

Ứng dụng trải nghiệm Tarot tương tác kết hợp 3D/2D Canvas, giải đoán chuyên sâu sử dụng RAG Engine và OpenAI-compatible LLM streaming.
Stack: React 18, TypeScript, Vite, Tailwind CSS, Three.js, Lucide Icons.

## Policy

- Cấu hình LLM (API Key, Base URL, Model) là cấu hình nội bộ hoàn toàn trong `.env` (`LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`), không đưa vào hoặc cho phép cấu hình từ giao diện UI người dùng.
- Không chỉnh sửa trực tiếp các thư mục tham chiếu `arcanite/` và `tarotvis/` (đây là các reference repositories).
- Tệp `src/data/tarotKnowledgeBase.json` là cơ sở tri thức tĩnh (~2.3MB). Nếu cần tái tạo/cập nhật dữ liệu từ nguồn, sử dụng script trong `scripts/extract_knowledge_base.py`.
- Tuyệt đối không commit tệp `.env` hay secret vào repository.

## Where things are

- **3D & 2D Tarot Canvas:** `src/components/TarotCanvas.tsx` (Render lá bài, hiệu ứng tương tác Three.js).
- **RAG & Synthesis Engine:** `src/engine/ragEngine.ts` (thuật toán truy xuất ngữ cảnh bài Tarot) và `src/engine/prompts.ts` (hệ thống system prompts).
- **LLM Streaming Backend Middleware:** `vite.config.ts` (endpoint `/api/tarot/synthesize` xử lý SSE streaming qua OpenAI SDK từ biến môi trường `.env`).
- **Đa ngôn ngữ (i18n):** `src/i18n/translations.ts` (hỗ trợ Tiếng Việt và Tiếng Anh).
- **Modal & Luồng trải nghiệm:** `src/components/` (`IntentionModal.tsx`, `SpreadPickerModal.tsx`, `CleansingRitualModal.tsx`, `CordCuttingModal.tsx`, `ReadingPanel.tsx`).

## Running and verifying

- Khởi chạy môi trường phát triển: `npm run dev` (mặc định cổng `3000`, có kèm streaming middleware API).
- Kiểm tra kiểu dữ liệu và build: `npm run build` (`tsc && vite build`).

## Conventions that differ from defaults

- Tích hợp endpoint LLM backend được nhúng trực tiếp qua Vite dev server middleware (`vite.config.ts`), đọc biến cấu hình từ `.env` phía server, không chạy server Node/Express tách rời trong quá trình phát triển.
- Client (`src/services/llmService.ts`) chỉ gửi yêu cầu tổng hợp ngữ cảnh (system prompt, user prompt) lên endpoint nội bộ `/api/tarot/synthesize` mà không cần biết thông tin API key hay model endpoint.

## Known pitfalls

- Three.js Canvas resize & context loss: Cần cleanup animation frame và event listener cẩn thận trong `TarotCanvas.tsx` khi component unmount hoặc khi thay đổi trải bài.
- `tarotKnowledgeBase.json` có kích thước lớn: Tránh import trực tiếp vào các component client không cần thiết; chỉ truy xuất thông qua RAG Engine.

<!-- /bmad:context -->
