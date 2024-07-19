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

import { Route, Routes } from 'react-router-dom';

import VepAppBar from './components/vep-app-bar/VepAppBar';
import VepTopBar from './components/vep-top-bar/VepTopBar';
import VepForm from './views/vep-form/VepForm';
import VepSpeciesSelector from './views/vep-species-selector/VepSpeciesSelector';
import VepSubmissions from './views/vep-submissions/VepSubmissions';
import VepSubmissionResults from './views/vep-submission-results/VepSubmissionResults';
import { NotFoundErrorScreen } from 'src/shared/components/error-screen';

import styles from './VepPageContent.module.css';

const VepPageContent = () => {
  return (
    <div className={styles.grid}>
      <VepAppBar />
      <VepTopBar />
      <Main />
    </div>
  );
};

const Main = () => {
  return (
    <Routes>
      <Route index={true} element={<VepForm />} />
      <Route path="species-selector" element={<VepSpeciesSelector />} />
      <Route
        path="unviewed-submissions"
        element={<div>List of unviewed submissions</div>}
      />
      <Route path="submissions">
        <Route index={true} element={<VepSubmissions />} />
        <Route path=":submissionId" element={<VepSubmissionResults />} />
      </Route>
      <Route path="*" element={<NotFoundErrorScreen />} />
    </Routes>
  );
};

export default VepPageContent;
