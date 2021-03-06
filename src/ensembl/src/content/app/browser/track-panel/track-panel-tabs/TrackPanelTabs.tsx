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
import classNames from 'classnames';
import { connect } from 'react-redux';

import { TrackSet } from '../trackPanelConfig';

import { getBrowserActiveEnsObject } from 'src/content/app/browser/browserSelectors';
import {
  getSelectedTrackPanelTab,
  getIsTrackPanelModalOpened,
  getIsTrackPanelOpened
} from 'src/content/app/browser/track-panel/trackPanelSelectors';
import {
  selectTrackPanelTab,
  toggleTrackPanel
} from 'src/content/app/browser/track-panel/trackPanelActions';

import { getIsDrawerOpened } from 'src/content/app/browser/drawer/drawerSelectors';
import { closeDrawer } from 'src/content/app/browser/drawer/drawerActions';

import { RootState } from 'src/store';
import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

import styles from './TrackPanelTabs.scss';

export type TrackPanelTabsProps = {
  closeDrawer: () => void;
  ensObject: EnsObject | null;
  isDrawerOpened: boolean;
  selectTrackPanelTab: (selectedTrackPanelTab: TrackSet) => void;
  selectedTrackPanelTab: TrackSet;
  toggleTrackPanel: (isTrackPanelOpened: boolean) => void;
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
};

export const TrackPanelTabs = (props: TrackPanelTabsProps) => {
  const handleTabClick = (value: TrackSet) => {
    if (!props.ensObject?.genome_id) {
      return;
    }

    if (!props.isTrackPanelOpened) {
      props.toggleTrackPanel(true);
    }

    if (props.isDrawerOpened) {
      props.closeDrawer();
    }

    props.selectTrackPanelTab(value);
  };

  const getTrackPanelTabClassNames = (trackSet: TrackSet) => {
    const isTrackPanelTabActive =
      props.isTrackPanelOpened &&
      props.ensObject?.genome_id &&
      props.selectedTrackPanelTab === trackSet &&
      !props.isDrawerOpened &&
      !props.isTrackPanelModalOpened;

    return classNames(styles.trackPanelTab, {
      [styles.trackPanelTabActive]: isTrackPanelTabActive,
      [styles.trackPanelTabDisabled]: !props.ensObject?.genome_id
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

const mapStateToProps = (state: RootState) => ({
  ensObject: getBrowserActiveEnsObject(state),
  isDrawerOpened: getIsDrawerOpened(state),
  selectedTrackPanelTab: getSelectedTrackPanelTab(state),
  isTrackPanelOpened: getIsTrackPanelOpened(state),
  isTrackPanelModalOpened: getIsTrackPanelModalOpened(state)
});

const mapDispatchToProps = {
  closeDrawer,
  selectTrackPanelTab,
  toggleTrackPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackPanelTabs);
