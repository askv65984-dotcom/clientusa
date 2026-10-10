import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const N = 16384;
const R = 8;
const P = 1;
const KEY_LENGTH = 32;

function derive(pin: string, salt: Buffer, n = N, r = R, p = P) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(pin, salt, KEY_LENGTH, { N: n, r, p, maxmem: 64 * 1024 * 1024 }, (error, key) =>
      error ? reject(error) : resolve(key),
    );
  });
}

/** Hashes a PIN as "scrypt$N$r$p$salt$hash" (base64 parts). */
export async function hashPin(pin: string) {
  const salt = randomBytes(16);
  const key = await derive(pin, salt);
  return ["scrypt", N, R, P, salt.toString("base64"), key.toString("base64")].join("$");
}

export async function verifyPin(pin: string, stored: string) {
  const [scheme, n, r, p, saltB64, hashB64] = stored.split("$");
  if (scheme !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await derive(pin, Buffer.from(saltB64, "base64"), Number(n), Number(r), Number(p));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export const PIN_PATTERN = /^\d{4,12}$/;
