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

import React, { FunctionComponent } from 'react';

import styles from '../Drawer.scss';

type ProteinCodingGenesProps = {
  forwardStrand: boolean;
};

const ProteinCodingGenes: FunctionComponent<ProteinCodingGenesProps> = (
  props: ProteinCodingGenesProps
) => {
  const { forwardStrand } = props;

  return (
    <div className={styles.drawerView}>
      <div className={styles.container}>
        <div className={styles.label}>Track name</div>
        <div className={styles.details}>
          <p>Protein coding genes</p>
        </div>

        <div className={styles.label}>Description</div>
        <div className={styles.details}>
          <p>
            <span className={styles.nextLine}>
              Shows all protein coding genes on the{' '}
              {forwardStrand ? 'forward' : 'reverse'} strand of this chromosome.
              Part of the GENCODE comprehensive gene set.
            </span>
            <a href="https://www.gencodegenes.org">
              https://www.gencodegenes.org/
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProteinCodingGenes;
