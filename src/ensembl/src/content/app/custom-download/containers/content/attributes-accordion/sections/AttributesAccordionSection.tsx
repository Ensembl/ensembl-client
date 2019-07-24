import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import { AttributeWithContent } from 'src/content/app/custom-download/types/Attributes';

import {
  getSelectedAttributes,
  getContentState
} from 'src/content/app/custom-download/containers/content/attributes-accordion/state/attributesAccordionSelector';

import {
  updateSelectedAttributes,
  updateContentState
} from 'src/content/app/custom-download/containers/content/attributes-accordion/state/attributesAccordionActions';

import ContentBuilder from 'src/content/app/custom-download/components/content-builder/ContentBuilder';

import set from 'lodash/set';

import allAttributes from 'src/content/app/custom-download/sample-data/attributes';
import JSONValue, { PrimitiveOrArrayValue } from 'src/shared/types/JSON';

type ownProps = {
  hideUnchecked?: boolean;
  hideTitles?: boolean;
  section: string;
};

type Props = ownProps & StateProps & DispatchProps;

const AttributesAccordionSection = (props: Props) => {
  const onChangeHandler = (
    type: string,
    path: (string | number)[],
    payload: PrimitiveOrArrayValue
  ) => {
    const updatedAttributes = { ...props.selectedAttributes };
    set(updatedAttributes, path, payload);

    props.updateSelectedAttributes(updatedAttributes);
  };

  const onContentStateChangeHandler = (
    type: string,
    path: (string | number)[],
    payload: PrimitiveOrArrayValue
  ) => {
    const updatedContentState = { ...props.contentState };
    set(updatedContentState, path, payload);

    props.updateContentState(updatedContentState);
  };

  return (
    <ContentBuilder
      data={allAttributes[props.section] as AttributeWithContent}
      onChange={onChangeHandler}
      contentState={props.contentState}
      onContentStateChange={onContentStateChangeHandler}
      selectedData={props.selectedAttributes}
      contentProps={{ checkbox_grid: { hideUnchecked: props.hideUnchecked } }}
    />
  );
};

type DispatchProps = {
  updateSelectedAttributes: (updateSelectedAttributes: JSONValue) => void;
  updateContentState: (updateContentState: JSONValue) => void;
};

const mapDispatchToProps: DispatchProps = {
  updateSelectedAttributes,
  updateContentState
};

type StateProps = {
  selectedAttributes: JSONValue;
  contentState: JSONValue;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedAttributes: getSelectedAttributes(state),
  contentState: getContentState(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttributesAccordionSection);
