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
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { TrackSet } from '../../trackPanelConfig';

import { getBrowserActiveEnsObject } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import {
  getSelectedTrackPanelTab,
  getIsTrackPanelModalOpened,
  getIsTrackPanelOpened
} from 'src/content/app/genome-browser/state/track-panel/trackPanelSelectors';
import {
  selectTrackPanelTab,
  toggleTrackPanel
} from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';

import { getIsDrawerOpened } from 'src/content/app/genome-browser/state/drawer/drawerSelectors';
import { closeDrawer } from 'src/content/app/genome-browser/state/drawer/drawerSlice';

import styles from './TrackPanelTabs.scss';

export const TrackPanelTabs = () => {
  const focusObject = useSelector(getBrowserActiveEnsObject);
  const isDrawerOpened = useSelector(getIsDrawerOpened);
  const selectedTrackPanelTab = useSelector(getSelectedTrackPanelTab);
  const isTrackPanelOpened = useSelector(getIsTrackPanelOpened);
  const isTrackPanelModalOpened = useSelector(getIsTrackPanelModalOpened);

  const dispatch = useDispatch();

  const handleTabClick = (value: TrackSet) => {
    if (!focusObject?.genome_id) {
      return;
    }

    if (!isTrackPanelOpened) {
      dispatch(toggleTrackPanel(true));
    }

    if (isDrawerOpened) {
      dispatch(closeDrawer());
    }

    dispatch(selectTrackPanelTab(value));
  };

  const getTrackPanelTabClassNames = (trackSet: TrackSet) => {
    const isTrackPanelTabActive =
      isTrackPanelOpened &&
      focusObject?.genome_id &&
      selectedTrackPanelTab === trackSet &&
      !isDrawerOpened &&
      !isTrackPanelModalOpened;

    return classNames(styles.trackPanelTab, {
      [styles.trackPanelTabActive]: isTrackPanelTabActive,
      [styles.trackPanelTabDisabled]: !focusObject?.genome_id
    });
  };

  return (
    <div className={`${styles.trackPanelTabs}`}>
      {Object.values(TrackSet).map((value: TrackSet) => (
        <span
          className={getTrackPanelTabClassNames(value)}
          key={value}
          onClick={() => handleTabClick(value)}
        >
          {value}
        </span>
      ))}
    </div>
  );
};

export default memo(TrackPanelTabs);
