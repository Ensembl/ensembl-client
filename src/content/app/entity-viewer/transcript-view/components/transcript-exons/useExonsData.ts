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

import { useState } from 'react';

import { AppDispatch, useAppDispatch } from 'src/store';

import { getSequenceSlice } from 'src/shared/helpers/sequenceHelpers';

import { fetchDefaultEntityViewerTranscript } from 'src/content/app/entity-viewer/state/api/entityViewerThoasSlice';
import { fetchRefgetSequence } from 'src/shared/state/api-slices/refgetSlice';

import type { DefaultEntityViewerTranscriptQueryResult } from 'src/content/app/entity-viewer/state/api/queries/transcriptDefaultQuery';
import type { Strand } from 'src/shared/types/core-api/strand';

type Transcript = DefaultEntityViewerTranscriptQueryResult['transcript'];

export type QueryParameters = {
  genomeId: string;
  transcriptId: string;
};

/**
 * The types of exon and intron data
 * are flat, compared to the nested data initially retrieved from the graphql service,
 * and contain the full sequence string
 */
export type EnrichedExon = {
  type: 'exon';
  index: number;
  stable_id: string;
  start: number;
  end: number;
  length: number;
  strand: Strand;
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
  strand: Strand;
  relativeStart: number;
  relativeEnd: number;
  sequence: string;
};

export type Data = {
  exons: EnrichedExon[];
  introns: EnrichedIntron[];
  exonsAndIntrons: (EnrichedExon | EnrichedIntron)[];
  upstreamFlankingSequence: {
    strand: Strand;
    sequence: string;
  };
  downstreamFlankingSequence: {
    strand: Strand;
    sequence: string;
  };
};

const fetchExonsData = async ({
  transcriptId,
  genomeId,
  reduxDispatch
}: QueryParameters & { reduxDispatch: AppDispatch }): Promise<{
  isError: boolean;
  data: Data | null;
}> => {
  const transcriptsQueryPromise = reduxDispatch(
    fetchDefaultEntityViewerTranscript.initiate(
      {
        genomeId,
        transcriptId
      },
      { subscribe: false }
    )
  );
  const { isError, data } = await transcriptsQueryPromise;

  if (isError || !data) {
    return { isError: true, data: null };
  }

  const { transcript } = data;

  const genomicTranscriptSequenceQueryParams =
    getTranscriptGenomicSequenceQueryParams(transcript);
  const upstreamSequenceQueryParams = getUpstreamGenomicSequenceQueryParams({
    transcript
  });
  const downstreamSequenceQueryParams = getDownstreamGenomicSequenceQueryParams(
    { transcript }
  );

  const genomicTranscriptSequencePromise = reduxDispatch(
    fetchRefgetSequence.initiate(genomicTranscriptSequenceQueryParams, {
      subscribe: false
    })
  );
  const upstreamSequencePromise = reduxDispatch(
    fetchRefgetSequence.initiate(upstreamSequenceQueryParams, {
      subscribe: false
    })
  );
  const downstreamSequencePromise = reduxDispatch(
    fetchRefgetSequence.initiate(downstreamSequenceQueryParams, {
      subscribe: false
    })
  );

  const [
    genomicTranscriptSequenceResult,
    upstreamSequenceResult,
    downstreamSequenceResult
  ] = await Promise.all([
    genomicTranscriptSequencePromise,
    upstreamSequencePromise,
    downstreamSequencePromise
  ]);

  const { data: genomicTranscriptSequence, isError: isGenomicSequenceError } =
    genomicTranscriptSequenceResult;
  const {
    data: upstreamFlankingSequence = '',
    isError: isUpstreamSequenceError
  } = upstreamSequenceResult;
  const {
    data: downstreamFlankingSequence = '',
    isError: isDownstreamSequenceError
  } = downstreamSequenceResult;

  if (
    isGenomicSequenceError ||
    isUpstreamSequenceError ||
    isDownstreamSequenceError ||
    !genomicTranscriptSequence
  ) {
    return { isError: true, data: null };
  }

  const exons = prepareExonsData({
    transcript,
    sequence: genomicTranscriptSequence
  });
  const introns = prepareIntrons({
    transcript,
    sequence: genomicTranscriptSequence
  });
  const exonsAndIntrons = combineExonsAndIntrons({
    exons,
    introns
  });

  return {
    data: {
      exons,
      introns,
      exonsAndIntrons,
      upstreamFlankingSequence: {
        sequence: upstreamFlankingSequence,
        strand: upstreamSequenceQueryParams.strand
      },
      downstreamFlankingSequence: {
        sequence: downstreamFlankingSequence,
        strand: downstreamSequenceQueryParams.strand
      }
    },
    isError: false
  };
};

const useExonsData = ({ genomeId, transcriptId }: QueryParameters) => {
  const reduxDispatch = useAppDispatch();
  const [dataPromise, setDataPromise] = useState<ReturnType<
    typeof fetchExonsData
  > | null>(null);
  const [previousParams, setPreviousParams] = useState({
    genomeId: '',
    transcriptId: ''
  });
  if (
    genomeId !== previousParams.genomeId ||
    transcriptId !== previousParams.transcriptId
  ) {
    setDataPromise(fetchExonsData({ genomeId, transcriptId, reduxDispatch }));
    setPreviousParams({
      genomeId,
      transcriptId
    });
  }

  return dataPromise;
};

const getTranscriptGenomicSequenceQueryParams = (
  transcript: DefaultEntityViewerTranscriptQueryResult['transcript']
) => {
  return {
    checksum: transcript.slice.region.sequence.checksum,
    start: transcript.slice.location.start,
    end: transcript.slice.location.end
  };
};

/**
 * Make sure that, even for edge cases, the upstream sequence
 * is a continuation of the sequence of the first exon,
 * accounting for the strand
 */
const getUpstreamGenomicSequenceQueryParams = ({
  transcript,
  length = 57
}: {
  transcript: Transcript;
  length?: number;
}) => {
  // find the first 5' exon (i.e. exon with index 1),
  // then check its strand, and calculate the coordinates of 5' upstream sequence
  const firstSplicedExon = transcript.spliced_exons.toSorted(
    (e1, e2) => e1.index - e2.index
  )[0];
  const firstExon = firstSplicedExon.exon;
  const strand = firstExon.slice.strand.code;

  let start: number;
  let end: number;

  if (strand === 'reverse') {
    start = firstExon.slice.location.end + 1;
    end = start + length - 1;
  } else {
    end = firstExon.slice.location.start - 1;
    start = Math.max(end - length + 1, 1);
  }

  return {
    checksum: transcript.slice.region.sequence.checksum,
    start,
    end,
    strand
  };
};

/**
 * Make sure that, even for edge cases, the downstream sequence
 * is a continuation of the sequence of the last exon,
 * accounting for the strand
 */
const getDownstreamGenomicSequenceQueryParams = ({
  transcript,
  length = 57
}: {
  transcript: DefaultEntityViewerTranscriptQueryResult['transcript'];
  length?: number;
}) => {
  const lastSplicedExon = transcript.spliced_exons.toSorted(
    (e1, e2) => e2.index - e1.index
  )[0];
  const lastExon = lastSplicedExon.exon;
  const strand = lastExon.slice.strand.code;

  let start: number;
  let end: number;

  if (strand === 'reverse') {
    end = lastExon.slice.location.start - 1;
    start = end - length + 1;
  } else {
    start = lastExon.slice.location.end + 1;
    end = start + length - 1;
  }

  return {
    checksum: transcript.slice.region.sequence.checksum,
    start,
    end,
    strand
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
      strand: exon.exon.slice.strand.code,
      relativeStart: exon.relative_location.start,
      relativeEnd: exon.relative_location.end,
      startPhase: null,
      endPhase: null,
      sequence: getFeatureSequence({
        feature: {
          start: exon.exon.slice.location.start,
          end: exon.exon.slice.location.end,
          strand: exon.exon.slice.strand.code
        },
        transcript: { start: transcript.slice.location.start },
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

  return enrichedExons;
};

const prepareIntrons = ({
  transcript,
  sequence
}: {
  transcript: Transcript;
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
    strand: intron.slice.strand.code,
    relativeStart: intron.relative_location.start,
    relativeEnd: intron.relative_location.end,
    sequence: getFeatureSequence({
      feature: {
        start: intron.slice.location.start,
        end: intron.slice.location.end,
        strand: intron.slice.strand.code
      },
      transcriptSequence: sequence,
      transcript: { start: transcript.slice.location.start }
    })
  }));
};

const generateIntronId = (intron: Transcript['introns'][number]) => {
  return `Intron ${intron.index}-${intron.index + 1}`;
};

const getFeatureSequence = ({
  feature,
  transcriptSequence,
  transcript
}: {
  feature: {
    start: number;
    end: number;
    strand: Strand;
  };
  transcriptSequence: string;
  transcript: {
    start: number;
  };
}) => {
  return getSequenceSlice({
    sequence: transcriptSequence,
    sequenceStart: transcript.start,
    sliceStart: feature.start,
    sliceEnd: feature.end,
    reverseComplement: feature.strand === 'reverse'
  });
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
