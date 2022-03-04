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
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {
  BrowserCurrentLocationUpdateAction,
  BrowserTargetLocationUpdateAction,
  IncomingActionType
} from '@ensembl/ensembl-genome-browser';

import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';

import BrowserCogList from '../browser-cog/BrowserCogList';
import { ZmenuController } from 'src/content/app/genome-browser/components/zmenu';
import { CircleLoader } from 'src/shared/components/loader';
import Overlay from 'src/shared/components/overlay/Overlay';

import { BROWSER_CONTAINER_ID } from 'src/content/app/genome-browser/constants/browser-constants';

import {
  getRegionEditorActive,
  getRegionFieldActive
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import {
  updateActualChrLocation,
  ChrLocation,
  setChrLocation
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import { getBrowserNavOpenState } from 'src/content/app/genome-browser/state/browser-nav/browserNavSelectors';

import styles from './BrowserImage.scss';

export const BrowserImage = () => {
  const browserRef = useRef<HTMLDivElement>(null);

  const { activateGenomeBrowser, clearGenomeBrowser, genomeBrowser } =
    useGenomeBrowser();

  const isNavbarOpen = useSelector(getBrowserNavOpenState);
  const isRegionEditorActive = useSelector(getRegionEditorActive);
  const isRegionFieldActive = useSelector(getRegionFieldActive);
  const isDisabled = isRegionEditorActive || isRegionFieldActive;

  const dispatch = useDispatch();

  useEffect(() => {
    const positionUpdate = (
      action:
        | BrowserCurrentLocationUpdateAction
        | BrowserTargetLocationUpdateAction
    ) => {
      if (action.type === IncomingActionType.CURRENT_POSITION) {
        const { stick, start, end } = action.payload;
        const chromosome = stick.split(':')[1];
        dispatch(updateActualChrLocation([chromosome, start, end]));
      } else if (action.type === IncomingActionType.TARGET_POSITION) {
        const { stick, start, end } = action.payload;
        const chromosome = stick.split(':')[1];
        const chrLocation = [chromosome, start, end] as ChrLocation;
        dispatch(setChrLocation(chrLocation));
      }
    };

    const subscriptionToActualPotitionMessages = genomeBrowser?.subscribe(
      IncomingActionType.CURRENT_POSITION,
      positionUpdate
    );
    const subscriptionToTargetPotitionMessages = genomeBrowser?.subscribe(
      IncomingActionType.TARGET_POSITION,
      positionUpdate
    );

    return () => {
      subscriptionToActualPotitionMessages?.unsubscribe();
      subscriptionToTargetPotitionMessages?.unsubscribe();
    };
  }, [genomeBrowser]);

  useEffect(() => {
    if (!genomeBrowser) {
      activateGenomeBrowser();
    }

    return () => clearGenomeBrowser();
  }, []);

  const browserContainerClassNames = classNames(styles.browserStage, {
    [styles.shorter]: isNavbarOpen
  });

  const browserImageContents = (
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
  );

  return (
    <>
      {!genomeBrowser && (
        <div className={styles.loaderWrapper}>
          <CircleLoader />
        </div>
      )}
      {browserImageContents}
    </>
  );
};

export default memo(BrowserImage);
