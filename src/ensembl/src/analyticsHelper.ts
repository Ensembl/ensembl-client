export type AnalyticsOptions = {
  category: string;
  action: string;
  label?: string;
  nonInteraction?: boolean;
  value?: number;
};

/*
  These dimensions are defined here:
  Analytics -> 2020 -> Admin -> Custom Definitions -> Custom Dimensions
*/
export enum CustomDimensions {
  SPECIES = 'dimension1',
  PAGEVIEW = 'dimension2'
}

export type CustomDimensionOptions = {
  diemension: CustomDimensions;
  value: string;
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
