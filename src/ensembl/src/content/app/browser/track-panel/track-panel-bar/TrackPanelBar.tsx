import React from 'react';
import { connect } from 'react-redux';

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

import TrackPanelBarIcon from './TrackPanelBarIcon';

export type TrackPanelBarProps = {
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  trackPanelModalView: string;
  closeTrackPanelModal: () => void;
  openTrackPanelModal: (trackPanelModalView: string) => void;
  toggleTrackPanel: (isTrackPanelOpened?: boolean) => void;
};

export const TrackPanelBar = (props: TrackPanelBarProps) => {
  return (
    <div>
      {trackPanelBarConfig.map((item: TrackPanelBarItem) => (
        <TrackPanelBarIcon
          key={item.name}
          iconConfig={item}
          closeTrackPanelModal={props.closeTrackPanelModal}
          openTrackPanelModal={props.openTrackPanelModal}
          isTrackPanelModalOpened={props.isTrackPanelModalOpened}
          isTrackPanelOpened={props.isTrackPanelOpened}
          trackPanelModalView={props.trackPanelModalView}
          toggleTrackPanel={props.toggleTrackPanel}
        />
      ))}
    </div>
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
