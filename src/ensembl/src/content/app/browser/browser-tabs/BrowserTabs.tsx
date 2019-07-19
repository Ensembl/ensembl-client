import React, { FunctionComponent } from 'react';

import { TrackType } from '../track-panel/trackPanelConfig';
import { EnsObject } from 'src/ens-object/ensObjectTypes';
import styles from './BrowserTabs.scss';

type BrowserTabsProps = {
  activeGenomeId: string;
  ensObject: EnsObject;
  drawerOpened: { [genomeId: string]: boolean };
  genomeSelectorActive: boolean;
  selectBrowserTabAndSave: (selectedBrowserTab: TrackType) => void;
  selectedBrowserTab: { [genomeId: string]: TrackType };
  toggleDrawer: (drawerOpened: boolean) => void;
  trackPanelModalOpened: boolean;
};

const BrowserTabs: FunctionComponent<BrowserTabsProps> = (
  props: BrowserTabsProps
) => {
  const drawerOpenedForGenome = props.drawerOpened[props.activeGenomeId];

  const handleTabClick = (value: TrackType) => {
    if (props.genomeSelectorActive || !props.ensObject.genome_id) {
      return;
    }

    if (drawerOpenedForGenome === true) {
      props.toggleDrawer(false);
    }

    props.selectBrowserTabAndSave(value);
  };

  const getBrowserTabClasses = (trackType: TrackType) => {
    const { activeGenomeId, drawerOpened, trackPanelModalOpened } = props;
    const selectedBrowserTab =
      props.selectedBrowserTab[activeGenomeId] || TrackType.GENOMIC;
    let classNames = styles.browserTab;

    if (
      props.ensObject.genome_id &&
      selectedBrowserTab === trackType &&
      drawerOpened[activeGenomeId] === false &&
      trackPanelModalOpened === false
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
