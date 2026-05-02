const BLOCKED_PASSWORDS = new Set([
  "password",
  "password123",
  "12345678",
  "123456789",
  "qwerty123",
  "admin12345!",
  "user12345!",
  "pass12345!"
]);

export function validatePasswordStrength(password = "") {
  if (typeof password !== "string") {
    return { ok: false, message: "Password format is invalid" };
  }

  const normalized = password.trim();
  if (normalized.length < 12) {
    return { ok: false, message: "Password must be at least 12 characters" };
  }

  if (!/[a-z]/.test(normalized)) {
    return { ok: false, message: "Password must include a lowercase letter" };
  }

  if (!/[A-Z]/.test(normalized)) {
    return { ok: false, message: "Password must include an uppercase letter" };
  }

  if (!/[0-9]/.test(normalized)) {
    return { ok: false, message: "Password must include a number" };
  }

  if (!/[^A-Za-z0-9]/.test(normalized)) {
    return { ok: false, message: "Password must include a symbol" };
  }

  if (BLOCKED_PASSWORDS.has(normalized.toLowerCase())) {
    return {
      ok: false,
      message: "This password is too common or has appeared in breaches. Use a different one."
    };
  }

  return { ok: true, message: "OK" };
}
