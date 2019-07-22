import React, { FunctionComponent, RefObject, useEffect } from 'react';
import { connect } from 'react-redux';
import { useSpring, animated } from 'react-spring';

import TrackPanelBar from './track-panel-bar/TrackPanelBar';
import TrackPanelList from './track-panel-list/TrackPanelList';
import TrackPanelModal from './track-panel-modal/TrackPanelModal';
import Drawer from '../drawer/Drawer';
import { RootState } from 'src/store';

import {
  updateTrackStatesAndSave,
  UpdateTrackStatesPayload
} from 'src/content/app/browser/browserActions';
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
import { getDrawerView, getIsDrawerOpened } from '../drawer/drawerSelectors';
import {
  getBrowserActivated,
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObject,
  getBrowserTrackStates
} from '../browserSelectors';
import { getLaunchbarExpanded } from 'src/header/headerSelectors';
import { getBreakpointWidth } from 'src/global/globalSelectors';
import { BreakpointWidth } from 'src/global/globalConfig';
import { TrackType, TrackStates } from './trackPanelConfig';

import { GenomeTrackCategory } from 'src/genome/genomeTypes';
import { getGenomeTrackCategoriesById } from 'src/genome/genomeSelectors';
import { EnsObject } from 'src/ens-object/ensObjectTypes';

import styles from './TrackPanel.scss';

type StateProps = {
  activeGenomeId: string | null;
  breakpointWidth: BreakpointWidth;
  browserActivated: boolean;
  isDrawerOpened: boolean;
  drawerView: string;
  ensObject: EnsObject | null;
  launchbarExpanded: boolean;
  selectedBrowserTab: TrackType;
  genomeTrackCategories: GenomeTrackCategory[];
  trackPanelModalOpened: boolean;
  trackPanelModalView: string;
  trackPanelOpened: boolean;
  trackStates: TrackStates;
};

type DispatchProps = {
  changeDrawerView: (drawerView: string) => void;
  closeTrackPanelModal: () => void;
  openTrackPanelModal: (trackPanelModalView: string) => void;
  toggleDrawer: (isDrawerOpened: boolean) => void;
  toggleTrackPanel: (trackPanelOpened?: boolean) => void;
  updateTrackStates: (payload: UpdateTrackStatesPayload) => void;
};

type OwnProps = {
  browserRef: RefObject<HTMLDivElement>;
};

type TrackPanelProps = StateProps & DispatchProps & OwnProps;

const TrackPanel: FunctionComponent<TrackPanelProps> = (
  props: TrackPanelProps
) => {
  const { isDrawerOpened } = props;

  useEffect(() => {
    if (props.breakpointWidth !== BreakpointWidth.LARGE) {
      props.toggleTrackPanel(false);
    } else {
      props.toggleTrackPanel(true);
    }
  }, [props.breakpointWidth, props.toggleTrackPanel]);

  const [trackAnimation, setTrackAnimation] = useSpring(() => ({
    config: { tension: 280, friction: 45 },
    height: '100%',
    position: 'absolute' as 'absolute',
    display: 'block',
    left: 'calc(-356px + 100vw)'
  }));

  const getBrowserWidth = (): string => {
    if (isDrawerOpened) {
      return 'calc(41px + 0vw)';
    }
    return props.trackPanelOpened
      ? 'calc(-356px + 100vw)'
      : 'calc(-36px + 100vw)';
  };

  useEffect(() => {
    setTrackAnimation({
      left: getBrowserWidth()
    });
  }, [isDrawerOpened, props.trackPanelOpened]);

  return props.activeGenomeId ? (
    <animated.div style={trackAnimation}>
      {props.browserActivated && props.ensObject ? (
        <div className={styles.trackPanel}>
          <TrackPanelBar
            activeGenomeId={props.activeGenomeId}
            closeTrackPanelModal={props.closeTrackPanelModal}
            isDrawerOpened={props.isDrawerOpened}
            launchbarExpanded={props.launchbarExpanded}
            openTrackPanelModal={props.openTrackPanelModal}
            toggleDrawer={props.toggleDrawer}
            toggleTrackPanel={props.toggleTrackPanel}
            trackPanelModalOpened={props.trackPanelModalOpened}
            trackPanelModalView={props.trackPanelModalView}
            trackPanelOpened={props.trackPanelOpened}
          />
          <TrackPanelList
            activeGenomeId={props.activeGenomeId}
            browserRef={props.browserRef}
            isDrawerOpened={props.isDrawerOpened}
            drawerView={props.drawerView}
            launchbarExpanded={props.launchbarExpanded}
            ensObject={props.ensObject}
            selectedBrowserTab={props.selectedBrowserTab}
            toggleDrawer={props.toggleDrawer}
            trackStates={props.trackStates}
            genomeTrackCategories={props.genomeTrackCategories}
            updateDrawerView={props.changeDrawerView}
            updateTrackStates={props.updateTrackStates}
          />

          {props.trackPanelModalOpened ? (
            <TrackPanelModal
              closeTrackPanelModal={props.closeTrackPanelModal}
              launchbarExpanded={props.launchbarExpanded}
              trackPanelModalView={props.trackPanelModalView}
            />
          ) : null}
          {isDrawerOpened && <Drawer />}
        </div>
      ) : null}
    </animated.div>
  ) : null;
};

const mapStateToProps = (state: RootState): StateProps => {
  const activeGenomeId = getBrowserActiveGenomeId(state);

  return {
    activeGenomeId,
    breakpointWidth: getBreakpointWidth(state),
    browserActivated: getBrowserActivated(state),
    isDrawerOpened: getIsDrawerOpened(state),
    drawerView: getDrawerView(state),
    ensObject: getBrowserActiveEnsObject(state),
    launchbarExpanded: getLaunchbarExpanded(state),
    selectedBrowserTab: getSelectedBrowserTab(state),
    genomeTrackCategories: activeGenomeId
      ? getGenomeTrackCategoriesById(state, activeGenomeId)
      : [],
    trackPanelModalOpened: getTrackPanelModalOpened(state),
    trackPanelModalView: getTrackPanelModalView(state),
    trackPanelOpened: getTrackPanelOpened(state),
    trackStates: getBrowserTrackStates(state)
  };
};

const mapDispatchToProps: DispatchProps = {
  changeDrawerView,
  closeTrackPanelModal,
  openTrackPanelModal,
  toggleDrawer,
  toggleTrackPanel,
  updateTrackStates: updateTrackStatesAndSave
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanel);
