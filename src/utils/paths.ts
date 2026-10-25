/** All local URLs work on both a user site and a GitHub Pages project site. */
export function withBase(path = ''): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
