import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

import TrackPanelListItem from './TrackPanelListItem';
import { ImageButtonStatus } from 'src/shared/image-button/ImageButton';

import {
  UpdateTrackStatesPayload,
  updateTrackStatesAndSave
} from 'src/content/app/browser/browserActions';
import { toggleDrawer, changeDrawerView } from '../../drawer/drawerActions';
import { TrackSet, TrackStates } from '../trackPanelConfig';
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

import styles from './TrackPanelList.scss';

type TrackPanelListProps = {
  activeGenomeId: string | null;
  isDrawerOpened: boolean;
  drawerView: string;
  launchbarExpanded: boolean;
  activeEnsObject: EnsObject | null;
  selectedTrackPanelTab: TrackSet;
  genomeTrackCategories: GenomeTrackCategory[];
  trackStates: TrackStates;
  toggleDrawer: (isDrawerOpened: boolean) => void;
  changeDrawerView: (drawerView: string) => void;
  updateTrackStates: (payload: UpdateTrackStatesPayload) => void;
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
        categoryName={categoryName}
        defaultTrackStatus={defaultTrackStatus as ImageButtonStatus}
        trackStatus={trackStatus as ImageButtonStatus}
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
  toggleDrawer,
  updateTrackStates: updateTrackStatesAndSave
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanelList);
