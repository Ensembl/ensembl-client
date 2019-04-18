import { sampleResults } from 'src/content/app/custom-download/sampledata';
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
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const result = await getCustomDownloadPreviewResults(
    selectedAttributes,
    selectedFilters
  );

  console.log(result);

  props.setPreviewResult(result);
};

export const formatResults = (apiResult: any, selectedAttributes: any) => {
  const apiResultFields: any = [];

  const apiResultData = apiResult.results;

  apiResult.fields.forEach((field: any) => {
    apiResultFields.push(field.name);
  });

  const result: any = Array(apiResultData.length + 1);
  result[0] = [];
  selectedAttributes.forEach((attribute: string) => {
    result[0].push(attribute[3]);

    const currentAttributeID = attribute[2];

    // Check if the current attribute ID is available in the fields list
    apiResultData.forEach((resultRow: any, rowNumber: number) => {
      if (!result[rowNumber + 1]) {
        result[rowNumber + 1] = [];
      }
      if (sampleResults[currentAttributeID]) {
        result[rowNumber + 1].push(
          sampleResults[currentAttributeID][rowNumber]
        );
      } else if (apiResultFields.includes(currentAttributeID)) {
        const dataIndex = apiResultFields.indexOf(currentAttributeID);
        const data = resultRow[dataIndex] ? resultRow[dataIndex] : '-';
        result[rowNumber + 1].push(data);
      } else {
        result[rowNumber + 1].push('-');
      }
    });
  });

  return result;
};
