import { Status } from 'src/shared/types/status';

export enum TrackItemColour {
  BLUE = 'blue',
  DARK_GREY = 'darkGrey',
  GREY = 'grey',
  WHITE = 'white'
}

export type TrackItemColourKey = keyof typeof TrackItemColour;

export type TrackActivityStatus = Status.ACTIVE | Status.INACTIVE;

export enum TrackSet {
  GENOMIC = 'Genomic',
  VARIATION = 'Variation',
  EXPRESSION = 'Expression'
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
  [genomeId: string]: {
    [categoryName: string]: {
      [trackName: string]: TrackActivityStatus;
    };
  };
};

export enum TrackId {
  GENE = 'track:gene-feat'
}
