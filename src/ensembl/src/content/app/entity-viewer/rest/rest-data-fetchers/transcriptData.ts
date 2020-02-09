import {
  Exon,
  CDS
} from 'src/content/app/entity-viewer/components/transcript-visualisation/TranscriptVisualisation';

import { restGeneAdaptor } from 'src/content/app/entity-viewer/rest/rest-adaptors/rest-gene-adaptor';
import { restTranscriptAdaptor } from 'src/content/app/entity-viewer/rest/rest-adaptors/rest-transcript-adaptor';

import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

// FIXME — change
export type TranscriptData = {
  type: 'transcript';
  id: string;
  start: number;
  end: number;
  exons: Exon[];
  cds: CDS;
};

export type GeneData = {
  type: 'gene';
  id: string;
  start: number;
  end: number;
  transcripts: TranscriptData[];
};

// the in-response types below describe shape of features retrieved from the rest /overlap endpoint
export type GeneInResponse = {
  feature_type: 'gene';
  id: string;
  biotype: string;
  external_name: string;
  seq_region_name: string;
  strand: 1 | -1;
  start: number;
  end: number;
};

export type TranscriptInResponse = {
  feature_type: 'transcript';
  id: string;
  external_name: string;
  biotype: string;
  seq_region_name: string;
  strand: 1 | -1;
  Parent: string; // gene id
  start: number;
  end: number;
};

export type ExonInResponse = {
  feature_type: 'exon';
  id: string;
  Parent: string; // transcript id
  start: number;
  end: number;
};

type CDSInResponse = {
  feature_type: 'cds';
  id: string;
  Parent: string; // transcript id
  start: number;
  end: number;
};

export type FeatureWithParent =
  | TranscriptInResponse
  | ExonInResponse
  | CDSInResponse;

export type FeatureInResponse =
  | GeneInResponse
  | TranscriptInResponse
  | ExonInResponse
  | CDSInResponse;

export const fetchGene = async (id: string): Promise<Gene> => {
  const featuresQuery =
    'feature=gene&feature=transcript&feature=exon&feature=cds';
  const url = `https://rest.ensembl.org/overlap/id/${id}?content-type=application/json&${featuresQuery}`;

  const data: FeatureInResponse[] = (await fetch(url).then((response) =>
    response.json()
  )) as FeatureInResponse[];

  return restGeneAdaptor(id, data);
};

export const fetchTranscript = async (id: string): Promise<Transcript> => {
  const featuresQuery =
    'feature=gene&feature=transcript&feature=exon&feature=cds';
  const url = `https://rest.ensembl.org/overlap/id/${id}?content-type=application/json&${featuresQuery}`;

  const data: FeatureInResponse[] = (await fetch(url).then((response) =>
    response.json()
  )) as FeatureInResponse[];

  return restTranscriptAdaptor(id, data);
};
