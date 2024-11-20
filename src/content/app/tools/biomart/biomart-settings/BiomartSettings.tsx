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

import {
  PrimaryButton,
  SecondaryButton
} from 'src/shared/components/button/Button';
import { useAppDispatch, useAppSelector } from 'src/store';
import { setPreviewRunOpen } from 'src/content/app/tools/biomart/state/biomartSlice';
import {
  selectedColumnsCount,
  selectedFiltersCount
} from 'src/content/app/tools/biomart/state/biomartSelectors';
import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';
import { useNavigate } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import styles from './BiomartSettings.module.css';

const RUN_MODES = [
  {
    value: 'local',
    label: 'local'
  }
];

const DOWNLOAD_FORMATS = [
  {
    value: 'CSV',
    label: 'CSV'
  }
];

const BiomartSettings = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedSpecies = useAppSelector(
    (state) => state.biomart.general.selectedSpecies
  );
  const previewRunOpen = useAppSelector(
    (state) => state.biomart.general.previewRunOpen
  );
  const columnsSelectedCount = useAppSelector(selectedColumnsCount);
  const filtersSelectedCount = useAppSelector(selectedFiltersCount);

  const openPreviewRun = () => {
    dispatch(setPreviewRunOpen(true));
  };

  const onBiomartRun = () => {
    navigate(urlFor.biomartJobs());
  };

  const isPreviewRunButtonActive =
    columnsSelectedCount !== 0 && filtersSelectedCount !== 0;

  return (
    <div className={styles.topLevelContainer}>
      <div className={styles.topLevel}>
        <div>
          <h1 className={styles.title}>Biomart</h1>
        </div>
      </div>
      <div>
        {selectedSpecies && !previewRunOpen && (
          <SecondaryButton
            onClick={openPreviewRun}
            className={!isPreviewRunButtonActive ? styles.buttonDisabled : ''}
            disabled={!isPreviewRunButtonActive}
          >
            Preview Run
          </SecondaryButton>
        )}
        {previewRunOpen && (
          <div className={styles.previewRunButton}>
            <div className={styles.biomartRunMode}>
              <label>
                <span>Run mode</span>
                <SimpleSelect
                  value={RUN_MODES[0].label}
                  onInput={() => {}}
                  options={RUN_MODES}
                />
              </label>
            </div>
            <div className={styles.biomartRunMode}>
              <label>
                <span>Download as</span>
                <SimpleSelect
                  value={DOWNLOAD_FORMATS[0].label}
                  onInput={() => {}}
                  options={DOWNLOAD_FORMATS}
                />
              </label>
            </div>
            <div>
              <PrimaryButton onClick={onBiomartRun}>Run</PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiomartSettings;
