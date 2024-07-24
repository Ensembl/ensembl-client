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

import { SpeciesName } from 'src/shared/components/species-name/SpeciesName';

import { humanGenome } from 'src/shared/components/species-name/fixtures/speciesTestData';

import styles from './SpeciesName.stories.module.css';

export default {
  title: 'Components/Shared Components/SpeciesName'
};

const SpeciesNameFormatting = () => {
  return (
    <div className={styles.wrapper}>
      <h1>The different display options for the species name</h1>

      <h2>1. Common name and assembly name</h2>

      <div className={styles.innerWrapper}>
        <SpeciesName
          speciesNameDisplayOption="common-name_assembly-name"
          species={humanGenome}
        />
        <span>For species with a common name</span>
      </div>

      <div className={styles.innerWrapper}>
        <SpeciesName
          speciesNameDisplayOption="common-name_assembly-name"
          species={{ ...humanGenome, common_name: null }}
        />
        <span>
          For species without a common name (falls back to scientific name)
        </span>
      </div>

      <h2>2. Scientific name and assembly name</h2>

      <div className={styles.innerWrapper}>
        <SpeciesName
          speciesNameDisplayOption="scientific-name_assembly-name"
          species={humanGenome}
        />
        <span>
          A genome always has a species scientific name and an assembly name
        </span>
      </div>

      <h2>3. Common name, type, and assembly name</h2>

      <div className={styles.innerWrapper}>
        <SpeciesName
          speciesNameDisplayOption="common-name_type_assembly-name"
          species={humanGenome}
        />
        <span>
          For genome that both has a type, and is a reference assembly
        </span>
      </div>

      <div className={styles.innerWrapper}>
        <SpeciesName
          speciesNameDisplayOption="common-name_type_assembly-name"
          species={{ ...humanGenome, is_reference: false }}
        />
        <span>For genome that has a type, but is not a reference assembly</span>
      </div>

      <div className={styles.innerWrapper}>
        <SpeciesName
          speciesNameDisplayOption="common-name_type_assembly-name"
          species={{ ...humanGenome, type: null }}
        />
        <span>
          For genome that does not have a type, but is a reference assembly
        </span>
      </div>

      <h2>4. Scientific name, type, and assembly name</h2>

      <div className={styles.innerWrapper}>
        <SpeciesName
          speciesNameDisplayOption="scientific-name_type_assembly-name"
          species={humanGenome}
        />
        <span>For a genome that has a type and is a reference assembly</span>
      </div>

      <h2>5. Only assembly accession id</h2>

      <div className={styles.innerWrapper}>
        <SpeciesName
          speciesNameDisplayOption="assembly-accession-id"
          species={humanGenome}
        />
        <span>A genome always has an accession id</span>
      </div>
    </div>
  );
};

export const SpeciesNameStory = {
  name: 'default',
  render: () => <SpeciesNameFormatting />
};
