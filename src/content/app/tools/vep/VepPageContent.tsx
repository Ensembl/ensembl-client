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

import { useAppDispatch, useAppSelector } from 'src/store';
import { updateSpeciesSelectorModalOpenFlag } from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';
import { getSpeciesSelectorModalOpenFlag } from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';

import styles from './VepPageContent.module.css';

const VepPageContent = () => {
  const speciesSelectorModalOpenFlag = useAppSelector(
    getSpeciesSelectorModalOpenFlag
  );

  if (speciesSelectorModalOpenFlag) {
    return <SpeciesSelectorWrapper />;
  } else {
    return <MainWrapper />;
  }
};

const SpeciesSelectorWrapper = () => {
  const dispatch = useAppDispatch();

  const closeSpeciesSelectorModal = () => {
    dispatch(updateSpeciesSelectorModalOpenFlag(false));
  };

  return (
    <div className={styles.speciesSelectorGrid}>
      <VepAppBar />
      <VepSpeciesSelector onClose={closeSpeciesSelectorModal} />
    </div>
  );
};

const MainWrapper = () => {
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
      <Route
        path="unviewed-submissions"
        element={<VepSubmissions unviewed={true} />}
      />
      <Route path="submissions">
        <Route index={true} element={<VepSubmissions unviewed={false} />} />
        <Route path=":submissionId" element={<VepSubmissionResults />} />
      </Route>
      <Route path="*" element={<NotFoundErrorScreen />} />
    </Routes>
  );
};

export default VepPageContent;
