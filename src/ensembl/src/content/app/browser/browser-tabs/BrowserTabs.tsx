import React, { FunctionComponent } from 'react';

import { TrackType } from '../track-panel/trackPanelConfig';
import { EnsObject } from 'src/ens-object/ensObjectTypes';
import styles from './BrowserTabs.scss';

type BrowserTabsProps = {
  closeDrawer: () => void;
  ensObject: EnsObject;
  isDrawerOpened: boolean;
  genomeSelectorActive: boolean;
  selectBrowserTabAndSave: (selectedBrowserTab: TrackType) => void;
  selectedBrowserTab: TrackType;
  isTrackPanelModalOpened: boolean;
};

const BrowserTabs: FunctionComponent<BrowserTabsProps> = (
  props: BrowserTabsProps
) => {
  const handleTabClick = (value: TrackType) => {
    if (props.genomeSelectorActive || !props.ensObject.genome_id) {
      return;
    }

    if (props.isDrawerOpened) {
      props.closeDrawer();
    }

    props.selectBrowserTabAndSave(value);
  };

  const getBrowserTabClasses = (trackType: TrackType) => {
    const {
      isDrawerOpened,
      selectedBrowserTab,
      isTrackPanelModalOpened
    } = props;
    let classNames = styles.browserTab;

    if (
      props.ensObject.genome_id &&
      selectedBrowserTab === trackType &&
      !isDrawerOpened &&
      !isTrackPanelModalOpened
    ) {
      classNames += ` ${styles.browserTabActive} ${styles.browserTabArrow}`;
    } else if (!props.ensObject.genome_id) {
      classNames = styles.browserTabDisabled;
    }

    return classNames;
  };

  return (
    <dl className={`${styles.browserTabs} show-for-large`}>
      {Object.values(TrackType).map((value: TrackType) => (
        <dd
          className={getBrowserTabClasses(value)}
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
