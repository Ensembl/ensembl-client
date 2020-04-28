import {
  GeneInResponse,
  TranscriptInResponse,
  ExonInResponse,
  TranslationInResponse,
} from './transcriptData';
import { GeneFromLookup } from '../../../types/gene';
import { restGeneFromLookupAdaptor } from '../rest-adaptors/rest-gene-adaptor';

export type GeneInLookupResponse = Pick<
  GeneInResponse,
  'id' | 'biotype' | 'seq_region_name' | 'strand' | 'start' | 'end'
> & {
  Transcript: TranscriptInLookupResponse[];
  assembly_name: string;
  description: string;
  version: number;
  db_type: string;
  species: string;
  display_name: string;
  source: string;
  logic_name: string;
  object_type: 'Gene';
};

export type TranscriptInLookupResponse = Pick<
  TranscriptInResponse,
  'id' | 'biotype' | 'seq_region_name' | 'strand' | 'Parent' | 'start' | 'end'
> & {
  is_canonical: number;
  object_type: 'Transcript';
  Translation?: TranslationInLookupResponse;
  logic_name: string;
  source: string;
  display_name: string;
  species: string;
  db_type: string;
  version: number;
  assembly_name: number;
  Exon: ExonInLookupResponse[];
};

export type TranslationInLookupResponse = Pick<
  TranslationInResponse,
  'id' | 'object_type' | 'Parent' | 'start' | 'end' | 'length'
> & {
  db_type: string;
  species: string;
};

export type ExonInLookupResponse = Pick<
  ExonInResponse,
  'id' | 'start' | 'end'
> & {
  species: string;
  db_type: string;
  strand: number;
  object_type: 'Exon';
  seq_region_name: string;
  assembly_name: string;
  version: string;
};

export const fetchGeneFromLookup = async (
  id: string
): Promise<GeneFromLookup> => {
  const url = `http://rest.ensembl.org/lookup/id/${id}?expand=1;content-type=application/json`;

  const data: GeneInLookupResponse = (await fetch(url).then((response) =>
    response.json()
  )) as GeneInLookupResponse;

  return restGeneFromLookupAdaptor(id, data);
};
