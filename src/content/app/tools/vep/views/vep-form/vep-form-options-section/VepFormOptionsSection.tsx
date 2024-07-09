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

import { useAppSelector } from 'src/store';

import {
  getSelectedSpecies,
  getVepFormInputCommittedFlag
} from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';

import { useVepFormConfigQuery } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';

import FormSection from 'src/content/app/tools/vep/components/form-section/FormSection';
import VepFormGeneOptions from './vep-form-gene-options/VepFormGeneOptions';
import {
  PseudoRadioButton,
  PseudoRadioButtonGroup
} from 'src/shared/components/pseudo-radio-button';
import { CircleLoader } from 'src/shared/components/loader';

import styles from './VepFormOptionsSection.module.css';

const VepFormOptionsSection = () => {
  const selectedSpecies = useAppSelector(getSelectedSpecies);
  const isVariantsInputCommitted = useAppSelector(getVepFormInputCommittedFlag);

  const { currentData: formConfig, isFetching } = useVepFormConfigQuery(
    {
      genome_id: selectedSpecies?.genome_id ?? ''
    },
    {
      skip: !selectedSpecies
    }
  );

  if (isFetching) {
    return (
      <div className={styles.container}>
        <CircleLoader />
      </div>
    );
  }

  if (!isVariantsInputCommitted || !formConfig) {
    // TODO: should we handle the error state somehow?
    return null;
  }

  return (
    <div className={styles.container}>
      <SectionHeader />
      <VepFormGeneOptions config={formConfig} />
      <FormSection>
        <div className={styles.sectionTitleContainer}>
          <span className={styles.disabledSectionTitle}>
            Protein & functional
          </span>
        </div>
      </FormSection>
      <FormSection>
        <div className={styles.sectionTitleContainer}>
          <span className={styles.disabledSectionTitle}>Predictions</span>
        </div>
      </FormSection>
      <FormSection>
        <div className={styles.sectionTitleContainer}>
          <span className={styles.disabledSectionTitle}>
            Variant population frequencies
          </span>
        </div>
      </FormSection>
      <FormSection>
        <div className={styles.sectionTitleContainer}>
          <span className={styles.disabledSectionTitle}>
            Variant phenotypes
          </span>
        </div>
      </FormSection>
      <FormSection>
        <div className={styles.sectionTitleContainer}>
          <span className={styles.disabledSectionTitle}>Variant citations</span>
        </div>
      </FormSection>
      <FormSection>
        <div className={styles.sectionTitleContainer}>
          <span className={styles.disabledSectionTitle}>
            Regulatory annotation
          </span>
        </div>
      </FormSection>
      <FormSection>
        <div className={styles.sectionTitleContainer}>
          <span className={styles.disabledSectionTitle}>
            Conservation & constraint
          </span>
        </div>
      </FormSection>
    </div>
  );
};

const SectionHeader = () => {
  return (
    <div className={styles.sectionHeader}>
      <span>Job options</span>
      <PseudoRadioButtonGroup>
        <PseudoRadioButton label="Short variants" />
        <PseudoRadioButton label="Structural variants" disabled={true} />
      </PseudoRadioButtonGroup>
    </div>
  );
};

export default VepFormOptionsSection;
