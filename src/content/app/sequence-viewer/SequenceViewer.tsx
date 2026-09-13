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

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import SequenceViewerAppBar from './components/sequence-viewer-app-bar/SequenceViewerAppBar';
import SequenceViewerSidebar, {
  type View as SidebarView
} from './components/sequence-viewer-sidebar/SequenceViewerSidebar';
import { SequenceViewerIdsContextProvider } from './contexts/SequenceViewerIdsContext';
import { StandardAppLayout } from 'src/shared/components/layout';
import GeneSequence from './components/gene-sequence/GeneSequence';
import TranscriptSequence from './components/transcript-sequence/TranscriptSequence';
import LocationSequence from './components/location-sequence/LocationSequence';

import styles from './SequenceViewer.module.css';

const SequenceViewer = () => {
  return (
    <SequenceViewerIdsContextProvider>
      <div className={styles.container}>
        <SequenceViewerAppBar />
        <StandardAppLayout
          mainContent={<MainContent />}
          sidebarContent={<SidebarContent />}
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
  const { genomeId, isFetchingGenomeId, parsedFocusObjectId, parsedLocation } =
    useSequenceViewerIds();

  if (!genomeId) {
    return null;
  }

  if (isFetchingGenomeId) {
    // some spinner?
    return null;
  }

  // is there a feature
  if (parsedFocusObjectId?.type === 'gene') {
    return (
      <GeneSequence genomeId={genomeId} geneId={parsedFocusObjectId.objectId} />
    );
  }

  if (parsedFocusObjectId?.type === 'transcript') {
    return (
      <TranscriptSequence
        genomeId={genomeId}
        transcriptId={parsedFocusObjectId.objectId}
      />
    );
  }

  // is there a location
  if (parsedLocation) {
    return <LocationSequence />;
  }
};

const SidebarContent = () => {
  const { parsedFocusObjectId, parsedLocation } = useSequenceViewerIds();

  let view: SidebarView | null = null;

  if (parsedFocusObjectId?.type === 'gene') {
    view = 'gene';
  } else if (parsedFocusObjectId?.type === 'transcript') {
    view = 'transcript';
  } else if (parsedLocation) {
    view = 'location';
  }

  if (!view) {
    return null;
  }

  return <SequenceViewerSidebar view={view} />;
};

export default SequenceViewer;
