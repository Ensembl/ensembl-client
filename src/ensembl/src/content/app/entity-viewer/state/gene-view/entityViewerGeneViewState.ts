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

export type EntityViewerGeneFunctionState = {
  selectedTabName: GeneFunctionTabName;
};

export type EntityViewerGeneRelationshipsState = {
  selectedTabName: GeneRelationshipsTabName;
};

export type EntityViewerGeneViewUIState = {
  selectedGeneTabName: GeneViewTabName;
  geneFunction: EntityViewerGeneFunctionState;
  geneRelationships: EntityViewerGeneRelationshipsState;
};

export type EntityViewerGeneViewState = Readonly<{
  [genomeId: string]: {
    [geneId: string]: EntityViewerGeneViewUIState;
  };
}>;

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

export const defaultEntityViewerGeneViewUIState = {
  selectedGeneTabName: GeneViewTabName.TRANSCRIPTS,
  geneFunction: {
    selectedTabName: GeneFunctionTabName.PROTEINS
  },
  geneRelationships: {
    selectedTabName: GeneRelationshipsTabName.ORTHOLOGUES
  }
};

export const defaultEntityViewerGeneViewState: EntityViewerGeneViewState = {};

// TODO: This will be loaded from storage services once it is setup
export const initialEntityViewerGeneViewState: EntityViewerGeneViewState = {};
