import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import AttributesSection from 'src/content/app/custom-download/types/Attributes';

import { getSelectedAttributes } from '../../state/attributesAccordionSelector';
import { updateSelectedAttributes } from '../../state/attributesAccordionActions';

import ContentBuilder from 'src/content/app/custom-download/components/content-builder/ContentBuilder';

import set from 'lodash/set';

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
    set(updatedAttributes, path, payload);
    props.updateSelectedAttributes(updatedAttributes);
  };

  if (props.hideUnchecked) {
    if (!allAttributes['genes']) {
      return null;
    }

    return (
      <ContentBuilder
        data={allAttributes['genes']}
        onChange={onChangeHandler}
        selectedData={props.selectedAttributes}
        contentProps={{ checkbox_grid: { hideUnchecked: true } }}
      />
    );
  }

  return (
    <ContentBuilder
      data={allAttributes['genes']}
      onChange={onChangeHandler}
      selectedData={props.selectedAttributes}
    />
  );
};

type DispatchProps = {
  updateSelectedAttributes: (updateSelectedAttributes: {}) => void;
};

const mapDispatchToProps: DispatchProps = {
  updateSelectedAttributes
};

type StateProps = {
  selectedAttributes: AttributesSection;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedAttributes: getSelectedAttributes(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Genes);
