import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useSpring, animated } from 'react-spring';

import TrackPanelBar from './track-panel-bar/TrackPanelBar';
import TrackPanelList from './track-panel-list/TrackPanelList';
import TrackPanelModal from './track-panel-modal/TrackPanelModal';
import Drawer from '../drawer/Drawer';
import { RootState } from 'src/store';

import {
  getIsTrackPanelOpened,
  getIsTrackPanelModalOpened,
  getSelectedTrackPanelTab
} from './trackPanelSelectors';
import { getIsDrawerOpened } from '../drawer/drawerSelectors';
import {
  getBrowserActivated,
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObject,
  getBrowserTrackStates
} from '../browserSelectors';
import { getBreakpointWidth } from 'src/global/globalSelectors';
import { BreakpointWidth } from 'src/global/globalConfig';
import { TrackSet, TrackStates } from './trackPanelConfig';

import { GenomeTrackCategory } from 'src/genome/genomeTypes';
import { getGenomeTrackCategoriesById } from 'src/genome/genomeSelectors';
import { EnsObject } from 'src/ens-object/ensObjectTypes';

import styles from './TrackPanel.scss';

type TrackPanelProps = {
  activeGenomeId: string | null;
  breakpointWidth: BreakpointWidth;
  browserActivated: boolean;
  isDrawerOpened: boolean;
  activeEnsObject: EnsObject | null;
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  selectedTrackPanelTab: TrackSet;
  genomeTrackCategories: GenomeTrackCategory[];
  trackStates: TrackStates;
};

const TrackPanel = (props: TrackPanelProps) => {
  const { isDrawerOpened } = props;

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
          {isDrawerOpened && <Drawer />}
        </div>
      ) : null}
    </animated.div>
  ) : null;
};

const mapStateToProps = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);

  return {
    activeGenomeId,
    breakpointWidth: getBreakpointWidth(state),
    browserActivated: getBrowserActivated(state),
    isDrawerOpened: getIsDrawerOpened(state),
    activeEnsObject: getBrowserActiveEnsObject(state),
    isTrackPanelModalOpened: getIsTrackPanelModalOpened(state),
    selectedTrackPanelTab: getSelectedTrackPanelTab(state),
    genomeTrackCategories: activeGenomeId
      ? getGenomeTrackCategoriesById(state, activeGenomeId)
      : [],
    isTrackPanelOpened: getIsTrackPanelOpened(state),
    trackStates: getBrowserTrackStates(state)
  };
};

export default connect(mapStateToProps)(TrackPanel);
