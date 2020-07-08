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

import {
  EntityViewerGeneViewTranscriptsUI,
  defaultTranscriptsUIState
} from 'src/content/app/entity-viewer/state/gene-view/transcripts/entityViewerGeneViewTranscriptsState';
import {
  EntityViewerGeneViewProteinsUI,
  defaultProteinsUIState
} from 'src/content/app/entity-viewer/state/gene-view/proteins/entityViewerGeneViewProteinsState';

export type SelectedTabViews = Record<
  'geneFunctionTab' | 'geneRelationshipsTab',
  View | null
>;

export type EntityViewerGeneViewContentUI = {
  [View.TRANSCRIPTS]: EntityViewerGeneViewTranscriptsUI;
  [View.PROTEIN]: EntityViewerGeneViewProteinsUI;
};

export type EntityViewerGeneViewUIState = {
  view: View | null;
  selectedTabViews: SelectedTabViews;
  contentUI: EntityViewerGeneViewContentUI;
};

export type EntityViewerGeneViewState = Readonly<{
  [genomeId: string]: {
    [geneId: string]: EntityViewerGeneViewUIState;
  };
}>;

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
  view: View | '';
  primaryTab: GeneViewTabName;
  secondaryTab: GeneFunctionTabName | GeneRelationshipsTabName | null;
};

export const transcriptsTabData: GeneViewTabData = {
  view: View.TRANSCRIPTS,
  primaryTab: GeneViewTabName.TRANSCRIPTS,
  secondaryTab: null
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

export const defaultEntityViewerGeneViewUIState: EntityViewerGeneViewUIState = {
  view: View.TRANSCRIPTS,
  selectedTabViews: {
    geneFunctionTab: null,
    geneRelationshipsTab: null
  },
  contentUI: {
    [View.TRANSCRIPTS]: defaultTranscriptsUIState,
    [View.PROTEIN]: defaultProteinsUIState
  }
};

export const queryParamToReduxView = (viewFromUrl: string | null): string =>
  viewFromUrl ? viewFromUrl : 'transcripts';

export const reduxViewToQueryParam = (view: View): string | null =>
  view === View.TRANSCRIPTS ? null : view;

export const defaultEntityViewerGeneViewState: EntityViewerGeneViewState = {};

// TODO: This will be loaded from storage services once it is setup
export const initialEntityViewerGeneViewState: EntityViewerGeneViewState = {};
