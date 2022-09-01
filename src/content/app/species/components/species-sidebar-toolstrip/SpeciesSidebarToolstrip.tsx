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
import { useParams } from 'react-router-dom';
import noop from 'lodash/noop';

import { useAppSelector, useAppDispatch } from 'src/store';
import useSpeciesAnalytics from '../../hooks/useSpeciesAnalytics';

import {
  toggleSidebar,
  closeSpeciesSidebarModal,
  openSpeciesSidebarModal
} from 'src/content/app/species/state/sidebar/speciesSidebarSlice';
import { SpeciesSidebarModalView } from '../../state/sidebar/speciesSidebarSlice';
import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';
import {
  getSpeciesSidebarModalView,
  isSpeciesSidebarOpen
} from '../../state/sidebar/speciesSidebarSelectors';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import SearchIcon from 'static/icons/icon_search.svg';
import BookmarkIcon from 'static/icons/icon_bookmark.svg';
import ShareIcon from 'static/icons/icon_share.svg';
import DownloadIcon from 'static/icons/icon_download.svg';

import { Status } from 'src/shared/types/status';

import styles from 'src/shared/components/layout/StandardAppLayout.scss';

export const SpeciesSidebarToolstrip = () => {
  const dispatch = useAppDispatch();
  const sidebarModalView = useAppSelector(getSpeciesSidebarModalView);
  const isSidebarOpen = useAppSelector(isSpeciesSidebarOpen);
  const activeGenomeId = useAppSelector(getActiveGenomeId);
  const params = useParams<'genomeId'>();
  const { trackSidebarToolstripButtonClick } = useSpeciesAnalytics();

  if (!activeGenomeId) {
    return null;
  }

  const toggleModalView = (selectedItem: SpeciesSidebarModalView) => {
    if (!isSidebarOpen) {
      dispatch(toggleSidebar({ genomeId: activeGenomeId }));
    }

    if (selectedItem === sidebarModalView) {
      dispatch(closeSpeciesSidebarModal());
    } else {
      trackSidebarToolstripButtonClick(selectedItem, params.genomeId as string);
      dispatch(openSpeciesSidebarModal(selectedItem));
    }
  };

  const getViewIconStatus = (selectedItem: SpeciesSidebarModalView) => {
    return selectedItem === sidebarModalView && isSidebarOpen
      ? Status.SELECTED
      : Status.UNSELECTED;
  };

  return (
    <>
      <ImageButton
        status={getViewIconStatus(SpeciesSidebarModalView.SEARCH)}
        description="Search"
        className={styles.sidebarIcon}
        onClick={() => toggleModalView(SpeciesSidebarModalView.SEARCH)}
        image={SearchIcon}
      />
      <ImageButton
        status={Status.DISABLED}
        description="Previously viewed"
        className={styles.sidebarIcon}
        key={SpeciesSidebarModalView.BOOKMARKS}
        onClick={noop}
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
        status={Status.DISABLED}
        description="Download"
        className={styles.sidebarIcon}
        onClick={noop}
        image={DownloadIcon}
      />
    </>
  );
};

export default SpeciesSidebarToolstrip;
