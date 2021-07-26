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

import React, { ReactNode, useEffect } from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';

import { BreakpointWidth } from 'src/global/globalConfig';
import usePrevious from 'src/shared/hooks/usePrevious';

import CloseButton from 'src/shared/components/close-button/CloseButton';
import Chevron from 'src/shared/components/chevron/Chevron';

import styles from './StandardAppLayout.scss';

enum SidebarModeToggleAction {
  OPEN = 'open',
  CLOSE = 'close'
}

type SidebarModeToggleProps = {
  onClick: () => void;
  showAction: SidebarModeToggleAction;
};

type StandardAppLayoutProps = {
  mainContent: ReactNode;
  sidebarContent: ReactNode;
  sidebarToolstripContent?: ReactNode;
  sidebarNavigation: ReactNode;
  topbarContent: ReactNode;
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  isDrawerOpen: boolean;
  drawerContent?: ReactNode;
  onDrawerClose: () => void;
  viewportWidth: BreakpointWidth;
};

const StandardAppLayout = (props: StandardAppLayoutProps) => {
  // TODO: is there any way to run this smarter?
  // Ideally, it should run only once per app life cycle to check whether user is on small screen and close the sidebar if they are
  useEffect(() => {
    if (props.viewportWidth < BreakpointWidth.DESKTOP && props.isSidebarOpen) {
      props.onSidebarToggle();
    }
  }, []);

  const mainClassNames = classNames(
    styles.main,
    props.isSidebarOpen ? styles.mainDefault : styles.mainFullWidth
  );

  const shouldShowSidebarNavigation =
    props.viewportWidth > BreakpointWidth.LAPTOP || props.isSidebarOpen;

  const topbarClassnames = classNames(
    styles.topbar,
    { [styles.topbar_withSidebarNavigation]: shouldShowSidebarNavigation },
    { [styles.topbar_withoutSidebarNavigation]: !shouldShowSidebarNavigation }
  );

  const sidebarWrapperClassnames = useSidebarWrapperClassNames(props);

  return (
    <div className={styles.standardAppLayout}>
      <div className={topbarClassnames}>
        {props.topbarContent}
        {shouldShowSidebarNavigation && props.sidebarNavigation}
      </div>
      <div className={styles.mainWrapper}>
        <div className={mainClassNames}>{props.mainContent}</div>
        <div className={sidebarWrapperClassnames}>
          {props.isDrawerOpen && <DrawerWindow onClick={props.onDrawerClose} />}
          <div className={styles.sidebarToolstrip}>
            <SidebarModeToggle
              onClick={
                props.isDrawerOpen
                  ? () => props.onDrawerClose()
                  : () => props.onSidebarToggle()
              }
              showAction={
                props.isSidebarOpen
                  ? SidebarModeToggleAction.CLOSE
                  : SidebarModeToggleAction.OPEN
              }
            />
            <div className={styles.sidebarToolstripContent}>
              {props.sidebarToolstripContent}
            </div>
          </div>
          <div className={styles.sidebar}>{props.sidebarContent}</div>
          <div className={styles.drawer}>
            <CloseButton
              className={styles.drawerClose}
              onClick={props.onDrawerClose}
            />
            {props.drawerContent || null}
          </div>
        </div>
      </div>
    </div>
  );
};

StandardAppLayout.defaultProps = {
  isDrawerOpen: false,
  onDrawerClose: noop
};

const SidebarModeToggle = (props: SidebarModeToggleProps) => {
  return (
    <div className={styles.sidebarModeToggle}>
      <Chevron
        direction={
          props.showAction === SidebarModeToggleAction.OPEN ? 'left' : 'right'
        }
        classNames={{ svg: styles.sidebarModeToggleChevron }}
        onClick={props.onClick}
      />
    </div>
  );
};

// left-most transparent part of the drawer allowing the user to see what element is behind the drawer;
// when clicked, will close the drawer
const DrawerWindow = (props: { onClick: () => void }) => {
  return <div className={styles.drawerWindow} onClick={props.onClick} />;
};

const useSidebarWrapperClassNames = (props: StandardAppLayoutProps) => {
  const previousSidebarOpen = usePrevious(props.isSidebarOpen);
  // do not use transition for opening and closing of the sidebar
  const isInstantaneous =
    !props.isSidebarOpen || // <-- sidebar about to close
    (props.isSidebarOpen && !previousSidebarOpen); // <-- sidebar about to open

  return classNames(
    styles.sidebarWrapper,
    { [styles.sidebarWrapperOpen]: props.isSidebarOpen },
    { [styles.sidebarWrapperClosed]: !props.isSidebarOpen },
    {
      [styles.sidebarWrapperDrawerOpen]: props.isDrawerOpen ?? false
    },
    { [styles.instantaneous]: isInstantaneous }
  );
};

export default StandardAppLayout;
