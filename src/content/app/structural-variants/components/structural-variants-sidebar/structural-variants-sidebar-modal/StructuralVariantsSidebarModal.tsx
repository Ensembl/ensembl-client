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

import { lazy, Suspense } from 'react';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getSidebarModalView } from 'src/content/app/structural-variants/state/sidebar/sidebarSelectors';

import {
  closeSidebarModal,
  type SidebarModalView
} from 'src/content/app/structural-variants/state/sidebar/sidebarSlice';

import SidebarModal from 'src/shared/components/layout/sidebar-modal/SidebarModal';

const sidebarModals: Record<SidebarModalView, ReturnType<typeof lazy>> = {
  search: lazy(() => import('./feature-search-modal/FeatureSearchModal'))
};

export const sidebarModalTitles: { [key: string]: string } = {
  search: 'Search'
};

export const SpeciesSidebarModal = () => {
  const sidebarModalView = useAppSelector(getSidebarModalView);
  const dispatch = useAppDispatch();

  if (!sidebarModalView) {
    return null;
  }

  const ModalView = sidebarModals[sidebarModalView];
  const modalViewTitle = sidebarModalTitles[sidebarModalView];

  const onClose = () => {
    dispatch(closeSidebarModal());
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SidebarModal title={modalViewTitle} onClose={onClose}>
        {<ModalView />}
      </SidebarModal>
    </Suspense>
  );
};

export default SpeciesSidebarModal;
