import React, { useCallback, FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { RoundButton, RoundButtonStatus, PrimaryButton } from 'src/shared';
import { getPreFilterStatuses } from '../../customDownloadSelectors';
import {
  updateSelectedPreFilters,
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
      const currentStatus = { ...props.preFilterStatuses };

      currentStatus[filter] !== RoundButtonStatus.ACTIVE
        ? (currentStatus[filter] = RoundButtonStatus.ACTIVE)
        : (currentStatus[filter] = RoundButtonStatus.INACTIVE);

      props.updateSelectedPreFilters(currentStatus);
    },
    [props.preFilterStatuses]
  );

  // Check if atleast one filter is selected
  const selectedFilters = Object.keys(props.preFilterStatuses).filter(
    (key: string) => {
      return props.preFilterStatuses[key] === RoundButtonStatus.ACTIVE
        ? true
        : false;
    }
  );

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
          status={props.preFilterStatuses.genes}
          classNames={styles}
        >
          Genes
        </RoundButton>
        <RoundButton
          onClick={() => {
            filterOnClick('transcripts');
          }}
          status={props.preFilterStatuses.transcripts}
          classNames={styles}
        >
          Transcripts
        </RoundButton>
        <RoundButton
          onClick={() => {
            filterOnClick('variation');
          }}
          status={props.preFilterStatuses.variation}
          classNames={styles}
        >
          Variation
        </RoundButton>
        <RoundButton
          onClick={() => {
            filterOnClick('phenotypes');
          }}
          status={props.preFilterStatuses.phenotypes}
          classNames={styles}
        >
          Phenotypes
        </RoundButton>
        <RoundButton
          onClick={() => {
            filterOnClick('regulation');
          }}
          status={props.preFilterStatuses.regulation}
          classNames={styles}
        >
          Regulation
        </RoundButton>

        <PrimaryButton
          onClick={onSubmitHandler}
          className={styles.primaryButton}
          isDisabled={selectedFilters.length ? false : true}
        >
          Next
        </PrimaryButton>
      </div>
    </section>
  );
};

type DispatchProps = {
  updateSelectedPreFilters: (updateSelectedPreFilters: {}) => void;
  togglePreFiltersPanel: (togglePreFiltersPanel: boolean) => void;
};

const mapDispatchToProps: DispatchProps = {
  updateSelectedPreFilters,
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
)(PreFilterPanel);
