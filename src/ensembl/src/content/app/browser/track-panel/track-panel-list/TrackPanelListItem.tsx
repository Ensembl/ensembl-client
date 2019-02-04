import React, { PureComponent } from 'react';
import { TrackPanelItem, trackPanelIconConfig } from '../trackPanelConfig';

import chevronDownIcon from 'static/img/track-panel/chevron-down.svg';
import chevronUpIcon from 'static/img/track-panel/chevron-up.svg';

import styles from './TrackPanelListItem.scss';

type TrackPanelListItemProps = {
  className: string;
  track: TrackPanelItem;
  changeTrack: (name: string) => void;
  additionalInfo?: string;
};

class TrackPanelListItem extends PureComponent<TrackPanelListItemProps> {
  private expanded: boolean = false;

  constructor(props: TrackPanelListItemProps) {
    super(props);

    this.changeTrackHandler = this.changeTrackHandler.bind(this);
  }

  public changeTrackHandler() {
    this.props.changeTrack(this.props.track.name);
  }

  public render() {
    const { className, track, additionalInfo } = this.props;
    const listItemClass = styles[className] || '';

    return (
      <dd className={`${styles.listItem} ${listItemClass}`}>
        <label>
          {track.color && (
            <span className={`${styles.box} ${styles[track.color]}`} />
          )}
          <span className={styles.mainText}>{track.label}</span>
          {additionalInfo && (
            <span className={styles.additionalInfo}>{additionalInfo}</span>
          )}
          <button>
            <img
              className={styles.expandIcon}
              src={this.expanded ? chevronUpIcon : chevronDownIcon}
              alt={this.expanded ? 'collapse' : 'expand'}
            />
          </button>
        </label>
        <button onClick={this.changeTrackHandler}>
          <img
            src={trackPanelIconConfig.ellipsis.icon.on}
            alt={`Go to ${track.label}`}
          />
        </button>
        <button>
          <img
            src={trackPanelIconConfig.eye.icon.on}
            alt={trackPanelIconConfig.ellipsis.description}
          />
        </button>
      </dd>
    );
  }
}

export default TrackPanelListItem;
