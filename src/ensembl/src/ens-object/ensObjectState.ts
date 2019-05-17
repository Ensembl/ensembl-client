import { EnsObject } from './ensObjectTypes';
import { TrackPanelCategory } from 'src/content/app/browser/track-panel/trackPanelConfig';

export type CurrentEnsObjectState = Readonly<{
  ensObjectInfo: EnsObject | {};
  ensObjectFetchFailed: boolean;
  ensObjectFetching: boolean;
  trackCategories: TrackPanelCategory[] | [];
}>;

export const defaultCurrentEnsObjectState: CurrentEnsObjectState = {
  ensObjectInfo: {},
  ensObjectFetchFailed: false,
  ensObjectFetching: false,
  trackCategories: []
};

export type ExampleEnsObjectState = Readonly<{
  exampleEnsObjectsFetchFailed: boolean;
  exampleEnsObjectsFetching: boolean;
  examples: {
    [key: string]: {};
  };
}>;

export const defaultExampleEnsObjectState: ExampleEnsObjectState = {
  exampleEnsObjectsFetchFailed: false,
  exampleEnsObjectsFetching: false,
  examples: {}
};
