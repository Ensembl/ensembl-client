export type CustomDownloadState = Readonly<{
  preFilterStatuses: {};
  showPreFiltersPanel: boolean;
  selectedTabButton: string;
}>;

export const defaultCustomDownloadState: CustomDownloadState = {
  preFilterStatuses: {},
  showPreFiltersPanel: true,
  selectedTabButton: 'data'
};
