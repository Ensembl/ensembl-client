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

import browserMessagingService from 'src/content/app/browser/services/browser-messaging-service';
import { toggleTracksMessage } from 'src/content/app/browser/services/browser-messaging-service/browser-message-creator';
import {
  BrowserToChromeMessagingActions,
  BrowserScrollPayload
} from 'src/content/app/browser/services/browser-messaging-service/browser-incoming-message-types';

import BrowserCog from './BrowserCog';
import {
  updateCogList,
  updateCogTrackList,
  updateSelectedCog
} from '../browserActions';
import { RootState } from 'src/store';
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

type BrowserCogListProps = {
  browserActivated: boolean;
  browserCogList: number;
  browserCogTrackList: CogList;
  trackConfigNames: { [key: string]: boolean };
  trackConfigLabel: { [key: string]: boolean };
  selectedCog: string | null;
  updateCogList: (cogList: number) => void;
  updateCogTrackList: (track_y: CogList) => void;
  updateSelectedCog: (trackId: string | null) => void;
};

export const BrowserCogList = (props: BrowserCogListProps) => {
  const { browserCogTrackList } = props;
  const listenBpaneScroll = (payload: BrowserScrollPayload) => {
    if (
      payload.action === BrowserToChromeMessagingActions.UPDATE_SCROLL_POSITION
    ) {
      props.updateCogList(payload.delta_y);
    }
    if (
      payload.action === BrowserToChromeMessagingActions.UPDATE_TRACK_POSITION
    ) {
      props.updateCogTrackList(payload.track_y);
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
    if (props.browserCogTrackList) {
      const ons: string[] = [];
      const offs: string[] = [];

      Object.keys(props.browserCogTrackList).forEach((name) => {
        // TODO: notice how we generate strings with suffix ":label" for track names,
        // and strings with suffix ":names" for track label? That's because the frontend code
        // and the backend code refer to these things by opposite terms. We will need to unify
        // the terminology at some point.
        if (props.trackConfigNames[name]) {
          ons.push(`${name}:label`);
        } else {
          offs.push(`${name}:label`); // by default, track names are not shown
        }

        if (props.trackConfigLabel[name] !== false) {
          ons.push(`${name}:names`);
        } else {
          offs.push(`${name}:names`); // by default, track label is not shown
        }
      });
      browserMessagingService.send(
        toggleTracksMessage({
          off: offs,
          on: ons
        })
      );
    }
  }, [
    props.trackConfigNames,
    props.trackConfigLabel,
    props.browserCogTrackList
  ]);

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
  trackConfigLabel: getTrackConfigLabel(state),
  trackConfigNames: getTrackConfigNames(state),
  selectedCog: getBrowserSelectedCog(state)
});

const mapDispatchToProps = {
  updateCogList,
  updateCogTrackList,
  updateSelectedCog
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowserCogList);
