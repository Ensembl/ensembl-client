import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import browserMessagingService from 'src/content/app/browser/browser-messaging-service';
import BrowserCog from './BrowserCog';
import {
  updateCogList,
  updateCogTrackList,
  updateSelectedCog
} from './browserActions';
import { RootState } from 'src/store';
import { CogList } from './browserState';
import {
  getBrowserActivated,
  getBrowserCogList,
  getBrowserCogTrackList,
  getTrackConfigNames,
  getTrackConfigLabel,
  getBrowserSelectedCog
} from './browserSelectors';

import styles from './BrowserCogList.scss';

type BrowserCogListProps = {
  browserActivated: boolean;
  browserCogList: number;
  browserCogTrackList: CogList;
  trackConfigNames: { [key: string]: boolean };
  trackConfigLabel: { [key: string]: boolean };
  selectedCog: any;
  updateCogList: (cogList: number) => void;
  updateCogTrackList: (track_y: CogList) => void;
  updateSelectedCog: (index: string | null) => void;
};

type BpaneScrollPayload = {
  delta_y?: number;
  track_y?: CogList;
};

const BrowserCogList = (props: BrowserCogListProps) => {
  const { browserCogTrackList } = props;
  const listenBpaneScroll = (payload: BpaneScrollPayload) => {
    const { delta_y, track_y } = payload;
    if (delta_y !== undefined) {
      props.updateCogList(delta_y);
    }
    if (track_y) {
      props.updateCogTrackList(track_y);
    }
  };

  useEffect(() => {
    const subscription = browserMessagingService.subscribe(
      'bpane-scroll',
      listenBpaneScroll
    );

    return () => subscription.unsubscribe();
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

  const cogs = Object.entries(browserCogTrackList).map(([name, pos]) => {
    const posStyle = { top: pos + 'px' };

    return (
      <div key={name} className={styles.browserCogOuter} style={posStyle}>
        <BrowserCog
          cogActivated={props.selectedCog === name}
          index={name}
          updateSelectedCog={props.updateSelectedCog}
        />
      </div>
    );
  });

  const transformStyle = {
    transform: 'translate(0,' + props.browserCogList + 'px)'
  };

  return props.browserActivated ? (
    <div className={styles.browserTrackConfigOuter}>
      <div className={styles.browserCogListOuter}>
        <div className={styles.browserCogListInner} style={transformStyle}>
          {cogs}
        </div>
      </div>
    </div>
  ) : null;
};

const mapStateToProps = (state: RootState) => ({
  browserActivated: getBrowserActivated(state),
  browserCogList: getBrowserCogList(state),
  browserCogTrackList: getBrowserCogTrackList(state),
  trackConfigLabel: getTrackConfigLabel(state),
  trackConfigNames: getTrackConfigNames(state),
  selectedCog: getBrowserSelectedCog(state)
});

const mapDispatchToProps = {
  updateCogList,
  updateCogTrackList,
  updateSelectedCog
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrowserCogList);
