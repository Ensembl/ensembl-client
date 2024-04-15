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
import { useNavigate } from 'react-router-dom';

import ModalView from 'src/shared/components/modal-view/ModalView';

import SelectedGenomesTable from './selected-genomes-table/SelectedGenomesTable';
import SpeciesLozengeDisplaySelector from 'src/content/app/species-selector/components/species-lozenge-display-selector/SpeciesLozengeDisplaySelector';

import styles from './SpeciesManager.module.css';

const SpeciesManager = () => {
  const navigate = useNavigate();

  const onClose = () => {
    navigate(-1);
  };

  return (
    <ModalView onClose={onClose}>
      <div className={styles.container}>
        <div>
          <SpeciesLozengeDisplaySelector />
        </div>
        <div>
          <SelectedGenomesTable />
        </div>
      </div>
    </ModalView>
  );
};

export default SpeciesManager;
