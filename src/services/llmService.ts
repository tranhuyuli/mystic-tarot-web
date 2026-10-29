import { AssembledContext } from '../types/tarot';
import { buildSynthesisPrompt } from '../engine/prompts';
import { generateDeterministicReading } from '../engine/ragEngine';

export async function synthesizeReadingStream(
  context: AssembledContext,
  language: 'vi' | 'en' = 'vi',
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: string) => void,
  abortSignal?: AbortSignal
): Promise<void> {
  const { systemPrompt, userPrompt } = buildSynthesisPrompt(context, language);

  try {
    const response = await fetch('/api/tarot/synthesize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemPrompt,
        userPrompt,
      }),
      signal: abortSignal,
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      
      // Fallback: If no API key configured, use Deterministic Engine smoothly!
      if (errJson.error === 'NO_API_KEY') {
        console.warn('No LLM API Key detected in .env or settings. Falling back to Layer 1 Deterministic Engine.');
        const deterministicText = generateDeterministicReading(context, language);
        
        // Emulate streaming for smooth typing UX
        let currentIdx = 0;
        const interval = setInterval(() => {
          if (abortSignal?.aborted) {
            clearInterval(interval);
            return;
          }
          if (currentIdx < deterministicText.length) {
            const nextChunk = deterministicText.slice(currentIdx, currentIdx + 4);
            currentIdx += 4;
            onChunk(nextChunk);
          } else {
            clearInterval(interval);
            onComplete();
          }
        }, 15);
        return;
      }

      throw new Error(errJson.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported in response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      if (abortSignal?.aborted) {
        reader.cancel();
        break;
      }

      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;

        const dataStr = trimmed.replace(/^data:\s*/, '');
        if (dataStr === '[DONE]') {
          onComplete();
          return;
        }

        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.error) {
            onError(parsed.error);
            return;
          }
          if (parsed.text) {
            onChunk(parsed.text);
          }
        } catch {
          // Continue if partial JSON
        }
      }
    }

    onComplete();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      console.log('Stream reading aborted by user.');
      return;
    }
    console.error('Synthesis error:', err);
    onError(err.message || 'Lỗi kết nối tới mô hình AI. Vui lòng kiểm tra lại cấu hình API.');
  }
}
