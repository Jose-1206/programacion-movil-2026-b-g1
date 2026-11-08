import { createServer } from 'node:http';
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const issuer = 'geotrail-api';
const audience = 'geotrail-mobile';
const ttlSeconds = 20 * 60;
const demoEmail = process.env.DEMO_EMAIL || 'student@geotrail.test';
const demoPassword = process.env.DEMO_PASSWORD || 'GeoTrailDemo#2026';
const secret = process.env.JWT_SECRET || randomBytes(32).toString('hex');
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:8100',
  'http://localhost',
  'https://localhost',
  'capacitor://localhost',
  ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []),
]);


function equal(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && timingSafeEqual(x, y);
}

function sign(data) {
  return createHmac('sha256', secret).update(data).digest('base64url');
}

function issueJwt(userId) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: issuer, aud: audience, sub: userId, scope: 'checkpoints:read checkpoints:write',
    iat: now, exp: now + ttlSeconds,
  })).toString('base64url');
  return `${header}.${payload}.${sign(`${header}.${payload}`)}`;
}

function verifyJwt(authorization) {
  if (!authorization?.startsWith('Bearer ')) return null;
  const token = authorization.slice('Bearer '.length);
  const parts = token.split('.');
  if (parts.length !== 3 || parts.some((part) => !part)) return null;
  const [h, p, signature] = parts;
  if (!equal(signature, sign(`${h}.${p}`))) return null;
  try {
    const header = JSON.parse(Buffer.from(h, 'base64url').toString('utf8'));
    const data = JSON.parse(Buffer.from(p, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (header.alg !== 'HS256' || header.typ !== 'JWT') return null;
    if (data.iss !== issuer || data.aud !== audience) return null;
    if (typeof data.sub !== 'string' || !data.sub) return null;
    if (!Number.isInteger(data.exp) || data.exp <= now) return null;
    if (!Number.isInteger(data.iat) || data.iat > now + 60) return null;
    return { sub: data.sub, scope: data.scope };
  } catch { return null; }
}

function respond(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(json);
}

async function readBody(req) {
  let total = 0;
  const chunks = [];
  for await (const chunk of req) {
    total += chunk.length;
    if (total > 8192) throw new Error('PAYLOAD_TOO_LARGE');
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new Error('INVALID_JSON'); }
}

export function createApp() {
  const recordsByUser = new Map();

  return createServer(async (req, res) => {
    const origin = req.headers.origin;
    if (origin && !allowedOrigins.has(origin)) {
      respond(res, 403, { error: 'origin_not_allowed' }); return;
    }
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept');
      res.setHeader('Access-Control-Max-Age', '600');
    }
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    const path = new URL(req.url || '/', 'http://127.0.0.1').pathname;
    try {
      if (path === '/api/health' && req.method === 'GET') {
        respond(res, 200, { status: 'ok' }); return;
      }

      if (path === '/api/auth/login' && req.method === 'POST') {
        const data = await readBody(req);
        // Demonstration credentials only; a real deployment needs a persistent user store and password hashes.
        const valid = typeof data?.email === 'string' && typeof data?.password === 'string' &&
          equal(data.email.trim().toLowerCase(), demoEmail.toLowerCase()) && equal(data.password, demoPassword);
        if (!valid) { respond(res, 401, { error: 'invalid_credentials' }); return; }
        respond(res, 200, { accessToken: issueJwt('demo-student'), tokenType: 'Bearer', expiresIn: ttlSeconds });
        return;
      }

      if (path === '/api/checkpoints' && ['GET', 'POST'].includes(req.method || '')) {
        const user = verifyJwt(req.headers.authorization);
        if (!user) { respond(res, 401, { error: 'invalid_or_expired_token' }); return; }
        if (req.method === 'GET') {
          if (!String(user.scope).includes('checkpoints:read')) { respond(res, 403, { error: 'forbidden' }); return; }
          respond(res, 200, recordsByUser.get(user.sub) || []); return;
        }
        if (!String(user.scope).includes('checkpoints:write')) { respond(res, 403, { error: 'forbidden' }); return; }
        const body = await readBody(req);
        const valid = typeof body?.label === 'string' && body.label.trim().length > 0 && body.label.trim().length <= 80 &&
          typeof body.latitude === 'number' && Number.isFinite(body.latitude) && Math.abs(body.latitude) <= 90 &&
          typeof body.longitude === 'number' && Number.isFinite(body.longitude) && Math.abs(body.longitude) <= 180 &&
          typeof body.accuracy === 'number' && Number.isFinite(body.accuracy) && body.accuracy >= 0;
        if (!valid) { respond(res, 400, { error: 'invalid_checkpoint' }); return; }
        const checkpoint = {
          id: randomUUID(), label: body.label.trim(), latitude: body.latitude,
          longitude: body.longitude, accuracy: body.accuracy, createdAt: new Date().toISOString(),
        };
        const records = recordsByUser.get(user.sub) || [];
        records.unshift(checkpoint);
        recordsByUser.set(user.sub, records.slice(0, 100));
        respond(res, 201, checkpoint); return;
      }

      respond(res, 404, { error: 'not_found' });
    } catch (error) {
      if (error.message === 'PAYLOAD_TOO_LARGE') respond(res, 413, { error: 'payload_too_large' });
      else if (error.message === 'INVALID_JSON') respond(res, 400, { error: 'invalid_json' });
      else respond(res, 500, { error: 'internal_error' });
    }
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const host = process.env.API_HOST || '127.0.0.1';
  const port = Number(process.env.API_PORT || 3001);
  createApp().listen(port, host, () => {
    console.log(`GeoTrail API listening on http://${host}:${port}`);
    console.log(`Demo email: ${demoEmail}. See README for demo password.`);
    console.log('For local coursework only; use HTTPS, password hashes and persistent storage in production.');
  });
}
