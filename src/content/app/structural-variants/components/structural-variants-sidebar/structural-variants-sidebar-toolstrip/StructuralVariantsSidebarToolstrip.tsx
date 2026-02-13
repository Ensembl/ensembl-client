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

import { useAppSelector, useAppDispatch } from 'src/store';

import {
  getIsSidebarOpen,
  getSidebarModalView
} from 'src/content/app/structural-variants/state/sidebar/sidebarSelectors';

import {
  openSidebar,
  toggleSidebarModal,
  type SidebarModalView
} from 'src/content/app/structural-variants/state/sidebar/sidebarSlice';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import SearchIcon from 'static/icons/icon_search.svg';
import BookmarkIcon from 'static/icons/icon_bookmark.svg';
import ShareIcon from 'static/icons/icon_share.svg';

import { Status } from 'src/shared/types/status';

import styles from 'src/shared/components/layout/StandardAppLayout.module.css';

export const SpeciesSidebarToolstrip = () => {
  const dispatch = useAppDispatch();
  const sidebarModalView = useAppSelector(getSidebarModalView);
  const isSidebarOpen = useAppSelector(getIsSidebarOpen);

  const toggleModalView = (view: SidebarModalView) => {
    if (!isSidebarOpen) {
      dispatch(openSidebar());
    }

    dispatch(toggleSidebarModal({ view }));
  };

  const getViewIconStatus = (view: SidebarModalView) => {
    return view === sidebarModalView && isSidebarOpen
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
        status={Status.DISABLED}
        description="Previously viewed"
        className={styles.sidebarIcon}
        image={BookmarkIcon}
      />
      <ImageButton
        status={Status.DISABLED}
        description="Share"
        className={styles.sidebarIcon}
        image={ShareIcon}
      />
    </>
  );
};

export default SpeciesSidebarToolstrip;
