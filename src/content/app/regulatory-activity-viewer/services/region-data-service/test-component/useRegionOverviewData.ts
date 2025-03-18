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

import { useState, useEffect, useRef } from 'react';
import { ReplaySubject, map, filter, combineLatestWith } from 'rxjs';

import { regionDetailsState$ } from 'src/content/app/regulatory-activity-viewer/services/region-data-service/regionDataService';

import {
  createBins,
  createBinKey
} from 'src/content/app/regulatory-activity-viewer/services/region-data-service/binsHelper';

import type {
  GeneInRegionOverview,
  RegulatoryFeature
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';

type RegionDetailsQueryPayload = {
  assemblyName: string;
  regionName: string;
  start: number;
  end: number;
};

const regionDetailsStateQuery$ = new ReplaySubject<RegionDetailsQueryPayload>(
  1
);

export const regionDetailsSelection$ = regionDetailsStateQuery$.pipe(
  combineLatestWith(regionDetailsState$),
  filter(([query, state]) => {
    const binKeys = createBins({
      start: query.start,
      end: query.end
    }).map(createBinKey);

    return (
      !!state.data &&
      query.assemblyName === state.data.assemblyName &&
      query.regionName === state.data.regionName &&
      binKeys.every((key) => !!state.data!.bins[key])
    );
  }),
  map(([query, state]) => {
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
        if (prevBinEnd && gene.start <= prevBinEnd) {
          continue;
        } else {
          genes.push(gene);
        }
      }

      for (const regFeature of bin.regulatory_features) {
        if (prevBinEnd && regFeature.start <= prevBinEnd) {
          continue;
        } else {
          regulatoryFeatures.push(regFeature);
        }
      }
    }

    return {
      assemblyName: stateData.assemblyName,
      regionName: stateData.regionName,
      genes,
      regulatory_features: {
        feature_types: stateData.regulatory_feature_types,
        data: regulatoryFeatures
      }
    };
  })
);

const useRegionOverviewData = (
  params: {
    assemblyName: string;
    regionName: string;
    start: number;
    end: number;
  } | null
) => {
  const [data, setData] = useState<any>(); // FIXME: declare type
  const prevParams = useRef<typeof params>(null);

  useEffect(() => {
    const subscription = regionDetailsSelection$.subscribe((data) => {
      setData(data);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (
      !params ||
      (params?.assemblyName === prevParams.current?.assemblyName &&
        params?.regionName === prevParams.current?.regionName &&
        params?.start === prevParams.current?.start &&
        params?.end === prevParams.current?.end)
    ) {
      return;
    }

    regionDetailsStateQuery$.next(params);
    prevParams.current = params;
  }, [params]);

  // eslint-disable-next-line
  console.log('data in useRegionOverviewData', data);
};

export default useRegionOverviewData;
