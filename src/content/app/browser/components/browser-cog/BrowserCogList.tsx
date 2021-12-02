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

import React, { useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  UpdateTrackSummaryAction,
  IncomingActionType,
  TrackSummaryList,
  TrackSummary
} from 'ensembl-genome-browser';

import useGenomeBrowser from 'src/content/app/browser/hooks/useGenomeBrowser';

import {
  getBrowserCogList,
  getBrowserCogTrackList,
  getBrowserSelectedCog
} from 'src/content/app/browser/state/browserSelectors';
import {
  updateSelectedCog,
  updateCogTrackList
} from 'src/content/app/browser/state/browserActions';

import BrowserCog from './BrowserCog';

import { CogList } from 'src/content/app/browser/state/browserState';

import styles from './BrowserCogList.scss';

export const BrowserCogList = () => {
  const browserCogList = useSelector(getBrowserCogList);
  const browserCogTrackList = useSelector(getBrowserCogTrackList);
  const selectedCog = useSelector(getBrowserSelectedCog);

  const dispatch = useDispatch();

  const { genomeBrowser } = useGenomeBrowser();

  const updateTrackSummary = (trackSummaryList: TrackSummaryList) => {
    const cogList: CogList = {};

    trackSummaryList.forEach((trackSummary: TrackSummary) => {
      if (
        trackSummary.offset &&
        trackSummary['switch-id'] &&
        !cogList[trackSummary['switch-id']]
      ) {
        cogList[trackSummary['switch-id']] = Number(trackSummary.offset);
      }
    });

    if (cogList) {
      dispatch(updateCogTrackList(cogList));
    }
  };

  useEffect(() => {
    const subscription = genomeBrowser?.subscribe(
      IncomingActionType.TRACK_SUMMARY,
      (action: UpdateTrackSummaryAction) => updateTrackSummary(action.payload)
    );
    return () => subscription?.unsubscribe();
  }, [genomeBrowser]);

  const cogs = Object.entries(browserCogTrackList).map(([name, pos]) => {
    const posStyle = { top: pos + 'px' };

    return (
      <div key={name} className={styles.browserCogOuter} style={posStyle}>
        <BrowserCog
          cogActivated={selectedCog === name}
          trackId={name}
          updateSelectedCog={(trackId: string | null) =>
            dispatch(updateSelectedCog(trackId))
          }
        />
      </div>
    );
  });

  const transformStyle = {
    transform: 'translate(0,' + browserCogList + 'px)'
  };

  return genomeBrowser ? (
    <div className={styles.browserTrackConfigOuter}>
      <div className={styles.browserCogListOuter}>
        <div className={styles.browserCogListInner} style={transformStyle}>
          {cogs}
        </div>
      </div>
    </div>
  ) : null;
};

export default memo(BrowserCogList);
