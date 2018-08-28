import React, { SFC, ReactEventHandler } from 'react';

const squareIcon = require('assets/img/track-panel/square-regular.svg');
const chevronLeftIcon = require('assets/img/track-panel/chevron-left-solid.svg');
const chevronRightIcon = require('assets/img/track-panel/chevron-right-solid.svg');

type TrackPanelBarProps = {
  expanded: boolean,
  toggleTrackPanel: ReactEventHandler
};

const TrackPanelBar: SFC<TrackPanelBarProps> = (props: TrackPanelBarProps) => (
  <div className="track-panel-bar">
    <dl>
      <dt className="slider">
        <button onClick={props.toggleTrackPanel}>
          {props.expanded ? <img src={chevronRightIcon} alt="collapse" /> : <img src={chevronLeftIcon} alt="expand" />}
        </button>
      </dt>
      <dt><img src={squareIcon} alt="" /></dt>
      <dt><img src={squareIcon} alt="" /></dt>
      <dt><img src={squareIcon} alt="" /></dt>
      <dt className="reset"><img src={squareIcon} alt="" /></dt>
    </dl>
  </div>
);

export default TrackPanelBar;
