import React, { FunctionComponent, RefObject } from 'react';
import get from 'lodash/get';

import TrackPanelListItem from './TrackPanelListItem';

import { UpdateTrackStatesPayload } from 'src/content/app/browser/browserActions';
import { TrackType, TrackStates } from '../trackPanelConfig';

import styles from './TrackPanelList.scss';
import { ImageButtonStatus } from 'src/shared/image-button/ImageButton';
import { GenomeTrackCategory } from 'src/genome/genomeTypes';
import { EnsObjectTrack, EnsObject } from 'src/ens-object/ensObjectTypes';

type TrackPanelListProps = {
  activeGenomeId: string;
  browserRef: RefObject<HTMLDivElement>;
  drawerOpened: boolean;
  drawerView: string;
  launchbarExpanded: boolean;
  ensObjectInfo: EnsObject;
  ensObjectTracks: EnsObjectTrack;
  selectedBrowserTab: { [genomeId: string]: TrackType };
  toggleDrawer: (drawerOpened: boolean) => void;
  genomeTrackCategories: GenomeTrackCategory[];
  trackStates: TrackStates;
  updateDrawerView: (drawerView: string) => void;
  updateTrackStates: (payload: UpdateTrackStatesPayload) => void;
};

const TrackPanelList: FunctionComponent<TrackPanelListProps> = (
  props: TrackPanelListProps
) => {
  const {
    activeGenomeId,
    selectedBrowserTab: selectedBrowserTabs,
    genomeTrackCategories
  } = props;

  const selectedBrowserTab =
    selectedBrowserTabs[activeGenomeId] || TrackType.GENOMIC;
  const currentTrackCategories = genomeTrackCategories.filter(
    (category: GenomeTrackCategory) =>
      category.types.includes(selectedBrowserTab)
  );

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

  // TODO: get default track status properly if it can ever be inactive
  const getDefaultTrackStatus = () => {
    return ImageButtonStatus.ACTIVE;
  };

  const getTrackListItem = (
    categoryName: string,
    track: EnsObjectTrack | null
  ) => {
    if (!track) {
      return;
    }
    const { track_id } = track;
    const defaultTrackStatus = getDefaultTrackStatus();

    const trackStatus = get(
      props.trackStates,
      `${activeGenomeId}.${categoryName}.${track_id}`,
      defaultTrackStatus
    );

    return (
      <TrackPanelListItem
        activeGenomeId={props.activeGenomeId}
        browserRef={props.browserRef}
        categoryName={categoryName}
        defaultTrackStatus={defaultTrackStatus as ImageButtonStatus}
        trackStatus={trackStatus as ImageButtonStatus}
        drawerOpened={props.drawerOpened}
        drawerView={props.drawerView}
        key={track.track_id}
        track={track}
        updateDrawerView={changeDrawerView}
        updateTrackStates={props.updateTrackStates}
      >
        {track.child_tracks &&
          track.child_tracks.map((childTrack: EnsObjectTrack) =>
            getTrackListItem(categoryName, childTrack)
          )}
      </TrackPanelListItem>
    );
  };

  return (
    <div className={getTrackPanelListClasses()}>
      {props.ensObjectInfo.object_type === 'region' ? null : (
        <section>
          <dl>{getTrackListItem('main', props.ensObjectTracks)}</dl>
        </section>
      )}
      {currentTrackCategories.map((category: GenomeTrackCategory) => (
        <section key={category.track_category_id}>
          <h4>{category.label}</h4>
          <dl>
            {category.track_list.length ? (
              category.track_list.map((track: EnsObjectTrack) =>
                getTrackListItem(category.track_category_id, track)
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
