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

import SpeciesSelectionControls from 'src/content/app/species/components/species-selection-controls/SpeciesSelectionControls';

import styles from './SpeciesMainView.scss';

const SpeciesMainViewTop = () => {
  const mockSpeciesIcon = (
    <div
      style={{
        height: '57px',
        width: '57px',
        background: '#d4d9de',
        display: 'inline-block',
        verticalAlign: 'middle',
        marginRight: '18px'
      }}
    />
  );

  return (
    <div className={styles.speciesMainViewTop}>
      <div className={styles.speciesLabelBlock}>
        {mockSpeciesIcon}
        Species name
      </div>
      <SpeciesSelectionControls />
    </div>
  );
};

export default SpeciesMainViewTop;
