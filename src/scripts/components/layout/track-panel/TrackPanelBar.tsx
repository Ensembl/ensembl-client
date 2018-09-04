import React, { SFC, ReactEventHandler } from 'react';

import { trackPanelBarConfig, TrackPanelBarItem } from '../../../configs/trackPanelBarConfig';

import chevronLeftIcon from 'assets/img/track-panel/chevron-left.svg';
import chevronRightIcon from 'assets/img/track-panel/chevron-right.svg';

type TrackPanelBarIconProps = {
  iconConfig: TrackPanelBarItem
};

type TrackPanelBarProps = {
  expanded: boolean,
  toggleTrackPanel: ReactEventHandler
};

const TrackPanelBarIcon: SFC<TrackPanelBarIconProps> = (props: TrackPanelBarIconProps) => (
  <dt><img src={props.iconConfig.icon.default} alt={props.iconConfig.description}/></dt>
);

const TrackPanelBar: SFC<TrackPanelBarProps> = (props: TrackPanelBarProps) => (
  <div className="track-panel-bar">
    <dl>
      <dt className="slider">
        <button onClick={props.toggleTrackPanel}>
          {props.expanded ? <img src={chevronRightIcon} alt="collapse" /> : <img src={chevronLeftIcon} alt="expand" />}
        </button>
      </dt>
      {trackPanelBarConfig.map((item: TrackPanelBarItem) => <TrackPanelBarIcon key={item.name} iconConfig={item} />)}
    </dl>
  </div>
);

export default TrackPanelBar;
