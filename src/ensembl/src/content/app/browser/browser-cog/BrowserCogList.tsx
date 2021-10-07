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

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';
import BrowserCog from './BrowserCog';
import {
  updateCogList,
  updateCogTrackList,
  updateSelectedCog
} from '../browserActions';

import { CogList } from '../browserState';
import {
  getBrowserActivated,
  getBrowserCogList,
  getBrowserCogTrackList,
  getTrackConfigNames,
  getTrackConfigLabel,
  getBrowserSelectedCog
} from '../browserSelectors';

import styles from './BrowserCogList.scss';

type BpaneScrollPayload = {
  delta_y?: number;
  track_y?: CogList;
};

export const BrowserCogList = () => {
  const browserActivated = useSelector(getBrowserActivated);
  const browserCogList = useSelector(getBrowserCogList);
  const browserCogTrackList = useSelector(getBrowserCogTrackList);
  const trackConfigLabel = useSelector(getTrackConfigLabel);
  const trackConfigNames = useSelector(getTrackConfigNames);
  const selectedCog = useSelector(getBrowserSelectedCog);

  const dispatch = useDispatch();

  const listenBpaneScroll = (payload: BpaneScrollPayload) => {
    const { delta_y, track_y } = payload;
    if (delta_y !== undefined) {
      dispatch(updateCogList(delta_y));
    }
    if (track_y) {
      dispatch(updateCogTrackList(track_y));
    }
  };

  useEffect(() => {
    const subscription = browserMessagingService.subscribe(
      'bpane-scroll',
      listenBpaneScroll
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (browserCogTrackList) {
      const ons: string[] = [];
      const offs: string[] = [];

      Object.keys(browserCogTrackList).forEach((name) => {
        // TODO: notice how we generate strings with suffix ":label" for track names,
        // and strings with suffix ":names" for track label? That's because the frontend code
        // and the backend code refer to these things by opposite terms. We will need to unify
        // the terminology at some point.
        if (trackConfigNames[name]) {
          ons.push(`${name}:label`);
        } else {
          offs.push(`${name}:label`); // by default, track names are not shown
        }

        if (trackConfigLabel[name] !== false) {
          ons.push(`${name}:names`);
        } else {
          offs.push(`${name}:names`); // by default, track label is not shown
        }
      });
      browserMessagingService.send('bpane', {
        off: offs,
        on: ons
      });
    }
  }, [trackConfigNames, trackConfigLabel, browserCogTrackList]);

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
