import React, { useState } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { RootState } from 'src/store';
import { getBreakpointWidth } from 'src/global/globalSelectors';
import { BreakpointWidth } from 'src/global/globalConfig';

import ChromosomeNavigator from 'src/content/app/browser/chromosome-navigator/ChromosomeNavigator';
import BrowserNavBarRegionSwitcher from './BrowserNavBarRegionSwitcher';

import { ReactComponent as CloseIcon } from 'static/img/shared/close.svg';

import styles from './BrowserNavBarMain.scss';

enum Content {
  CHROMOSOME,
  REGION_SWITCHER
}

export type BrowserNavBarMainProps = {
  breakpointWidth: BreakpointWidth;
};

export const BrowserNavBarMain = (props: BrowserNavBarMainProps) => {
  const [view, changeView] = useState<Content>(Content.CHROMOSOME);

  const handleViewChange = (newView: Content) => {
    changeView(newView);
  };

  const shouldShowChromsomeNavigator =
    props.breakpointWidth >= BreakpointWidth.LAPTOP &&
    view === Content.CHROMOSOME;

  return (
    <div className={styles.browserNavBarMain}>
      <div className={styles.content}>
        {shouldShowChromsomeNavigator ? (
          <div className={styles.contentChromosomeNavigator}>
            <ChromosomeNavigator />
          </div>
        ) : (
          <BrowserNavBarRegionSwitcher />
        )}
      </div>
      {props.breakpointWidth >= BreakpointWidth.LAPTOP && (
        <ContentSwitcher currentView={view} onSwitch={handleViewChange} />
      )}
    </div>
  );
};

type ContentSwitcherProps = {
  currentView: Content;
  onSwitch: (view: Content) => void;
};

export const ContentSwitcher = (props: ContentSwitcherProps) => {
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

const mapStateToProps = (state: RootState) => ({
  breakpointWidth: getBreakpointWidth(state)
});

export default connect(mapStateToProps)(BrowserNavBarMain);
