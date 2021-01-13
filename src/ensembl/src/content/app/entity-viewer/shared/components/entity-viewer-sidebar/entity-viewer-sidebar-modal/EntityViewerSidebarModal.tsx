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

import { getEntityViewerSidebarModalView } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';
import { closeSidebar } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarActions';

import EntityViewerSidebarSearch from './modal-views/EntityViewerSidebarSearch';
import EntityViewerSidebarBookmarks from './modal-views/EntityViewerSidebarBookmarks';

import EntityViewerSidebarShare from './modal-views/EntityViewerSidebarShare';
import EntityViewerSidebarDownloads from './modal-views/EntityViewerSidebarDownloads';
import CloseButton from 'src/shared/components/close-button/CloseButton';

import { RootState } from 'src/store';

import { SidebarToolstripCollection } from 'src/shared/types/sidebar-toolstrip-collection';
import styles from './EntityViewerSidebarModal.scss';

export type EntityViewerSidebarModalProps = {
  entityViewerSidebarModalView: string;
  closeSidebar: () => void;
};


const entityViewerSidebarModals: any = {
  [SidebarToolstripCollection.SEARCH]: < EntityViewerSidebarSearch />,
  [SidebarToolstripCollection.BOOKMARKS]: <EntityViewerSidebarBookmarks />,
  [SidebarToolstripCollection.SHARE]: <EntityViewerSidebarShare />,
  [SidebarToolstripCollection.DOWNLOADS]: <EntityViewerSidebarDownloads />
}

export const EntityViewerSidebarModal = (props: EntityViewerSidebarModalProps) => {
  const modalView = entityViewerSidebarModals[props.entityViewerSidebarModalView] || null;

  const onClose = () => {
    props.closeSidebar();
  };
  return (
    <section className={styles.EntityViewerSidebarModal}>
      <div className={styles.closeButton}>
        <CloseButton onClick={onClose} />
      </div>
      <div className={styles.EntityViewerSidebarModalView}>
        {modalView}
      </div>
    </section>
  );
};

const mapStateToProps = (state: RootState) => ({
  entityViewerSidebarModalView: getEntityViewerSidebarModalView(state)
});

const mapDispatchToProps = {
  closeSidebar
};

export default connect(mapStateToProps, mapDispatchToProps)(EntityViewerSidebarModal);
