import React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import { getLocationAttributes } from '../../state/attributesAccordionSelector';
import { setLocationAttributes } from '../../state/attributesAccordionActions';
import CheckboxGrid, {
  filterCheckedAttributes
} from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

import AttributesSection from 'src/content/app/custom-download/types/Attributes';

import styles from './Location.scss';

type ownProps = {
  hideUnchecked?: boolean;
  hideTitles?: boolean;
};

type Props = ownProps & StateProps & DispatchProps;

const Location = (props: Props) => {
  const onChangeHandler = (
    status: boolean,
    subSection: string,
    attributeId: string
  ) => {
    if (!props.locationAttributes) {
      return;
    }
    const newLocationAttributes = { ...props.locationAttributes };

    newLocationAttributes[subSection][attributeId].isChecked = status;

    props.setLocationAttributes(newLocationAttributes);
  };

  if (props.hideUnchecked) {
    if (!props.locationAttributes) {
      return null;
    }
    const checkedAttributes = filterCheckedAttributes(props.locationAttributes);

    if (Object.keys(checkedAttributes).length === 0) {
      return null;
    }

    return (
      <div className={styles.checkboxGridWrapper}>
        <CheckboxGrid
          checkboxOnChange={onChangeHandler}
          gridData={checkedAttributes}
          hideTitles={props.hideTitles}
          columns={3}
        />
      </div>
    );
  }

  return (
    <div className={styles.checkboxGridWrapper}>
      <CheckboxGrid
        checkboxOnChange={onChangeHandler}
        gridData={props.locationAttributes}
        hideTitles={props.hideTitles}
        columns={3}
      />
    </div>
  );
};

type DispatchProps = {
  setLocationAttributes: (setLocationAttributes: {}) => void;
};

const mapDispatchToProps: DispatchProps = {
  setLocationAttributes
};

type StateProps = {
  locationAttributes: AttributesSection;
};

const mapStateToProps = (state: RootState): StateProps => ({
  locationAttributes: getLocationAttributes(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Location);
