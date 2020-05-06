import { restTranscriptAdaptor } from 'src/content/app/entity-viewer/shared/rest/rest-adaptors/rest-transcript-adaptor';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

export type TranscriptInResponse = {
  object_type: 'Transcript';
  id: string;
  biotype: string;
  seq_region_name: string;
  strand: 1 | -1;
  Parent: string; // gene id
  start: number;
  end: number;
  is_canonical: number;
  Translation?: TranslationInResponse;
  logic_name: string;
  source: string;
  display_name: string;
  species: string;
  db_type: string;
  version: number;
  assembly_name: number;
  Exon: ExonInResponse[];
};

export type TranslationInResponse = {
  object_type: 'Translation';
  id: string;
  Parent: string; // transcript id
  start: number;
  end: number;
  length: number;
  db_type: string;
  species: string;
};

export type ExonInResponse = {
  object_type: 'Exon';
  id: string;
  start: number;
  end: number;
  species: string;
  db_type: string;
  strand: number;
  seq_region_name: string;
  assembly_name: string;
  version: string;
};

export const fetchTranscript = async (id: string): Promise<Transcript> => {
  const url = `http://rest.ensembl.org/lookup/id/${id}?expand=1;content-type=application/json`;

  const data: TranscriptInResponse = (await fetch(url).then((response) =>
    response.json()
  )) as TranscriptInResponse;

  return restTranscriptAdaptor(data);
};
