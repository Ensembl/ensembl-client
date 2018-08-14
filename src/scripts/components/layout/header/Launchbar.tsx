import React, { Component, SFC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SlideDown } from 'react-slidedown';

import { LaunchbarApp, LaunchbarCategory, launchbarConfig } from '../../../configs/launchbarConfig';

type LaunchbarIconProps = {
  app: LaunchbarApp
};

const LaunchbarIcon: SFC<LaunchbarIconProps> = (props: LaunchbarIconProps) => (
  <dt>
    <Link to={`/app/${props.app.name.toLowerCase()}`}>
      <img src={props.app.icon} alt={props.app.description} title={props.app.description} />
    </Link>
  </dt>
);

type LaunchbarSectionProps = {
  category: LaunchbarCategory
};

const LaunchbarSection: SFC<LaunchbarSectionProps> = (props: LaunchbarSectionProps) => {
  const separatorClass: string = props.category.separator ? 'border' : '';

  return (
    <dl className={`${separatorClass}`}>
      {props.category.apps.map((app: LaunchbarApp, index: number) => (
        <LaunchbarIcon app={app} key={`${app.name}-${index}`} />
      ))}
    </dl>
  );
};

type LaunchbarProps = {
  expanded: boolean
};

class Launchbar extends Component<LaunchbarProps> {
  render() {
    const LaunchbarChildren: ReactNode = (
      <div className="launchbar">
        <div className="categories-wrapper">
          <div className="categories">
          {launchbarConfig.categories.map((category: LaunchbarCategory, index: number) =>
            <LaunchbarSection key={`${category.name}-${index}`} category={category} />)}
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
      <SlideDown>
        {this.props.expanded ? LaunchbarChildren : null}
      </SlideDown>
    );
  }
}

export default Launchbar;
