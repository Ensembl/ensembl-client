import React from 'react';
import { connect } from 'react-redux';
import { RoundButton, RoundButtonStatus, SecondaryButton } from 'src/shared';
import { RootState } from 'src/store';

import {
  getSelectedPreFilter,
  getPreviewResult
} from '../../customDownloadSelectors';
import { togglePreFiltersPanel } from '../../customDownloadActions';

import styles from './Header.scss';

type Props = StateProps & DispatchProps;

const getFormattedTotal = (total: number) => {
  if (!total) {
    return 0;
  }
  return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const Header = (props: Props) => {
  const filterOnClick = () => {
    props.togglePreFiltersPanel(true);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.resultCounter}>
        {getFormattedTotal(props.previewResult.resultCount)} results
      </div>
      <div className={styles.selectedFilters}>
        <RoundButton
          onClick={filterOnClick}
          status={RoundButtonStatus.ACTIVE}
          classNames={styles}
        >
          {props.selectedPreFilter.charAt(0).toUpperCase() +
            props.selectedPreFilter.slice(1)}
        </RoundButton>
      </div>
      <div className={styles.previewButton}>
        <SecondaryButton onClick={() => {}}>Preview download</SecondaryButton>
      </div>
    </div>
  );
};

type DispatchProps = {
  togglePreFiltersPanel: (togglePreFiltersPanel: boolean) => void;
};

const mapDispatchToProps: DispatchProps = {
  togglePreFiltersPanel
};

type StateProps = {
  selectedPreFilter: string;
  previewResult: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedPreFilter: getSelectedPreFilter(state),
  previewResult: getPreviewResult(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
