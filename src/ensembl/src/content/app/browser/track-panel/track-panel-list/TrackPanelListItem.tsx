import React, { MouseEvent, ReactNode, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { RootState } from 'src/store';

import analyticsTracking from 'src/services/analytics-service';
import browserMessagingService from 'src/content/app/browser/browser-messaging-service';

import ImageButton, {
  ImageButtonStatus
} from 'src/shared/components/image-button/ImageButton';

import {
  TrackItemColour,
  TrackItemColourKey,
  TrackId,
  BrowserTrackStates
} from '../trackPanelConfig';

import { updateTrackStatesAndSave } from 'src/content/app/browser/browserActions';
import { updateCollapsedTrackIds } from 'src/content/app/browser/track-panel/trackPanelActions';
import { changeDrawerView, toggleDrawer } from '../../drawer/drawerActions';

import {
  getHighlightedTrackId,
  isTrackCollapsed
} from 'src/content/app/browser/track-panel/trackPanelSelectors';
import { EnsObjectTrack } from 'src/ens-object/ensObjectTypes';
import { getIsDrawerOpened, getDrawerView } from '../../drawer/drawerSelectors';
import {
  getBrowserActiveGenomeId,
  getBrowserActiveEnsObjectId
} from '../../browserSelectors';

import chevronDownIcon from 'static/img/shared/chevron-down.svg';
import chevronUpIcon from 'static/img/shared/chevron-up.svg';
import { ReactComponent as Eye } from 'static/img/track-panel/eye.svg';
import { ReactComponent as Ellipsis } from 'static/img/track-panel/ellipsis.svg';

import styles from './TrackPanelListItem.scss';

type OwnProps = {
  categoryName: string;
  children?: ReactNode[];
  trackStatus: ImageButtonStatus;
  defaultTrackStatus: ImageButtonStatus;
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

type Props = OwnProps & PropsFromRedux;

const TrackPanelListItem = (props: Props) => {
  const {
    activeGenomeId,
    activeEnsObjectId,
    categoryName,
    isDrawerOpened,
    drawerView,
    track,
    trackStatus
  } = props;

  useEffect(() => {
    const { defaultTrackStatus } = props;
    if (trackStatus !== defaultTrackStatus) {
      updateGenomeBrowser(trackStatus);
    }
  }, []);

  const updateDrawerView = (currentTrack: string) => {
    const { drawerView, toggleDrawer, changeDrawerView } = props;

    changeDrawerView(currentTrack);

    if (!drawerView) {
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

  const drawerViewButtonHandler = () => {
    const viewName = track.track_id;

    if (drawerView !== viewName) {
      analyticsTracking.trackEvent({
        category: 'track_drawer',
        label: viewName,
        action: 'opened'
      });
    }

    updateDrawerView(viewName);
  };

  const toggleExpand = () => {
    const { track_id: trackId } = props.track;
    const { isCollapsed } = props;
    props.updateCollapsedTrackIds({ trackId, isCollapsed: !isCollapsed });
  };

  const toggleTrack = () => {
    const newStatus =
      trackStatus === ImageButtonStatus.ACTIVE
        ? ImageButtonStatus.INACTIVE
        : ImageButtonStatus.ACTIVE;

    updateGenomeBrowser(newStatus);

    if (!activeGenomeId || !activeEnsObjectId) {
      return;
    }
    if (track.track_id.indexOf('track:gene') === 0) {
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
  };

  const updateGenomeBrowser = (status: ImageButtonStatus) => {
    const currentTrackStatus =
      status === ImageButtonStatus.ACTIVE ? 'on' : 'off';

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
            buttonStatus={ImageButtonStatus.ACTIVE}
            description={`Go to ${track.label}`}
            onClick={drawerViewButtonHandler}
            image={Ellipsis}
          />
        </div>
        <div className={styles.eyeHolder}>
          <ImageButton
            buttonStatus={trackStatus}
            description={'enable/disable track'}
            onClick={toggleTrack}
            image={Eye}
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
  updateTrackStatesAndSave: updateTrackStatesAndSave
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanelListItem);
