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

import noop from 'lodash/noop';

import SequenceViewerAppBar from './components/sequence-viewer-app-bar/SequenceViewerAppBar';
import { SequenceViewerIdsContextProvider } from './contexts/SequenceViewerIdsContext';
import { StandardAppLayout } from 'src/shared/components/layout';
import LocationSequence from './components/location-sequence/LocationSequence';

import styles from './SequenceViewer.module.css';

const SequenceViewer = () => {
  return (
    <SequenceViewerIdsContextProvider>
      <div className={styles.container}>
        <SequenceViewerAppBar />
        <StandardAppLayout
          mainContent={<MainContent />}
          sidebarContent={null}
          isSidebarOpen={true}
          topbarContent={null}
          sidebarNavigation={null}
          sidebarToolstripContent={null}
          onSidebarToggle={noop}
          viewportWidth={1800}
        />
      </div>
    </SequenceViewerIdsContextProvider>
  );
};

const MainContent = () => {
  return <LocationSequence />;
};

export default SequenceViewer;
