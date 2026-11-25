// The site is served either from a domain root ("/") or from a subpath such as
// "/Codesheet/" on github.io, chosen by BASE_PATH at build time. Build every
// internal link with withBase() so it works in both places.
export const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function withBase(path) {
  return `${base}${path}`;
}

// Every page exists in English and Chinese: "/cpp/" ↔ "/zh/cpp/", "/" ↔ "/zh/".
// Takes a path below the base and returns both versions, also below the base.
export function langPaths(path) {
  const en = path.replace(/^\/zh(\/|$)/, '/');
  return { en, zh: en === '/' ? '/zh/' : `/zh${en}` };
}
