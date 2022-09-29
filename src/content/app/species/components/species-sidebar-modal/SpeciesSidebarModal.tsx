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

import { useAppSelector, useAppDispatch } from 'src/store';

import { getSpeciesSidebarModalView } from '../../state/sidebar/speciesSidebarSelectors';

import { getActiveGenomeId } from 'src/content/app/species/state/general/speciesGeneralSelectors';
import {
  SpeciesSidebarModalView,
  updateSpeciesSidebarModalForGenome
} from '../../state/sidebar/speciesSidebarSlice';

import SidebarModal from 'src/shared/components/layout/sidebar-modal/SidebarModal';

const speciesSidebarModals: Record<
  string,
  LazyExoticComponent<() => JSX.Element | null>
> = {
  [SpeciesSidebarModalView.SEARCH]: lazy(
    () => import('./modal-views/SpeciesSidebarSearch')
  )
};

export const speciesSidebarModalTitles: { [key: string]: string } = {
  [SpeciesSidebarModalView.SEARCH]: 'Search',
  [SpeciesSidebarModalView.BOOKMARKS]: 'Previously viewed',
  [SpeciesSidebarModalView.SHARE]: 'Share',
  [SpeciesSidebarModalView.DOWNLOADS]: 'Downloads'
};

export const SpeciesSidebarModal = () => {
  const speciesSidebarModalView = useAppSelector(getSpeciesSidebarModalView);
  const activeGenomeId = useAppSelector(getActiveGenomeId);
  const dispatch = useAppDispatch();

  if (!speciesSidebarModalView || !activeGenomeId) {
    return null;
  }

  const ModalView = speciesSidebarModals[speciesSidebarModalView];
  const modalViewTitle = speciesSidebarModalTitles[speciesSidebarModalView];

  const onClose = () => {
    dispatch(
      updateSpeciesSidebarModalForGenome({
        activeGenomeId,
        fragment: { sidebarModalView: null }
      })
    );
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
