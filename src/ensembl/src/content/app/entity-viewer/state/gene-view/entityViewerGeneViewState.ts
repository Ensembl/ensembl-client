export type EntityViewerGeneFunctionState = {
  selectedTabName: string;
};

export type EntityViewerGeneRelationshipsState = {
  selectedTabName: string;
};

export type EntityViewerGeneViewObjectState = {
  selectedGeneTabName: string;
  geneFunction: EntityViewerGeneFunctionState;
  geneRelationships: EntityViewerGeneRelationshipsState;
};

export type EntityViewerGeneViewState = Readonly<{
  [activeGenomeId: string]: {
    [activeObjectId: string]: EntityViewerGeneViewObjectState;
  };
}>;

export const defaultEntityViewerGeneViewObjectState = {
  selectedGeneTabName: 'Transcripts',
  geneFunction: {
    selectedTabName: 'Proteins'
  },
  geneRelationships: {
    selectedTabName: 'Orthologues'
  }
};

export const defaultEntityViewerGeneViewState: EntityViewerGeneViewState = {};

// TODO: This will be loaded from storage services once it is setup
export const initialEntityViewerGeneViewState: EntityViewerGeneViewState = {};
