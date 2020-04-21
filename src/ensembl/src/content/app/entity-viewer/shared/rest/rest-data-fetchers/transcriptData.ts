import { restGeneAdaptor } from 'src/content/app/entity-viewer/shared/rest/rest-adaptors/rest-gene-adaptor';
import { restTranscriptAdaptor } from 'src/content/app/entity-viewer/shared/rest/rest-adaptors/rest-transcript-adaptor';

import { Gene } from 'src/content/app/entity-viewer/types/gene';
import { Transcript } from 'src/content/app/entity-viewer/types/transcript';

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

export type TranslationInResponse = {
  object_type: 'Translation';
  feature_type: 'Translation';
  id: string;
  Parent: string; // transcript id
  start: number;
  end: number;
  length: number;
  protein_domains_resources: ProteinFeature[];
};

export type ProteinFeature = {
  translation_id: number;
  description: string;
  start: number;
  id: string;
  type: string;
  end: number;
};

export type FeatureWithParent =
  | TranscriptInResponse
  | ExonInResponse
  | CDSInResponse
  | TranslationInResponse;

export type FeatureInResponse =
  | GeneInResponse
  | TranscriptInResponse
  | ExonInResponse
  | CDSInResponse
  | TranslationInResponse;

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

  const translationUrl = `https://rest.ensembl.org/lookup/id/${id}?content-type=application/json;expand=1`;

  const translationData = await fetch(translationUrl).then((response) =>
    response.json()
  );
  const proteinFeaturesUrl = `https://rest.ensembl.org/overlap/translation/${translationData.Translation.id}?feature=protein_feature;content-type=application/json`;

  translationData.Translation.protein_domains_resources = await fetch(
    proteinFeaturesUrl
  ).then((response) => response.json());

  data.push(translationData.Translation);
  return restTranscriptAdaptor(id, data);
};
