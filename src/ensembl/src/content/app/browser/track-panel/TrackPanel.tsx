import React, { FunctionComponent, useEffect } from 'react';
import { connect } from 'react-redux';

import TrackPanelBar from './track-panel-bar/TrackPanelBar';
import TrackPanelList from './track-panel-list/TrackPanelList';

import { RootState } from 'src/rootReducer';

import {
  toggleDrawer,
  toggleTrackPanel,
  changeCurrentTrack
} from '../browserActions';

import {
  getCurrentTrack,
  getDrawerOpened,
  getTrackPanelOpened
} from '../browserSelectors';

import { getLaunchbarExpanded } from 'src/header/headerSelectors';
import { getBreakpointWidth } from 'src/globalSelectors';
import { BreakpointWidth } from 'src/globalConfig';

import styles from './TrackPanel.scss';

type StateProps = {
  currentTrack: string;
  drawerOpened: boolean;
  breakpointWidth: BreakpointWidth;
  launchbarExpanded: boolean;
  trackPanelOpened: boolean;
};

type DispatchProps = {
  changeCurrentTrack: (currentTrack: string) => void;
  toggleDrawer: (drawerOpened: boolean) => void;
  toggleTrackPanel: (trackPanelOpened?: boolean) => void;
};

type OwnProps = {};

type TrackPanelProps = StateProps & DispatchProps & OwnProps;

const TrackPanel: FunctionComponent<TrackPanelProps> = (
  props: TrackPanelProps
) => {
  useEffect(() => {
    if (props.breakpointWidth !== BreakpointWidth.LARGE) {
      props.toggleTrackPanel(false);
    } else {
      props.toggleTrackPanel(true);
    }
  }, [props.breakpointWidth, props.toggleTrackPanel]);

  return (
    <section className={`${styles.trackPanel} reactSlideDrawer`}>
      <TrackPanelBar
        drawerOpened={props.drawerOpened}
        launchbarExpanded={props.launchbarExpanded}
        toggleDrawer={props.toggleDrawer}
        toggleTrackPanel={props.toggleTrackPanel}
        trackPanelOpened={props.trackPanelOpened}
      />
      {props.trackPanelOpened ? (
        <TrackPanelList
          currentTrack={props.currentTrack}
          toggleDrawer={props.toggleDrawer}
          updateTrack={props.changeCurrentTrack}
        />
      ) : null}
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  breakpointWidth: getBreakpointWidth(state),
  currentTrack: getCurrentTrack(state),
  drawerOpened: getDrawerOpened(state),
  launchbarExpanded: getLaunchbarExpanded(state),
  trackPanelOpened: getTrackPanelOpened(state)
});

const mapDispatchToProps = {
  changeCurrentTrack,
  toggleDrawer,
  toggleTrackPanel
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanel);
