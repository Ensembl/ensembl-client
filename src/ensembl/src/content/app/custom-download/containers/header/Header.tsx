import React from 'react';
import { connect } from 'react-redux';
import { RoundButton, RoundButtonStatus, SecondaryButton } from 'src/shared';
import { RootState } from 'src/store';

import { getPreFilterStatuses } from '../../customDownloadSelectors';
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
        {Object.keys(props.preFilterStatuses).map((filter, key) => {
          return (
            <RoundButton
              key={key}
              onClick={filterOnClick}
              status={RoundButtonStatus.ACTIVE}
              classNames={styles}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </RoundButton>
          );
        })}
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
  preFilterStatuses: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  preFilterStatuses: getPreFilterStatuses(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
