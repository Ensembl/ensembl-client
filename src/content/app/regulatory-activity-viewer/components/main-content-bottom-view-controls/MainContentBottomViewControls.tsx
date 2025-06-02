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

import type { ReactNode } from 'react';

import { useAppSelector, useAppDispatch } from 'src/store';

import { getMainContentBottomView } from 'src/content/app/regulatory-activity-viewer/state/ui/uiSelectors';
import {
  setMainContentBottomView,
  openEpigenomesSelector,
  setSidebarView,
  type MainContentBottomView
} from 'src/content/app/regulatory-activity-viewer/state/ui/uiSlice';

import { SecondaryButton } from 'src/shared/components/button/Button';
import ActivityViewerActionSelector from 'src/content/app/regulatory-activity-viewer/components/activity-viewer-actions-selector/ActivityViewerActionsSelector';
import EpigenomesTableToggle from 'src/content/app/regulatory-activity-viewer/components/epigenomes-activity/epigenomes-table/EpigenomesTableToggle';

import styles from './MainContentBottomViewControls.module.css';

type Props = {
  genomeId: string;
};

const MainContentBottomViewControls = (props: Props) => {
  const { genomeId } = props;
  return (
    <div className={styles.outerGrid}>
      <EpigenomesTableToggleContainer genomeId={genomeId} />
      <div className={styles.grid}>
        <ActivityViewerActionSelector />
        <ContentViewButtons genomeId={genomeId} />
      </div>
    </div>
  );
};

const ContentViewButtons = ({ genomeId }: { genomeId: string }) => {
  const activeView = useAppSelector((state) =>
    getMainContentBottomView(state, genomeId)
  );
  const dispatch = useAppDispatch();

  const changeView = (view: MainContentBottomView) => {
    dispatch(
      setMainContentBottomView({
        genomeId,
        view
      })
    );
  };

  const onConfigure = () => {
    dispatch(openEpigenomesSelector({ genomeId }));
    dispatch(
      setSidebarView({
        genomeId,
        view: 'epigenome-filters'
      })
    );
  };

  return (
    <div className={styles.viewButtons}>
      <ContentViewButton
        view="epigenomes-list"
        activeView={activeView}
        onClick={() => changeView('epigenomes-list')}
      >
        Table
      </ContentViewButton>

      <ContentViewButton
        view="dataviz"
        activeView={activeView}
        onClick={() => changeView('dataviz')}
      >
        Visualise
      </ContentViewButton>

      <SecondaryButton onClick={onConfigure}>Configure</SecondaryButton>
    </div>
  );
};

const ContentViewButton = ({
  view,
  activeView,
  children,
  onClick
}: {
  view: MainContentBottomView;
  activeView: MainContentBottomView;
  onClick: () => void;
  children: ReactNode;
}) => {
  const isActive = view === activeView;

  const buttonClassName = isActive ? styles.viewButtonActive : undefined;

  return (
    <SecondaryButton
      className={buttonClassName}
      onClick={onClick}
      disabled={isActive}
    >
      {children}
    </SecondaryButton>
  );
};

const EpigenomesTableToggleContainer = ({ genomeId }: { genomeId: string }) => {
  const activeView = useAppSelector((state) =>
    getMainContentBottomView(state, genomeId)
  );

  if (activeView !== 'dataviz') {
    return null;
  }

  return <EpigenomesTableToggle className={styles.epigenomesTableToggle} />;
};

export default MainContentBottomViewControls;
