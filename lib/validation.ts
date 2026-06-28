const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  if (!email || typeof email !== 'string') return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Invalid email format';
  if (email.length > 254) return 'Email too long';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password || typeof password !== 'string') return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (password.length > 128) return 'Password too long';
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain a digit';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain a special character';
  return null;
}

export function validateName(name: string, field: string): string | null {
  if (!name || typeof name !== 'string') return `${field} is required`;
  if (name.length < 2) return `${field} must be at least 2 characters`;
  if (name.length > 50) return `${field} too long`;
  if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(name)) return `${field} contains invalid characters`;
  return null;
}

export function sanitizeString(input: string): string {
  return input.replace(/[<>"'&]/g, '').trim();
}

export function validateAge(age: any): string | null {
  const num = parseInt(age);
  if (isNaN(num) || num < 6 || num > 120) return 'Invalid age (6-120)';
  return null;
}

export function validateHeight(height: any): string | null {
  const num = parseInt(height);
  if (isNaN(num) || num < 100 || num > 250) return 'Invalid height (100-250 cm)';
  return null;
}

export function validateWeight(weight: any): string | null {
  const num = parseFloat(weight);
  if (isNaN(num) || num < 20 || num > 300) return 'Invalid weight (20-300 kg)';
  return null;
}
