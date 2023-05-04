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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';

import { RootState } from 'src/store';

export enum View {
  TRANSCRIPTS = 'transcripts',
  PROTEIN = 'protein',
  VARIANTS = 'variants',
  PHENOTYPES = 'phenotypes',
  GENE_EXPRESSION = 'gene_expression',
  GENE_ONTOLOGY = 'gene_ontology',
  GENE_PATHWAYS = 'gene_pathways',
  ORTHOLOGUES = 'orthologues',
  GENE_FAMILIES = 'gene_families',
  GENE_PANELS = 'gene_panels'
}

export enum GeneViewTabName {
  TRANSCRIPTS = 'Transcripts',
  GENE_FUNCTION = 'Gene function',
  GENE_RELATIONSHIPS = 'Gene relationships'
}

export enum GeneFunctionTabName {
  PROTEINS = 'Proteins',
  VARIANTS = 'Variants',
  PHENOTYPES = 'Phenotypes',
  GENE_EXPRESSION = 'Gene expression',
  GENE_ONTOLOGY = 'Gene ontology',
  GENE_PATHWAYS = 'Gene pathways'
}

export enum GeneRelationshipsTabName {
  ORTHOLOGUES = 'Orthologues',
  GENE_FAMILIES = 'Gene families',
  GENE_PANELS = 'Gene panels'
}

export type GeneViewTabData = {
  view: View;
  primaryTab: GeneViewTabName;
  secondaryTab: GeneFunctionTabName | GeneRelationshipsTabName | null;
};

// using Map to guarantee the order of the inserted elements
export const GeneViewTabMap: Map<View, GeneViewTabData> = new Map();
GeneViewTabMap.set(View.TRANSCRIPTS, {
  view: View.TRANSCRIPTS,
  primaryTab: GeneViewTabName.TRANSCRIPTS,
  secondaryTab: null
});
GeneViewTabMap.set(View.PROTEIN, {
  view: View.PROTEIN,
  primaryTab: GeneViewTabName.GENE_FUNCTION,
  secondaryTab: GeneFunctionTabName.PROTEINS
});
GeneViewTabMap.set(View.VARIANTS, {
  view: View.VARIANTS,
  primaryTab: GeneViewTabName.GENE_FUNCTION,
  secondaryTab: GeneFunctionTabName.VARIANTS
});
GeneViewTabMap.set(View.PHENOTYPES, {
  view: View.PHENOTYPES,
  primaryTab: GeneViewTabName.GENE_FUNCTION,
  secondaryTab: GeneFunctionTabName.PHENOTYPES
});
GeneViewTabMap.set(View.GENE_EXPRESSION, {
  view: View.GENE_EXPRESSION,
  primaryTab: GeneViewTabName.GENE_FUNCTION,
  secondaryTab: GeneFunctionTabName.GENE_EXPRESSION
});
GeneViewTabMap.set(View.GENE_ONTOLOGY, {
  view: View.GENE_ONTOLOGY,
  primaryTab: GeneViewTabName.GENE_FUNCTION,
  secondaryTab: GeneFunctionTabName.GENE_ONTOLOGY
});
GeneViewTabMap.set(View.GENE_PATHWAYS, {
  view: View.GENE_PATHWAYS,
  primaryTab: GeneViewTabName.GENE_FUNCTION,
  secondaryTab: GeneFunctionTabName.GENE_PATHWAYS
});
GeneViewTabMap.set(View.ORTHOLOGUES, {
  view: View.ORTHOLOGUES,
  primaryTab: GeneViewTabName.GENE_RELATIONSHIPS,
  secondaryTab: GeneRelationshipsTabName.ORTHOLOGUES
});
GeneViewTabMap.set(View.GENE_FAMILIES, {
  view: View.GENE_FAMILIES,
  primaryTab: GeneViewTabName.GENE_RELATIONSHIPS,
  secondaryTab: GeneRelationshipsTabName.GENE_FAMILIES
});
GeneViewTabMap.set(View.GENE_PANELS, {
  view: View.GENE_PANELS,
  primaryTab: GeneViewTabName.GENE_RELATIONSHIPS,
  secondaryTab: GeneRelationshipsTabName.GENE_PANELS
});

export type SelectedTabViews = Record<
  'geneFunctionTab' | 'geneRelationshipsTab',
  View | null
>;

export type ViewStatePerGene = {
  current: View;
  selectedTabViews: SelectedTabViews;
};

export type GeneViewViewState = Readonly<{
  [genomeId: string]: {
    [geneId: string]: ViewStatePerGene;
  };
}>;

const initialStatePerGene: ViewStatePerGene = {
  current: View.TRANSCRIPTS,
  selectedTabViews: {
    geneFunctionTab: null,
    geneRelationshipsTab: null
  }
};

export const updateView =
  (view: View): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const activeGenomeId = getEntityViewerActiveGenomeId(getState());
    const activeObjectId = getEntityViewerActiveEntityId(getState());
    if (!activeGenomeId || !activeObjectId) {
      return;
    }
    const primaryTabName = GeneViewTabMap.get(view)?.primaryTab;
    const primaryTab =
      primaryTabName === GeneViewTabName.GENE_FUNCTION
        ? 'geneFunctionTab'
        : primaryTabName === GeneViewTabName.GENE_RELATIONSHIPS
        ? 'geneRelationshipsTab'
        : null;
    const tabView: {
      selectedTabViews?: Record<
        'geneFunctionTab' | 'geneRelationshipsTab',
        View | null
      >;
    } = {};
    if (primaryTab) {
      tabView.selectedTabViews = { [primaryTab]: view } as Record<
        'geneFunctionTab' | 'geneRelationshipsTab',
        View | null
      >;
    }
    dispatch(
      viewSlice.actions.setView({
        activeGenomeId,
        activeObjectId,
        fragment: {
          current: view,
          ...tabView
        }
      })
    );
  };

type SetViewPayload = {
  activeGenomeId: string;
  activeObjectId: string;
  fragment: Partial<ViewStatePerGene>;
};

const viewSlice = createSlice({
  name: 'entity-viewer-gene-view-view',
  initialState: {} as GeneViewViewState,
  reducers: {
    setView(state, action: PayloadAction<SetViewPayload>) {
      const { activeGenomeId, activeObjectId, fragment } = action.payload;
      if (!state[activeGenomeId]) {
        state[activeGenomeId] = { [activeObjectId]: initialStatePerGene };
      }
      state[activeGenomeId][activeObjectId] = {
        ...state[activeGenomeId][activeObjectId],
        ...fragment
      };
    }
  }
});

export default viewSlice.reducer;
