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

import type { ScaleLinear } from 'd3';

import type {
  OverviewRegion,
  GeneInRegionOverview
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

type Params = {
  scale: ScaleLinear<number, number>;
  data: Pick<OverviewRegion, 'genes' | 'locations'>;
};

/**
 * Pseudocode for distributing genes between tracks
 *
 * Start with two empty arrays: one for forward-strand tracks and one for reverse-strand tracks.
 *  - A track is an array of genes; thus, an array of tracks is an array of arrays of genes
 *
 * For every gene
 *  - Check if it overlaps with any of the genes in the first track for given strand
 *    - If gene does not overlap any of the genes in the current track,
 *      add it to this track
 *    - If it does overlap a gene in the current track, move on to the next track
 *      and perform the same check
 *      - If there is no next track, add a new track to the array of tracks,
 *        and immediately add the gene to it
 */

export type GeneInTrack = {
  data: GeneInRegionOverview;
  position: {
    x: number;
  };
};

export type GeneTrack = GeneInTrack[];

const prepareRegionOverviewGeneTracks = (params: Params) => {
  const { scale, data } = params;

  const forwardStrandTracks: GeneTrack[] = [];
  const reverseStrandTracks: GeneTrack[] = [];

  for (const gene of data.genes) {
    const geneTracks =
      gene.strand === 'forward' ? forwardStrandTracks : reverseStrandTracks;

    const geneForTrack = prepareGeneForTrack(gene, scale);
    let shouldAddNewTrack = true;

    for (const track of geneTracks) {
      if (canAddGeneToTrack(track, gene)) {
        track.push(geneForTrack);
        shouldAddNewTrack = false;
        break;
      }
    }

    if (shouldAddNewTrack) {
      geneTracks.push([geneForTrack]);
    }
  }

  return {
    geneTracks: {
      forwardStrandTracks,
      reverseStrandTracks
    }
  };
};

const canAddGeneToTrack = (track: GeneTrack, gene: GeneInRegionOverview) => {
  for (const geneInTrack of track) {
    if (areOverlappingGenes(gene, geneInTrack.data)) {
      return false;
    }
  }

  return true;
};

const areOverlappingGenes = (
  gene1: GeneInRegionOverview,
  gene2: GeneInRegionOverview
) => {
  return (
    (gene1.start >= gene2.start && gene1.start <= gene2.end) ||
    (gene2.start >= gene1.start && gene2.start <= gene1.end)
  );
};

const prepareGeneForTrack = (
  gene: GeneInRegionOverview,
  scale: ScaleLinear<number, number>
): GeneInTrack => {
  const x = scale(gene.start);

  return {
    data: gene,
    position: {
      x
    }
  };
};

export default prepareRegionOverviewGeneTracks;
