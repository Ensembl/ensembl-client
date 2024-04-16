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

import React, { type ComponentProps } from 'react';
import classNames from 'classnames';

import { AssemblyAccessionId } from '../species-name-parts';

import styles from './SpeciesNamePartsForTable.module.css';

type Props = ComponentProps<typeof AssemblyAccessionId>;

/**
 * In a table, assembly accession id is typically rendered with a light font.
 */

const SpeciesAssemblyIdForTable = (props: Props) => {
  const { className: classNameFromProps } = props;

  const componentClasses = classNames(
    styles.assemblyAccessionId,
    classNameFromProps
  );

  return <AssemblyAccessionId {...props} className={componentClasses} />;
};

export default SpeciesAssemblyIdForTable;
