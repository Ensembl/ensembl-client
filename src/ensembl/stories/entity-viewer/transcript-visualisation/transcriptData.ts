import pick from 'lodash/pick';
import sortBy from 'lodash/sortBy';

import {
  Exon,
  CDS
} from 'src/content/app/entity-viewer/components/transcript-visualisation/TranscriptVisualisation';

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

enum FeatureType {
  Gene = 'Gene',
  Transcript = 'Transcript',
  Unknown = 'Unknown'
}

// the in-response types below describe shape of features retrieved from the rest /overlap endpoint
type GeneInResponse = {
  feature_type: 'gene';
  id: string;
  start: number;
  end: number;
};

type TranscriptInResponse = {
  feature_type: 'transcript';
  id: string;
  Parent: string; // gene id
  start: number;
  end: number;
};

type ExonInResponse = {
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

type FeatureWithParent = TranscriptInResponse | ExonInResponse | CDSInResponse;

type FeatureInResponse =
  | GeneInResponse
  | TranscriptInResponse
  | ExonInResponse
  | CDSInResponse;

export const getTranscriptData = async (
  id: string
): Promise<GeneData | TranscriptData | null> => {
  const featureType = await getFeatureType(id);
  let featuresQuery;

  if (featureType === FeatureType.Gene) {
    featuresQuery = 'feature=gene&feature=transcript&feature=exon&feature=cds';
  } else if (featureType === FeatureType.Transcript) {
    featuresQuery = 'feature=gene&feature=transcript&feature=exon&feature=cds';
  } else {
    // FIXME this should error out
  }

  const url = `https://rest.ensembl.org/overlap/id/${id}?content-type=application/json&${featuresQuery}`;

  const data: FeatureInResponse[] = await fetch(url).then((response) =>
    response.json()
  );

  if (featureType === FeatureType.Gene) {
    return buildGene(id, data);
  } else if (featureType === FeatureType.Transcript) {
    return buildTranscript(id, data);
  } else {
    return null;
  }
};

const getFeatureType = async (id: string) => {
  const url = `https://rest.ensembl.org/lookup/id/${id}?content-type=application/json`;

  const data = await fetch(url).then((response) => response.json());
  return data.object_type;
};

const buildGene = (geneId: string, data: FeatureInResponse[]): GeneData => {
  const gene = data.find((feature) => feature.id === geneId) as GeneInResponse;
  const exons = data.filter((feature) => feature.feature_type === 'exon');
  const transcripts = data
    .filter((feature) => (feature as FeatureWithParent).Parent === geneId)
    .map((feature) => {
      const transcriptExons = exons.filter(
        (exon) => (exon as ExonInResponse).Parent === feature.id
      );
      return {
        type: 'transcript',
        id: feature.id,
        start: feature.start,
        end: feature.end,
        exons: transcriptExons.map((exon) =>
          pick(exon, ['id', 'start', 'end'])
        ),
        cds: buildCDS(feature.id, data)
      };
    }) as TranscriptData[];

  return {
    id: geneId,
    type: 'gene',
    start: gene.start,
    end: gene.end,
    transcripts
  };
};

const buildTranscript = (
  transcriptId: string,
  data: FeatureInResponse[]
): TranscriptData => {
  const transcript = data.find(
    (feature) => feature.id === transcriptId
  ) as TranscriptInResponse;
  const exons = data
    .filter(
      (feature) =>
        feature.feature_type === 'exon' && feature.Parent === transcriptId
    )
    .map((exon) => pick(exon, ['id', 'start', 'end']));
  const cds = buildCDS(transcriptId, data);

  return {
    id: transcriptId,
    type: 'transcript',
    start: transcript.start,
    end: transcript.end,
    exons,
    cds
  };
};

const buildCDS = (transcriptId: string, data: FeatureInResponse[]) => {
  const cdss = data.filter(
    (feature) =>
      feature.feature_type === 'cds' && feature.Parent === transcriptId
  );

  if (!cdss.length) {
    return null;
  }

  const sortedCdss = sortBy(cdss, (cds) => cds.start);
  const firstCds = sortedCdss[0];
  const lastCds = sortedCdss[cdss.length - 1];

  return {
    start: firstCds.start,
    end: lastCds.end
  };
};

/*

export const getTranscriptData = async (
  id: string
): Promise<TranscriptData[]> => {
  const url = `https://rest.ensembl.org/lookup/id/${id}?content-type=application/json;expand=1`;

  const data = await fetch(url).then((response) => response.json());

  return data.Transcript.map((transcript: Transcript) => {
    const exons = transcript.Exon.map((exon: Exon) => ({
      start: exon.start,
      end: exon.end
    }));
    return {
      start: transcript.start,
      end: transcript.end,
      exons
    };
  });
};

*/
