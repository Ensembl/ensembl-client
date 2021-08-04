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
import { connect } from 'react-redux';

import { IncomingAction } from 'ensembl-genome-browser';
import { IncomingActionType } from 'ensemblRoot/src/shared/types/genome-browser/genomeBrowser';

import useGenomeBrowser from 'src/content/app/browser/hooks/useGenomeBrowser';

import {
  getBrowserActivated,
  getBrowserCogList,
  getBrowserCogTrackList,
  getBrowserSelectedCog
} from '../browserSelectors';
import {
  updateCogList,
  updateCogTrackList,
  updateSelectedCog
} from '../browserActions';

import BrowserCog from './BrowserCog';

import { RootState } from 'src/store';
import { CogList } from '../browserState';
import {
  TrackSummaryList,
  TrackSummary
} from 'ensembl-genome-browser/dist/types';

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

// type BpaneScrollPayload = {
//   delta_y?: number;
//   cogList?: CogList;
// };

export const BrowserCogList = (props: BrowserCogListProps) => {
  const { browserCogTrackList } = props;

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

  const { genomeBrowser } = useGenomeBrowser();

  useEffect(() => {
    const subscription = genomeBrowser?.subscribe(
      [IncomingActionType.UPDATE_TRACK_SUMMARY],
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
          cogActivated={props.selectedCog === name}
          trackId={name}
          updateSelectedCog={props.updateSelectedCog}
        />
      </div>
    );
  });

  const transformStyle = {
    transform: 'translate(0,' + props.browserCogList + 'px)'
  };

  return props.browserActivated ? (
    <div className={styles.browserTrackConfigOuter}>
      <div className={styles.browserCogListOuter}>
        <div className={styles.browserCogListInner} style={transformStyle}>
          {cogs}
        </div>
      </div>
    </div>
  ) : null;
};

const mapStateToProps = (state: RootState) => ({
  browserActivated: getBrowserActivated(state),
  browserCogList: getBrowserCogList(state),
  browserCogTrackList: getBrowserCogTrackList(state),
  selectedCog: getBrowserSelectedCog(state)
});

const mapDispatchToProps = {
  updateCogList,
  updateCogTrackList,
  updateSelectedCog
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowserCogList);
