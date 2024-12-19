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

import { FormEvent, useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton
} from 'src/shared/components/button/Button';
import { useAppDispatch, useAppSelector } from 'src/store';
import {
  BiomartJob,
  setJob,
  setPreviewRunOpen
} from 'src/content/app/tools/biomart/state/biomartSlice';
import {
  columnSelectionData,
  filterData,
  selectedColumnsCount
  // selectedFiltersCount
} from 'src/content/app/tools/biomart/state/biomartSelectors';
import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';
import { useNavigate } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { useBiomartRunMutation } from 'src/content/app/tools/biomart/state/biomartApiSlice';

import styles from './BiomartSettings.module.css';

// const RUN_MODES = [
//   {
//     value: 'local',
//     label: 'local'
//   }
// ];

const DOWNLOAD_FORMATS = [
  {
    value: 'output_csv_gz',
    label: 'CSV gzip compressed'
  },
  {
    value: 'output_csv_zst',
    label: 'CSV Zstandard compressed'
  }
];

const BiomartSettings = () => {
  const [downloadFormat, setDownloadFormat] = useState(
    DOWNLOAD_FORMATS[0].value
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedSpecies = useAppSelector(
    (state) => state.biomart.general.selectedSpecies
  );
  const previewRunOpen = useAppSelector(
    (state) => state.biomart.general.previewRunOpen
  );
  const columnsSelectedCount = useAppSelector(selectedColumnsCount);
  // const filtersSelectedCount = useAppSelector(selectedFiltersCount);
  const columnsData = useAppSelector(columnSelectionData);
  const filtersData = useAppSelector(filterData);
  const jobs = useAppSelector((state) => state.biomart.general.jobs);

  const [biomartRun] = useBiomartRunMutation();

  const openPreviewRun = () => {
    dispatch(setPreviewRunOpen(true));
  };

  const getSelectedColumnAttributes = () => {
    return columnsData
      .flatMap((column) => column.options)
      .filter((option) => option.checked)
      .map((option) => option.name);
  };

  const getProvidedFilters = () => {
    const filters = [];

    if (
      filtersData.gene.gene_stable_id &&
      filtersData.gene.gene_stable_id.output.length > 0
    ) {
      filters.push({
        filter_gene_stable_id: filtersData.gene.gene_stable_id.output[0]
      });
    }

    if (
      filtersData.gene.transcript_stable_id &&
      filtersData.gene.transcript_stable_id.output.length > 0
    ) {
      filters.push({
        filter_transcript_stable_id:
          filtersData.gene.transcript_stable_id.output[0]
      });
    }

    return filters;
  };

  const onBiomartRun = async () => {
    if (!selectedSpecies) {
      return;
    }

    const payload = {
      attribs: getSelectedColumnAttributes(),
      filters: getProvidedFilters(),
      genome_uuid: selectedSpecies.genome_id,
      limit: 0,
      output: {
        name: downloadFormat
      }
    };

    const result = await biomartRun(payload).unwrap();

    const job: BiomartJob = {
      id: result.taskid,
      status: 'SUBMITTED',
      format: downloadFormat,
      species: selectedSpecies,
      columns: columnsData,
      filters: filtersData,
      timestamp: new Date().toISOString(),
      result_location: ''
    };

    dispatch(setJob(job));
    navigate(urlFor.biomartJobs());
  };

  const navigateToJobsPage = () => {
    navigate(urlFor.biomartJobs());
  };

  const changeDownloadFormat = (event: FormEvent<HTMLSelectElement>) => {
    setDownloadFormat(event.currentTarget.value);
  };

  // const isPreviewRunButtonActive = columnsSelectedCount !== 0 && filtersSelectedCount !== 0;
  const isPreviewRunButtonActive = columnsSelectedCount !== 0;

  return (
    <div className={styles.topLevelContainer}>
      <div className={styles.topLevel}>
        <div>
          <h1 className={styles.title}>Biomart</h1>
        </div>
      </div>
      <div>
        {selectedSpecies && !previewRunOpen && (
          <div className={styles.biomartToolbarButtons}>
            <div>
              <SecondaryButton
                onClick={openPreviewRun}
                className={
                  !isPreviewRunButtonActive ? styles.buttonDisabled : ''
                }
                disabled={!isPreviewRunButtonActive}
              >
                Preview Run
              </SecondaryButton>
            </div>
            <div>
              <SecondaryButton
                onClick={navigateToJobsPage}
                className={jobs.length === 0 ? styles.buttonDisabled : ''}
                disabled={jobs.length === 0}
              >
                Jobs
              </SecondaryButton>
            </div>
          </div>
        )}
        {previewRunOpen && (
          <div className={styles.previewRunButton}>
            {/* <div className={styles.biomartToolbarOptions}>
              <label>
                <span>Run mode</span>
                <SimpleSelect
                  value={RUN_MODES[0].label}
                  onInput={() => {}}
                  options={RUN_MODES}
                />
              </label>
            </div> */}
            <div className={styles.biomartToolbarOptions}>
              <label>
                <span>Download as</span>
                <SimpleSelect
                  value={downloadFormat}
                  options={DOWNLOAD_FORMATS}
                  onChange={changeDownloadFormat}
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
