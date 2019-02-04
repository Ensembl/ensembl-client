import React, { Component } from 'react';

import TrackPanelListItem from './TrackPanelListItem';
import {
  TrackPanelCategory,
  TrackPanelItem,
  trackPanelConfig
} from '../trackPanelConfig';

import styles from './TrackPanelList.scss';

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
      <div className={styles.trackPanelList}>
        <section>
          <dl>
            <TrackPanelListItem
              className="main"
              track={trackPanelConfig.main}
              changeTrack={this.changeTrack}
              additionalInfo="MANE Select transcript /7"
            />
          </dl>
        </section>
        {trackPanelConfig.categories.map((category: TrackPanelCategory) => (
          <section>
            <h4>{category.name}</h4>
            <dl>
              {category.trackList.map((track: TrackPanelItem) => (
                <TrackPanelListItem
                  key={track.id}
                  className={this.getTrackClass(track.name)}
                  track={track}
                  changeTrack={this.changeTrack}
                />
              ))}
            </dl>
          </section>
        ))}
      </div>
    );
  }

  private getTrackClass(trackName: string): string {
    if (this.props.currentTrack === trackName) {
      return 'currentTrack';
    } else {
      return '';
    }
  }
}

export default TrackPanelList;
