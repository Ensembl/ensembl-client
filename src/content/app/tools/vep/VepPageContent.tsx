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
import ToolsTopBar from 'src/content/app/tools/shared/components/tools-top-bar/ToolsTopBar';
import VepForm from './views/vep-form/VepForm';
import { NotFoundErrorScreen } from 'src/shared/components/error-screen';

const VepPageContent = () => {
  return (
    <div>
      <VepAppBar />
      <Main />
    </div>
  );
};

const Main = () => {
  return (
    <div>
      <ToolsTopBar>Tools top bar content</ToolsTopBar>

      <Routes>
        <Route index={true} element={<VepForm />} />
        <Route
          path="unviewed-submissions"
          element={<div>List of unviewed submissions</div>}
        />
        <Route path="submissions">
          <Route index={true} element={<div>List of viewed submissions</div>} />
          <Route
            path=":submissionId"
            element={<div>Results of a single VEP analysis</div>}
          />
        </Route>
        <Route path="*" element={<NotFoundErrorScreen />} />
      </Routes>
    </div>
  );
};

export default VepPageContent;
