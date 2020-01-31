import React from 'react';
import { connect } from 'react-redux';

import {
  getIsTrackPanelModalOpened,
  getIsTrackPanelOpened,
  getTrackPanelModalView
} from '../trackPanelSelectors';
import {
  toggleTrackPanel,
  closeTrackPanelModal,
  openTrackPanelModal
} from '../trackPanelActions';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as searchIcon } from 'static/img/sidebar/search.svg';
import { ReactComponent as tracksManagerIcon } from 'static/img/sidebar/tracks-manager.svg';
import { ReactComponent as bookmarkIcon } from 'static/img/sidebar/bookmark.svg';
import { ReactComponent as personalDataIcon } from 'static/img/sidebar/own-data.svg';
import { ReactComponent as shareIcon } from 'static/img/sidebar/share.svg';
import { ReactComponent as downloadIcon } from 'static/img/sidebar/download.svg';

import { RootState } from 'src/store';
import { Status } from 'src/shared/types/status';

import styles from 'src/shared/components/layout/StandardAppLayout.scss';

export type TrackPanelBarProps = {
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  trackPanelModalView: string;
  closeTrackPanelModal: () => void;
  openTrackPanelModal: (trackPanelModalView: string) => void;
  toggleTrackPanel: (isTrackPanelOpened?: boolean) => void;
};

export const TrackPanelBar = (props: TrackPanelBarProps) => {
  const toggleModalView = (selectedItem: string) => {
    if (!props.isTrackPanelOpened) {
      props.toggleTrackPanel(true);
    }

    if (selectedItem === props.trackPanelModalView) {
      props.closeTrackPanelModal();
    } else {
      props.openTrackPanelModal(selectedItem);
    }
  };

  const getViewIconStatus = (selectedItem: string) => {
    return selectedItem === props.trackPanelModalView &&
      props.isTrackPanelOpened
      ? Status.SELECTED
      : Status.UNSELECTED;
  };

  return (
    <>
      <div className={styles.sidebarIcon} key="search">
        <ImageButton
          status={getViewIconStatus('search')}
          description="Track search"
          onClick={() => toggleModalView('search')}
          image={searchIcon}
        />
      </div>
      <div className={styles.sidebarIcon} key="tracks-manager">
        <ImageButton
          status={getViewIconStatus('tracks-manager')}
          description="Tracks manager"
          onClick={() => toggleModalView('tracks-manager')}
          image={tracksManagerIcon}
        />
      </div>
      <div className={styles.sidebarIcon} key="bookmarks">
        <ImageButton
          status={getViewIconStatus('bookmarks')}
          description="Bookmarks"
          onClick={() => toggleModalView('bookmarks')}
          image={bookmarkIcon}
        />
      </div>
      <div className={styles.sidebarIcon} key="personal-data">
        <ImageButton
          status={getViewIconStatus('personal-data')}
          description="Personal data"
          onClick={() => toggleModalView('personal-data')}
          image={personalDataIcon}
        />
      </div>
      <div className={styles.sidebarIcon} key="share">
        <ImageButton
          status={getViewIconStatus('share')}
          description="Share"
          onClick={() => toggleModalView('share')}
          image={shareIcon}
        />
      </div>
      <div className={styles.sidebarIcon} key="downloads">
        <ImageButton
          status={getViewIconStatus('downloads')}
          description="Downloads"
          onClick={() => toggleModalView('downloads')}
          image={downloadIcon}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  isTrackPanelModalOpened: getIsTrackPanelModalOpened(state),
  isTrackPanelOpened: getIsTrackPanelOpened(state),
  trackPanelModalView: getTrackPanelModalView(state)
});

const mapDispatchToProps = {
  closeTrackPanelModal,
  openTrackPanelModal,
  toggleTrackPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackPanelBar);
