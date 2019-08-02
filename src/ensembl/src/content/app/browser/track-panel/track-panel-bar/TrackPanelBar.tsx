import React, { FunctionComponent, useCallback } from 'react';

import { trackPanelBarConfig, TrackPanelBarItem } from './trackPanelBarConfig';

import TrackPanelBarIcon from './TrackPanelBarIcon';

import chevronLeftIcon from 'static/img/shared/chevron-left.svg';
import chevronRightIcon from 'static/img/shared/chevron-right.svg';

import styles from './TrackPanelBar.scss';

type TrackPanelBarProps = {
  activeGenomeId: string;
  closeDrawer: () => void;
  closeTrackPanelModal: () => void;
  isDrawerOpened: boolean;
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  launchbarExpanded: boolean;
  openTrackPanelModal: (trackPanelModalView: string) => void;
  toggleTrackPanel: (isTrackPanelOpened?: boolean) => void;
  trackPanelModalView: string;
};

const TrackPanelBar: FunctionComponent<TrackPanelBarProps> = (
  props: TrackPanelBarProps
) => {
  const moveTrackPanel = useCallback(() => {
    if (props.isDrawerOpened) {
      props.closeDrawer();
    } else {
      props.toggleTrackPanel(!props.isTrackPanelOpened);
    }
  }, [
    props.isDrawerOpened,
    props.closeDrawer,
    props.toggleTrackPanel,
    props.isTrackPanelOpened
  ]);

  const getClassNames = () => {
    const heightClass: string = props.launchbarExpanded
      ? styles.shorter
      : styles.taller;

    return `${styles.trackPanelBar} ${heightClass}`;
  };

  return (
    <div className={getClassNames()}>
      <dl>
        <dt className={styles.sliderButton}>
          <button onClick={moveTrackPanel}>
            {props.isTrackPanelOpened ? (
              <img src={chevronRightIcon} alt="collapse" />
            ) : (
              <img src={chevronLeftIcon} alt="expand" />
            )}
          </button>
        </dt>
        {trackPanelBarConfig.map((item: TrackPanelBarItem) => (
          <TrackPanelBarIcon
            key={item.name}
            iconConfig={item}
            closeTrackPanelModal={props.closeTrackPanelModal}
            openTrackPanelModal={props.openTrackPanelModal}
            isTrackPanelModalOpened={props.isTrackPanelModalOpened}
            isTrackPanelOpened={props.isTrackPanelOpened}
            trackPanelModalView={props.trackPanelModalView}
          />
        ))}
      </dl>
    </div>
  );
};

export default TrackPanelBar;
