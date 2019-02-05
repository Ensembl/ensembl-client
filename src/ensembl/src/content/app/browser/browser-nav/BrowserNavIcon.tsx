import React, { FunctionComponent, memo } from 'react';

import { BrowserNavItem } from '../browserConfig';

import styles from './BrowserNavIcon.scss';

type BrowserNavIconProps = {
  browserNavItem: BrowserNavItem;
};

const BrowserNavIcon: FunctionComponent<BrowserNavIconProps> = memo(
  (props: BrowserNavIconProps) => {
    const navigateBrowser = () => {
      const { detail } = props.browserNavItem;

      const navEvent = new CustomEvent('bpane', {
        bubbles: true,
        detail
      });

      const browserCanvas = document.querySelector('.bpane-canv') as Element;

      browserCanvas.dispatchEvent(navEvent);
    };

    const { browserNavItem } = props;

    return (
      <dd className={styles.browserNavIcon}>
        <button title={browserNavItem.description} onClick={navigateBrowser}>
          <img src={browserNavItem.icon.on} alt={browserNavItem.description} />
        </button>
      </dd>
    );
  }
);

export default BrowserNavIcon;
