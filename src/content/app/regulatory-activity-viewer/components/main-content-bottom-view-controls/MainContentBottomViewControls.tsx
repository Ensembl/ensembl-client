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
  type MainContentBottomView
} from 'src/content/app/regulatory-activity-viewer/state/ui/uiSlice';

import { SecondaryButton } from 'src/shared/components/button/Button';
import ActivityViewerActionSelector from 'src/content/app/regulatory-activity-viewer/components/activity-viewer-actions-selector/ActivityViewerActionsSelector';

import styles from './MainContentBottomViewControls.module.css';

type Props = {
  genomeId: string;
};

const MainContentBottomViewControls = (props: Props) => {
  const { genomeId } = props;
  return (
    <div className={styles.outerGrid}>
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

  return (
    <div className={styles.viewButtons}>
      <ContentViewButton
        view="epigenomes-list"
        activeView={activeView}
        genomeId={genomeId}
      >
        Epigenomes
      </ContentViewButton>

      <ContentViewButton
        view="epigenomes-selection"
        activeView={activeView}
        genomeId={genomeId}
      >
        Configure
      </ContentViewButton>

      <ContentViewButton
        view="dataviz"
        activeView={activeView}
        genomeId={genomeId}
      >
        Visualise
      </ContentViewButton>
    </div>
  );
};

const ContentViewButton = ({
  genomeId,
  view,
  activeView,
  children
}: {
  genomeId: string;
  view: MainContentBottomView;
  activeView: MainContentBottomView;
  children: ReactNode;
}) => {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(
      setMainContentBottomView({
        genomeId,
        view
      })
    );
  };

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

export default MainContentBottomViewControls;
