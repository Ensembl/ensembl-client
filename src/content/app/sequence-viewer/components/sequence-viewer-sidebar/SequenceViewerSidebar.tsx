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

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import { getSidebarModalView } from 'src/content/app/sequence-viewer/state/sidebar/sequenceViewerSidebarSelectors';

import Sidebar from 'src/shared/components/layout/sidebar/Sidebar';
import GeneSequenceSetttings from './GeneSequenceSettings';
import TranscriptSequenceSetttings from './TranscriptSequenceSettings';
import SequenceViewerSidebarModal from './sidebar-modal/SequenceViewerSidebarModal';

export type View = 'location' | 'gene' | 'transcript';

type Props = {
  view: View;
};

const SequenceViewerSidebar = (props: Props) => {
  const { genomeId } = useSequenceViewerIds();
  const sidebarModalView = useAppSelector((state) =>
    getSidebarModalView(state, genomeId ?? '')
  );

  if (sidebarModalView) {
    return <SequenceViewerSidebarModal />;
  }

  return (
    <Sidebar>
      <div>
        {props.view === 'gene' && <GeneSequenceSetttings />}
        {props.view === 'transcript' && <TranscriptSequenceSetttings />}
      </div>
    </Sidebar>
  );
};

export default SequenceViewerSidebar;
