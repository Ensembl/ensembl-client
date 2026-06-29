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
import GenomeBrowserNavigationButtons from '../browser-nav-buttons/GenomeBrowserNavigationButtons';

import { getBrowserActiveFocusObject } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import styles from './BrowserBar.module.css';

export const BrowserBar = () => {
  const focusObject = useAppSelector(getBrowserActiveFocusObject);

  const browserBarRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.browserBar} ref={browserBarRef}>
      <BrowserReset />
      {focusObject && (
        <FeatureSummaryStrip
          focusObject={focusObject}
          className={styles.featureSummaryStrip}
          variety="minimal"
        />
      )}
      <GenomeBrowserNavigationButtons />
      <BrowserLocationIndicator className={styles.browserLocationIndicator} />
    </div>
  );
};

export default BrowserBar;
