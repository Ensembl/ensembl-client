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
import { CircleLoader } from 'src/shared/components/loader';
import Overlay from 'src/shared/components/overlay/Overlay';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';
import { parseFeatureId } from 'src/content/app/browser/browserHelper';
import { buildEnsObjectId } from 'src/shared/state/ens-object/ensObjectHelpers';
import {
  getBrowserCogTrackList,
  getBrowserNavOpenState,
  getBrowserActivated,
  getRegionEditorActive,
  getRegionFieldActive,
  getBrowserActiveGenomeId
} from '../browserSelectors';
import {
  activateBrowser,
  updateBrowserActivated,
  updateBrowserNavIconStates,
  setChrLocation,
  setActualChrLocation,
  updateBrowserActiveEnsObjectIdsAndSave,
  updateDefaultPositionFlag
} from '../browserActions';

import { changeHighlightedTrackId } from 'src/content/app/browser/track-panel/trackPanelActions';

import {
  BrowserNavAction,
  BrowserNavIconStates,
  ChrLocation,
  CogList
} from '../browserState';
import { RootState } from 'src/store';
import { BROWSER_CONTAINER_ID } from '../browser-constants';

import styles from './BrowserImage.scss';

export type BrowserImageProps = {
  browserCogTrackList: CogList;
  isNavbarOpen: boolean;
  browserActivated: boolean;
  isDisabled: boolean;
  activeGenomeId: string | null;
  activateBrowser: () => void;
  updateBrowserNavIconStates: (payload: {
    activeGenomeId: string;
    navStates: BrowserNavIconStates;
  }) => void;
  updateBrowserActivated: (browserActivated: boolean) => void;
  updateBrowserActiveEnsObject: (objectId: string) => void;
  setChrLocation: (chrLocation: ChrLocation) => void;
  setActualChrLocation: (chrLocation: ChrLocation) => void;
  updateDefaultPositionFlag: (isDefaultPosition: boolean) => void;
  changeHighlightedTrackId: (trackId: string) => void;
};

export type BumperPayload = [
  top: boolean,
  right: boolean,
  bottom: boolean,
  left: boolean,
  zoomOut: boolean,
  zoomIn: boolean
];

type BpaneOutPayload = {
  bumper?: BumperPayload;
  focus?: string;
  'message-counter'?: number;
  'intended-location'?: ChrLocation;
  'actual-location'?: ChrLocation;
  'is-focus-position'?: boolean;
};

const parseLocation = (location: ChrLocation) => {
  // FIXME: is there any reason to receive genome and chromosome in the same string?
  const [genomeAndChromosome, start, end] = location;
  const [, chromosome] = genomeAndChromosome.split(':');
  return [chromosome, start, end] as ChrLocation;
};

export const BrowserImage = (props: BrowserImageProps) => {
  const browserRef = useRef<HTMLDivElement>(null);
  const listenBpaneOut = useCallback((payload: BpaneOutPayload) => {
    const ensObjectId = payload.focus;
    const intendedLocation = payload['intended-location'];
    const actualLocation = payload['actual-location'] || intendedLocation;
    const isFocusObjectInDefaultPosition = payload['is-focus-position'];

    if (payload.bumper && props.activeGenomeId) {
      // Invert the flags to make it appropriate for the react side
      const navIconStates = payload.bumper.map((a) => !a);

      const navStates = {
        [BrowserNavAction.NAVIGATE_UP]: navIconStates[0],
        [BrowserNavAction.NAVIGATE_DOWN]: navIconStates[1],
        [BrowserNavAction.ZOOM_OUT]: navIconStates[2],
        [BrowserNavAction.ZOOM_IN]: navIconStates[3],
        [BrowserNavAction.NAVIGATE_LEFT]: navIconStates[4],
        [BrowserNavAction.NAVIGATE_RIGHT]: navIconStates[5]
      };
      props.updateBrowserNavIconStates({
        activeGenomeId: props.activeGenomeId,
        navStates
      });
    }

    if (intendedLocation) {
      props.setChrLocation(parseLocation(intendedLocation));
    }

    if (actualLocation) {
      props.setActualChrLocation(parseLocation(actualLocation));
    }

    if (ensObjectId) {
      const parsedId = parseFeatureId(ensObjectId);
      props.updateBrowserActiveEnsObject(buildEnsObjectId(parsedId));
    }

    if (typeof isFocusObjectInDefaultPosition === 'boolean') {
      props.updateDefaultPositionFlag(isFocusObjectInDefaultPosition);
    }
  }, []);

  useEffect(() => {
    const subscription = browserMessagingService.subscribe(
      'bpane-out',
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
    [styles.shorter]: props.isNavbarOpen
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
  isNavbarOpen: getBrowserNavOpenState(state),
  browserActivated: getBrowserActivated(state),
  activeGenomeId: getBrowserActiveGenomeId(state),
  isDisabled: getRegionEditorActive(state) || getRegionFieldActive(state)
});

const mapDispatchToProps = {
  activateBrowser,
  updateBrowserActivated,
  updateBrowserNavIconStates,
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
