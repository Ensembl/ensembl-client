import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import {
  Attributes,
  AttributeWithContent
} from 'src/content/app/custom-download/types/Attributes';

import {
  getAttributes,
  getSelectedAttributes,
  getAttributesUi
} from 'src/content/app/custom-download/state/attributes/attributesSelector';

import {
  updateSelectedAttributes,
  updateUi
} from 'src/content/app/custom-download/state/attributes/attributesActions';

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
      uiState={props.ui}
      onUiChange={props.updateUi}
      selectedData={props.selectedAttributes}
      contentProps={{ checkbox_grid: { hideUnchecked: props.hideUnchecked } }}
    />
  );
};

type DispatchProps = {
  updateSelectedAttributes: (attributes: JSONValue) => void;
  updateUi: (ui: JSONValue) => void;
};

const mapDispatchToProps: DispatchProps = {
  updateSelectedAttributes,
  updateUi
};

type StateProps = {
  selectedAttributes: JSONValue;
  ui: JSONValue;
  attributes: Attributes;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedAttributes: getSelectedAttributes(state),
  ui: getAttributesUi(state),
  attributes: getAttributes(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttributesAccordionSection);
