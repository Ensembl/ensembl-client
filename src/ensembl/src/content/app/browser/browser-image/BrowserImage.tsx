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
import { CircleLoader } from 'src/shared/components/loader';
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

import { getDefaultChrLocation } from 'src/content/app/browser/browserSelectors';
import { changeHighlightedTrackId } from 'src/content/app/browser/track-panel/trackPanelActions';

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
  defaultChrLocation: ChrLocation | null;
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

export const BrowserImage = (props: BrowserImageProps) => {
  const browserRef = useRef<HTMLDivElement>(null);

  const { activateGenomeBrowser, genomeBrowser } = useGenomeBrowser();

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
  }, [genomeBrowser, props.defaultChrLocation]);

  useEffect(() => {
    const activateBrowser = async () => {
      if (!genomeBrowser) {
        await activateGenomeBrowser();
      }
    };

    activateBrowser();

    // TODO: Check if this is required
    // return () => {
    //   props.updateBrowserActivated(false);
    // };
  }, [genomeBrowser]);

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
        <div id="other"></div>
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
  defaultChrLocation: getDefaultChrLocation(state),
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
