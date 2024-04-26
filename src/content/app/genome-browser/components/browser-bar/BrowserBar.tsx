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

import { useRef } from 'react';

import { useAppSelector } from 'src/store';

import BrowserReset from '../browser-reset/BrowserReset';
import FeatureSummaryStrip from 'src/shared/components/feature-summary-strip/FeatureSummaryStrip';
import BrowserLocationIndicator from '../browser-location-indicator/BrowserLocationIndicator';

import { getIsDrawerOpened } from 'src/content/app/genome-browser/state/drawer/drawerSelectors';
import { getBrowserActiveFocusObject } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import styles from './BrowserBar.module.css';

export const BrowserBar = () => {
  const focusObject = useAppSelector(getBrowserActiveFocusObject);
  const isDrawerOpened = useAppSelector(getIsDrawerOpened);

  const browserBarRef = useRef<HTMLDivElement>(null);
  const featureSummaryRef = useRef<HTMLDivElement>(null);

  // return empty div instead of null, so that the dedicated slot in the CSS grid of StandardAppLayout
  // always contains a child DOM element
  if (!focusObject) {
    return <div />;
  }

  return (
    <div className={styles.browserBar} ref={browserBarRef}>
      <BrowserReset />
      {focusObject && (
        <FeatureSummaryStrip
          focusObject={focusObject}
          isGhosted={isDrawerOpened}
          ref={featureSummaryRef}
          className={styles.featureSummaryStrip}
        />
      )}
      <BrowserLocationIndicator
        className={styles.browserLocationIndicator}
        containerRef={browserBarRef}
        nonOverlapElementRef={featureSummaryRef}
      />
    </div>
  );
};

export default BrowserBar;
