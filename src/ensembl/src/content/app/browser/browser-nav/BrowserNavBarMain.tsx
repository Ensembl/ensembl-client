import React, { useState } from 'react';
import classNames from 'classnames';

import ChromosomeNavigator from 'src/content/app/browser/chromosome-navigator/ChromosomeNavigator';
import BrowserNavBarRegionSwitcher from './BrowserNavBarRegionSwitcher';
import { ReactComponent as CloseIcon } from 'static/img/shared/close.svg';

import styles from './BrowserNavBarMain.scss';
import style from 'react-syntax-highlighter/dist/styles/prism/xonokai';

enum Content {
  CHROMOSOME,
  REGION_SWITCHER
}

const BrowserNavBarMain = () => {
  const [view, changeView] = useState<Content>(Content.CHROMOSOME);

  const onChangeViewClick = (newView: Content) => {
    changeView(newView);
  };

  return (
    <div className={styles.browserNavBarMain}>
      <div className={styles.content}>
        {view === Content.CHROMOSOME ? (
          <div className={styles.contentChromosomeNavigator}>
            <ChromosomeNavigator />
          </div>
        ) : (
          <BrowserNavBarRegionSwitcher />
        )}
      </div>
      <ContentSwitcher currentView={view} onSwitch={onChangeViewClick} />
    </div>
  );
};

type ContentSwitcherProps = {
  currentView: Content;
  onSwitch: (view: Content) => void;
};

const ContentSwitcher = (props: ContentSwitcherProps) => {
  const switcherContent =
    props.currentView === Content.CHROMOSOME ? 'Change' : <CloseIcon />;

  const handleClick = () => {
    const newView =
      props.currentView === Content.CHROMOSOME
        ? Content.REGION_SWITCHER
        : Content.CHROMOSOME;
    props.onSwitch(newView);
  };

  const contentSwitcherStyles = classNames(styles.contentSwitcher, {
    [styles.contentSwitcherClose]: props.currentView === Content.REGION_SWITCHER
  });

  return (
    <div className={styles.contentSwitcherArea}>
      <span className={contentSwitcherStyles} onClick={handleClick}>
        {switcherContent}
      </span>
    </div>
  );
};

export default BrowserNavBarMain;
