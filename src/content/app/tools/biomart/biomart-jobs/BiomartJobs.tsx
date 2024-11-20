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

import ToolsTopBar from 'src/content/app/tools/shared/components/tools-top-bar/ToolsTopBar';
import BiomartAppBar from 'src/content/app/tools/biomart/biomart-app-bar/BiomartAppBar';
import BiomartJobsNavigation from 'src/content/app/tools/biomart/biomart-jobs/BiomartJobsNavigation';
import { useAppDispatch, useAppSelector } from 'src/store';

import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import * as urlFor from 'src/shared/helpers/urlHelper';

import styles from './BiomartJobs.module.css';
import {
  BiomartJob,
  setColumnSelectionData,
  setFilterData,
  setPreviewRunOpen,
  setSelectedSpecies,
  setTab
} from '../state/biomartSlice';
import { useEffect } from 'react';

const BiomartJobs = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const jobs = useAppSelector((state) => state.biomart.general.jobs);

  useEffect(() => {
    if (jobs.length === 0) {
      navigate(urlFor.biomartForm());
    }
  }, []);

  const biomartRerun = (job: BiomartJob) => {
    dispatch(setColumnSelectionData(job.columns));
    dispatch(setFilterData(job.filters));
    dispatch(setPreviewRunOpen(false));
    dispatch(setTab('tables'));
    dispatch(setSelectedSpecies(job.species));
    navigate(urlFor.biomartForm());
  };

  return (
    <div>
      <BiomartAppBar />
      <ToolsTopBar>
        <BiomartJobsNavigation />
      </ToolsTopBar>
      {jobs.map((job) => {
        return (
          <div key={job.id}>
            <div className={styles.biomartJobContainer}>
              <div className={styles.biomartJobsGrid}>
                <div className={styles.light}>Ensembl Biomart query</div>
                <div>
                  <span className={styles.light}>Job </span>
                  {job.id}
                </div>
                <div>
                  <span
                    className={styles.rerun}
                    onClick={() => biomartRerun(job)}
                  >
                    Edit/Rerun
                  </span>
                </div>
                <div>
                  <span className={styles.light}>{job.timestamp} </span>GMT
                </div>
              </div>
            </div>
            <div className={styles.biomartJobContainer}>
              <div className={classNames(styles.body, styles.bodyAccepted)}>
                <div>
                  {job.species.common_name} {job.species.genome_tag}
                </div>
                <div>{job.status}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BiomartJobs;
