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

import { useAppSelector } from 'src/store';

import {
  getActiveSidebarTab,
  getSidebarModalView
} from 'src/content/app/entity-viewer/state/transcript-view/sidebar/transcriptViewSidebarSelectors';
import { sidebarTabNames } from 'src/content/app/entity-viewer/state/transcript-view/sidebar/transcriptViewSidebarSlice';

import useTranscriptViewIds from 'src/content/app/entity-viewer/transcript-view/hooks/useTranscriptViewIds';

import SidebarDefault from './sidebar-default/SidebarDefault';
import SidebarExternalReferences from './sidebar-external-references/SidebarExternalReferences';
import Sidebar from 'src/shared/components/layout/sidebar/Sidebar';
import TranscriptViewSidebarModal from 'src/content/app/entity-viewer/transcript-view/components/transcript-view-sidebar/sidebar-modal/TranscriptViewSidebarModal';

const TranscriptViewSidebar = () => {
  const { activeGenomeId, transcriptId } = useTranscriptViewIds();
  const activeSidebarTab = useAppSelector((state) =>
    getActiveSidebarTab(state, activeGenomeId ?? '', transcriptId ?? '')
  );
  const sidebarModalView = useAppSelector((state) =>
    getSidebarModalView(state, activeGenomeId ?? '', transcriptId ?? '')
  );

  if (!activeGenomeId || !transcriptId) {
    return null;
  }
  if (sidebarModalView) {
    return (
      <TranscriptViewSidebarModal
        genomeId={activeGenomeId}
        transcriptId={transcriptId}
        view={sidebarModalView}
      />
    );
  }

  return (
    <Sidebar>
      {activeSidebarTab === sidebarTabNames[0] && (
        <SidebarDefault genomeId={activeGenomeId} transcriptId={transcriptId} />
      )}
      {activeSidebarTab === sidebarTabNames[1] && (
        <SidebarExternalReferences
          genomeId={activeGenomeId}
          transcriptId={transcriptId}
        />
      )}
    </Sidebar>
  );
};

export default TranscriptViewSidebar;
