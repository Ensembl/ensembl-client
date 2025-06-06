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

import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';

import * as urlFor from 'src/shared/helpers/urlHelper';

import { MAX_SLICE_LENGTH_FOR_DETAILED_VIEW } from 'src/content/app/regulatory-activity-viewer/constants/activityViewerConstants';

import { fetchRegionDetails } from 'src/content/app/regulatory-activity-viewer/services/region-data-service/regionDataService';
import { calculateRequestLocation } from 'src/content/app/regulatory-activity-viewer/components/region-overview/calculateRequestLocation';

import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';
import useRegionOverviewData from 'src/content/app/regulatory-activity-viewer/services/region-data-service/useRegionOverviewData';

import GeneName from 'src/shared/components/gene-name/GeneName';
import TextButton from 'src/shared/components/text-button/TextButton';
import RegulatoryFeatureLegend from '../regulatory-feature-legend/RegulatoryFeatureLegend';

import type {
  OverviewRegion,
  GeneInRegionOverview
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

import styles from './SidebarDefaultView.module.css';

const SidebarDefaultView = () => {
  const {
    assemblyAccessionId,
    location,
    genomeIdForUrl,
    locationForUrl,
    focusGeneId
  } = useActivityViewerIds();
  const navigate = useNavigate();

  const regionOverviewDataParams = useMemo(() => {
    return assemblyAccessionId && location
      ? {
          assemblyId: assemblyAccessionId,
          regionName: location.regionName,
          start: location.start,
          end: location.end
        }
      : null;
  }, [assemblyAccessionId, location]);

  const { data } = useRegionOverviewData(regionOverviewDataParams);

  useEffect(() => {
    if (!assemblyAccessionId || !location) {
      return;
    }

    const regionDataRequestParams = calculateRequestLocation({
      assemblyId: assemblyAccessionId,
      regionName: location.regionName,
      start: location.start,
      end: location.end
    });

    fetchRegionDetails(regionDataRequestParams);
  }, [assemblyAccessionId, location]);

  if (!data || !location) {
    return null;
  }

  const onGeneFocus = (gene: GeneInRegionOverview) => {
    if (!genomeIdForUrl || !locationForUrl) {
      // this should not happen
      return;
    }

    const newUrl = urlFor.regulatoryActivityViewer({
      genomeId: genomeIdForUrl,
      location: locationForUrl,
      focusGeneId: gene.unversioned_stable_id
    });
    navigate(newUrl);
  };

  const { start, end } = location;
  const sliceLength = end - start + 1;
  const isSliceTooLarge = sliceLength > MAX_SLICE_LENGTH_FOR_DETAILED_VIEW;

  return (
    <div>
      {isSliceTooLarge ? (
        <SliceTooLargeNotice />
      ) : (
        <Genes
          genes={data.genes}
          onGeneFocus={onGeneFocus}
          focusGeneId={focusGeneId}
        />
      )}
      <RegulatoryFeatureLegendSection
        featureTypes={data.regulatory_features.feature_types}
      />
    </div>
  );
};

const Genes = ({
  genes,
  onGeneFocus,
  focusGeneId
}: {
  genes: GeneInRegionOverview[];
  focusGeneId?: string | null;
  onGeneFocus: (gene: GeneInRegionOverview) => void;
}) => {
  const geneElements = genes.map((gene) => {
    const isFocusGene = gene.unversioned_stable_id === focusGeneId;

    return (
      <div key={gene.stable_id}>
        <TextButton
          onClick={() => onGeneFocus(gene)}
          disabled={isFocusGene}
          className={isFocusGene ? styles.activeFeature : undefined}
        >
          <GeneName symbol={gene.symbol} stable_id={gene.stable_id} />
        </TextButton>
      </div>
    );
  });

  // TODO: change this into an accordion
  return (
    <div>
      <div style={{ fontWeight: 'bold' }}>Genes</div>
      {geneElements}
    </div>
  );
};

const RegulatoryFeatureLegendSection = (props: {
  featureTypes: OverviewRegion['regulatory_features']['feature_types'];
}) => {
  // TODO: change this into an accordion
  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ fontWeight: 'bold' }}>Regulatory features</div>
      <RegulatoryFeatureLegend featureTypes={props.featureTypes} />
    </div>
  );
};

const SliceTooLargeNotice = () => {
  return <div>Please zoom in into the region to see the list of genes</div>;
};

export default SidebarDefaultView;
