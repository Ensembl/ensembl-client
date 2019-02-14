import React, { FunctionComponent, useCallback } from 'react';

import { trackPanelBarConfig, TrackPanelBarItem } from './trackPanelBarConfig';

import TrackPanelBarIcon from './TrackPanelBarIcon';

import chevronLeftIcon from 'static/img/shared/chevron-left.svg';
import chevronRightIcon from 'static/img/shared/chevron-right.svg';

import styles from './TrackPanelBar.scss';

type TrackPanelBarProps = {
  toggleDrawer: (drawerOpened: boolean) => void;
  drawerOpened: boolean;
  launchbarExpanded: boolean;
  trackPanelOpened: boolean;
  toggleTrackPanel: (trackPanelOpened?: boolean) => void;
};

const TrackPanelBar: FunctionComponent<TrackPanelBarProps> = (
  props: TrackPanelBarProps
) => {
  const moveTrackPanel = useCallback(() => {
    if (props.drawerOpened === true) {
      props.toggleDrawer(false);
    } else {
      props.toggleTrackPanel();
    }
  }, [props.drawerOpened, props.toggleDrawer, props.toggleTrackPanel]);

  const getClassNames = () => {
    const expandClass: string = props.launchbarExpanded ? '' : styles.expanded;

    return `${styles.trackPanelBar} ${expandClass}`;
  };

  return (
    <div className={getClassNames()}>
      <dl>
        <dt className={styles.sliderButton}>
          <button onClick={moveTrackPanel}>
            {props.trackPanelOpened ? (
              <img src={chevronRightIcon} alt="collapse" />
            ) : (
              <img src={chevronLeftIcon} alt="expand" />
            )}
          </button>
        </dt>
        {trackPanelBarConfig.map((item: TrackPanelBarItem) => (
          <TrackPanelBarIcon key={item.name} iconConfig={item} />
        ))}
      </dl>
    </div>
  );
};

export default TrackPanelBar;
