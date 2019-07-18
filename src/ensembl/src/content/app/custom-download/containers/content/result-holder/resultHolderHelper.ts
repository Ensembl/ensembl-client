import config from 'config';

import { keys, mapKeys, set, get, trim } from 'lodash';

export const getProcessedAttributes = (flatSelectedAttributes: any) => {
  return keys(
    mapKeys(flatSelectedAttributes, (value: boolean, key: string) => {
      return key
        .split('.default.')
        .join('.')
        .split('genes.')
        .join('');
    })
  );
};

const getProcessedFilters = (filters: any) => {
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

  keys(selectedFilters).forEach((path, index) => {
    set(processedFilters, path, selectedFilters[path]);
  });
  return processedFilters;
};

export const getEndpointUrl = (
  flatSelectedAttributes: any,
  selectedFilters: any,
  method: string = 'query'
) => {
  const processedAttributes = getProcessedAttributes(flatSelectedAttributes);

  const processedFilters = getProcessedFilters(selectedFilters);

  let endpoint = config.genesearchAPIEndpoint + `/genes/${method}?query=`;

  const endpointFilters: any = {
    genome: 'homo_sapiens'
  };

  // FIXME: Temporarily apply the filters locally
  const gene_ids = get(
    processedFilters,
    'protein_and_domain_families.family_or_domain_ids.limit_to_genes'
  );
  const gene_biotypes = get(processedFilters, 'genes.gene_type.biotype');
  const gene_source = get(processedFilters, 'genes.gene_source');

  if (gene_ids) {
    endpointFilters.id = gene_ids.split(',').map(trim);
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

export const getSelectedAttributes = (attributes: any) => {
  const selectedAttributes: any = [];

  Object.keys(attributes).forEach((section) => {
    Object.keys(attributes[section]).forEach((subSection) => {
      Object.keys(attributes[section][subSection]).forEach((attributeId) => {
        if (attributes[section][subSection][attributeId].isChecked === true) {
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

  Object.keys(filters).forEach((section: any) => {
    if (typeof filters[section] === 'string') {
      if (filters[section].length > 0) {
        selectedFilters[section] = filters[section];
      }
    } else if (Array.isArray(filters[section])) {
      if (filters[section].length > 0) {
        selectedFilters[section] = filters[section];
      }
    } else if (typeof filters[section] === 'object') {
      Object.keys(filters[section]).forEach((subSection) => {
        Object.keys(filters[section][subSection]).forEach((attributeId) => {
          if (filters[section][subSection][attributeId].isChecked === true) {
            if (!selectedFilters[section]) {
              selectedFilters[section] = [];
            }
            selectedFilters[section].push(attributeId);
          }
        });
      });
    }
  });

  return selectedFilters;
};

export const flattenObject = (
  objectOrArray: any,
  prefix = '',
  formatter = (k: string) => k
) => {
  const nestedFormatter = (k: string) => '.' + k;

  const nestElement = (prev: any, value: any, key: any): any =>
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
      const keySplit: any = key.split('.');

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
const attributeDisplayNames: { [key: string]: string } = {
  protein_coding: 'Protein coding',
  type: 'Type',
  source: 'Gene source',
  symbol: 'Gene symbol',
  id: 'Gene stable ID',
  id_version: 'Gene stable ID version',
  name: 'Gene name',
  Superfamily: 'Superfamily',
  strand: 'Strand',
  start: 'Gene start(bp)',
  end: 'Gene end (bp)',
  UniParc: 'UniParc',
  BioGRID: 'BioGRID',
  Smart: 'Smart',
  gencode_basic_annotation: 'GENCODE basic annotation',
  uniparc_id: 'UniParc ID',
  ncbi_id: 'NCBI gene ID',
  HGNC: 'HGNC symbol',
  'transcripts.biotype': 'Biotype',
  'transcripts.name': 'Transcript name',
  'transcripts.id': 'Transcript stable ID',
  'transcripts.AGD_TRANSCRIPT': 'Ashbya Genome Database',
  'transcripts.type': 'Transcript Type',
  'transcripts.UniGene': 'UniGene',
  'transcripts.Pfam': 'Pfam',
  'transcripts.HGNC_trans_name': 'HGNC_trans_name',
  'transcripts.start': 'Start',
  'transcripts.end': 'End',
  'transcripts.Interpro': 'Interpro',
  'transcripts.Smart': 'Smart',
  'transcripts.analysis': 'Analysis',
  'transcripts.affy_hc_g110_probe': 'AFFY HC G110 probe',
  'transcripts.agilent_sureprint_g3_ge_8x60k_probe':
    'AGILENT SurePrint G3 GE 8x60k probe',
  'transcripts.illumina_humanref_8_v3_probe': 'ILLUMINA HumanRef 8 V3 probe',
  'transcripts.affy_hta_2_0_probe': 'AFFY HTA 2 0 probe',
  'transcripts.codelink_codelink_probe': 'CODELINK CODELINK probe',
  'transcripts.go_domain': 'GO domain',
  'location.genomic_coordinates': 'Genomic coordinates',
  'location.strand': 'Strand',
  'location.start': 'Gene start',
  'location.end': 'Gene end',
  'germline_variation.variant_name': 'Variant name',
  'germline_variation.variant_source': 'Variant source',
  'germline_variation.sift_code': 'SIFT code',
  'germline_variation.protein_allele': 'Protein allele',
  'germline_variation.polyphen_score': 'PolyPhen score',
  'germline_variation.distance_to_transcript': 'Distance to transcript',
  'germline_variation.cds_end': 'CDS end',
  'germline_variation.chromosomescaffold_position_start_bp':
    'Chromosome/scaffold position start (bp)',
  'germline_variation.protein_location_aa': 'Protein location (aa)',
  'germline_variation.cds_start': 'CDS start',
  'somatic_variation.variant_name': 'Variant name',
  'somatic_variation.variant_source': 'Variant source',
  'somatic_variation.sift_code': 'SIFT code',
  'somatic_variation.protein_allele': 'Protein allele',
  'somatic_variation.polyphen_score': 'PolyPhen score',
  'somatic_variation.distance_to_transcript': 'Distance to transcript',
  'somatic_variation.cds_end': 'CDS end',
  'somatic_variation.chromosomescaffold_position_start_bp':
    'Chromosome/scaffold position start (bp)',
  'somatic_variation.protein_location_aa': 'Protein location (aa)',
  'somatic_variation.cds_start': 'CDS start',
  gc_content: 'Gene % GC content',
  source_gene: 'Source (gene)',
  EntrezGene: 'EntrezGene',
  source_of_name: 'Source of gene name'
};

export const formatResults = (apiResult: any, selectedAttributes: any) => {
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
