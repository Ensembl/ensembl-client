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

import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import ContentBuilder from 'src/content/app/custom-download/components/content-builder/ContentBuilder';

import {
  getSelectedFilters,
  getFiltersUi
} from 'src/content/app/custom-download/state/filters/filtersSelector';

import {
  updateSelectedFilters,
  updateUi
} from 'src/content/app/custom-download/state/filters/filtersActions';

import allFilters from 'src/content/app/custom-download/sample-data/filters';
import { AttributeWithContent } from 'src/content/app/custom-download/types/Attributes';
import JSONValue from 'src/shared/types/JSON';

type Props = StateProps & DispatchProps;

const Genes = (props: Props) => {
  return (
    <ContentBuilder
      data={allFilters['genes'] as AttributeWithContent}
      onChange={props.updateSelectedFilters}
      uiState={props.uiState}
      onUiChange={props.updateUi}
      selectedData={props.selectedFilters}
    />
  );
};

type DispatchProps = {
  updateSelectedFilters: (filters: JSONValue) => void;
  updateUi: (updateUi: JSONValue) => void;
};

const mapDispatchToProps: DispatchProps = {
  updateSelectedFilters,
  updateUi
};

type StateProps = {
  selectedFilters: JSONValue;
  uiState: JSONValue;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedFilters: getSelectedFilters(state),
  uiState: getFiltersUi(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(Genes);
