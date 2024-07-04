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

import classNames from 'classnames';

import variantGroups from 'src/content/app/genome-browser/constants/variantGroups';

import styles from './VariantColor.module.css';

type Props = {
  variantType: string;
};

const VariantColor = (props: Props) => {
  const colorId = colorToIdMap.get(props.variantType);

  if (!colorId) {
    return null;
  }

  const elementClasses = classNames(
    styles.variantColor,
    styles[`color${colorId}`]
  );

  return <div className={elementClasses} />;
};

const buildColorToIdMap = () => {
  const colorMap = new Map<string, number>();

  for (const group of variantGroups) {
    for (const variantType of group.variant_types) {
      colorMap.set(variantType.label, group.id);
    }
  }

  return colorMap;
};

const colorToIdMap = buildColorToIdMap();

export default VariantColor;