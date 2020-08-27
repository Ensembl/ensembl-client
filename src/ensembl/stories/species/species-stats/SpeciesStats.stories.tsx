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
import { storiesOf } from '@storybook/react';

import SpeciesStats, {
  SpeciesStatsProps
} from 'src/content/app/species/components/species-stats/SpeciesStats';

import styles from './SpeciesStats.stories.scss';

const renderSpeciesStats = (props: SpeciesStatsProps) => {
  return <SpeciesStats {...props} />;
};

storiesOf('Components|Species/SpeciesStats', module).add('default', () => (
  <div className={styles.wrapper}>
    {renderSpeciesStats({
      label: 'Coding genes',
      primaryValue: '20,438',
      secondaryValue: '671',
      secondaryUnit: 'readthrough'
    })}
    {renderSpeciesStats({
      title: 'No. genes in',
      label: 'Biological process',
      primaryValue: '7,343',
      primaryUnit: 'xyz',
      secondaryValue: '1892',
      secondaryUnit: 'terms'
    })}
    {renderSpeciesStats({
      label: 'Transcriptomic data',
      primaryValue: '90%',
      link: <a href="/">View</a>
    })}
    {renderSpeciesStats({
      label: 'SNVs',
      labelHint: 'single nucleotide variants',
      primaryValue: '91%'
    })}
  </div>
));
