import React from 'react';
import { connect } from 'react-redux';
import { RoundButton, RoundButtonStatus, SecondaryButton } from 'src/shared';
import { RootState } from 'src/store';

import { getSelectedPreFilter } from '../../customDownloadSelectors';
import { togglePreFiltersPanel } from '../../customDownloadActions';

import styles from './Header.scss';

type Props = StateProps & DispatchProps;

const Header = (props: Props) => {
  const filterOnClick = () => {
    props.togglePreFiltersPanel(true);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.resultCounter}>1234 Results</div>
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
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedPreFilter: getSelectedPreFilter(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
