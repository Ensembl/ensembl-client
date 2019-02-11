import React, { FunctionComponent, useEffect } from 'react';

import styles from './BrowserImage.scss';

type BrowserImageProps = {};

const BrowserImage: FunctionComponent<BrowserImageProps> = () => {
  const browserCanvas: React.RefObject<HTMLDivElement> = React.createRef();
  let currentEl: HTMLDivElement | null = null;

  useEffect(() => {
    if (browserCanvas) {
      currentEl = browserCanvas.current as HTMLDivElement;
    }

    activateIfPossible(currentEl as HTMLDivElement);
  }, [currentEl]);

  return <div className={styles.browserStage} ref={browserCanvas} />;
};

function activateIfPossible(currentEl: HTMLDivElement) {
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
    setTimeout(() => activateIfPossible(currentEl), 250);
  }
}

export default BrowserImage;
