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

import { ReactNode, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';

import usePrevious from 'src/shared/hooks/usePrevious';

import CloseButton from 'src/shared/components/close-button/CloseButton';
import ChevronButton from 'src/shared/components/chevron-button/ChevronButton';

import { BreakpointWidth } from 'src/global/globalConfig';

import styles from './StandardAppLayout.module.css';

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
  isDrawerOpen?: boolean;
  drawerContent?: ReactNode;
  onDrawerClose?: () => void;
  viewportWidth: BreakpointWidth;
};

const StandardAppLayout = (props: StandardAppLayoutProps) => {
  const { isDrawerOpen = false } = props;
  const elementRef = useRef<HTMLDivElement | null>(null);

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

  const handleClick = () => {
    if (isDrawerOpen) {
      props?.onDrawerClose?.();
      return;
    }

    trackSidebarToggle();
    props.onSidebarToggle();
  };

  const handleDrawerClose = useCallback(() => {
    props?.onDrawerClose?.();
  }, [props.onDrawerClose]);

  // dispatches an event that the sidebar has been opened or closed; used for analytics purposes
  const trackSidebarToggle = () => {
    const event = new CustomEvent('analytics', {
      detail: {
        category: 'sidebar',
        action: props.isSidebarOpen ? 'closed' : 'opened'
      },
      bubbles: true
    });

    elementRef.current?.dispatchEvent(event);
  };

  return (
    <div className={styles.standardAppLayout} ref={elementRef}>
      <div className={topbarClassnames}>
        {props.topbarContent}
        {shouldShowSidebarNavigation && props.sidebarNavigation}
      </div>
      <div className={styles.mainWrapper}>
        <div className={mainClassNames} inert={isDrawerOpen || undefined}>
          {props.mainContent}
        </div>
        <div className={sidebarWrapperClassnames}>
          {isDrawerOpen && <DrawerWindow onClick={handleDrawerClose} />}
          <div className={styles.sidebarToolstrip}>
            <SidebarModeToggle
              onClick={handleClick}
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
          <div className={styles.drawer} inert={!isDrawerOpen || undefined}>
            <CloseButton
              className={styles.drawerClose}
              onClick={handleDrawerClose}
            />
            {props.drawerContent || null}
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarModeToggle = (props: SidebarModeToggleProps) => {
  return (
    <div className={styles.sidebarModeToggle}>
      <ChevronButton
        direction={
          props.showAction === SidebarModeToggleAction.OPEN ? 'left' : 'right'
        }
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
      [styles.sidebarWrapperDrawerOpen]: props.isDrawerOpen
    },
    { [styles.instantaneous]: isInstantaneous }
  );
};

export default StandardAppLayout;
