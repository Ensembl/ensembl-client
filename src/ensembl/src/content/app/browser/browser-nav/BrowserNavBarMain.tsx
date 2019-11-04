import React, { useState } from 'react';

import ChromosomeNavigator from 'src/content/app/browser/chromosome-navigator/ChromosomeNavigator';
import BrowserNavBarRegionSwitcher from './BrowserNavBarRegionSwitcher';

import styles from './BrowserNavBarMain.scss';

enum Content {
  CHROMOSOME,
  REGION_SWITCHER
}

const BrowserNavBarMain = () => {
  const [view, changeView] = useState<Content>(Content.REGION_SWITCHER);

  const onChangeViewClick = () => {
    const newView =
      view === Content.CHROMOSOME
        ? Content.REGION_SWITCHER
        : Content.CHROMOSOME;
    changeView(newView);
  };

  return (
    <div className={styles.browserNavBarMain}>
      <div className={styles.content}>
        {view === Content.CHROMOSOME ? (
          <ChromosomeNavigator />
        ) : (
          <BrowserNavBarRegionSwitcher />
        )}
      </div>
      <div className={styles.contentSwitcherArea}>
        <span className={styles.contentSwitcher} onClick={onChangeViewClick}>
          Change
        </span>
      </div>
    </div>
  );
};

export default BrowserNavBarMain;
