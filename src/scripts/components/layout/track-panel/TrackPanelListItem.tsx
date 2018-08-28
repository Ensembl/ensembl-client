import React, { SFC } from 'react';
import { TrackPanelConfig } from '../../../configs/trackPanelConfig';

type TrackPanelListItemProps = {
  className: string,
  track: TrackPanelConfig
  changeTrack: (name: string) => void
};

const ellipsisIcon = require('assets/img/track-panel/ellipsis-h-solid.svg');
const eyeIcon = require('assets/img/track-panel/eye-solid.svg');

const TrackPanelListItem: SFC<TrackPanelListItemProps> = (props: TrackPanelListItemProps) => (
  <dt className={props.className}>
    <label>{props.track.label}</label>
    <button onClick={() => props.changeTrack(props.track.name)}>
      <img src={ellipsisIcon} alt={`Go to ${props.track.label}`} />
    </button>
    <button>
      <img src={eyeIcon} alt="" />
    </button>
  </dt>
);

export default TrackPanelListItem;
