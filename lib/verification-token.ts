import crypto from 'crypto';

const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-secret-key';

export function createToken(email: string, code: string): string {
  const exp = Date.now() + 10 * 60 * 1000;
  const payload = `${email}:${code}:${exp}`;
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64');
}

export function verifyToken(token: string, email: string, code: string): { valid: boolean; reason?: string } {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const parts = decoded.split(':');
    if (parts.length !== 4) return { valid: false, reason: 'Invalid token' };
    const [tEmail, tCode, tExp, tSig] = parts;
    if (tEmail !== email) return { valid: false, reason: 'Email mismatch' };
    if (tCode !== code) return { valid: false, reason: 'Incorrect code' };
    if (Date.now() > parseInt(tExp)) return { valid: false, reason: 'Code expired. Request a new one.' };
    const expectedSig = crypto.createHmac('sha256', SECRET).update(`${email}:${code}:${tExp}`).digest('hex');
    if (tSig !== expectedSig) return { valid: false, reason: 'Invalid token' };
    return { valid: true };
  } catch {
    return { valid: false, reason: 'Invalid token' };
  }
}
