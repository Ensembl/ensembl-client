/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useDefaultEntityViewerTranscriptQuery } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';
import { useRefgetSequenceQuery } from 'src/shared/state/api-slices/refgetSlice';

import type { DefaultEntityViewerTranscriptQueryResult } from 'src/content/app/entity-viewer/state/api/queries/transcriptDefaultQuery';

type Params = {
  genomeId: string;
  transcriptId: string;
};

// This type flattens out exon data,
// combines spliced exon with phased exon,
// and adds exon sequence
export type EnrichedExon = {
  type: 'exon';
  index: number;
  stable_id: string;
  start: number;
  end: number;
  length: number;
  relativeStart: number;
  relativeEnd: number;
  startPhase: number | null;
  endPhase: number | null;
  sequence: string;
};

export type EnrichedIntron = {
  type: 'intron';
  index: number;
  id: string;
  start: number;
  end: number;
  length: number;
  relativeStart: number;
  relativeEnd: number;
  sequence: string;
};

const useExonsData = ({ genomeId, transcriptId }: Params) => {
  const {
    currentData: transcriptQueryCurrentData,
    isFetching: isTranscriptFetching,
    isError: isTranscriptError
  } = useDefaultEntityViewerTranscriptQuery({
    genomeId,
    transcriptId
  });
  const refgetQueryParams = getRefgetQueryParams(
    transcriptQueryCurrentData?.transcript
  ) ?? { checksum: '' };
  const {
    currentData: refgetQueryCurrentData,
    isFetching: isSequenceFetching,
    isError: isSequenceError
  } = useRefgetSequenceQuery(refgetQueryParams, { skip: !refgetQueryParams });

  const requestStatusParams = {
    isLoading: isTranscriptFetching || isSequenceFetching,
    isError: isTranscriptError || isSequenceError
  };

  if (!transcriptQueryCurrentData || !refgetQueryCurrentData) {
    return {
      data: null,
      ...requestStatusParams
    };
  }

  const { enrichedExons: exons } = prepareExonsData({
    transcript: transcriptQueryCurrentData.transcript,
    sequence: refgetQueryCurrentData
  });
  const introns: EnrichedIntron[] = prepareIntrons({
    transcript: transcriptQueryCurrentData.transcript,
    sequence: refgetQueryCurrentData
  });
  const exonsAndIntrons = combineExonsAndIntrons({ exons, introns });

  return {
    data: {
      exons,
      introns,
      exonsAndIntrons
    },
    ...requestStatusParams
  };
};

const getRefgetQueryParams = (
  transcript: DefaultEntityViewerTranscriptQueryResult['transcript'] | undefined
) => {
  if (!transcript) {
    return null;
  }
  return {
    checksum: transcript.slice.region.sequence.checksum,
    start: transcript.slice.location.start,
    end: transcript.slice.location.end,
    strand: transcript.slice.strand.code
  };
};

const prepareExonsData = ({
  transcript,
  sequence
}: {
  transcript: DefaultEntityViewerTranscriptQueryResult['transcript'];
  sequence: string;
}) => {
  const exons = transcript.spliced_exons;
  const enrichedExons: EnrichedExon[] = [];

  for (const exon of exons) {
    const enrichedExon: EnrichedExon = {
      type: 'exon',
      index: exon.index,
      stable_id: exon.exon.stable_id,
      start: exon.exon.slice.location.start,
      end: exon.exon.slice.location.end,
      length: exon.exon.slice.location.length,
      relativeStart: exon.relative_location.start,
      relativeEnd: exon.relative_location.end,
      startPhase: null,
      endPhase: null,
      sequence: getFeatureSequence({
        feature: exon,
        transcriptSequence: sequence
      })
    };
    enrichedExons.push(enrichedExon);
  }

  const phasedExons =
    transcript.product_generating_contexts[0]?.phased_exons ?? [];

  for (const phasedExon of phasedExons) {
    const {
      start_phase,
      end_phase,
      exon: { stable_id }
    } = phasedExon;
    const enrichedExon = enrichedExons.find(
      (exon) => exon.stable_id === stable_id
    );
    if (!enrichedExon) {
      continue;
    }
    enrichedExon.startPhase = start_phase;
    enrichedExon.endPhase = end_phase;
  }

  return {
    enrichedExons
  };
};

const prepareIntrons = ({
  transcript,
  sequence
}: {
  transcript: DefaultEntityViewerTranscriptQueryResult['transcript'];
  sequence: string;
}): EnrichedIntron[] => {
  const { introns } = transcript;

  return introns.map((intron) => ({
    type: 'intron',
    index: intron.index,
    id: generateIntronId(intron),
    start: intron.slice.location.start,
    end: intron.slice.location.end,
    length: intron.slice.location.length,
    relativeStart: intron.relative_location.start,
    relativeEnd: intron.relative_location.end,
    sequence: getFeatureSequence({
      feature: intron,
      transcriptSequence: sequence
    })
  }));
};

const generateIntronId = (
  intron: DefaultEntityViewerTranscriptQueryResult['transcript']['introns'][number]
) => {
  return `Intron ${intron.index}-${intron.index + 1}`;
};

const getFeatureSequence = ({
  feature,
  transcriptSequence
}: {
  feature: { relative_location: { start: number; end: number } };
  transcriptSequence: string;
}) => {
  const startIndex = feature.relative_location.start - 1;
  const endIndex = feature.relative_location.end; // end-exclusive

  return transcriptSequence.slice(startIndex, endIndex);
};

const combineExonsAndIntrons = ({
  exons,
  introns
}: {
  exons: EnrichedExon[];
  introns: EnrichedIntron[];
}) => {
  const result: Array<EnrichedExon | EnrichedIntron> = [];

  for (let i = 0; i < exons.length; i++) {
    const exon = exons[i];
    const intron = introns[i];
    result.push(exon);
    if (intron) {
      result.push(intron);
    }
  }

  return result;
};

export default useExonsData;
