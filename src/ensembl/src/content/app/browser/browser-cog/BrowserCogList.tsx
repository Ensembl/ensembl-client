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

import { IncomingAction, IncomingActionType } from 'ensembl-genome-browser';

import useGenomeBrowser from 'src/content/app/browser/hooks/useGenomeBrowser';

import {
  getBrowserActivated,
  getBrowserCogList,
  getBrowserCogTrackList,
  getBrowserSelectedCog
} from '../browserSelectors';
import { updateSelectedCog } from '../browserActions';

import BrowserCog from './BrowserCog';

import { CogList } from '../browserState';
import { TrackSummaryList, TrackSummary } from 'ensembl-genome-browser';

import styles from './BrowserCogList.scss';

type BrowserCogListProps = {
  browserActivated: boolean;
  browserCogList: number;
  browserCogTrackList: CogList;
  selectedCog: string | null;
  updateCogList: (cogList: number) => void;
  updateCogTrackList: (track_y: CogList) => void;
  updateSelectedCog: (trackId: string | null) => void;
};

export const BrowserCogList = (props: BrowserCogListProps) => {
  const browserActivated = useSelector(getBrowserActivated);
  const browserCogList = useSelector(getBrowserCogList);
  const browserCogTrackList = useSelector(getBrowserCogTrackList);
  const selectedCog = useSelector(getBrowserSelectedCog);

  const dispatch = useDispatch();

  const { genomeBrowser } = useGenomeBrowser();

  const listenBpaneScroll = (trackSummaryList: TrackSummaryList) => {
    // const { delta_y, cogList } = payload;

    // if (delta_y !== undefined) {
    //   props.updateCogList(delta_y);
    // }

    const cogList: CogList = {};

    trackSummaryList.forEach((trackSummary: TrackSummary) => {
      cogList[trackSummary['switch-id']] = Number(trackSummary.offset);
    });

    if (cogList) {
      props.updateCogTrackList(cogList);
    }
  };

  useEffect(() => {
    const subscription = genomeBrowser?.subscribe(
      [IncomingActionType.TRACK_SUMMARY],
      (action: IncomingAction) =>
        listenBpaneScroll(action.payload as TrackSummaryList)
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
          updateSelectedCog={() => dispatch(updateSelectedCog)}
        />
      </div>
    );
  });

  const transformStyle = {
    transform: 'translate(0,' + browserCogList + 'px)'
  };

  return browserActivated ? (
    <div className={styles.browserTrackConfigOuter}>
      <div className={styles.browserCogListOuter}>
        <div className={styles.browserCogListInner} style={transformStyle}>
          {cogs}
        </div>
      </div>
    </div>
  ) : null;
};

export default BrowserCogList;
