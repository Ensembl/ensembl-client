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

import { useAppDispatch } from 'src/store';

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import { closeSidebarModal } from 'src/content/app/sequence-viewer/state/sidebar/sequenceViewerSidebarSlice';

import SidebarSearch from 'src/shared/components/sidebar-search/SidebarSearch';

const SequenceViewerSearch = () => {
  const { genomeId, genomeIdForUrl } = useSequenceViewerIds();
  const dispatch = useAppDispatch();

  const onSearchMatchNavigation = () => {
    if (!genomeId) {
      // this should not happen
      return;
    }
    dispatch(closeSidebarModal({ genomeId }));
  };

  return genomeId ? (
    <SidebarSearch
      key={genomeId}
      app="sequenceViewer"
      genomeId={genomeId}
      genomeIdForUrl={genomeIdForUrl as string}
      onMatchNavigation={onSearchMatchNavigation}
    />
  ) : null;
};

// export default EntityViewerSidebarSearch;

// const SequenceViewerSearch = () => {
//   return <div>Search</div>;
// };

export default SequenceViewerSearch;
