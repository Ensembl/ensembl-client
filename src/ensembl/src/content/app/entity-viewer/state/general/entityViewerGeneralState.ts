export type EntityViewerGeneralState = Readonly<{
  activeGenomeId: string | null;
  activeEnsObjectIds: { [genomeId: string]: string };
}>;

export const initialState: EntityViewerGeneralState = {
  activeGenomeId: null, // FIXME add entity viewer storage service
  activeEnsObjectIds: {}
};
