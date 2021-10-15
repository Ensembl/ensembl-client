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

import React, { MouseEvent, ReactNode, useCallback } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from 'src/store';

import analyticsTracking from 'src/services/analytics-service';
import browserMessagingService from 'src/content/app/browser/browser-messaging-service';

import {
  TrackItemColour,
  TrackItemColourKey,
  TrackId,
  TrackActivityStatus
} from '../trackPanelConfig';
import { Status } from 'src/shared/types/status';

import { updateTrackStatesAndSave } from 'src/content/app/browser/browserActions';
import { updateCollapsedTrackIds } from 'src/content/app/browser/track-panel/trackPanelActions';
import {
  changeDrawerView,
  setActiveDrawerTrackId,
  setActiveDrawerTranscriptId,
  toggleDrawer
} from 'src/content/app/browser/drawer/drawerActions';

import {
  getHighlightedTrackId,
  isTrackCollapsed
} from 'src/content/app/browser/track-panel/trackPanelSelectors';
import { EnsObjectTrack } from 'src/shared/state/ens-object/ensObjectTypes';
import {
  getIsDrawerOpened,
  getActiveDrawerView,
  getActiveDrawerTrackId
} from 'src/content/app/browser/drawer/drawerSelectors';
import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObjectId
} from 'src/content/app/browser/browserSelectors';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import Chevron from 'src/shared/components/chevron/Chevron';
import VisibilityIcon from 'src/shared/components/visibility-icon/VisibilityIcon';

import { ReactComponent as Ellipsis } from 'static/img/track-panel/ellipsis.svg';
import { DrawerView } from 'src/content/app/browser/drawer/drawerState';

import styles from './TrackPanelListItem.scss';

export type TrackPanelListItemProps = {
  categoryName: string;
  children?: ReactNode;
  trackStatus: TrackActivityStatus;
  defaultTrackStatus: TrackActivityStatus;
  track: EnsObjectTrack;
};

export const TrackPanelListItem = (props: TrackPanelListItemProps) => {
  const { track, trackStatus, categoryName } = props;
  const trackId = track.track_id;
  const activeGenomeId = useSelector(getBrowserActiveGenomeId);
  const activeEnsObjectId = useSelector(getBrowserActiveEnsObjectId);
  const isDrawerOpened = useSelector(getIsDrawerOpened);
  const drawerView = useSelector(getActiveDrawerView);
  const highlightedTrackId = useSelector(getHighlightedTrackId);
  const isCollapsed = useSelector((state: RootState) =>
    isTrackCollapsed(state, trackId)
  );
  const activeDrawerTrackId = useSelector(getActiveDrawerTrackId);

  const dispatch = useDispatch();

  const updateDrawerView = () => {
    let drawerViewToSet = DrawerView.TRACK_DETAILS;
    if (trackId === 'track:gene-feat') {
      drawerViewToSet = DrawerView.GENE_SUMMARY;
    } else if (trackId.includes('track:transcript')) {
      drawerViewToSet = DrawerView.TRANSCRIPT_SUMMARY;
    }
    dispatch(changeDrawerView(drawerViewToSet));

    if (!isDrawerOpened) {
      dispatch(toggleDrawer(true));
    }
  };

  const getBoxClasses = (colour: TrackItemColourKey) => {
    const colourValue = colour ? TrackItemColour[colour] : '';

    return classNames(styles.box, {
      [styles[colourValue]]: !!colourValue
    });
  };

  const dispatchDrawerActions = () => {
    if (activeGenomeId) {
      dispatch(setActiveDrawerTrackId(trackId));

      if (trackId.includes('track:transcript')) {
        dispatch(setActiveDrawerTranscriptId(track.stable_id));
      }
    }
  };

  const drawerViewListHandler = (event: MouseEvent) => {
    event.preventDefault();

    if (!isDrawerOpened) {
      return;
    }

    dispatchDrawerActions();
  };

  const drawerViewButtonHandler = useCallback(() => {
    if (activeDrawerTrackId !== trackId) {
      analyticsTracking.trackEvent({
        category: 'track_drawer',
        label: trackId,
        action: 'opened'
      });
    }

    dispatchDrawerActions();

    updateDrawerView();
  }, [track.track_id, drawerView, isDrawerOpened, activeGenomeId]);

  const toggleExpand = () => {
    const { track_id: trackId } = props.track;
    dispatch(updateCollapsedTrackIds({ trackId, isCollapsed: !isCollapsed }));
  };

  const toggleTrack = useCallback(() => {
    const newStatus =
      trackStatus === Status.SELECTED ? Status.UNSELECTED : Status.SELECTED;

    updateGenomeBrowser(newStatus);

    if (!activeGenomeId || !activeEnsObjectId) {
      return;
    }
    // FIXME: Temporary hack until we have a set of proper track names
    if (
      track.track_id.startsWith('track:gene') ||
      track.track_id.startsWith('track:transcript')
    ) {
      dispatch(
        updateTrackStatesAndSave({
          [activeGenomeId]: {
            objectTracks: {
              [activeEnsObjectId]: {
                [categoryName]: {
                  [track.track_id]: newStatus
                }
              }
            }
          }
        })
      );
    } else {
      dispatch(
        updateTrackStatesAndSave({
          [activeGenomeId]: {
            commonTracks: {
              [categoryName]: {
                [track.track_id]: newStatus
              }
            }
          }
        })
      );
    }
  }, [trackStatus, activeGenomeId, activeEnsObjectId, track.track_id]);

  const updateGenomeBrowser = (status: Status) => {
    const currentTrackStatus = status === Status.SELECTED ? 'on' : 'off';

    const payload = {
      [currentTrackStatus]: `${track.track_id}`
    };

    browserMessagingService.send('bpane', payload);
  };

  const trackClassNames = classNames(styles.track, {
    [styles.trackWithChildren]: props.children,
    [styles.main]: track.track_id === TrackId.GENE,
    [styles.trackHighlighted]:
      track.track_id === drawerView || track.track_id === highlightedTrackId
  });

  return (
    <>
      <div className={trackClassNames} onClick={drawerViewListHandler}>
        <div className={styles.label}>
          {track.colour && (
            <span
              className={getBoxClasses(track.colour as TrackItemColourKey)}
            />
          )}
          <span>
            <span className={styles.labelTextPrimary}>{track.label}</span>
            {track.support_level ? (
              <span className={styles.selectedInfo}>{track.support_level}</span>
            ) : (
              track.additional_info && (
                <span className={styles.additionalInfo}>
                  {track.additional_info}
                </span>
              )
            )}
          </span>
        </div>
        {props.children && (
          <Chevron
            onClick={toggleExpand}
            direction={isCollapsed ? 'down' : 'up'}
            classNames={{ wrapper: styles.chevronWrapper, svg: styles.chevron }}
          />
        )}
        <div className={styles.controls}>
          <div className={styles.ellipsisHolder}>
            <ImageButton
              status={Status.DEFAULT}
              description="More information"
              onClick={drawerViewButtonHandler}
              image={Ellipsis}
            />
          </div>
          <div className={styles.eyeHolder}>
            <VisibilityIcon
              status={trackStatus}
              description={getVisibilityIconHelpText(trackStatus)}
              onClick={toggleTrack}
            />
          </div>
        </div>
      </div>
      {!isCollapsed && props.children}
    </>
  );
};

const getVisibilityIconHelpText = (status: TrackActivityStatus) => {
  // TODO: check whether the message is still correct after the half-highlighted eye icon is introduced
  return status === Status.SELECTED ? 'Hide this track' : 'Show this track';
};

export default TrackPanelListItem;
