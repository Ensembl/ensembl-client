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

import {
  VepFormSpecies,
  VepSpeciesSelectorNavButton
} from './vep-form-species-section/VepFormSpeciesSection';
import VepFormVariantsSection from './vep-form-variants-section/VepFormVariantsSection';
import VepFormOptionsSection from './vep-form-options-section/VepFormOptionsSection';
import FormSection from 'src/content/app/tools/vep/components/form-section/FormSection';
import ShadedInput from 'src/shared/components/input/ShadedInput';
import { DeleteButtonWithLabel } from 'src/shared/components/delete-button/DeleteButton';

import styles from './VepForm.module.css';

const VepForm = () => {
  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <div className={styles.topmostAreaGrid}>
          <div className={styles.submissionName}>
            <label>Submission name</label>
            <ShadedInput placeholder="Optional" />
          </div>
          <div className={styles.resetForm}>
            <DeleteButtonWithLabel label="Reset" disabled={true} />
          </div>
        </div>

        <FormSection>
          <div className={styles.topFormSectionRegularGrid}>
            <div className={styles.topFormSectionName}>Species</div>
            <VepFormSpecies className={styles.topFormSectionMain} />
            <VepSpeciesSelectorNavButton
              className={styles.topFormSectionToggle}
            />
          </div>
        </FormSection>
        <VepFormVariantsSection />
        <VepFormOptionsSection />
      </div>
    </div>
  );
};

export default VepForm;
