import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

// Custom plugin to provide OpenAI-compatible server-side streaming endpoint in Vite
function tarotApiPlugin() {
  return {
    name: 'tarot-api-server',
    configureServer(server: any) {
      server.middlewares.use('/api/tarot/synthesize', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const { systemPrompt, userPrompt } = data;

            // Reload .env dynamically on request
            dotenv.config();

            const baseURL = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
            const apiKey = process.env.LLM_API_KEY || '';
            const model = process.env.LLM_MODEL || 'gpt-4o-mini';
            const temperature = process.env.LLM_TEMPERATURE ? parseFloat(process.env.LLM_TEMPERATURE) : 0.7;

            if (!apiKey) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'NO_API_KEY', message: 'API key is not configured in .env or settings.' }));
              return;
            }

            const openai = new OpenAI({
              baseURL: baseURL,
              apiKey: apiKey,
            });

            // Set SSE headers for streaming
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            const messagesToSend = data.messages && Array.isArray(data.messages)
              ? data.messages
              : [
                  { role: 'system', content: systemPrompt || 'You are a wise Tarot Reader.' },
                  { role: 'user', content: userPrompt || '' },
                ];

            const stream = await openai.chat.completions.create({
              model: model,
              messages: messagesToSend,
              temperature: temperature,
              stream: true,
            });

            for await (const chunk of stream) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
              }
            }

            res.write(`data: [DONE]\n\n`);
            res.end();
          } catch (error: any) {
            console.error('LLM Synthesis API Error:', error);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'LLM_ERROR', message: error.message || 'Error communicating with LLM provider' }));
            } else {
              res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
              res.end();
            }
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tarotApiPlugin()],
  server: {
    port: 3000,
    host: true
  }
});
