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

import { use, Suspense } from 'react';

import useExonsData from './useExonsData';

import ExonsTable from './exons-table/ExonsTable';
import Panel from 'src/shared/components/panel/Panel';
import { CircleLoader } from 'src/shared/components/loader';

import styles from './ExonsView.module.css';

const ExonsView = ({
  genomeId,
  transcriptId
}: {
  genomeId: string;
  transcriptId: string;
}) => {
  const exonsDataPromise = useExonsData({
    genomeId,
    transcriptId
  });

  if (!exonsDataPromise) {
    return null;
  }

  const panelClasses = {
    panel: styles.panel,
    body: styles.panelBody,
    header: styles.panelHead
  };

  return (
    <Panel header={<PanelHeader />} classNames={panelClasses}>
      <Suspense fallback={<Loading />}>
        <PanelContent promise={exonsDataPromise} />
      </Suspense>
    </Panel>
  );
};

const PanelContent = ({
  promise
}: {
  promise: NonNullable<ReturnType<typeof useExonsData>>;
}) => {
  const { data, isError } = use(promise);

  if (isError) {
    return <p>An error occurred while fetching the data</p>;
  } else if (data) {
    return <ExonsTable data={data} />;
  }
};

const PanelHeader = () => {
  return <span className={styles.panelHeadTabActive}>Sequences</span>;
};

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <CircleLoader />
    </div>
  );
};

export default ExonsView;
