export type ObjectInfoState = Readonly<{
  object: object;
  objectFetchFailed: boolean;
  objectFetching: boolean;
  trackCategories: [];
}>;

export const defaultObjectInfoState: ObjectInfoState = {
  object: {},
  objectFetchFailed: false,
  objectFetching: false,
  trackCategories: []
};

export type ExampleObjectState = Readonly<{
  exampleObjectsFetchFailed: boolean;
  exampleObjectsFetching: boolean;
  examples: {
    [key: string]: {};
  };
}>;

export const defaultExampleObjectState: ExampleObjectState = {
  exampleObjectsFetchFailed: false,
  exampleObjectsFetching: false,
  examples: {}
};
