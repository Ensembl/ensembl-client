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
import { useDispatch } from 'react-redux';
import { push, replace } from 'connected-react-router';
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

export type urlObj = Record<AppName, string>;

export type ViewInAppProps = {
  links: Partial<urlObj>;
  shouldReplaceState?: boolean;
  classNames?: {
    label?: string;
  };
};

export const ViewInApp = (props: ViewInAppProps) => {
  if (Object.keys(props.links).length === 0) {
    return null;
  }

  const labelClass = classNames(styles.label, props.classNames?.label);

  return Object.keys(props.links) ? (
    <div className={styles.viewInAppLinkButtons}>
      <span className={labelClass}>View in</span>
      {(Object.keys(props.links) as AppName[]).map((appId) => {
        return (
          <AppButton
            key={appId}
            appId={appId}
            url={props.links[appId] as string}
            shouldReplaceState={props.shouldReplaceState}
          />
        );
      })}
    </div>
  ) : null;
};

type AppButtonProps = {
  appId: AppName;
  url: string;
  shouldReplaceState?: boolean;
};

export const AppButton = (props: AppButtonProps) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    if (props.shouldReplaceState) {
      dispatch(replace(props.url));
    } else {
      dispatch(push(props.url));
    }
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
