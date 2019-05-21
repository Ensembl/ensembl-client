import React, {
  FunctionComponent,
  Fragment,
  MouseEvent,
  ReactNode,
  RefObject,
  useState,
  useCallback,
  useEffect
} from 'react';

import { TrackItemColour, TrackPanelItem } from '../trackPanelConfig';

import chevronDownIcon from 'static/img/shared/chevron-down.svg';
import chevronUpIcon from 'static/img/shared/chevron-up.svg';
import { ReactComponent as Eye } from 'static/img/track-panel/eye.svg';
import { ReactComponent as Ellipsis } from 'static/img/track-panel/ellipsis.svg';

import styles from './TrackPanelListItem.scss';

import ImageButton, {
  ImageButtonStatus
} from 'src/shared/image-button/ImageButton';
import browserStorageService from '../../browser-storage-service';

type TrackPanelListItemProps = {
  browserRef: RefObject<HTMLDivElement>;
  categoryName: string;
  children?: ReactNode[];
  defaultTrackStatus: ImageButtonStatus;
  drawerOpened: boolean;
  drawerView: string;
  track: TrackPanelItem;
  updateDrawerView: (drawerView: string) => void;
};

// delete this when there is a better place to put this
const trackPrefix = 'track:';

const TrackPanelListItem: FunctionComponent<TrackPanelListItemProps> = (
  props: TrackPanelListItemProps
) => {
  const [expanded, setExpanded] = useState(true);
  const [trackStatus, setTrackStatus] = useState(props.defaultTrackStatus);
  const { browserRef, categoryName, drawerView, track } = props;

  useEffect(() => {
    const trackToggleStates = browserStorageService.getTrackListToggleStates();

    if (track.childTrackList && trackToggleStates[track.name] !== undefined) {
      setExpanded(trackToggleStates[`${track.name}`]);
    }
  }, []);

  const getListItemClasses = useCallback((): string => {
    let classNames: string = styles.listItem;

    if (track.name === 'gene') {
      classNames += ` ${styles.main}`;
    }

    if (drawerView === track.name || drawerView === track.drawerView) {
      classNames += ` ${styles.currentDrawerView}`;
    }

    return classNames;
  }, [drawerView]);

  const getBoxClasses = (colour: any) => {
    let classNames = styles.box;

    if (colour) {
      const colourValue = TrackItemColour[colour];
      classNames += ` ${styles[colourValue]}`;
    }

    return classNames;
  };

  const drawerViewListHandler = (event: MouseEvent) => {
    event.preventDefault();

    if (props.drawerOpened === false) {
      return;
    }

    const viewName = track.drawerView || track.name;

    props.updateDrawerView(viewName);
  };

  const drawerViewButtonHandler = () => {
    const viewName = track.drawerView || track.name;

    props.updateDrawerView(viewName);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);

    browserStorageService.updateTrackListToggleStates({
      [`${track.name}`]: !expanded
    });
  };

  const toggleTrack = () => {
    const currentTrackStatus =
      trackStatus === ImageButtonStatus.ACTIVE ? 'off' : 'on';

    const trackEvent = new CustomEvent('bpane', {
      bubbles: true,
      detail: {
        [currentTrackStatus]: `${trackPrefix}${track.name}`
      }
    });

    if (browserRef.current) {
      browserRef.current.dispatchEvent(trackEvent);
    }

    const newImageButtonStatus =
      trackStatus === ImageButtonStatus.ACTIVE
        ? ImageButtonStatus.INACTIVE
        : ImageButtonStatus.ACTIVE;

    setTrackStatus(newImageButtonStatus);
    browserStorageService.saveTrackStates(
      categoryName,
      track.name,
      newImageButtonStatus
    );
  };

  return (
    <Fragment>
      <dd className={getListItemClasses()} onClick={drawerViewListHandler}>
        <label>
          {track.color && <span className={getBoxClasses(track.color)} />}
          <span className={styles.mainText}>{track.label}</span>
          {track.selectedInfo && (
            <span className={styles.selectedInfo}>{track.selectedInfo}</span>
          )}
          {track.additionalInfo && (
            <span className={styles.additionalInfo}>
              {track.additionalInfo}
            </span>
          )}
          {track.childTrackList && (
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
    </Fragment>
  );
};

export default TrackPanelListItem;
