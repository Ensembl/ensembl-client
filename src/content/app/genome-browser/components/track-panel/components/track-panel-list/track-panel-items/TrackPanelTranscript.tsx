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

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import {
  getBrowserActiveGenomeId,
  getBrowserTrackState
} from 'src/content/app/genome-browser/state/browser-entity/browserEntitySelectors';

import { changeDrawerViewForGenome } from 'src/content/app/genome-browser/state/drawer/drawerSlice';

import { getTranscriptMetadata as getTranscriptSupportLevel } from 'src/content/app/entity-viewer/shared/components/default-transcript-label/TranscriptQualityLabel';
import { isProteinCodingTranscript } from 'src/content/app/entity-viewer/shared/helpers/entity-helpers';

import SimpleTrackPanelItemLayout from './track-panel-item-layout/SimpleTrackPanelItemLayout';

import type { TrackActivityStatus } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import { TrackPanelTranscript as TrackPanelTranscriptType } from 'src/content/app/genome-browser/state/types/track-panel-gene';
import type { RootState } from 'src/store';

import styles from './TrackPanelItem.scss';

type Props = {
  transcript: TrackPanelTranscriptType;
  genomeId: string;
  ensObjectId: string;
  trackId: string;
  onChangeVisibility: (status: TrackActivityStatus) => void;
};

const TrackPanelTranscript = (props: Props) => {
  const { genomeId, transcript, ensObjectId, trackId } = props;
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const trackVisibilityStatus = useSelector((state: RootState) =>
    getBrowserTrackState(state, {
      genomeId,
      objectId: ensObjectId,
      tracksGroup: 'objectTracks',
      categoryName: 'main',
      trackId
    })
  );

  const dispatch = useDispatch();
  const { toggleTrack, genomeBrowser } = useGenomeBrowser();

  useEffect(() => {
    toggleTrack({ trackId: trackId, status: trackVisibilityStatus });
  }, [genomeBrowser]);

  if (!activeGenomeId) {
    return null;
  }

  const isCanonicalTranscript = transcript.metadata.canonical?.value ?? false;

  const onShowMore = () => {
    dispatch(
      changeDrawerViewForGenome({
        genomeId: activeGenomeId,
        drawerView: {
          name: 'transcript_summary',
          transcriptId: transcript.stable_id
        }
      })
    );
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

  return (
    <SimpleTrackPanelItemLayout
      visibilityStatus={trackVisibilityStatus}
      onChangeVisibility={() => props.onChangeVisibility(trackVisibilityStatus)}
      onShowMore={onShowMore}
    >
      <div className={styles.label}>
        <span
          className={styles.colorMarker}
          style={{ backgroundColor: getTranscriptColor(transcript) }}
        />
        <span className={styles.labelText}>{transcript.stable_id}</span>
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
