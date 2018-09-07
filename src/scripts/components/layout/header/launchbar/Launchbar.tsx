import React, { Component, ReactNode } from 'react';
import SlideDown from 'react-slidedown';

import {
  LaunchbarCategory,
  launchbarConfig
} from '../../../../configs/launchbarConfig';

import LaunchbarIcon from './LaunchbarIcon';
import LaunchbarSection from './LaunchbarSection';

type LaunchbarProps = {
  launchbarExpanded: boolean;
};

class Launchbar extends Component<LaunchbarProps> {
  public render() {
    const LaunchbarChildren: ReactNode = (
      <div className="launchbar">
        <div className="categories-wrapper">
          <div className="categories">
            {launchbarConfig.categories.map((category: LaunchbarCategory) => (
              <LaunchbarSection key={category.name} category={category} />
            ))}
          </div>
        </div>
        <div className="about">
          <dl>
            <LaunchbarIcon app={launchbarConfig.about} />
          </dl>
        </div>
      </div>
    );

    return (
      <SlideDown transitionOnAppear={false}>
        {this.props.launchbarExpanded ? LaunchbarChildren : null}
      </SlideDown>
    );
  }
}

export default Launchbar;
