// The site is served either from a domain root ("/") or from a subpath such as
// "/Codesheet/" on github.io, chosen by BASE_PATH at build time. Build every
// internal link with withBase() so it works in both places.
export const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function withBase(path) {
  return `${base}${path}`;
}
