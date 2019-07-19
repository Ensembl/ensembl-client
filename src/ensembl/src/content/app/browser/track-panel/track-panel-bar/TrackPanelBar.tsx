import React, { FunctionComponent, useCallback } from 'react';

import { trackPanelBarConfig, TrackPanelBarItem } from './trackPanelBarConfig';

import TrackPanelBarIcon from './TrackPanelBarIcon';

import chevronLeftIcon from 'static/img/shared/chevron-left.svg';
import chevronRightIcon from 'static/img/shared/chevron-right.svg';

import styles from './TrackPanelBar.scss';

type TrackPanelBarProps = {
  activeGenomeId: string;
  closeTrackPanelModal: () => void;
  drawerOpened: { [genomeId: string]: boolean };
  launchbarExpanded: boolean;
  openTrackPanelModal: (trackPanelModalView: string) => void;
  toggleDrawer: (drawerOpened: boolean) => void;
  toggleTrackPanel: (trackPanelOpened?: boolean) => void;
  trackPanelModalOpened: boolean;
  trackPanelModalView: string;
  trackPanelOpened: boolean;
};

const TrackPanelBar: FunctionComponent<TrackPanelBarProps> = (
  props: TrackPanelBarProps
) => {
  const drawerOpenedForGenome = props.drawerOpened[props.activeGenomeId];

  const moveTrackPanel = useCallback(() => {
    if (drawerOpenedForGenome === true) {
      props.toggleDrawer(false);
    } else {
      props.toggleTrackPanel();
    }
  }, [drawerOpenedForGenome, props.toggleDrawer, props.toggleTrackPanel]);

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
            {props.trackPanelOpened ? (
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
            trackPanelModalOpened={props.trackPanelModalOpened}
            trackPanelModalView={props.trackPanelModalView}
          />
        ))}
      </dl>
    </div>
  );
};

export default TrackPanelBar;
