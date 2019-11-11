import React from 'react';
import { connect } from 'react-redux';

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

import closeIcon from 'static/img/shared/close.svg';

import styles from './TrackPanelModal.scss';
import { closeDrawer } from '../../drawer/drawerActions';

export type TrackPanelModalProps = {
  launchbarExpanded: boolean;
  trackPanelModalView: string;
  closeTrackPanelModal: () => void;
  closeDrawer: () => void;
};

export const TrackPanelModal = (props: TrackPanelModalProps) => {
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
    <section className={getTrackPanelModalClasses()}>
      <button onClick={onClickHandler} className={styles.closeButton}>
        <img src={closeIcon} alt="Close track panel modal" />
      </button>
      <div className={styles.trackPanelModalView}>{getModalView()}</div>
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  launchbarExpanded: getLaunchbarExpanded(state),
  trackPanelModalView: getTrackPanelModalView(state)
});

const mapDispatchToProps = {
  closeTrackPanelModal,
  closeDrawer
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanelModal);
