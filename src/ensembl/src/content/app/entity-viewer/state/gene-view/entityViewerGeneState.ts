export type EntityViewerGeneFunctionState = {
  selectedTab: string;
};

export type EntityViewerGeneRelationshipsState = {
  selectedTab: string;
};

export type EntityViewerGeneObjectState = {
  selectedGeneTab: string;
  geneFunction: EntityViewerGeneFunctionState;
  geneRelationships: EntityViewerGeneRelationshipsState;
};

export type EntityViewerGeneObjectStates = {
  [activeObjectId: string]: EntityViewerGeneObjectState;
};

export type EntityViewerGeneState = Readonly<{
  [activeGenomeId: string]: EntityViewerGeneObjectStates;
}>;

export const defaultEntityViewerGeneObjectState = {
  selectedGeneTab: 'Transcripts',
  geneFunction: {
    selectedTab: 'Proteins'
  },
  geneRelationships: {
    selectedTab: 'Orthologues'
  }
};

export const defaultEntityViewerGeneObjectStates: EntityViewerGeneObjectStates = {};
export const defaultEntityViewerGeneState: EntityViewerGeneState = {};

// TODO: This will be loaded from storage services once it is setup
export const initialEntityViewerGeneState: EntityViewerGeneState = {};
