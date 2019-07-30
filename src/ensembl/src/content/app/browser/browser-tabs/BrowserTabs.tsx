import React, { FunctionComponent } from 'react';
import classNames from 'classnames';

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
  toggleTrackPanel: (isTrackPanelOpened: boolean) => void;
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
};

const BrowserTabs: FunctionComponent<BrowserTabsProps> = (
  props: BrowserTabsProps
) => {
  const handleTabClick = (value: TrackType) => {
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

  const isBrowserTabActive = (trackType: TrackType) => {
    return (
      props.isTrackPanelOpened &&
      props.ensObject.genome_id &&
      props.selectedBrowserTab === trackType &&
      !props.isDrawerOpened &&
      !props.isTrackPanelModalOpened
    );
  };

  const getBrowserTabClassNames = (trackType: TrackType) =>
    classNames(styles.browserTab, {
      [styles.browserTabActive]: isBrowserTabActive(trackType),
      [styles.browserTabArrow]: isBrowserTabActive(trackType),
      [styles.browserTabDisabled]: !props.ensObject.genome_id
    });

  return (
    <dl className={`${styles.browserTabs}`}>
      {Object.values(TrackType).map((value: TrackType) => (
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
