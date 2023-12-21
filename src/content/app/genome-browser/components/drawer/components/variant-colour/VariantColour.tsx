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
import classNames from 'classnames';

// QUESTION: should variantGroups be moved to a different directory? E.g. to genome-browser/constants?
import variantGroups from 'src/content/app/genome-browser/constants/variantGroups';

import styles from './VariantColour.module.css';

type Props = {
  variantType: string;
};

const VariantColour = (props: Props) => {
  const colourId = colourToIdMap.get(props.variantType);

  if (!colourId) {
    return null;
  }

  const elementClasses = classNames(
    styles.variantColour,
    styles[`colour${colourId}`]
  );

  return <div className={elementClasses} />;
};

const buildColourToIdMap = () => {
  const colourMap = new Map<string, number>();

  for (const group of variantGroups) {
    for (const variantType of group.variant_types) {
      colourMap.set(variantType.label, group.id);
    }
  }

  return colourMap;
};

const colourToIdMap = buildColourToIdMap();

export default VariantColour;
