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

import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  type CSSProperties
} from 'react';

import { useAppSelector } from 'src/store';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { getTranscriptSequenceSettings } from 'src/content/app/sequence-viewer/state/settings/settingsSelectors';

import useTranscriptSequence from './useTranscriptSequence';

import './transcript-sequence';

import type { TranscriptSequence as TranscriptSequenceElement } from './transcript-sequence';

import commonStyles from '../../styles/sequence-viewer-common-styles.module.css';

type Props = {
  genomeId: string;
  transcriptId: string;
};

// Example url:
// http://localhost:8080/sequence-viewer/GCA_000001405.29?focus=transcript:ENST00000380152&location=13:32272786-32444334

const TranscriptSequence = (props: Props) => {
  const { genomeId, transcriptId } = props;
  const transcriptSequenceSettings = useAppSelector(
    getTranscriptSequenceSettings
  );
  const { data, isLoading, isError } = useTranscriptSequence({
    genomeId,
    transcriptId,
    settings: transcriptSequenceSettings
  });

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

  const transcriptEnd = data.transcript.slice.location.end;
  const formattedTranscriptEndString = formatNumber(transcriptEnd);
  const formattedGeneEndStringEnd = formattedTranscriptEndString.length;

  const styles: CSSProperties & { '--gutter-width': string } = {
    '--gutter-width': `${formattedGeneEndStringEnd}ch`
  };

  return (
    <div className={commonStyles.main} style={styles}>
      <ens-sequence-viewer-transcript-sequence
        sequence={data.annotatedSequence}
      />
    </div>
  );
};

type TranscriptSequenceElementProps = DetailedHTMLProps<
  HTMLAttributes<TranscriptSequenceElement>,
  TranscriptSequenceElement
> & {
  sequence: string;
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
