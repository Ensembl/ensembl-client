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

import { useAppSelector, useAppDispatch } from 'src/store';

import { getTranscriptSequenceSettings } from 'src/content/app/sequence-viewer/state/settings/settingsSelectors';

import {
  changeTranscriptSequenceSettings
  // type TranscriptSequenceLineNumbering
} from 'src/content/app/sequence-viewer/state/settings/settingsSlice';

import RadioGroup from 'src/shared/components/radio-group/RadioGroup';

import type { TranscriptView } from 'src/content/app/sequence-viewer/types/transcriptView';

// view -> label
const transcriptViewsMap = new Map<TranscriptView, string>([
  ['genomic', 'Genomic sequence'],
  ['cdna', 'cDNA']
]);

// const lineNumberingMap: Record<TranscriptSequenceLineNumbering, string> = {
//   region: 'Relative to full top-level region',
//   gene: 'Relative to gene',
//   transcript: 'Relative to this transcript',
//   cdna: 'Relative to the cDNA',
//   cds: 'Relative to the coding sequence'
// };

const TranscriptSequenceSetttings = () => {
  const transcriptSettings = useAppSelector(getTranscriptSequenceSettings);
  const dispatch = useAppDispatch();

  const onTranscriptViewChange = (view: TranscriptView) => {
    dispatch(changeTranscriptSequenceSettings({ view }));
  };

  const sequenceViewOptions = [...transcriptViewsMap.entries()].map(
    ([key, value]) => ({
      label: value,
      value: key
    })
  );

  return (
    <div>
      <div>Sequence view</div>
      <RadioGroup
        options={sequenceViewOptions}
        selectedOption={transcriptSettings.view}
        onChange={(val) => onTranscriptViewChange(val as TranscriptView)}
      />
    </div>
  );
};

export default TranscriptSequenceSetttings;
