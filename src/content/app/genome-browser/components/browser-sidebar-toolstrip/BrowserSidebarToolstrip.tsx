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

import { useAppDispatch, useAppSelector } from 'src/store';

import useGenomeBrowserAnalytics from 'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics';

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
import NavigateIcon from 'static/icons/icon_reset.svg';
import BookmarkIcon from 'static/icons/icon_bookmark.svg';
import ShareIcon from 'static/icons/icon_share.svg';
import DownloadIcon from 'static/icons/icon_download.svg';

import { Status } from 'src/shared/types/status';

import layoutStyles from 'src/shared/components/layout/StandardAppLayout.scss';

const BrowserSidebarToolstrip = () => {
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId);
  const isTrackPanelOpened = useAppSelector(getIsTrackPanelOpened);
  const browserSidebarModalView = useAppSelector(getBrowserSidebarModalView);
  const isDrawerOpened = useAppSelector(getIsDrawerOpened);
  const { trackSidebarModalViewToggle } = useGenomeBrowserAnalytics();

  const dispatch = useAppDispatch();

  const toggleModalView = (selectedItem: BrowserSidebarModalView) => {
    if (!isTrackPanelOpened) {
      dispatch(toggleTrackPanel(true));
    }

    if (isDrawerOpened) {
      dispatch(closeDrawer());
    }

    trackSidebarModalViewToggle(selectedItem);

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

  const getViewIconStatus = (view: BrowserSidebarModalView) => {
    return view === browserSidebarModalView && isTrackPanelOpened
      ? Status.SELECTED
      : Status.UNSELECTED;
  };

  const getNavigateIconStatus = () => {
    if (
      isTrackPanelOpened &&
      (browserSidebarModalView === BrowserSidebarModalView.NAVIGATE_REGION ||
        browserSidebarModalView === BrowserSidebarModalView.NAVIGATE_LOCATION)
    ) {
      return Status.SELECTED;
    }

    return Status.UNSELECTED;
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
        status={getViewIconStatus(BrowserSidebarModalView.BOOKMARKS)}
        description="Previously viewed"
        onClick={() => toggleModalView(BrowserSidebarModalView.BOOKMARKS)}
        image={BookmarkIcon}
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
      <ImageButton
        className={classNames(
          layoutStyles.sidebarIcon,
          layoutStyles.navigateIcon
        )}
        status={getNavigateIconStatus()}
        description="Navigate browser image"
        onClick={() => toggleModalView(BrowserSidebarModalView.NAVIGATE_REGION)}
        image={NavigateIcon}
      />
    </>
  );
};

export default BrowserSidebarToolstrip;
