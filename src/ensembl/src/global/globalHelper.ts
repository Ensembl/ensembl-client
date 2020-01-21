export const getQueryParamsMap = (queryStr: string) => {
  const params = queryStr.replace('?', '').split('&'); // split all query param pairs

  const paramMap: { [key: string]: string } = {};

  params.forEach((param: string) => {
    const [key, value] = param.split('='); // split param pair into key value

    paramMap[key] = value; // add the param pair into the param map
  });

  return paramMap;
};
