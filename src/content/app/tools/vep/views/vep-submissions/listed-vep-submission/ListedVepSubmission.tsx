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

import VepSubmissionHeader from 'src/content/app/tools/vep/components/vep-submission-header/VepSubmissionHeader';
import SpeciesName from 'src/shared/components/species-name/SpeciesName';
import { CircleLoader } from 'src/shared/components/loader';

import type { VepSubmissionWithoutInputFile } from 'src/content/app/tools/vep/types/vepSubmission';

import styles from './ListedVepSubmission.module.css';

type Props = {
  submission: VepSubmissionWithoutInputFile;
};

const ListedVepSubmission = (props: Props) => {
  const { submission } = props;

  if (submission.status === 'SUBMITTING') {
    return <SubmissionInProgress {...props} />;
  } else {
    return <SubmissionAccepted {...props} />;
  }
};

const SubmissionInProgress = (props: Props) => {
  const { submission } = props;

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <div className={styles.light}>Vep analysis</div>
      </div>
      <div className={classNames(styles.body, styles.bodyLoading)}>
        <div>
          {submission.species && <SpeciesName species={submission.species} />}
        </div>
        <CircleLoader size="small" className={styles.spinner} />
        <div>Submitting...</div>
      </div>
    </div>
  );
};

const SubmissionAccepted = (props: Props) => {
  const { submission } = props;

  return (
    <div className={styles.container}>
      <VepSubmissionHeader {...props} />
      <div className={styles.body}>
        <div>
          {submission.species && <SpeciesName species={submission.species} />}
        </div>
      </div>
    </div>
  );
};

export default ListedVepSubmission;
