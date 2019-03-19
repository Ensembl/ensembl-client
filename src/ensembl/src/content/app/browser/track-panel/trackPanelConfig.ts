import eyeOnIcon from 'static/img/track-panel/eye-on.svg';
import eyeOffIcon from 'static/img/track-panel/eye-off.svg';

import ellipsisOnIcon from 'static/img/track-panel/ellipsis-on.svg';
import ellipsisOffIcon from 'static/img/track-panel/ellipsis-off.svg';

export enum TrackItemColour {
  BLUE = 'blue',
  DARK_GREY = 'darkGrey',
  GREY = 'grey',
  WHITE = 'white'
}

export type TrackPanelItem = {
  additionalInfo?: string;
  childTrackList?: TrackPanelItem[];
  color?: string;
  drawerView?: string;
  id: number;
  label: string;
  name: string;
  selectedInfo?: string;
};

export enum TrackType {
  GENOMIC = 'Genomic',
  VARIATION = 'Variation',
  EXPRESSION = 'Expression'
}

export type TrackPanelCategory = {
  name: string;
  trackList: TrackPanelItem[];
  types: TrackType[];
};

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

export const trackPanelIconConfig: TrackPanelIcons = {
  ellipsis: {
    description: 'open track',
    icon: {
      off: ellipsisOffIcon,
      on: ellipsisOnIcon
    }
  }
};
