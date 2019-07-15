import { Attributes } from 'src/content/app/custom-download/types/Attributes';
import {
  getEndpointUrl,
  flattenObject
} from 'src/content/app/custom-download/containers/content/result-holder/resultHolderHelper';

export const fetchCustomDownloadResults = (
  downloadType: string,
  attributes: Attributes,
  filters: any
) => {
  const flatSelectedAttributes: { [key: string]: boolean } = flattenObject(
    attributes
  );

  const endpoint = getEndpointUrl(flatSelectedAttributes, filters, 'fetch');

  window.open(endpoint);
};
