import React, { useCallback, FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { RoundButton, RoundButtonStatus, PrimaryButton } from 'src/shared';
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
        <RoundButton
          onClick={() => {
            filterOnClick('genes');
          }}
          status={
            props.selectedPreFilter === 'Genes/Transcripts'
              ? RoundButtonStatus.ACTIVE
              : RoundButtonStatus.INACTIVE
          }
          classNames={styles}
        >
          Genes
        </RoundButton>
        <RoundButton
          onClick={() => {
            filterOnClick('variation');
          }}
          status={
            props.selectedPreFilter === 'variation'
              ? RoundButtonStatus.ACTIVE
              : RoundButtonStatus.INACTIVE
          }
          classNames={styles}
        >
          Variation
        </RoundButton>
        <RoundButton
          onClick={() => {
            filterOnClick('phenotypes');
          }}
          status={
            props.selectedPreFilter === 'phenotypes'
              ? RoundButtonStatus.ACTIVE
              : RoundButtonStatus.INACTIVE
          }
          classNames={styles}
        >
          Phenotypes
        </RoundButton>
        <RoundButton
          onClick={() => {
            filterOnClick('regulation');
          }}
          status={
            props.selectedPreFilter === 'regulation'
              ? RoundButtonStatus.ACTIVE
              : RoundButtonStatus.INACTIVE
          }
          classNames={styles}
        >
          Regulation
        </RoundButton>

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
