import config from 'config';

import mapKeys from 'lodash/mapKeys';
import set from 'lodash/set';
import get from 'lodash/get';
import trim from 'lodash/trim';

import {
  flattenObject,
  getProcessedAttributes
} from 'src/content/app/custom-download/containers/content/customDownloadContentHelper';

import JSONValue from 'src/shared/types/JSON';

export const getProcessedFilters = (filters: JSONValue) => {
  const flatSelectedFilters: { [key: string]: boolean } = flattenObject(
    filters
  );

  const selectedFilters = mapKeys(
    flatSelectedFilters,
    (value: boolean, key: string) => {
      return key.replace(/\.default\./g, '.').replace(/\.genes\./g, '.');
    }
  );

  const processedFilters = {};

  Object.keys(selectedFilters).forEach((path) => {
    set(processedFilters, path, selectedFilters[path]);
  });
  return processedFilters;
};

export const getEndpointUrl = (
  flatSelectedAttributes: JSONValue,
  selectedFilters: JSONValue,
  method = 'query'
) => {
  const processedAttributes = getProcessedAttributes(flatSelectedAttributes);
  const processedFilters = getProcessedFilters(selectedFilters);
  let endpoint = config.genesearchAPIEndpoint + `/genes/${method}?query=`;

  const endpointFilters: JSONValue = {
    genome: 'homo_sapiens'
  };

  // FIXME: Temporarily apply the filters locally
  const gene_ids = get(processedFilters, 'genes.limit_to_genes', [])
    .join(',')
    .split(',')
    .map(trim)
    .filter(Boolean);
  const gene_biotypes = get(processedFilters, 'genes.biotype');
  const gene_source = get(processedFilters, 'genes.gene_source');

  if (gene_ids.length) {
    endpointFilters.id = gene_ids;
  }

  if (gene_biotypes) {
    endpointFilters.biotype = Object.keys(gene_biotypes);
  }
  if (gene_source) {
    endpointFilters.source = gene_source;
  }

  endpoint =
    endpoint +
    JSON.stringify(endpointFilters) +
    '&fields=' +
    processedAttributes.join(',');

  return endpoint;
};
