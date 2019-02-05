import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';

import TrackPanelBar from './track-panel-bar/TrackPanelBar';
import TrackPanelList from './track-panel-list/TrackPanelList';

import { RootState } from 'src/rootReducer';

import {
  toggleTrackPanel,
  changeCurrentTrack,
  openDrawer,
  closeDrawer
} from '../browserActions';

import {
  getCurrentTrack,
  getDrawerOpened,
  getTrackPanelOpened
} from '../browserSelectors';

import { getLaunchbarExpanded } from 'src/header/headerSelectors';

import styles from './TrackPanel.scss';

type TrackPanelProps = {
  changeCurrentTrack: (currentTrack: string) => void;
  closeDrawer: () => void;
  currentTrack: string;
  drawerOpened: boolean;
  launchbarExpanded: boolean;
  openDrawer: () => void;
  toggleTrackPanel: () => void;
  trackPanelOpened: boolean;
};

const TrackPanel: FunctionComponent<TrackPanelProps> = (
  props: TrackPanelProps
) => {
  return (
    <section className={`${styles.trackPanel} reactSlideDrawer`}>
      <TrackPanelBar
        closeDrawer={props.closeDrawer}
        drawerOpened={props.drawerOpened}
        launchbarExpanded={props.launchbarExpanded}
        trackPanelOpened={props.trackPanelOpened}
        toggleTrackPanel={props.toggleTrackPanel}
      />
      {props.trackPanelOpened ? (
        <TrackPanelList
          currentTrack={props.currentTrack}
          openDrawer={props.openDrawer}
          updateTrack={props.changeCurrentTrack}
        />
      ) : null}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentTrack: getCurrentTrack(state),
  drawerOpened: getDrawerOpened(state),
  launchbarExpanded: getLaunchbarExpanded(state),
  trackPanelOpened: getTrackPanelOpened(state)
});

const mapDispatchToProps = {
  changeCurrentTrack,
  closeDrawer,
  openDrawer,
  toggleTrackPanel
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanel);
