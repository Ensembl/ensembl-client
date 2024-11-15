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

import { Fragment } from 'react';
import type { ScaleLinear } from 'd3';

import {
  GENE_TRACKS_TOP_OFFSET,
  GENE_TRACK_HEIGHT,
  REGULATORY_FEATURE_TRACKS_TOP_OFFSET,
  REGULATORY_FEATURE_TRACK_HEIGHT
} from 'src/content/app/regulatory-activity-viewer/components/region-activity-section/region-detail-image/regionDetailConstants';

import RegionDetailGene from './region-detail-gene/RegionDetailGene';
import RegionDetailRegulatoryFeature from './region-detail-regulatory-feature/RegionDetailRegulatoryFeature';
import TranscriptionStartSites from 'src/content/app/regulatory-activity-viewer/components/region-overview/region-overview-image/transcription-start-sites/TranscriptionStartSites';

import type {
  FeatureTracks,
  GeneTrack
} from 'src/content/app/regulatory-activity-viewer/helpers/prepare-feature-tracks/prepareFeatureTracks';
import type {
  OverviewRegion,
  RegulatoryFeature
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

type Props = {
  data: OverviewRegion;
  featureTracks: FeatureTracks;
  width: number;
  scale: ScaleLinear<number, number>;
  start: number;
  end: number;
};

const RegionDetailImage = (props: Props) => {
  const { data, scale, width, featureTracks } = props;
  const geneForwardStrandTracks = featureTracks.geneTracks.forwardStrandTracks;
  const geneReverseStrandTracks = featureTracks.geneTracks.reverseStrandTracks;

  const regulatoryTracksOffsetTop =
    GENE_TRACKS_TOP_OFFSET +
    (geneForwardStrandTracks.length + geneReverseStrandTracks.length) *
      GENE_TRACK_HEIGHT +
    REGULATORY_FEATURE_TRACKS_TOP_OFFSET;

  return (
    <g>
      <GeneTracks
        tracks={featureTracks.geneTracks}
        scale={scale}
        width={width}
      />
      <RegulatoryFeatureTracks
        featureTracks={featureTracks.regulatoryFeatureTracks}
        featureTypesMap={data.regulatory_features.feature_types}
        offsetTop={regulatoryTracksOffsetTop}
        scale={scale}
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

  // Designer's instruction: forward strand genes above the central line should stack upwards
  for (let i = forwardStrandTracks.length; i > 0; i--) {
    const y = GENE_TRACKS_TOP_OFFSET + GENE_TRACK_HEIGHT * (i - 1);
    forwardStrandTrackYs.push(y);
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
        tracks={tracks}
        trackIndex={index}
        trackOffsetsTop={yCoordLookup}
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
  tracks: GeneTrack[];
  trackIndex: number;
  trackOffsetsTop: number[];
  scale: ScaleLinear<number, number>;
}) => {
  const { tracks, trackIndex, trackOffsetsTop, scale } = props;
  const track = tracks[trackIndex];
  const offsetTop = trackOffsetsTop[trackIndex];

  const geneElements = track.map((gene) => {
    return (
      <Fragment key={gene.data.stable_id}>
        <RegionDetailGene gene={gene} offsetTop={offsetTop} scale={scale} />
        <TranscriptionStartSites
          tss={gene.data.tss}
          strand={gene.data.strand}
          scale={scale}
          geneTracks={tracks}
          trackIndex={trackIndex}
          trackOffsetsTop={trackOffsetsTop}
        />
      </Fragment>
    );
  });

  return <g>{geneElements}</g>;
};

const RegulatoryFeatureTracks = (props: {
  featureTracks: RegulatoryFeature[][];
  featureTypesMap: OverviewRegion['regulatory_features']['feature_types'];
  offsetTop: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { featureTracks, featureTypesMap, offsetTop, scale } = props;

  const trackElements = featureTracks.map((track, index) => (
    <RegulatoryFeatureTrack
      features={track}
      featureTypesMap={featureTypesMap}
      offsetTop={offsetTop + index * REGULATORY_FEATURE_TRACK_HEIGHT}
      scale={scale}
      key={index}
    />
  ));

  return <g>{trackElements}</g>;
};

const RegulatoryFeatureTrack = ({
  features,
  featureTypesMap,
  offsetTop,
  scale
}: {
  features: RegulatoryFeature[];
  featureTypesMap: OverviewRegion['regulatory_features']['feature_types'];
  offsetTop: number;
  scale: ScaleLinear<number, number>;
}) => {
  return features.map((feature) => (
    <RegionDetailRegulatoryFeature
      feature={feature}
      featureTypesMap={featureTypesMap}
      offsetTop={offsetTop}
      scale={scale}
      key={feature.id}
    />
  ));
};

export default RegionDetailImage;
