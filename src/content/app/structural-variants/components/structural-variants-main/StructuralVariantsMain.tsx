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
  getReferenceLocation
} from 'src/content/app/structural-variants/state/general/structuralVariantsGeneralSelectors';

import StructuralVariantsImage from 'src/content/app/structural-variants/components/structural-variants-image/StructuralVariantsImage';

const StructuralVariantsMain = () => {
  const referenceGenome = useAppSelector(getReferenceGenome);
  const alternativeGenome = useAppSelector(getAlternativeGenome);
  const referenceGenomeLocation = useAppSelector(getReferenceLocation);

  if (!referenceGenome || !alternativeGenome || !referenceGenomeLocation) {
    return <div>Please make a selection</div>;
  }

  return (
    <StructuralVariantsImage
      referenceGenomeId={referenceGenome.genome_id}
      altGenomeId={alternativeGenome.genome_id}
      referenceGenomeLocation={referenceGenomeLocation}
    />
  );
};

export default StructuralVariantsMain;
