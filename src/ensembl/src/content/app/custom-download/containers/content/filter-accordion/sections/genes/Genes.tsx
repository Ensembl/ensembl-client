import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import ContentBuilder from 'src/content/app/custom-download/components/content-builder/ContentBuilder';

import {
  getSelectedFilters,
  getContentState
} from '../../../../../state/filters/filterSelector';

import {
  updateSelectedFilters,
  updateContentState
} from '../../../../../state/filters/filterActions';

import allFilters from 'src/content/app/custom-download/sample-data/filters';
import { AttributeWithContent } from 'src/content/app/custom-download/types/Attributes';
import JSONValue from 'src/shared/types/JSON';

type Props = StateProps & DispatchProps;

const Genes = (props: Props) => {
  return (
    <ContentBuilder
      data={allFilters['genes'] as AttributeWithContent}
      onChange={props.updateSelectedFilters}
      contentState={props.contentState}
      onContentStateChange={props.updateContentState}
      selectedData={props.selectedFilters}
    />
  );
};

type DispatchProps = {
  updateSelectedFilters: (filters: JSONValue) => void;
  updateContentState: (updateContentState: JSONValue) => void;
};

const mapDispatchToProps: DispatchProps = {
  updateSelectedFilters,
  updateContentState
};

type StateProps = {
  selectedFilters: JSONValue;
  contentState: JSONValue;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedFilters: getSelectedFilters(state),
  contentState: getContentState(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Genes);
