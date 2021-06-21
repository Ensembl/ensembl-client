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

import React from 'react';
import { useSelector } from 'react-redux';

import GeneOverview from 'src/content/app/entity-viewer/gene-view/components/gene-view-sidebar/overview/GeneOverview';
import GeneExternalReferences from 'src/content/app/entity-viewer/gene-view/components/gene-view-sidebar/external-references/GeneExternalReferences';

import { getEntityViewerSidebarTabName } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import { SidebarTabName } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';

const GeneViewSidebar = () => {
  const activeTabName = useSelector(getEntityViewerSidebarTabName);

  return (
    <>
      {activeTabName === SidebarTabName.OVERVIEW && <GeneOverview />}
      {activeTabName === SidebarTabName.EXTERNAL_REFERENCES && (
        <GeneExternalReferences />
      )}
    </>
  );
};

export default GeneViewSidebar;
