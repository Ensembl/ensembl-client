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

import { getTranscriptMetadata as getTranscriptSupportLevel } from 'src/content/app/entity-viewer/shared/components/default-transcript-label/TranscriptQualityLabel';
import { defaultSort } from 'src/content/app/entity-viewer/shared/helpers/transcripts-sorter';

import TrackPanelListItem from './TrackPanelListItem';

import { Status } from 'src/shared/types/status';
import type { TrackActivityStatus } from 'src/content/app/browser/track-panel/trackPanelConfig';
import type { EnsObjectTrack } from 'src/shared/state/ens-object/ensObjectTypes';
import type {
  TrackPanelGene as TrackPanelGeneType,
  TrackPanelTranscript as TrackPanelTranscriptType
} from 'src/content/app/browser/state/types/track-panel-gene';
import { ProductType } from 'src/shared/types/thoas/product';

type TrackPanelGeneProps = {
  genomeId: string;
  geneId: string;
  ensObjectId: string;
};

// TODO: change track ids
const GENE_TRACK_ID = 'track:gene-feat';
const getTranscriptTrackId = (num: number) => `track:transcript-feat-${num}`;

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

  const getTranscriptTracks = () =>
    prepareTranscriptsTrackData(gene).map((transcriptTrackData) => {
      const transcriptTrackStatus = trackStatusGetter(
        transcriptTrackData.track_id
      );

      return (
        <TrackPanelListItem
          key={transcriptTrackData.label}
          categoryName="main"
          trackStatus={transcriptTrackStatus}
          defaultTrackStatus={Status.SELECTED}
          track={transcriptTrackData}
        />
      );
    });

  return (
    <div>
      <TrackPanelListItem
        categoryName="main"
        trackStatus={geneTrackStatus}
        defaultTrackStatus={Status.SELECTED}
        track={prepareGeneTrackData(gene)}
      >
        {getTranscriptTracks()}
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
    additional_info: gene.metadata.biotype.label,
    description: null // FIXME: remove this field from EnsObjectTrack
  };
};

const getTranscriptTrackColour = (
  transcript: TrackPanelTranscriptType,
  index: number
) => {
  const { product_generating_contexts } = transcript;

  if (index === 0) {
    return 'BLUE';
  } else if (
    product_generating_contexts[0].product_type === ProductType.PROTEIN
  ) {
    return 'DARK_GREY';
  } else {
    return 'LIGHT_GREY';
  }
};

const prepareTranscriptsTrackData = (
  gene: TrackPanelGeneType
): EnsObjectTrack[] => {
  const sortedTranscripts = defaultSort(
    gene.transcripts
  ) as TrackPanelTranscriptType[];

  return sortedTranscripts.map((transcript, index) => ({
    label: transcript.stable_id,
    track_id: getTranscriptTrackId(index),
    stable_id: transcript.stable_id,
    description: null,
    colour: getTranscriptTrackColour(transcript, index),
    additional_info: transcript.metadata.biotype.label,
    support_level: getTranscriptSupportLevel(transcript)?.label
  }));
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
