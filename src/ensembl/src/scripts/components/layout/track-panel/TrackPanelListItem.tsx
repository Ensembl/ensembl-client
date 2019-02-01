import React, { PureComponent } from 'react';
import {
  TrackPanelConfig,
  trackPanelIconConfig
} from '../../../configs/trackPanelConfig';

type TrackPanelListItemProps = {
  className: string;
  track: TrackPanelConfig;
  changeTrack: (name: string) => void;
};

class TrackPanelListItem extends PureComponent<TrackPanelListItemProps> {
  constructor(props: TrackPanelListItemProps) {
    super(props);

    this.changeTrackHandler = this.changeTrackHandler.bind(this);
  }

  public changeTrackHandler() {
    this.props.changeTrack(this.props.track.name);
  }

  public render() {
    return (
      <dt className={this.props.className}>
        <label>{this.props.track.label}</label>
        <button onClick={this.changeTrackHandler}>
          <img
            src={trackPanelIconConfig.ellipsis.icon.on}
            alt={`Go to ${this.props.track.label}`}
          />
        </button>
        <button>
          <img
            src={trackPanelIconConfig.eye.icon.on}
            alt={trackPanelIconConfig.ellipsis.description}
          />
        </button>
      </dt>
    );
  }
}

export default TrackPanelListItem;
