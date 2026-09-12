import { headers } from "next/headers";

/**
 * Resolve o IP do cliente a partir dos headers de proxy (Vercel, etc).
 * `x-forwarded-for` pode conter uma lista "cliente, proxy1, proxy2" —
 * o primeiro item é o mais próximo do cliente original.
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers();

  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = headersList.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}
