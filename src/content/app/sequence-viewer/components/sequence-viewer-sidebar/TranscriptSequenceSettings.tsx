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

import { useCallback } from 'react';
import { useSearchParams } from 'react-router';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getTranscriptSequenceViewFromSearchParams } from 'src/content/app/sequence-viewer/utils/getTranscriptSequenceView';

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import { getSequenceSettings } from 'src/content/app/sequence-viewer/state/settings/settingsSelectors';
import {
  updateSequenceSettings,
  type SequenceSettings
} from 'src/content/app/sequence-viewer/state/settings/settingsSlice';
import { useTranscriptSequenceOptionsQuery } from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';

import {
  SequenceOptionsSections,
  FlankingSequences
} from 'src/content/app/sequence-viewer/components/sequence-viewer-sidebar/sequence-options/SequenceOptions';

const TranscriptSequenceSetttings = () => {
  const { genomeId, parsedFocusObjectId } = useSequenceViewerIds();
  const transcriptId = parsedFocusObjectId?.objectId;
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const transcriptView =
    getTranscriptSequenceViewFromSearchParams(searchParams);

  const sequenceSettings = useAppSelector((state) =>
    getSequenceSettings(state, {
      type: 'transcript',
      genomeId: genomeId ?? '',
      transcriptId: transcriptId ?? '',
      sequenceView: transcriptView
    })
  );

  const { currentData } = useTranscriptSequenceOptionsQuery({
    genomeId: genomeId ?? '',
    transcriptId: transcriptId ?? '',
    sequenceType: transcriptView
  });

  const onSettingsChange = useCallback(
    (options: SequenceSettings['options']) => {
      if (!genomeId || !transcriptId) {
        // this shouldn't be possible
        return;
      }

      dispatch(
        updateSequenceSettings({
          type: 'transcript',
          genomeId,
          transcriptId,
          sequenceView: transcriptView,
          options
        })
      );
    },
    [dispatch, genomeId, transcriptId, transcriptView]
  );

  return (
    <div>
      {currentData && sequenceSettings?.options && (
        <SequenceOptionsSections
          appliedSettings={sequenceSettings.options}
          onSettingsChange={onSettingsChange}
          sections={currentData.sections}
        />
      )}

      {currentData?.flanking && sequenceSettings?.options && (
        <FlankingSequences
          flanking={currentData.flanking}
          appliedSettings={sequenceSettings.options}
          onSettingsChange={onSettingsChange}
        />
      )}
    </div>
  );
};

export default TranscriptSequenceSetttings;
