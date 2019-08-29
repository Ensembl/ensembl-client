import React, {
  FunctionComponent,
  useRef,
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
};

type OwnProps = {
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
  const browserRef: React.RefObject<HTMLDivElement> = useRef(null);
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
    props.activateBrowser();

    return function cleanup() {
      props.updateBrowserActivated(false);
    };
  }, []);

  useEffect(() => {
    if (props.browserCogTrackList) {
      const ons: string[] = [];
      const offs: string[] = [];

      /* what the frontend and backend call labels and names is flipped */
      Object.keys(props.browserCogTrackList).forEach((name) => {
        /* undefined means not seen means on for names */
        if (props.trackConfigNames[name]) {
          ons.push(`${name}:label`);
        } else {
          offs.push(`${name}:label`);
        }
        /* undefined means not seen means off for labels */
        if (props.trackConfigLabel[name] !== false) {
          ons.push(`${name}:names`);
        } else {
          offs.push(`${name}:names`);
        }
      });
      browserMessagingService.send('bpane', {
        off: offs,
        on: ons
      });
    }
  }, [
    props.trackConfigNames,
    props.trackConfigLabel,
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
          ref={browserRef}
        />
        <BrowserCogList />
        <ZmenuController browserRef={browserRef} />
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
  updateMessageCounter
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserImage);
