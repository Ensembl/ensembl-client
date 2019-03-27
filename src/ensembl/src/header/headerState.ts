export type HeaderState = Readonly<{
  accountExpanded: boolean;
  launchbarExpanded: boolean;
}>;

export const defaultState: HeaderState = {
  accountExpanded: false,
  launchbarExpanded: true
};
