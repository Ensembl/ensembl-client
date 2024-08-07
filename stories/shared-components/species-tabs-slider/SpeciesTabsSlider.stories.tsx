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

import { useState } from 'react';

import SpeciesTabsSlider from 'src/shared/components/species-tabs-slider/SpeciesTabsSlider';
import SpeciesLozenge from 'src/shared/components/selected-species/SpeciesLozenge';
import WrapInRedux from '../../shared-components/species-lozenge/SpeciesLozengeReduxWrapper';

import speciesData from './speciesData';

import styles from './SpeciesTabsSlider.stories.module.css';

const SpeciesTabsSliderStory = () => {
  const [selectedSpeciesIndex, setSelectedSpeciesIndex] = useState<
    number | null
  >(null);

  const speciesLozenges = speciesData.map((item, index) => {
    return (
      <SpeciesLozenge
        key={index}
        theme={index === selectedSpeciesIndex ? 'black' : 'blue'}
        species={item}
        onClick={() => setSelectedSpeciesIndex(index)}
      />
    );
  });

  return (
    <WrapInRedux>
      <div className={styles.container}>
        <SpeciesTabsSlider>{speciesLozenges}</SpeciesTabsSlider>
      </div>
    </WrapInRedux>
  );
};

export const DefaultStory = {
  name: 'default',
  render: SpeciesTabsSliderStory
};

export default {
  title: 'Components/Shared Components/SpeciesTabsSlider'
};
