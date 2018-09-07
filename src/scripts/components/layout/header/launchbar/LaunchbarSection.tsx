import React, { SFC } from 'react';
import {
  LaunchbarCategory,
  LaunchbarApp
} from '../../../../configs/launchbarConfig';
import LaunchbarIcon from './LaunchbarIcon';

type LaunchbarSectionProps = {
  category: LaunchbarCategory;
};

const LaunchbarSection: SFC<LaunchbarSectionProps> = (
  props: LaunchbarSectionProps
) => {
  const { separator, apps } = props.category;
  const separatorClass: string = separator ? 'border' : '';

  return (
    <dl className={`${separatorClass}`}>
      {apps.map((app: LaunchbarApp) => (
        <LaunchbarIcon app={app} key={app.name} />
      ))}
    </dl>
  );
};

export default LaunchbarSection;
