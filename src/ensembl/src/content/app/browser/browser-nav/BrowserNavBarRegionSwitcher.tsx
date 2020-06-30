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
import { connect } from 'react-redux';

import BrowserRegionEditor from '../browser-region-editor/BrowserRegionEditor';
import BrowserRegionField from '../browser-region-field/BrowserRegionField';

import { BreakpointWidth } from 'src/global/globalConfig';

import {
  toggleRegionEditorActive,
  toggleRegionFieldActive
} from '../browserActions';

import { getBreakpointWidth } from 'src/global/globalSelectors';
import { RootState } from 'src/store';

import styles from './BrowserNavBarRegionSwitcher.scss';

type Props = {
  viewportWidth: BreakpointWidth;
  toggleRegionEditorActive: (isActive: boolean) => void;
  toggleRegionFieldActive: (isActive: boolean) => void;
};

export const BrowserNavBarRegionSwitcher = (props: Props) => {
  // cleanup on unmount
  useEffect(
    () => () => {
      props.toggleRegionEditorActive(false);
      props.toggleRegionFieldActive(false);
    },
    []
  );

  return (
    <div className={styles.regionSwitcher}>
      <div className={styles.regionFieldWrapper}>
        <BrowserRegionField />
      </div>
      {props.viewportWidth >= BreakpointWidth.LAPTOP && (
        <div className={styles.regionEditorWrapper}>
          <BrowserRegionEditor />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  viewportWidth: getBreakpointWidth(state)
});

const mapDispatchToProps = {
  toggleRegionEditorActive,
  toggleRegionFieldActive
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserNavBarRegionSwitcher);
