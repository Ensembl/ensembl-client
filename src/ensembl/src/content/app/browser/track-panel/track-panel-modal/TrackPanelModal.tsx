import React, { FunctionComponent } from 'react';

import closeIcon from 'static/img/track-panel/close.svg';

import TrackPanelSearch from './modal-views/TrackPanelSearch';
import TracksManager from './modal-views/TracksManager';
import TrackPanelBookmarks from './modal-views/TrackPanelBookmarks';
import PersonalData from './modal-views/PersonalData';
import TrackPanelShare from './modal-views/TrackPanelShare';
import TrackPanelDownloads from './modal-views/TrackPanelDownloads';

import styles from './TrackPanelModal.scss';

type TrackPanelModalProps = {
  closeTrackPanelModal: () => void;
  exampleObjects: any;
  launchbarExpanded: boolean;
  trackPanelModalView: string;
};

const TrackPanelModal: FunctionComponent<TrackPanelModalProps> = (
  props: TrackPanelModalProps
) => {
  const getTrackPanelModalClasses = () => {
    const heightClass: string = props.launchbarExpanded
      ? styles.shorter
      : styles.taller;

    return `${styles.trackPanelModal} ${heightClass}`;
  };

  const getModalView = () => {
    switch (props.trackPanelModalView) {
      case 'search':
        return <TrackPanelSearch />;
      case 'tracks-manager':
        return <TracksManager />;
      case 'bookmarks':
        return <TrackPanelBookmarks exampleObjects={props.exampleObjects} />;
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
        onClick={props.closeTrackPanelModal}
        className={styles.closeButton}
      >
        <img src={closeIcon} alt="Close track panel modal" />
      </button>
      <div className={styles.trackPanelModalView}>{getModalView()}</div>
    </section>
  );
};

export default TrackPanelModal;
