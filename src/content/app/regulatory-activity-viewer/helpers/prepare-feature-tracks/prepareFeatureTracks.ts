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

import type {
  OverviewRegion,
  GeneInRegionOverview,
  RegulatoryFeature
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

/**
 * The purpose of this helper is to accept data returned
 * by the Regulation team's region-of-interest api,
 * and to calculate from it the tracks to be displayed in the visualisation.
 *
 * For some features (e.g. regulatory features), the api has an opinion
 * about which track to place them in. For others (e.g. genes), the decision
 * is entirely up to the client.
 *
 * When distributing features, such as genes, across tracks,
 * the helper needs to make sure that features, or their labels,
 * do not overlap with each other.
 */

type Params = {
  data: OverviewRegion;
  start?: number;
  end?: number;
};

export type GeneInTrack = {
  data: GeneInRegionOverview;
};

export type GeneTrack = GeneInTrack[];

export type FeatureTracks = ReturnType<typeof prepareFeatureTracks>;

const prepareFeatureTracks = (params: Params) => {
  const geneTracks = prepareGeneTracks({
    genes: params.data.genes,
    start: params.start,
    end: params.end
  });
  const regulatoryFeatureTracks = prepareRegulatoryFeatureTracks({
    regulatory_features: params.data.regulatory_features,
    start: params.start,
    end: params.end
  });

  return {
    geneTracks,
    regulatoryFeatureTracks
  };
};

const prepareGeneTracks = (params: {
  genes: OverviewRegion['genes'];
  start?: number;
  end?: number;
}) => {
  const { genes } = params;

  const filteredGenes = genes.filter((gene) =>
    isFeatureInsideSelection({
      feature: gene,
      start: params.start,
      end: params.end
    })
  );

  const forwardStrandTracks: GeneTrack[] = [];
  const reverseStrandTracks: GeneTrack[] = [];

  for (const gene of filteredGenes) {
    const geneTracks =
      gene.strand === 'forward' ? forwardStrandTracks : reverseStrandTracks;

    const geneForTrack = prepareGeneForTrack(gene);
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
    forwardStrandTracks,
    reverseStrandTracks
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

const prepareGeneForTrack = (gene: GeneInRegionOverview): GeneInTrack => {
  return {
    data: gene
  };
};

const prepareRegulatoryFeatureTracks = (params: {
  regulatory_features: OverviewRegion['regulatory_features'];
  start?: number;
  end?: number;
}) => {
  const {
    regulatory_features: { feature_types: featureTypesMap, data: features }
  } = params;
  let featureTracks: RegulatoryFeature[][] = [];

  const filteredFeatures = features.filter((feature) =>
    isFeatureInsideSelection({
      feature,
      start: params.start,
      end: params.end
    })
  );

  for (const feature of filteredFeatures) {
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

  // just in case: make sure there are no empty indices in the tracks array
  featureTracks = featureTracks.filter((item) => !!item);
  return featureTracks;
};

// same logic for genes and regulatory features
// (the only consideration is that regulatory features may have extended start or end)
const isFeatureInsideSelection = (params: {
  feature: {
    start: number;
    end: number;
    extended_start?: number;
    extended_end?: number;
  };
  start?: number;
  end?: number;
}) => {
  const { feature, start, end } = params;

  // if start and/or end are not provided, consider feature to be part of selection
  if (!start || !end) {
    return true;
  }

  const isExtendedStartInsideSelection = feature.extended_start
    ? feature.extended_start > start && feature.extended_start < end
    : false;
  const isExtendedEndInsideSelection = feature.extended_end
    ? feature.extended_end > start && feature.extended_end < end
    : false;
  const isFeatureStartInsideSelection =
    feature.start > start && feature.start < end;
  const isFeatureEndInsideSelection = feature.end > start && feature.end < end;
  // for features that fill the viewport and have start/end hanging outside
  const isOverhangingFeature =
    ((feature.extended_start && feature.extended_start < start) ||
      feature.start < start) &&
    ((feature.extended_end && feature.extended_end > end) || feature.end > end);

  return (
    isExtendedStartInsideSelection ||
    isExtendedEndInsideSelection ||
    isFeatureStartInsideSelection ||
    isFeatureEndInsideSelection ||
    isOverhangingFeature
  );
};

export default prepareFeatureTracks;
