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

import { useState, useMemo, createContext, type ReactNode } from 'react';

import { useGenomeTracksQuery } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import type { GenomeTrackCategory } from 'src/content/app/genome-browser/state/types/tracks';
import type { TrackSummary } from '@ensembl/ensembl-structural-variants';

export type TrackSummaryWithLabel = TrackSummary & {
  label: string;
};

type ContextValue = {
  referenceGenomeTrackIds: string[];
  altGenomeTrackIds: string[];
  tracks: TrackSummaryWithLabel[];
  setTracks: (tracks: TrackSummary[]) => void;
};

export const StructuralVariantsImageContext = createContext<
  ContextValue | undefined
>(undefined);

const geneTrackInfo = {
  id: 'sv-gene',
  label: 'Genes'
};

const alignmentsTrackInfo = {
  id: 'alignments',
  label: 'Genomic alignments'
};

export const StructuralVariantsImageContextProvider = (props: {
  referenceGenomeId: string;
  altGenomeId: string;
  children: ReactNode;
}) => {
  const [tracks, setTracks] = useState<TrackSummary[]>([]);
  const {
    isFetching: isLoadingGenomeBrowserTracks,
    currentData: referenceGenomeBrowserTracks
  } = useGenomeTracksQuery(props.referenceGenomeId);

  const shortVariantsTrackInfo = useMemo(() => {
    if (!referenceGenomeBrowserTracks) {
      return null;
    }
    return getShortVariantsTrack(referenceGenomeBrowserTracks);
  }, [referenceGenomeBrowserTracks]);

  const referenceGenomeTrackIds = useMemo(() => {
    if (isLoadingGenomeBrowserTracks) {
      return [];
    }
    return [geneTrackInfo, shortVariantsTrackInfo]
      .filter((info) => !!info)
      .map(({ id }) => id);
  }, [shortVariantsTrackInfo, isLoadingGenomeBrowserTracks]);
  const altGenomeTrackIds = useMemo(() => {
    return [geneTrackInfo].map(({ id }) => id);
  }, []);

  const allTrackLabels = useMemo(() => {
    return [geneTrackInfo, alignmentsTrackInfo, shortVariantsTrackInfo].filter(
      (item) => !!item
    );
  }, [shortVariantsTrackInfo]);

  const trackSummariesWithLabels = useMemo(() => {
    return getTrackSummariesWithLabels({
      trackSummaries: tracks,
      trackLabels: allTrackLabels
    });
  }, [tracks, allTrackLabels]);

  return (
    <StructuralVariantsImageContext
      value={{
        referenceGenomeTrackIds,
        altGenomeTrackIds,
        tracks: trackSummariesWithLabels,
        setTracks
      }}
    >
      {props.children}
    </StructuralVariantsImageContext>
  );
};

/**
 * NOTE:
 * This is a hack for getting short variants track id from the full list of tracks
 * registered for the given genome.
 */

const getShortVariantsTrack = (trackCategories: GenomeTrackCategory[]) => {
  const shortVariantsTrackId = trackCategories.find(
    (categpry) => categpry.type === 'Variation'
  )?.track_list[0].track_id;
  if (!shortVariantsTrackId) {
    return null;
  }

  return {
    id: shortVariantsTrackId,
    label: 'Short variants'
  };
};

const getTrackSummariesWithLabels = ({
  trackSummaries,
  trackLabels
}: {
  trackSummaries: TrackSummary[];
  trackLabels: { id: string; label: string }[];
}) => {
  const labelsMap: Record<string, string> = {};

  for (const { id: trackId, label: trackLabel } of trackLabels) {
    labelsMap[trackId] = trackLabel;
  }

  return trackSummaries.map((summary) => ({
    ...summary,
    label: labelsMap[summary.id] ?? ''
  }));
};
