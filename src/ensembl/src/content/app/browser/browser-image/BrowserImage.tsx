import React, {
  FunctionComponent,
  RefObject,
  useEffect,
  useCallback
} from 'react';

import styles from './BrowserImage.scss';
import { ChrLocation, BrowserNavStates } from '../browserState';
import BrowserCogList from '../BrowserCogList';

type BrowserImageProps = {
  browserRef: RefObject<HTMLDivElement>;
  browserNavOpened: boolean;
  updateBrowserNavStates: (browserNavStates: BrowserNavStates) => void;
  updateChrLocation: (chrLocation: ChrLocation) => void;
  updateBrowserActivated: (browserActivated: boolean) => void;
};

type BpaneOutEvent = Event & {
  detail: {
    bumper?: BrowserNavStates;
    location?: ChrLocation;
  };
};

export const BrowserImage: FunctionComponent<BrowserImageProps> = (
  props: BrowserImageProps
) => {
  const listenBpaneOut = useCallback((event: Event) => {
    const bpaneOutEvent = event as BpaneOutEvent;
    const navIconStates = bpaneOutEvent.detail.bumper as BrowserNavStates;
    const chrLocation = bpaneOutEvent.detail.location as ChrLocation;

    if (navIconStates) {
      props.updateBrowserNavStates(navIconStates);
    }

    if (chrLocation) {
      props.updateChrLocation(chrLocation);
    }
  }, []);

  useEffect(() => {
    const currentEl: HTMLDivElement = props.browserRef
      .current as HTMLDivElement;

    activateBrowser(currentEl, props);

    currentEl.addEventListener('bpane-out', listenBpaneOut);

    return function cleanup() {
      if (currentEl && currentEl.ownerDocument) {
        props.updateBrowserActivated(false);

        currentEl.removeEventListener('bpane-out', listenBpaneOut);
      }
    };
  }, [props.browserRef]);

  return (
    <div className={styles.browserImagePlus}>
      <div
        className={getBrowserImageClasses(props.browserNavOpened)}
        ref={props.browserRef}
      />
      <BrowserCogList browserRef={props.browserRef} />
    </div>
  );
};

function activateBrowser(currentEl: HTMLDivElement, props: BrowserImageProps) {
  if (currentEl && currentEl.ownerDocument) {
    const bodyEl = currentEl.ownerDocument.body as HTMLBodyElement;

    // no need to check for DOM mutations if the browser class is already set in body
    if (bodyEl.classList.contains('browser-app-ready')) {
      dispatchActivateEvents(currentEl, props);
      return;
    }

    const observerConfig = {
      attributeFilter: ['class'],
      attributes: true,
      subtree: false
    };

    const observerCallback = (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        const mutationNode = mutation.target as HTMLElement;

        if (mutationNode.classList.contains('browser-app-ready')) {
          dispatchActivateEvents(currentEl, props);

          observer.disconnect();
          break;
        }
      }
    };

    const observer = new MutationObserver(observerCallback);

    observer.observe(bodyEl, observerConfig);
  }
}

function dispatchActivateEvents(
  currentEl: HTMLDivElement,
  props: BrowserImageProps
) {
  const activateEvent = new CustomEvent('bpane-activate', {
    bubbles: true,
    detail: {
      'config-url':
        'http://ec2-34-204-108-251.compute-1.amazonaws.com:8060/browser/config',
      key: 'main'
    }
  });

  currentEl.dispatchEvent(activateEvent);
  props.updateBrowserActivated(true);
}

function getBrowserImageClasses(browserNavOpened: boolean): string {
  let classes = styles.browserStage;

  if (browserNavOpened === true) {
    classes += ` ${styles.shorter}`;
  }

  return classes;
}

export default BrowserImage;
