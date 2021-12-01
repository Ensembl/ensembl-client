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

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useGenomeBrowser from 'src/content/app/browser/hooks/useGenomeBrowser';

import { getBrowserTrackState } from 'src/content/app/browser/browserSelectors';

import { updateTrackStatesAndSave } from 'src/content/app/browser/browserActions';
import { changeDrawerViewForGenome } from 'src/content/app/browser/state/drawer/drawerSlice';

import SimpleTrackPanelItemLayout from './track-panel-item-layout/SimpleTrackPanelItemLayout';

import { Status } from 'src/shared/types/status';
import { RootState } from 'src/store';

import styles from './TrackPanelItem.scss';

/**
 * This component is for otherwise unremarkable tracks that are returned
 * by the tracks api.
 */

type Props = {
  additional_info?: string;
  colour?: string;
  label: string;
  track_id: string;
  genomeId: string;
  category: string;
};

const TrackPanelRegularItem = (props: Props) => {
  const { genomeId, category, track_id } = props;
  const trackVisibilityStatus = useSelector((state: RootState) =>
    getBrowserTrackState(state, {
      genomeId,
      tracksGroup: 'commonTracks',
      categoryName: category,
      trackId: props.track_id
    })
  );
  const { toggleTrack, genomeBrowser } = useGenomeBrowser();
  const dispatch = useDispatch();

  const onShowMore = () => {
    dispatch(
      changeDrawerViewForGenome({
        genomeId,
        drawerView: {
          name: 'track_details',
          trackId: props.track_id
        }
      })
    );
  };

  const onChangeVisibility = () => {
    const newStatus =
      trackVisibilityStatus === Status.SELECTED
        ? Status.UNSELECTED
        : Status.SELECTED;
    toggleTrack({ trackId: track_id, status: newStatus });

    dispatch(
      updateTrackStatesAndSave({
        [genomeId]: {
          commonTracks: {
            [category]: {
              [track_id]: newStatus
            }
          }
        }
      })
    );
  };

  useEffect(() => {
    toggleTrack({ trackId: track_id, status: trackVisibilityStatus });
  }, [genomeBrowser]);

  const color = props.colour ? colorMap[props.colour] : undefined;
  const colorMarker = color ? (
    <span className={styles.colorMarker} style={{ backgroundColor: color }} />
  ) : null;

  return (
    <SimpleTrackPanelItemLayout
      visibilityStatus={trackVisibilityStatus}
      onChangeVisibility={onChangeVisibility}
      onShowMore={onShowMore}
    >
      <div className={styles.label}>
        {colorMarker}
        <span className={styles.labelText}>{props.label}</span>
        {props.additional_info ? (
          <span className={styles.labelTextSecondary}>
            {props.additional_info}
          </span>
        ) : null}
      </div>
    </SimpleTrackPanelItemLayout>
  );
};

const colorMap: Record<string, string> = {
  DARK_GREY: '#6f8190',
  GREY: '#b7c0c8'
};

export default TrackPanelRegularItem;
