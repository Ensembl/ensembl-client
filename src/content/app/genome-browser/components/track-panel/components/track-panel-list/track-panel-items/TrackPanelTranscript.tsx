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

import { useAppDispatch } from 'src/store';

import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

import { changeDrawerViewForGenome } from 'src/content/app/genome-browser/state/drawer/drawerSlice';

import { getTranscriptMetadata as getTranscriptSupportLevel } from 'src/content/app/entity-viewer/shared/components/default-transcript-label/TranscriptQualityLabel';
import { isProteinCodingTranscript } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import SimpleTrackPanelItemLayout from './track-panel-item-layout/SimpleTrackPanelItemLayout';

import type { TrackPanelTranscript as TrackPanelTranscriptType } from 'src/content/app/genome-browser/state/types/track-panel-gene';
import { Status } from 'src/shared/types/status';

import styles from './TrackPanelItem.scss';

type Props = {
  transcript: TrackPanelTranscriptType;
  isVisible: boolean;
  onVisibilityChange: (transcriptId: string, isVisible: boolean) => void;
  genomeId: string;
};

const TrackPanelTranscript = (props: Props) => {
  const { genomeId, isVisible, transcript } = props;
  const dispatch = useAppDispatch();
  const { trackDrawerOpened, trackTranscriptInTrackVisibilityToggled } =
    useGenomeBrowserAnalytics();

  const currentTranscriptId = transcript.stable_id;

  const isCanonicalTranscript = transcript.metadata.canonical?.value ?? false;

  const onShowMore = () => {
    trackDrawerOpened('transcript_summary');

    dispatch(
      changeDrawerViewForGenome({
        genomeId,
        drawerView: {
          name: 'transcript_summary',
          transcriptId: currentTranscriptId
        }
      })
    );
  };

  const onChangeVisibility = () => {
    trackTranscriptInTrackVisibilityToggled(transcript.stable_id, !isVisible);
    props.onVisibilityChange(transcript.stable_id, !isVisible);
  };

  const secondaryLabel = isCanonicalTranscript ? (
    <span className={styles.labelTextSecondaryStrong}>
      {getTranscriptSupportLevel(transcript)?.label as string}
    </span>
  ) : (
    <span className={styles.labelTextSecondary}>
      {transcript.metadata.biotype.label}
    </span>
  );

  const visibilityStatus = isVisible ? Status.SELECTED : Status.UNSELECTED;

  return (
    <SimpleTrackPanelItemLayout
      visibilityStatus={visibilityStatus}
      onChangeVisibility={onChangeVisibility}
      onShowMore={onShowMore}
    >
      <div className={styles.label}>
        <span
          className={styles.colorMarker}
          style={{ backgroundColor: getTranscriptColor(transcript) }}
        />
        <span className={styles.labelText}>{currentTranscriptId}</span>
        {secondaryLabel}
      </div>
    </SimpleTrackPanelItemLayout>
  );
};

const getTranscriptColor = (transcript: TrackPanelTranscriptType) => {
  if (transcript.metadata.canonical?.value) {
    return '#0099ff'; // blue
  } else if (isProteinCodingTranscript(transcript)) {
    return '#6f8190'; // dark grey
  } else {
    return '#b7c0c8'; // regular grey
  }
};

export default TrackPanelTranscript;
