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

import {
  Attributes,
  AttributeWithContent
} from 'src/content/app/custom-download/types/Attributes';

import {
  getFilters,
  getSelectedFilters,
  getFiltersUi
} from 'src/content/app/custom-download/state/filters/filtersSelector';

import {
  updateSelectedFilters,
  updateUi
} from 'src/content/app/custom-download/state/filters/filtersActions';

import ContentBuilder from 'src/content/app/custom-download/components/content-builder/ContentBuilder';
import allFilters from 'src/content/app/custom-download/sample-data/filters';

import JSONValue from 'src/shared/types/JSON';

type ownProps = {
  showOverview?: boolean;
  section: string;
};

type StateProps = {
  selectedFilters: JSONValue;
  ui: JSONValue;
  filters: Attributes;
};
type DispatchProps = {
  updateSelectedFilters: (filters: JSONValue) => void;
  updateUi: (ui: JSONValue) => void;
};

type Props = ownProps & StateProps & DispatchProps;

const FiltersAccordionSection = (props: Props) => {
  const allSectionFilters = allFilters[props.section];

  if (!props.showOverview) {
    return (
      <ContentBuilder
        data={allSectionFilters as AttributeWithContent}
        onChange={props.updateSelectedFilters}
        uiState={{
          ...props.ui,
          checkbox_grid: { isCollapsible: true }
        }}
        onUiChange={props.updateUi}
        selectedData={props.selectedFilters}
      />
    );
  }
  return (
    <ContentBuilder
      data={allSectionFilters as AttributeWithContent}
      onChange={props.updateSelectedFilters}
      uiState={{
        ...props.ui,
        checkbox_grid: { isCollapsible: true, hideUnchecked: true }
      }}
      onUiChange={props.updateUi}
      selectedData={props.selectedFilters}
      showOverview={props.showOverview}
    />
  );
};

const mapDispatchToProps: DispatchProps = {
  updateSelectedFilters,
  updateUi
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedFilters: getSelectedFilters(state),
  ui: getFiltersUi(state),
  filters: getFilters(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersAccordionSection);
