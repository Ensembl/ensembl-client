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

import React from 'react';

import VariantViewTab from './variant-view-tab/VariantViewTab';

import styles from './VariantViewNavigationPanel.module.css';

/**
 * TODO:
 * - Update styles of tab elements
 * - Update styles of info pill
 * - Use alt allele data for allele frequency
 */

const VariantViewNavigationPanel = () => {
  return (
    <div className={styles.grid}>
      <VariantViewTab
        viewId="default"
        tabText="Variant name"
        labelText="Protein altering variant"
        pressed={true}
      />
      <VariantViewTab
        viewId="transcript-consequences"
        tabText="Transcript consequences"
        labelText="Features"
        pillContent="0"
        pressed={false}
      />
      <VariantViewTab
        viewId="regulatory-consequences"
        tabText="Regulatory consequences"
        labelText="Features"
        pillContent="0"
        pressed={false}
        disabled={true}
      />
      <VariantViewTab
        viewId="allele-frequencies"
        tabText="Allele frequency"
        labelText="Features"
        pillContent="0"
        pressed={false}
      />
      <VariantViewTab
        viewId="genes"
        tabText="Genes"
        labelText="Features"
        pillContent="0"
        pressed={false}
      />
      <VariantViewTab
        viewId="variant-phenotypes"
        tabText="Variant phenotypes"
        labelText="Associations"
        pillContent="0"
        pressed={false}
      />
      <VariantViewTab
        viewId="gene-phenotypes"
        tabText="Gene phenotypes"
        labelText="Associations"
        pillContent="0"
        pressed={false}
      />
      <VariantViewTab
        viewId="publications"
        tabText="Citations"
        labelText="Publications"
        pillContent="0"
        pressed={false}
      />
      <VariantViewTab
        viewId="compara"
        tabText="Comparative genomic context"
        pressed={false}
        unavailable={true}
      />
    </div>
  );
};

export default VariantViewNavigationPanel;
