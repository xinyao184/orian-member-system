"use client";

export async function api<T = any>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts?.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any)?.error ?? "err_generic");
  return data as T;
}

export const IG_BRAND = "https://www.instagram.com/orian.dessert";
export const igUrl = (handle: string) => `https://www.instagram.com/${handle.replace(/^@/, "")}`;
