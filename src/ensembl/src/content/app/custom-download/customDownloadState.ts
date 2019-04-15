export type CustomDownloadState = Readonly<{
  selectedPreFilter: string;
  showPreFiltersPanel: boolean;
  selectedTabButton: string;
  attributes: any;
  filters: {};
}>;

export const defaultCustomDownloadState: CustomDownloadState = {
  selectedPreFilter: '',
  showPreFiltersPanel: true,
  selectedTabButton: 'attributes',
  attributes: {},
  filters: {}
};
