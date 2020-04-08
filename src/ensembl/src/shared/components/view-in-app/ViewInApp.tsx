import React from 'react';
import { Link } from 'react-router-dom';

import { ImageButton } from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as BrowserIcon } from 'static/img/launchbar/browser.svg';
import { ReactComponent as EntityViewerIcon } from 'static/img/launchbar/entity-viewer.svg';

import { Status } from 'src/shared/types/status';

import styles from './ViewInApp.scss';

export const Apps = {
  genomeBrowser: {
    tooltip: 'Genome Browser',
    icon: BrowserIcon
  },
  entityViewer: {
    tooltip: 'Entity Viewer',
    icon: EntityViewerIcon
  }
};

type AppName = keyof typeof Apps;

export type urlObj = Record<AppName, string>;

export type ViewInAppProps = {
  links: Partial<urlObj>;
};

const ViewInApp = (props: ViewInAppProps) => {
  return Object.keys(props.links) ? (
    <div className={styles.viewInAppLinkButtons}>
      <span className={styles.viewInLabel}>View in</span>
      {(Object.keys(props.links) as AppName[]).map((appId) => {
        return (
          <AppButton
            key={appId}
            appId={appId}
            url={props.links[appId] as string}
          />
        );
      })}
    </div>
  ) : null;
};

type AppButtonProps = {
  appId: AppName;
  url: string;
};

const AppButton = (props: AppButtonProps) => {
  return (
    <Link className={styles.viewInAppLink} to={props.url}>
      <ImageButton
        status={Status.DEFAULT}
        description={Apps[props.appId].tooltip}
        image={Apps[props.appId].icon}
      />
    </Link>
  );
};

export default ViewInApp;
