import React, { Component } from 'react';

import TrackPanelListItem from './TrackPanelListItem';
import {
  TrackPanelConfig,
  trackPanelConfig
} from '../../../configs/trackPanelConfig';

type TrackPanelListProps = {
  currentTrack: string;
  openDrawer: () => void;
  updateTrack: (currentTrack: string) => void;
};

class TrackPanelList extends Component<TrackPanelListProps> {
  constructor(props: TrackPanelListProps) {
    super(props);

    this.changeTrack = this.changeTrack.bind(this);
  }

  public changeTrack(currentTrack: string) {
    const { openDrawer, updateTrack } = this.props;

    updateTrack(currentTrack);
    openDrawer();
  }

  public render() {
    return (
      <div className="track-panel-list">
        <dl>
          {trackPanelConfig.map((track: TrackPanelConfig) => (
            <TrackPanelListItem
              key={track.id}
              className={this.getTrackClass(track.name)}
              track={track}
              changeTrack={this.changeTrack}
            />
          ))}
        </dl>
      </div>
    );
  }

  private getTrackClass(trackName: string): string {
    if (this.props.currentTrack === trackName) {
      return 'current-track';
    } else {
      return '';
    }
  }
}

export default TrackPanelList;
