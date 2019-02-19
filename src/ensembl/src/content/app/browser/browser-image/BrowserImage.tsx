import React, { FunctionComponent, RefObject, useEffect } from 'react';
import { connect } from 'react-redux';

import { updateBrowserNavStates, updateChrLocation } from '../browserActions';
import { BrowserNavStates, ChrLocation } from '../browserState';
import { getBrowserNavOpened } from '../browserSelectors';
import { RootState } from 'src/rootReducer';

import styles from './BrowserImage.scss';

type StateProps = {
  browserNavOpened: boolean;
};

type DispatchProps = {
  updateBrowserNavStates: (browserNavStates: BrowserNavStates) => void;
  updateChrLocation: (chrLocation: ChrLocation) => void;
};

type OwnProps = {
  browserRef: RefObject<HTMLDivElement>;
};

type BrowserImageProps = StateProps & DispatchProps & OwnProps;

type BpaneOutEvent = Event & {
  detail: {
    bumper?: BrowserNavStates;
    location?: ChrLocation;
  };
};

export const BrowserImage: FunctionComponent<BrowserImageProps> = (
  props: BrowserImageProps
) => {
  const listenBpaneOut = (event: Event) => {
    const bpaneOutEvent = event as BpaneOutEvent;
    const navIconStates = bpaneOutEvent.detail.bumper as BrowserNavStates;
    const chrLocation = bpaneOutEvent.detail.location as ChrLocation;

    if (navIconStates) {
      props.updateBrowserNavStates(navIconStates);
    }

    if (chrLocation) {
      props.updateChrLocation(chrLocation);
    }
  };

  useEffect(() => {
    let currentEl: HTMLDivElement | null = null;

    if (props.browserRef) {
      currentEl = props.browserRef.current as HTMLDivElement;

      activateIfPossible(currentEl as HTMLDivElement);

      currentEl.addEventListener('bpane-out', listenBpaneOut);
    }

    return function cleanup() {
      if (currentEl) {
        currentEl.removeEventListener('bpane-out', listenBpaneOut);
      }
    };
  }, []);

  return (
    <div
      className={getBrowserImageClasses(props.browserNavOpened)}
      ref={props.browserRef}
    />
  );
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

function getBrowserImageClasses(browserNavOpened: boolean): string {
  let classes = styles.browserStage;

  if (browserNavOpened === true) {
    classes += ` ${styles.shorter}`;
  }

  return classes;
}

const mapStateToProps = (state: RootState): StateProps => ({
  browserNavOpened: getBrowserNavOpened(state)
});

const mapDispatchToProps: DispatchProps = {
  updateBrowserNavStates,
  updateChrLocation
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserImage);
