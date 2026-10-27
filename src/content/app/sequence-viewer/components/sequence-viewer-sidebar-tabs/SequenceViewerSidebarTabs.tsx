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

import classNames from 'classnames';

import { useAppSelector, useAppDispatch } from 'src/store';

import useSequenceViewerIds from 'src/content/app/sequence-viewer/hooks/useSequenceViewerIds';

import {
  getIsSidebarOpen,
  getSidebarView,
  getSidebarModalView
} from 'src/content/app/sequence-viewer/state/sidebar/sequenceViewerSidebarSelectors';

import {
  openSidebar,
  changeSidebarView,
  closeSidebarModal,
  type SidebarView
} from 'src/content/app/sequence-viewer/state/sidebar/sequenceViewerSidebarSlice';

import TextButton from 'src/shared/components/text-button/TextButton';

import styles from './SequenceViewerSidebarTabs.module.css';

const SequenceViewerSidebarTabs = () => {
  const { genomeId } = useSequenceViewerIds();
  const dispatch = useAppDispatch();
  const activeView = useAppSelector(getSidebarView);
  const isSidebarOpen = useAppSelector(getIsSidebarOpen);
  const sidebarModalView = useAppSelector((state) =>
    getSidebarModalView(state, genomeId ?? '')
  );

  const isSidebarModalOpen = sidebarModalView !== null;

  const onViewChange = (view: SidebarView) => {
    if (!genomeId) {
      // this should not happen
      return;
    }
    if (!isSidebarOpen) {
      dispatch(openSidebar());
    }
    if (isSidebarModalOpen) {
      dispatch(closeSidebarModal({ genomeId }));
    }

    dispatch(
      changeSidebarView({
        view
      })
    );
  };

  const isDefaultTabSelected = activeView === 'default';
  const isDefaultTabActive =
    isDefaultTabSelected && isSidebarOpen && !isSidebarModalOpen;
  const defaultTabClasses = classNames(styles.tab, {
    [styles.activeTab]: isDefaultTabActive
  });

  const isLegendTabSelected = activeView === 'legend';
  const isLegendTabActive =
    isLegendTabSelected && isSidebarOpen && !isSidebarModalOpen;
  const legendTabClasses = classNames(styles.tab, {
    [styles.activeTab]: isLegendTabActive
  });

  return (
    <div className={styles.container}>
      <TextButton
        onClick={() => onViewChange('default')}
        disabled={isDefaultTabActive}
        className={defaultTabClasses}
      >
        Configure
      </TextButton>
      <TextButton
        onClick={() => onViewChange('legend')}
        disabled={isLegendTabActive}
        className={legendTabClasses}
      >
        Key
      </TextButton>
    </div>
  );
};

export default SequenceViewerSidebarTabs;
