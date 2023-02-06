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

import React, { useEffect, useRef } from 'react';

import { useAppSelector } from 'src/store';
import useGenomeBrowser from 'src/content/app/genome-browser/hooks/useGenomeBrowser';
import { useGbRegionQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import {
  getBrowserActiveGenomeId,
  getActualChrLocation
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import BrowserNavButton from 'src/content/app/genome-browser/components/browser-nav-button/BrowserNavButton';
import BrowserReset from 'src/content/app/genome-browser/components/browser-reset/BrowserReset';

import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

import styles from './GenomeBrowserNavigationButtons.scss';

type BrowserLocation = {
  regionLength: number;
  regionName: string;
  start: number;
  end: number;
};

/**
 * General considerations:
 * - left/right buttons move the genome browser 10% of the viewport width left or right
 * - zoom in / zoom out buttons zoom in or out by 30% of the visible sequence length
 */

const GenomeBrowserNavigationButtons = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId) as string;
  const browserLocation = useAppSelector(getActualChrLocation) as ChrLocation;
  const { changeBrowserLocation } = useGenomeBrowser();
  const userInputInProgressRef = useRef(false);
  const userInputTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Chromosome locations in redux are updated by messages from the genome browser.
  // These may come too slow for a user who is hammering away at a navigation button.
  // Therefore, for a more consistent user experience, we are creating a local copy of browser location just for this component
  const browserLocationRef = useRef<BrowserLocation>({
    regionLength: Infinity,
    regionName: browserLocation ? browserLocation[0] : '', // just being extra cautious when accessing parts of the browser location
    start: browserLocation ? browserLocation[1] : 1,
    end: browserLocation ? browserLocation[2] : 100
  });

  const { currentData: regionData } = useGbRegionQuery({
    genomeId: activeGenomeId,
    regionName: browserLocation[0] ?? ''
  });

  useEffect(() => {
    if (
      (browserLocation &&
        browserLocation[0] !== browserLocationRef.current.regionName) ||
      !userInputInProgressRef.current
    ) {
      const [regionName, start, end] = browserLocation;
      browserLocationRef.current = {
        regionLength: regionData?.region.length ?? Infinity,
        regionName,
        start,
        end
      };
    }
  }, [activeGenomeId, browserLocation, regionData?.region.length]);

  // TODO: add query for the region so as to never exceed the region length

  const moveLeft = () => {
    move('left');
  };

  const moveRight = () => {
    move('right');
  };

  const move = (direction: 'left' | 'right') => {
    onUserInput();
    const { regionName, start, end, regionLength } = browserLocationRef.current;
    const regionInViewportLength = end - start; // NOTE: this may not work with circular chromosomes; but cirtular chromosomes are far away
    const moveDistance = Math.round(regionInViewportLength * 0.1);
    let newStart: number, newEnd: number;
    if (direction === 'left') {
      newStart = Math.max(start - moveDistance, 1);
      newEnd = newStart + regionInViewportLength;
    } else {
      newEnd = Math.min(end + moveDistance, regionLength);
      newStart = newEnd - regionInViewportLength;
    }
    changeBrowserLocation({
      genomeId: activeGenomeId,
      chrLocation: [regionName, newStart, newEnd]
    });
    browserLocationRef.current = {
      ...browserLocationRef.current,
      start: newStart,
      end: newEnd
    };
  };

  const zoomIn = () => {
    zoom('in');
  };

  const zoomOut = () => {
    zoom('out');
  };

  const zoom = (direction: 'in' | 'out') => {
    onUserInput();
    const { regionName, start, end, regionLength } = browserLocationRef.current;
    const regionInViewportLength = end - start; // NOTE: this may not work with circular chromosomes; but cirtular chromosomes are far away
    const zoomDistance = Math.round(regionInViewportLength * 0.3);
    let newStart: number, newEnd: number;
    if (direction === 'in') {
      newStart = Math.round(start + zoomDistance / 2);
      newEnd = Math.max(Math.round(end - zoomDistance / 2), newStart + 1);
    } else {
      // TODO: make sure to account for max chromosome length
      newStart = Math.max(Math.round(start - zoomDistance / 2), 1);
      newEnd = Math.min(Math.round(end + zoomDistance / 2), regionLength);
    }
    changeBrowserLocation({
      genomeId: activeGenomeId,
      chrLocation: [regionName, newStart, newEnd]
    });
    browserLocationRef.current = {
      ...browserLocationRef.current,
      start: newStart,
      end: newEnd
    };
  };

  const onUserInput = () => {
    clearUserInputTimeout;
    userInputInProgressRef.current = true;
    userInputTimeoutRef.current = setTimeout(() => {
      userInputInProgressRef.current = false;
      userInputTimeoutRef.current = null;
    }, 500);
  };

  const clearUserInputTimeout = () => {
    if (userInputTimeoutRef.current) {
      clearTimeout(userInputTimeoutRef.current);
    }
  };

  return (
    <div className={styles.container}>
      <BrowserNavButton
        name="moveLeft"
        description="navigate left"
        onClick={moveLeft}
      />
      <BrowserNavButton
        name="moveRight"
        description="navigate right"
        onClick={moveRight}
      />
      <BrowserNavButton
        name="zoomOut"
        description="zoom out"
        className={styles.zoomOutButton}
        onClick={zoomOut}
      />
      <BrowserNavButton
        name="zoomIn"
        description="zoom in"
        className={styles.zoomInButton}
        onClick={zoomIn}
      />
      <BrowserReset className={styles.browserReset} />
    </div>
  );
};

export default GenomeBrowserNavigationButtons;
