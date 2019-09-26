import React, { useRef, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { BrowserNavStates, CogList } from '../browserState';
import BrowserCogList from '../BrowserCogList';
import { ZmenuController } from 'src/content/app/browser/zmenu';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';
import {
  getBrowserCogTrackList,
  getBrowserNavOpened,
  getBrowserActivated,
  getRegionEditorActive,
  getRegionFieldActive
} from '../browserSelectors';
import {
  activateBrowser,
  updateBrowserActivated,
  updateBrowserNavStates,
  setChrLocation,
  setActualChrLocation,
  updateMessageCounter,
  updateBrowserActiveEnsObjectIdsAndSave,
  updateDefaultPositionFlag
} from '../browserActions';

import { changeHighlightedTrackId } from 'src/content/app/browser/track-panel/trackPanelActions';

import { ChrLocation } from '../browserState';

import { CircleLoader } from 'src/shared/components/loader/Loader';

import { RootState } from 'src/store';
import { TrackStates } from '../track-panel/trackPanelConfig';
import { BROWSER_CONTAINER_ID } from '../browser-constants';

import styles from './BrowserImage.scss';
import browserStyles from '../Browser.scss';

type BrowserImageProps = {
  trackStates: TrackStates;
  browserCogTrackList: CogList;
  browserNavOpened: boolean;
  regionEditorActive: boolean;
  regionFieldActive: boolean;
  browserActivated: boolean;
  activateBrowser: () => void;
  updateBrowserNavStates: (browserNavStates: BrowserNavStates) => void;
  updateBrowserActivated: (browserActivated: boolean) => void;
  updateBrowserActiveEnsObject: (objectId: string) => void;
  setChrLocation: (chrLocation: ChrLocation) => void;
  setActualChrLocation: (chrLocation: ChrLocation) => void;
  updateMessageCounter: (count: number) => void;
  updateDefaultPositionFlag: (isDefaultPosition: boolean) => void;
  changeHighlightedTrackId: (trackId: string) => void;
};

type BpaneOutPayload = {
  bumper?: BrowserNavStates;
  focus?: string;
  'message-counter'?: number;
  'intended-location'?: ChrLocation;
  'actual-location'?: ChrLocation;
  'is-focus-position'?: boolean;
};

const parseLocation = (location: ChrLocation) => {
  // FIXME: is there any reason to receive genome and chromosome in the same string?
  const [genomeAndChromosome, start, end] = location;
  const [, chromosome] = genomeAndChromosome.split(':');
  return [chromosome, start, end] as ChrLocation;
};

export const BrowserImage = (props: BrowserImageProps) => {
  const browserRef = useRef<HTMLDivElement>(null);
  const listenBpaneOut = useCallback((payload: BpaneOutPayload) => {
    const ensObjectId = payload.focus;
    const navIconStates = payload.bumper as BrowserNavStates;
    const intendedLocation = payload['intended-location'];
    const actualLocation = payload['actual-location'] || intendedLocation;
    const messageCount = payload['message-counter'];
    const isFocusObjectInDefaultPosition = payload['is-focus-position'];

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

    if (typeof isFocusObjectInDefaultPosition === 'boolean') {
      props.updateDefaultPositionFlag(isFocusObjectInDefaultPosition);
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

  const browserImageClassNames = classNames(styles.browserImagePlus, {
    [browserStyles.semiOpaque]:
      props.regionEditorActive || props.regionFieldActive
  });

  return (
    <>
      {!props.browserActivated && (
        <div className={styles.loaderWrapper}>
          <CircleLoader />
        </div>
      )}
      <div className={browserImageClassNames}>
        {props.regionEditorActive || props.regionFieldActive ? (
          <div className={browserStyles.browserOverlay}></div>
        ) : null}
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

const mapStateToProps = (state: RootState) => ({
  browserCogTrackList: getBrowserCogTrackList(state),
  browserNavOpened: getBrowserNavOpened(state),
  browserActivated: getBrowserActivated(state),
  regionEditorActive: getRegionEditorActive(state),
  regionFieldActive: getRegionFieldActive(state)
});

const mapDispatchToProps = {
  activateBrowser,
  updateBrowserActivated,
  updateBrowserNavStates,
  updateBrowserActiveEnsObject: updateBrowserActiveEnsObjectIdsAndSave,
  setChrLocation,
  setActualChrLocation,
  updateMessageCounter,
  updateDefaultPositionFlag,
  changeHighlightedTrackId
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserImage);
