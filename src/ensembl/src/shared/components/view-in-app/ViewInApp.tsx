import React from 'react';
import { connect } from 'react-redux';
import { push, Push } from 'connected-react-router';

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
  push: Push;
};

export const ViewInApp = (props: ViewInAppProps) => {
  return Object.keys(props.links) ? (
    <div className={styles.viewInAppLinkButtons}>
      <span className={styles.viewInLabel}>View in</span>
      {(Object.keys(props.links) as AppName[]).map((appId) => {
        return (
          <AppButton
            key={appId}
            appId={appId}
            url={props.links[appId] as string}
            push={props.push}
          />
        );
      })}
    </div>
  ) : null;
};

type AppButtonProps = {
  appId: AppName;
  url: string;
  push: Push;
};

export const AppButton = (props: AppButtonProps) => {
  const handleClick = () => {
    props.push(props.url);
  };

  return (
    <div className={styles.viewInAppLink}>
      <ImageButton
        status={Status.DEFAULT}
        description={Apps[props.appId].tooltip}
        image={Apps[props.appId].icon}
        onClick={handleClick}
      />
    </div>
  );
};

const mapDispatchToProps = {
  push
};

export default connect(null, mapDispatchToProps)(ViewInApp);
