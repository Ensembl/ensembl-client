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

import React, { useRef, useEffect, useCallback, memo } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

import BrowserCogList from '../browser-cog/BrowserCogList';
import { ZmenuController } from 'src/content/app/browser/zmenu';
import { CircleLoader } from 'src/shared/components/loader/Loader';
import Overlay from 'src/shared/components/overlay/Overlay';

import browserMessagingService from 'src/content/app/browser/services/browser-messaging-service';
import {
  getBrowserCogTrackList,
  getBrowserNavOpened,
  getBrowserActivated,
  getRegionEditorActive,
  getRegionFieldActive
} from '../browserSelectors';
import {
  activateBrowser,
  updateBrowserActivated,
  updateBrowserNavStates,
  setChrLocation,
  setActualChrLocation,
  updateBrowserActiveEnsObjectIdsAndSave,
  updateDefaultPositionFlag
} from '../browserActions';

import { changeHighlightedTrackId } from 'src/content/app/browser/track-panel/trackPanelActions';

import {
  BrowserLocationUpdatePayload,
  BrowserToChromeMessagingActions
} from 'src/content/app/browser/services/browser-messaging-service/browser-incoming-message-types';
import { BrowserNavStates, ChrLocation, CogList } from '../browserState';
import { RootState } from 'src/store';
import { BROWSER_CONTAINER_ID } from '../browser-constants';

import styles from './BrowserImage.scss';

export type BrowserImageProps = {
  browserCogTrackList: CogList;
  browserNavOpened: boolean;
  browserActivated: boolean;
  isDisabled: boolean;
  activateBrowser: () => void;
  updateBrowserNavStates: (browserNavStates: BrowserNavStates) => void;
  updateBrowserActivated: (browserActivated: boolean) => void;
  updateBrowserActiveEnsObject: (objectId: string) => void;
  setChrLocation: (chrLocation: ChrLocation) => void;
  setActualChrLocation: (chrLocation: ChrLocation) => void;
  updateDefaultPositionFlag: (isDefaultPosition: boolean) => void;
  changeHighlightedTrackId: (trackId: string) => void;
};

const parseLocation = (location: ChrLocation) => {
  // FIXME: is there any reason to receive genome and chromosome in the same string?
  const [genomeAndChromosome, start, end] = location;
  const [, chromosome] = genomeAndChromosome.split(':');
  return [chromosome, start, end] as ChrLocation;
};

export const BrowserImage = (props: BrowserImageProps) => {
  const browserRef = useRef<HTMLDivElement>(null);
  const listenBpaneOut = useCallback(
    (payload: BrowserLocationUpdatePayload) => {
      const navIconStates = payload.bumper as BrowserNavStates;
      const intendedLocation = payload['intended-location'];
      const actualLocation = payload['actual-location'] || intendedLocation;
      const isFocusObjectInDefaultPosition = payload['is-focus-position'];

      if (navIconStates) {
        props.updateBrowserNavStates(navIconStates);
      }

      if (intendedLocation) {
        props.setChrLocation(parseLocation(intendedLocation));
      }

      if (actualLocation) {
        props.setActualChrLocation(parseLocation(actualLocation));
      }

      if (typeof isFocusObjectInDefaultPosition === 'boolean') {
        props.updateDefaultPositionFlag(isFocusObjectInDefaultPosition);
      }
    },
    []
  );

  useEffect(() => {
    const subscription = browserMessagingService.subscribe(
      BrowserToChromeMessagingActions.UPDATE_LOCATION,
      listenBpaneOut
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    props.activateBrowser();

    return function cleanup() {
      props.updateBrowserActivated(false);
    };
  }, []);

  const browserContainerClassNames = classNames(styles.browserStage, {
    [styles.shorter]: props.browserNavOpened
  });

  return (
    <>
      {!props.browserActivated && (
        <div className={styles.loaderWrapper}>
          <CircleLoader />
        </div>
      )}
      <div className={styles.browserImagePlus}>
        <div
          id={BROWSER_CONTAINER_ID}
          className={browserContainerClassNames}
          ref={browserRef}
        />
        <BrowserCogList />
        <ZmenuController browserRef={browserRef} />
        {props.isDisabled ? <Overlay /> : null}
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  browserCogTrackList: getBrowserCogTrackList(state),
  browserNavOpened: getBrowserNavOpened(state),
  browserActivated: getBrowserActivated(state),
  isDisabled: getRegionEditorActive(state) || getRegionFieldActive(state)
});

const mapDispatchToProps = {
  activateBrowser,
  updateBrowserActivated,
  updateBrowserNavStates,
  updateBrowserActiveEnsObject: updateBrowserActiveEnsObjectIdsAndSave,
  setChrLocation,
  setActualChrLocation,
  updateDefaultPositionFlag,
  changeHighlightedTrackId
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(BrowserImage, isEqual));
