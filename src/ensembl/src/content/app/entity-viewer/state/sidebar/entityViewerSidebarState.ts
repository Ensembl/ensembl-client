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

import { Status } from 'src/shared/types/status';
import { AccordionSectionID as OverviewMainAccordionSectionID } from 'src/content/app/entity-viewer/gene-view/components/gene-view-sidebar/overview/MainAccordion';

export enum SidebarTabName {
  OVERVIEW = 'Overview',
  EXTERNAL_REFERENCES = 'External references'
}

export enum SidebarModalView {
  SEARCH = 'Search',
  BOOKMARKS = 'Bookmarks',
  SHARE = 'Share',
  DOWNLOADS = 'Downloads'
}

export type ToggleStatus = Status.OPEN | Status.CLOSED;

export type EntityViewerSidebarState = Readonly<{
  [genomeId: string]: EntityViewerSidebarGenomeState;
}>;

export type EntityViewerSidebarModalUIState = {
  isOpen: ToggleStatus;
  selectedModalView: SidebarModalView | null;
};

export type EntityViewerSidebarUIState = {
  mainAccordion?: {
    expandedPanels?: OverviewMainAccordionSectionID[];
  };
  modal?: EntityViewerSidebarModalUIState;
};

export type EntityViewerSidebarGenomeState = Readonly<{
  status: ToggleStatus;
  selectedTabName: SidebarTabName;
  entities: {
    [entityId: string]: {
      uIState: EntityViewerSidebarUIState;
    };
  };
}>;

export const buildInitialSidebarStateForGenome = (): EntityViewerSidebarGenomeState => {
  return {
    status: Status.OPEN,
    selectedTabName: SidebarTabName.OVERVIEW,
    entities: {}
  };
};
