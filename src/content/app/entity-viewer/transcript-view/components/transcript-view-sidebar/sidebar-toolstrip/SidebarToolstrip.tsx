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

import { memo } from 'react';

import { useAppSelector, useAppDispatch } from 'src/store';

import useTranscriptViewIds from 'src/content/app/entity-viewer/transcript-view/hooks/useTranscriptViewIds';

import {
  getIsSidebarOpen,
  getSidebarModalView
} from 'src/content/app/entity-viewer/state/transcript-view/sidebar/transcriptViewSidebarSelectors';

import {
  openSidebar,
  openSidebarModal,
  closeSidebarModal,
  type SidebarModalView
} from 'src/content/app/entity-viewer/state/transcript-view/sidebar/transcriptViewSidebarSlice';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import SearchIcon from 'static/icons/icon_search.svg';
import BookmarkIcon from 'static/icons/icon_bookmark.svg';
import ShareIcon from 'static/icons/icon_share.svg';
import DownloadIcon from 'static/icons/icon_download.svg';

import { Status } from 'src/shared/types/status';

import styles from 'src/shared/components/layout/StandardAppLayout.module.css';

export const SidebarToolstrip = () => {
  const { activeGenomeId, transcriptId } = useTranscriptViewIds();
  const sidebarModalView = useAppSelector((state) =>
    getSidebarModalView(state, activeGenomeId ?? '', transcriptId ?? '')
  );
  const isSidebarOpen = useAppSelector((state) =>
    getIsSidebarOpen(state, activeGenomeId ?? '', transcriptId ?? '')
  );
  const dispatch = useAppDispatch();

  const toggleModalView = (view: SidebarModalView) => {
    if (!activeGenomeId || !transcriptId) {
      // this should not happen
      return;
    }
    if (!isSidebarOpen) {
      dispatch(
        openSidebar({
          genomeId: activeGenomeId,
          transcriptId
        })
      );
    }

    if (view === sidebarModalView) {
      dispatch(
        closeSidebarModal({
          genomeId: activeGenomeId,
          transcriptId
        })
      );
    } else {
      dispatch(
        openSidebarModal({
          genomeId: activeGenomeId,
          transcriptId,
          view
        })
      );
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
        status={getViewIconStatus('search')}
        description="Search"
        className={styles.sidebarIcon}
        onClick={() => toggleModalView('search')}
        image={SearchIcon}
      />
      <ImageButton
        status={getViewIconStatus('bookmarks')}
        description="Previously viewed"
        className={styles.sidebarIcon}
        onClick={() => toggleModalView('bookmarks')}
        image={BookmarkIcon}
      />
      <ImageButton
        status={Status.DISABLED}
        description="Share"
        className={styles.sidebarIcon}
        key="share"
        image={ShareIcon}
      />
      <ImageButton
        status={getViewIconStatus('download')}
        description="Download"
        className={styles.sidebarIcon}
        onClick={() => toggleModalView('download')}
        image={DownloadIcon}
      />
    </>
  );
};

export default memo(SidebarToolstrip);
