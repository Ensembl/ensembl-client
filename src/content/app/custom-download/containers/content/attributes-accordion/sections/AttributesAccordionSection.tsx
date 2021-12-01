/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
  hideTitles?: boolean;
  section: string;
  showOverview?: boolean;
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
      showOverview={props.showOverview}
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
