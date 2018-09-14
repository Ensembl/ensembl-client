import React, { SFC } from 'react';
import { TrackPanelBarItem } from '../../../configs/trackPanelBarConfig';

type TrackPanelBarIconProps = {
  iconConfig: TrackPanelBarItem;
};

const TrackPanelBarIcon: SFC<TrackPanelBarIconProps> = (props: TrackPanelBarIconProps) => (
  <dt>
    <img
      src={props.iconConfig.icon.default}
      alt={props.iconConfig.description}
    />
  </dt>
);

export default TrackPanelBarIcon;
