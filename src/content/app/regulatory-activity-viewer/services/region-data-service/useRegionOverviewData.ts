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

import { useState, useEffect } from 'react';
import { map, filter } from 'rxjs';

import { regionDetailsState$ } from 'src/content/app/regulatory-activity-viewer/services/region-data-service/regionDataService';

import {
  createBins,
  createBinKey
} from 'src/content/app/regulatory-activity-viewer/services/region-data-service/binsHelper';

import type {
  OverviewRegion,
  GeneInRegionOverview,
  RegulatoryFeature
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

export type RegionData = {
  assemblyId: string;
  region: OverviewRegion['region'];
  genes: OverviewRegion['genes'];
  regulatory_features: OverviewRegion['regulatory_features'];
};

const isInQueriedSlice = (
  feature: { start: number; end: number },
  query: { start: number; end: number }
) => {
  return feature.end >= query.start && feature.start <= query.end;
};

type QueryParams = {
  assemblyId: string;
  regionName: string;
  start: number;
  end: number;
};

const createDataObservable = (query: QueryParams) => {
  return regionDetailsState$.pipe(
    filter((state) => {
      const binKeys = createBins({
        start: query.start,
        end: query.end
      }).map(createBinKey);

      return (
        !!state.data &&
        query.assemblyId === state.data.assemblyId &&
        query.regionName === state.data.region.name &&
        binKeys.every((key) => !!state.data!.bins[key])
      );
    }),
    map((state) => {
      const stateData = state.data as NonNullable<typeof state.data>;
      const binKeys = createBins({
        start: query.start,
        end: query.end
      }).map(createBinKey);

      const genes: GeneInRegionOverview[] = [];
      const regulatoryFeatures: RegulatoryFeature[] = [];

      for (let i = 0; i < binKeys.length; i++) {
        const key = binKeys[i];
        const bin = stateData.bins[key];

        const prevBinKey = i > 0 ? binKeys[i - 1] : null;
        const prevBinEnd = prevBinKey
          ? parseInt(prevBinKey.split('-').pop() as string)
          : null;

        for (const gene of bin.genes) {
          if (!isInQueriedSlice(gene, query)) {
            continue;
          } else if (prevBinEnd && gene.start <= prevBinEnd) {
            continue;
          } else {
            genes.push(gene);
          }
        }

        for (const regFeature of bin.regulatory_features) {
          if (!isInQueriedSlice(regFeature, query)) {
            continue;
          } else if (prevBinEnd && regFeature.start <= prevBinEnd) {
            continue;
          } else {
            regulatoryFeatures.push(regFeature);
          }
        }
      }

      return {
        assemblyId: stateData.assemblyId,
        region: stateData.region,
        genes,
        regulatory_features: {
          feature_types: stateData.regulatory_feature_types,
          data: regulatoryFeatures
        }
      };
    })
  );
};

const useRegionOverviewData = (params: QueryParams | null) => {
  const [data, setData] = useState<RegionData | null>(null);

  const assemblyId = params?.assemblyId;
  const regionName = params?.regionName;
  const start = params?.start;
  const end = params?.end;

  useEffect(() => {
    if (!assemblyId || !regionName || !start || !end) {
      return;
    }

    const data$ = createDataObservable({
      assemblyId,
      regionName,
      start,
      end
    });
    const subscription = data$.subscribe((data) => {
      setData(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [assemblyId, regionName, start, end]);

  // FIXME: should somehow return the loading flag as well
  return {
    data
  };
};

export default useRegionOverviewData;
