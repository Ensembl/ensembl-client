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
import { Assembly } from '../../types/assembly';
import { DataSet } from '../../types/dataSet';
import { Homeologue } from '../../types/homeologue';
import { Publication } from '../../types/publication';
import { Source } from '../../types/source';
import { Metadata } from '../../types/metadata';
import { CrossReference } from '../../types/crossReference';
import JSONValue from 'src/shared/types/JSON';

export enum SidebarTabName {
  OVERVIEW = 'Overview',
  EXTERNAL_REFERENCES = 'External references'
}

export type SidebarStatus = Status.OPEN | Status.CLOSED;

/* TYPES FOR THE OVERVIEW SECTION OF GENE VIEW SIDEBAR */

/**
 * NOTE: The types defined within this section are temporary.
 * They deviate from the api response-based types used generally within the Entity Viewer,
 * and are currently supporting the code used only for demo purposes.
 */

type SidebarOverviewTranscript = {
  id: string;
  xrefs?: Source[];
};

type SidebarOverviewGene = {
  id: string;
  symbol: string;
  synonyms?: string[];
  attributes?: string[];
  filters?: {
    [key: string]: JSONValue;
  };
  function?: {
    description: string;
    source: Source;
  };
  metadata?: Metadata;
  cross_references?: CrossReference[];
  transcripts: SidebarOverviewTranscript[];
};

/* END OF TYPES FOR THE OVERVIEW SECTION OF GENE VIEW SIDEBAR */

export type EntityViewerSidebarPayload = {
  gene: SidebarOverviewGene;
  other_assemblies?: Assembly[];
  other_data_sets?: DataSet[];
  homeologues?: Homeologue[];
  publications?: Publication[];
};

export type EntityViewerSidebarState = Readonly<{
  [genomeId: string]: EntityViewerSidebarGenomeState;
}>;

export type EntityViewerSidebarGenomeState = Readonly<{
  status: SidebarStatus;
  selectedTabName: SidebarTabName;
  entities: {
    [entityId: string]: {
      payload: EntityViewerSidebarPayload | null;
      uIState: { [key: string]: JSONValue };
    };
  };
}>;

export const buildInitialStateForGenome = (
  genomeId: string
): EntityViewerSidebarState => ({
  [genomeId]: {
    status: Status.OPEN,
    selectedTabName: SidebarTabName.OVERVIEW,
    entities: {}
  }
});

export const initialState: EntityViewerSidebarState = {};
