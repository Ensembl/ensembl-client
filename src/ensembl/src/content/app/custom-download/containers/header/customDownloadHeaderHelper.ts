import config from 'config';

import Attribute, {
  Attributes
} from 'src/content/app/custom-download/types/Attributes';

export const fetchCustomDownloadResults = (
  downloadType: string,
  attributes: Attribute[],
  filters: any
) => {
  let endpoint = config.genesearchAPIEndpoint + '/genes/fetch?query=';

  let endpointFields = '';
  attributes.forEach((attribute: Attribute) => {
    endpointFields += attribute.id + ',';
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

  window.open(endpoint);
};
