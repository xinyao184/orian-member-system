import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { StaffRole } from "./types";

const COOKIE = "orian_admin";
const secret = () => new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET!);

export interface Session {
  username: string;
  role: StaffRole;
}

// Create a signed session cookie after successful username+password login.
export async function createSession(s: Session) {
  const token = await new SignJWT({ ...s })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret());
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function getSession(): Promise<Session | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return { username: payload.username as string, role: payload.role as StaffRole };
  } catch {
    return null;
  }
}

export function clearSession() {
  cookies().delete(COOKIE);
}

// Guard helper for Owner-only API routes.
export function requireOwner(s: Session | null): s is Session {
  return !!s && s.role === "owner";
}
