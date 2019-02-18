import React, { FunctionComponent, Fragment, ReactNode, useState } from 'react';
import { TrackPanelItem, trackPanelIconConfig } from '../trackPanelConfig';

import chevronDownIcon from 'static/img/shared/chevron-down.svg';
import chevronUpIcon from 'static/img/shared/chevron-up.svg';

import styles from './TrackPanelListItem.scss';

type TrackPanelListItemProps = {
  children?: ReactNode[];
  className: string;
  track: TrackPanelItem;
  changeTrack: (name: string) => void;
};

const TrackPanelListItem: FunctionComponent<TrackPanelListItemProps> = (
  props: TrackPanelListItemProps
) => {
  const [expanded, setExpanded] = useState(false);

  const { className, track } = props;
  const listItemClass = styles[className] || '';

  const changeTrackHandler = () => {
    props.changeTrack(props.track.name);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
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
        <button onClick={changeTrackHandler}>
          <img
            src={trackPanelIconConfig.ellipsis.icon.on}
            alt={`Go to ${track.label}`}
          />
        </button>
        <button>
          <img
            src={trackPanelIconConfig.eye.icon.on}
            alt={trackPanelIconConfig.ellipsis.description}
          />
        </button>
      </dd>
      {expanded && props.children}
    </Fragment>
  );
};

export default TrackPanelListItem;
