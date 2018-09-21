import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

import { DrawerSection } from '../../../configs/drawerSectionConfig';
import { ReactRefs } from '../../../types/objects';

type TrackTwoProps = {
  currentDrawerSection: string;
  drawerSections: DrawerSection[];
};

class TrackTwo extends Component<TrackTwoProps> {
  public idRefs: ReactRefs = {
    main: React.createRef()
  };

  public render() {
    return (
      <div className="track-section-wrapper track-two">
        <section ref={this.idRefs.main}>
          <h3>Main</h3>
          <h2>Content for Track 2</h2>
        </section>
      </div>
    );
  }
}

export default hot(module)(TrackTwo);
