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
import { connect } from 'react-redux';

import TrackPanelSearch from './modal-views/TrackPanelSearch';
import TracksManager from './modal-views/TracksManager';
import TrackPanelBookmarks from './modal-views/TrackPanelBookmarks';
import PersonalData from './modal-views/PersonalData';
import TrackPanelShare from './modal-views/TrackPanelShare';
import TrackPanelDownloads from './modal-views/TrackPanelDownloads';

import { getTrackPanelModalView } from '../trackPanelSelectors';
import { closeTrackPanelModal } from '../trackPanelActions';
import { RootState } from 'src/store';

import closeIcon from 'static/img/shared/close.svg';

import styles from './TrackPanelModal.scss';
import { closeDrawer } from '../../drawer/drawerActions';

export type TrackPanelModalProps = {
  trackPanelModalView: string;
  closeTrackPanelModal: () => void;
  closeDrawer: () => void;
};

export const TrackPanelModal = (props: TrackPanelModalProps) => {
  const getModalView = () => {
    switch (props.trackPanelModalView) {
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

  const onClickHandler = () => {
    props.closeDrawer();
    props.closeTrackPanelModal();
  };
  return (
    <section className={styles.trackPanelModal}>
      <button onClick={onClickHandler} className={styles.closeButton}>
        <img src={closeIcon} alt="Close track panel modal" />
      </button>
      <div className={styles.trackPanelModalView}>{getModalView()}</div>
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  trackPanelModalView: getTrackPanelModalView(state)
});

const mapDispatchToProps = {
  closeTrackPanelModal,
  closeDrawer
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackPanelModal);
