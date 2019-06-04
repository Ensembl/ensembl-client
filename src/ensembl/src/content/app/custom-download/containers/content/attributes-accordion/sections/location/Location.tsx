import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';

import { getLocationAttributes } from '../../attributesAccordionSelector';
import { setLocationAttributes } from '../../attributesAccordionActions';
import CheckBoxGrid, {
  filterCheckedAttributes
} from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

import styles from './Location.scss';

type ownProps = {
  hideUnchecked?: boolean;
  hideTitles?: boolean;
};

type Props = ownProps & StateProps & DispatchProps;

const Location = (props: Props) => {
  const onChangeHandler = useCallback(
    (status: boolean, subSection: string, attributeId: string) => {
      if (!props.locationAttributes) {
        return;
      }
      const newLocationAttributes = { ...props.locationAttributes };

      newLocationAttributes[subSection][attributeId].checkedStatus = status;

      props.setLocationAttributes(newLocationAttributes);
    },
    [props.locationAttributes]
  );

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
  locationAttributes: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  locationAttributes: getLocationAttributes(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Location);
