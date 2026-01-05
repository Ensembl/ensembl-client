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

import { useAppSelector } from 'src/store';

import {
  getReferenceGenome,
  getAlternativeGenome,
  getReferenceGenomeLocation,
  getAlternativeGenomeLocation
} from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSelectors';

import { useGenomeKaryotypeQuery } from 'src/shared/state/genome/genomeApiSlice';

import StructuralVariantsImage from 'src/content/app/structural-variants/components/structural-variants-image/StructuralVariantsImage';
import StructuralVariantsNavButtons from 'src/content/app/structural-variants/components/structural-variants-nav-buttons/StructuralVariantsNavButtons';

import styles from './StructuralVariantsMain.module.css';

const StructuralVariantsMain = () => {
  const referenceGenome = useAppSelector(getReferenceGenome);
  const alternativeGenome = useAppSelector(getAlternativeGenome);
  const referenceGenomeLocation = useAppSelector(getReferenceGenomeLocation);
  const altGenomeLocation = useAppSelector(getAlternativeGenomeLocation);

  const { currentData: referenceGenomeKaryotype } = useGenomeKaryotypeQuery(
    referenceGenome?.genome_id ?? '',
    {
      skip: !referenceGenome
    }
  );

  const { currentData: altGenomeKaryotype } = useGenomeKaryotypeQuery(
    alternativeGenome?.genome_id ?? '',
    {
      skip: !referenceGenome
    }
  );

  const referenceRegionLength = referenceGenomeKaryotype?.find(
    (region) => region.name === referenceGenomeLocation?.regionName
  )?.length;
  const altRegionLength = altGenomeKaryotype?.find(
    (region) => region.name === referenceGenomeLocation?.regionName
  )?.length; // region name is the same between reference and alt genomes

  if (
    !referenceGenome ||
    !alternativeGenome ||
    !referenceGenomeLocation ||
    !referenceRegionLength ||
    !altRegionLength
  ) {
    return null;
  }

  return (
    <div className={styles.grid}>
      <div className={styles.imageControlsContainer}>
        <StructuralVariantsNavButtons
          referenceGenomeId={referenceGenome.genome_id}
          altGenomeId={alternativeGenome.genome_id}
          referenceGenomeLocation={referenceGenomeLocation}
          altGenomeLocation={altGenomeLocation}
          regionLength={referenceRegionLength}
          altRegionLength={altRegionLength}
        />
      </div>
      <div className={styles.imageContainer}>
        <StructuralVariantsImage
          referenceGenomeId={referenceGenome.genome_id}
          altGenomeId={alternativeGenome.genome_id}
          referenceGenomeLocation={referenceGenomeLocation}
          altGenomeLocation={altGenomeLocation}
          regionLength={referenceRegionLength}
          altRegionLength={altRegionLength}
        />
      </div>
    </div>
  );
};

export default StructuralVariantsMain;
