import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useCallback
} from 'react';
import { connect } from 'react-redux';

import {
  getBrowserCogList,
  getBrowserCogTrackList,
  getBrowserSelectedCog
} from './browserSelectors';
import BrowserCog from './BrowserCog';
import BrowserTrackConfig from './browser-track-config/BrowserTrackConfig';

import { updateCogList, updateCogTrackList } from './browserActions';

import styles from './BrowserCogList.scss';

import {
  getBrowserNavOpened,
  getChrLocation,
  getBrowserActivated,
  getDefaultChrLocation
} from './browserSelectors';

type BrowserCogListProps = {
  browserActivated: boolean;
  cogListRef: RefObject<HTMLDivElement>;
  browserRef: RefObject<HTMLDivElement>;
  browserCogList: BrowserCogList;
  browserCogTrackList: Array<number>;
  selectedCog: number | null;
  updateCogList: (val: number) => void;
  updateCogTrackList: (val: Array<number>) => void;
};

type BpaneScrollEvent = Event & {
  detail: {
    delta_y?: number;
    track_y?: Array<number>;
  };
};

const BrowserCogList: FunctionComponent<BrowserCogListProps> = (
  props: BrowserCogListProps
) => {
  let { selectedCog, browserCogTrackList } = props;
  const listenBpaneScroll = useCallback((event: Event) => {
    const bpaneScrollEvent = event as BpaneScrollEvent;
    if (bpaneScrollEvent.detail.delta_y) {
      props.updateCogList(bpaneScrollEvent.detail.delta_y);
    }
    if (bpaneScrollEvent.detail.track_y) {
      props.updateCogTrackList(bpaneScrollEvent.detail.track_y);
    }
  }, []);

  useEffect(() => {
    const currentEl: HTMLDivElement = props.browserRef
      .current as HTMLDivElement;
    currentEl.addEventListener('bpane-scroll', listenBpaneScroll);
  }, [props.cogListRef]);
  let inline = { transform: 'translate(0,' + props.browserCogList + 'px)' };
  let cogs = browserCogTrackList.map((pos, index) => {
    let inline = { top: pos + 'px' };
    return (
      <div key={index} className={styles.browserCogOuter} style={inline}>
        <BrowserCog cogActivated={props.selectedCog == index} index={index} />
      </div>
    );
  });

  return props.browserActivated ? (
    <div className={styles.browserTrackConfigOuter}>
      {selectedCog !== null && (
        <BrowserTrackConfig
          selectedCog={selectedCog}
          ypos={browserCogTrackList[selectedCog]}
        />
      )}
      <div className={styles.browserCogListOuter}>
        <div
          className={styles.browserCogListInner}
          style={inline}
          ref={props.cogListRef}
        >
          {cogs}
        </div>
      </div>
    </div>
  ) : null;
};

const mapDispatchToProps: DispatchProps = {
  updateCogList,
  updateCogTrackList
};

const mapStateToProps = (state: RootState): StateProps => ({
  browserActivated: getBrowserActivated(state),
  browserCogList: getBrowserCogList(state),
  browserCogTrackList: getBrowserCogTrackList(state),
  selectedCog: getBrowserSelectedCog(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserCogList);
