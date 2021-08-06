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

import React, { useRef, useEffect, memo } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';

import { IncomingAction, IncomingActionType } from 'ensembl-genome-browser';

import useGenomeBrowser from 'src/content/app/browser/hooks/useGenomeBrowser';

import BrowserCogList from '../browser-cog/BrowserCogList';
import { ZmenuController } from 'src/content/app/browser/zmenu';
import { CircleLoader } from 'src/shared/components/loader/Loader';
import Overlay from 'src/shared/components/overlay/Overlay';

import {
  getBrowserCogTrackList,
  getBrowserNavOpenState,
  getBrowserActivated,
  getRegionEditorActive,
  getRegionFieldActive,
  getBrowserActiveGenomeId
} from '../browserSelectors';
import {
  updateBrowserActivated,
  updateBrowserNavIconStates,
  setChrLocation,
  setActualChrLocation,
  updateBrowserActiveEnsObjectIdsAndSave,
  updateDefaultPositionFlag
} from '../browserActions';
import { changeHighlightedTrackId } from 'src/content/app/browser/track-panel/trackPanelActions';

// import { parseFeatureId } from 'src/content/app/browser/browserHelper';
// import { buildEnsObjectId } from 'src/shared/state/ens-object/ensObjectHelpers';

import { BROWSER_CONTAINER_ID } from '../browser-constants';

import { BrowserNavIconStates, ChrLocation, CogList } from '../browserState';
import { RootState } from 'src/store';

import styles from './BrowserImage.scss';

export type BrowserImageProps = {
  browserCogTrackList: CogList;
  isNavbarOpen: boolean;
  browserActivated: boolean;
  isDisabled: boolean;
  activeGenomeId: string | null;
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

// type BpaneOutPayload = {
//   bumper?: BumperPayload;
//   focus?: string;
//   'message-counter'?: number;
//   'intended-location'?: ChrLocation;
//   'actual-location'?: ChrLocation;
//   'is-focus-position'?: boolean;
// };

export const BrowserImage = (props: BrowserImageProps) => {
  const browserRef = useRef<HTMLDivElement>(null);

  const { activateGenomeBrowser, genomeBrowser } = useGenomeBrowser();

  // const listenBpaneOut = useCallback((payload: BpaneOutPayload) => {
  //   const ensObjectId = payload.focus;

  //   const isFocusObjectInDefaultPosition = payload['is-focus-position'];

  //   if (payload.bumper && props.activeGenomeId) {
  //     // Invert the flags to make it appropriate for the react side
  //     const navIconStates = payload.bumper.map((a) => !a);

  //     const navStates = {
  //       [OutgoingActionType.MOVE_UP]: navIconStates[0],
  //       [OutgoingActionType.MOVE_DOWN]: navIconStates[1],
  //       [OutgoingActionType.ZOOM_OUT]: navIconStates[2],
  //       [OutgoingActionType.ZOOM_IN]: navIconStates[3],
  //       [OutgoingActionType.MOVE_LEFT]: navIconStates[4],
  //       [OutgoingActionType.MOVE_RIGHT]: navIconStates[5]
  //     };
  //     props.updateBrowserNavIconStates({
  //       activeGenomeId: props.activeGenomeId,
  //       navStates
  //     });
  //   }

  //   if (ensObjectId) {
  //     const parsedId = parseFeatureId(ensObjectId);
  //     props.updateBrowserActiveEnsObject(buildEnsObjectId(parsedId));
  //   }

  //   if (typeof isFocusObjectInDefaultPosition === 'boolean') {
  //     props.updateDefaultPositionFlag(isFocusObjectInDefaultPosition);
  //   }
  // }, []);

  useEffect(() => {
    const subscription = genomeBrowser?.subscribe(
      [IncomingActionType.CURRENT_POSITION, IncomingActionType.TARGET_POSITION],
      (action: IncomingAction) => {
        if (action.type === IncomingActionType.CURRENT_POSITION) {
          const { stick, start, end } = action.payload;
          const chromosome = stick.split(':')[1];
          props.setActualChrLocation([chromosome, start, end]);
        } else if (action.type === IncomingActionType.TARGET_POSITION) {
          const { stick, start, end } = action.payload;
          const chromosome = stick.split(':')[1];
          props.setChrLocation([chromosome, start, end]);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [genomeBrowser]);

  useEffect(() => {
    activateGenomeBrowser();
    props.updateBrowserActivated(true);
    return () => {
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
        <div id={'other'} />
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
