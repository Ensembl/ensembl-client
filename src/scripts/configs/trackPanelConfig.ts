import { TrackOne, TrackTwo, TrackComponent } from './tracks';

import eyeOnIcon from 'assets/img/track-panel/eye-on.svg';
import eyeOffIcon from 'assets/img/track-panel/eye-off.svg';

import ellipsisOnIcon from 'assets/img/track-panel/ellipsis-on.svg';
import ellipsisOffIcon from 'assets/img/track-panel/ellipsis-off.svg';

export type TrackPanelConfig = {
  component: TrackComponent;
  id: number;
  label: string;
  name: string;
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

export const trackPanelConfig: TrackPanelConfig[] = [
  {
    component: TrackOne,
    id: 1,
    label: 'Track 1',
    name: 'track-one'
  },
  {
    component: TrackTwo,
    id: 2,
    label: 'Track 2',
    name: 'track-two'
  }
];

export const trackPanelIconConfig: TrackPanelIcons = {
  ellipsis: {
    description: 'open track',
    icon: {
      off: ellipsisOffIcon,
      on: ellipsisOnIcon
    }
  },
  eye: {
    description: 'enable/disable track',
    icon: {
      off: eyeOffIcon,
      on: eyeOnIcon
    }
  }
};
