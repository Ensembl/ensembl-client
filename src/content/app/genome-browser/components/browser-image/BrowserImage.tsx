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

import React, { useState, useRef, useEffect, memo } from 'react';
import {
  IncomingActionType,
  GenomeBrowserErrorType,
  type GenomeBrowserErrorAction,
  type GenomeBrowserError as GenomeBrowserErrorObj
} from '@ensembl/ensembl-genome-browser';

import { useAppSelector } from 'src/store';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import useGenomeBrowserPosition from 'src/content/app/genome-browser/hooks/useGenomeBrowserPosition';

import BrowserCogList from '../browser-cog/BrowserCogList';
import { ZmenuController } from 'src/content/app/genome-browser/components/zmenu';
import { CircleLoader } from 'src/shared/components/loader';
import Overlay from 'src/shared/components/overlay/Overlay';
import GenomeBrowserError from 'src/content/app/genome-browser/components/genome-browser-error/GenomeBrowserError';

import { BROWSER_CONTAINER_ID } from 'src/content/app/genome-browser/constants/browserConstants';

import {
  getRegionEditorActive,
  getRegionFieldActive
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import styles from './BrowserImage.scss';

export const BrowserImage = () => {
  const browserRef = useRef<HTMLDivElement>(null);
  const browserActivatedRef = useRef(false);
  const [genomeBrowserError, setGenomeBrowserError] =
    useState<GenomeBrowserErrorObj | null>(null);

  const { activateGenomeBrowser, clearGenomeBrowser, genomeBrowser } =
    useGenomeBrowser();

  useGenomeBrowserPosition();

  const isRegionEditorActive = useAppSelector(getRegionEditorActive);
  const isRegionFieldActive = useAppSelector(getRegionFieldActive);
  const isDisabled = isRegionEditorActive || isRegionFieldActive;

  useEffect(() => {
    if (!genomeBrowser && !browserActivatedRef.current) {
      activateGenomeBrowser();
      // a hack to avoid repeated genome browser activation in Strict Mode
      // (which renders every component twice in dev mode)
      browserActivatedRef.current = true;
    }

    return () => clearGenomeBrowser();
  }, []);

  useEffect(() => {
    const subscription = genomeBrowser?.subscribe(
      IncomingActionType.OUT_OF_DATE, // TODO: change to IncomingActionType.ERROR when genome browser starts sending proper errors
      (action: GenomeBrowserErrorAction) => {
        const error = action.payload;
        if (error.type === GenomeBrowserErrorType.BAD_VERSION) {
          setGenomeBrowserError(error);
        }
      }
    );
    return () => subscription?.unsubscribe();
  }, [genomeBrowser]);

  const browserImageContents = (
    <div className={styles.browserImageWrapper}>
      <div
        id={BROWSER_CONTAINER_ID}
        className={styles.browserStage}
        ref={browserRef}
      >
        <BrowserCogList />
        <ZmenuController browserRef={browserRef} />
      </div>
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
      {genomeBrowserError ? (
        <GenomeBrowserError error={genomeBrowserError} />
      ) : (
        browserImageContents
      )}
    </>
  );
};

export default memo(BrowserImage);
