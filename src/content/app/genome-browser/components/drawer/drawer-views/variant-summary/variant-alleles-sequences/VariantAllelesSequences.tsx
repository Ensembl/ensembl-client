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

/**
 * NOTE:
 * - This component almost certainly will have to become a shared component
 * - This component will need to learn how to display allele sequences when there are multiple alleles,
 *   and when the sequences are fairly long.
 *   See examples:
 *   - https://xd.adobe.com/view/b485e6c9-546a-4627-a5a6-0edf77651f09-e1d6/screen/b361e528-9700-4f70-b89d-becf43df5cd9?fullscreen
 *   - https://xd.adobe.com/view/b485e6c9-546a-4627-a5a6-0edf77651f09-e1d6/screen/0e50458c-ae71-40b1-adb1-2fe9b022cea6?fullscreen
 *      (especially the drawer)
 */

type Props = {
  alleles: {
    allele_sequence: string;
    reference_sequence: string;
  }[];
};

// NOTE: the logic of this component will need to be significantly improved to handle multiple and/or longer sequences
const VariantAllelesSequences = (props: Props) => {
  const referenceSequence = props.alleles[0].reference_sequence;
  const alleleSequences = props.alleles.map(
    ({ allele_sequence }) => allele_sequence
  );

  const combinedString = `${referenceSequence}/${alleleSequences.join('/')}`; // this should work for 2-3 alleles of regular SNPs

  return <span>{combinedString}</span>;
};

export default VariantAllelesSequences;
