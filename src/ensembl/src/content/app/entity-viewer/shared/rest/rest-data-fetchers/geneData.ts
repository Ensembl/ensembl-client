import { restGeneAdaptor } from '../rest-adaptors/rest-gene-adaptor';

import { Gene } from '../../../types/gene';
import { TranscriptInResponse } from './transcriptData';

export type GeneInResponse = {
  object_type: 'Gene';
  id: string;
  biotype: string;
  seq_region_name: string;
  strand: 1 | -1;
  start: number;
  end: number;
  Transcript: TranscriptInResponse[];
  assembly_name: string;
  description: string;
  version: number;
  db_type: string;
  species: string;
  display_name: string;
  source: string;
  logic_name: string;
};

export const fetchGene = async (
  id: string,
  signal?: AbortSignal
): Promise<Gene> => {
  const url = `http://rest.ensembl.org/lookup/id/${id}?expand=1;content-type=application/json`;

  const data: GeneInResponse = (await fetch(url, { signal }).then((response) =>
    response.json()
  )) as GeneInResponse;

  return restGeneAdaptor(data);
};
