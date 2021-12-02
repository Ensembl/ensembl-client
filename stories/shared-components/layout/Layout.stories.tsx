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

import React, { useState, ReactNode } from 'react';

import { BreakpointWidth } from 'src/global/globalConfig';

import { StandardAppLayout } from 'src/shared/components/layout';
import { SecondaryButton } from 'src/shared/components/button/Button';

import styles from './Layout.stories.scss';

const TopbarContent = () => (
  <div className={styles.topbarContent}>This is top bar content</div>
);

const MainContent = () => (
  <div className={styles.mainContent}>
    <img src="https://user-images.githubusercontent.com/6834224/70806519-6fc8bf00-1db3-11ea-8ecd-238b410230af.png" />
  </div>
);

const SidebarContentSimple = () => (
  <div className={styles.sidebarContent}>This is sidebar content</div>
);

const SidebarContentWithDrawerOpener = (props: {
  isDrawerOpen: boolean;
  openDrawer: () => void;
}) => {
  return (
    <div className={styles.sidebarContent}>
      This is sidebar with drawer opener
      <div>
        {props.isDrawerOpen ? (
          'You have opened the drawer'
        ) : (
          <SecondaryButton onClick={props.openDrawer}>
            Open drawer
          </SecondaryButton>
        )}
      </div>
    </div>
  );
};

const SidebarToolstripContent = () => (
  <div className={styles.sidebarToolstripContent}>Here be icons</div>
);

const SidebarNavigation = () => {
  const [activeLinkIndex, setActiveLinkIndex] = useState(0);

  return (
    <div className={styles.sidebarNavigation}>
      {['Link 1', 'Link 2'].map((linkStr, index) => (
        <span
          key={linkStr}
          className={activeLinkIndex === index ? styles.activeLink : ''}
          onClick={() => setActiveLinkIndex(index)}
        >
          {linkStr}
        </span>
      ))}
    </div>
  );
};

const DrawerContent = () => (
  <div className={styles.drawerContent}>This is drawer content</div>
);

const Wrapper = (props: {
  isSidebarOpen: boolean;
  sidebarContent: ReactNode;
  mainContent?: ReactNode;
  isDrawerOpen?: boolean;
  drawerContent?: ReactNode;
  onSidebarToggle: () => void;
  onDrawerClose?: () => void;
}) => {
  return (
    <div className={styles.wrapper}>
      <StandardAppLayout
        mainContent={props.mainContent || <MainContent />}
        topbarContent={<TopbarContent />}
        sidebarNavigation={<SidebarNavigation />}
        sidebarToolstripContent={<SidebarToolstripContent />}
        viewportWidth={BreakpointWidth.BIG_DESKTOP}
        {...props}
      />
    </div>
  );
};

export const WithoutDrawerStory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Wrapper
      isSidebarOpen={isSidebarOpen}
      sidebarContent={<SidebarContentSimple />}
      onSidebarToggle={toggleSidebar}
    />
  );
};

WithoutDrawerStory.storyName = 'without drawer';

export const WithDrawerStory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleSidebar = () => {
    isDrawerOpen ? setIsDrawerOpen(false) : setIsSidebarOpen(!isSidebarOpen);
  };
  const openDrawer = () => {
    setIsDrawerOpen(true);
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Wrapper
      isSidebarOpen={isSidebarOpen}
      sidebarContent={
        <SidebarContentWithDrawerOpener
          isDrawerOpen={isDrawerOpen}
          openDrawer={openDrawer}
        />
      }
      onSidebarToggle={toggleSidebar}
      isDrawerOpen={isDrawerOpen}
      drawerContent={<DrawerContent />}
      onDrawerClose={closeDrawer}
    />
  );
};

WithDrawerStory.storyName = 'with drawer';

export const OverflowingContentStory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const mainContent = (
    <div className={styles.overflowingContentWrapper}>
      <div className={styles.overflowingContentLabel}>
        Both my width and height are 3000px;
      </div>

      <div className={styles.overflowingContentPlaceholder} />
    </div>
  );

  return (
    <Wrapper
      mainContent={mainContent}
      isSidebarOpen={isSidebarOpen}
      sidebarContent={<SidebarContentSimple />}
      onSidebarToggle={toggleSidebar}
    />
  );
};

OverflowingContentStory.storyName = 'with overflowing content';

export default {
  title: 'Components/Shared Components/Layout/StandardAppLayout'
};
