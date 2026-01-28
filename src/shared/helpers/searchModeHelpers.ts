
export const FeatureSearchMode = {
  GENE_SEARCH_MODE: 'Gene',
  VARIANT_SEARCH_MODE: 'Variant'
} as const;

export type FeatureSearchModeType = typeof FeatureSearchMode[keyof typeof FeatureSearchMode];

export type FeatureSearchLabels = {
  label: string;
  placeholder: string;
  help?: string;
};

const featureSearchModeLabels: Record<FeatureSearchModeType, FeatureSearchLabels> = {
  [FeatureSearchMode.GENE_SEARCH_MODE]: {
    label: 'Find a gene',
    placeholder: 'Gene ID or name',
    help: 'Find a gene using a stable ID (versioned or un-versioned), symbol or synonym'
  },
  [FeatureSearchMode.VARIANT_SEARCH_MODE]: {
    label: 'Find a variant',
    placeholder: 'Variant ID',
    help: 'Find a variant using rsID'
  }
};

export const getFeatureSearchModes = () => {
  return Object.values(FeatureSearchMode);
}

export const getFeatureSearchLabelsByMode = (mode: FeatureSearchModeType): FeatureSearchLabels => {
  return featureSearchModeLabels[mode];
};

export const getFeatureSearchModeByLocation = (locationPathname: string): FeatureSearchModeType => {
  return locationPathname.includes('/variant')
    ? FeatureSearchMode.VARIANT_SEARCH_MODE
    : FeatureSearchMode.GENE_SEARCH_MODE;
}
