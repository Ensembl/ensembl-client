export type EntityViewerGeneFunctionState = {
  selectedTabName: string;
};

export type EntityViewerGeneRelationshipsState = {
  selectedTabName: string;
};

export type EntityViewerGeneObjectState = {
  selectedGeneTabName: string;
  geneFunction: EntityViewerGeneFunctionState;
  geneRelationships: EntityViewerGeneRelationshipsState;
};

export type EntityViewerGeneState = Readonly<{
  [activeGenomeId: string]: {
    [activeObjectId: string]: EntityViewerGeneObjectState;
  };
}>;

export const defaultEntityViewerGeneObjectState = {
  selectedGeneTabName: 'Transcripts',
  geneFunction: {
    selectedTabName: 'Proteins'
  },
  geneRelationships: {
    selectedTabName: 'Orthologues'
  }
};

export const defaultEntityViewerGeneState: EntityViewerGeneState = {};

// TODO: This will be loaded from storage services once it is setup
export const initialEntityViewerGeneState: EntityViewerGeneState = {};
