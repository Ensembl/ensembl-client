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

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PreFilterPanel from 'src/content/app/custom-download/containers/pre-filters-panel/PreFilterPanel';
import {
  getShowPreFilterPanel,
  getCustomDownloadActiveGenomeId
} from './state/customDownloadSelectors';
import { RootState } from 'src/store';
import CustomDownloadHeader from './containers/header/CustomDownloadHeader';
import CustomDownloadContent from './containers/content/CustomDownloadContent';
import CustomDownloadAppBar from './containers/app-bar/CustomDownloadAppBar';
import { setActiveGenomeId } from './state/customDownloadActions';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';
import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

type StateProps = {
  shouldShowPreFilterPanel: boolean;
  activeGenomeId: string | null;
  committedItems: CommittedItem[];
};

type DispatchProps = {
  setActiveGenomeId: (activeGenomeId: string) => void;
};

type CustomDownloadProps = StateProps & DispatchProps;

const CustomDownload = (props: CustomDownloadProps) => {
  useEffect(() => {
    if (!props.activeGenomeId && props.committedItems.length) {
      props.setActiveGenomeId(props.committedItems[0].genome_id);
    }
  }, []);

  if (!props.activeGenomeId) {
    return null;
  }
  return (
    <div>
      <CustomDownloadAppBar onSpeciesSelect={props.setActiveGenomeId} />
      {props.shouldShowPreFilterPanel && <PreFilterPanel />}
      {!props.shouldShowPreFilterPanel && (
        <>
          <CustomDownloadHeader />
          <CustomDownloadContent />
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  shouldShowPreFilterPanel: getShowPreFilterPanel(state),
  activeGenomeId: getCustomDownloadActiveGenomeId(state),
  committedItems: getCommittedSpecies(state)
});

const mapDispatchToProps: DispatchProps = {
  setActiveGenomeId
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomDownload);
