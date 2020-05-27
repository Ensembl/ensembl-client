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

import React, { memo } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import Launchbar from './Launchbar';
import { getLaunchbarExpanded } from '../headerSelectors';

import { RootState } from 'src/store';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

type StateProps = {
  launchbarExpanded: boolean;
  committedSpecies: CommittedItem[];
};

type OwnProps = {};

type LaunchbarContainerProps = StateProps & OwnProps;

export const LaunchbarContainer = memo(
  (props: LaunchbarContainerProps) => <Launchbar {...props} />,
  isEqual
);

const mapStateToProps = (state: RootState): StateProps => ({
  launchbarExpanded: getLaunchbarExpanded(state),
  committedSpecies: getEnabledCommittedSpecies(state)
});

export default connect(mapStateToProps)(LaunchbarContainer);
