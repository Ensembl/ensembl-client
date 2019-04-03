export enum AnalyticsCategory {
  BROWSER = 'Browser',
  DRAWER = 'Drawer',
  GLOBAL = 'Global',
  HEADER = 'Header',
  ENS_OBJECT = 'Ensembl Object',
  TRACK_PANEL = 'Track Panel'
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

export const getBrowserAnalyticsObject = buildAnalyticsObject(
  AnalyticsCategory.BROWSER
);

export const getDrawerAnalyticsObject = buildAnalyticsObject(
  AnalyticsCategory.DRAWER
);

export const getGlobalAnalyticsObject = buildAnalyticsObject(
  AnalyticsCategory.GLOBAL
);

export const getHeaderAnalyticsObject = buildAnalyticsObject(
  AnalyticsCategory.HEADER
);

export const getEnsObjectAnalyticsObject = buildAnalyticsObject(
  AnalyticsCategory.ENS_OBJECT
);

export const getTrackPanelAnalyticsObject = buildAnalyticsObject(
  AnalyticsCategory.TRACK_PANEL
);
