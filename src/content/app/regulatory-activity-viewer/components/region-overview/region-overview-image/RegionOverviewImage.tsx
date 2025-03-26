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

import { Fragment, useRef } from 'react';
import { type ScaleLinear } from 'd3';

import {
  getScaleForWholeLocation,
  getScaleForViewport
} from './regionOverviewImageHelpers';

import useRefWithRerender from 'src/shared/hooks/useRefWithRerender';

import RegionOverviewGene from './region-overview-gene/RegionOverviewGene';
import RegionOverviewRegulatoryFeature from './region-overview-regulatory-feature/RegionOverviewRegulatoryFeature';
import TranscriptionStartSites from './transcription-start-sites/TranscriptionStartSites';
import RegionOverviewLocationSelector from './region-overview-location-selector/RegionOverviewLocationSelector';
import TranslateRegionOverviewContents from './TranslateRegionOverviewContents';
import ActivityViewerPopup, {
  type ActivityViewerPopupMethods
} from 'src/content/app/regulatory-activity-viewer/components/activity-viewer-popup/ActivityViewerPopup';

import {
  GENE_TRACKS_TOP_OFFSET,
  GENE_TRACK_HEIGHT,
  REGULATORY_FEATURE_TRACKS_TOP_OFFSET,
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
import type { RegionData } from 'src/content/app/regulatory-activity-viewer/services/region-data-service/test-component/useRegionOverviewData';
import type { PopupMessage } from 'src/content/app/regulatory-activity-viewer/components/activity-viewer-popup/activityViewerPopupMessageTypes';
import type { GenomicLocation } from 'src/shared/helpers/genomicLocationHelpers';

import styles from './RegionOverviewImage.module.css';

type Props = {
  activeGenomeId: string;
  width: number;
  data: RegionData;
  featureTracks: FeatureTracks;
  extendedLocation: GenomicLocation;
  location: GenomicLocation;
  focusGeneId?: string | null; // TODO: this will need to evolve, because focused feature does not have to be gene; also, focus object will probably come from redux
};

/**
 * Ideas:
 *  - onTracksSettled callback? It will contain the logic for distributing features (especially transcripts)
 *    into tracks inside of the image component. The logic will have to account for the "bumping",
 *    which would probably need to consider the widths and the scales; so it might be natural to contain it
 *    within the image component
 */

const RegionOverviewImage = (props: Props) => {
  const {
    activeGenomeId,
    width,
    featureTracks,
    data,
    location,
    extendedLocation,
    focusGeneId
  } = props;
  const [imageRef, setImageRef] = useRefWithRerender<SVGSVGElement>(null);
  const activityViewerPopupRef = useRef<ActivityViewerPopupMethods>(null);

  const onMount = (element: SVGSVGElement) => {
    setImageRef(element);

    const handlePopupMessageEvent = (event: Event) => {
      const message = (event as CustomEvent).detail as PopupMessage;
      activityViewerPopupRef.current?.showPopup(message);
    };
    element.addEventListener('popup-message', handlePopupMessageEvent);

    return () => {
      element.removeEventListener('popup-message', handlePopupMessageEvent);
    };
  };

  const { imageHeight, regulatoryFeatureTracksTopOffset } =
    getImageHeightAndTopOffsets(featureTracks);

  const scaleForWholeLocation = getScaleForWholeLocation({
    location: extendedLocation,
    detailLocation: location,
    viewportWidth: width
  });
  const scaleForViewport = getScaleForViewport({
    location: extendedLocation,
    detailLocation: location,
    viewportWidth: width
  });

  const { geneTracks } = featureTracks;

  return (
    <svg
      viewBox={`0 0 ${width} ${imageHeight}`}
      ref={onMount}
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
        regionName={location.regionName}
        imageRef={imageRef}
        height={imageHeight}
        width={width}
        scale={scaleForViewport}
      >
        <TranslateRegionOverviewContents
          genomeId={activeGenomeId}
          location={extendedLocation}
          regionDetailLocation={location}
          scale={scaleForWholeLocation}
        >
          <GeneTracks
            regionData={data}
            tracks={geneTracks}
            scale={scaleForWholeLocation}
            width={width}
            focusGeneId={focusGeneId}
          />
          <RegulatoryFeatureTracks
            offsetTop={regulatoryFeatureTracksTopOffset}
            features={data.regulatory_features.data}
            featureTypesMap={data.regulatory_features.feature_types}
            regionData={data}
            scale={scaleForWholeLocation}
          />
        </TranslateRegionOverviewContents>
      </RegionOverviewLocationSelector>
      <ActivityViewerPopup ref={activityViewerPopupRef} />
    </svg>
  );
};

const GeneTracks = (props: {
  regionData: Props['data'];
  tracks: FeatureTracks['geneTracks'];
  scale: ScaleLinear<number, number>;
  width: number; // full svg width
  focusGeneId?: string | null;
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
  focusGeneId?: string | null;
}) => {
  const { tracks, trackIndex, trackOffsetsTop, scale, focusGeneId } = props;
  const track = tracks[trackIndex];
  const offsetTop = trackOffsetsTop[trackIndex];

  const geneElements = track.map((gene) => {
    const isFocusGene = focusGeneId === gene.data.unversioned_stable_id;

    return (
      <Fragment key={gene.data.stable_id}>
        <RegionOverviewGene
          gene={gene}
          region={props.regionData.region}
          offsetTop={offsetTop}
          scale={scale}
          isFocused={isFocusGene}
        />
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
  regionData: Props['data'];
  features: RegulatoryFeature[];
  featureTypesMap: OverviewRegion['regulatory_features']['feature_types'];
  offsetTop: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { features, featureTypesMap, offsetTop, regionData, scale } = props;

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
      regionData={regionData}
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
  regionData: Props['data'];
  featureTypesMap: OverviewRegion['regulatory_features']['feature_types'];
  offsetTop: number;
  scale: ScaleLinear<number, number>;
}) => {
  const { track, featureTypesMap, offsetTop, scale, regionData } = props;

  const featureElements = track.map((feature) => {
    return (
      <RegionOverviewRegulatoryFeature
        key={feature.id}
        feature={feature}
        featureTypesMap={featureTypesMap}
        region={regionData.region}
        offsetTop={offsetTop}
        scale={scale}
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
