import config from 'config';

import mapKeys from 'lodash/mapKeys';
import set from 'lodash/set';
import get from 'lodash/get';
import trim from 'lodash/trim';

import JSONValue from 'src/shared/types/JSON';
import {
  flattenObject,
  getProcessedAttributes
} from 'src/content/app/custom-download/containers/content/customDownloadContentHelper';

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
    const biotype_filters = Object.keys(gene_biotypes).filter(
      (biotype) => gene_biotypes[biotype]
    );
    if (biotype_filters.length) {
      endpointFilters.biotype = Object.keys(gene_biotypes).filter(
        (biotype) => gene_biotypes[biotype]
      );
    }
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
