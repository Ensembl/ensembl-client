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

import { useAppSelector } from 'src/store';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import useGenomeBrowserPosition from 'src/content/app/genome-browser/hooks/useGenomeBrowserPosition';

import BrowserCogList from '../browser-cog/BrowserCogList';
import { ZmenuController } from 'src/content/app/genome-browser/components/zmenu';
import { CircleLoader } from 'src/shared/components/loader';
import Overlay from 'src/shared/components/overlay/Overlay';
import GenomeBrowserError from 'src/content/app/genome-browser/components/genome-browser-error/GenomeBrowserError';
import BrowserTrackLegend from 'src/content/app/genome-browser/components/browser-track-legend/BrowserTrackLegend';

import {
  getRegionEditorActive,
  getRegionFieldActive
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import styles from './BrowserImage.scss';

export const BrowserImage = () => {
  const browserViewportRef = useRef<HTMLDivElement>(null);
  const browserContainerRef = useRef<HTMLDivElement>(null);
  const browserActivatedRef = useRef(false);
  const [genomeBrowserError, setGenomeBrowserError] = useState<{
    type: string;
    payload: unknown;
  } | null>(null);

  const {
    activateGenomeBrowser,
    clearGenomeBrowser,
    genomeBrowser,
    genomeBrowserService
  } = useGenomeBrowser();

  useGenomeBrowserPosition();

  const isRegionEditorActive = useAppSelector(getRegionEditorActive);
  const isRegionFieldActive = useAppSelector(getRegionFieldActive);
  const isDisabled = isRegionEditorActive || isRegionFieldActive;

  useEffect(() => {
    if (!genomeBrowser && !browserActivatedRef.current) {
      activateGenomeBrowser({
        container: browserContainerRef.current as HTMLElement
      });
      // a hack to avoid repeated genome browser activation in Strict Mode
      // (which renders every component twice in dev mode)
      browserActivatedRef.current = true;
    }

    return () => clearGenomeBrowser();
  }, []);

  useEffect(() => {
    // Here's hoping that one day, the out-of-date message
    // will be merged together with other error messages from the genome browser
    const outOfDateErrorSubscription = genomeBrowserService?.subscribe(
      'out-of-date',
      (message) => {
        setGenomeBrowserError(message);
      }
    );

    const errorSubscription = genomeBrowserService?.subscribe(
      'error',
      (message: { type: string; payload: unknown }) => {
        console.error(message.payload);
      }
    );

    const subscriptions = [outOfDateErrorSubscription, errorSubscription];

    return () =>
      subscriptions.forEach((subscription) => {
        subscription?.unsubscribe();
      });
  }, [genomeBrowser]);

  const browserImageContents = (
    <div ref={browserViewportRef} className={styles.browserImageWrapper}>
      <div className={styles.browserStage} ref={browserContainerRef}>
        <ZmenuController containerRef={browserContainerRef} />
        <BrowserCogList />
        <BrowserTrackLegend containerRef={browserViewportRef} />
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
