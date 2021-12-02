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
import { useDispatch, useSelector } from 'react-redux';

import {
  getIsTrackPanelOpened,
  getTrackPanelModalView
} from 'src/content/app/browser/components/track-panel/state/trackPanelSelectors';
import { getIsDrawerOpened } from 'src/content/app/browser/state/drawer/drawerSelectors';
import { getBrowserActiveGenomeId } from 'src/content/app/browser/state/browserSelectors';

import {
  toggleTrackPanel,
  closeTrackPanelModal,
  openTrackPanelModal
} from 'src/content/app/browser/components/track-panel/state/trackPanelActions';
import { closeDrawer } from 'src/content/app/browser/state/drawer/drawerSlice';
import { clearSearch } from 'src/shared/state/in-app-search/inAppSearchSlice';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as searchIcon } from 'static/img/sidebar/search.svg';
import { ReactComponent as tracksManagerIcon } from 'static/img/sidebar/tracks-manager.svg';
import { ReactComponent as bookmarkIcon } from 'static/img/sidebar/bookmark.svg';
import { ReactComponent as personalDataIcon } from 'static/img/sidebar/own-data.svg';
import { ReactComponent as shareIcon } from 'static/img/sidebar/share.svg';
import { ReactComponent as downloadIcon } from 'static/img/sidebar/download.svg';

import { Status } from 'src/shared/types/status';

import styles from 'src/shared/components/layout/StandardAppLayout.scss';

export const TrackPanelBar = () => {
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const isTrackPanelOpened = useSelector(getIsTrackPanelOpened);
  const trackPanelModalView = useSelector(getTrackPanelModalView);
  const isDrawerOpened = useSelector(getIsDrawerOpened);
  const dispatch = useDispatch();

  const toggleModalView = (selectedItem: string) => {
    if (!isTrackPanelOpened) {
      dispatch(toggleTrackPanel(true));
    }

    if (isDrawerOpened) {
      dispatch(closeDrawer());
    }

    if (selectedItem === 'search') {
      dispatch(
        clearSearch({
          app: 'genomeBrowser',
          genomeId: activeGenomeId as string
        })
      );
    }

    if (selectedItem === trackPanelModalView) {
      dispatch(closeTrackPanelModal());
    } else {
      dispatch(openTrackPanelModal(selectedItem));
    }
  };

  const getViewIconStatus = (selectedItem: string) => {
    return selectedItem === trackPanelModalView && isTrackPanelOpened
      ? Status.SELECTED
      : Status.UNSELECTED;
  };

  return (
    <>
      <div className={styles.sidebarIcon} key="search">
        <ImageButton
          status={getViewIconStatus('search')}
          description="Search"
          onClick={() => toggleModalView('search')}
          image={searchIcon}
        />
      </div>
      <div className={styles.sidebarIcon} key="tracks-manager">
        <ImageButton
          status={Status.DISABLED}
          description="Tracks manager"
          onClick={() => toggleModalView('tracks-manager')}
          image={tracksManagerIcon}
        />
      </div>
      <div className={styles.sidebarIcon} key="bookmarks">
        <ImageButton
          status={getViewIconStatus('bookmarks')}
          description="Previously viewed"
          onClick={() => toggleModalView('bookmarks')}
          image={bookmarkIcon}
        />
      </div>
      <div className={styles.sidebarIcon} key="personal-data">
        <ImageButton
          status={Status.DISABLED}
          description="Personal data"
          onClick={() => toggleModalView('personal-data')}
          image={personalDataIcon}
        />
      </div>
      <div className={styles.sidebarIcon} key="share">
        <ImageButton
          status={Status.DISABLED}
          description="Share"
          onClick={() => toggleModalView('share')}
          image={shareIcon}
        />
      </div>
      <div className={styles.sidebarIcon} key="downloads">
        <ImageButton
          status={Status.DISABLED}
          description="Downloads"
          onClick={() => toggleModalView('downloads')}
          image={downloadIcon}
        />
      </div>
    </>
  );
};

export default TrackPanelBar;
