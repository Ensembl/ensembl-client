import React, { memo } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import TrackPanelList from './track-panel-list/TrackPanelList';
import TrackPanelModal from './track-panel-modal/TrackPanelModal';
import { RootState } from 'src/store';

import { getIsTrackPanelModalOpened } from './trackPanelSelectors';
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
  activeEnsObject: EnsObject | null;
  isTrackPanelModalOpened: boolean;
  toggleTrackPanel: (isTrackPanelOpened: boolean) => void;
};

export const TrackPanel = (props: TrackPanelProps) => {
  // FIXME – move this to standard layout component
  // useEffect(() => {
  //   if (props.breakpointWidth >= BreakpointWidth.DESKTOP) {
  //     props.toggleTrackPanel(true);
  //   } else {
  //     props.toggleTrackPanel(false);
  //   }
  // }, [props.breakpointWidth, props.toggleTrackPanel]);

  // FIXME — get TrackPanelBar back
  // <TrackPanelBar />

  const shouldRenderContent =
    props.activeGenomeId && props.browserActivated && props.activeEnsObject;

  return shouldRenderContent ? (
    <div className={styles.trackPanel}>
      <TrackPanelList />
      {props.isTrackPanelModalOpened ? <TrackPanelModal /> : null}
    </div>
  ) : null;
};

const mapStateToProps = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);

  return {
    activeGenomeId,
    browserActivated: getBrowserActivated(state),
    breakpointWidth: getBreakpointWidth(state),
    activeEnsObject: getBrowserActiveEnsObject(state),
    isTrackPanelModalOpened: getIsTrackPanelModalOpened(state)
  };
};

const mapDispatchToProps = {
  toggleTrackPanel
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(TrackPanel, isEqual));
