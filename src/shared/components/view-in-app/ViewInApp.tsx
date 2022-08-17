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

import {
  GenomeBrowserIcon,
  EntityViewerIcon
} from 'src/shared/components/app-icon';

import { Status } from 'src/shared/types/status';

import styles from './ViewInApp.scss';

export const Apps = {
  genomeBrowser: {
    tooltip: 'Genome Browser',
    icon: GenomeBrowserIcon
  },
  entityViewer: {
    tooltip: 'Entity Viewer',
    icon: EntityViewerIcon
  }
};

export type AppName = keyof typeof Apps;

export type LinkObj = { url: string; replaceState?: boolean };

export type UrlObj = Partial<Record<AppName, LinkObj>>;

type AppClickHandlers = Partial<
  Record<AppName, (event?: React.MouseEvent<HTMLDivElement>) => void>
>;

export type ViewInAppProps = {
  links: UrlObj;
  onAppClick?: AppClickHandlers;
  onAnyAppClick?: (appName?: AppName) => void;
  classNames?: {
    label?: string;
  };
};

export const ViewInApp = (props: ViewInAppProps) => {
  const { onAppClick, onAnyAppClick: onAnyAppClickFn } = props;

  const labelClass = classNames(styles.label, props.classNames?.label);

  const navigate = useNavigate();
  if (Object.keys(props.links).length === 0) {
    return null;
  }

  const enabledApps = Object.keys({
    ...(props.onAppClick || {}),
    ...props.links
  }) as AppName[];

  return (
    <div className={styles.viewInAppLinkButtons}>
      <span className={labelClass}>View in</span>

      {enabledApps.map((appName, index) => {
        const currentLinkObj = props.links[appName] as LinkObj;

        const handleClick = (event?: React.MouseEvent<HTMLDivElement>) => {
          const onAppClickFn = onAppClick?.[appName];

          if (onAnyAppClickFn) {
            onAnyAppClickFn(appName);
          }

          if (onAppClickFn) {
            onAppClickFn(event);
          }
          if (currentLinkObj) {
            navigate(currentLinkObj.url, {
              replace: currentLinkObj.replaceState
            });
          }
        };

        return (
          <div
            className={styles.viewInAppLink}
            data-test-id={appName}
            key={index}
          >
            <ImageButton
              status={Status.DEFAULT}
              description={Apps[appName].tooltip}
              image={Apps[appName].icon}
              onClick={(event?: React.MouseEvent<HTMLDivElement>) =>
                handleClick(event)
              }
            />
          </div>
        );
      })}
    </div>
  );
};

// const createClickHandler = (params: ViewInAppProps & { appName: AppName }) => {
//   const { onAppClick, onAnyAppClick: onAnyAppClickFn, appName } = params;
//   const onAppClickFn = onAppClick?.[appName];
//   const clickHandlers: Array<(params: { appName: AppName, event: React.MouseEvent<HTMLDivElement> }) => void> = [];

//   if (onAnyAppClickFn) {
//     clickHandlers.push(() => onAnyAppClickFn({ appName }));
//   }

//   if (onAppClickFn) {
//     clickHandlers.push(() => onAppClickFn({ event }));
//   }

//   return clickHandlers.length
//     ? (event?: React.MouseEvent<HTMLDivElement>) => clickHandlers.forEach((fn) => fn(event))
//     : undefined;
// };

// type AppButtonProps = {
//   appId: AppName;
//   url: string;
//   replaceState?: boolean;
//   onClick?: (event?: React.MouseEvent<HTMLDivElement>) => void;
// };

// export const AppButton = (props: ViewInAppProps & { appName: AppName }) => {

// };

export default ViewInApp;
