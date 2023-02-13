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

import React, { lazy, Suspense, type LazyExoticComponent } from 'react';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getBrowserSidebarModalView } from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSelectors';
import {
  BrowserSidebarModalView,
  closeBrowserSidebarModal
} from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';
import { closeDrawer } from 'src/content/app/genome-browser/state/drawer/drawerSlice';

import SidebarModal from 'src/shared/components/layout/sidebar-modal/SidebarModal';

const browserSidebarModals: Record<
  string,
  LazyExoticComponent<() => JSX.Element | null>
> = {
  [BrowserSidebarModalView.SEARCH]: lazy(
    () => import('./modal-views/SearchModal')
  ),
  [BrowserSidebarModalView.BOOKMARKS]: lazy(
    () => import('./modal-views/BookmarksModal')
  ),
  [BrowserSidebarModalView.SHARE]: lazy(
    () => import('./modal-views/ShareModal')
  ),
  [BrowserSidebarModalView.DOWNLOADS]: lazy(
    () => import('./modal-views/DownloadsModal')
  ),
  [BrowserSidebarModalView.NAVIGATE]: lazy(
    () => import('./modal-views/NavigateModal')
  )
  // [BrowserSidebarModalView.NAVIGATE_LOCATION]: lazy(
  //   () => import('./modal-views/navigate-modal/NavigateLocationModal')
  // )
};

export const browserSidebarModalTitles: { [key: string]: string } = {
  [BrowserSidebarModalView.SEARCH]: 'Search',
  [BrowserSidebarModalView.BOOKMARKS]: 'Previously viewed',
  [BrowserSidebarModalView.SHARE]: 'Share',
  [BrowserSidebarModalView.DOWNLOADS]: 'Downloads',
  [BrowserSidebarModalView.NAVIGATE]: 'Change location'
  // [BrowserSidebarModalView.NAVIGATE_LOCATION]: 'Change location'
};

export const BrowserSidebarModal = () => {
  const browserSidebarModalView = useAppSelector(
    getBrowserSidebarModalView
  ) as string;
  const dispatch = useAppDispatch();

  if (!browserSidebarModalView) {
    return null;
  }

  const ModalView = browserSidebarModals[browserSidebarModalView];
  const modalViewTitle = browserSidebarModalTitles[browserSidebarModalView];

  const onClose = () => {
    dispatch(closeDrawer());
    dispatch(closeBrowserSidebarModal());
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SidebarModal title={modalViewTitle} onClose={onClose}>
        {<ModalView />}
      </SidebarModal>
    </Suspense>
  );
};

export default BrowserSidebarModal;
