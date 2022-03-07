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
} from 'src/content/app/genome-browser/state/track-panel/trackPanelSelectors';
import { getIsDrawerOpened } from 'src/content/app/genome-browser/state/drawer/drawerSelectors';
import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import {
  toggleTrackPanel,
  closeTrackPanelModal,
  openTrackPanelModal
} from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';
import { closeDrawer } from 'src/content/app/genome-browser/state/drawer/drawerSlice';
import { clearSearch } from 'src/shared/state/in-app-search/inAppSearchSlice';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import SearchIcon from 'static/icons/icon_search.svg';
import TracksManagerIcon from 'static/icons/icon_sliders.svg';
import BookmarkIcon from 'static/icons/icon_bookmark.svg';
import PersonalDataIcon from 'static/icons/icon_plus_circle.svg';
import ShareIcon from 'static/icons/icon_share.svg';
import DownloadIcon from 'static/icons/icon_download.svg';

import { Status } from 'src/shared/types/status';

import layoutStyles from 'src/shared/components/layout/StandardAppLayout.scss';

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
      <ImageButton
        className={layoutStyles.sidebarIcon}
        status={getViewIconStatus('search')}
        description="Search"
        onClick={() => toggleModalView('search')}
        image={SearchIcon}
      />
      <ImageButton
        className={layoutStyles.sidebarIcon}
        status={Status.DISABLED}
        description="Tracks manager"
        onClick={() => toggleModalView('tracks-manager')}
        image={TracksManagerIcon}
      />
      <ImageButton
        className={layoutStyles.sidebarIcon}
        status={getViewIconStatus('bookmarks')}
        description="Previously viewed"
        onClick={() => toggleModalView('bookmarks')}
        image={BookmarkIcon}
      />
      <ImageButton
        className={layoutStyles.sidebarIcon}
        status={Status.DISABLED}
        description="Personal data"
        onClick={() => toggleModalView('personal-data')}
        image={PersonalDataIcon}
      />
      <ImageButton
        className={layoutStyles.sidebarIcon}
        status={Status.DISABLED}
        description="Share"
        onClick={() => toggleModalView('share')}
        image={ShareIcon}
      />
      <ImageButton
        className={layoutStyles.sidebarIcon}
        status={Status.DISABLED}
        description="Downloads"
        onClick={() => toggleModalView('downloads')}
        image={DownloadIcon}
      />
    </>
  );
};

export default TrackPanelBar;
