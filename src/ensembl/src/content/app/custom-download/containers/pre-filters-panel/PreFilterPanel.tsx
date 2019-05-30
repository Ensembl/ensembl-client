import React, { useCallback, FunctionComponent } from 'react';
import { connect } from 'react-redux';
import RoundButton, {
  RoundButtonStatus
} from 'src/shared/round-button/RoundButton';

import { PrimaryButton } from 'src/shared/button/Button';

import { getSelectedPreFilter } from '../../customDownloadSelectors';
import {
  updateSelectedPreFilter,
  togglePreFiltersPanel
} from '../../customDownloadActions';

import { RootState } from 'src/store';

import styles from './PreFilterPanel.scss';

type PreFilterPanelProps = StateProps & DispatchProps;

const PreFilterPanel: FunctionComponent<PreFilterPanelProps> = (
  props: PreFilterPanelProps
) => {
  const filterOnClick = useCallback(
    (filter: string) => {
      props.updateSelectedPreFilter(filter);
    },
    [props.selectedPreFilter]
  );

  // Check if atleast one filter is selected
  const enableNextButton = !!Object.keys(props.selectedPreFilter).length;

  const onSubmitHandler = () => {
    props.togglePreFiltersPanel(false);
  };

  return (
    <section className={styles.preFilterPanel}>
      <div className={styles.panelTitle}>Select pre-filters</div>
      <div className={styles.panelContent}>
        <div className={styles.filterButtons}>
          <RoundButton
            onClick={() => {
              filterOnClick('Genes/Transcripts');
            }}
            status={
              props.selectedPreFilter === 'Genes/Transcripts'
                ? RoundButtonStatus.ACTIVE
                : RoundButtonStatus.INACTIVE
            }
            classNames={styles}
          >
            Genes/Transcripts
          </RoundButton>
          <RoundButton
            onClick={() => {
              filterOnClick('Variation');
            }}
            status={
              RoundButtonStatus.DISABLED
              // props.selectedPreFilter === 'Variation'
              //   ? RoundButtonStatus.ACTIVE
              //   : RoundButtonStatus.INACTIVE
            }
            classNames={styles}
          >
            Variation
          </RoundButton>
          <RoundButton
            onClick={() => {
              filterOnClick('Phenotypes');
            }}
            status={
              RoundButtonStatus.DISABLED
              // props.selectedPreFilter === 'Phenotypes'
              //   ? RoundButtonStatus.ACTIVE
              //   : RoundButtonStatus.INACTIVE
            }
            classNames={styles}
          >
            Phenotypes
          </RoundButton>
          <RoundButton
            onClick={() => {
              filterOnClick('Regulation');
            }}
            status={
              RoundButtonStatus.DISABLED
              // props.selectedPreFilter === 'Regulation'
              //   ? RoundButtonStatus.ACTIVE
              //   : RoundButtonStatus.INACTIVE
            }
            classNames={styles}
          >
            Regulation
          </RoundButton>
        </div>
        <PrimaryButton
          onClick={onSubmitHandler}
          className={styles.primaryButton}
          isDisabled={enableNextButton ? false : true}
        >
          Next
        </PrimaryButton>
      </div>
    </section>
  );
};

type DispatchProps = {
  updateSelectedPreFilter: (updateSelectedPreFilter: string) => void;
  togglePreFiltersPanel: (togglePreFiltersPanel: boolean) => void;
};

const mapDispatchToProps: DispatchProps = {
  updateSelectedPreFilter,
  togglePreFiltersPanel
};

type StateProps = {
  selectedPreFilter: any;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedPreFilter: getSelectedPreFilter(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreFilterPanel);
