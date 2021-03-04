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
import { useSelector, useDispatch } from 'react-redux';

import SidebarModalDownloads from './modal-views/SidebarModalDownloads';
import CloseButton from 'src/shared/components/close-button/CloseButton';

import { getSelectedEntityViewerSidebarModalView } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';
import { closeSidebarModal } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarActions';
import { SidebarModalView } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarState';

import styles from './EntityViewerSidebarModal.scss';

export const EntityViewerSidebarModal = () => {
  const selectedSidebarModalView = useSelector(
    getSelectedEntityViewerSidebarModalView
  );
  const dispatch = useDispatch();

  const getModalView = () => {
    switch (selectedSidebarModalView) {
      case SidebarModalView.DOWNLOADS:
        return <SidebarModalDownloads />;
      default:
        return null;
    }
  };

  const onClose = () => {
    dispatch(closeSidebarModal());
  };

  return (
    <section className={styles.sidebarModal}>
      <div className={styles.closeButton}>
        <CloseButton onClick={onClose} />
      </div>
      <div className={styles.sidebarModalView}>{getModalView()}</div>
    </section>
  );
};

export default EntityViewerSidebarModal;
