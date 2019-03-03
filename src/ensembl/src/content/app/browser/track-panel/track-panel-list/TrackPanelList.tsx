import React, { FunctionComponent, RefObject, useCallback } from 'react';

import TrackPanelListItem from './TrackPanelListItem';
import {
  TrackPanelCategory,
  TrackPanelItem,
  trackPanelConfig
} from '../trackPanelConfig';

import styles from './TrackPanelList.scss';

type TrackPanelListProps = {
  browserRef: RefObject<HTMLDivElement>;
  drawerView: string;
  launchbarExpanded: boolean;
  toggleDrawer: (drawerOpened: boolean) => void;
  updateDrawerView: (drawerView: string) => void;
};

const TrackPanelList: FunctionComponent<TrackPanelListProps> = (
  props: TrackPanelListProps
) => {
  const changeDrawerView = useCallback(
    (currentTrack: string) => {
      const { drawerView, toggleDrawer, updateDrawerView } = props;

      updateDrawerView(currentTrack);

      if (!drawerView) {
        toggleDrawer(true);
      }
    },
    [props.drawerView]
  );

  const getTrackPanelListClasses = () => {
    const heightClass: string = props.launchbarExpanded
      ? styles.shorter
      : styles.taller;

    return `${styles.trackPanelList} ${heightClass}`;
  };

  const getTrackListItem = (track: TrackPanelItem) => (
    <TrackPanelListItem
      browserRef={props.browserRef}
      drawerView={props.drawerView}
      updateDrawerView={changeDrawerView}
      key={track.id}
      track={track}
    >
      {track.childTrackList &&
        track.childTrackList.map((childTrack: TrackPanelItem) =>
          getTrackListItem(childTrack)
        )}
    </TrackPanelListItem>
  );

  return (
    <div className={getTrackPanelListClasses()}>
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
