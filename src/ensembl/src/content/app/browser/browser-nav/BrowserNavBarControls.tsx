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
import { connect } from 'react-redux';

import BrowserNavIcon from './BrowserNavIcon';
import Overlay from 'src/shared/components/overlay/Overlay';

import { browserNavConfig, BrowserNavItem } from '../browserConfig';
import {
  getBrowserNavIconStates,
  getRegionEditorActive,
  getRegionFieldActive
} from '../browserSelectors';
import { BrowserNavAction, BrowserNavIconStates } from '../browserState';

import { RootState } from 'src/store';

import styles from './BrowserNavBarControls.scss';

type Props = {
  browserNavIconStates: BrowserNavIconStates;
  isDisabled: boolean;
};


export const BrowserNavBarControls = (props: Props) => (
  <div className={styles.browserNavBarControls}>
    {browserNavConfig.map((item: BrowserNavItem) => (
      <BrowserNavIcon
        key={item.name}
        browserNavItem={item}
        enabled={props.browserNavIconStates[item.name]}
      />
    ))}
    {props.isDisabled && <Overlay className={styles.overlay} />}
  </div>
);

const mapStateToProps = (state: RootState) => {
  const isDisabled =
    getRegionEditorActive(state) || getRegionFieldActive(state);

  return {
    browserNavIconStates: getBrowserNavIconStates(state),
    isDisabled
  };
};

export default connect(mapStateToProps)(BrowserNavBarControls);
