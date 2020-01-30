export type EntityViewerGeneralState = Readonly<{
  activeGenomeId: string | null;
}>;

export const initialState: EntityViewerGeneralState = {
  activeGenomeId: null // FIXME add entity viewer storage service
};
