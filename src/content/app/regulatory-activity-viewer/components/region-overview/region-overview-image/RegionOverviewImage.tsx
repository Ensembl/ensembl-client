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

import { useMemo } from 'react';
import { scaleLinear, type ScaleLinear } from 'd3';

import prepareRegionOverviewGeneTracks, {
  type GeneTrack
} from 'src/content/app/regulatory-activity-viewer/components/region-overview/prepareRegionOverviewGeneTracks';
import prepareRegionOverviewRegulatoryTracks from 'src/content/app/regulatory-activity-viewer/components/region-overview/prepareRegionOverviewRegulatoryTracks';

import RegionOverviewGene from './region-overview-gene/RegionOverviewGene';

import type {
  OverviewRegion,
  RegulatoryFeature
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

import styles from './RegionOverviewImage.module.css';

type Props = {
  width: number;
  data: OverviewRegion;
};

// TODO: Extract image constants into a constants file

// const REGULATION_TRACKS_TOP_OFFSET = 28;
const REGULATORY_FEATURE_TRACKS_TOP_OFFSET = 110;
const REGULATORY_FEATURE_RADIUS = 4;
const REGULATORY_FEATURE_TRACK_HEIGHT = 20;

const PADDING_TOP = 40;
const GENE_TRACK_HEIGHT = 8;

/**
 * Q: what do "gaps" of "boring regions" mean for the creation of scales?
 *
 *
 * Ideas:
 *  - onTracksSettled callback? It will contain the logic for distributing features (especially transcripts)
 *    into tracks inside of the image component. The logic will have to account for the "bumping",
 *    which would probably need to consider the widths and the scales; so it might be natural to contain it
 *    within the image component
 */

const RegionOverviewImage = (props: Props) => {
  const { width, data } = props;
  // FIXME: height should be calculated from data (the number of tracks)
  const height = 150;

  const location = data.locations[0]; // let's consider just a single contiguous slice without "boring" intervals

  const scale = scaleLinear()
    .domain([location.start, location.end])
    .rangeRound([0, Math.floor(width)]);

  const { geneTracks } = useMemo(
    () => prepareRegionOverviewGeneTracks({ data, scale }),
    [data, scale]
  );

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={styles.viewport}>
      <GeneTracks tracks={geneTracks} scale={scale} width={width} />
      <RegulatoryFeatureTracks
        offsetTop={REGULATORY_FEATURE_TRACKS_TOP_OFFSET}
        features={data.regulatory_features.data}
        featureTypesMap={data.regulatory_features.feature_types}
        scale={scale}
      />
    </svg>
  );
};

const GeneTracks = (props: {
  tracks: ReturnType<typeof prepareRegionOverviewGeneTracks>['geneTracks'];
  scale: ScaleLinear<number, number>;
  width: number; // full svg width
}) => {
  const { forwardStrandTracks, reverseStrandTracks } = props.tracks;
  let tempY = PADDING_TOP;

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
        trackIndex={index}
        offsetTop={yCoordLookup[index]}
        scale={props.scale}
        key={index}
      />
    ));
  });

  return (
    <>
      <g>{forwardStrandTrackElements}</g>
      <StrandDivider width={props.width} offsetTop={strandDividerY} />
      <g>{reverseStrandTrackElements}</g>
    </>
  );
};

const GeneTrack = (props: {
  track: GeneTrack;
  trackIndex: number;
  offsetTop: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { track, trackIndex, offsetTop, scale } = props;

  const geneElements = track.map((gene) => (
    <RegionOverviewGene
      gene={gene}
      offsetTop={offsetTop}
      trackIndex={trackIndex}
      scale={scale}
      key={gene.data.stable_id}
    />
  ));

  return <g>{geneElements}</g>;
};

const StrandDivider = (props: {
  offsetTop: number; // absolute position from the top of the svg
  width: number; // full width of the svg
}) => {
  const y = props.offsetTop;
  const color = '#ccd3d8';

  return (
    <line
      x1="0"
      x2={props.width}
      y1={y}
      y2={y}
      strokeDasharray="2"
      stroke={color}
      strokeWidth="1"
    />
  );
};

const RegulatoryFeatureTracks = (props: {
  features: RegulatoryFeature[];
  featureTypesMap: OverviewRegion['regulatory_features']['feature_types'];
  offsetTop: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { features, featureTypesMap, offsetTop, scale } = props;

  let featureTracks: RegulatoryFeature[][] = [];

  for (const feature of features) {
    const trackIndex = featureTypesMap[feature.feature_type]?.track_index;

    if (typeof trackIndex !== 'number') {
      // this should not happen
      continue;
    }

    const track = featureTracks[trackIndex];

    if (!track) {
      featureTracks[trackIndex] = [feature];
    } else {
      track.push(feature);
    }
  }

  featureTracks = featureTracks.filter((item) => !!item); // just to make sure there are no empty indexes in the tracks array

  // const trackTopOffsets = [offsetTop];

  // for (let i = 1; i < featureTracks.length; i++) {
  //   const nextOffset =
  // }

  const trackElements = featureTracks.map((track, index) => (
    <RegulatoryFeatureTrack
      track={track}
      featureTypesMap={featureTypesMap}
      offsetTop={offsetTop + index * REGULATORY_FEATURE_TRACK_HEIGHT}
      scale={scale}
      key={index}
    />
  ));

  return <g>{trackElements}</g>;
};

const RegulatoryFeatureTrack = (props: {
  track: ReturnType<
    typeof prepareRegionOverviewRegulatoryTracks
  >['regulatoryFeatureTracks'][number];
  featureTypesMap: OverviewRegion['regulatory_features']['feature_types'];
  offsetTop: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { track, featureTypesMap, offsetTop, scale } = props;

  const featureElements = track.map((feature) => {
    const { start, end } = feature;
    const middle = end - start;
    const x = scale(start + middle);

    return (
      <circle
        data-feature-id={feature.id}
        cx={x}
        cy={offsetTop}
        r={REGULATORY_FEATURE_RADIUS}
        fill={featureTypesMap[feature.feature_type].color}
        className={styles.regulatoryFeature}
        key={feature.id}
      />
    );
  });

  return <g>{featureElements}</g>;
};

export default RegionOverviewImage;
