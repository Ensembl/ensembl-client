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
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import noop from 'lodash/noop';

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

import { ReactComponent as searchIcon } from 'static/img/sidebar/search.svg';
import { ReactComponent as bookmarkIcon } from 'static/img/sidebar/bookmark.svg';
import { ReactComponent as shareIcon } from 'static/img/sidebar/share.svg';
import { ReactComponent as downloadIcon } from 'static/img/sidebar/download.svg';

import { Status } from 'src/shared/types/status';
import styles from 'src/shared/components/layout/StandardAppLayout.scss';

export const EntityViewerSidebarToolstrip = () => {
  const dispatch = useDispatch();
  const sidebarModalView = useSelector(getEntityViewerSidebarModalView);
  const isSidebarOpen = useSelector(isEntityViewerSidebarOpen);

  const params = useParams<'genomeId' | 'entityId'>();

  const { trackSidebarToolstripButtonClick } = useEntityViewerAnalytics();

  const toggleModalView = (selectedItem: SidebarModalView) => {
    if (!isSidebarOpen) {
      dispatch(toggleSidebar());
    }

    if (selectedItem === sidebarModalView) {
      dispatch(closeSidebarModal());
    } else {
      trackSidebarToolstripButtonClick(selectedItem, params.genomeId as string);
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
        image={searchIcon}
      />
      <ImageButton
        status={getViewIconStatus(SidebarModalView.BOOKMARKS)}
        description="Previously viewed"
        className={styles.sidebarIcon}
        key={SidebarModalView.BOOKMARKS}
        onClick={() => toggleModalView(SidebarModalView.BOOKMARKS)}
        image={bookmarkIcon}
      />
      <ImageButton
        status={Status.DISABLED}
        description="Share"
        className={styles.sidebarIcon}
        key="share"
        onClick={noop}
        image={shareIcon}
      />
      <ImageButton
        status={getViewIconStatus(SidebarModalView.DOWNLOADS)}
        description="Download"
        className={styles.sidebarIcon}
        onClick={() => toggleModalView(SidebarModalView.DOWNLOADS)}
        image={downloadIcon}
      />
    </>
  );
};

export default EntityViewerSidebarToolstrip;
