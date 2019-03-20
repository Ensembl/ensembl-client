export enum AnalyticsCategory {
  GLOBAL = 'Global'
}

export const buildAnalyticsObject = (category: string) => (data: {}) => ({
  ga: {
    category,
    ...data
  }
});

export const getGlobalAnalyticsObject = buildAnalyticsObject(
  AnalyticsCategory.GLOBAL
);
