import React, { PureComponent } from 'react';

import styles from './BrowserImage.scss';

type BrowserImageProps = {};

class BrowserImage extends PureComponent<BrowserImageProps> {
  private browserCanvas: React.RefObject<HTMLDivElement>;

  constructor(props: BrowserImageProps) {
    super(props);

    this.browserCanvas = React.createRef();
  }

  public componentDidMount() {
    const currentEl = this.browserCanvas.current as HTMLElement;
    this.activateIfPossible(currentEl);
  }

  public render() {
    return <div className={styles.browserStage} ref={this.browserCanvas} />;
  }

  private activateIfPossible(currentEl: HTMLElement) {
    const activateEvent = new CustomEvent('bpane-activate', {
      bubbles: true,
      detail: {
        key: 'main'
      }
    });

    let done = false;

    if (currentEl && currentEl.ownerDocument) {
      const bodyEl = currentEl.ownerDocument.querySelector(
        'body'
      ) as HTMLBodyElement;

      if (bodyEl.classList.contains('browser-app-ready')) {
        currentEl.dispatchEvent(activateEvent);
        done = true;
      }
    }

    if (!done) {
      setTimeout(() => this.activateIfPossible(currentEl), 250);
    }
  }
}

export default BrowserImage;
