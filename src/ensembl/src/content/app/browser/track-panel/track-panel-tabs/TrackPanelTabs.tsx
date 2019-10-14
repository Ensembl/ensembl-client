import React from 'react';
import classNames from 'classnames';

import { TrackSet } from '../trackPanelConfig';
import { EnsObject } from 'src/ens-object/ensObjectTypes';

import styles from './TrackPanelTabs.scss';

export type TrackPanelTabsProps = {
  closeDrawer: () => void;
  ensObject: EnsObject;
  isDrawerOpened: boolean;
  selectTrackPanelTab: (selectedTrackPanelTab: TrackSet) => void;
  selectedTrackPanelTab: TrackSet;
  toggleTrackPanel: (isTrackPanelOpened: boolean) => void;
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
};

const TrackPanelTabs = (props: TrackPanelTabsProps) => {
  const handleTabClick = (value: TrackSet) => {
    if (!props.ensObject.genome_id) {
      return;
    }

    if (!props.isTrackPanelOpened) {
      props.toggleTrackPanel(true);
    }

    if (props.isDrawerOpened) {
      props.closeDrawer();
    }

    props.selectTrackPanelTab(value);
  };

  const getTrackPanelTabClassNames = (trackSet: TrackSet) => {
    const isTrackPanelTabActive =
      props.isTrackPanelOpened &&
      props.ensObject.genome_id &&
      props.selectedTrackPanelTab === trackSet &&
      !props.isDrawerOpened &&
      !props.isTrackPanelModalOpened;

    return classNames(styles.trackPanelTab, {
      [styles.trackPanelTabActive]: isTrackPanelTabActive,
      [styles.trackPanelTabArrow]: isTrackPanelTabActive,
      [styles.trackPanelTabDisabled]: !props.ensObject.genome_id
    });
  };

  return (
    <dl className={`${styles.trackPanelTabs}`}>
      {Object.values(TrackSet).map((value: TrackSet) => (
        <dd
          className={getTrackPanelTabClassNames(value)}
          key={value}
          onClick={() => handleTabClick(value)}
        >
          <button>{value}</button>
        </dd>
      ))}
    </dl>
  );
};

export default TrackPanelTabs;
