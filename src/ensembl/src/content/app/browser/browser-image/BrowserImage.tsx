import React, {
  FunctionComponent,
  RefObject,
  useEffect,
  useCallback
} from 'react';
import { connect } from 'react-redux';

import styles from './BrowserImage.scss';
import { BrowserNavStates, CogList } from '../browserState';
import BrowserCogList from '../BrowserCogList';
import { ZmenuController } from 'src/content/app/browser/zmenu';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';
import {
  getTrackConfigNames,
  getTrackConfigLabel,
  getBrowserCogTrackList,
  getBrowserNavOpened,
  getBrowserActivated,
  getBrowserActiveGenomeId
} from '../browserSelectors';
import {
  activateBrowser,
  updateBrowserActivated,
  updateBrowserNavStates,
  setChrLocation,
  updateMessageCounter
} from '../browserActions';

import { ChrLocation } from '../browserState';

import { CircleLoader } from 'src/shared/loader/Loader';

import { RootState } from 'src/store';
import { TrackStates } from '../track-panel/trackPanelConfig';

type StateProps = {
  activeGenomeId: string | null;
  browserCogTrackList: CogList;
  browserNavOpened: boolean;
  trackConfigNames: any;
  trackConfigLabel: any;
  browserActivated: boolean;
};

type DispatchProps = {
  activateBrowser: (browserEl: HTMLDivElement) => void;
  updateBrowserNavStates: (browserNavStates: BrowserNavStates) => void;
  updateBrowserActivated: (browserActivated: boolean) => void;
  setChrLocation: (chrLocation: ChrLocation) => void;
  updateMessageCounter: (count: number) => void;
};

type OwnProps = {
  browserRef: RefObject<HTMLDivElement>;
  trackStates: TrackStates;
};

type BrowserImageProps = StateProps & DispatchProps & OwnProps;

type BpaneOutEvent = Event & {
  detail: {
    bumper?: BrowserNavStates;
    'message-counter'?: number;
    location?: string;
  };
};

export const BrowserImage: FunctionComponent<BrowserImageProps> = (
  props: BrowserImageProps
) => {
  const dispatchSetChrLocation = (chrLocation: ChrLocation) => {
    props.setChrLocation(chrLocation);
  };

  const listenBpaneOut = useCallback((event: Event) => {
    const bpaneOutEvent = event as BpaneOutEvent;
    const navIconStates = bpaneOutEvent.detail.bumper as BrowserNavStates;
    const location = bpaneOutEvent.detail.location;
    const messageCount = bpaneOutEvent.detail['message-counter'];
    console.log('event', event);

    if (navIconStates) {
      props.updateBrowserNavStates(navIconStates);
    }

    if (location) {
      // FIXME: is there any reason to receive genome and chromosome in the same string?
      const [genomeAndChromosome, start, end] = location;
      const [, chromosome] = genomeAndChromosome.split(':');
      const chrLocation = [
        chromosome,
        Number(start),
        Number(end)
      ] as ChrLocation;

      dispatchSetChrLocation(chrLocation);
    }

    if (messageCount) {
      props.updateMessageCounter(messageCount);
    }
  }, []);

  useEffect(() => {
    browserMessagingService.setup(props.browserRef.current as HTMLDivElement);
    browserMessagingService.subscribe('bpane-out', listenBpaneOut);

    return () => browserMessagingService.onUnmount();
  }, []);

  useEffect(() => {
    const currentEl: HTMLDivElement = props.browserRef
      .current as HTMLDivElement;

    bootstrapBrowser(currentEl, props);

    return function cleanup() {
      if (currentEl && currentEl.ownerDocument) {
        props.updateBrowserActivated(false);
      }
    };
  }, [props.browserRef]);

  useEffect(() => {
    if (props.browserCogTrackList) {
      const ons: string[] = [];
      const offs: string[] = [];

      /* what the frontend and backend call labels and names is flipped */
      Object.keys(props.browserCogTrackList).map((name) => {
        /* undefined means not seen means on for names */
        if (props.trackConfigNames[name]) {
          ons.push(name + ':label');
        } else {
          offs.push(name + ':label');
        }
        /* undefined means not seen means off for labels */
        if (props.trackConfigLabel[name] !== false) {
          ons.push(name + ':names');
        } else {
          offs.push(name + ':names');
        }
      });
      const stateEvent = new CustomEvent('bpane', {
        bubbles: true,
        detail: {
          off: offs,
          on: ons
        }
      });
      if (props.browserRef.current) {
        props.browserRef.current.dispatchEvent(stateEvent);
      }
    }
  }, [
    props.trackConfigNames,
    props.trackConfigLabel,
    props.browserRef,
    props.browserCogTrackList
  ]);

  return (
    <>
      {!props.browserActivated && (
        <div className={styles.loaderWrapper}>
          <CircleLoader />
        </div>
      )}
      <div className={styles.browserImagePlus}>
        <div
          className={getBrowserImageClasses(props.browserNavOpened)}
          ref={props.browserRef}
        />
        <BrowserCogList />
        <ZmenuController browserRef={props.browserRef} />
      </div>
    </>
  );
};

function bootstrapBrowser(currentEl: HTMLDivElement, props: BrowserImageProps) {
  if (currentEl && currentEl.ownerDocument) {
    const bodyEl = currentEl.ownerDocument.body as HTMLBodyElement;

    // no need to check for DOM mutations if the browser class is already set in body
    if (bodyEl.classList.contains('browser-app-ready')) {
      props.activateBrowser(currentEl);
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
          props.activateBrowser(currentEl);

          observer.disconnect();
          break;
        }
      }
    };

    const observer = new MutationObserver(observerCallback);

    observer.observe(bodyEl, observerConfig);
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
  activeGenomeId: getBrowserActiveGenomeId(state),
  browserCogTrackList: getBrowserCogTrackList(state),
  browserNavOpened: getBrowserNavOpened(state),
  trackConfigLabel: getTrackConfigLabel(state),
  trackConfigNames: getTrackConfigNames(state),
  browserActivated: getBrowserActivated(state)
});

const mapDispatchToProps: DispatchProps = {
  activateBrowser,
  updateBrowserActivated,
  updateBrowserNavStates,
  setChrLocation,
  updateMessageCounter
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserImage);
