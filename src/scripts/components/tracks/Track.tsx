import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { RootState } from '../../reducers';
import {
  changeCurrentDrawerSection,
  closeDrawer
} from '../../actions/browserActions';
import { DrawerSection } from '../../configs/drawerSectionConfig';
import {
  trackPanelConfig,
  TrackPanelConfig
} from '../../configs/trackPanelConfig';

import DrawerBar from './DrawerBar';
import TrackOne from './track-one/TrackOne';
import TrackTwo from './track-two/TrackTwo';

type TrackProps = {
  changeCurrentDrawerSection: (currentDrawerSection: string) => void;
  closeDrawer: () => void;
  currentDrawerSection: string;
  currentTrack: string;
  drawerSections: DrawerSection[];
};

class Track extends Component<TrackProps> {
  public render() {
    const TrackComponent = this.getCurrentTrackComponent();

    return (
      <section className="drawer">
        <DrawerBar
          changeCurrentDrawerSection={this.props.changeCurrentDrawerSection}
          closeDrawer={this.props.closeDrawer}
          currentTrack={this.props.currentTrack}
          drawerSections={this.props.drawerSections}
        />
        <div className="track-canvas">{TrackComponent}</div>
      </section>
    );
  }

  private getCurrentTrackComponent(): ReactNode {
    const { currentDrawerSection, currentTrack, drawerSections } = this.props;

    const currentTrackConfig: TrackPanelConfig = trackPanelConfig.filter(
      (track: TrackPanelConfig) => currentTrack === track.name
    )[0];

    switch (currentTrackConfig.name) {
      case 'track-one':
        return (
          <TrackOne
            currentDrawerSection={currentDrawerSection}
            drawerSections={drawerSections}
          />
        );
      case 'track-two':
        return (
          <TrackTwo
            currentDrawerSection={currentDrawerSection}
            drawerSections={drawerSections}
          />
        );
      default:
        return (
          <TrackOne
            currentDrawerSection={currentDrawerSection}
            drawerSections={drawerSections}
          />
        );
    }
  }
}

const mapStateToProps = (state: RootState) => {
  const { currentDrawerSection, currentTrack, drawerSections } = state.browser;
  return { currentDrawerSection, currentTrack, drawerSections };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  changeCurrentDrawerSection: (currentDrawerSection: string) =>
    dispatch(changeCurrentDrawerSection(currentDrawerSection)),
  closeDrawer: () => dispatch(closeDrawer())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Track);
