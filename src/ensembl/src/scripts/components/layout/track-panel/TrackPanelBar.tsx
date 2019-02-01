import React, { PureComponent } from 'react';

import {
  trackPanelBarConfig,
  TrackPanelBarItem
} from '../../../configs/trackPanelBarConfig';

import TrackPanelBarIcon from './TrackPanelBarIcon';

import chevronLeftIcon from 'assets/img/track-panel/chevron-left.svg';
import chevronRightIcon from 'assets/img/track-panel/chevron-right.svg';

type TrackPanelBarProps = {
  closeDrawer: () => void;
  drawerOpened: boolean;
  trackPanelOpened: boolean;
  toggleTrackPanel: () => void;
};

class TrackPanelBar extends PureComponent<TrackPanelBarProps> {
  constructor(props: TrackPanelBarProps) {
    super(props);

    this.moveTrackPanel = this.moveTrackPanel.bind(this);
  }

  public moveTrackPanel() {
    if (this.props.drawerOpened === true) {
      this.props.closeDrawer();
    } else {
      this.props.toggleTrackPanel();
    }
  }

  public render() {
    return (
      <div className="track-panel-bar">
        <dl>
          <dt className="slider">
            <button onClick={this.moveTrackPanel}>
              {this.props.trackPanelOpened ? (
                <img src={chevronRightIcon} alt="collapse" />
              ) : (
                <img src={chevronLeftIcon} alt="expand" />
              )}
            </button>
          </dt>
          {trackPanelBarConfig.map((item: TrackPanelBarItem) => (
            <TrackPanelBarIcon key={item.name} iconConfig={item} />
          ))}
        </dl>
      </div>
    );
  }
}

export default TrackPanelBar;
