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

import React from 'react';
import { useSelector } from 'react-redux';

import { getChrLocation, getBrowserActiveEnsObject } from '../browserSelectors';
import { getIsDrawerOpened } from 'src/content/app/browser/state/drawer/drawerSelectors';

import BrowserReset from '../browser-reset/BrowserReset';
import FeatureSummaryStrip from 'src/shared/components/feature-summary-strip/FeatureSummaryStrip';
import BrowserLocationIndicator from '../browser-location-indicator/BrowserLocationIndicator';

import { ChrLocation } from '../browserState';
import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

import styles from './BrowserBar.scss';
import { Environment, isEnvironment } from 'src/shared/helpers/environment';

export type BrowserBarProps = {
  chrLocation: ChrLocation | null;
  defaultChrLocation: ChrLocation | null;
  isDrawerOpened: boolean;
  ensObject: EnsObject | null;
};

export const BrowserBar = () => {
  const chrLocation = useSelector(getChrLocation);
  const ensObject = useSelector(getBrowserActiveEnsObject);
  const isDrawerOpened = useSelector(getIsDrawerOpened);

  // return empty div instead of null, so that the dedicated slot in the CSS grid of StandardAppLayout
  // always contains a child DOM element
  if (!(chrLocation && ensObject)) {
    return <div />;
  }

  return (
    <div className={styles.browserBar}>
      <div className={styles.browserResetWrapper}>
        <BrowserReset />
      </div>
      {ensObject && (
        <FeatureSummaryStrip ensObject={ensObject} isGhosted={isDrawerOpened} />
      )}
      <div className={styles.browserLocationIndicatorWrapper}>
        <BrowserLocationIndicator
          disabled={isDrawerOpened || isEnvironment([Environment.PRODUCTION])}
        />
      </div>
    </div>
  );
};

export default BrowserBar;
