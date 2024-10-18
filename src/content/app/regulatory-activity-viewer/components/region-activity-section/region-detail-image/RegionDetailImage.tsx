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

import {
  GENE_TRACKS_TOP_OFFSET,
  GENE_TRACK_HEIGHT
} from 'src/content/app/regulatory-activity-viewer/components/region-activity-section/region-detail-image/regionDetailConstants';

import RegionDetailGene from './region-detail-gene/RegionDetailGene';

import type {
  FeatureTracks,
  GeneTrack
} from 'src/content/app/regulatory-activity-viewer/helpers/prepare-feature-tracks/prepareFeatureTracks';
import type { OverviewRegion } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

type Props = {
  data: OverviewRegion;
  featureTracks: FeatureTracks;
  width: number;
  scale: ScaleLinear<number, number>;
  start: number;
  end: number;
};

const RegionDetailImage = (props: Props) => {
  const { scale, width, featureTracks } = props;

  return (
    <g>
      <GeneTracks
        tracks={featureTracks.geneTracks}
        scale={scale}
        width={width}
      />
    </g>
  );
};

const GeneTracks = (props: {
  tracks: FeatureTracks['geneTracks'];
  scale: ScaleLinear<number, number>;
  width: number; // full svg width
}) => {
  const { forwardStrandTracks, reverseStrandTracks } = props.tracks;
  let tempY = GENE_TRACKS_TOP_OFFSET;

  // calculate y-coordinates for gene tracks
  const forwardStrandTrackYs: number[] = [];
  const reverseStrandTrackYs: number[] = [];

  for (let i = 0; i < forwardStrandTracks.length; i++) {
    forwardStrandTrackYs.push(tempY);
    tempY += GENE_TRACK_HEIGHT;
  }

  const strandDividerY = tempY + 0.5 * GENE_TRACK_HEIGHT;
  tempY = strandDividerY + 0.5 * GENE_TRACK_HEIGHT;

  for (let i = 0; i < reverseStrandTracks.length; i++) {
    reverseStrandTrackYs.push(tempY);
    tempY += GENE_TRACK_HEIGHT;
  }
  tempY += GENE_TRACK_HEIGHT;

  // === by this point, tempY should be the y-coordinate of the bottom gene track

  const [forwardStrandTrackElements, reverseStrandTrackElements] = [
    props.tracks.forwardStrandTracks,
    props.tracks.reverseStrandTracks
  ].map((tracks, index) => {
    const isForwardStrand = index === 0;
    const yCoordLookup = isForwardStrand
      ? forwardStrandTrackYs
      : reverseStrandTrackYs;

    return tracks.map((track, index) => (
      <GeneTrack
        track={track}
        offsetTop={yCoordLookup[index]}
        scale={props.scale}
        key={index}
      />
    ));
  });

  return (
    <>
      <g>{forwardStrandTrackElements}</g>
      <g>{reverseStrandTrackElements}</g>
    </>
  );
};

const GeneTrack = (props: {
  track: GeneTrack;
  offsetTop: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { track, offsetTop, scale } = props;

  const geneElements = track.map((gene) => {
    return (
      <RegionDetailGene
        gene={gene}
        offsetTop={offsetTop}
        scale={scale}
        key={gene.data.stable_id}
      />
    );
  });

  return <g>{geneElements}</g>;
};

export default RegionDetailImage;
