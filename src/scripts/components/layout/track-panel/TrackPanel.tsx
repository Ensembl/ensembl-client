import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import TrackPanelBar from './TrackPanelBar';
import TrackPanelList from './TrackPanelList';
import { RootState } from '../../../reducers';
import {
  toggleTrackPanel,
  changeCurrentTrack,
  openDrawer,
  closeDrawer
} from '../../../actions/browserActions';

type TrackPanelProps = {
  closeDrawer: () => void;
  currentTrack: string;
  drawerOpened: boolean;
  openDrawer: () => void;
  toggleTrackPanel: () => void;
  trackPanelOpened: boolean;
  updateTrack: (currentTrack: string) => void;
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
            updateTrack={this.props.updateTrack}
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

const mapStateToProps = (state: RootState) => {
  const { currentTrack, drawerOpened, trackPanelOpened } = state.browser;
  return { currentTrack, drawerOpened, trackPanelOpened };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeDrawer: () => dispatch(closeDrawer()),
  openDrawer: () => dispatch(openDrawer()),
  toggleTrackPanel: () => dispatch(toggleTrackPanel()),
  updateTrack: (currentTrack: string) => dispatch(changeCurrentTrack(currentTrack))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanel);
