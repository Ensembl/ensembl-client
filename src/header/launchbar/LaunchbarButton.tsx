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

import type { FunctionComponent } from 'react';

import { memo } from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import classNames from 'classnames';

import useHover from 'src/shared/hooks/useHover';
import useHeaderAnalytics from '../hooks/useHeaderAnalytics';

import Tooltip from 'src/shared/components/tooltip/Tooltip';

import styles from './Launchbar.module.css';

export type LaunchbarButtonProps = {
  path: string;
  description: string;
  icon: FunctionComponent<unknown>;
  enabled?: boolean;
  isActive?: boolean;
  isClickableWhenActive?: boolean;
};

const LaunchbarButton: FunctionComponent<LaunchbarButtonProps> = (
  props: LaunchbarButtonProps
) => {
  const routeMatch = useMatch({ path: props.path, end: false });
  const isRouteMatched = Boolean(routeMatch);
  const isButtonEnabled = props.enabled ?? true;

  const { trackLaunchbarAppChange } = useHeaderAnalytics();
  const isActive =
    'isActive' in props ? (props.isActive as boolean) : isRouteMatched;

  const launchbarButtonContent = (
    <LaunchbarButtonContent
      {...props}
      enabled={isButtonEnabled}
      isActive={isActive}
    />
  );

  return (isButtonEnabled && !isActive) || props.isClickableWhenActive ? (
    <NavLink
      className={styles.launchbarButtonWrapperLink}
      to={props.path}
      onClick={() => trackLaunchbarAppChange(props.description)}
      aria-label={props.description}
    >
      {launchbarButtonContent}
    </NavLink>
  ) : (
    launchbarButtonContent
  );
};

const LaunchbarButtonContent = memo(
  (
    props: Required<
      Omit<LaunchbarButtonProps, 'path' | 'isClickableWhenActive'>
    >
  ) => {
    const [hoverRef, isHovered] = useHover<HTMLDivElement>();
    const elementClasses = classNames(styles.launchbarButton, {
      [styles.launchbarButtonSelected]: props.isActive,
      [styles.launchbarButtonDisabled]: !props.enabled
    });

    const Icon = props.icon;

    return (
      <>
        <div ref={hoverRef} className={elementClasses}>
          <Icon />
        </div>
        {props.description && isHovered && (
          <Tooltip anchor={hoverRef.current} autoAdjust={true}>
            {props.description}
          </Tooltip>
        )}
      </>
    );
  }
);

export default LaunchbarButton;
