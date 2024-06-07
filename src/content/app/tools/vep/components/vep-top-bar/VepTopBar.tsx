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

import ToolsTopBar from 'src/content/app/tools/shared/components/tools-top-bar/ToolsTopBar';
import { PrimaryButton } from 'src/shared/components/button/Button';
import Logotype from 'static/img/brand/logotype.svg';
import SimpleSelect from 'src/shared/components/simple-select/SimpleSelect';
import ButtonLink from 'src/shared/components/button-link/ButtonLink';

import logoUrl from 'static/img/tools/vep/ensembl-vep.svg?url';

import styles from './VepTopBar.module.css';

const VepTopBar = () => {
  return (
    <ToolsTopBar>
      <div className={styles.grid}>
        <img src={logoUrl} alt="Ensembl VEP logo" className={styles.logo} />
        <div className={styles.runAJob}>Run a job</div>
        <div className={styles.transcriptSet}>
          Transcript set
          <SimpleSelect
            options={[{ label: 'Select', value: 'none' }]}
            disabled={true}
            className={styles.transcriptSetSelector}
          />
        </div>
        <PrimaryButton disabled={true}>Run</PrimaryButton>
        <div className={styles.vepVersion}>
          <Logotype />
          <span>Variant effect predictor </span>
          v111
        </div>
        <div className={styles.jobListsNavigation}>
          <ButtonLink to="" isDisabled={true}>
            Unviewed jobs
          </ButtonLink>
          <ButtonLink to="" isDisabled={true}>
            Jobs list
          </ButtonLink>
        </div>
      </div>
    </ToolsTopBar>
  );
};

export default VepTopBar;
