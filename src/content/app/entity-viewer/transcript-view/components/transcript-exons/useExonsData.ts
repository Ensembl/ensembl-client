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

  return {
    data: {
      exons
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

  // FIXME: add introns

  for (const exon of exons) {
    const enrichedExon: EnrichedExon = {
      stable_id: exon.exon.stable_id,
      start: exon.exon.slice.location.start,
      end: exon.exon.slice.location.end,
      length: exon.exon.slice.location.length,
      relativeStart: exon.relative_location.start,
      relativeEnd: exon.relative_location.end,
      startPhase: null,
      endPhase: null,
      sequence: getExonSequence({ exon, transcriptSequence: sequence })
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

const getExonSequence = ({
  exon,
  transcriptSequence
}: {
  exon: DefaultEntityViewerTranscriptQueryResult['transcript']['spliced_exons'][number];
  transcriptSequence: string;
}) => {
  const startIndex = exon.relative_location.start - 1;
  const endIndex = exon.relative_location.end; // end-exclusive

  return transcriptSequence.slice(startIndex, endIndex);
};

export default useExonsData;
