import React, {
  FunctionComponent,
  RefObject,
  useEffect,
  Fragment
} from 'react';
import { connect } from 'react-redux';

import TrackPanelBar from './track-panel-bar/TrackPanelBar';
import TrackPanelList from './track-panel-list/TrackPanelList';

import { RootState } from 'src/rootReducer';

import {
  toggleDrawer,
  toggleTrackPanel,
  changeCurrentTrack,
  closeTrackPanelModal,
  openTrackPanelModal
} from '../browserActions';

import {
  getCurrentTrack,
  getDrawerOpened,
  getTrackPanelOpened,
  getBrowserActivated,
  getTrackPanelModalOpened,
  getTrackPanelModalView
} from '../browserSelectors';

import { getLaunchbarExpanded } from 'src/header/headerSelectors';
import { getBreakpointWidth } from 'src/globalSelectors';
import { BreakpointWidth } from 'src/globalConfig';

import styles from './TrackPanel.scss';
import TrackPanelModal from './track-panel-modal/TrackPanelModal';

type StateProps = {
  browserActivated: boolean;
  currentTrack: string;
  drawerOpened: boolean;
  breakpointWidth: BreakpointWidth;
  launchbarExpanded: boolean;
  trackPanelModalOpened: boolean;
  trackPanelModalView: string;
  trackPanelOpened: boolean;
};

type DispatchProps = {
  changeCurrentTrack: (currentTrack: string) => void;
  closeTrackPanelModal: () => void;
  openTrackPanelModal: (trackPanelModalView: string) => void;
  toggleDrawer: (drawerOpened: boolean) => void;
  toggleTrackPanel: (trackPanelOpened?: boolean) => void;
};

type OwnProps = {
  browserRef: RefObject<HTMLDivElement>;
};

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
      {props.browserActivated && (
        <Fragment>
          <TrackPanelBar
            closeTrackPanelModal={props.closeTrackPanelModal}
            drawerOpened={props.drawerOpened}
            launchbarExpanded={props.launchbarExpanded}
            openTrackPanelModal={props.openTrackPanelModal}
            toggleDrawer={props.toggleDrawer}
            toggleTrackPanel={props.toggleTrackPanel}
            trackPanelModalView={props.trackPanelModalView}
            trackPanelOpened={props.trackPanelOpened}
          />
          {props.trackPanelOpened ? (
            <Fragment>
              <TrackPanelList
                browserRef={props.browserRef}
                currentTrack={props.currentTrack}
                launchbarExpanded={props.launchbarExpanded}
                toggleDrawer={props.toggleDrawer}
                updateTrack={props.changeCurrentTrack}
              />
              {props.trackPanelModalOpened ? (
                <TrackPanelModal
                  closeTrackPanelModal={props.closeTrackPanelModal}
                  launchbarExpanded={props.launchbarExpanded}
                  trackPanelModalView={props.trackPanelModalView}
                />
              ) : null}
            </Fragment>
          ) : null}
        </Fragment>
      )}
    </section>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  breakpointWidth: getBreakpointWidth(state),
  browserActivated: getBrowserActivated(state),
  currentTrack: getCurrentTrack(state),
  drawerOpened: getDrawerOpened(state),
  launchbarExpanded: getLaunchbarExpanded(state),
  trackPanelModalOpened: getTrackPanelModalOpened(state),
  trackPanelModalView: getTrackPanelModalView(state),
  trackPanelOpened: getTrackPanelOpened(state)
});

const mapDispatchToProps: DispatchProps = {
  changeCurrentTrack,
  closeTrackPanelModal,
  openTrackPanelModal,
  toggleDrawer,
  toggleTrackPanel
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanel);
