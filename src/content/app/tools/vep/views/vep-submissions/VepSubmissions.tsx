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

import { useAppSelector } from 'src/store';

import { getUnviewedVepSubmissions } from 'src/content/app/tools/vep/state/vep-submissions/vepSubmissionsSelectors';

import ListedVepSubmission from './listed-vep-submission/ListedVepSubmission';

import styles from './VepSubmissions.module.css';

const VepSubmissions = () => {
  const unviewedVepSubmissions = useAppSelector(getUnviewedVepSubmissions);

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.container}>
        {unviewedVepSubmissions.map((submission) => (
          <ListedVepSubmission key={submission.id} submission={submission} />
        ))}
      </div>
    </div>
  );
};

export default VepSubmissions;
