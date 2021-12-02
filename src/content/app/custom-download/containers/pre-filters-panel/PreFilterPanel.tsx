/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import RoundButton, {
  RoundButtonStatus
} from 'src/shared/components/round-button/RoundButton';

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
  const filterOnClick = (filter: string) => {
    props.updateSelectedPreFilter(filter);
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

export default connect(mapStateToProps, mapDispatchToProps)(PreFilterPanel);
