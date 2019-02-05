import React, { FunctionComponent } from 'react';

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

const TrackPanelList: FunctionComponent<TrackPanelListProps> = (
  props: TrackPanelListProps
) => {
  const changeTrack = (currentTrack: string) => {
    const { openDrawer, updateTrack } = props;

    updateTrack(currentTrack);
    openDrawer();
  };

  const getTrackClass = (trackName: string): string => {
    if (props.currentTrack === trackName) {
      return 'currentTrack';
    } else {
      return '';
    }
  };

  return (
    <div className={styles.trackPanelList}>
      <section>
        <dl>
          <TrackPanelListItem
            className="main"
            track={trackPanelConfig.main}
            changeTrack={changeTrack}
            additionalInfo="MANE Select transcript /7"
          />
        </dl>
      </section>
      {trackPanelConfig.categories.map((category: TrackPanelCategory) => (
        <section key={category.name}>
          <h4>{category.name}</h4>
          <dl>
            {category.trackList.map((track: TrackPanelItem) => (
              <TrackPanelListItem
                key={track.id}
                className={getTrackClass(track.name)}
                track={track}
                changeTrack={changeTrack}
              />
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
};

export default TrackPanelList;
