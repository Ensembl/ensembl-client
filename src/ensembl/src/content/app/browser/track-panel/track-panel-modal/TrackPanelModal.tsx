import React, { FunctionComponent } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import TrackPanelSearch from './modal-views/TrackPanelSearch';
import TracksManager from './modal-views/TracksManager';
import TrackPanelBookmarks from './modal-views/TrackPanelBookmarks';
import PersonalData from './modal-views/PersonalData';
import TrackPanelShare from './modal-views/TrackPanelShare';
import TrackPanelDownloads from './modal-views/TrackPanelDownloads';

import { getLaunchbarExpanded } from 'src/header/headerSelectors';
import { getTrackPanelModalView } from '../trackPanelSelectors';
import { closeTrackPanelModal } from '../trackPanelActions';
import { RootState } from 'src/store';

import closeIcon from 'static/img/track-panel/close.svg';

import styles from './TrackPanelModal.scss';

const TrackPanelModal: FunctionComponent = () => {
  const { launchbarExpanded, trackPanelModalView } = useSelector(
    (state: RootState) => ({
      launchbarExpanded: getLaunchbarExpanded(state),
      trackPanelModalView: getTrackPanelModalView(state)
    })
  );

  const dispatch = useDispatch();

  const getTrackPanelModalClasses = () => {
    const heightClass: string = launchbarExpanded
      ? styles.shorter
      : styles.taller;

    return `${styles.trackPanelModal} ${heightClass}`;
  };

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

  return (
    <section className={getTrackPanelModalClasses()}>
      <button
        onClick={() => dispatch(closeTrackPanelModal())}
        className={styles.closeButton}
      >
        <img src={closeIcon} alt="Close track panel modal" />
      </button>
      <div className={styles.trackPanelModalView}>{getModalView()}</div>
    </section>
  );
};

export default TrackPanelModal;
