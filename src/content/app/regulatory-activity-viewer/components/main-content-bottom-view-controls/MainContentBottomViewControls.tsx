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

import { getFormattedLocation } from 'src/shared/helpers/formatters/regionFormatter';

import { getMainContentBottomView } from 'src/content/app/regulatory-activity-viewer/state/ui/uiSelectors';
import {
  setMainContentBottomView,
  setSidebarView,
  type MainContentBottomView
} from 'src/content/app/regulatory-activity-viewer/state/ui/uiSlice';

import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';
import useEpigenomes from 'src/content/app/regulatory-activity-viewer/hooks/useEpigenomes';

import { SecondaryButton } from 'src/shared/components/button/Button';
import EpigenomesTableToggle from 'src/content/app/regulatory-activity-viewer/components/epigenomes-activity/epigenomes-table/EpigenomesTableToggle';

import type { GenomicLocation } from 'src/shared/helpers/genomicLocationHelpers';

import styles from './MainContentBottomViewControls.module.css';

const MainContentBottomViewControls = () => {
  const { genomeId, location } = useActivityViewerIds();
  const { sortedCombinedEpigenomes } = useEpigenomes();

  if (!genomeId) {
    return null;
  }

  return (
    <div className={styles.outerGrid}>
      <EpigenomesTableToggleContainer genomeId={genomeId} />
      <div className={styles.innerGrid}>
        <div className={styles.innerInfoArea}>
          <SectionTitleAndLocation>
            <SectionTitle />
            <Location location={location} />
          </SectionTitleAndLocation>
          <AssayTargetLabel />
        </div>
        <div className={styles.innerControlsArea}>
          <ContentViewButtons genomeId={genomeId} />
        </div>
      </div>
      <div className={styles.rightColumn}>
        <EpigenomesCount epigenomes={sortedCombinedEpigenomes || []} />
      </div>
    </div>
  );
};

const SectionTitleAndLocation = (props: { children: ReactNode }) => {
  // just a wrapper that positions section title relative to location

  return <div className={styles.sectionTitleAndLocation}>{props.children}</div>;
};

const SectionTitle = () => {
  return <span className={styles.sectionTitle}>Region activity</span>;
};

const Location = ({ location }: { location: GenomicLocation | null }) => {
  if (!location) {
    return null;
  }

  const formattedLocationString = getFormattedLocation({
    chromosome: location.regionName,
    start: location.start,
    end: location.end
  });

  return <span>{formattedLocationString}</span>;
};

const AssayTargetLabel = () => {
  return (
    <div className={styles.assayTargetLabel}>
      <span className={styles.light}>Assay target</span>
      <span>Open chromatin</span>
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

  const openConfigurationView = () => {
    dispatch(
      setSidebarView({
        genomeId,
        view: 'configuration'
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
        Epigenomes
      </ContentViewButton>

      <ContentViewButton
        view="dataviz"
        activeView={activeView}
        onClick={() => changeView('dataviz')}
      >
        Visualise
      </ContentViewButton>

      <SecondaryButton onClick={openConfigurationView}>
        Configure
      </SecondaryButton>
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

const EpigenomesCount = ({ epigenomes }: { epigenomes: unknown[] }) => {
  const count = epigenomes.length;

  return (
    <div>
      <span className={styles.strong}>{count}</span> epigenomes
    </div>
  );
};

export default MainContentBottomViewControls;
