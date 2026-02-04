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

import { useState, createContext, type ReactNode } from 'react';

import useStructuralVariantsTracks from '../hooks/useStructuralVariantsTracks';
import useStoredTrackIds from '../hooks/useStoredTrackIds';

import type { TrackSummary } from '@ensembl/ensembl-structural-variants';

export type TrackSummaryWithLabel = TrackSummary & {
  label: string;
};

type ContextValue = {
  tracks: TrackSummaryWithLabel[];
  setTracks: (tracks: TrackSummary[]) => void;
};

export const StructuralVariantsImageContext = createContext<
  ContextValue | undefined
>(undefined);

const trackLabelsMap: Record<string, string> = {
  'sv-gene': 'Genes',
  alignments: 'Genomic alignments'
};

export const StructuralVariantsImageContextProvider = (props: {
  referenceGenomeId: string;
  altGenomeId: string;
  children: ReactNode;
}) => {
  const { referenceGenomeId, altGenomeId } = props;
  const [tracks, setTracks] = useState<TrackSummary[]>([]);
  const { referenceGenomeTracks } = useStructuralVariantsTracks({
    referenceGenomeId,
    altGenomeId
  });
  useStoredTrackIds({
    referenceGenomeId,
    altGenomeId,
    referenceGenomeTrackIds: referenceGenomeTracks.map(
      (track) => track.track_id
    )
  });

  if (!referenceGenomeTracks.length) {
    return null;
  }

  const tracksWithLabels = tracks.map((track) => {
    let label: string;
    if (trackLabelsMap[track.id]) {
      label = trackLabelsMap[track.id];
    } else {
      const matchedTrack = referenceGenomeTracks.find(
        (t) => t.track_id === track.id
      );
      if (matchedTrack) {
        label = matchedTrack.label;
      } else {
        label = track.id;
      }
    }
    return {
      ...track,
      label
    };
  });

  return (
    <StructuralVariantsImageContext
      value={{
        tracks: tracksWithLabels,
        setTracks
      }}
    >
      {props.children}
    </StructuralVariantsImageContext>
  );
};
