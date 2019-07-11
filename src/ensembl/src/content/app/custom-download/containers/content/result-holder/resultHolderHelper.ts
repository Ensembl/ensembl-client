import config from 'config';

export const getEndpointUrl = (attributes: any, processedFilters: any) => {
  let endpoint = config.genesearchAPIEndpoint + '/genes/query?query=';

  const endpointFilters: any = {
    genome: 'homo_sapiens'
  };

  endpoint =
    endpoint +
    JSON.stringify(endpointFilters) +
    '&fields=' +
    attributes.join(',');

  return endpoint;
};

export const getSelectedAttributes = (attributes: any) => {
  const selectedAttributes: any = [];

  Object.keys(attributes).forEach((section) => {
    Object.keys(attributes[section]).forEach((subSection) => {
      Object.keys(attributes[section][subSection]).forEach((attributeId) => {
        if (attributes[section][subSection][attributeId].isChecked === true) {
          selectedAttributes.push([
            section,
            subSection,
            attributes[section][subSection][attributeId].id,
            attributes[section][subSection][attributeId].label
          ]);
        }
      });
    });
  });

  return selectedAttributes;
};

export const getSelectedFilters = (filters: any) => {
  const selectedFilters: any = {};

  Object.keys(filters).forEach((section: any) => {
    if (typeof filters[section] === 'string') {
      if (filters[section].length > 0) {
        selectedFilters[section] = filters[section];
      }
    } else if (Array.isArray(filters[section])) {
      if (filters[section].length > 0) {
        selectedFilters[section] = filters[section];
      }
    } else if (typeof filters[section] === 'object') {
      Object.keys(filters[section]).forEach((subSection) => {
        Object.keys(filters[section][subSection]).forEach((attributeId) => {
          if (filters[section][subSection][attributeId].isChecked === true) {
            if (!selectedFilters[section]) {
              selectedFilters[section] = [];
            }
            selectedFilters[section].push(attributeId);
          }
        });
      });
    }
  });

  return selectedFilters;
};

export const flattenObject = (
  objectOrArray: any,
  prefix = '',
  formatter = (k: string) => k
) => {
  const nestedFormatter = (k: string) => '.' + k;

  const nestElement = (prev: any, value: any, key: any): any =>
    value && typeof value === 'object'
      ? {
          ...prev,
          ...flattenObject(value, `${prefix}${formatter(key)}`, nestedFormatter)
        }
      : { ...prev, ...{ [`${prefix}${formatter(key)}`]: value } };

  return Array.isArray(objectOrArray)
    ? objectOrArray.reduce(nestElement, {})
    : Object.keys(objectOrArray).reduce(
        (prev, element) => nestElement(prev, objectOrArray[element], element),
        {}
      );
};

const formatResponseToArray = (responseData: any) => {
  const preResult: any = [];

  const responseArray = flattenObject(responseData);
  Object.keys(responseArray)
    .sort()
    .forEach((key) => {
      const keySplit: any = key.split('.');

      let topID = keySplit[0];
      topID += keySplit[2] ? keySplit[2] : '0';
      topID += keySplit[4] ? keySplit[4] : '0';

      let id = keySplit[1];
      if (keySplit[3]) {
        id = `${keySplit[1]}.${keySplit[3]}`;
      }

      if (!preResult[topID]) {
        preResult[topID] = {
          ...preResult[`${keySplit[0]}00`]
        };
      }
      preResult[topID][id] = responseArray[key];
    });

  return preResult;
};

export const formatResults = (apiResult: any) => {
  const formattedResult = formatResponseToArray(apiResult.results);
  const result: string[][] = [];
  result[0] = [];

  const fields: string[][] = [];
  apiResult.fields.forEach((field: any) => {
    fields.push([field.name, field.displayName]);
    result[0].push(field.displayName);
  });

  let rowCounter = 0;

  formattedResult.forEach((entry: any) => {
    rowCounter += 1;
    result[rowCounter] = [];

    fields.forEach((field: string[]) => {
      result[rowCounter].push(entry[field[0]]);
    });
  });

  return result;
};
