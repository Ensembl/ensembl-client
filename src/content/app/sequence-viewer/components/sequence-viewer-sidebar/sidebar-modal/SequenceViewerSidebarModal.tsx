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

import { useCallback, lazy, Suspense } from 'react';

import { useAppSelector, useAppDispatch } from 'src/store';

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import { getSidebarModalView } from 'src/content/app/sequence-viewer/state/sidebar/sequenceViewerSidebarSelectors';
import {
  closeSidebarModal,
  type SidebarModalView
} from 'src/content/app/sequence-viewer/state/sidebar/sequenceViewerSidebarSlice';

import SidebarModal from 'src/shared/components/layout/sidebar-modal/SidebarModal';

const sequenceViewerSidebarModals: Record<
  SidebarModalView,
  ReturnType<typeof lazy>
> = {
  search: lazy(() => import('./modal-views/SequenceViewerSearch')),
  download: lazy(() => import('./modal-views/SequenceViewerDownload'))
};

const sidebarModalTitles: Record<SidebarModalView, string> = {
  search: 'Search this genome',
  download: 'Download'
};

export const SequenceViewerSidebarModal = () => {
  const { genomeId } = useSequenceViewerIds();
  const dispatch = useAppDispatch();

  const modalView = useAppSelector((state) =>
    getSidebarModalView(state, genomeId ?? '')
  );

  const closeModal = useCallback(() => {
    if (!genomeId) {
      // this shouldn't be possible
      return;
    }
    dispatch(closeSidebarModal({ genomeId }));
  }, [dispatch, genomeId]);

  if (!modalView) {
    return null;
  }

  const ModalView = sequenceViewerSidebarModals[modalView];
  const modalViewTitle = sidebarModalTitles[modalView];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SidebarModal title={modalViewTitle} onClose={closeModal}>
        {<ModalView />}
      </SidebarModal>
    </Suspense>
  );
};

export default SequenceViewerSidebarModal;
