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

import React, { lazy, Suspense, LazyExoticComponent } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getEntityViewerSidebarModalView } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';
import { closeSidebarModal } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';

import { SidebarModalView } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';

import SidebarModal from 'ensemblRoot/src/shared/components/layout/components/sidebar-modal/SidebarModal';

import styles from './EntityViewerSidebarModal.scss';

const entityViewerSidebarModals: Record<
  SidebarModalView,
  LazyExoticComponent<() => JSX.Element | null>
> = {
  [SidebarModalView.SEARCH]: lazy(
    () => import('./modal-views/EntityViewerSearch')
  ),
  [SidebarModalView.BOOKMARKS]: lazy(
    () => import('./modal-views/EntityViewerBookmarks')
  ),
  [SidebarModalView.DOWNLOADS]: lazy(
    () => import('./modal-views/EntityViewerDownloads')
  )
};

const entityViewerSidebarModalTitles = {
  [SidebarModalView.SEARCH]: 'Search',
  [SidebarModalView.BOOKMARKS]: 'Previously viewed',
  [SidebarModalView.DOWNLOADS]: 'Downloads'
};

export const EntityViewerSidebarModal = () => {
  const dispatch = useDispatch();

  const entityViewerSidebarModalView = useSelector(
    getEntityViewerSidebarModalView
  );

  if (!entityViewerSidebarModalView) {
    return null;
  }

  const ModalView = entityViewerSidebarModals[entityViewerSidebarModalView];
  const modalViewTitle =
    entityViewerSidebarModalTitles[entityViewerSidebarModalView];

  return (
    <section className={styles.entityViewerSidebarModal}>
      <Suspense fallback={<div>Loading...</div>}>
        <SidebarModal
          title={modalViewTitle}
          onClose={() => dispatch(closeSidebarModal())}
        >
          {<ModalView />}
        </SidebarModal>
      </Suspense>
    </section>
  );
};

export default EntityViewerSidebarModal;
