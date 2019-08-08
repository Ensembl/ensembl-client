import { ImageButtonStatus } from 'src/shared/image-button/ImageButton';

export enum TrackItemColour {
  BLUE = 'blue',
  DARK_GREY = 'darkGrey',
  GREY = 'grey',
  WHITE = 'white'
}

export type TrackItemColourKey = keyof typeof TrackItemColour;

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
      [trackName: string]: ImageButtonStatus;
    };
  };
};

export type TrackToggleStates = {
  [key: string]: boolean;
};
