import React, { useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { useSpring, animated } from 'react-spring';
import isEqual from 'lodash/isEqual';

import TrackPanelBar from './track-panel-bar/TrackPanelBar';
import TrackPanelList from './track-panel-list/TrackPanelList';
import TrackPanelModal from './track-panel-modal/TrackPanelModal';
import Drawer from '../drawer/Drawer';
import { RootState } from 'src/store';

import {
  getIsTrackPanelOpened,
  getIsTrackPanelModalOpened
} from './trackPanelSelectors';
import { getIsDrawerOpened } from '../drawer/drawerSelectors';
import {
  getBrowserActivated,
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObject
} from '../browserSelectors';
import { getBreakpointWidth } from 'src/global/globalSelectors';
import { toggleTrackPanel } from './trackPanelActions';
import { BreakpointWidth } from 'src/global/globalConfig';

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

import styles from './TrackPanel.scss';

export type TrackPanelProps = {
  activeGenomeId: string | null;
  browserActivated: boolean;
  breakpointWidth: BreakpointWidth;
  isDrawerOpened: boolean;
  activeEnsObject: EnsObject | null;
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  toggleTrackPanel: (isTrackPanelOpened: boolean) => void;
};

export const TrackPanel = (props: TrackPanelProps) => {
  const { isDrawerOpened } = props;

  useEffect(() => {
    if (props.breakpointWidth !== BreakpointWidth.DESKTOP) {
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
    return props.isTrackPanelOpened
      ? 'calc(-356px + 100vw)'
      : 'calc(-36px + 100vw)';
  };

  useEffect(() => {
    setTrackAnimation({
      left: getBrowserWidth()
    });
  }, [isDrawerOpened, props.isTrackPanelOpened]);

  return props.activeGenomeId ? (
    <animated.div style={trackAnimation}>
      {props.browserActivated && props.activeEnsObject ? (
        <div className={styles.trackPanel}>
          <TrackPanelBar />
          <TrackPanelList />
          {props.isTrackPanelModalOpened ? <TrackPanelModal /> : null}
          {isDrawerOpened ? <Drawer /> : null}
        </div>
      ) : null}
    </animated.div>
  ) : null;
};

const mapStateToProps = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);

  return {
    activeGenomeId,
    browserActivated: getBrowserActivated(state),
    breakpointWidth: getBreakpointWidth(state),
    isDrawerOpened: getIsDrawerOpened(state),
    activeEnsObject: getBrowserActiveEnsObject(state),
    isTrackPanelModalOpened: getIsTrackPanelModalOpened(state),
    isTrackPanelOpened: getIsTrackPanelOpened(state)
  };
};

const mapDispatchToProps = {
  toggleTrackPanel
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(TrackPanel, isEqual));
