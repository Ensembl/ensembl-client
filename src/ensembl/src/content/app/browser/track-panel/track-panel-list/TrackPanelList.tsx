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
  launchbarExpanded: boolean;
  toggleDrawer: (drawerOpened: boolean) => void;
  updateTrack: (currentTrack: string) => void;
};

const TrackPanelList: FunctionComponent<TrackPanelListProps> = (
  props: TrackPanelListProps
) => {
  const changeTrack = (currentTrack: string) => {
    const { toggleDrawer, updateTrack } = props;

    updateTrack(currentTrack);
    toggleDrawer(true);
  };

  const getTrackPanelClasses = () => {
    const heightClass: string = props.launchbarExpanded
      ? styles.shorter
      : styles.taller;

    return `${styles.trackPanelList} ${heightClass}`;
  };

  const getTrackClass = (trackName: string): string => {
    if (trackName === 'gene') {
      return 'gene';
    }

    if (props.currentTrack === trackName) {
      return 'currentTrack';
    }

    return '';
  };

  const getTrackListItem = (track: TrackPanelItem) => (
    <TrackPanelListItem
      key={track.id}
      className={getTrackClass(track.name)}
      track={track}
      changeTrack={changeTrack}
    >
      {track.childTrackList &&
        track.childTrackList.map((childTrack: TrackPanelItem) =>
          getTrackListItem(childTrack)
        )}
    </TrackPanelListItem>
  );

  return (
    <div className={getTrackPanelClasses()}>
      <section>
        <dl>{getTrackListItem(trackPanelConfig.main)}</dl>
      </section>
      {trackPanelConfig.categories.map((category: TrackPanelCategory) => (
        <section key={category.name}>
          <h4>{category.name}</h4>
          <dl>
            {category.trackList.length ? (
              category.trackList.map((track: TrackPanelItem) =>
                getTrackListItem(track)
              )
            ) : (
              <dd className={styles.emptyListMsg}>No data available</dd>
            )}
          </dl>
        </section>
      ))}
    </div>
  );
};

export default TrackPanelList;
