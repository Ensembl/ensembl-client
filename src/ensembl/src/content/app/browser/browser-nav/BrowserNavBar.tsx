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
import classNames from 'classnames';

import BrowserNavBarControls from './BrowserNavBarControls';
import BrowserNavBarMain from './BrowserNavBarMain';

import { RootState } from 'src/store';
import { getIsTrackPanelOpened } from '../track-panel/trackPanelSelectors';

import styles from './BrowserNavBar.scss';

export type BrowserNavBarProps = {
  expanded: boolean;
};

export const BrowserNavBar = (props: BrowserNavBarProps) => {
  const className = classNames(styles.browserNavBar, {
    [styles.browserNavBarExpanded]: props.expanded
  });

  return (
    <div className={className}>
      <BrowserNavBarControls />
      <BrowserNavBarMain />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  expanded: !getIsTrackPanelOpened(state)
});

export default connect(mapStateToProps)(BrowserNavBar);
