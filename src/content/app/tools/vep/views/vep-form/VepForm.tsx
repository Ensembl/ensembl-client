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

import { useEffect, useRef } from 'react';

import { useAppDispatch } from 'src/store';

import useVepFormConfig from './useVepFormConfig';

import { initialiseVepForm } from 'src/content/app/tools/vep/state/vep-form/vepFormSlice';

import {
  VepFormSpecies,
  VepSpeciesSelectorNavButton
} from './vep-form-species-section/VepFormSpeciesSection';
import VepFormVariantsSection from './vep-form-variants-section/VepFormVariantsSection';
import VepFormOptionsSection from './vep-form-options-section/VepFormOptionsSection';
import VepSubmissionName from './vep-submission-name/VepSubmissionName';
import FormSection from 'src/content/app/tools/vep/components/form-section/FormSection';
import VepFormResetButton from './vep-form-reset-button/VepFormResetButton';

import styles from './VepForm.module.css';

const VepForm = () => {
  useVepFormConfig();
  const dispatch = useAppDispatch();
  const isInitialisedRef = useRef(false);

  useEffect(() => {
    if (isInitialisedRef.current) {
      return;
    }
    dispatch(initialiseVepForm());
    isInitialisedRef.current = true;
  }, []);

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <div className={styles.topmostAreaGrid}>
          <VepSubmissionName />
          <VepFormResetButton className={styles.resetForm} />
        </div>

        <FormSection>
          <div className={styles.topFormSectionRegularGrid}>
            <div className={styles.topFormSectionName}>Species</div>
            <div className={styles.topFormSectionMain}>
              <VepFormSpecies />
            </div>
            <div className={styles.topFormSectionToggle}>
              <VepSpeciesSelectorNavButton />
            </div>
          </div>
        </FormSection>
        <VepFormVariantsSection />
        <VepFormOptionsSection />
      </div>
    </div>
  );
};

export default VepForm;
