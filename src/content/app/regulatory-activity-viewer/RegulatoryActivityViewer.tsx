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

import { StandardAppLayout } from 'src/shared/components/layout';
import RegionOverview from './components/region-overview/RegionOverview';
import RegionActivitySection from './components/region-activity-section/RegionActivitySection';
import ActivityViewerSidebar from './components/activity-viewer-sidebar/ActivityViewerSidebar';

const ActivityViewer = () => {
  return (
    <StandardAppLayout
      mainContent={<MainContent />}
      sidebarContent={<ActivityViewerSidebar />}
      isSidebarOpen={true}
      topbarContent={null}
      sidebarNavigation={null}
      onSidebarToggle={noop}
      viewportWidth={1800}
    />
  );
};

const MainContent = () => {
  return (
    <div>
      Hello activity viewer
      <RegionOverview />
      <div style={{ margin: '3rem 0' }} />
      <RegionActivitySection />
    </div>
  );
};

export default ActivityViewer;
