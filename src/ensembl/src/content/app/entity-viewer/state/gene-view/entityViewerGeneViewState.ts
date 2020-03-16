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
    [objectId: string]: EntityViewerGeneViewUIState;
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
