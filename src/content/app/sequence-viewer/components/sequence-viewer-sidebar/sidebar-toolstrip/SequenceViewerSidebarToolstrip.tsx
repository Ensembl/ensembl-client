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

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import {
  getIsSidebarOpen,
  getSidebarModalView
} from 'src/content/app/sequence-viewer/state/sidebar/sequenceViewerSidebarSelectors';

import {
  openSidebar,
  openSidebarModal,
  closeSidebarModal,
  type SidebarModalView
} from 'src/content/app/sequence-viewer/state/sidebar/sequenceViewerSidebarSlice';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import SearchIcon from 'static/icons/icon_search.svg';
import DownloadIcon from 'static/icons/icon_download.svg';

import { Status } from 'src/shared/types/status';

import styles from 'src/shared/components/layout/StandardAppLayout.module.css';

export const SequenceViewerSidebarToolstrip = () => {
  const { genomeId } = useSequenceViewerIds();
  const sidebarModalView = useAppSelector((state) =>
    getSidebarModalView(state, genomeId ?? '')
  );
  const isSidebarOpen = useAppSelector(getIsSidebarOpen);
  const dispatch = useAppDispatch();

  const toggleModalView = (selectedItem: SidebarModalView) => {
    if (!genomeId) {
      // this should not be possible
      return;
    }
    if (!isSidebarOpen) {
      dispatch(openSidebar());
    }

    if (selectedItem === sidebarModalView) {
      dispatch(closeSidebarModal({ genomeId: genomeId }));
    } else {
      dispatch(openSidebarModal({ genomeId, modalView: selectedItem }));
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
        status={getViewIconStatus('download')}
        description="Download"
        className={styles.sidebarIcon}
        onClick={() => toggleModalView('download')}
        image={DownloadIcon}
      />
    </>
  );
};

export default SequenceViewerSidebarToolstrip;
