import { FeatureSearchMode } from "./search-modes";

export const FeatureSearchModeType = {
  GENE_SEARCH_MODE: 'Gene',
  VARIANT_SEARCH_MODE: 'Variant'
} as const;

export const FEATURE_SEARCH_MODES: FeatureSearchMode[] = [
  {
    mode: FeatureSearchModeType.GENE_SEARCH_MODE,
    label: 'Find a gene',
    placeholder: 'Gene ID or name',
    help: 'Find a gene using a stable ID (versioned or un-versioned), symbol or synonym'
  },
  {
    mode: FeatureSearchModeType.VARIANT_SEARCH_MODE,
    label: 'Find a variant',
    placeholder: 'Variant ID',
    help: 'Find a variant using rsID'
  }
];
