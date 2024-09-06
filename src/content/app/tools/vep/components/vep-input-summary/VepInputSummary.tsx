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

import styles from './VepInputSummary.module.css';

/**
 * This component appears in a couple of places,
 * and shows whether the variants for a VEP analysis
 * were pasted in the textarea of the VEP submission form,
 * or were appended in a file
 */

type Props = {
  submission: VepSubmissionWithoutInputFile;
  className?: string;
};

const VepInputSummary = (props: Props) => {
  const { submission } = props;

  const componentClasses = props.className;

  if (submission.inputText) {
    return (
      <span className={classNames(componentClasses, styles.smallLight)}>
        Pasted data
      </span>
    );
  } else if (submission.inputFileName) {
    return (
      <span className={componentClasses}>
        <span className={classNames(styles.smallLight, styles.label)}>
          From file
        </span>
        <span>{submission.inputFileName}</span>
      </span>
    );
  }
};

export default VepInputSummary;
