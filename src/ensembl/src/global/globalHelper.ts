import { BreakpointWidth } from './globalConfig';

export const getBreakpoint = (width: number): BreakpointWidth => {
  if (width >= BreakpointWidth.BIG_DESKTOP) {
    return BreakpointWidth.BIG_DESKTOP;
  } else if (width >= BreakpointWidth.DESKTOP) {
    return BreakpointWidth.DESKTOP;
  } else if (width >= BreakpointWidth.LAPTOP) {
    return BreakpointWidth.LAPTOP;
  } else if (width >= BreakpointWidth.TABLET) {
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
