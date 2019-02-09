export enum WidthType {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'medium'
}

export type GlobalState = Readonly<{
  globalWidth: WidthType;
}>;

export const defaultState: GlobalState = {
  globalWidth: WidthType.LARGE
};
