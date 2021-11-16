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

import { getTrackPanelModalView } from '../trackPanelSelectors';
import { closeTrackPanelModal } from '../trackPanelActions';
import { closeDrawer } from 'src/content/app/browser/state/drawer/drawerSlice';

import TrackPanelSearch from './modal-views/TrackPanelSearch';
import TracksManager from './modal-views/TracksManager';
import TrackPanelBookmarks from './modal-views/TrackPanelBookmarks';
import PersonalData from './modal-views/PersonalData';
import TrackPanelShare from './modal-views/TrackPanelShare';
import TrackPanelDownloads from './modal-views/TrackPanelDownloads';
import CloseButton from 'src/shared/components/close-button/CloseButton';

import styles from './TrackPanelModal.scss';

export const TrackPanelModal = () => {
  const trackPanelModalView = useSelector(getTrackPanelModalView);
  const dispatch = useDispatch();

  const getModalView = () => {
    switch (trackPanelModalView) {
      case 'search':
        return <TrackPanelSearch />;
      case 'tracks-manager':
        return <TracksManager />;
      case 'bookmarks':
        return <TrackPanelBookmarks />;
      case 'personal-data':
        return <PersonalData />;
      case 'share':
        return <TrackPanelShare />;
      case 'downloads':
        return <TrackPanelDownloads />;
      default:
        return null;
    }
  };

  const onClose = () => {
    dispatch(closeDrawer());
    dispatch(closeTrackPanelModal());
  };
  return (
    <section className={styles.trackPanelModal}>
      <div className={styles.closeButton}>
        <CloseButton onClick={onClose} />
      </div>
      <div className={styles.trackPanelModalView}>{getModalView()}</div>
    </section>
  );
};

export default TrackPanelModal;
