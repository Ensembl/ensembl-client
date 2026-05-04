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

import { useAppDispatch } from 'src/store';

import {
  closeSidebarModal,
  type SidebarModalView
} from 'src/content/app/entity-viewer/state/transcript-view/sidebar/transcriptViewSidebarSlice';

import SidebarModal from 'src/shared/components/layout/sidebar-modal/SidebarModal';
import EntityViewerSearch from 'src/content/app/entity-viewer/shared/components/entity-viewer-sidebar/entity-viewer-sidebar-modal/modal-views/EntityViewerSearch';
import EntityViewerBookmarks from 'src/content/app/entity-viewer/shared/components/entity-viewer-sidebar/entity-viewer-sidebar-modal/modal-views/EntityViewerBookmarks';

type Props = {
  genomeId: string;
  transcriptId: string;
  view: SidebarModalView;
};

const entityViewerSidebarModalTitles = {
  search: 'Search this species',
  bookmarks: 'Previously viewed',
  download: 'Download'
} as const;

export const EntityViewerSidebarModal = (props: Props) => {
  const { genomeId, transcriptId, view } = props;
  const dispatch = useAppDispatch();

  const onCloseModal = () => {
    dispatch(
      closeSidebarModal({
        genomeId,
        transcriptId
      })
    );
  };

  const modalViewTitle = entityViewerSidebarModalTitles[view];

  return (
    <SidebarModal title={modalViewTitle} onClose={onCloseModal}>
      {view === 'search' && <EntityViewerSearch />}
      {view === 'bookmarks' && <EntityViewerBookmarks />}
      {view === 'download' && <div>Download</div>}
    </SidebarModal>
  );
};

export default EntityViewerSidebarModal;
