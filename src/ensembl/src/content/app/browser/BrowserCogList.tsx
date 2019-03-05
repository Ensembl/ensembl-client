import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useCallback
} from 'react';
import { connect } from 'react-redux';

import { getBrowserCogList, getBrowserSelectedCog } from './browserSelectors';
import BrowserCog from './BrowserCog';

import { updateCogList } from './browserActions';

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
  selectedCog: number | null;
  updateCogList: (val: number) => void;
};

type BpaneScrollEvent = Event & {
  detail: {
    delta_y: number;
  };
};

const BrowserCogList: FunctionComponent<BrowserCogListProps> = (
  props: BrowserCogListProps
) => {
  const listenBpaneScroll = useCallback((event: Event) => {
    const bpaneScrollEvent = event as BpaneScrollEvent;
    props.updateCogList(bpaneScrollEvent.detail.delta_y);
  }, []);

  useEffect(() => {
    const currentEl: HTMLDivElement = props.browserRef
      .current as HTMLDivElement;
    currentEl.addEventListener('bpane-scroll', listenBpaneScroll);
  }, [props.cogListRef]);

  let inline = { transform: 'translate(0,' + props.browserCogList + 'px)' };
  let xs = [...Array(10)].map((_, index) => (
    <div key={index}>
      <BrowserCog cogActivated={props.selectedCog == index} index={index} />
    </div>
  ));

  return props.browserActivated ? (
    <div className={styles.browserCogListOuter}>
      <div
        className={styles.browserCogListInner}
        style={inline}
        ref={props.cogListRef}
      >
        {xs}
      </div>
    </div>
  ) : null;
};

const mapDispatchToProps: DispatchProps = {
  updateCogList
};

const mapStateToProps = (state: RootState): StateProps => ({
  browserActivated: getBrowserActivated(state),
  browserCogList: getBrowserCogList(state),
  selectedCog: getBrowserSelectedCog(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserCogList);
