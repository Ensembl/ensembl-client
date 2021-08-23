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

import React from 'react';
import { useSelector } from 'react-redux';

import { useGetTrackPanelGeneQuery } from 'src/content/app/browser/state/genomeBrowserApiSlice';

import { getBrowserTrackStates } from 'src/content/app/browser/browserSelectors';

import TrackPanelListItem from './TrackPanelListItem';

import { Status } from 'src/shared/types/status';
import type { TrackActivityStatus } from 'src/content/app/browser/track-panel/trackPanelConfig';
import type { EnsObjectTrack } from 'src/shared/state/ens-object/ensObjectTypes';
import type {
  TrackPanelGene as TrackPanelGeneType,
  TrackPanelTranscript as TrackPanelTranscriptType
} from 'src/content/app/browser/state/types/track-panel-gene';

type TrackPanelGeneProps = {
  genomeId: string;
  geneId: string;
  ensObjectId: string;
};

// TODO: change track ids
const GENE_TRACK_ID = 'track:gene-feat';
const TRANSCRIPT_TRACK_ID = 'track:gene-feat-1';

const TrackPanelGene = (props: TrackPanelGeneProps) => {
  const { genomeId, geneId, ensObjectId } = props;
  const { data } = useGetTrackPanelGeneQuery({
    genomeId,
    geneId
  });
  const trackStates = useSelector(getBrowserTrackStates);
  const trackStatusGetter = prepareTrackStatusGetter({
    trackStates,
    genomeId,
    objectId: ensObjectId,
    categoryName: 'main'
  });

  if (!data) {
    return null;
  }

  const { gene } = data;
  const geneTrackStatus = trackStatusGetter(GENE_TRACK_ID);
  const transcriptTrackStatus = trackStatusGetter(TRANSCRIPT_TRACK_ID);

  return (
    <div>
      <TrackPanelListItem
        categoryName="main"
        trackStatus={geneTrackStatus}
        defaultTrackStatus={Status.SELECTED}
        track={prepareGeneTrackData(gene)}
      >
        {prepareTranscriptsTrackData(gene).map((transcriptTrackData) => (
          <TrackPanelListItem
            key={transcriptTrackData.label}
            categoryName="main"
            trackStatus={transcriptTrackStatus}
            defaultTrackStatus={Status.SELECTED}
            track={transcriptTrackData}
          />
        ))}
      </TrackPanelListItem>
    </div>
  );
};

// TODO: examine EnsObjectTrack
// as we change our thinking about the EnsObject type, the EnsObjectTrack type,
// and the TrackPanelListItem components, the functions below will need changing

const prepareGeneTrackData = (gene: TrackPanelGeneType): EnsObjectTrack => {
  return {
    label: gene.symbol ?? gene.stable_id,
    track_id: GENE_TRACK_ID,
    stable_id: gene.stable_id,
    description: null // FIXME: why do we need this field?
  };
};

const prepareTranscriptsTrackData = (
  gene: TrackPanelGeneType
): EnsObjectTrack[] => {
  const canonicalTranscript = gene.transcripts.find(
    (transcript) => transcript.metadata.canonical
  ) as TrackPanelTranscriptType;
  const canonicalTranscriptTrackData = {
    label: canonicalTranscript.stable_id,
    track_id: TRANSCRIPT_TRACK_ID,
    stable_id: canonicalTranscript.stable_id,
    description: null,
    colour: 'BLUE',
    additional_info: canonicalTranscript.metadata.biotype.label
  };
  return [canonicalTranscriptTrackData];
};

type GetTrackStatusParams = {
  trackStates: ReturnType<typeof getBrowserTrackStates>;
  genomeId: string;
  objectId: string;
  categoryName: string;
  trackId: string;
};

const prepareTrackStatusGetter =
  (params: Omit<GetTrackStatusParams, 'trackId'>) => (trackId: string) =>
    getTrackStatus({ ...params, trackId });

const getTrackStatus = (params: GetTrackStatusParams): TrackActivityStatus => {
  const { trackStates, genomeId, objectId, categoryName, trackId } = params;
  const defaultTrackStatus = Status.SELECTED;
  return (
    trackStates?.[genomeId]?.objectTracks?.[objectId]?.[categoryName]?.[
      trackId
    ] ?? defaultTrackStatus
  );
};

export default TrackPanelGene;
