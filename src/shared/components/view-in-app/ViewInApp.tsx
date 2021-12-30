/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

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

export type AppName = keyof typeof Apps;

export type LinkObj = { url: string; replaceState?: boolean };

export type UrlObj = Partial<Record<AppName, LinkObj>>;

type AppClickHandlers = Partial<Record<AppName, () => void>>;

export type ViewInAppProps = {
  links: UrlObj;
  onAppClick?: AppClickHandlers;
  onAnyAppClick?: (appName?: AppName) => void;
  classNames?: {
    label?: string;
  };
};

export const ViewInApp = (props: ViewInAppProps) => {
  if (Object.keys(props.links).length === 0) {
    return null;
  }

  const labelClass = classNames(styles.label, props.classNames?.label);

  return (
    <div className={styles.viewInAppLinkButtons}>
      <span className={labelClass}>View in</span>

      {(Object.keys(props.links) as AppName[]).map((appId) => {
        const currentLinkObj = props.links[appId] as LinkObj;

        return (
          <AppButton
            key={appId}
            appId={appId}
            url={currentLinkObj.url}
            replaceState={currentLinkObj.replaceState}
            onClick={createClickHandler({ ...props, appName: appId })}
          />
        );
      })}
    </div>
  );
};

const createClickHandler = (params: ViewInAppProps & { appName: AppName }) => {
  const { onAppClick, onAnyAppClick: onAnyAppClickFn, appName } = params;
  const onAppClickFn = onAppClick?.[appName];
  const clickHandlers: Array<(appName?: AppName) => void> = [];

  if (onAnyAppClickFn) {
    clickHandlers.push(() => onAnyAppClickFn(params.appName));
  }

  if (onAppClickFn) {
    clickHandlers.push(() => onAppClickFn());
  }

  return clickHandlers.length
    ? () => clickHandlers.forEach((fn) => fn())
    : undefined;
};

type AppButtonProps = {
  appId: AppName;
  url: string;
  replaceState?: boolean;
  onClick?: () => void;
};

export const AppButton = (props: AppButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (props.replaceState) {
      navigate(props.url, { replace: true });
    } else {
      navigate(props.url);
    }
    props.onClick?.();
  };

  return (
    <div className={styles.viewInAppLink} data-test-id={props.appId}>
      <ImageButton
        status={Status.DEFAULT}
        description={Apps[props.appId].tooltip}
        image={Apps[props.appId].icon}
        onClick={handleClick}
      />
    </div>
  );
};

export default ViewInApp;
