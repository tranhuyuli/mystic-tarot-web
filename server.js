import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

// Handle LLM Synthesis Streaming API
async function handleSynthesize(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', async () => {
    try {
      const data = JSON.parse(body || '{}');
      const { systemPrompt, userPrompt } = data;

      const baseURL = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
      const apiKey = process.env.LLM_API_KEY || '';
      const model = process.env.LLM_MODEL || 'gpt-4o-mini';
      const temperature = process.env.LLM_TEMPERATURE ? parseFloat(process.env.LLM_TEMPERATURE) : 0.7;

      if (!apiKey) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'NO_API_KEY', message: 'LLM API key is not configured.' }));
        return;
      }

      const openai = new OpenAI({
        baseURL,
        apiKey,
      });

      // Set SSE headers
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      });

      const messages = data.messages && Array.isArray(data.messages)
        ? data.messages
        : [
            { role: 'system', content: systemPrompt || 'You are a wise Tarot Reader.' },
            { role: 'user', content: userPrompt || '' },
          ];

      const stream = await openai.chat.completions.create({
        model,
        messages,
        temperature,
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
    } catch (error) {
      console.error('LLM Synthesis API Error:', error);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'LLM_ERROR', message: error.message || 'Server error communicating with LLM' }));
      } else {
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
      }
    }
  });
}

// Serve static files from dist/ with SPA routing fallback
function serveStatic(req, res) {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') {
    reqPath = '/index.html';
  }

  let filePath = path.join(DIST_DIR, reqPath);

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback: serve index.html
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
      }

      // Cache immutable assets for 1 year, html for 0s
      const cacheHeader = ext === '.html'
        ? 'no-cache'
        : 'public, max-age=31536000, immutable';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': cacheHeader,
      });
      res.end(content);
    });
  });
}

const server = http.createServer((req, res) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  // Health check endpoint
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    return;
  }

  // API Route
  if (req.url.startsWith('/api/tarot/synthesize')) {
    handleSynthesize(req, res);
    return;
  }

  // Static files & SPA
  serveStatic(req, res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🔮 Mystic Tarot Production Server running at http://0.0.0.0:${PORT}`);
});
