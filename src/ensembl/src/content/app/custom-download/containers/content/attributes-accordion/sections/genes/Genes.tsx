import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import AttributesSection from 'src/content/app/custom-download/types/Attributes';

import {
  getSelectedAttributes,
  getContentState
} from '../../state/attributesAccordionSelector';
import {
  updateSelectedAttributes,
  updateContentState
} from '../../state/attributesAccordionActions';

import ContentBuilder from 'src/content/app/custom-download/components/content-builder/ContentBuilder';

import set from 'lodash/set';
import unset from 'lodash/unset';

import allAttributes from 'src/content/app/custom-download/sample-data/attributes';

type ownProps = {
  hideUnchecked?: boolean;
  hideTitles?: boolean;
};

type Props = ownProps & StateProps & DispatchProps;

const Genes = (props: Props) => {
  const onChangeHandler = (
    type: string,
    path: (string | number)[],
    payload: any
  ) => {
    const updatedAttributes = { ...props.selectedAttributes };
    payload
      ? set(updatedAttributes, path, payload)
      : unset(updatedAttributes, path);

    props.updateSelectedAttributes(updatedAttributes);
  };

  const onContentStateChangeHandler = (
    type: string,
    path: (string | number)[],
    payload: any
  ) => {
    const updatedContentState = { ...props.contentState };
    payload
      ? set(updatedContentState, path, payload)
      : unset(updatedContentState, path);

    props.updateContentState(updatedContentState);
  };

  if (props.hideUnchecked) {
    if (!allAttributes['genes']) {
      return null;
    }

    return (
      <ContentBuilder
        data={allAttributes['genes']}
        onChange={onChangeHandler}
        contentState={props.contentState}
        onContentStateChange={onContentStateChangeHandler}
        selectedData={props.selectedAttributes}
        contentProps={{ checkbox_grid: { hideUnchecked: true } }}
      />
    );
  }

  return (
    <ContentBuilder
      data={allAttributes['genes']}
      onChange={onChangeHandler}
      contentState={props.contentState}
      onContentStateChange={onContentStateChangeHandler}
      selectedData={props.selectedAttributes}
    />
  );
};

type DispatchProps = {
  updateSelectedAttributes: (updateSelectedAttributes: {}) => void;
  updateContentState: (updateContentState: {}) => void;
};

const mapDispatchToProps: DispatchProps = {
  updateSelectedAttributes,
  updateContentState
};

type StateProps = {
  selectedAttributes: AttributesSection;
  contentState: {};
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedAttributes: getSelectedAttributes(state),
  contentState: getContentState(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Genes);
