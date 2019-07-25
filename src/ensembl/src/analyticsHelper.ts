export type AnalyticsOptions = {
  category: string;
  action: string;
  label?: string;
  nonInteraction?: boolean;
  value?: number;
};

export type AnalyticsType = {
  ga: AnalyticsOptions;
};

const buildAnalyticsObject = (data: AnalyticsOptions): AnalyticsType => {
  return {
    ga: data
  };
};

export default buildAnalyticsObject;
