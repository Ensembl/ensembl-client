import { Status } from 'src/shared/types/status';
import { Gene } from '../../types/gene';
import { Transcript } from '../../types/transcript';
import { Assembly } from '../../types/assembly';
import { DataSet } from '../../types/dataSet';
import { Homeologue } from '../../types/homeologue';
import { Publication } from '../../types/publication';
import JSONValue from 'src/shared/types/JSON';

export enum SidebarTabName {
  OVERVIEW = 'Overview',
  EXTERNAL_REFERENCES = 'External references'
}

export type SidebarStatus = Status.OPEN | Status.CLOSED;

type GeneViewTranscriptSidebarPayload = Pick<Transcript, 'id' | 'xrefs'>;

// TODO: Not sure if this is the best approach as the sidebar doesn't need any other data other than the ones picked below.
type GeneViewGeneSidebarPayload = Pick<
  Gene,
  | 'attributes'
  | 'filters'
  | 'function'
  | 'id'
  | 'symbol'
  | 'metadata'
  | 'synonyms'
  | 'cross_references'
> & { transcripts: GeneViewTranscriptSidebarPayload[] };

export type EntityViewerSidebarPayload = {
  gene: GeneViewGeneSidebarPayload;
  other_assemblies?: Assembly[];
  other_data_sets?: DataSet[];
  homeologues?: Homeologue[];
  publications?: Publication[];
};

export type EntityViewerSidebarState = Readonly<{
  [genomeId: string]: EntityViewerSidebarGenomeState;
}>;

export type EntityViewerSidebarGenomeState = Readonly<{
  status: SidebarStatus;
  selectedTabName: SidebarTabName;
  entities: {
    [entityId: string]: {
      payload: EntityViewerSidebarPayload | null;
      uIState: { [key: string]: JSONValue };
    };
  };
}>;

export const buildInitialStateForGenome = (
  genomeId: string
): EntityViewerSidebarState => ({
  [genomeId]: {
    status: Status.OPEN,
    selectedTabName: SidebarTabName.OVERVIEW,
    entities: {}
  }
});

export const initialState: EntityViewerSidebarState = {};
