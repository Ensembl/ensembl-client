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
import { useSelector, useDispatch } from 'react-redux';

import { getTrackPanelModalView } from 'src/content/app/genome-browser/state/track-panel/trackPanelSelectors';
import { closeTrackPanelModal } from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';
import { closeDrawer } from 'src/content/app/genome-browser/state/drawer/drawerSlice';

import TrackPanelSearch from './modal-views/TrackPanelSearch';
import TracksManager from './modal-views/TracksManager';
import TrackPanelBookmarks from './modal-views/TrackPanelBookmarks';
import PersonalData from './modal-views/PersonalData';
import TrackPanelShare from './modal-views/TrackPanelShare';
import TrackPanelDownloads from './modal-views/TrackPanelDownloads';

import SidebarModal from 'src/shared/components/layout/sidebar-modal/SidebarModal';

import styles from './TrackPanelModal.scss';

export const TrackPanelModal = () => {
  const trackPanelModalView = useSelector(getTrackPanelModalView);
  const dispatch = useDispatch();

  const getModalViewData = () => {
    switch (trackPanelModalView) {
      case 'search':
        return { content: <TrackPanelSearch />, title: 'Search' };
      case 'tracks-manager':
        return { content: <TracksManager />, title: 'Tracks manager' };
      case 'bookmarks':
        return { content: <TrackPanelBookmarks />, title: 'Previously viewed' };
      case 'personal-data':
        return { content: <PersonalData />, title: 'Personal data' };
      case 'share':
        return { content: <TrackPanelShare />, title: 'Share' };
      case 'downloads':
        return { content: <TrackPanelDownloads />, title: 'Downloads' };
      default:
        return {
          content: null,
          title: ''
        };
    }
  };

  const onClose = () => {
    dispatch(closeDrawer());
    dispatch(closeTrackPanelModal());
  };

  const { title, content } = getModalViewData();
  return (
    <section className={styles.trackPanelModal}>
      <SidebarModal title={title} onClose={onClose}>
        {content}
      </SidebarModal>
    </section>
  );
};

export default TrackPanelModal;
