import React, {
  FunctionComponent,
  Fragment,
  ReactNode,
  RefObject,
  useState
} from 'react';
import { TrackPanelItem, trackPanelIconConfig } from '../trackPanelConfig';

import chevronDownIcon from 'static/img/shared/chevron-down.svg';
import chevronUpIcon from 'static/img/shared/chevron-up.svg';

import styles from './TrackPanelListItem.scss';

type TrackPanelListItemProps = {
  browserRef: RefObject<HTMLDivElement>;
  children?: ReactNode[];
  className: string;
  track: TrackPanelItem;
  updateDrawerView: (drawerView: string) => void;
};

// delete this when there is a better place to put this
const trackPrefix = '';

const TrackPanelListItem: FunctionComponent<TrackPanelListItemProps> = (
  props: TrackPanelListItemProps
) => {
  const [expanded, setExpanded] = useState(false);
  const [trackStatus, setTrackStatus] = useState('on');

  const { browserRef, className, track } = props;
  const { ellipsis, eye } = trackPanelIconConfig;
  const listItemClass = styles[className] || '';

  const changeDrawerViewHandler = () => {
    props.updateDrawerView(props.track.name);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleTrack = () => {
    const currentTrackStatus = trackStatus === 'on' ? 'off' : 'on';

    const trackEvent = new CustomEvent('bpane', {
      bubbles: true,
      detail: {
        [currentTrackStatus]: `${trackPrefix}:${track.name}`
      }
    });

    if (browserRef.current) {
      browserRef.current.dispatchEvent(trackEvent);
    }

    setTrackStatus(currentTrackStatus);
  };

  return (
    <Fragment>
      <dd className={`${styles.listItem} ${listItemClass}`}>
        <label>
          {track.color && (
            <span className={`${styles.box} ${styles[track.color]}`} />
          )}
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
        <button onClick={changeDrawerViewHandler}>
          <img src={ellipsis.icon.on} alt={`Go to ${track.label}`} />
        </button>
        <button onClick={toggleTrack}>
          <img
            src={trackStatus === 'on' ? eye.icon.on : eye.icon.off}
            alt={eye.description}
          />
        </button>
      </dd>
      {expanded && props.children}
    </Fragment>
  );
};

export default TrackPanelListItem;
