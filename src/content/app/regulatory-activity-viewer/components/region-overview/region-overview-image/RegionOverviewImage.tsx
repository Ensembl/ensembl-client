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

import { scaleLinear, type ScaleLinear } from 'd3';

import type { PreparedTrackData } from '../prepareRegionOverviewTracks';

import styles from './RegionOverviewImage.module.css';

type Props = {
  width: number;
  data: PreparedTrackData;
};

// const REGULATION_TRACKS_TOP_OFFSET = 28;
const REGULATORY_FEATURE_TRACKS_TOP_OFFSET = 90;
const DISTANCE_BETWEEN_REGULATORY_TRACKS = 20;
const REGULATORY_FEATURE_RADIUS = 4;

/**
 * Q: what do "gaps" of "boring regions" mean for the creation of scales?
 */

const RegionOverviewImage = (props: Props) => {
  const { width, data } = props;
  // FIXME: height should be calculated from data (the number of tracks)
  const height = 150;

  const location = data.locations[0]; // let's consider just a single contiguous slice without "boring" intervals

  const scale = scaleLinear()
    .domain([location.start, location.end])
    .range([0, width]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={styles.viewport}>
      <RegulatoryFeatureTracks
        tracks={data.regulatoryFeatureTracks}
        scale={scale}
      />
    </svg>
  );
};

const RegulatoryFeatureTracks = (props: {
  tracks: Props['data']['regulatoryFeatureTracks'];
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
  track: Props['data']['regulatoryFeatureTracks'][number];
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
