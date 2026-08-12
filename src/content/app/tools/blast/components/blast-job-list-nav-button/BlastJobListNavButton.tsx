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

import { memo } from 'react';

import { useAppSelector } from 'src/store';
import * as urlFor from 'src/shared/helpers/urlHelper';

import { getBlastSubmissionsList } from 'src/content/app/tools/blast/state/blast-results/blastResultsSelectors';

import ButtonLink from 'src/shared/components/button-link/ButtonLink';

import styles from './BlastJobListNavButton.module.css';

const BlastJobListNavButton = () => {
  const blastSubmissions = useAppSelector(getBlastSubmissionsList);

  return (
    <ButtonLink
      to={urlFor.blastSubmissionsList()}
      isDisabled={!blastSubmissions.length}
      className={styles.button}
    >
      Jobs list
    </ButtonLink>
  );
};

export default memo(BlastJobListNavButton);
