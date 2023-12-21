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

import { useAppSelector, useAppDispatch } from 'src/store';

import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

import { TrackSet } from '../../trackPanelConfig';

import { getBrowserActiveFocusObject } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import {
  getSelectedTrackPanelTab,
  getIsTrackPanelOpened
} from 'src/content/app/genome-browser/state/track-panel/trackPanelSelectors';
import {
  selectTrackPanelTab,
  toggleTrackPanel
} from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';
import { useGenomeTracksQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import { getIsBrowserSidebarModalOpened } from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSelectors';
import { getIsDrawerOpened } from 'src/content/app/genome-browser/state/drawer/drawerSelectors';
import { closeDrawer } from 'src/content/app/genome-browser/state/drawer/drawerSlice';

import styles from './TrackPanelTabs.module.css';

export const TrackPanelTabs = () => {
  const focusObject = useAppSelector(getBrowserActiveFocusObject);
  const isDrawerOpened = useAppSelector(getIsDrawerOpened);
  const selectedTrackPanelTab = useAppSelector(getSelectedTrackPanelTab);
  const isTrackPanelOpened = useAppSelector(getIsTrackPanelOpened);
  const isBrowserSidebarModalOpened = useAppSelector(
    getIsBrowserSidebarModalOpened
  );
  const { currentData: genomeTrackCategories } = useGenomeTracksQuery(
    focusObject?.genome_id ?? '',
    {
      skip: !focusObject?.genome_id
    }
  );

  const { reportTrackPanelTabChange } = useGenomeBrowserAnalytics();
  const dispatch = useAppDispatch();

  const hasTracksInCategory = (trackSet: TrackSet) => {
    return genomeTrackCategories?.reduce((hasTracks, category) => {
      return (
        (category.type === trackSet && category.track_list.length > 0) ||
        hasTracks
      );
    }, false);
  };

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

    reportTrackPanelTabChange(value);

    dispatch(selectTrackPanelTab(value));
  };

  const getTrackPanelTabClassNames = (
    trackSet: TrackSet,
    isDisabled: boolean
  ) => {
    const isTrackPanelTabActive =
      isTrackPanelOpened &&
      focusObject?.genome_id &&
      selectedTrackPanelTab === trackSet &&
      !isDrawerOpened &&
      !isBrowserSidebarModalOpened;

    return classNames(styles.trackPanelTab, {
      [styles.trackPanelTabActive]: isTrackPanelTabActive,
      [styles.trackPanelTabDisabled]: isDisabled
    });
  };

  return (
    <div className={`${styles.trackPanelTabs}`}>
      {Object.values(TrackSet).map((tabName: TrackSet) => {
        const isTabDisabled =
          !focusObject?.genome_id || !hasTracksInCategory(tabName);
        const isTabEnabled = !isTabDisabled;

        return (
          <span
            className={getTrackPanelTabClassNames(tabName, isTabDisabled)}
            key={tabName}
            onClick={isTabEnabled ? () => handleTabClick(tabName) : undefined}
          >
            {tabName}
          </span>
        );
      })}
    </div>
  );
};

export default memo(TrackPanelTabs);
