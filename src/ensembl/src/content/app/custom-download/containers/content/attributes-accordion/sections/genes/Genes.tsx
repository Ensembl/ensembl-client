import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import AttributesSection from 'src/content/app/custom-download/types/Attributes';

import { getGeneAttributes } from '../../state/attributesAccordionSelector';
import { setGeneAttributes } from '../../state/attributesAccordionActions';
import CheckboxGrid, {
  filterCheckedAttributes
} from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

import styles from './Genes.scss';

type ownProps = {
  hideUnchecked?: boolean;
  hideTitles?: boolean;
};

type Props = ownProps & StateProps & DispatchProps;

const Genes = (props: Props) => {
  const onChangeHandler = (
    status: boolean,
    subSection: string,
    attributeId: string
  ) => {
    if (!props.geneAttributes) {
      return;
    }
    const newGeneAttributes = { ...props.geneAttributes };

    newGeneAttributes[subSection][attributeId].isChecked = status;

    props.setGeneAttributes(newGeneAttributes);
  };

  if (props.hideUnchecked) {
    if (!props.geneAttributes) {
      return null;
    }
    const checkedAttributes = filterCheckedAttributes(props.geneAttributes);

    if (Object.keys(checkedAttributes).length === 0) {
      return null;
    }

    return (
      <div className={styles.checkboxGridWrapper}>
        <CheckboxGrid
          checkboxOnChange={onChangeHandler}
          gridData={checkedAttributes}
          hideTitles={false}
          columns={3}
        />
      </div>
    );
  }

  return (
    <div className={styles.checkboxGridWrapper}>
      <CheckboxGrid
        checkboxOnChange={onChangeHandler}
        gridData={props.geneAttributes}
        hideTitles={props.hideTitles}
        columns={3}
      />
    </div>
  );
};

type DispatchProps = {
  setGeneAttributes: (setGeneAttributes: {}) => void;
};

const mapDispatchToProps: DispatchProps = {
  setGeneAttributes
};

type StateProps = {
  geneAttributes: AttributesSection;
};

const mapStateToProps = (state: RootState): StateProps => ({
  geneAttributes: getGeneAttributes(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Genes);
