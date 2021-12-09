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

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import BrowserRegionEditor from '../browser-region-editor/BrowserRegionEditor';
import BrowserRegionField from '../browser-region-field/BrowserRegionField';

import { BreakpointWidth } from 'src/global/globalConfig';

import {
  toggleRegionEditorActive,
  toggleRegionFieldActive
} from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

import { getBreakpointWidth } from 'src/global/globalSelectors';

import styles from './BrowserNavBarRegionSwitcher.scss';

export const BrowserNavBarRegionSwitcher = () => {
  const viewportWidth = useSelector(getBreakpointWidth);
  const dispatch = useDispatch();

  // cleanup on unmount
  useEffect(
    () => () => {
      dispatch(toggleRegionEditorActive(false));
      dispatch(toggleRegionFieldActive(false));
    },
    []
  );

  return (
    <div className={styles.regionSwitcher}>
      <div className={styles.regionFieldWrapper}>
        <BrowserRegionField />
      </div>
      {viewportWidth >= BreakpointWidth.BIG_DESKTOP && (
        <div className={styles.regionEditorWrapper}>
          <BrowserRegionEditor />
        </div>
      )}
    </div>
  );
};

export default BrowserNavBarRegionSwitcher;
