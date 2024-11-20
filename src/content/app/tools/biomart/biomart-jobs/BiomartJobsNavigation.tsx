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

import { SecondaryButton } from 'src/shared/components/button/Button';
import { useNavigate } from 'react-router-dom';
import * as urlFor from 'src/shared/helpers/urlHelper';

import { useAppDispatch } from 'src/store';

import {
  resetColumnSelectionData,
  resetFilterData,
  setPreviewRunOpen,
  setTab
} from 'src/content/app/tools/biomart/state/biomartSlice';

import styles from './BiomartJobs.module.css';

const BiomartJobsNavigation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const newJob = () => {
    navigate(urlFor.biomartForm());
    dispatch(resetColumnSelectionData());
    dispatch(resetFilterData());
    dispatch(setPreviewRunOpen(false));
    dispatch(setTab('tables'));
  };

  return (
    <div className={styles.topLevelContainer}>
      <div className={styles.topLevel}>
        <div>
          <h1 className={styles.title}>Biomart</h1>
        </div>
      </div>
      <div>
        <SecondaryButton onClick={newJob}>New Job</SecondaryButton>
      </div>
    </div>
  );
};

export default BiomartJobsNavigation;
