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

export type AnalyticsOptions = {
  category: string;
  action: string;
  label?: string;
  value?: number;
  species?: string;
  app?: string;
  feature?: string;
};

/*
  These dimensions are defined here:
  Analytics -> 2020 -> Admin -> Custom Definitions -> Custom Dimensions
*/
export enum CustomDimensions {
  SPECIES = 'dimension1',
  APP = 'dimension2',
  FEATURE = 'dimension3'
}

export type AnalyticsType = {
  ga: AnalyticsOptions;
};

const buildAnalyticsObject = (data: AnalyticsOptions): AnalyticsType => {
  return {
    ga: data
  };
};

export default buildAnalyticsObject;
