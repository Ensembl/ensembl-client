import React, {
  FunctionComponent,
  RefObject,
  useEffect,
  Fragment
} from 'react';
import { connect } from 'react-redux';

import TrackPanelBar from './track-panel-bar/TrackPanelBar';
import TrackPanelList from './track-panel-list/TrackPanelList';
import TrackPanelModal from './track-panel-modal/TrackPanelModal';

import { RootState } from 'src/store';

import {
  toggleDrawer,
  toggleTrackPanel,
  changeDrawerView,
  closeTrackPanelModal,
  openTrackPanelModal
} from '../browserActions';

import {
  getDrawerView,
  getDrawerOpened,
  getTrackPanelOpened,
  getBrowserActivated,
  getTrackPanelModalOpened,
  getTrackPanelModalView,
  getSelectedBrowserTab,
  getTrackCategories,
  getObjectInfo,
  getExampleObjects,
  getDefaultChrLocation
} from '../browserSelectors';
import { ChrLocation } from '../browserState';
import { getLaunchbarExpanded } from 'src/header/headerSelectors';
import { getBreakpointWidth } from 'src/globalSelectors';
import { BreakpointWidth } from 'src/globalConfig';
import { TrackType } from './trackPanelConfig';

import styles from './TrackPanel.scss';

type StateProps = {
  breakpointWidth: BreakpointWidth;
  browserActivated: boolean;
  defaultChrLocation: ChrLocation;
  drawerOpened: boolean;
  drawerView: string;
  exampleObjects: any;
  launchbarExpanded: boolean;
  objectInfo: any;
  selectedBrowserTab: TrackType;
  trackCategories: [];
  trackPanelModalOpened: boolean;
  trackPanelModalView: string;
  trackPanelOpened: boolean;
};

type DispatchProps = {
  changeDrawerView: (drawerView: string) => void;
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
            trackPanelModalOpened={props.trackPanelModalOpened}
            trackPanelModalView={props.trackPanelModalView}
            trackPanelOpened={props.trackPanelOpened}
          />
          {props.trackPanelOpened ? (
            <Fragment>
              <TrackPanelList
                browserRef={props.browserRef}
                defaultChrLocation={props.defaultChrLocation}
                drawerOpened={props.drawerOpened}
                drawerView={props.drawerView}
                launchbarExpanded={props.launchbarExpanded}
                objectInfo={props.objectInfo}
                selectedBrowserTab={props.selectedBrowserTab}
                toggleDrawer={props.toggleDrawer}
                trackCategories={props.trackCategories}
                updateDrawerView={props.changeDrawerView}
              />
              {props.trackPanelModalOpened ? (
                <TrackPanelModal
                  closeTrackPanelModal={props.closeTrackPanelModal}
                  exampleObjects={props.exampleObjects}
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
  defaultChrLocation: getDefaultChrLocation(state),
  drawerOpened: getDrawerOpened(state),
  drawerView: getDrawerView(state),
  exampleObjects: getExampleObjects(state),
  launchbarExpanded: getLaunchbarExpanded(state),
  objectInfo: getObjectInfo(state),
  selectedBrowserTab: getSelectedBrowserTab(state),
  trackCategories: getTrackCategories(state),
  trackPanelModalOpened: getTrackPanelModalOpened(state),
  trackPanelModalView: getTrackPanelModalView(state),
  trackPanelOpened: getTrackPanelOpened(state)
});

const mapDispatchToProps: DispatchProps = {
  changeDrawerView,
  closeTrackPanelModal,
  openTrackPanelModal,
  toggleDrawer,
  toggleTrackPanel
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanel);
