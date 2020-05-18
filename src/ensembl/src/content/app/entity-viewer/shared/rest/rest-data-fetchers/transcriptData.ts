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

export type ProteinFeature = {
  translation_id: number;
  description: string;
  start: number;
  id: string;
  type: string;
  end: number;
};

export const fetchTranscript = async (
  id: string,
  signal?: AbortSignal
): Promise<Transcript> => {
  const transcriptUrl = `http://rest.ensembl.org/lookup/id/${id}?expand=1;content-type=application/json`;
  const transcript: TranscriptInResponse = (await fetch(transcriptUrl, {
    signal
  }).then((response) => response.json())) as TranscriptInResponse;

  let proteinFeatures;

  if (transcript.Translation) {
    const proteinFeaturesUrl = `https://rest.ensembl.org/overlap/translation/${transcript.Translation.id}?feature=protein_feature;content-type=application/json`;

    proteinFeatures = (await fetch(proteinFeaturesUrl, {
      signal
    }).then((response) => response.json())) as ProteinFeature[];
  }

  return restTranscriptAdaptor(transcript, proteinFeatures);
};
