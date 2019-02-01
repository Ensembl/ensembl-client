import React, { Component, ReactNode } from 'react';
import { connect } from 'react-redux';

import { RootState } from '../../reducers';
import {
  changeCurrentDrawerSection,
  closeDrawer
} from '../../actions/browserActions';
import {
  getCurrentDrawerSection,
  getCurrentTrack,
  getDrawerSections
} from '../../selectors/browserSelectors';

import { DrawerSection } from '../../configs/drawerSectionConfig';

import {
  trackPanelConfig,
  TrackPanelConfig
} from '../../configs/trackPanelConfig';

import DrawerBar from './DrawerBar';
import TrackOne from './track-one/TrackOne';
import TrackTwo from './track-two/TrackTwo';

type StateProps = {
  currentDrawerSection: string;
  currentTrack: string;
  drawerSections: DrawerSection[];
};

type DispatchProps = {
  changeCurrentDrawerSection: (currentDrawerSection: string) => void;
  closeDrawer: () => void;
};

type OwnProps = {};

type TrackProps = StateProps & DispatchProps & OwnProps;

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

const mapStateToProps = (state: RootState): StateProps => ({
  currentDrawerSection: getCurrentDrawerSection(state),
  currentTrack: getCurrentTrack(state),
  drawerSections: getDrawerSections(state)
});

const mapDispatchToProps: DispatchProps = {
  changeCurrentDrawerSection,
  closeDrawer
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Track);
