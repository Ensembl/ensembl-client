/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { getBreakpointWidth } from 'src/global/globalSelectors';
import { BreakpointWidth } from 'src/global/globalConfig';

import ChromosomeNavigator from 'src/content/app/browser/chromosome-navigator/ChromosomeNavigator';
import BrowserNavBarRegionSwitcher from './BrowserNavBarRegionSwitcher';
import CloseButton from 'src/shared/components/close-button/CloseButton';

import styles from './BrowserNavBarMain.scss';

enum Content {
  CHROMOSOME,
  REGION_SWITCHER
}

export type BrowserNavBarMainProps = {
  viewportWidth: BreakpointWidth;
};

export const BrowserNavBarMain = () => {
  const viewportWidth = useSelector(getBreakpointWidth);
  const [view, changeView] = useState<Content>(Content.CHROMOSOME);

  const handleViewChange = (newView: Content) => {
    changeView(newView);
  };

  const shouldShowChromosomeNavigator =
    viewportWidth >= BreakpointWidth.LAPTOP && view === Content.CHROMOSOME;

  return (
    <div className={styles.browserNavBarMain}>
      <div className={styles.content}>
        {shouldShowChromosomeNavigator ? (
          <div className={styles.contentChromosomeNavigator}>
            <ChromosomeNavigator />
          </div>
        ) : (
          <BrowserNavBarRegionSwitcher />
        )}
      </div>
      {viewportWidth >= BreakpointWidth.LAPTOP && (
        <ContentSwitcher currentView={view} onSwitch={handleViewChange} />
      )}
    </div>
  );
};

type ContentSwitcherProps = {
  currentView: Content;
  onSwitch: (view: Content) => void;
};

const ContentSwitcher = (props: ContentSwitcherProps) => {
  const handleClick = () => {
    const newView =
      props.currentView === Content.CHROMOSOME
        ? Content.REGION_SWITCHER
        : Content.CHROMOSOME;
    props.onSwitch(newView);
  };

  const switcherContent =
    props.currentView === Content.CHROMOSOME ? (
      <span className={styles.contentSwitcher} onClick={handleClick}>
        Change
      </span>
    ) : (
      <CloseButton onClick={handleClick} />
    );

  return <div className={styles.contentSwitcherArea}>{switcherContent}</div>;
};

export default BrowserNavBarMain;
