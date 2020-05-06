import { Transcript } from 'src/content/app/entity-viewer/types/transcript';
import { CDS } from '../../../types/cds';
import { Strand } from 'src/content/app/entity-viewer/types/strand';
import { Exon } from 'src/content/app/entity-viewer/types/exon';
import {
  TranscriptInResponse,
  ExonInResponse,
  TranslationInResponse
} from '../rest-data-fetchers/transcriptData';

export const restTranscriptAdaptor = (data: TranscriptInResponse) => {
  return buildTranscriptFromLookup(data);
};

export const buildTranscriptFromLookup = (
  transcript: TranscriptInResponse
): Transcript => {
  const exons = transcript.Exon.map((exon) => buildExon(exon, transcript));
  let cds = null;

  if (transcript.Translation) {
    cds = buildCDSFromLookup(transcript.Translation, transcript);
  }

  return {
    type: 'Transcript',
    id: transcript.id,
    symbol: transcript.display_name,
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

const buildCDSFromLookup = (
  translation: TranslationInResponse,
  transcript: TranscriptInResponse
): CDS => {
  return {
    protein: {
      id: translation.id,
      length: translation.length
    },
    start: translation.start,
    end: translation.end,
    relative_location: {
      start: calculateRelativeLocation(translation.start, transcript.start),
      end: calculateRelativeLocation(translation.end, transcript.start)
    }
  };
};

const calculateRelativeLocation = (
  featurePosition: number,
  parentPosition: number
) => {
  return featurePosition - parentPosition; // not sure if this is correct
};
