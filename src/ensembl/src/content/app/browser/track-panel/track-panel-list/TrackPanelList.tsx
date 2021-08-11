/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { TrackSet, BrowserTrackStates } from '../trackPanelConfig';
import { GenomeTrackCategory } from 'src/shared/state/genome/genomeTypes';
import {
  EnsObjectTrack,
  EnsObject
} from 'src/shared/state/ens-object/ensObjectTypes';
import { RootState } from 'src/store';
import { getIsDrawerOpened } from 'src/content/app/browser/drawer/drawerSelectors';
import {
  getBrowserActiveEnsObject,
  getBrowserTrackStates,
  getBrowserActiveGenomeId
} from 'src/content/app/browser/browserSelectors';
import { getSelectedTrackPanelTab } from '../trackPanelSelectors';
import { getGenomeTrackCategoriesById } from 'src/shared/state/genome/genomeSelectors';

import TrackPanelListItem from './TrackPanelListItem';

import { TrackActivityStatus } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { Status } from 'src/shared/types/status';

import styles from './TrackPanelList.scss';

export type TrackPanelListProps = {
  activeGenomeId: string | null;
  isDrawerOpened: boolean;
  activeEnsObject: EnsObject | null;
  selectedTrackPanelTab: TrackSet;
  genomeTrackCategories: GenomeTrackCategory[];
  trackStates: BrowserTrackStates;
};

export const TrackPanelList = (props: TrackPanelListProps) => {
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

  // TODO: get default track status properly if it can ever be inactive
  const getDefaultTrackStatus = (): TrackActivityStatus => {
    return Status.SELECTED;
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
    <div className={styles.trackPanelList}>
      {activeEnsObject && activeEnsObject.type === 'region' ? null : (
        <section className="mainTrackItem">
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
    activeEnsObject: getBrowserActiveEnsObject(state),
    selectedTrackPanelTab: getSelectedTrackPanelTab(state),
    genomeTrackCategories: activeGenomeId
      ? getGenomeTrackCategoriesById(state, activeGenomeId)
      : [],
    trackStates: getBrowserTrackStates(state)
  };
};

export default connect(mapStateToProps)(TrackPanelList);
