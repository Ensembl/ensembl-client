import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import RoundButton, {
  RoundButtonStatus
} from 'src/shared/round-button/RoundButton';
import BadgedButton from 'src/shared/badged-button/BadgedButton';

import { getSelectedTab } from '../../../state/customDownloadSelectors';

import { getSelectedAttributes } from '../attributes-accordion/state/attributesAccordionSelector';
import { getSelectedFilters } from '../filter-accordion/state/filterAccordionSelector';

import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';

import { toggleTab } from '../../../state/customDownloadActions';
import { RootState } from 'src/store';

import styles from './TabButtons.scss';

type Props = StateProps & DispatchProps;
type Attribute = {
  [key: string]: boolean;
};
type SelectedAttributes = {
  [key: string]: boolean | Attribute;
};

type Filter = {
  [key: string]: boolean;
};
type SelectedFilters = {
  [key: string]: boolean | string | string[] | Filter;
};

const getTotalSelectedAttributes = (
  attributes: SelectedAttributes,
  totalSelectedAttributes: number = 0
) => {
  Object.keys(attributes).forEach((key) => {
    if (typeof attributes[key] === 'boolean' && attributes[key] === true) {
      totalSelectedAttributes++;
    } else if (typeof attributes[key] === 'object') {
      totalSelectedAttributes = getTotalSelectedAttributes(
        attributes[key] as SelectedAttributes,
        totalSelectedAttributes
      );
    }
  });

  return totalSelectedAttributes;
};

const getTotalSelectedFilters = (
  filters: SelectedFilters,
  totalSelectedFilters: number = 0
) => {
  if (!filters) {
    return 0;
  }
  Object.keys(filters).forEach((key: string) => {
    if (key === 'preExpanded') {
      // Skip preExpanded keys
    } else if (typeof filters[key] === 'boolean' && filters[key] === true) {
      totalSelectedFilters++;
    } else if (typeof filters[key] === 'string' && filters[key] !== '') {
      totalSelectedFilters++;
    } else if (
      Array.isArray(filters[key]) &&
      (filters[key] as string[]).length > 0
    ) {
      totalSelectedFilters++;
    } else if (typeof filters[key] === 'object') {
      totalSelectedFilters = getTotalSelectedFilters(
        filters[key] as SelectedFilters,
        totalSelectedFilters
      );
    }
  });

  return totalSelectedFilters;
};

const TabButtons = (props: Props) => {
  useEffect(() => {
    const selectedTab = customDownloadStorageService.getSelectedTab();
    if (selectedTab && props.selectedTab !== selectedTab) {
      props.toggleTab(selectedTab);
    }
  }, [props.selectedAttributes]);

  const dataButtonStatus =
    props.selectedTab === 'attributes'
      ? RoundButtonStatus.ACTIVE
      : RoundButtonStatus.INACTIVE;
  const filterButtonStatus =
    props.selectedTab === 'filter'
      ? RoundButtonStatus.ACTIVE
      : RoundButtonStatus.INACTIVE;
  return (
    <div className={`${styles.wrapper}`}>
      <div>
        <BadgedButton
          badgeContent={getTotalSelectedAttributes(props.selectedAttributes)}
        >
          <RoundButton
            onClick={() => {
              props.toggleTab('attributes');
            }}
            status={dataButtonStatus}
          >
            Data to download
          </RoundButton>
        </BadgedButton>
      </div>

      <div className={`${styles.buttonPadding}`}>
        <BadgedButton
          badgeContent={getTotalSelectedFilters(props.selectedFilters)}
        >
          <RoundButton
            onClick={() => {
              props.toggleTab('filter');
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
  toggleTab: (toggleTab: string) => void;
};

const mapDispatchToProps: DispatchProps = {
  toggleTab
};

type StateProps = {
  selectedTab: string;
  selectedAttributes: {};
  selectedFilters: {};
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedTab: getSelectedTab(state),
  selectedAttributes: getSelectedAttributes(state),
  selectedFilters: getSelectedFilters(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabButtons);
