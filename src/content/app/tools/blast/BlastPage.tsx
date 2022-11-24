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

import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import { useAppDispatch } from 'src/store';
import useHasMounted from 'src/shared/hooks/useHasMounted';

import { updatePageMeta } from 'src/shared/state/page-meta/pageMetaSlice';

import type { ServerFetch } from 'src/routes/routesConfig';

import styles from './BlastPage.scss';

const BlastForm = React.lazy(() => import('./views/blast-form/BlastForm'));
const BlastSubmissions = React.lazy(
  () => import('./views/blast-submissions/BlastSubmissions')
);
const BlastSubmissionResults = React.lazy(
  () => import('./views/blast-submission-results/BlastSubmissionResults')
);

const pageTitle = 'BLAST search — Ensembl';
const pageDescription = `
BLAST stands for Basic Local Alignment Search Tool.
The emphasis of this tool is to find regions of sequence similarity, which will yield functional and evolutionary clues about the structure and function of your sequence.
`;

const BlastPage = () => {
  const hasMounted = useHasMounted();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      updatePageMeta({
        title: pageTitle,
        description: pageDescription
      })
    );
  }, []);

  return hasMounted ? (
    <div className={styles.blastPage}>
      <Routes>
        <Route index element={<BlastForm />} />
        <Route
          path="unviewed-submissions"
          element={<BlastSubmissions unviewed={true} />}
        />
        <Route path="submissions">
          <Route index={true} element={<BlastSubmissions unviewed={false} />} />
          <Route path=":submissionId" element={<BlastSubmissionResults />} />
        </Route>
      </Routes>
    </div>
  ) : null;
};

export default BlastPage;

// not really fetching anything; just setting page meta
export const serverFetch: ServerFetch = async (params) => {
  params.store.dispatch(
    updatePageMeta({
      title: pageTitle,
      description: pageDescription
    })
  );
};
