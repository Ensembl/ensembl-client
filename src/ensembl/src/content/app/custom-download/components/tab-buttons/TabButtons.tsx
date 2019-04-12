import React from 'react';
import { connect } from 'react-redux';
import { BadgedButton, RoundButton, RoundButtonStatus } from 'src/shared';
import { getSelectedTabButton } from '../../customDownloadSelectors';
import { toggleTabButton } from '../../customDownloadActions';
import { RootState } from 'src/store';

import styles from './TabButtons.scss';

type Props = StateProps & DispatchProps;

const TabButtons = (props: Props) => {
  const dataButtonStatus =
    props.selectedTabButton === 'data'
      ? RoundButtonStatus.ACTIVE
      : RoundButtonStatus.INACTIVE;
  const filterButtonStatus =
    props.selectedTabButton === 'filter'
      ? RoundButtonStatus.ACTIVE
      : RoundButtonStatus.INACTIVE;
  return (
    <div className={styles.wrapper}>
      <div>
        <BadgedButton badgeContent={3}>
          <RoundButton
            onClick={() => {
              props.toggleTabButton('data');
            }}
            status={dataButtonStatus}
          >
            Data to download
          </RoundButton>
        </BadgedButton>
      </div>

      <div className={styles.buttonPadding}>
        <RoundButton
          onClick={() => {
            props.toggleTabButton('filter');
          }}
          status={filterButtonStatus}
        >
          Filter results
        </RoundButton>
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
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedTabButton: getSelectedTabButton(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabButtons);
