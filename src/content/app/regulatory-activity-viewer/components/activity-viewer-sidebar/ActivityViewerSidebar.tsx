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

import { getSidebarView } from 'src/content/app/regulatory-activity-viewer/state/ui/uiSelectors';

import Sidebar from 'src/shared/components/layout/sidebar/Sidebar';
import SidebarDefaultView from './sidebar-default-view/SidebarDefaultView';
import EpigenomeFiltersView from './epigenome-filters-view/EpigenomeFiltersView';

type Props = {
  genomeId: string | null;
};

const ActivityViewerSidebar = (props: Props) => {
  const { genomeId } = props;
  const sidebarView = useAppSelector((state) =>
    getSidebarView(state, genomeId ?? '')
  );

  return (
    <Sidebar>
      {sidebarView === 'default' && <SidebarDefaultView />}
      {sidebarView === 'epigenome-filters' && (
        <EpigenomeFiltersView genomeId={genomeId} />
      )}
    </Sidebar>
  );
};

export default ActivityViewerSidebar;
