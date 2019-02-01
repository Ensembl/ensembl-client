import React, { Component } from 'react';
import { connect } from 'react-redux';

import TrackPanelBar from './TrackPanelBar';
import TrackPanelList from './TrackPanelList';

import { RootState } from '../../../reducers';
import {
  toggleTrackPanel,
  changeCurrentTrack,
  openDrawer,
  closeDrawer
} from '../../../actions/browserActions';
import {
  getCurrentTrack,
  getDrawerOpened,
  getTrackPanelOpened
} from '../../../selectors/browserSelectors';

type TrackPanelProps = {
  changeCurrentTrack: (currentTrack: string) => void;
  closeDrawer: () => void;
  currentTrack: string;
  drawerOpened: boolean;
  openDrawer: () => void;
  toggleTrackPanel: () => void;
  trackPanelOpened: boolean;
};

class TrackPanel extends Component<TrackPanelProps> {
  public render() {
    return (
      <section
        className={`track-panel react-slide-drawer ${this.getToggleClass()}`}
      >
        <TrackPanelBar
          closeDrawer={this.props.closeDrawer}
          drawerOpened={this.props.drawerOpened}
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

  private getToggleClass(): string {
    if (this.props.trackPanelOpened === true) {
      return 'expanded';
    } else {
      return 'collapsed';
    }
  }
}

const mapStateToProps = (state: RootState) => ({
  currentTrack: getCurrentTrack(state),
  drawerOpened: getDrawerOpened(state),
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
