import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import Attributes, {
  AttributeWithContent
} from 'src/content/app/custom-download/types/Attributes';

import {
  getAttributes,
  getSelectedAttributes,
  getContentState
} from 'src/content/app/custom-download/containers/content/attributes-accordion/state/attributesAccordionSelector';

import {
  updateSelectedAttributes,
  updateContentState
} from 'src/content/app/custom-download/containers/content/attributes-accordion/state/attributesAccordionActions';

import ContentBuilder from 'src/content/app/custom-download/components/content-builder/ContentBuilder';

import JSONValue from 'src/shared/types/JSON';

type ownProps = {
  hideUnchecked?: boolean;
  hideTitles?: boolean;
  section: string;
};

type Props = ownProps & StateProps & DispatchProps;

const AttributesAccordionSection = (props: Props) => {
  return (
    <ContentBuilder
      data={props.attributes[props.section] as AttributeWithContent}
      onChange={props.updateSelectedAttributes}
      contentState={props.contentState}
      onContentStateChange={props.updateContentState}
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
  attributes: Attributes;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedAttributes: getSelectedAttributes(state),
  contentState: getContentState(state),
  attributes: getAttributes(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttributesAccordionSection);
