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

import VariantColour from 'src/shared/components/variant-color/VariantColor';

import styles from './VariantConsequence.module.css';

/**
 * The purpose of this component is to combine a string representation of a variant consequence
 * with its color representation.
 */

/**
 * TODO:
 * Currently, this component currently has the same name as a component in the genome browser drawer
 * (src/content/app/genome-browser/components/drawer/drawer-views/variant-summary/variant-consequence/VariantConsequence.tsx).
 * The purpose of that other component was to display the most significant consequence of a variant.
 * It should probably be renamed to MostSignificantVariantConsequence, or something...
 */

type Props = {
  consequence: string;
  className?: string;
};

const VariantConsequence = (props: Props) => {
  const { consequence } = props;

  return (
    <div className={styles.container}>
      <VariantColour variantType={consequence} />
      <span>{consequence}</span>
    </div>
  );
};

export default VariantConsequence;
