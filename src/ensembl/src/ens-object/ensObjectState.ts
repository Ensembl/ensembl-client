export type EnsObjectInfoState = Readonly<{
  ensObject: object;
  ensObjectFetchFailed: boolean;
  ensObjectFetching: boolean;
  trackCategories: [];
}>;

export const defaultEnsObjectInfoState: EnsObjectInfoState = {
  ensObject: {},
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
