export const PUBLIC_BASE_URL: string =
  (import.meta.env.VITE_PUBLIC_BASE_URL as string | undefined)?.replace(/\/$/, '')
  || (typeof window !== 'undefined' ? window.location.origin : 'https://umrahme.app');

export const PUBLIC_HOST: string = PUBLIC_BASE_URL.replace(/^https?:\/\//, '');

export function slugUrl(slug: string): string {
  return `${PUBLIC_BASE_URL}/t/${slug}`;
}
