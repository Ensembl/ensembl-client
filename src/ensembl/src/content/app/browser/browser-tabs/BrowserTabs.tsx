import React from 'react';
import classNames from 'classnames';

import { TrackSet } from '../track-panel/trackPanelConfig';
import { EnsObject } from 'src/ens-object/ensObjectTypes';

import styles from './BrowserTabs.scss';

type BrowserTabsProps = {
  closeDrawer: () => void;
  ensObject: EnsObject;
  isDrawerOpened: boolean;
  genomeSelectorActive: boolean;
  selectBrowserTabAndSave: (selectedBrowserTab: TrackSet) => void;
  selectedBrowserTab: TrackSet;
  toggleTrackPanel: (isTrackPanelOpened: boolean) => void;
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
};

const BrowserTabs = (props: BrowserTabsProps) => {
  const handleTabClick = (value: TrackSet) => {
    if (props.genomeSelectorActive || !props.ensObject.genome_id) {
      return;
    }

    if (!props.isTrackPanelOpened) {
      props.toggleTrackPanel(true);
    }

    if (props.isDrawerOpened) {
      props.closeDrawer();
    }

    props.selectBrowserTabAndSave(value);
  };

  const getBrowserTabClassNames = (trackSet: TrackSet) => {
    const isBrowserTabActive =
      props.isTrackPanelOpened &&
      props.ensObject.genome_id &&
      props.selectedBrowserTab === trackSet &&
      !props.isDrawerOpened &&
      !props.isTrackPanelModalOpened;

    return classNames(styles.browserTab, {
      [styles.browserTabActive]: isBrowserTabActive,
      [styles.browserTabArrow]: isBrowserTabActive,
      [styles.browserTabDisabled]: !props.ensObject.genome_id
    });
  };

  return (
    <dl className={`${styles.browserTabs}`}>
      {Object.values(TrackSet).map((value: TrackSet) => (
        <dd
          className={getBrowserTabClassNames(value)}
          key={value}
          onClick={() => handleTabClick(value)}
        >
          <button>{value}</button>
        </dd>
      ))}
    </dl>
  );
};

export default BrowserTabs;
