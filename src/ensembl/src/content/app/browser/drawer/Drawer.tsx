import React, { Component } from 'react';
import { connect } from 'react-redux';

import { RootState } from 'src/rootReducer';
import { changeCurrentDrawerSection, closeDrawer } from '../browserActions';
import {
  getCurrentDrawerSection,
  getCurrentTrack,
  getDrawerSections
} from '../browserSelectors';

import { DrawerSection } from './drawerSectionConfig';

// import {
//   trackPanelConfig,
//   TrackPanelItem
// } from '../track-panel/trackPanelConfig';

import DrawerBar from './DrawerBar';
// import TrackOne from './tracks/TrackOne';
// import TrackTwo from './tracks/TrackTwo';

import styles from './Drawer.scss';

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

type DrawerProps = StateProps & DispatchProps & OwnProps;

class Drawer extends Component<DrawerProps> {
  public render() {
    // const TrackComponent = this.getCurrentTrackComponent();

    return (
      <section className={styles.drawer}>
        <DrawerBar
          changeCurrentDrawerSection={this.props.changeCurrentDrawerSection}
          closeDrawer={this.props.closeDrawer}
          currentTrack={this.props.currentTrack}
          drawerSections={this.props.drawerSections}
        />
        {/* <div className="track-canvas">{TrackComponent}</div> */}
      </section>
    );
  }

  // private getCurrentTrackComponent(): ReactNode {
  //   const { currentDrawerSection, currentTrack, drawerSections } = this.props;

  //   const currentTrackConfig: TrackPanelItem = trackPanelConfig.filter(
  //     (track: TrackPanelItem) => currentTrack === track.name
  //   )[0];

  //   switch (currentTrackConfig.name) {
  //     case 'track-one':
  //       return (
  //         <TrackOne
  //           currentDrawerSection={currentDrawerSection}
  //           drawerSections={drawerSections}
  //         />
  //       );
  //     case 'track-two':
  //       return (
  //         <TrackTwo
  //           currentDrawerSection={currentDrawerSection}
  //           drawerSections={drawerSections}
  //         />
  //       );
  //     default:
  //       return (
  //         <TrackOne
  //           currentDrawerSection={currentDrawerSection}
  //           drawerSections={drawerSections}
  //         />
  //       );
  //   }
  // }
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
)(Drawer);
