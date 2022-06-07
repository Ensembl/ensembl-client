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

import React, { useEffect, memo, useRef } from 'react';

import {
  IncomingActionType,
  type UpdateTrackSummaryAction,
  type TrackSummaryList,
  type TrackSummary
} from '@ensembl/ensembl-genome-browser';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import BrowserCog from './BrowserCog';

import { useAppDispatch, useAppSelector } from 'src/store';
import useBrowserCogList from './useBrowserCogList';

import {
  getBrowserCogList,
  getBrowserSelectedCog
} from 'src/content/app/genome-browser/state/track-config/trackConfigSelectors';
import {
  type CogList,
  updateCogList,
  updateSelectedCog
} from 'src/content/app/genome-browser/state/track-config/trackConfigSlice';
import {
  getBrowserActiveFocusObjectId,
  getBrowserActiveGenomeId
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import styles from './BrowserCogList.scss';

export const BrowserCogList = () => {
  const browserCogList = useAppSelector(getBrowserCogList);
  const selectedCog = useAppSelector(getBrowserSelectedCog);
  const genomeId = useAppSelector(getBrowserActiveGenomeId);
  const objectId = useAppSelector(getBrowserActiveFocusObjectId);
  const dispatch = useAppDispatch();

  const genomeIdRef = useRef(genomeId);
  const { genomeBrowser } = useGenomeBrowser();

  useBrowserCogList();

  useEffect(() => {
    genomeIdRef.current = genomeId;
  }, [genomeId]);

  useEffect(() => {
    const subscription = genomeBrowser?.subscribe(
      IncomingActionType.TRACK_SUMMARY,
      (action: UpdateTrackSummaryAction) => updateTrackSummary(action.payload)
    );
    return () => subscription?.unsubscribe();
  }, [genomeBrowser, genomeId, objectId]);

  const updateTrackSummary = (trackSummaryList: TrackSummaryList) => {
    if (!genomeIdRef.current || !objectId) {
      return;
    }

    const cogList: CogList = {};

    trackSummaryList.forEach((trackSummary: TrackSummary) => {
      if (
        trackSummary.offset &&
        trackSummary['switch-id'] &&
        !cogList[trackSummary['switch-id']]
      ) {
        const trackId =
          trackSummary['switch-id'] === 'focus'
            ? 'gene-focus'
            : trackSummary['switch-id'];
        cogList[trackId] = Number(trackSummary.offset);
      }
    });

    if (cogList) {
      dispatch(
        updateCogList({
          genomeId: genomeIdRef.current,
          browserCogList: cogList
        })
      );
    }
  };

  const handleCogSelect = (trackId: string | null) => {
    dispatch(
      updateSelectedCog({
        genomeId: genomeIdRef.current as string,
        selectedCog: trackId
      })
    );
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
            updateSelectedCog={handleCogSelect}
          />
        </div>
      );
    });

  return genomeBrowser ? (
    <div className={styles.browserTrackConfigOuter}>
      <div className={styles.browserCogListOuter}>
        <div className={styles.browserCogListInner}>{cogs}</div>
      </div>
    </div>
  ) : null;
};

export default memo(BrowserCogList);
