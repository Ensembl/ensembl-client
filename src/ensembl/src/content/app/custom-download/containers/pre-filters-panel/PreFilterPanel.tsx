import React, { useCallback, FunctionComponent } from 'react';
import { connect } from 'react-redux';
import RoundButton, {
  RoundButtonStatus
} from 'src/shared/round-button/RoundButton';

import { getSelectedPreFilter } from '../../state/customDownloadSelectors';
import {
  updateSelectedPreFilter,
  togglePreFiltersPanel
} from '../../state/customDownloadActions';

import { RootState } from 'src/store';

import styles from './PreFilterPanel.scss';

type PreFilterPanelProps = StateProps & DispatchProps;

const PreFilterPanel: FunctionComponent<PreFilterPanelProps> = (
  props: PreFilterPanelProps
) => {
  const filterOnClick = useCallback(
    (filter: string) => {
      props.updateSelectedPreFilter(filter);
      props.togglePreFiltersPanel(false);
    },
    [props.selectedPreFilter]
  );

  return (
    <section className={styles.preFilterPanel}>
      <div className={styles.panelTitle}>Select pre-filters</div>
      <div className={styles.panelContent}>
        <div className={styles.filterButtons}>
          <RoundButton
            onClick={() => {
              filterOnClick('Genes/Transcripts');
            }}
            status={RoundButtonStatus.INACTIVE}
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
  selectedPreFilter: string;
};

const mapStateToProps = (state: RootState): StateProps => ({
  selectedPreFilter: getSelectedPreFilter(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreFilterPanel);
