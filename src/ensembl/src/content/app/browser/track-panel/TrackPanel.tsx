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

import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

export type TrackPanelProps = {
  activeGenomeId: string | null;
  browserActivated: boolean;
  activeEnsObject: EnsObject | null;
  isTrackPanelModalOpened: boolean;
};

export const TrackPanel = (props: TrackPanelProps) => {
  const shouldRenderContent =
    props.activeGenomeId && props.browserActivated && props.activeEnsObject;

  return shouldRenderContent ? (
    props.isTrackPanelModalOpened ? (
      <TrackPanelModal />
    ) : (
      <TrackPanelList />
    )
  ) : null;
};

const mapStateToProps = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);

  return {
    activeGenomeId,
    browserActivated: getBrowserActivated(state),
    activeEnsObject: getBrowserActiveEnsObject(state),
    isTrackPanelModalOpened: getIsTrackPanelModalOpened(state)
  };
};

export default connect(mapStateToProps)(memo(TrackPanel, isEqual));
