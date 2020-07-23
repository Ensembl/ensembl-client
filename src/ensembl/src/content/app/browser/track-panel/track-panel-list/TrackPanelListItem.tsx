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
import { connect } from 'react-redux';
import classNames from 'classnames';

import { RootState } from 'src/store';

import analyticsTracking from 'src/services/analytics-service';
import browserMessagingService from 'src/content/app/browser/browser-messaging-service';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import VisibilityIcon from 'src/shared/components/visibility-icon/VisibilityIcon';

import {
  TrackItemColour,
  TrackItemColourKey,
  TrackId,
  BrowserTrackStates,
  TrackActivityStatus
} from '../trackPanelConfig';
import { Status } from 'src/shared/types/status';

import { updateTrackStatesAndSave } from 'src/content/app/browser/browserActions';
import { updateCollapsedTrackIds } from 'src/content/app/browser/track-panel/trackPanelActions';
import { changeDrawerView, toggleDrawer } from '../../drawer/drawerActions';

import {
  getHighlightedTrackId,
  isTrackCollapsed
} from 'src/content/app/browser/track-panel/trackPanelSelectors';
import { EnsObjectTrack } from 'src/shared/state/ens-object/ensObjectTypes';
import { getIsDrawerOpened, getDrawerView } from '../../drawer/drawerSelectors';
import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObjectId
} from '../../browserSelectors';

import chevronDownIcon from 'static/img/shared/chevron-down.svg';
import chevronUpIcon from 'static/img/shared/chevron-up.svg';
import { ReactComponent as Ellipsis } from 'static/img/track-panel/ellipsis.svg';

import styles from './TrackPanelListItem.scss';

// the types have been separated since the component's own props is used in the mapStateToProps function (see at the bottom)
type OwnProps = {
  categoryName: string;
  children?: ReactNode[];
  trackStatus: TrackActivityStatus;
  defaultTrackStatus: TrackActivityStatus;
  track: EnsObjectTrack;
};

type PropsFromRedux = {
  activeGenomeId: string | null;
  activeEnsObjectId: string | null;
  isDrawerOpened: boolean;
  drawerView: string;
  highlightedTrackId: string;
  isCollapsed: boolean;
  changeDrawerView: (drawerView: string) => void;
  toggleDrawer: (isDrawerOpened: boolean) => void;
  updateTrackStatesAndSave: (payload: BrowserTrackStates) => void;
  updateCollapsedTrackIds: (payload: {
    trackId: string;
    isCollapsed: boolean;
  }) => void;
};

export type TrackPanelListItemProps = OwnProps & PropsFromRedux;

export const TrackPanelListItem = (props: TrackPanelListItemProps) => {
  const {
    activeGenomeId,
    activeEnsObjectId,
    categoryName,
    isDrawerOpened,
    drawerView,
    track,
    trackStatus
  } = props;

  const updateDrawerView = (currentTrack: string) => {
    const { isDrawerOpened, toggleDrawer, changeDrawerView } = props;

    changeDrawerView(currentTrack);

    if (!isDrawerOpened) {
      toggleDrawer(true);
    }
  };

  const getBoxClasses = (colour: TrackItemColourKey) => {
    const colourValue = colour ? TrackItemColour[colour] : '';

    return classNames(styles.box, {
      [styles[colourValue]]: !!colourValue
    });
  };

  const drawerViewListHandler = (event: MouseEvent) => {
    event.preventDefault();

    if (!isDrawerOpened) {
      return;
    }

    const viewName = track.track_id;

    updateDrawerView(viewName);
  };

  const drawerViewButtonHandler = useCallback(() => {
    const viewName = track.track_id;

    if (drawerView !== viewName) {
      analyticsTracking.trackEvent({
        category: 'track_drawer',
        label: viewName,
        action: 'opened'
      });
    }

    updateDrawerView(viewName);
  }, [track.track_id, drawerView, props.isDrawerOpened]);

  const toggleExpand = () => {
    const { track_id: trackId } = props.track;
    const { isCollapsed } = props;
    props.updateCollapsedTrackIds({ trackId, isCollapsed: !isCollapsed });
  };

  const toggleTrack = useCallback(() => {
    const newStatus =
      trackStatus === Status.SELECTED ? Status.UNSELECTED : Status.SELECTED;

    updateGenomeBrowser(newStatus);

    if (!activeGenomeId || !activeEnsObjectId) {
      return;
    }
    // FIXME: Temporary hack until we have a set of proper track names
    if (track.track_id.startsWith('track:gene')) {
      props.updateTrackStatesAndSave({
        [activeGenomeId]: {
          objectTracks: {
            [activeEnsObjectId]: {
              [categoryName]: {
                [track.track_id]: newStatus
              }
            }
          }
        }
      });
    } else {
      props.updateTrackStatesAndSave({
        [activeGenomeId]: {
          commonTracks: {
            [categoryName]: {
              [track.track_id]: newStatus
            }
          }
        }
      });
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
    [styles.main]: track.track_id === TrackId.GENE,
    [styles.trackHighlighted]:
      track.track_id === drawerView ||
      track.track_id === props.highlightedTrackId
  });

  return (
    <>
      <dd className={trackClassNames} onClick={drawerViewListHandler}>
        <label>
          {track.colour && (
            <span
              className={getBoxClasses(track.colour as TrackItemColourKey)}
            />
          )}
          <span className={styles.mainText}>{track.label}</span>
          {track.support_level && (
            <span className={styles.selectedInfo}>{track.support_level}</span>
          )}
          {track.additional_info && (
            <span className={styles.additionalInfo}>
              {track.additional_info}
            </span>
          )}
          {track.child_tracks && (
            <button onClick={toggleExpand} className={styles.expandBtn}>
              <img
                src={props.isCollapsed ? chevronDownIcon : chevronUpIcon}
                alt={props.isCollapsed ? 'expand' : 'collapse'}
              />
            </button>
          )}
        </label>
        <div className={styles.ellipsisHolder}>
          <ImageButton
            status={Status.DEFAULT}
            description={`Go to ${track.label}`}
            onClick={drawerViewButtonHandler}
            image={Ellipsis}
          />
        </div>
        <div className={styles.eyeHolder}>
          <VisibilityIcon
            status={trackStatus}
            description={'enable/disable track'}
            onClick={toggleTrack}
          />
        </div>
      </dd>
      {!props.isCollapsed && props.children}
    </>
  );
};

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  activeEnsObjectId: getBrowserActiveEnsObjectId(state),
  isDrawerOpened: getIsDrawerOpened(state),
  drawerView: getDrawerView(state),
  highlightedTrackId: getHighlightedTrackId(state),
  isCollapsed: isTrackCollapsed(state, ownProps.track.track_id)
});

const mapDispatchToProps = {
  updateCollapsedTrackIds,
  changeDrawerView,
  toggleDrawer,
  updateTrackStatesAndSave
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackPanelListItem);
