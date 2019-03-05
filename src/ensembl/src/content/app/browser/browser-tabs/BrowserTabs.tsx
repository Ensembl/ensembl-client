import React, { FunctionComponent, useEffect, useState } from 'react';

import { TrackType } from '../track-panel/trackPanelConfig';

import styles from './BrowserTabs.scss';

type BrowserTabsProps = {
  drawerOpened: boolean;
  genomeSelectorActive: boolean;
  selectBrowserTab: (selectedBrowserTab: TrackType) => void;
  selectedBrowserTab: TrackType;
};

type ClickHandlers = {
  [key: string]: () => void;
};

const BrowserTabs: FunctionComponent<BrowserTabsProps> = (
  props: BrowserTabsProps
) => {
  const initClickHandlers: ClickHandlers = {};
  const [clickHandlers, setClickHandlers] = useState(initClickHandlers);

  const getBrowserTabClasses = (trackType: TrackType) => {
    let classNames = styles.browserTab;

    if (props.selectedBrowserTab === trackType) {
      classNames += ` ${styles.browserTabActive}`;

      if (props.drawerOpened === false) {
        classNames += ` ${styles.browserTabArrow}`;
      }
    }

    return classNames;
  };

  useEffect(() => {
    const callbacks: ClickHandlers = {};

    Object.values(TrackType).forEach((value: TrackType) => {
      callbacks[value] = () => {
        if (props.genomeSelectorActive === true) {
          return;
        }

        props.selectBrowserTab(value);
      };
    });

    setClickHandlers(callbacks);
  }, [props.genomeSelectorActive]);

  return (
    <dl className={`${styles.browserTabs} show-for-large`}>
      {Object.values(TrackType).map((value: TrackType) => (
        <dd
          className={getBrowserTabClasses(value)}
          key={value}
          onClick={clickHandlers[value]}
        >
          <button>{value}</button>
        </dd>
      ))}
    </dl>
  );
};

export default BrowserTabs;
