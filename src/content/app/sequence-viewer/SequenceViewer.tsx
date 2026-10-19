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

import { useCallback } from 'react';

import { useAppSelector, useAppDispatch } from 'src/store';

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import { getIsSidebarOpen } from 'src/content/app/sequence-viewer/state/sidebar/sequenceViewerSidebarSelectors';
import { toggleSidebar } from 'src/content/app/sequence-viewer/state/sidebar/sequenceViewerSidebarSlice';

import SequenceViewerAppBar from './components/sequence-viewer-app-bar/SequenceViewerAppBar';
import SequenceViewerSidebar, {
  type View as SidebarView
} from './components/sequence-viewer-sidebar/SequenceViewerSidebar';
import { SequenceViewerIdsContextProvider } from './contexts/SequenceViewerIdsContext';
import { StandardAppLayout } from 'src/shared/components/layout';
import GeneSequence from './components/gene-sequence/GeneSequence';
import TranscriptSequence from './components/transcript-sequence/TranscriptSequence';
import LocationSequence from './components/location-sequence/LocationSequence';
import SidebarToolstrip from './components/sequence-viewer-sidebar/sidebar-toolstrip/SequenceViewerSidebarToolstrip';
import SequenceViewerInterstitial from './components/sequence-viewer-interstitial/SequenceViewerInterstitial';

import styles from './SequenceViewer.module.css';

// Wraps the sequence viewer in appropriate contexts
const WrappedSequenceViewer = () => {
  return (
    <SequenceViewerIdsContextProvider>
      <SequenceViewer />
    </SequenceViewerIdsContextProvider>
  );
};

const SequenceViewer = () => {
  const { genomeIdInUrl, focusObjectIdInUrl } = useSequenceViewerIds();
  const isSidebarOpen = useAppSelector(getIsSidebarOpen);
  const dispatch = useAppDispatch();

  const onSidebarToggle = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  // if no genome id in url, and no active genome id, return an interstitial
  // with instructions for selecting a genome
  // if no focus id in url, return an interstitial that allows user to pick a location
  // or a gene / transcript
  if (!genomeIdInUrl || !focusObjectIdInUrl) {
    return (
      <div className={styles.container}>
        <SequenceViewerAppBar />
        <SequenceViewerInterstitial genomeId={genomeIdInUrl} />
      </div>
    );
  }

  // TODO:
  // if genome id or transcript / gene id is invalid, display an error screen

  return (
    <div className={styles.container}>
      <SequenceViewerAppBar />
      <StandardAppLayout
        mainContent={<MainContent />}
        sidebarContent={<SidebarContent />}
        isSidebarOpen={isSidebarOpen}
        topbarContent={null}
        sidebarNavigation={null}
        sidebarToolstripContent={<SidebarToolstrip />}
        onSidebarToggle={onSidebarToggle}
        viewportWidth={1800}
      />
    </div>
  );
};

const MainContent = () => {
  const { genomeId, isFetchingGenomeId, parsedFocusObjectId } =
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
  if (parsedFocusObjectId?.type === 'location') {
    return (
      <LocationSequence
        genomeId={genomeId}
        location={parsedFocusObjectId.objectId}
      />
    );
  }
};

const SidebarContent = () => {
  const { parsedFocusObjectId } = useSequenceViewerIds();

  let view: SidebarView | null = null;

  if (parsedFocusObjectId?.type === 'gene') {
    view = 'gene';
  } else if (parsedFocusObjectId?.type === 'transcript') {
    view = 'transcript';
  } else if (parsedFocusObjectId?.type === 'location') {
    view = 'location';
  }

  if (!view) {
    return null;
  }

  return <SequenceViewerSidebar view={view} />;
};

export default WrappedSequenceViewer;
