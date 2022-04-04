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

import { getTrackPanelModalView } from 'src/content/app/genome-browser/state/track-panel/trackPanelSelectors';
import { closeTrackPanelModal } from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';
import { closeDrawer } from 'src/content/app/genome-browser/state/drawer/drawerSlice';

import SidebarModal from 'src/shared/components/layout/sidebar-modal/SidebarModal';

import { TrackPanelModalView } from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';

const trackPanelSidebarModals: Record<
  string,
  LazyExoticComponent<() => JSX.Element | null>
> = {
  [TrackPanelModalView.SEARCH]: lazy(
    () => import('./modal-views/TrackPanelSearch')
  ),
  [TrackPanelModalView.TRACKS_MANAGER]: lazy(
    () => import('./modal-views/TracksManager')
  ),
  [TrackPanelModalView.BOOKMARKS]: lazy(
    () => import('./modal-views/TrackPanelBookmarks')
  ),
  [TrackPanelModalView.PERSONAL_DATA]: lazy(
    () => import('./modal-views/PersonalData')
  ),
  [TrackPanelModalView.SHARE]: lazy(
    () => import('./modal-views/TrackPanelShare')
  ),
  [TrackPanelModalView.DOWNLOADS]: lazy(
    () => import('./modal-views/TrackPanelDownloads')
  )
};

const trackPanelModalTitles: { [key: string]: string } = {
  [TrackPanelModalView.SEARCH]: 'Search',
  [TrackPanelModalView.TRACKS_MANAGER]: 'Tracks manager',
  [TrackPanelModalView.BOOKMARKS]: 'Previously viewed',
  [TrackPanelModalView.PERSONAL_DATA]: 'Personal data',
  [TrackPanelModalView.SHARE]: 'Share',
  [TrackPanelModalView.DOWNLOADS]: 'Downloads'
};

export const TrackPanelModal = () => {
  const trackPanelModalView = useSelector(getTrackPanelModalView);
  const dispatch = useDispatch();

  if (!trackPanelModalView) {
    return null;
  }

  const ModalView = trackPanelSidebarModals[trackPanelModalView];
  const modalViewTitle = trackPanelModalTitles[trackPanelModalView];

  const onClose = () => {
    dispatch(closeDrawer());
    dispatch(closeTrackPanelModal());
  };

  return (
    <section>
      <Suspense fallback={<div>Loading...</div>}>
        <SidebarModal title={modalViewTitle} onClose={onClose}>
          {<ModalView />}
        </SidebarModal>
      </Suspense>
    </section>
  );
};

export default TrackPanelModal;
