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

import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';

import BrowserNavBarControls from './BrowserNavBarControls';
import BrowserNavBarMain from './BrowserNavBarMain';

import { getIsTrackPanelOpened } from 'src/content/app/genome-browser/components/track-panel/state/trackPanelSelectors';

import styles from './BrowserNavBar.scss';

export const BrowserNavBar = () => {
  const expanded = !useSelector(getIsTrackPanelOpened);

  const className = classNames(styles.browserNavBar, {
    [styles.browserNavBarExpanded]: expanded
  });

  return (
    <div className={className}>
      <BrowserNavBarControls />
      <BrowserNavBarMain />
    </div>
  );
};

export default memo(BrowserNavBar);
