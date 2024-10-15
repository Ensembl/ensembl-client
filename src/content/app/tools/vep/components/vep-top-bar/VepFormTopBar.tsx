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

import noop from 'lodash/noop';

import { useAppSelector } from 'src/store';

import {
  getSelectedSpecies,
  getVepFormParameters
} from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';

import { useVepFormConfigQuery } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';

import ToolsTopBar from 'src/content/app/tools/shared/components/tools-top-bar/ToolsTopBar';
import SimpleSelect, {
  type Option
} from 'src/shared/components/simple-select/SimpleSelect';
import VepSubmitButton from '../vep-submit-button/VepSubmitButton';
import EnsemblVepLogo from './EnsemblVepLogo';
import EnsemblVepVersion from './EnsemblVepVersion';
import VepTopBarNavButtons from './VepTopBarNavButtons';

import styles from './VepTopBar.module.css';

const VepFormTopBar = () => {
  return (
    <ToolsTopBar>
      <div className={styles.vepFormGrid}>
        <EnsemblVepLogo />
        <div className={styles.runAJob}>Run a job</div>
        <div className={styles.transcriptSetAndSubmit}>
          <TranscriptSetSelector />
          <VepSubmitButton />
        </div>
        <EnsemblVepVersion />
        <VepTopBarNavButtons />
      </div>
    </ToolsTopBar>
  );
};

const TranscriptSetSelector = () => {
  const selectedSpecies = useAppSelector(getSelectedSpecies);
  const vepFormParameters = useAppSelector(getVepFormParameters);
  const { currentData: vepFormConfig } = useVepFormConfigQuery(
    {
      genome_id: selectedSpecies?.genome_id ?? ''
    },
    {
      skip: !selectedSpecies
    }
  );

  const canPopulateSelect = selectedSpecies && vepFormConfig;

  let options: Option[] = [];

  if (!canPopulateSelect) {
    options = [{ label: 'Select', value: 'none' }];
  } else {
    options = vepFormConfig.parameters.transcript_set.options;
  }

  const selectedValue = (vepFormParameters.transcript_set as string) ?? 'none';

  return (
    <div className={styles.transcriptSetWrapper}>
      <span>Transcript set</span>
      <SimpleSelect
        options={options}
        disabled={!canPopulateSelect}
        className={styles.transcriptSetSelector}
        value={selectedValue}
        onChange={noop}
      />
    </div>
  );
};

export default VepFormTopBar;
