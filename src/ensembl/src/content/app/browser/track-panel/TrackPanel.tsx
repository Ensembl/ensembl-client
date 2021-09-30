/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { memo, useEffect } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import TrackPanelList from './track-panel-list/TrackPanelList';
import TrackPanelModal from './track-panel-modal/TrackPanelModal';
import { SidebarLoader } from 'src/shared/components/loader';

import { getIsTrackPanelModalOpened } from './trackPanelSelectors';
import {
  getBrowserActivated,
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObject
} from '../browserSelectors';

import { restoreBrowserTrackStates } from '../browserActions';

import { RootState } from 'src/store';
import { EnsObject } from 'src/shared/state/ens-object/ensObjectTypes';

export type TrackPanelProps = {
  activeGenomeId: string | null;
  browserActivated: boolean;
  activeEnsObject: EnsObject | null;
  isTrackPanelModalOpened: boolean;
  restoreBrowserTrackStates: () => void;
};

export const TrackPanel = (props: TrackPanelProps) => {
  const shouldRenderContent =
    props.activeGenomeId && props.browserActivated && props.activeEnsObject;

  useEffect(() => {
    props.restoreBrowserTrackStates();
  }, [props.activeEnsObject]);

  return shouldRenderContent ? (
    props.isTrackPanelModalOpened ? (
      <TrackPanelModal />
    ) : (
      <TrackPanelList />
    )
  ) : (
    <SidebarLoader />
  );
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

const mapDispatchToProps = {
  restoreBrowserTrackStates
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(TrackPanel, isEqual));
