import React from 'react';
import { connect } from 'react-redux';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import { Status } from 'src/shared/types/status';
import { trackPanelBarConfig, TrackPanelBarItem } from './trackPanelBarConfig';
import {
  getIsTrackPanelModalOpened,
  getIsTrackPanelOpened,
  getTrackPanelModalView
} from '../trackPanelSelectors';
import { RootState } from 'src/store';
import {
  toggleTrackPanel,
  closeTrackPanelModal,
  openTrackPanelModal
} from '../trackPanelActions';

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
  const toggleModalView = (iconConfig: TrackPanelBarItem) => {
    if (!props.isTrackPanelOpened) {
      props.toggleTrackPanel(true);
    }

    if (iconConfig.name === props.trackPanelModalView) {
      props.closeTrackPanelModal();
    } else {
      props.openTrackPanelModal(iconConfig.name);
    }
  };

  const getViewIconStatus = (iconConfig: TrackPanelBarItem) => {
    return iconConfig.name === props.trackPanelModalView &&
      props.isTrackPanelOpened
      ? Status.HIGHLIGHTED
      : Status.ACTIVE;
  };

  return (
    <>
      {trackPanelBarConfig.map((item: TrackPanelBarItem) => (
        <div className={styles.sidebarIcon} key={item.name}>
          <ImageButton
            buttonStatus={getViewIconStatus(item)}
            description={item.description}
            onClick={() => toggleModalView(item)}
            image={item.icon}
          />
        </div>
      ))}
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
