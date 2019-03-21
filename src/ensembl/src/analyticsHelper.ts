export enum AnalyticsCategory {
  GLOBAL = 'Global'
}

export enum AnalyticsTransport {
  BEACON = 'beacon',
  IMAGE = 'image',
  XHR = 'xhr'
}

export type AnalyticsOptions = {
  action?: string;
  label: string;
  nonInteraction?: boolean;
  transport?: AnalyticsTransport;
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
