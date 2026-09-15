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

import { type DetailedHTMLProps, type HTMLAttributes } from 'react';

import { useAppSelector } from 'src/store';

import { getTranscriptSequenceSettings } from 'src/content/app/sequence-viewer/state/settings/settingsSelectors';

import useTranscriptSequence from './useTranscriptSequence';

import './transcript-sequence';

import type { TranscriptSummaryQueryResult } from 'src/content/app/genome-browser/state/api/queries/transcriptSummaryQuery';
import type { TranscriptView } from 'src/content/app/sequence-viewer/types/transcriptView';
import type { TranscriptSequence as TranscriptSequenceElement } from './transcript-sequence';

type Props = {
  genomeId: string;
  transcriptId: string;
};

const TranscriptSequence = (props: Props) => {
  const { genomeId, transcriptId } = props;
  const { data, isLoading, isError } = useTranscriptSequence({
    genomeId,
    transcriptId
  });
  const transcriptSequenceSettings = useAppSelector(
    getTranscriptSequenceSettings
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div>There has been an error loading the sequence of {transcriptId}</div>
    );
  }

  if (!data) {
    // shouldn't happen
    return null;
  }

  return (
    <div>
      <ens-sequence-viewer-transcript-sequence
        sequence={data.sequence}
        transcript={data.transcript}
        proteinSequence={data.proteinSequence}
        view={transcriptSequenceSettings.view}
      />
    </div>
  );
};

type TranscriptSequenceElementProps = DetailedHTMLProps<
  HTMLAttributes<TranscriptSequenceElement>,
  TranscriptSequenceElement
> & {
  sequence: string;
  transcript: TranscriptSummaryQueryResult['transcript'] | null;
  proteinSequence: string | null;
  view: TranscriptView;
};

declare module 'react/jsx-runtime' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ens-sequence-viewer-transcript-sequence': TranscriptSequenceElementProps;
    }
  }
}

export default TranscriptSequence;
