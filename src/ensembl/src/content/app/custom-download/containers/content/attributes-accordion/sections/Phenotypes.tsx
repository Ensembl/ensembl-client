import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import { getPhenotypeAttributes } from '../attributesAccordionSelector';
import { setPhenotypeAttributes } from '../attributesAccordionActions';
import CheckBoxGrid, {
  filterCheckedAttributes
} from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

import styles from './Styles.scss';

type OwnProps = {
  hideUnchecked?: boolean;
  hideTitles?: boolean;
};

type Props = OwnProps & StateProps & DispatchProps;

const Phenotypes = (props: Props) => {
  const onChangeHandler = useCallback(
    (status: boolean, subSection: string, attributeId: string) => {
      if (!props.phenotypeAttributes) {
        return;
      }

      const newPhenotypeAttributes = { ...props.phenotypeAttributes };

      newPhenotypeAttributes[subSection][attributeId].checkedStatus = status;

      props.setPhenotypeAttributes(newPhenotypeAttributes);
    },
    [props.phenotypeAttributes]
  );

  if (props.hideUnchecked) {
    if (!props.phenotypeAttributes) {
      return null;
    }
    const checkedAttributes = filterCheckedAttributes(
      props.phenotypeAttributes
    );

    if (Object.keys(checkedAttributes).length === 0) {
      return null;
    }

    return (
      <div className={styles.checkboxGridWrapper}>
        <CheckBoxGrid
          checkboxOnChange={onChangeHandler}
          gridData={{ default: checkedAttributes }}
          hideTitles={props.hideTitles}
          columns={3}
        />
      </div>
    );
  }

  return (
    <div className={styles.checkboxGridWrapper}>
      <CheckBoxGrid
        checkboxOnChange={onChangeHandler}
        gridData={props.phenotypeAttributes}
        hideTitles={props.hideTitles}
        columns={3}
      />
    </div>
  );
};

type DispatchProps = {
  setPhenotypeAttributes: (setPhenotypeAttributes: any) => void;
};

const mapDispatchToProps: DispatchProps = {
  setPhenotypeAttributes
};

type StateProps = {
  phenotypeAttributes: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  phenotypeAttributes: getPhenotypeAttributes(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Phenotypes);
