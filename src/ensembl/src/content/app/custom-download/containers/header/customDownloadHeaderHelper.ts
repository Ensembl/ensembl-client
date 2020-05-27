/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import config from 'config';

import mapKeys from 'lodash/mapKeys';
import set from 'lodash/set';
import get from 'lodash/get';

import JSONValue from 'src/shared/types/JSON';
import {
  flattenObject,
  getProcessedAttributes
} from 'src/content/app/custom-download/containers/content/customDownloadContentHelper';
import { ReadFile } from 'src/shared/components/upload/Upload';

export const fetchCustomDownloadResults = (
  downloadType: string,
  attributes: JSONValue,
  filters: JSONValue,
  activeGenomeId: string | null
) => {
  const flatSelectedAttributes: { [key: string]: boolean } = flattenObject(
    attributes
  );

  let endpoint = getEndpointUrl(
    activeGenomeId,
    flatSelectedAttributes,
    filters,
    'fetch'
  );

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
  activeGenomeId: string | null,
  flatSelectedAttributes: JSONValue,
  selectedFilters: JSONValue,
  method = 'query'
) => {
  const processedAttributes = getProcessedAttributes(flatSelectedAttributes);
  const processedFilters = getProcessedFilters(selectedFilters);
  let endpoint = config.genesearchAPIEndpoint + `/genes/${method}?query=`;

  const genome = activeGenomeId
    ? activeGenomeId.split('_').slice(0, 2).join('_')
    : 'homo_sapiens';
  const endpointFilters: JSONValue = {
    genome
  };

  // FIXME: Temporarily apply the filters locally
  const gene_ids: string[] = [];

  const limitToGenes = get(processedFilters, 'genes.limit_to_genes', []);

  limitToGenes.forEach((element: string | ReadFile) => {
    if (typeof element === 'string') {
      gene_ids.push(element);
    } else if (element && element.content) {
      gene_ids.push(element.content as string);
    }
  });

  const gene_biotypes = get(processedFilters, 'genes.biotype');
  const gene_source = get(processedFilters, 'genes.gene_source');

  if (gene_ids.filter(Boolean).length) {
    endpointFilters.id = gene_ids.filter(Boolean).join(',').split(',');
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
