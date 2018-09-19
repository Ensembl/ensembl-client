import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import DrawerBar from './DrawerBar';
import { RootState } from '../../reducers';
import { closeDrawer } from '../../actions/browserActions';
import { DrawerSection } from '../../configs/drawerSectionConfig';
import { trackPanelConfig, TrackPanelConfig } from '../../configs/trackPanelConfig';

type TrackParams = {};

type TrackProps = RouteComponentProps<TrackParams> & {
  closeDrawer: () => void;
  currentTrack: string;
  drawerSections: DrawerSection[];
};

class Track extends Component<TrackProps> {
  public trackConfig: object = {};

  public componentDidMount() {
    this.trackConfig = this.getCurrentTrackConfig() as TrackPanelConfig;
  }

  public componentDidUpdate(prevProps: TrackProps) {
    if (this.props.currentTrack !== prevProps.currentTrack) {
      this.trackConfig = this.getCurrentTrackConfig() as TrackPanelConfig;
    }
  }

  public render() {
    return (
      <section className="drawer">
        <DrawerBar
          closeDrawer={this.props.closeDrawer}
          currentTrack={this.props.currentTrack}
          drawerSections={this.props.drawerSections}
        />
        <div className="track-canvas">{}</div>
      </section>
    );
  }

  private getCurrentTrackConfig(): TrackPanelConfig {
    return trackPanelConfig.filter((track: TrackPanelConfig) => this.props.currentTrack === track.name)[0];
  }
}

const mapStateToProps = (state: RootState) => {
  const { currentTrack, drawerSections } = state.browser;
  return { currentTrack, drawerSections };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeDrawer: () => dispatch(closeDrawer())
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Track)
);
