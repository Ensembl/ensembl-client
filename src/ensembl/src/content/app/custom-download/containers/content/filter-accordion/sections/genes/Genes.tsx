import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import ContentBuilder from 'src/content/app/custom-download/components/content-builder/ContentBuilder';

import { getSelectedFilters } from '../../state/filterAccordionSelector';

import { updateSelectedFilters } from '../../state/filterAccordionActions';

import set from 'lodash/set';

import allFilters from 'src/content/app/custom-download/sample-data/filters';

import styles from './Genes.scss';

type Props = StateProps & DispatchProps;

const Genes = (props: Props) => {
  useEffect(() => {}, [props.selectedFilters]);

  const filtersOnChange = (
    type: string,
    path: (string | number)[],
    payload: any
  ) => {
    const updatedFilters = { ...props.selectedFilters };
    set(updatedFilters, path, payload);
    props.updateSelectedFilters(updatedFilters);
  };

  return (
    <ContentBuilder
      data={allFilters['genes']}
      onChange={filtersOnChange}
      selectedData={props.selectedFilters}
    />
  );
};

type DispatchProps = {
  updateSelectedFilters: (filters: any) => void;
};

const mapDispatchToProps: DispatchProps = {
  updateSelectedFilters
};

type StateProps = {
  selectedFilters: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedFilters: getSelectedFilters(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Genes);
