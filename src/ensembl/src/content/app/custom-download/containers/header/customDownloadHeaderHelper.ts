import JSONValue from 'src/shared/types/JSON';
import {
  getEndpointUrl,
  flattenObject
} from 'src/content/app/custom-download/containers/content/result-holder/resultHolderHelper';

export const fetchCustomDownloadResults = (
  downloadType: string,
  attributes: JSONValue,
  filters: JSONValue
) => {
  const flatSelectedAttributes: { [key: string]: boolean } = flattenObject(
    attributes
  );

  let endpoint = getEndpointUrl(flatSelectedAttributes, filters, 'fetch');

  if (downloadType) {
    endpoint += '&accept=' + downloadType;
  }
  window.open(endpoint);
};
