export type EntityViewerState = Readonly<{
  activeGenomeId: string | null;
}>;

export const initialState: EntityViewerState = {
  activeGenomeId: null // FIXME add entity viewer storage service
};
