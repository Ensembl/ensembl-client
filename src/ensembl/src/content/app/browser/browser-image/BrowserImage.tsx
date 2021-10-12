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

import React, { useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import BrowserCogList from '../browser-cog/BrowserCogList';
import { ZmenuController } from 'src/content/app/browser/zmenu';
import { CircleLoader } from 'src/shared/components/loader';
import Overlay from 'src/shared/components/overlay/Overlay';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';
import { parseFeatureId } from 'src/content/app/browser/browserHelper';
import { buildEnsObjectId } from 'src/shared/state/ens-object/ensObjectHelpers';
import {
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

import { BrowserNavAction, ChrLocation } from '../browserState';
import { BROWSER_CONTAINER_ID } from '../browser-constants';

import styles from './BrowserImage.scss';

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

export const BrowserImage = () => {
  const isNavbarOpen = useSelector(getBrowserNavOpenState);
  const browserActivated = useSelector(getBrowserActivated);
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const isRegionEditorActive = useSelector(getRegionEditorActive);
  const isRegionFieldActive = useSelector(getRegionFieldActive);
  const isDisabled = isRegionEditorActive || isRegionFieldActive;

  const dispatch = useDispatch();

  const browserRef = useRef<HTMLDivElement>(null);
  const listenBpaneOut = useCallback((payload: BpaneOutPayload) => {
    const ensObjectId = payload.focus;
    const intendedLocation = payload['intended-location'];
    const actualLocation = payload['actual-location'] || intendedLocation;
    const isFocusObjectInDefaultPosition = payload['is-focus-position'];

    if (payload.bumper && activeGenomeId) {
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
      dispatch(
        updateBrowserNavIconStates({
          activeGenomeId,
          navStates
        })
      );
    }

    if (intendedLocation) {
      dispatch(setChrLocation(parseLocation(intendedLocation)));
    }

    if (actualLocation) {
      dispatch(setActualChrLocation(parseLocation(actualLocation)));
    }

    if (ensObjectId) {
      const parsedId = parseFeatureId(ensObjectId);
      dispatch(
        updateBrowserActiveEnsObjectIdsAndSave(buildEnsObjectId(parsedId))
      );
    }

    if (typeof isFocusObjectInDefaultPosition === 'boolean') {
      dispatch(updateDefaultPositionFlag(isFocusObjectInDefaultPosition));
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
    dispatch(activateBrowser());

    return function cleanup() {
      dispatch(updateBrowserActivated(false));
    };
  }, []);

  const browserContainerClassNames = classNames(styles.browserStage, {
    [styles.shorter]: isNavbarOpen
  });

  return (
    <>
      {!browserActivated && (
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
        {isDisabled ? <Overlay /> : null}
      </div>
    </>
  );
};

export default BrowserImage;
