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
import { connect } from 'react-redux';
import noop from 'lodash/noop';

import {
  isEntityViewerSidebarModalOpen,
  isEntityViewerSidebarOpen,
  getEntityViewerSidebarModalView
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';
import {
  toggleSidebar,
  closeSidebarModal,
  openSidebarModal
} from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarActions';

import ImageButton from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as searchIcon } from 'static/img/sidebar/search.svg';
import { ReactComponent as bookmarkIcon } from 'static/img/sidebar/bookmark.svg';
import { ReactComponent as shareIcon } from 'static/img/sidebar/share.svg';
import { ReactComponent as downloadIcon } from 'static/img/sidebar/download.svg';

import { RootState } from 'src/store';
import { Status } from 'src/shared/types/status';
import { SidebarToolstripCollection } from 'src/shared/types/sidebar-toolstrip-collection';
import styles from 'src/shared/components/layout/StandardAppLayout.scss';

export type entityViewerSidebarBarProps = {
  isEntityViewerSidebarModalOpen: boolean;
  isEntityViewerSidebarOpen: boolean;
  sidebarModalView: string;
  closeSidebarModal: () => void;
  openSidebarModal: (sidebarModalView: string) => void;
  toggleSidebar: (isEntityViewerSidebarOpen?: boolean) => void;
};

export const EntityViewerSidebarToolstrip = (props: entityViewerSidebarBarProps) => {
  const toggleModalView = (selectedItem: string) => {
    if (!props.isEntityViewerSidebarOpen) {
      props.toggleSidebar();
    }

    if (selectedItem === props.sidebarModalView) {
      props.closeSidebarModal();
    } else {
      props.openSidebarModal(selectedItem);
    }
  };

  const getViewIconStatus = (selectedItem: string) => {
    return selectedItem === props.sidebarModalView &&
      props.isEntityViewerSidebarOpen
      ? Status.SELECTED
      : Status.UNSELECTED;
  };

  return (
    <>
      <ImageButton
        status={Status.DISABLED}
        description="Search"
        className={styles.sidebarIcon}
        key="search"
        onClick={noop}
        image={searchIcon}
      />
      <ImageButton
        status={getViewIconStatus(SidebarToolstripCollection.BOOKMARKS)}
        description="Bookmarks"
        className={styles.sidebarIcon}
        key={SidebarToolstripCollection.BOOKMARKS}
        onClick={() => toggleModalView(SidebarToolstripCollection.BOOKMARKS)}
        image={bookmarkIcon}
      />
      <ImageButton
        status={Status.DISABLED}
        description="Share"
        className={styles.sidebarIcon}
        key="share"
        onClick={noop}
        image={shareIcon}
      />
      <ImageButton
        status={Status.DISABLED}
        description="Downloads"
        className={styles.sidebarIcon}
        key="downloads"
        onClick={noop}
        image={downloadIcon}
      />
    </>
  );
};


const mapStateToProps = (state: RootState) => ({
  isEntityViewerSidebarModalOpen: isEntityViewerSidebarModalOpen(state),
  isEntityViewerSidebarOpen: isEntityViewerSidebarOpen(state),
  sidebarModalView: getEntityViewerSidebarModalView(state)
});

const mapDispatchToProps = {
  closeSidebarModal,
  openSidebarModal,
  toggleSidebar
};

export default connect(mapStateToProps, mapDispatchToProps)(EntityViewerSidebarToolstrip);
