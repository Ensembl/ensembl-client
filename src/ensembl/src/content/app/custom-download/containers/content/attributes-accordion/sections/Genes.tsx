import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import { getGeneAttributes } from 'src/content/app/custom-download/customDownloadSelectors';
import { setGeneAttributes } from 'src/content/app/custom-download/customDownloadActions';
import CheckBoxGrid from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

type ownProps = {
  hideUnchecked?: boolean;
  hideTitles?: boolean;
};

type Props = ownProps & StateProps & DispatchProps;

const Genes = (props: Props) => {
  if (!props.geneAttributes) {
    return null;
  }

  const onChangeHandler = useCallback(
    (status: boolean, subSection: string, attributeId: string) => {
      const newGeneAttributes = { ...props.geneAttributes };

      newGeneAttributes[subSection][attributeId].checkedStatus = status;

      props.setGeneAttributes(newGeneAttributes);
    },
    [props.geneAttributes]
  );

  return (
    <CheckBoxGrid
      checkboxOnChange={onChangeHandler}
      gridData={props.geneAttributes}
      hideUnchecked={props.hideUnchecked}
      hideTitles={props.hideTitles}
      columns={3}
    />
  );
};

type DispatchProps = {
  setGeneAttributes: (setGeneAttributes: {}) => void;
};

const mapDispatchToProps: DispatchProps = {
  setGeneAttributes
};

type StateProps = {
  geneAttributes: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  geneAttributes: getGeneAttributes(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Genes);
