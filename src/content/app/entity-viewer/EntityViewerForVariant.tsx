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

import { useAppSelector, useAppDispatch } from 'src/store';

import { getBreakpointWidth } from 'src/global/globalSelectors';
import {
  isEntityViewerSidebarOpen,
  getEntityViewerSidebarModalView
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import { toggleSidebar } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSlice';

import { StandardAppLayout } from 'src/shared/components/layout';
import EntityViewerSidebarToolstrip from './shared/components/entity-viewer-sidebar/entity-viewer-sidebar-toolstrip/EntityViewerSidebarToolstrip';
import EntityViewerSidebarModal from 'src/content/app/entity-viewer/shared/components/entity-viewer-sidebar/entity-viewer-sidebar-modal/EntityViewerSidebarModal';
import VariantView from './variant-view/VariantView';

const EntityViewerForVariant = () => {
  const isSidebarOpen = useAppSelector(isEntityViewerSidebarOpen);
  const isSidebarModalOpen = Boolean(
    useAppSelector(getEntityViewerSidebarModalView)
  );

  const viewportWidth = useAppSelector(getBreakpointWidth);
  const dispatch = useAppDispatch();

  return (
    <StandardAppLayout
      mainContent={<VariantView />}
      topbarContent={<div>Variant summary for top bar goes here</div>}
      sidebarContent={
        <SidebarContent isSidebarModalOpen={isSidebarModalOpen} />
      }
      sidebarNavigation={null}
      sidebarToolstripContent={<EntityViewerSidebarToolstrip />}
      isSidebarOpen={isSidebarOpen}
      onSidebarToggle={() => dispatch(toggleSidebar())}
      isDrawerOpen={false}
      viewportWidth={viewportWidth}
    />
  );
};

const SidebarContent = (props: { isSidebarModalOpen: boolean }) => {
  return props.isSidebarModalOpen ? (
    <EntityViewerSidebarModal />
  ) : (
    <div>Variant information for sidebar goes here</div>
  );
};

export default EntityViewerForVariant;
