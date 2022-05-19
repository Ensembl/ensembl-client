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

import React from 'react';

import { useAppSelector } from 'src/store';

import { getUnviewedBlastSubmissions } from 'src/content/app/tools/blast/state/blast-results/blastResultsSelectors';

import { useSubmitBlastMutation } from 'src/content/app/tools/blast/state/blast-api/blastApiSlice';

import BlastAppBar from 'src/content/app/tools/blast/components/blast-app-bar/BlastAppBar';
import ToolsTopBar from 'src/content/app/tools/shared/components/tools-top-bar/ToolsTopBar';
import BlastViewsNavigation from 'src/content/app/tools/blast/components/blast-views-navigation/BlastViewsNavigation';
import ListedBlastSubmission from 'src/content/app/tools/blast/components/listed-blast-submission/ListedBlastSubmission';
import { CircleLoader } from 'src/shared/components/loader';

import styles from './BlastUnviewedSubmissions.scss';

const BlastUnviewedSubmission = () => {
  return (
    <div>
      <BlastAppBar view="unviewed-submissions" />
      <ToolsTopBar>
        <BlastViewsNavigation />
      </ToolsTopBar>
      <Main />
    </div>
  );
};

const Main = () => {
  const unviewedBlastSubmissions = useAppSelector(getUnviewedBlastSubmissions);
  const [, formSubmissionResult] = useSubmitBlastMutation({
    fixedCacheKey: 'submit-blast-form' // same as in BlastJobSubmit component
  });
  const { isLoading } = formSubmissionResult;

  // sort the submissions in reverse chronological order
  unviewedBlastSubmissions.sort((a, b) => {
    return b.submittedAt - a.submittedAt;
  });

  const submissionElements = unviewedBlastSubmissions.map((submission) => (
    <ListedBlastSubmission key={submission.id} submission={submission} />
  ));

  return (
    <main className={styles.container}>
      {isLoading && (
        <div className={styles.loaderContainer}>
          <CircleLoader />
        </div>
      )}
      {submissionElements}
    </main>
  );
};

export default BlastUnviewedSubmission;
