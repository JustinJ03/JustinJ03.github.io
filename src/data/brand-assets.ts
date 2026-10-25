import verification from '../../docs/asset-verification.json';

export type BrandAsset = { filename: string; source: string };
/** The checked-in provenance manifest is the single source for verified assets. */
export const brandAssets: Record<string, BrandAsset> = Object.fromEntries(
  verification.assets.map(({ id, filename, source }) => [
    id === 'tailwind' ? 'tailwindcss' : id === 'react-native' ? 'reactnative' : id,
    { filename, source },
  ]),
);
