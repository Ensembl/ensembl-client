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

import BrowserNavIcon from '../browser-sidebar-modal/modal-views/navigate-modal/browser-nav-icon/BrowserNavIcon';
import Overlay from 'src/shared/components/overlay/Overlay';

import {
  getRegionEditorActive,
  getRegionFieldActive
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getBrowserNavIconStates } from 'src/content/app/genome-browser/state/browser-nav/browserNavSelectors';

import {
  browserNavConfig,
  BrowserNavItem
} from 'src/content/app/genome-browser/components/browser-nav-icon/browserNavConfig';

import styles from './BrowserNavBarControls.scss';

export const BrowserNavBarControls = () => {
  const isRegionEditorActive = useSelector(getRegionEditorActive);
  const isRegionFieldActive = useSelector(getRegionFieldActive);
  const browserNavIconStates = useSelector(getBrowserNavIconStates);
  const isDisabled = isRegionEditorActive || isRegionFieldActive;

  return (
    <div className={styles.browserNavBarControls}>
      {browserNavConfig.map((item: BrowserNavItem) => (
        <BrowserNavIcon
          key={item.name}
          browserNavItem={item}
          enabled={browserNavIconStates[item.name]}
        />
      ))}
      {isDisabled && <Overlay className={styles.overlay} />}
    </div>
  );
};

export default BrowserNavBarControls;
