import config from 'config';

import { SelectedAttribute } from 'src/content/app/custom-download/types/Attributes';

export const fetchCustomDownloadResults = (
  downloadType: string,
  attributes: SelectedAttribute[],
  filters: any
) => {
  let endpoint = config.genesearchAPIEndpoint + '/genes/fetch?query=';

  let endpointFields = '';
  attributes.forEach((attribute: SelectedAttribute) => {
    endpointFields += attribute[2] + ',';
  });

  const endpointFilters: any = {
    genome: 'homo_sapiens'
  };

  Object.keys(filters).forEach((filter: string) => {
    endpointFilters[filter] = filters[filter];
  });

  endpoint =
    endpoint +
    JSON.stringify(endpointFilters) +
    '&fields=' +
    endpointFields +
    '&sort=id&array=true&accept=' +
    downloadType;
  try {
    setTimeout(() => {
      const response = {
        file: endpoint
      };
      window.open(response.file);
    }, 100);
  } catch (error) {
    throw error;
  }
};
