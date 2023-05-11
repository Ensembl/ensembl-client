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

import React, { useState } from 'react';

import VariantVCF from 'src/shared/components/variant-vcf/VariantVCF';

import * as variants from './variantVCFSampleData';

import styles from './VariantVCF.stories.scss';

const VariantVCFStory = () => {
  const [variantName, setVariantName] = useState('rs699');

  const variantData = variants[variantName as keyof typeof variants];

  return (
    <div>
      <div className={styles.container}>
        <VariantVCF variant={variantData} withCopy={true} />
      </div>
      <form className={styles.options}>
        <label>
          <input
            type="radio"
            checked={variantName === 'rs699'}
            onChange={() => setVariantName('rs699')}
          />
          rs699 (a SNP)
        </label>
        <label>
          <input
            type="radio"
            checked={variantName === 'rs71197234'}
            onChange={() => setVariantName('rs71197234')}
          />
          rs71197234 (an indel with many alleles)
        </label>
      </form>
    </div>
  );
};

export const ExportedVariantVCFStory = {
  name: 'default',
  render: () => <VariantVCFStory />
};

export default {
  title: 'Components/Variation/VariantVCF'
};
