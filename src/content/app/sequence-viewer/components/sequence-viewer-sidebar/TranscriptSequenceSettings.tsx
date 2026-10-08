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

import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router';

import { useAppSelector, useAppDispatch } from 'src/store';

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import { getSequenceSettings } from 'src/content/app/sequence-viewer/state/settings/settingsSelectors';
import {
  setInitialSequenceSettings,
  updateSequenceSettings,
  createInitialTranscriptSettings,
  type SequenceSettings
} from 'src/content/app/sequence-viewer/state/settings/settingsSlice';
import { useTranscriptSequenceOptionsQuery } from 'src/content/app/sequence-viewer/state/api/sequenceViewerApiSlice';

import { SequenceOptionsSections } from 'src/content/app/sequence-viewer/components/sequence-viewer-sidebar/sequence-options/SequenceOptions';

import type { TranscriptSequenceView } from 'src/content/app/sequence-viewer/types/transcriptSequenceView';

// const lineNumberingMap: Record<TranscriptSequenceLineNumbering, string> = {
//   region: 'Relative to full top-level region',
//   gene: 'Relative to gene',
//   transcript: 'Relative to this transcript',
//   cdna: 'Relative to the cDNA',
//   cds: 'Relative to the coding sequence'
// };

const TranscriptSequenceSetttings = () => {
  const { genomeId, parsedFocusObjectId } = useSequenceViewerIds();
  const transcriptId = parsedFocusObjectId?.objectId;
  const sequenceSettings = useAppSelector((state) =>
    getSequenceSettings(state, genomeId ?? '')
  );
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const transcriptView = searchParams.get('view') ?? 'genomic';

  const { data } = useTranscriptSequenceOptionsQuery({
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
          sequenceView: transcriptView as TranscriptSequenceView,
          options
        })
      );
    },
    [dispatch, genomeId, transcriptId, transcriptView]
  );

  useEffect(() => {
    if (!data) {
      return;
    }

    const initialSettings = createInitialTranscriptSettings({
      transcriptId: transcriptId as string,
      sequenceView: transcriptView as TranscriptSequenceView,
      payload: data
    });

    dispatch(
      setInitialSequenceSettings({
        genomeId: genomeId as string,
        settings: initialSettings
      })
    );
  }, [dispatch, genomeId, data, transcriptId, transcriptView]);

  // const sequenceViewOptions = [...transcriptViewsMap.entries()].map(
  //   ([key, value]) => ({
  //     label: value,
  //     value: key
  //   })
  // );

  return (
    <div>
      {data && sequenceSettings?.options && (
        <SequenceOptionsSections
          appliedSettings={sequenceSettings.options}
          onSettingsChange={onSettingsChange}
          sections={data.sections}
        />
      )}

      <div
        style={{ display: 'flex', flexDirection: 'column', rowGap: '0.6rem' }}
      >
        {/* this is where options will go */}
      </div>
    </div>
  );
};

export default TranscriptSequenceSetttings;
