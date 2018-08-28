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
  const { separator, apps } = props.category;
  const separatorClass: string = separator ? 'border' : '';

  return (
    <dl className={`${separatorClass}`}>
      {apps.map((app: LaunchbarApp) => <LaunchbarIcon app={app} key={app.id} />)}
    </dl>
  );
};

type LaunchbarProps = {
  expanded: boolean
};

class Launchbar extends Component<LaunchbarProps> {
  public render() {
    const { categories, about } = launchbarConfig;

    const LaunchbarChildren: ReactNode = (
      <div className="launchbar">
        <div className="categories-wrapper">
          <div className="categories">
          {categories.map((category: LaunchbarCategory) => <LaunchbarSection key={category.id} category={category} />)}
          </div>
        </div>
        <div className="about">
            <dl>
              <LaunchbarIcon app={about} />
            </dl>
        </div>
      </div>
    );

    return (
      <SlideDown transitionOnAppear={false}>
        {this.props.expanded ? LaunchbarChildren : null}
      </SlideDown>
    );
  }
}

export default Launchbar;
