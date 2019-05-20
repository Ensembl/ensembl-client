import React from 'react';
import { connect } from 'react-redux';
import { BadgedButton, RoundButton, RoundButtonStatus } from 'src/shared';
import { getSelectedTabButton } from '../../../customDownloadSelectors';

import { getAttributes } from '../attributes-accordion/attributesAccordionSelector';
import { getFilters } from '../filter-accordion/filterAccordionSelector';

import { toggleTabButton } from '../../../customDownloadActions';
import { RootState } from 'src/store';

import styles from './TabButtons.scss';

type Props = StateProps & DispatchProps;

const getTotalSelectedAttributes = (attributes: any) => {
  let totalSelectedAttributes = 0;

  Object.keys(attributes).forEach((section) => {
    Object.keys(attributes[section]).forEach((subSection) => {
      Object.keys(attributes[section][subSection]).forEach((attributeId) => {
        if (
          attributes[section][subSection][attributeId].checkedStatus === true
        ) {
          totalSelectedAttributes++;
        }
      });
    });
  });

  return totalSelectedAttributes;
};

const TabButtons = (props: Props) => {
  const dataButtonStatus =
    props.selectedTabButton === 'attributes'
      ? RoundButtonStatus.ACTIVE
      : RoundButtonStatus.INACTIVE;
  const filterButtonStatus =
    props.selectedTabButton === 'filter'
      ? RoundButtonStatus.ACTIVE
      : RoundButtonStatus.INACTIVE;
  return (
    <div className={styles.wrapper}>
      <div>
        <BadgedButton
          badgeContent={getTotalSelectedAttributes(props.attributes)}
        >
          <RoundButton
            onClick={() => {
              props.toggleTabButton('attributes');
            }}
            status={dataButtonStatus}
          >
            Data to download
          </RoundButton>
        </BadgedButton>
      </div>

      <div className={styles.buttonPadding}>
        <BadgedButton badgeContent={getTotalSelectedAttributes(props.filters)}>
          <RoundButton
            onClick={() => {
              props.toggleTabButton('filter');
            }}
            status={filterButtonStatus}
          >
            Filter results
          </RoundButton>
        </BadgedButton>
      </div>
    </div>
  );
};

type DispatchProps = {
  toggleTabButton: (toggleTabButton: string) => void;
};

const mapDispatchToProps: DispatchProps = {
  toggleTabButton
};

type StateProps = {
  selectedTabButton: string;
  attributes: {};
  filters: {};
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedTabButton: getSelectedTabButton(state),
  attributes: getAttributes(state),
  filters: getFilters(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabButtons);
