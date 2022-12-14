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

import { getCommaSeparatedNumber } from 'src/shared/helpers/formatters/numberFormatter';

import { useAppSelector } from 'src/store';
import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';
import { getActualChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import styles from './BrowserLocationIndicator.scss';

export const BrowserLocationIndicator = () => {
  const actualChrLocation = useAppSelector(getActualChrLocation);
  const activeGenomeId = useAppSelector(getBrowserActiveGenomeId) as string;

  const { data: genomeKaryotype } = useGenomeKaryotypeQuery(activeGenomeId);

  const [chrCode, chrStart, chrEnd] = actualChrLocation || [];

  if (!chrCode || !chrStart || !chrEnd || !activeGenomeId) {
    return null;
  }

  const activeChromosome = genomeKaryotype?.find((karyotype) => {
    return karyotype.name === chrCode;
  });

  return (
    <div className={styles.browserLocationIndicator}>
      <div className={styles.chrLabel}>Chromosome</div>
      <div className={styles.chrLocationView}>
        {activeChromosome?.is_circular ? (
          <CircularChromosomeIndicator />
        ) : (
          <div className={styles.chrCode}>{chrCode}</div>
        )}
        <div className={styles.chrRegion}>
          <span>{getCommaSeparatedNumber(chrStart as number)}</span>
          <span className={styles.chrSeparator}>-</span>
          <span>{getCommaSeparatedNumber(chrEnd as number)}</span>
        </div>
      </div>
    </div>
  );
};

const CircularChromosomeIndicator = () => {
  return <div className={styles.circularIndicator}></div>;
};

export default BrowserLocationIndicator;
