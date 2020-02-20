import sortBy from 'lodash/sortBy';

import {
  TranscriptInResponse,
  ExonInResponse,
  FeatureInResponse
} from 'src/content/app/entity-viewer/shared/rest/rest-data-fetchers/transcriptData';

import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { Strand } from 'src/content/app/entity-viewer/types/strand';
import { Exon } from 'src/content/app/entity-viewer/types/exon';
import { CDS } from 'src/content/app/entity-viewer/types/cds';

// transform ensembl rest /overlap data into a transcript data structure
export const restTranscriptAdaptor = (
  transcriptId: string,
  data: FeatureInResponse[]
) => {
  const transcript = data.find(
    (feature) => feature.id === transcriptId
  ) as TranscriptInResponse;
  return buildTranscript(transcript, data);
};

export const buildTranscript = (
  transcript: TranscriptInResponse,
  data: FeatureInResponse[]
): Transcript => {
  const exons = data
    .filter(
      (feature) =>
        feature.feature_type === 'exon' && feature.Parent === transcript.id
    )
    .map((exon) => buildExon(exon as ExonInResponse, transcript));
  const cds = buildCDS(transcript, data);

  return {
    type: 'Transcript',
    id: transcript.id,
    symbol: transcript.external_name,
    so_term: transcript.biotype,
    slice: {
      location: {
        start: transcript.start,
        end: transcript.end
      },
      region: {
        name: transcript.seq_region_name,
        strand: {
          code: transcript.strand === 1 ? Strand.FORWARD : Strand.REFVERSE
        }
      }
    },
    exons,
    cds
  };
};

const buildExon = (
  exon: ExonInResponse,
  transcript: TranscriptInResponse
): Exon => {
  return {
    id: exon.id,
    slice: {
      location: {
        start: exon.start,
        end: exon.end
      }
    },
    relative_location: {
      start: calculateRelativeLocation(exon.start, transcript.start),
      end: calculateRelativeLocation(exon.end, transcript.start)
    }
  };
};

const buildCDS = (
  transcript: TranscriptInResponse,
  data: FeatureInResponse[]
): CDS | null => {
  const cdss = data.filter(
    (feature) =>
      feature.feature_type === 'cds' && feature.Parent === transcript.id
  );

  if (!cdss.length) {
    return null;
  }

  const sortedCdss = sortBy(cdss, (cds) => cds.start);
  const firstCds = sortedCdss[0];
  const lastCds = sortedCdss[cdss.length - 1];

  return {
    start: firstCds.start,
    end: lastCds.end,
    relative_location: {
      start: calculateRelativeLocation(firstCds.start, transcript.start),
      end: calculateRelativeLocation(lastCds.end, transcript.start)
    }
  };
};

const calculateRelativeLocation = (
  featurePosition: number,
  parentPosition: number
) => {
  return featurePosition - parentPosition; // not sure if this is correct
};
