export enum AnalyticsCategory {
  GLOBAL = 'Global',
  HEADER = 'Header'
}

export type AnalyticsOptions = {
  action?: string;
  label: string;
  nonInteraction?: boolean;
  value?: number;
};

export type AnalyticsType = {
  ga: {
    category: AnalyticsCategory;
  } & AnalyticsOptions;
};

export const buildAnalyticsObject = (category: AnalyticsCategory) => (
  data: AnalyticsOptions | string
): AnalyticsType => {
  data = typeof data === 'string' ? { label: data } : data;

  return {
    ga: {
      category,
      ...data
    }
  };
};

export const getGlobalAnalyticsObject = buildAnalyticsObject(
  AnalyticsCategory.GLOBAL
);

export const getHeaderAnalyticsObject = buildAnalyticsObject(
  AnalyticsCategory.HEADER
);
