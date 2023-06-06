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

import regulationLegends from 'src/content/app/genome-browser/constants/regulationLegends';

import type { RegulationLegendView } from 'src/content/app/genome-browser/state/drawer/types';

import styles from './RegulationLegend.scss';
import classNames from 'classnames';

type Props = {
  drawerView: RegulationLegendView;
};

const RegulationLegend = (props: Props) => {
  const activeLegend = regulationLegends.find(
    ({ label }) => label === props.drawerView.group
  );

  const groupColorMarkerClass = classNames(
    styles.colourMarker,
    styles[`regulationColour${activeLegend?.id}`]
  );

  if (!activeLegend) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div>
        <span className={groupColorMarkerClass} />
        <span className={styles.labelTextStrong}>{activeLegend.label}</span>
      </div>
    </div>
  );
};

export default RegulationLegend;
