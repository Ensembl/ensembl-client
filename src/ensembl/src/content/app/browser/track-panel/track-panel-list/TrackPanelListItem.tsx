import React, { MouseEvent, ReactNode, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from 'src/store';
import classNames from 'classnames';

import analyticsTracking from 'src/services/analytics-service';
import ImageButton, {
  ImageButtonStatus
} from 'src/shared/components/image-button/ImageButton';

import { TrackItemColour, TrackItemColourKey } from '../trackPanelConfig';
import {
  updateTrackStatesAndSave,
  UpdateTrackStatesPayload
} from 'src/content/app/browser/browserActions';
import { changeDrawerView, toggleDrawer } from '../../drawer/drawerActions';
import browserMessagingService from 'src/content/app/browser/browser-messaging-service';
import { getHighlightedTrack } from 'src/content/app/browser/track-panel/trackPanelSelectors';
import browserStorageService from '../../browser-storage-service';
import { EnsObjectTrack } from 'src/ens-object/ensObjectTypes';
import { getIsDrawerOpened, getDrawerView } from '../../drawer/drawerSelectors';
import { getBrowserActiveGenomeId } from '../../browserSelectors';

import chevronDownIcon from 'static/img/shared/chevron-down.svg';
import chevronUpIcon from 'static/img/shared/chevron-up.svg';
import { ReactComponent as Eye } from 'static/img/track-panel/eye.svg';
import { ReactComponent as Ellipsis } from 'static/img/track-panel/ellipsis.svg';

import styles from './TrackPanelListItem.scss';

type TrackPanelListItemProps = {
  changeDrawerView: (drawerView: string) => void;
  toggleDrawer: (isDrawerOpened: boolean) => void;
  updateTrackStates: (payload: UpdateTrackStatesPayload) => void;
  categoryName: string;
  children?: ReactNode[];
  trackStatus: ImageButtonStatus;
  defaultTrackStatus: ImageButtonStatus;
  track: EnsObjectTrack;
};

type StateProps = {
  highlightedTrack: string;
  activeGenomeId: string | null;
  isDrawerOpened: boolean;
  drawerView: string;
};

type Props = TrackPanelListItemProps & StateProps;

// delete this when there is a better place to put this
const trackPrefix = 'track:';

const TrackPanelListItem = (props: Props) => {
  const [expanded, setExpanded] = useState(true);
  const {
    activeGenomeId,
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

  useEffect(() => {
    const trackToggleStates = browserStorageService.getTrackListToggleStates();

    if (
      activeGenomeId &&
      track.child_tracks &&
      trackToggleStates[activeGenomeId] &&
      trackToggleStates[activeGenomeId][track.track_id] !== undefined
    ) {
      setExpanded(trackToggleStates[activeGenomeId][track.track_id]);
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
    setExpanded(!expanded);

    browserStorageService.updateTrackListToggleStates({
      [activeGenomeId as string]: { [track.track_id]: !expanded }
    });
  };

  const toggleTrack = () => {
    const newStatus =
      trackStatus === ImageButtonStatus.ACTIVE
        ? ImageButtonStatus.INACTIVE
        : ImageButtonStatus.ACTIVE;

    updateGenomeBrowser(newStatus);

    props.updateTrackStates({
      genomeId: activeGenomeId as string,
      categoryName,
      trackId: track.track_id,
      status: newStatus
    });
  };

  const updateGenomeBrowser = (status: ImageButtonStatus) => {
    const currentTrackStatus =
      status === ImageButtonStatus.ACTIVE ? 'on' : 'off';

    const payload = {
      [currentTrackStatus]: `${trackPrefix}${track.track_id}`
    };

    browserMessagingService.send('bpane', payload);
  };

  const trackClassNames = classNames(styles.track, {
    [styles.main]: track.track_id === 'track:gene-feat',
    [styles.trackHighlighted]:
      track.track_id === drawerView || track.track_id === props.highlightedTrack
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
                src={expanded ? chevronUpIcon : chevronDownIcon}
                alt={expanded ? 'collapse' : 'expand'}
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
      {expanded && props.children}
    </>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  activeGenomeId: getBrowserActiveGenomeId(state),
  isDrawerOpened: getIsDrawerOpened(state),
  drawerView: getDrawerView(state),
  highlightedTrack: getHighlightedTrack(state)
});

const mapDispatchToProps = {
  changeDrawerView,
  toggleDrawer,
  updateTrackStates: updateTrackStatesAndSave
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackPanelListItem);
