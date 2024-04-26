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

import type { ComponentProps } from 'react';

import { SpeciesType, SpeciesReference } from '../species-name-parts';

type Props = ComponentProps<typeof SpeciesType> &
  ComponentProps<typeof SpeciesReference>;

/**
 * In a table, species type column typically combines the type information (strain/cultivar/etc)
 * with whether this assembly is the reference.
 * If no type information is available and the assembly is not the reference one,
 * we typically display a "-".
 */

const SpeciesTypeForTable = (props: Props) => {
  const { is_reference, type: speciesType } = props;

  if (!is_reference && !speciesType) {
    return <SpeciesType {...props} fallback="-" />;
  } else if (is_reference && !speciesType) {
    return <SpeciesReference {...props} />;
  } else if (!is_reference && speciesType) {
    return <SpeciesType {...props} />;
  } else {
    // has the type information, and is reference assembly
    return (
      <span>
        <SpeciesType {...props} />
        {', '}
        <SpeciesReference {...props} />
      </span>
    );
  }
};

export default SpeciesTypeForTable;
