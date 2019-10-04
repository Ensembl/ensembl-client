import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import {
  Attributes,
  AttributeWithContent
} from 'src/content/app/custom-download/types/Attributes';

import CheckboxGrid, {
  CheckboxGridOption
} from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

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
  console.log(props.selectedFilters);
  console.log('TCL: FiltersAccordionSection -> allFilters', allFilters);

  const allSectionFilters = allFilters[props.section];

  if (!props.showOverview) {
    return (
      <ContentBuilder
        data={allSectionFilters as AttributeWithContent}
        onChange={props.updateSelectedFilters}
        uiState={{ ...props.ui }}
        onUiChange={props.updateUi}
        selectedData={props.selectedFilters}
      />
    );
  }

  const selectedFilters = props.selectedFilters[props.section] as JSONValue;
  const gridOptions: any = [];
  Object.keys(selectedFilters).forEach((filter) => {
    if (
      selectedFilters &&
      selectedFilters[filter] &&
      selectedFilters[filter].length
    ) {
      gridOptions.push({
        isChecked: true,
        id: filter,
        label: 'test'
      });
    }
  });

  return (
    <CheckboxGrid onChange={console.log} options={gridOptions} label={''} />
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
