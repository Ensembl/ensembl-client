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

import { useAppSelector, useAppDispatch } from 'src/store';

import { getBreakpointWidth } from 'src/global/globalSelectors';

import useTranscriptViewIds from 'src/content/app/entity-viewer/transcript-view/hooks/useTranscriptViewIds';

import { getIsSidebarOpen } from 'src/content/app/entity-viewer/state/transcript-view/sidebar/transcriptViewSidebarSelectors';

import { toggleSidebar } from 'src/content/app/entity-viewer/state/transcript-view/sidebar/transcriptViewSidebarSlice';

import { StandardAppLayout } from 'src/shared/components/layout';
import TranscriptView from './transcript-view/TranscriptView';
import TranscriptViewSidebar from './transcript-view/components/transcript-view-sidebar/TranscriptViewSidebar';
import TranscriptViewSidebarTabs from './transcript-view/components/transcript-view-sidebar-tabs/TranscriptViewSidebarTabs';

const EntityViewerForTranscript = () => {
  const { activeGenomeId, transcriptId } = useTranscriptViewIds();
  const isSidebarOpen = useAppSelector((state) =>
    getIsSidebarOpen(state, activeGenomeId ?? '', transcriptId ?? '')
  );
  const viewportWidth = useAppSelector(getBreakpointWidth);
  const dispatch = useAppDispatch();

  const onSidebarToggle = () => {
    if (!activeGenomeId || !transcriptId) {
      // this should not happen
      return;
    }
    dispatch(
      toggleSidebar({
        genomeId: activeGenomeId,
        transcriptId
      })
    );
  };

  return (
    <StandardAppLayout
      topbarContent={<div />}
      mainContent={<TranscriptView />}
      sidebarContent={<TranscriptViewSidebar />}
      isSidebarOpen={isSidebarOpen}
      onSidebarToggle={onSidebarToggle}
      sidebarNavigation={<TranscriptViewSidebarTabs />}
      viewportWidth={viewportWidth}
    />
  );
};

export default EntityViewerForTranscript;
