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

import { useEffect, memo } from 'react';

import { useAppDispatch, useAppSelector } from 'src/store';

import { getDisplayedTracks } from 'src/content/app/genome-browser/state/displayed-tracks/displayedTracksSelectors';
import { getAllTrackSettingsForGenome } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSelectors';
import {
  getBrowserActiveFocusObjectId,
  getBrowserActiveGenomeId
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { setDisplayedTracks } from 'src/content/app/genome-browser/state/displayed-tracks/displayedTracksSlice';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import BrowserCog from './BrowserCog';

import type { TrackSummaryMessage } from 'src/content/app/genome-browser/services/genome-browser-service/types/genomeBrowserMessages';
import type { TrackSummary } from 'src/content/app/genome-browser/services/genome-browser-service/types/trackSummary';

import styles from './BrowserCogList.module.css';

export const BrowserCogList = () => {
  const genomeId = useAppSelector(getBrowserActiveGenomeId) as string;
  const focusObjectId = useAppSelector(getBrowserActiveFocusObjectId);
  const allTrackSettings = useAppSelector((state) =>
    getAllTrackSettingsForGenome(state, genomeId)
  );

  const { genomeBrowserService } = useGenomeBrowser();

  const displayedTracks = useAppSelector(getDisplayedTracks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const subscription = genomeBrowserService?.subscribe(
      'track_summary',
      (message: TrackSummaryMessage) => {
        updateDisplayedTracks(message.payload.summary);
      }
    );
    return () => subscription?.unsubscribe();
  }, [genomeBrowserService, genomeId, focusObjectId]);

  const updateDisplayedTracks = (trackSummaryList: TrackSummary[]) => {
    const payload = trackSummaryList.map((track) => ({
      id: getTrackId(track),
      height: track.height,
      offsetTop: track.offset
    }));

    dispatch(setDisplayedTracks(payload));
  };

  const cogs = displayedTracks.map((track) => {
    const posStyle = { top: `${track.offsetTop}px` };
    const trackType =
      allTrackSettings?.settingsForIndividualTracks?.[track.id]?.trackType;

    return trackType ? (
      <div key={track.id} className={styles.browserCogOuter} style={posStyle}>
        <BrowserCog trackId={track.id} trackType={trackType} />
      </div>
    ) : null;
  });

  return genomeBrowserService ? (
    <div className={styles.browserTrackSettingsOuter}>
      <div className={styles.browserCogListOuter}>
        <div className={styles.browserCogListInner}>{cogs}</div>
      </div>
    </div>
  ) : null;
};

const getTrackId = (trackSummary: TrackSummary) => {
  if (trackSummary['switch-id'] === 'focus' && 'variant-id' in trackSummary) {
    return 'focus-variant';
  } else {
    return trackSummary['switch-id'];
  }
};

export default memo(BrowserCogList);
