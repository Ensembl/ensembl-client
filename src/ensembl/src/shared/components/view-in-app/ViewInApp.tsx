import React from 'react';
import { Link } from 'react-router-dom';

import { ImageButton } from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as BrowserIcon } from 'static/img/launchbar/browser.svg';
import { ReactComponent as EntityViewerIcon } from 'static/img/launchbar/entity-viewer.svg';

import { Status } from 'src/shared/types/status';

import styles from './ViewInApp.scss';

export const Apps = {
  gb: {
    tooltip: 'Genome Browser',
    icon: BrowserIcon
  },
  ev: {
    tooltip: 'Entity Viewer',
    icon: EntityViewerIcon
  }
};

export type urlObj = {
  gb: string;
  ev: string;
};

export type ViewInAppProps = {
  links: Partial<urlObj>;
};

const ViewInApp = (props: ViewInAppProps) => {
  return (
    <div className={styles.entityViewerAppLinkButtons}>
      <span className={styles.viewIn}>View in</span>
      {Object.keys(props.links).map((appId) => {
        const id = appId as keyof urlObj;
        return (
          <AppButton
            key={'AppButton_' + appId}
            appId={appId}
            url={props.links[id] as string}
          />
        );
      })}
    </div>
  );
};

type AppButtonProps = {
  appId: string;
  url: string;
};

const AppButton = (props: AppButtonProps) => {
  return (
    <Link className={styles.entityViewerAppLink} to={props.url}>
      <ImageButton
        status={Status.DEFAULT}
        description={Apps[props.appId as keyof urlObj].tooltip}
        image={Apps[props.appId as keyof urlObj].icon}
      />
    </Link>
  );
};

export default ViewInApp;
