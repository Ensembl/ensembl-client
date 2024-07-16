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

import classNames from 'classnames';

import type { VepSubmissionWithoutInputFile } from 'src/content/app/tools/vep/types/vepSubmission';

import styles from './ListedVepSubmission.module.css';

type Props = {
  submission: VepSubmissionWithoutInputFile;
};

const ListedVepSubmission = (props: Props) => {
  const { submission } = props;

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <div className={styles.light}>Vep analysis</div>
        <div>
          <span className={classNames(styles.labelLeft, styles.smallLight)}>
            Submission
          </span>
          {submission.id}
        </div>
      </div>
      <div className={styles.body}>
        <div>{submission.species?.common_name}</div>
      </div>
    </div>
  );
};

export default ListedVepSubmission;
