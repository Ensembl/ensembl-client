import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import ContentBuilder from 'src/content/app/custom-download/components/content-builder/ContentBuilder';

import {
  getSelectedFilters,
  getContentState
} from '../../state/filterAccordionSelector';

import {
  updateSelectedFilters,
  updateContentState
} from '../../state/filterAccordionActions';

import set from 'lodash/set';
import unset from 'lodash/unset';
import JSONValue, { PrimitiveOrArrayValue } from 'src/shared/types/JSON';
import allFilters from 'src/content/app/custom-download/sample-data/filters';
import { AttributeWithContent } from 'src/content/app/custom-download/types/Attributes';

type Props = StateProps & DispatchProps;

const Proteins = (props: Props) => {
  useEffect(() => {}, [props.selectedFilters]);

  const filtersOnChange = (
    type: string,
    path: (string | number)[],
    payload: PrimitiveOrArrayValue
  ) => {
    const updatedFilters = { ...props.selectedFilters };
    payload ? set(updatedFilters, path, payload) : unset(updatedFilters, path);

    props.updateSelectedFilters(updatedFilters);
  };

  const onContentStateChangeHandler = (
    type: string,
    path: (string | number)[],
    payload: PrimitiveOrArrayValue
  ) => {
    const updatedContentState = { ...props.contentState };
    payload
      ? set(updatedContentState, path, payload)
      : unset(updatedContentState, path);

    props.updateContentState(updatedContentState);
  };

  const content = allFilters['proteins'] as AttributeWithContent;
  return (
    <div>
      <ContentBuilder
        data={content}
        onChange={filtersOnChange}
        contentState={props.contentState}
        onContentStateChange={onContentStateChangeHandler}
        selectedData={props.selectedFilters}
      />
    </div>
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
)(Proteins);
