import config from 'config';

import mapKeys from 'lodash/mapKeys';
import set from 'lodash/set';
import get from 'lodash/get';
import trim from 'lodash/trim';

import JSONValue from 'src/shared/types/JSON';

export const getProcessedAttributes = (flatSelectedAttributes: JSONValue) => {
  const filteredAttributes = Object.keys(flatSelectedAttributes).filter(
    (key) => flatSelectedAttributes[key]
  );
  return filteredAttributes.map((value: string) => {
    return value
      .split('.default.')
      .join('.')
      .split('genes.')
      .join('');
  });
};

export const getProcessedFilters = (filters: JSONValue) => {
  const flatSelectedFilters: { [key: string]: boolean } = flattenObject(
    filters
  );

  const selectedFilters = mapKeys(
    flatSelectedFilters,
    (value: boolean, key: string) => {
      return key
        .split('.default.')
        .join('.')
        .split('.genes.')
        .join('.');
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
  method: string = 'query'
) => {
  const processedAttributes = getProcessedAttributes(flatSelectedAttributes);
  const processedFilters = getProcessedFilters(selectedFilters);

  let endpoint = config.genesearchAPIEndpoint + `/genes/${method}?query=`;

  const endpointFilters: JSONValue = {
    genome: 'homo_sapiens'
  };

  // FIXME: Temporarily apply the filters locally
  const gene_ids = get(processedFilters, 'genes.limit_to_genes');
  const gene_biotypes = get(processedFilters, 'genes.biotype');
  const gene_source = get(processedFilters, 'genes.gene_source');

  if (gene_ids) {
    endpointFilters.id = gene_ids
      .join(',')
      .split(',')
      .map(trim)
      .filter(Boolean);
  }

  if (gene_biotypes) {
    endpointFilters.biotype = gene_biotypes;
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

export const flattenObject = (
  objectOrArray: JSONValue,
  prefix = '',
  formatter = (k: string) => k
) => {
  const nestedFormatter = (k: string) => '.' + k;

  const nestElement = (prev: any, value: any, key: any): JSONValue =>
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

const formatResponseToArray = (responseData: any): any => {
  const preResult: any = [];

  const responseArray = flattenObject(responseData);
  Object.keys(responseArray)
    .sort()
    .forEach((key) => {
      const keySplit: string[] = key.split('.');

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

/*
  FIXME: Field titles (displayName) returned from the genesearch API are not properly formatted.
  We need to keep this until the API is updated.
*/
export const attributeDisplayNames: { [key: string]: string } = {
  protein_coding: 'Protein coding',
  type: 'Type',
  source: 'Gene source',
  symbol: 'Gene symbol',
  id: 'Gene stable ID',
  biotype: 'Gene Biotype',
  id_version: 'Gene stable ID version',
  name: 'Gene name',
  Superfamily: 'Superfamily',
  strand: 'Strand',
  start: 'Gene start',
  end: 'Gene end',
  UniParc: 'UniParc',
  BioGRID: 'BioGRID',
  Smart: 'Smart',
  gencode_basic_annotation: 'GENCODE basic annotation',
  uniparc_id: 'UniParc ID',
  ncbi_id: 'NCBI gene ID',
  HGNC: 'HGNC symbol',
  'transcripts.biotype': 'Transcript Biotype',
  'transcripts.name': 'Transcript name',
  'transcripts.id': 'Transcript stable ID',
  'transcripts.type': 'Transcript Type',
  'transcripts.UniGene': 'UniGene',
  'transcripts.Pfam': 'Pfam',
  'transcripts.HGNC_trans_name': 'HGNC_trans_name',
  'transcripts.start': 'Transcript Start',
  'transcripts.end': 'Transcript End',
  'transcripts.Interpro': 'Interpro',
  'transcripts.Smart': 'Smart',
  gc_content: 'Gene % GC content',
  source_gene: 'Source (gene)',
  EntrezGene: 'EntrezGene',
  source_of_name: 'Source of gene name'
};

export const formatResults = (
  apiResult: JSONValue,
  selectedAttributes: JSONValue
) => {
  const formattedResult = formatResponseToArray(apiResult.results);

  const flatSelectedAttributes: { [key: string]: boolean } = flattenObject(
    selectedAttributes
  );

  const processedAttributes = getProcessedAttributes(flatSelectedAttributes);

  const result: string[][] = [];
  result[0] = [];

  processedAttributes.forEach((attribute: string) => {
    result[0].push(attributeDisplayNames[attribute] || attribute);
  });

  let rowCounter = 0;

  Object.values(formattedResult).forEach((entry: any) => {
    rowCounter += 1;
    result[rowCounter] = [];

    processedAttributes.forEach((attribute: string) => {
      result[rowCounter].push(
        entry[attribute] || `${attribute} will be displayed here`
      );
    });
  });

  return result;
};
