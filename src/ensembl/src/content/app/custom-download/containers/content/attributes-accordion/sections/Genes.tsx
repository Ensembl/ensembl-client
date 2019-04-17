import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import { getGeneAttributes } from 'src/content/app/custom-download/customDownloadSelectors';
import { setGeneAttributes } from 'src/content/app/custom-download/customDownloadActions';
import CheckBoxGrid, {
  filterCheckedAttributes
} from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

import styles from './Styles.scss';

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

  if (props.hideUnchecked) {
    const checkedAttributes = filterCheckedAttributes(props.geneAttributes);

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
  geneAttributes: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  geneAttributes: getGeneAttributes(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Genes);
