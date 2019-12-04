import { BreakpointWidth } from './globalConfig';

export const getBreakpoint = (
  key: keyof typeof BreakpointWidth
): BreakpointWidth => {
  if (BreakpointWidth[key] >= BreakpointWidth.DESKTOP) {
    return BreakpointWidth.DESKTOP;
  } else if (BreakpointWidth[key] >= BreakpointWidth.LAPTOP) {
    return BreakpointWidth.LAPTOP;
  } else if (BreakpointWidth[key] >= BreakpointWidth.TABLET) {
    return BreakpointWidth.TABLET;
  } else {
    return BreakpointWidth.PHONE;
  }
};

export const getQueryParamsMap = (queryStr: string) => {
  const params = queryStr.replace('?', '').split('&'); // split all query param pairs

  const paramMap: { [key: string]: string } = {};

  params.forEach((param: string) => {
    const [key, value] = param.split('='); // split param pair into key value

    paramMap[key] = value; // add the param pair into the param map
  });

  return paramMap;
};
