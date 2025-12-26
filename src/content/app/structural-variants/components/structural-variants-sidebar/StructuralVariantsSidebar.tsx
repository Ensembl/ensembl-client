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

import AlignmentsLegend from './alignments-legend/AlignmentsLegend';
import VariantsLegend from './variants-legend/VariantsLegend';

import styles from './StructuralVariantsSidebar.module.css';

const StructuralVariantsSidebar = () => {
  return (
    <div className={styles.container}>
      <AlignmentsLegend />
      <VariantsLegend />
    </div>
  );
};

export default StructuralVariantsSidebar;
