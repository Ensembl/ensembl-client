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

import styles from './ViewInApp.module.css';

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

export type LinkObject = { url: string; replaceState?: boolean };

export type LinkFunction = () => void;

export type LinksConfig = Partial<Record<AppName, LinkObject | LinkFunction>>;

type AppClickHandlers = Partial<Record<AppName, () => void>>;

/**
 * The fields of ViewInAppProps have the following semantics:
 * - the buttons rendered by the ViewInApp component,
 *   as well as the default behaviour upon a click on a given button
 *   are determined by the keys of the `links` object passed as a mandatory property
 * - the optional `onAppClick` property describes additional behaviour
 *   upon a click on a given button
 * - the optional `onAnyAppClick` property describes additional behaviour
 *   upon a click on any button.
 *
 * QUESTION: why not make the `links` property only ever contain url strings,
 * and pass functions describing more complex on-click behaviour
 * via the `onAppClick` property?
 *
 * ANSWER: because the `links` property is mandatory. Consider an edge case
 * in which the on-click behaviour on any button has to be described in a function.
 * That would require the consumer of the component to pass an empty `links` object
 * into the component, which makes for an awkward api.
 */

type Theme = 'light' | 'dark';

export type ViewInAppProps = {
  links: LinksConfig;
  onAppClick?: AppClickHandlers;
  onAnyAppClick?: (appName?: AppName) => void;
  theme?: Theme;
  className?: string;
};

export const ViewInApp = (props: ViewInAppProps) => {
  const theme = props.theme ?? 'light';

  const navigate = useNavigate();
  if (Object.keys(props.links).length === 0) {
    return null;
  }

  const handleClick = (app: AppName) => {
    const linkConfig = props.links[app];
    if (!linkConfig) {
      return; // shouldn't happen; but keeps the types sound
    }

    props.onAnyAppClick?.(app);
    props.onAppClick?.[app]?.();

    if (typeof linkConfig === 'function') {
      // the parent knows better how to handle a click on a link; delegate decision to the parent
      const linkClickHandler = linkConfig; // creating a new variable because writing `linkConfig()` looks awkward
      linkClickHandler();
    } else {
      navigate(linkConfig.url, {
        replace: linkConfig.replaceState
      });
    }
  };

  const componentClasses = classNames(styles.viewInApp, props.className, {
    [styles.viewInAppLight]: theme === 'light',
    [styles.viewInAppDark]: theme === 'dark'
  });

  const enabledApps = Object.keys({
    ...props.links
  }) as AppName[];

  return (
    <div className={componentClasses}>
      <span className={styles.label}>View in</span>

      {enabledApps.map((appName, index) => {
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
              onClick={() => handleClick(appName)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ViewInApp;
