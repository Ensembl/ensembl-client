import React, { SFC } from 'react';
import { TrackPanelBarItem } from '../../../configs/trackPanelBarConfig';

type TrackPanelBarIconProps = {
  iconConfig: TrackPanelBarItem;
};

const TrackPanelBarIcon: SFC<TrackPanelBarIconProps> = (
  props: TrackPanelBarIconProps
) => (
  <dt>
    <button>
      <img
        src={props.iconConfig.icon.default}
        alt={props.iconConfig.description}
      />
    </button>
  </dt>
);

export default TrackPanelBarIcon;
