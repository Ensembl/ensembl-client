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

import { getDisplayStableId } from 'src/shared/state/ens-object/ensObjectHelpers';

import { EnsObjectGene } from 'src/shared/state/ens-object/ensObjectTypes';

import styles from '../Drawer.scss';

type DrawerGeneProps = {
  ensObject: EnsObjectGene;
};

const DrawerGene: FunctionComponent<DrawerGeneProps> = (
  props: DrawerGeneProps
) => {
  const { ensObject } = props;

  return (
    <div className={styles.drawerView}>
      <div className={styles.container}>
        <div className={styles.label}>Gene</div>
        <div className={styles.details}>
          <span className={styles.mainDetail}>{ensObject.label}</span>
        </div>

        <div className={styles.label}>Stable ID</div>
        <div className={styles.details}>{getDisplayStableId(ensObject)}</div>

        <div className={styles.label}>Description</div>
        <div className={styles.details}>{ensObject.description || '--'}</div>
      </div>
    </div>
  );
};

export default DrawerGene;
