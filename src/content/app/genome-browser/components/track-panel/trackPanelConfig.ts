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

import { Status } from 'src/shared/types/status';

export enum TrackItemColour {
  BLUE = 'blue',
  DARK_GREY = 'darkGrey',
  LIGHT_GREY = 'lightGrey'
}

export type TrackItemColourKey = keyof typeof TrackItemColour;

export type TrackActivityStatus =
  | Status.SELECTED
  | Status.UNSELECTED
  | Status.PARTIALLY_SELECTED;

export enum TrackSet {
  GENOMIC = 'Genomic',
  VARIATION = 'Variation',
  EXPRESSION = 'Regulation'
}

export type TrackSetKey = keyof typeof TrackSet;

export type TrackPanelIcon = {
  description: string;
  icon: {
    off: string;
    on: string;
  };
};

export type TrackPanelIcons = {
  [key: string]: TrackPanelIcon;
};

export type TrackStates = {
  [categoryName: string]: {
    [trackName: string]: TrackActivityStatus;
  };
};

// we might need to add other types for variants and regulation?
export type GeneTrackStates = {
  [objectId: string]: {
    gene: {
      status?: TrackActivityStatus;
      transcripts?: string[];
    };
  };
};

export type GenomeTrackStates = {
  commonTracks?: TrackStates;
  objectTracks?: GeneTrackStates;
};

export type BrowserTrackStates = {
  [genomeId: string]: GenomeTrackStates;
};

export enum TrackId {
  GENE = 'focus'
}
