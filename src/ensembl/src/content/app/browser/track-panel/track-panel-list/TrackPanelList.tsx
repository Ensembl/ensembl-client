import React, { FunctionComponent, RefObject } from 'react';

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
  const changeDrawerView = (currentTrack: string) => {
    const { drawerView, toggleDrawer, updateDrawerView } = props;

    updateDrawerView(currentTrack);

    if (!drawerView) {
      toggleDrawer(true);
    }
  };

  const getTrackPanelListClasses = () => {
    const heightClass: string = props.launchbarExpanded
      ? styles.shorter
      : styles.taller;

    return `${styles.trackPanelList} ${heightClass}`;
  };

  const getDrawerViewClass = (trackName: string): string => {
    if (trackName === 'gene') {
      return 'gene';
    }

    if (props.drawerView === trackName) {
      return styles.currentDrawerView;
    }

    return '';
  };

  const getTrackListItem = (track: TrackPanelItem) => (
    <TrackPanelListItem
      browserRef={props.browserRef}
      className={getDrawerViewClass(track.name)}
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
