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
  getBrowserActivated
} from '../browserSelectors';
import {
  activateBrowser,
  updateBrowserActivated,
  updateBrowserNavStates,
  setChrLocation,
  setActualChrLocation,
  updateMessageCounter,
  updateBrowserActiveEnsObjectIdsAndSave
} from '../browserActions';

import { changeHighlightedTrack } from 'src/content/app/browser/track-panel/trackPanelActions';

import { ChrLocation } from '../browserState';

import { CircleLoader } from 'src/shared/components/loader/Loader';

import { RootState } from 'src/store';
import { TrackStates } from '../track-panel/trackPanelConfig';
import { BROWSER_CONTAINER_ID } from '../browser-constants';

type StateProps = {
  browserCogTrackList: CogList;
  browserNavOpened: boolean;
  trackConfigNames: any;
  trackConfigLabel: any;
  browserActivated: boolean;
};

type DispatchProps = {
  activateBrowser: () => void;
  updateBrowserNavStates: (browserNavStates: BrowserNavStates) => void;
  updateBrowserActivated: (browserActivated: boolean) => void;
  updateBrowserActiveEnsObject: (objectId: string) => void;
  setChrLocation: (chrLocation: ChrLocation) => void;
  setActualChrLocation: (chrLocation: ChrLocation) => void;
  updateMessageCounter: (count: number) => void;
  changeHighlightedTrack: (trackId: string) => void;
};

type OwnProps = {
  browserRef: RefObject<HTMLDivElement>;
  trackStates: TrackStates;
};

type BrowserImageProps = StateProps & DispatchProps & OwnProps;

type BpaneOutPayload = {
  bumper?: BrowserNavStates;
  focus?: string;
  'message-counter'?: number;
  'intended-location'?: ChrLocation;
  'actual-location'?: ChrLocation;
};

const parseLocation = (location: ChrLocation) => {
  // FIXME: is there any reason to receive genome and chromosome in the same string?
  const [genomeAndChromosome, start, end] = location;
  const [, chromosome] = genomeAndChromosome.split(':');
  return [chromosome, start, end] as ChrLocation;
};

export const BrowserImage: FunctionComponent<BrowserImageProps> = (
  props: BrowserImageProps
) => {
  const listenBpaneOut = useCallback((payload: BpaneOutPayload) => {
    const ensObjectId = payload.focus;
    const navIconStates = payload.bumper as BrowserNavStates;
    const intendedLocation = payload['intended-location'];
    const actualLocation = payload['actual-location'] || intendedLocation;
    const messageCount = payload['message-counter'];

    if (navIconStates) {
      props.updateBrowserNavStates(navIconStates);
    }

    if (intendedLocation) {
      props.setChrLocation(parseLocation(intendedLocation));
    }

    if (actualLocation) {
      props.setActualChrLocation(parseLocation(actualLocation));
    }

    if (ensObjectId) {
      props.updateBrowserActiveEnsObject(ensObjectId);
    }

    if (messageCount) {
      props.updateMessageCounter(messageCount);
    }
  }, []);

  useEffect(() => {
    const subscription = browserMessagingService.subscribe(
      'bpane-out',
      listenBpaneOut
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const currentEl: HTMLDivElement = props.browserRef
      .current as HTMLDivElement;
    props.activateBrowser();

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
          id={BROWSER_CONTAINER_ID}
          className={getBrowserImageClasses(props.browserNavOpened)}
          ref={props.browserRef}
        />
        <BrowserCogList />
        <ZmenuController
          browserRef={props.browserRef}
          changeHighlightedTrack={props.changeHighlightedTrack}
        />
      </div>
    </>
  );
};

function getBrowserImageClasses(browserNavOpened: boolean): string {
  let classes = styles.browserStage;

  if (browserNavOpened === true) {
    classes += ` ${styles.shorter}`;
  }

  return classes;
}

const mapStateToProps = (state: RootState): StateProps => ({
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
  updateBrowserActiveEnsObject: updateBrowserActiveEnsObjectIdsAndSave,
  setChrLocation,
  setActualChrLocation,
  updateMessageCounter,
  changeHighlightedTrack
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserImage);
