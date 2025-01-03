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
import { scaleLinear, type ScaleLinear } from 'd3';

import useRefWithRerender from 'src/shared/hooks/useRefWithRerender';

import RegionOverviewGene from './region-overview-gene/RegionOverviewGene';
import TranscriptionStartSites from './transcription-start-sites/TranscriptionStartSites';
import RegionOverviewLocationSelector from './region-overview-location-selector/RegionOverviewLocationSelector';

import {
  GENE_TRACKS_TOP_OFFSET,
  GENE_TRACK_HEIGHT,
  REGULATORY_FEATURE_TRACKS_TOP_OFFSET,
  REGULATORY_FEATURE_RADIUS,
  REGULATORY_FEATURE_TRACK_HEIGHT
} from 'src/content/app/regulatory-activity-viewer/components/region-overview/region-overview-image/regionOverviewImageConstants';

import type {
  FeatureTracks,
  GeneTrack
} from 'src/content/app/regulatory-activity-viewer/helpers/prepare-feature-tracks/prepareFeatureTracks';
import type {
  OverviewRegion,
  RegulatoryFeature
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

import styles from './RegionOverviewImage.module.css';

type Props = {
  activeGenomeId: string;
  width: number;
  data: OverviewRegion;
  featureTracks: FeatureTracks;
  focusGeneId: string | null; // TODO: this will need to evolve, because focused feature does not have to be gene; also, focus object will probably come from redux
  onFocusGeneChange: (geneId: string) => void; // TODO: this will need to evolve; for same reasons as focusGeneId prop
};

/**
 * Q: what do "gaps" of "boring regions" mean for the creation of scales?
 *
 * Ideas:
 *  - onTracksSettled callback? It will contain the logic for distributing features (especially transcripts)
 *    into tracks inside of the image component. The logic will have to account for the "bumping",
 *    which would probably need to consider the widths and the scales; so it might be natural to contain it
 *    within the image component
 */

const RegionOverviewImage = (props: Props) => {
  const { activeGenomeId, width, featureTracks, data, focusGeneId } = props;
  const [imageRef, setImageRef] = useRefWithRerender<SVGSVGElement>(null);

  const { imageHeight, regulatoryFeatureTracksTopOffset } =
    getImageHeightAndTopOffsets(featureTracks);

  const location = data.locations[0]; // let's consider just a single contiguous slice without "boring" intervals

  const scale = scaleLinear()
    .domain([location.start, location.end])
    .rangeRound([0, Math.floor(width)]);

  const { geneTracks } = featureTracks;

  return (
    <svg
      viewBox={`0 0 ${width} ${imageHeight}`}
      ref={setImageRef}
      className={styles.image}
      style={{
        width: `${width}px`,
        height: `${imageHeight}px`,
        borderStyle: 'dashed',
        borderWidth: '1px',
        borderColor: 'var(--color-dark-grey)'
      }}
    >
      <RegionOverviewLocationSelector
        activeGenomeId={activeGenomeId}
        imageRef={imageRef}
        height={imageHeight}
        width={width}
        scale={scale}
      >
        <GeneTracks
          regionData={data}
          tracks={geneTracks}
          scale={scale}
          width={width}
          focusGeneId={focusGeneId}
          onFocusGeneChange={props.onFocusGeneChange}
        />
        <RegulatoryFeatureTracks
          offsetTop={regulatoryFeatureTracksTopOffset}
          features={data.regulatory_features.data}
          featureTypesMap={data.regulatory_features.feature_types}
          scale={scale}
        />
      </RegionOverviewLocationSelector>
    </svg>
  );
};

const GeneTracks = (props: {
  regionData: Props['data'];
  tracks: FeatureTracks['geneTracks'];
  scale: ScaleLinear<number, number>;
  width: number; // full svg width
  focusGeneId: string | null;
  onFocusGeneChange: Props['onFocusGeneChange'];
}) => {
  const { forwardStrandTracks, reverseStrandTracks } = props.tracks;
  let tempY = GENE_TRACKS_TOP_OFFSET; // keep track of the y coordinate for subsequent shapes to be drawn

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
  tempY = strandDividerY + GENE_TRACK_HEIGHT;

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

    return tracks.map((_, index) => (
      <GeneTrack
        regionData={props.regionData}
        tracks={tracks}
        trackIndex={index}
        trackOffsetsTop={yCoordLookup}
        scale={props.scale}
        focusGeneId={props.focusGeneId}
        onFocusGeneChange={props.onFocusGeneChange}
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
  regionData: Props['data'];
  tracks: GeneTrack[];
  trackIndex: number;
  trackOffsetsTop: number[];
  scale: ScaleLinear<number, number>;
  focusGeneId: string | null;
  onFocusGeneChange: Props['onFocusGeneChange'];
}) => {
  const { tracks, trackIndex, trackOffsetsTop, scale, focusGeneId } = props;
  const track = tracks[trackIndex];
  const offsetTop = trackOffsetsTop[trackIndex];

  const geneElements = track.map((gene) => {
    const isFocusGene = focusGeneId === gene.data.stable_id;

    return (
      <Fragment key={gene.data.stable_id}>
        <RegionOverviewGene
          gene={gene}
          regionData={props.regionData}
          offsetTop={offsetTop}
          scale={scale}
          isFocused={isFocusGene}
          onClick={props.onFocusGeneChange}
        />
        {isFocusGene && (
          <TranscriptionStartSites
            tss={gene.data.tss}
            strand={gene.data.strand}
            scale={scale}
            geneTracks={tracks}
            trackIndex={trackIndex}
            trackOffsetsTop={trackOffsetsTop}
          />
        )}
      </Fragment>
    );
  });

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

  // TODO: distribution of regulatory features across tracks should be done in a separate function;
  // and the result should inform the height of the image
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
  track: RegulatoryFeature[];
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

export const getImageHeightAndTopOffsets = (featureTracks: FeatureTracks) => {
  const { geneTracks, regulatoryFeatureTracks } = featureTracks;
  const { forwardStrandTracks, reverseStrandTracks } = geneTracks;

  const strandDividerTopOffset =
    GENE_TRACKS_TOP_OFFSET +
    forwardStrandTracks.length * GENE_TRACK_HEIGHT +
    0.5 * GENE_TRACK_HEIGHT;

  const regulatoryFeatureTracksTopOffset =
    strandDividerTopOffset +
    GENE_TRACK_HEIGHT +
    reverseStrandTracks.length * GENE_TRACK_HEIGHT +
    REGULATORY_FEATURE_TRACKS_TOP_OFFSET;

  const imageHeight =
    regulatoryFeatureTracksTopOffset +
    regulatoryFeatureTracks.length * REGULATORY_FEATURE_TRACK_HEIGHT;

  return {
    strandDividerTopOffset,
    regulatoryFeatureTracksTopOffset,
    imageHeight
  };
};

export default RegionOverviewImage;
