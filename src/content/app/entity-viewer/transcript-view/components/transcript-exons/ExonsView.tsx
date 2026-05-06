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

import useExonsData from './useExonsData';

import Panel from 'src/shared/components/panel/Panel';
import ExonsTable from './exons-table/ExonsTable';

import styles from './ExonsView.module.css';

// const HUMAN_GENOME = 'a7335667-93e7-11ec-a39d-005056b38ce3';
// const EXAMPLE_TRANSCRIPT_ID = 'ENST00000589042.5'; // One of the main transcripts of TTN, 109,224bp long

const ExonsView = ({
  genomeId,
  transcriptId
}: {
  genomeId: string;
  transcriptId: string;
}) => {
  const { data } = useExonsData({
    genomeId,
    transcriptId
  });

  if (!data) {
    return null; // FIXME: show spinner
  }

  const panelClasses = {
    body: styles.panelBody
  };

  return (
    <Panel classNames={panelClasses}>
      <ExonsTable exons={data.exons} />
    </Panel>
  );
};

export default ExonsView;
