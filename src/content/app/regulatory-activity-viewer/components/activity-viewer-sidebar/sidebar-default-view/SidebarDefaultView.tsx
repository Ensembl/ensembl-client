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

import { fetchRegionDetails } from 'src/content/app/regulatory-activity-viewer/services/region-data-service/regionDataService';
import { calculateRequestLocation } from 'src/content/app/regulatory-activity-viewer/components/region-overview/calculateRequestLocation';

import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';
import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';
import useRegionOverviewData from 'src/content/app/regulatory-activity-viewer/services/region-data-service/test-component/useRegionOverviewData';

import RegulatoryFeatureLegend from '../regulatory-feature-legend/RegulatoryFeatureLegend';

import type { OverviewRegion } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

const SidebarDefaultView = () => {
  const { activeGenomeId, assemblyName, location } = useActivityViewerIds();
  const { data: karyotype } = useGenomeKaryotypeQuery(activeGenomeId ?? '', {
    skip: !activeGenomeId
  });

  const regionOverviewDataParams = useMemo(() => {
    return assemblyName && location
      ? {
          assemblyName,
          regionName: location.regionName,
          start: location.start,
          end: location.end
        }
      : null;
  }, [assemblyName, location]);

  const { data } = useRegionOverviewData(regionOverviewDataParams);

  useEffect(() => {
    if (!assemblyName || !location || !karyotype) {
      return;
    }

    const regionInKaryotype = karyotype.find(
      (region) => region.name === location.regionName
    );

    const regionDataRequestParams = calculateRequestLocation({
      assemblyName,
      regionName: location.regionName,
      start: location.start,
      end: location.end,
      regionLength: regionInKaryotype?.length ?? 0
    });

    fetchRegionDetails(regionDataRequestParams);
  }, [assemblyName, location, karyotype]);

  if (!data || !location) {
    return null;
  }

  const { start, end } = location;
  const sliceLength = end - start + 1;
  const isSliceTooLarge = sliceLength > 1_000_000; // FIXME: this should be imported as a constant

  return (
    <div>
      {isSliceTooLarge ? <SliceTooLargeNotice /> : <Genes genes={data.genes} />}
      <RegulatoryFeatureLegendSection
        featureTypes={data.regulatory_features.feature_types}
      />
    </div>
  );
};

const Genes = (props: { genes: OverviewRegion['genes'] }) => {
  const genes = props.genes.map((gene) => (
    <div key={gene.stable_id}>
      {gene.symbol}
      {'  '}
      {gene.stable_id}
    </div>
  ));

  // TODO: change this into an accordion
  return (
    <div>
      <div style={{ fontWeight: 'bold' }}>Genes</div>
      {genes}
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
