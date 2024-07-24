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

import SpeciesLozenge from 'src/shared/components/selected-species/SpeciesLozenge';
import WrapInRedux from './SpeciesLozengeReduxWrapper';

import { humanGenome } from 'src/shared/components/species-name/fixtures/speciesTestData';

import styles from './SpeciesLozenge.stories.module.css';

export default {
  title: 'Components/Shared Components/SpeciesLozenge'
};

const SpeciesLozengeThemes = () => {
  const species = humanGenome;
  const displayOption = 'common-name_assembly-name';
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.innerWrapper}>
          <WrapInRedux speciesNameDisplayOption={displayOption}>
            <SpeciesLozenge theme="blue" species={species} />
          </WrapInRedux>
          <span>blue theme</span>
        </div>

        <div className={styles.innerWrapper}>
          <WrapInRedux speciesNameDisplayOption={displayOption}>
            <SpeciesLozenge theme="black" species={species} />
          </WrapInRedux>
          <span>black theme</span>
        </div>

        <div className={styles.innerWrapper}>
          <WrapInRedux speciesNameDisplayOption={displayOption}>
            <SpeciesLozenge theme="grey" species={species} />
          </WrapInRedux>
          <span>grey theme</span>
        </div>

        <div className={styles.innerWrapper}>
          <WrapInRedux speciesNameDisplayOption={displayOption}>
            <SpeciesLozenge theme="red" species={species} />
          </WrapInRedux>
          <span>red theme</span>
        </div>
      </div>
      <p>
        If a lozenge is disabled, the cursor hovering over it will not change
        its shape:
      </p>
      <div>
        <WrapInRedux speciesNameDisplayOption={displayOption}>
          <SpeciesLozenge theme="grey" species={species} disabled={true} />
        </WrapInRedux>
      </div>
    </>
  );
};

const SpeciesLozengeContentFormatting = () => {
  return (
    <div className={styles.wrapper}>
      <p>The different display options of species lozenge</p>

      <p>1. Common name and assembly name</p>

      <div className={styles.innerWrapper}>
        <WrapInRedux speciesNameDisplayOption="common-name_assembly-name">
          <SpeciesLozenge theme="blue" species={humanGenome} />
        </WrapInRedux>
        <span>For species with a common name</span>
      </div>

      <div className={styles.innerWrapper}>
        <WrapInRedux speciesNameDisplayOption="common-name_assembly-name">
          <SpeciesLozenge
            theme="blue"
            species={{ ...humanGenome, common_name: null }}
          />
        </WrapInRedux>
        <span>
          For species without a common name (falls back to scientific name)
        </span>
      </div>

      <p>2. Scientific name and assembly name</p>

      <div className={styles.innerWrapper}>
        <WrapInRedux speciesNameDisplayOption="scientific-name_assembly-name">
          <SpeciesLozenge theme="blue" species={humanGenome} />
        </WrapInRedux>
        <span>
          A genome always has a species scientific name and an assembly name
        </span>
      </div>

      <p>3. Common name, type, and assembly name</p>

      <div className={styles.innerWrapper}>
        <WrapInRedux speciesNameDisplayOption="common-name_type_assembly-name">
          <SpeciesLozenge theme="blue" species={humanGenome} />
        </WrapInRedux>
        <span>
          For genome that both has a type, and is a reference assembly
        </span>
      </div>

      <div className={styles.innerWrapper}>
        <WrapInRedux speciesNameDisplayOption="common-name_type_assembly-name">
          <SpeciesLozenge
            theme="blue"
            species={{ ...humanGenome, is_reference: false }}
          />
        </WrapInRedux>
        <span>For genome that has a type, but is not a reference assembly</span>
      </div>

      <div className={styles.innerWrapper}>
        <WrapInRedux speciesNameDisplayOption="common-name_type_assembly-name">
          <SpeciesLozenge
            theme="blue"
            species={{ ...humanGenome, type: null }}
          />
        </WrapInRedux>
        <span>
          For genome that does not have a type, but is a reference assembly
        </span>
      </div>

      <p>4. Scientific name, type, and assembly name</p>

      <div className={styles.innerWrapper}>
        <WrapInRedux speciesNameDisplayOption="scientific-name_type_assembly-name">
          <SpeciesLozenge theme="blue" species={humanGenome} />
        </WrapInRedux>
        <span>For a genome that has a type and is a reference assembly</span>
      </div>

      <p>5. Only assembly accession id</p>

      <div className={styles.innerWrapper}>
        <WrapInRedux speciesNameDisplayOption="assembly-accession-id">
          <SpeciesLozenge theme="blue" species={humanGenome} />
        </WrapInRedux>
        <span>A genome always has an accession id</span>
      </div>
    </div>
  );
};

export const SpeciesLozengeThemesStory = {
  name: 'Themes',
  render: () => <SpeciesLozengeThemes />
};

export const SpeciesLozengeContentFormattingStory = {
  name: 'Content formatting',
  render: () => <SpeciesLozengeContentFormatting />
};
