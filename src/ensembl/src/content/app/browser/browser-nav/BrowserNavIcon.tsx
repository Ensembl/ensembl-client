import React, { PureComponent } from 'react';

import { BrowserNavItem } from '../browserConfig';

import styles from './BrowserNavIcon.scss';

type BrowserNavIconProps = {
  browserNavItem: BrowserNavItem;
};

class BrowserNavIcon extends PureComponent<BrowserNavIconProps> {
  constructor(props: BrowserNavIconProps) {
    super(props);

    this.navigateBrowser = this.navigateBrowser.bind(this);
  }

  public render() {
    const { browserNavItem } = this.props;

    return (
      <dd className={styles.browserNavIcon}>
        <button
          title={browserNavItem.description}
          onClick={this.navigateBrowser}
        >
          <img src={browserNavItem.icon.on} alt={browserNavItem.description} />
        </button>
      </dd>
    );
  }

  private navigateBrowser() {
    const { detail } = this.props.browserNavItem;

    const navEvent = new CustomEvent('bpane', {
      bubbles: true,
      detail
    });

    const browserCanvas = document.querySelector('#bpane-canv') as Element;

    browserCanvas.dispatchEvent(navEvent);
  }
}

export default BrowserNavIcon;
