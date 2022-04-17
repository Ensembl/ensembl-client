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

import React from 'react';
import noop from 'lodash/noop';

import { isProteinCodingTranscript } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import {
  useRefgetSequenceQuery,
  type SequenceQueryParams
} from 'src/shared/state/api-slices/refgetSlice';

import DrawerSequenceView from 'src/content/app/genome-browser/components/drawer/components/sequence-view/DrawerSequenceView';

import type { TranscriptSummaryQueryResult } from 'src/content/app/genome-browser/state/api/queries/transcriptSummaryQuery';
import type { SequenceType } from 'src/content/app/genome-browser/state/drawer/drawer-sequence/drawerSequenceSlice';

type Transcript = {
  slice: TranscriptSummaryQueryResult['transcript']['slice'];
  product_generating_contexts: TranscriptSummaryQueryResult['transcript']['product_generating_contexts'];
};
type Props = {
  transcript: Transcript;
};

const proteinCodingTranscriptSequenceTypes: SequenceType[] = [
  'genomic',
  'cdna',
  'cds',
  'protein'
];

const nonCodingTranscriptSequenceTypes: SequenceType[] = ['genomic', 'cdna'];

const TranscriptSequenceView = (props: Props) => {
  const { transcript } = props;
  const sequenceTypes = isProteinCodingTranscript(props.transcript)
    ? proteinCodingTranscriptSequenceTypes
    : nonCodingTranscriptSequenceTypes;
  const selectedSequenceType = 'genomic';

  const { data: sequence } = useRefgetSequenceQuery(
    getSequenceQueryParams(transcript, selectedSequenceType)
  );

  return sequence ? (
    <DrawerSequenceView
      sequence={sequence}
      sequenceTypes={sequenceTypes}
      selectedSequenceType={selectedSequenceType}
      isReverseComplement={false}
      onSequenceTypeChange={noop}
      onReverseComplementChange={noop}
    />
  ) : null;
};

const getSequenceQueryParams = (
  transcript: Transcript,
  sequenceType: SequenceType
): SequenceQueryParams => {
  const queryParams: Record<string, string | number> = {};
  const {
    strand: { code: strand }
  } = transcript.slice;
  queryParams.strand = strand;

  if (sequenceType === 'genomic') {
    queryParams.checksum = transcript.slice.region.sequence.checksum;
    queryParams.start = transcript.slice.location.start;
    queryParams.end = transcript.slice.location.end;
  } else if (sequenceType === 'cdna') {
    queryParams.checksum = transcript.product_generating_contexts[0].cdna
      ?.sequence.checksum as string; // FIXME: is cdna really nullable?
  } else if (sequenceType === 'cds') {
    queryParams.checksum = transcript.product_generating_contexts[0].cds
      ?.sequence.checksum as string;
  } else if (sequenceType === 'protein') {
    queryParams.checksum = transcript.product_generating_contexts[0].product
      ?.sequence.checksum as string;
  }

  return queryParams as SequenceQueryParams;
};

export default TranscriptSequenceView;
