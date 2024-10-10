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

import type { OverviewRegion } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

import styles from './RegionOverviewImage.module.css';

type Props = {
  width: number;
  data: OverviewRegion;
};

// const REGULATION_TRACKS_TOP_OFFSET = 28;
const REGULATORY_FEATURE_TRACKS_TOP_OFFSET = 90;
const DISTANCE_BETWEEN_REGULATORY_TRACKS = 20;
const REGULATORY_FEATURE_RADIUS = 4;

// const PADDING_TOP = 30;
// const GENE_TRACK_HEIGHT = 12;

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
  const { regulatoryFeatureTracks } = useMemo(
    () => prepareRegionOverviewRegulatoryTracks({ data }),
    [data]
  );

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={styles.viewport}>
      <GeneTracks tracks={geneTracks} scale={scale} width={width} />
      <RegulatoryFeatureTracks tracks={regulatoryFeatureTracks} scale={scale} />
    </svg>
  );
};

const GeneTracks = (props: {
  tracks: ReturnType<typeof prepareRegionOverviewGeneTracks>['geneTracks'];
  scale: ScaleLinear<number, number>;
  width: number; // full svg width
}) => {
  const [forwardStrandTrackElements, reverseStrandTrackElements] = [
    props.tracks.forwardStrandTracks,
    props.tracks.reverseStrandTracks
  ].map((tracks) =>
    tracks.map((track, index) => (
      <GeneTrack
        track={track}
        trackIndex={index}
        scale={props.scale}
        key={index}
      />
    ))
  );

  return (
    <>
      <g transform="translate(0, 20)">{forwardStrandTrackElements}</g>
      <StrandDivider width={props.width} offsetTop={35} />
      <g transform="translate(0, 45)">{reverseStrandTrackElements}</g>
    </>
  );
};

const GeneTrack = (props: {
  track: GeneTrack;
  trackIndex: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { track, trackIndex, scale } = props;

  const geneElements = track.map((gene) => (
    <RegionOverviewGene
      gene={gene}
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
  tracks: ReturnType<
    typeof prepareRegionOverviewRegulatoryTracks
  >['regulatoryFeatureTracks'];
  scale: ScaleLinear<number, number>;
}) => {
  const trackElements = props.tracks.map((track, index) => (
    <RegulatoryFeatureTrack
      track={track}
      trackIndex={index}
      scale={props.scale}
      key={index}
    />
  ));

  return <g>{trackElements}</g>;
};

const RegulatoryFeatureTrack = (props: {
  track: ReturnType<
    typeof prepareRegionOverviewRegulatoryTracks
  >['regulatoryFeatureTracks'][number];
  trackIndex: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { track, trackIndex, scale } = props;
  const y =
    REGULATORY_FEATURE_TRACKS_TOP_OFFSET +
    trackIndex * DISTANCE_BETWEEN_REGULATORY_TRACKS;

  const featureElements = track.map((feature) => {
    const { start, end } = feature;
    const middle = end - start;
    const x = scale(start + middle);

    return (
      <circle
        cx={x}
        cy={y}
        r={REGULATORY_FEATURE_RADIUS}
        className={styles.regulatoryFeature}
        key={feature.id}
      />
    );
  });

  return <g>{featureElements}</g>;
};

export default RegionOverviewImage;
