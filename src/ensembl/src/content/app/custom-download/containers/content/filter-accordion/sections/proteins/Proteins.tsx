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
      contentState={props.contentState}
      onContentStateChange={props.updateContentState}
      selectedData={props.selectedFilters}
    />
  );
};

type DispatchProps = {
  updateSelectedFilters: (filters: JSONValue) => void;
  updateContentState: (contentState: JSONValue) => void;
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
)(Proteins);
