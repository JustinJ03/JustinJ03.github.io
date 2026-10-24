export const path = (value = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${value.replace(/^\//, '')}`;
export const httpsUrl = (value: string | null): string | undefined => {
  if (!value) return undefined;
  try { return new URL(value).protocol === 'https:' ? value : undefined; }
  catch { return undefined; }
};
