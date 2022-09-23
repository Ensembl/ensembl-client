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

export const assetsUrl = '/static';
export const imgBaseUrl = `${assetsUrl}/img`;

export enum BreakpointWidth {
  PHONE = 0,
  TABLET = 600,
  LAPTOP = 900,
  DESKTOP = 1200,
  BIG_DESKTOP = 1800
}

export type ScrollPosition = {
  [key: string]: {
    scrollLeft: number;
    scrollTop: number;
  };
};

export enum AppName {
  GENOME_BROWSER = 'Genome browser',
  SPECIES_SELECTOR = 'Species selector',
  SPEICES_PAGE = 'Species page',
  CUSTOM_DOWNLOADS = 'Custom downloads',
  ENTITY_VIEWER = 'Entity viewer',
  TOOLS = 'Tools' // this is the name of a group of apps
}

export const globalMediaQueries: Record<keyof typeof BreakpointWidth, string> =
  {
    PHONE: 'screen and (max-width: 599px)',
    TABLET: 'screen and (min-width: 600px) and (max-width: 899px)',
    LAPTOP: 'screen and (min-width: 900px) and (max-width: 1199px)',
    DESKTOP: 'screen and (min-width: 1200px) and (max-width: 1799px)',
    BIG_DESKTOP: 'screen and (min-width: 1800px)'
  };
