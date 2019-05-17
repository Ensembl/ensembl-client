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
  toggleTrackPanel,
  closeTrackPanelModal,
  openTrackPanelModal
} from './trackPanelActions';
import { toggleDrawer, changeDrawerView } from '../drawer/drawerActions';
import {
  getTrackPanelOpened,
  getTrackPanelModalOpened,
  getTrackPanelModalView,
  getSelectedBrowserTab
} from './trackPanelSelectors';
import { getDrawerView, getDrawerOpened } from '../drawer/drawerSelectors';
import {
  getBrowserActivated,
  getDefaultChrLocation
} from '../browserSelectors';
import {
  getExampleEnsObjects,
  getEnsObjectInfo,
  getTrackCategories
} from 'src/ens-object/ensObjectSelectors';
import { getLaunchbarExpanded } from 'src/header/headerSelectors';
import { getBreakpointWidth } from 'src/global/globalSelectors';
import { ChrLocation } from '../browserState';
import { BreakpointWidth } from 'src/global/globalConfig';
import { TrackType, TrackPanelCategory } from './trackPanelConfig';

import styles from './TrackPanel.scss';

type StateProps = {
  breakpointWidth: BreakpointWidth;
  browserActivated: boolean;
  defaultChrLocation: ChrLocation;
  drawerOpened: boolean;
  drawerView: string;
  ensObjectInfo: any;
  exampleEnsObjects: any;
  launchbarExpanded: boolean;
  selectedBrowserTab: TrackType;
  trackCategories: TrackPanelCategory[];
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
      {props.browserActivated && props.ensObjectInfo.associated_object ? (
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
                ensObjectInfo={props.ensObjectInfo}
                selectedBrowserTab={props.selectedBrowserTab}
                toggleDrawer={props.toggleDrawer}
                trackCategories={props.trackCategories}
                updateDrawerView={props.changeDrawerView}
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
      ) : null}
    </section>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  breakpointWidth: getBreakpointWidth(state),
  browserActivated: getBrowserActivated(state),
  defaultChrLocation: getDefaultChrLocation(state),
  drawerOpened: getDrawerOpened(state),
  drawerView: getDrawerView(state),
  ensObjectInfo: getEnsObjectInfo(state),
  exampleEnsObjects: getExampleEnsObjects(state),
  launchbarExpanded: getLaunchbarExpanded(state),
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
