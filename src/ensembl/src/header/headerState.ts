export type HeaderState = Readonly<{
  accountExpanded: boolean;
  currentApp: string;
  launchbarExpanded: boolean;
}>;

export const defaultState: HeaderState = {
  accountExpanded: false,
  currentApp: '',
  launchbarExpanded: true
};
