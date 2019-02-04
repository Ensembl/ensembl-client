import React, { Component } from 'react';
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

class TrackPanel extends Component<TrackPanelProps> {
  public render() {
    return (
      <section className={`${styles.trackPanel} reactSlideDrawer`}>
        <TrackPanelBar
          closeDrawer={this.props.closeDrawer}
          drawerOpened={this.props.drawerOpened}
          launchbarExpanded={this.props.launchbarExpanded}
          trackPanelOpened={this.props.trackPanelOpened}
          toggleTrackPanel={this.props.toggleTrackPanel}
        />
        {this.props.trackPanelOpened ? (
          <TrackPanelList
            currentTrack={this.props.currentTrack}
            openDrawer={this.props.openDrawer}
            updateTrack={this.props.changeCurrentTrack}
          />
        ) : null}
      </section>
    );
  }
}

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
