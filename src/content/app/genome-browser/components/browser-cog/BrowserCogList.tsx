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

import React, { useState, useEffect, memo } from 'react';

import {
  IncomingActionType,
  type UpdateTrackSummaryAction,
  type TrackSummaryList,
  type TrackSummary
} from '@ensembl/ensembl-genome-browser';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import BrowserCog from './BrowserCog';

import { useAppSelector } from 'src/store';
import useBrowserCogList from './useBrowserCogList';

import {
  getBrowserActiveFocusObjectId,
  getBrowserActiveGenomeId
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import type { CogList } from 'src/content/app/genome-browser/Browser';

import styles from './BrowserCogList.scss';

export const BrowserCogList = () => {
  const [selectedCog, setSelectedCog] = useState<string | null>(null);
  const genomeId = useAppSelector(getBrowserActiveGenomeId) as string;
  const focusObjectId = useAppSelector(getBrowserActiveFocusObjectId);

  const { genomeBrowser } = useGenomeBrowser();

  const { cogList: browserCogList, setCogList } = useBrowserCogList();

  useEffect(() => {
    const subscription = genomeBrowser?.subscribe(
      IncomingActionType.TRACK_SUMMARY,
      (action: UpdateTrackSummaryAction) => {
        updateTrackSummary(action.payload);
      }
    );
    return () => subscription?.unsubscribe();
  }, [genomeBrowser, genomeId, focusObjectId]);

  const updateTrackSummary = (trackSummaryList: TrackSummaryList) => {
    if (!focusObjectId) {
      return;
    }

    const cogList: CogList = {};

    trackSummaryList.forEach((trackSummary: TrackSummary) => {
      if (
        trackSummary.offset &&
        trackSummary['switch-id'] &&
        !cogList[trackSummary['switch-id']]
      ) {
        const trackId = trackSummary['switch-id'];
        cogList[trackId] = Number(trackSummary.offset);
      }
    });

    setCogList(cogList);
  };

  useEffect(() => {
    // make sure to close the floating track config panel if the user switches to a different species
    updateSelectedCog(null);
  }, [genomeId]);

  const updateSelectedCog = (trackId: string | null) => {
    setSelectedCog(trackId);
  };

  const cogs =
    browserCogList &&
    Object.entries(browserCogList).map(([name, pos]) => {
      const posStyle = { top: `${pos}px` };

      return (
        <div key={name} className={styles.browserCogOuter} style={posStyle}>
          <BrowserCog
            cogActivated={selectedCog === name}
            trackId={name}
            updateSelectedCog={updateSelectedCog}
          />
        </div>
      );
    });

  return genomeBrowser ? (
    <div className={styles.browserTrackSettingsOuter}>
      <div className={styles.browserCogListOuter}>
        <div className={styles.browserCogListInner}>{cogs}</div>
      </div>
    </div>
  ) : null;
};

export default memo(BrowserCogList);
