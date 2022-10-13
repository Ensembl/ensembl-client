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
import noop from 'lodash/noop';

import { useAppSelector, useAppDispatch } from 'src/store';
import useEntityViewerAnalytics from 'src/content/app/entity-viewer/hooks/useEntityViewerAnalytics';

import {
  isEntityViewerSidebarOpen,
  getEntityViewerSidebarModalView
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';
import {
  toggleSidebar,
  closeSidebarModal,
  openSidebarModal
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';
import { SidebarModalView } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import SearchIcon from 'static/icons/icon_search.svg';
import BookmarkIcon from 'static/icons/icon_bookmark.svg';
import ShareIcon from 'static/icons/icon_share.svg';
import DownloadIcon from 'static/icons/icon_download.svg';

import { Status } from 'src/shared/types/status';

import styles from 'src/shared/components/layout/StandardAppLayout.scss';

export const EntityViewerSidebarToolstrip = () => {
  const dispatch = useAppDispatch();
  const sidebarModalView = useAppSelector(getEntityViewerSidebarModalView);
  const isSidebarOpen = useAppSelector(isEntityViewerSidebarOpen);

  const { trackSidebarModelOpen } = useEntityViewerAnalytics();

  const toggleModalView = (selectedItem: SidebarModalView) => {
    if (!isSidebarOpen) {
      dispatch(toggleSidebar());
    }

    if (selectedItem === sidebarModalView) {
      dispatch(closeSidebarModal());
    } else {
      trackSidebarModelOpen(selectedItem);
      dispatch(openSidebarModal(selectedItem));
    }
  };

  const getViewIconStatus = (selectedItem: SidebarModalView) => {
    return selectedItem === sidebarModalView && isSidebarOpen
      ? Status.SELECTED
      : Status.UNSELECTED;
  };

  return (
    <>
      <ImageButton
        status={getViewIconStatus(SidebarModalView.SEARCH)}
        description="Search"
        className={styles.sidebarIcon}
        onClick={() => toggleModalView(SidebarModalView.SEARCH)}
        image={SearchIcon}
      />
      <ImageButton
        status={getViewIconStatus(SidebarModalView.BOOKMARKS)}
        description="Previously viewed"
        className={styles.sidebarIcon}
        key={SidebarModalView.BOOKMARKS}
        onClick={() => toggleModalView(SidebarModalView.BOOKMARKS)}
        image={BookmarkIcon}
      />
      <ImageButton
        status={Status.DISABLED}
        description="Share"
        className={styles.sidebarIcon}
        key="share"
        onClick={noop}
        image={ShareIcon}
      />
      <ImageButton
        status={getViewIconStatus(SidebarModalView.DOWNLOADS)}
        description="Download"
        className={styles.sidebarIcon}
        onClick={() => toggleModalView(SidebarModalView.DOWNLOADS)}
        image={DownloadIcon}
      />
    </>
  );
};

export default EntityViewerSidebarToolstrip;
