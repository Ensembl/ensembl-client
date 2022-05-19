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
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import loadable from '@loadable/component';

import { useAppDispatch, useAppSelector } from 'src/store';
import useHasMounted from 'src/shared/hooks/useHasMounted';

import { updateLastVisitedBlastView } from './state/blast-general/blastGeneralSlice';
import { getLastVisitedBlastView } from './state/blast-general/blastGeneralSelectors';

const BlastForm = loadable(() => import('./views/blast-form/BlastForm'));
const BlastUnviewedSubmissions = loadable(
  () => import('./views/blast-unviewed-submissions/BlastUnviewedSubmissions')
);
const BlastJobs = loadable(
  () => import('./views/blast-submissions/BlastSubmissions')
);
const BlastSubmissionResults = loadable(
  () => import('./views/blast-submission-results/BlastSubmissionResults')
);

const pageDescription = `
BLAST stands for Basic Local Alignment Search Tool.
The emphasis of this tool is to find regions of sequence similarity, which will yield functional and evolutionary clues about the structure and function of your sequence.
`;

const BrowserPage = () => {
  const lastVisitedBlastView = useAppSelector(getLastVisitedBlastView);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const hasMounted = useHasMounted();

  useEffect(() => {
    navigate(lastVisitedBlastView);
  }, []);

  useEffect(() => {
    dispatch(updateLastVisitedBlastView(location.pathname));
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>BLAST search — Ensembl</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      {hasMounted && (
        <Routes>
          <Route index element={<BlastForm />} />
          <Route
            path="unviewed-submissions"
            element={<BlastUnviewedSubmissions />}
          />
          <Route
            path="submissions/:submissionId"
            element={<BlastSubmissionResults />}
          />
          <Route path="submissions" element={<BlastJobs />} />
        </Routes>
      )}
    </>
  );
};

export default BrowserPage;
