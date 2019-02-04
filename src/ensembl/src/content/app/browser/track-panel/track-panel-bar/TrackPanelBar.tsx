import React, { PureComponent } from 'react';

import { trackPanelBarConfig, TrackPanelBarItem } from './trackPanelBarConfig';

import TrackPanelBarIcon from './TrackPanelBarIcon';

import chevronLeftIcon from 'static/img/track-panel/chevron-left.svg';
import chevronRightIcon from 'static/img/track-panel/chevron-right.svg';

import styles from './TrackPanelBar.scss';

type TrackPanelBarProps = {
  closeDrawer: () => void;
  drawerOpened: boolean;
  launchbarExpanded: boolean;
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
      <div className={this.getClassNames()}>
        <dl>
          <dt className={styles.sliderButton}>
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

  private getClassNames() {
    const expandClass: string = this.props.launchbarExpanded
      ? ''
      : styles.expanded;

    return `${styles.trackPanelBar} ${expandClass}`;
  }
}

export default TrackPanelBar;
