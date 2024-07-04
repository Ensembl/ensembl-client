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

import { getVepFormInputCommittedFlag } from 'src/content/app/tools/vep/state/vep-form/vepFormSelectors';

import { useVepFormConfigQuery } from 'src/content/app/tools/vep/state/vep-api/vepApiSlice';

import FormSection from 'src/content/app/tools/vep/components/form-section/FormSection';
import VepFormGeneOptions from './vep-form-gene-options/VepFormGeneOptions';

import styles from './VepFormOptionsSection.module.css';

const VepFormOptionsSection = () => {
  const isVariantsInputCommitted = useAppSelector(getVepFormInputCommittedFlag);

  // FIXME: remember that useVepFormConfigQuery will need a genome id when request is sent to backend for real
  const { currentData: formConfig } = useVepFormConfigQuery();

  if (!isVariantsInputCommitted || !formConfig) {
    // TODO: handle the loading state?
    return null;
  }

  // FIXME: just for development; remember to remove
  // if (!formConfig) {
  //   return null;
  // }

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
  return <div className={styles.sectionHeader}>Job options</div>;
};

export default VepFormOptionsSection;
