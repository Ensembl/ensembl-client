import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { toggleDrawer, changeDrawerView } from '../../drawer/drawerActions';
import { TrackSet, BrowserTrackStates } from '../trackPanelConfig';
import { GenomeTrackCategory } from 'src/genome/genomeTypes';
import { EnsObjectTrack, EnsObject } from 'src/ens-object/ensObjectTypes';
import { RootState } from 'src/store';
import { getDrawerView, getIsDrawerOpened } from '../../drawer/drawerSelectors';
import { getLaunchbarExpanded } from 'src/header/headerSelectors';
import {
  getBrowserActiveEnsObject,
  getBrowserTrackStates,
  getBrowserActiveGenomeId
} from '../../browserSelectors';
import { getSelectedTrackPanelTab } from '../trackPanelSelectors';
import { getGenomeTrackCategoriesById } from 'src/genome/genomeSelectors';

import TrackPanelListItem from './TrackPanelListItem';

import { TrackActivityStatus } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { Status } from 'src/shared/types/status';

import styles from './TrackPanelList.scss';

type TrackPanelListProps = {
  activeGenomeId: string | null;
  isDrawerOpened: boolean;
  drawerView: string;
  launchbarExpanded: boolean;
  activeEnsObject: EnsObject | null;
  selectedTrackPanelTab: TrackSet;
  genomeTrackCategories: GenomeTrackCategory[];
  trackStates: BrowserTrackStates;
  toggleDrawer: (isDrawerOpened: boolean) => void;
  changeDrawerView: (drawerView: string) => void;
};

const TrackPanelList = (props: TrackPanelListProps) => {
  const {
    activeGenomeId,
    activeEnsObject,
    selectedTrackPanelTab,
    genomeTrackCategories
  } = props;
  const currentTrackCategories = genomeTrackCategories.filter(
    (category: GenomeTrackCategory) =>
      category.types.includes(selectedTrackPanelTab)
  );

  const getTrackPanelListClasses = () => {
    const heightClass: string = props.launchbarExpanded
      ? styles.shorter
      : styles.taller;

    return `${styles.trackPanelList} ${heightClass}`;
  };

  // TODO: get default track status properly if it can ever be inactive
  const getDefaultTrackStatus = (): TrackActivityStatus => {
    return Status.ACTIVE;
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
    let trackStatus = defaultTrackStatus;

    if (activeEnsObject) {
      // FIXME: Temporary hack until we have a set of proper track names
      if (track_id.startsWith('track:gene')) {
        trackStatus = get(
          props.trackStates,
          `${activeGenomeId}.objectTracks.${activeEnsObject.object_id}.${categoryName}.${track_id}`,
          trackStatus
        ) as TrackActivityStatus;
      } else {
        trackStatus = get(
          props.trackStates,
          `${activeGenomeId}.commonTracks.${categoryName}.${track_id}`,
          trackStatus
        ) as TrackActivityStatus;
      }
    }

    return (
      <TrackPanelListItem
        categoryName={categoryName}
        defaultTrackStatus={defaultTrackStatus}
        trackStatus={trackStatus}
        key={track.track_id}
        track={track}
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
      {activeEnsObject && activeEnsObject.object_type === 'region' ? null : (
        <section>
          <dl>
            {getTrackListItem('main', activeEnsObject && activeEnsObject.track)}
          </dl>
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

const mapStateToProps = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return {
    activeGenomeId,
    isDrawerOpened: getIsDrawerOpened(state),
    drawerView: getDrawerView(state),
    launchbarExpanded: getLaunchbarExpanded(state),
    activeEnsObject: getBrowserActiveEnsObject(state),
    selectedTrackPanelTab: getSelectedTrackPanelTab(state),
    genomeTrackCategories: activeGenomeId
      ? getGenomeTrackCategoriesById(state, activeGenomeId)
      : [],
    trackStates: getBrowserTrackStates(state)
  };
};

const mapDispatchToProps = {
  changeDrawerView,
  toggleDrawer
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanelList);
