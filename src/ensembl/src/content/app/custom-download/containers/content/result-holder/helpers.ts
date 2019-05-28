import getCustomDownloadPreviewResults from 'src/services/custom-download.ts';

export const getSelectedAttributes = (attributes: any) => {
  const selectedAttributes: any = [];

  Object.keys(attributes).forEach((section) => {
    Object.keys(attributes[section]).forEach((subSection) => {
      Object.keys(attributes[section][subSection]).forEach((attributeId) => {
        if (
          attributes[section][subSection][attributeId].checkedStatus === true
        ) {
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

  Object.keys(filters).forEach((section) => {
    Object.keys(filters[section]).forEach((subSection) => {
      Object.keys(filters[section][subSection]).forEach((attributeId) => {
        if (filters[section][subSection][attributeId].checkedStatus === true) {
          if (!selectedFilters[section]) {
            selectedFilters[section] = [];
          }

          selectedFilters[section].push(attributeId);
        }
      });
    });
  });

  return selectedFilters;
};

export const fetchPreviewResults = async (
  props: any,
  selectedAttributes: any,
  selectedFilters: any
) => {
  props.setPreviewResult({});
  const result = await getCustomDownloadPreviewResults(
    selectedAttributes,
    selectedFilters
  );

  props.setPreviewResult(result);
};

const flattenResponse = (
  objectOrArray: any,
  prefix = '',
  formatter = (k: string) => k
) => {
  const nestedFormatter = (k: string) => '.' + k;

  const nestElement = (prev: any, value: any, key: any): any =>
    value && typeof value === 'object'
      ? {
          ...prev,
          ...flattenResponse(
            value,
            `${prefix}${formatter(key)}`,
            nestedFormatter
          )
        }
      : { ...prev, ...{ [`${prefix}${formatter(key)}`]: value } };

  return Array.isArray(objectOrArray)
    ? objectOrArray.reduce(nestElement, {})
    : Object.keys(objectOrArray).reduce(
        (prev, element) => nestElement(prev, objectOrArray[element], element),
        {}
      );
};

const formatResponse = (responseData: any) => {
  const preResult: any = [];

  const responseArray = flattenResponse(responseData);

  Object.keys(responseArray)
    .sort()
    .forEach((key) => {
      const keySplit = key.split('.');

      let innerIndex = 0;
      if (keySplit[2]) {
        innerIndex = Number(keySplit[2]);
      }
      if (!preResult[keySplit[0]]) {
        preResult[keySplit[0]] = {};
      }
      if (!preResult[keySplit[0]][innerIndex]) {
        preResult[keySplit[0]][innerIndex] = { ...preResult[keySplit[0]][0] };
      }
      let id = keySplit[1];

      if (keySplit[3]) {
        id = `${keySplit[1]}.${keySplit[3]}`;
      }

      preResult[keySplit[0]][innerIndex][id] = responseArray[key];
    });

  const result: any = [];
  preResult.forEach((entry: any) => {
    Object.values(entry).forEach((row) => {
      result.push(row);
    });
  });

  return result;
};

export const formatResults = (apiResult: any, selectedAttributes: any) => {
  const formattedResult = formatResponse(apiResult.results);

  const result: any = [];
  // Populate the header row
  result[0] = [];
  selectedAttributes.forEach((attribute: string) => {
    result[0].push(attribute[3]);
  });

  let rowCounter = 0;

  formattedResult.forEach((entry: any) => {
    rowCounter += 1;
    result[rowCounter] = [];

    selectedAttributes.forEach((field: string[]) => {
      result[rowCounter].push(entry[field[2]]);
    });
  });

  return result;
};
