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

import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import debounce from 'lodash/debounce';

import { IncomingAction, IncomingActionType } from 'ensembl-genome-browser';

import useGenomeBrowser from 'src/content/app/browser/hooks/useGenomeBrowser';

import BrowserCogList from '../browser-cog/BrowserCogList';
import { ZmenuController } from 'src/content/app/browser/zmenu';
import { CircleLoader } from 'src/shared/components/loader';
import Overlay from 'src/shared/components/overlay/Overlay';

import {
  getBrowserNavOpenState,
  getRegionEditorActive,
  getRegionFieldActive
} from '../browserSelectors';

import { setChrLocation, setActualChrLocation } from '../browserActions';
import { ChrLocation } from 'ensemblRoot/src/content/app/browser/browserState';

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

export const BrowserImage = () => {
  const browserRef = useRef<HTMLDivElement>(null);

  const { activateGenomeBrowser, genomeBrowser } = useGenomeBrowser();

  const isNavbarOpen = useSelector(getBrowserNavOpenState);
  const isRegionEditorActive = useSelector(getRegionEditorActive);
  const isRegionFieldActive = useSelector(getRegionFieldActive);
  const isDisabled = isRegionEditorActive || isRegionFieldActive;

  const dispatch = useDispatch();

  const updateChrLocation = useCallback(
    debounce((chrLocation) => dispatch(setChrLocation(chrLocation)), 500, {
      trailing: true
    }),
    []
  );

  useEffect(() => {
    const subscription = genomeBrowser?.subscribe(
      [IncomingActionType.CURRENT_POSITION, IncomingActionType.TARGET_POSITION],
      (action: IncomingAction) => {
        if (action.type === IncomingActionType.CURRENT_POSITION) {
          const { stick, start, end } = action.payload;
          const chromosome = stick.split(':')[1];
          dispatch(setActualChrLocation([chromosome, start, end]));
        } else if (action.type === IncomingActionType.TARGET_POSITION) {
          const { stick, start, end } = action.payload;
          const chromosome = stick.split(':')[1];
          const chrLocation = [chromosome, start, end] as ChrLocation;
          updateChrLocation(chrLocation);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [genomeBrowser]);

  useEffect(() => {
    if (!genomeBrowser) {
      activateGenomeBrowser();
    }
  }, []);

  const browserContainerClassNames = classNames(styles.browserStage, {
    [styles.shorter]: isNavbarOpen
  });

  const browserImageContents = useMemo(() => {
    return (
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
  }, []);

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

export default BrowserImage;
