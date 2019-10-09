import JSONValue from 'src/shared/types/JSON';

import {
  flattenObject,
  getProcessedAttributes
} from 'src/content/app/custom-download/containers/content/customDownloadContentHelper';

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
