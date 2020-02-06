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

import JSONValue from 'src/shared/types/JSON';
import allFilters from 'src/content/app/custom-download/sample-data/filters';
import { AttributeWithContent } from 'src/content/app/custom-download/types/Attributes';

type Props = StateProps & DispatchProps;

const Proteins = (props: Props) => {
  const content = allFilters['proteins'] as AttributeWithContent;
  return (
    <ContentBuilder
      data={content}
      onChange={props.updateSelectedFilters}
      uiState={props.uiState}
      onUiChange={props.updateUi}
      selectedData={props.selectedFilters}
    />
  );
};

type DispatchProps = {
  updateSelectedFilters: (filters: JSONValue) => void;
  updateUi: (uiState: JSONValue) => void;
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

export default connect(mapStateToProps, mapDispatchToProps)(Proteins);
