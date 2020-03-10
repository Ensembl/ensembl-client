export type EntityViewerGeneObjectState = {
  activeGeneTab: string | null;
};

export type EntityViewerGeneObjectStates = {
  [activeObjectId: string]: EntityViewerGeneObjectState;
};

export type EntityViewerGeneState = Readonly<{
  [activeGenomeId: string]: EntityViewerGeneObjectStates;
}>;

export const defaultEntityViewerGeneObjectState = {
  activeGeneTab: 'Transcripts'
};
export const defaultEntityViewerGeneObjectStates: EntityViewerGeneObjectStates = {};
export const defaultEntityViewerGeneState: EntityViewerGeneState = {};
export const initialEntityViewerGeneState: EntityViewerGeneState = {};
