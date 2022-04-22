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

import { useAppDispatch, useAppSelector } from 'src/store';

import { getIsTrackPanelOpened } from 'src/content/app/genome-browser/state/track-panel/trackPanelSelectors';
import { getBrowserSidebarModalView } from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSelectors';
import { getIsDrawerOpened } from 'src/content/app/genome-browser/state/drawer/drawerSelectors';
import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import { toggleTrackPanel } from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';
import {
  closeBrowserSidebarModal,
  openBrowserSidebarModal,
  BrowserSidebarModalView
} from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';
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
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const isTrackPanelOpened = useAppSelector(getIsTrackPanelOpened);
  const browserSidebarModalView = useAppSelector(getBrowserSidebarModalView);
  const isDrawerOpened = useAppSelector(getIsDrawerOpened);
  const dispatch = useAppDispatch();

  const toggleModalView = (selectedItem: BrowserSidebarModalView) => {
    if (!isTrackPanelOpened) {
      dispatch(toggleTrackPanel(true));
    }

    if (isDrawerOpened) {
      dispatch(closeDrawer());
    }

    if (selectedItem === BrowserSidebarModalView.SEARCH) {
      dispatch(
        clearSearch({
          app: 'genomeBrowser',
          genomeId: activeGenomeId as string
        })
      );
    }

    if (selectedItem === browserSidebarModalView) {
      dispatch(closeBrowserSidebarModal());
    } else {
      dispatch(openBrowserSidebarModal(selectedItem));
    }
  };

  const getViewIconStatus = (selectedItem: string) => {
    return selectedItem === browserSidebarModalView && isTrackPanelOpened
      ? Status.SELECTED
      : Status.UNSELECTED;
  };

  return (
    <>
      <ImageButton
        className={layoutStyles.sidebarIcon}
        status={getViewIconStatus(BrowserSidebarModalView.SEARCH)}
        description="Search"
        onClick={() => toggleModalView(BrowserSidebarModalView.SEARCH)}
        image={SearchIcon}
      />
      <ImageButton
        className={layoutStyles.sidebarIcon}
        status={Status.DISABLED}
        description="Tracks manager"
        onClick={() => toggleModalView(BrowserSidebarModalView.TRACKS_MANAGER)}
        image={TracksManagerIcon}
      />
      <ImageButton
        className={layoutStyles.sidebarIcon}
        status={getViewIconStatus(BrowserSidebarModalView.BOOKMARKS)}
        description="Previously viewed"
        onClick={() => toggleModalView(BrowserSidebarModalView.BOOKMARKS)}
        image={BookmarkIcon}
      />
      <ImageButton
        className={layoutStyles.sidebarIcon}
        status={Status.DISABLED}
        description="Personal data"
        onClick={() => toggleModalView(BrowserSidebarModalView.PERSONAL_DATA)}
        image={PersonalDataIcon}
      />
      <ImageButton
        className={layoutStyles.sidebarIcon}
        status={Status.DISABLED}
        description="Share"
        onClick={() => toggleModalView(BrowserSidebarModalView.SHARE)}
        image={ShareIcon}
      />
      <ImageButton
        className={layoutStyles.sidebarIcon}
        status={Status.DISABLED}
        description="Downloads"
        onClick={() => toggleModalView(BrowserSidebarModalView.DOWNLOADS)}
        image={DownloadIcon}
      />
    </>
  );
};

export default BrowserSidebarToolstrip;
