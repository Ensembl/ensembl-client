import React, {
  FunctionComponent,
  Fragment,
  MouseEvent,
  ReactNode,
  RefObject,
  useState,
  useCallback
} from 'react';
import { TrackItemColour, TrackPanelItem } from '../trackPanelConfig';

import chevronDownIcon from 'static/img/shared/chevron-down.svg';
import chevronUpIcon from 'static/img/shared/chevron-up.svg';
import { ReactComponent as Eye } from 'static/img/track-panel/eye.svg';
import { ReactComponent as Ellipsis } from 'static/img/track-panel/ellipsis-on.svg';

import styles from './TrackPanelListItem.scss';

import ImageButton, {
  ImageButtonStatus
} from 'src/shared/image-button/ImageButton';

type TrackPanelListItemProps = {
  browserRef: RefObject<HTMLDivElement>;
  children?: ReactNode[];
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
  const [trackStatus, setTrackStatus] = useState(ImageButtonStatus.ACTIVE);

  const { browserRef, drawerView, track } = props;

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

    if (trackStatus === ImageButtonStatus.ACTIVE) {
      setTrackStatus(ImageButtonStatus.INACTIVE);
    }
    setTrackStatus(ImageButtonStatus.ACTIVE);
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
        <ImageButton
          buttonStatus={ImageButtonStatus.ACTIVE}
          description={`Go to ${track.label}`}
          onClick={drawerViewButtonHandler}
          image={Ellipsis}
        />
        <ImageButton
          buttonStatus={trackStatus}
          description={'enable/disable track'}
          onClick={toggleTrack}
          image={Eye}
        />
      </dd>
      {expanded && props.children}
    </Fragment>
  );
};

export default TrackPanelListItem;
